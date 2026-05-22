import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://cexobjjpknssdrleuixx.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY env var first.');
  console.error('Find it at: Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

const sql = readFileSync('seed-demo-data.sql', 'utf8');

// Split on the step comments to get individual chunks
const chunks = sql.split(/\n-- ={10,}\n/).filter(c => c.trim());

// Actually, just run the whole thing at once via the SQL endpoint
async function run() {
  console.log(`Running seed SQL (${sql.length} chars)...`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  // The REST API doesn't support raw SQL. Use the management API instead.
  // Let's use the pg endpoint directly.

  const pgRes = await fetch(`${SUPABASE_URL}/pg`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  console.log('Status:', pgRes.status);
  const text = await pgRes.text();
  console.log('Response:', text.substring(0, 500));
}

run().catch(console.error);
