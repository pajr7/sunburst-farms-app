/* Sample-content mode.
 *
 * When on, every data call in database.ts is answered from the fixtures
 * below instead of Supabase. Nothing is written to the database. Writes
 * (posting, messaging, RSVPs) change the in-memory copy only, so the
 * flows can be reviewed end to end, and reset on reload.
 *
 * Every person and business here is fictional.
 */

const KEY = "sbfe-demo";
const ME_KEY = "sbfe-demo-me";

export function isDemo(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setDemo(on: boolean) {
  try {
    if (on) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {}
}

export function setDemoMe(id: string, name?: string, initials?: string) {
  try {
    localStorage.setItem(ME_KEY, JSON.stringify({ id, name, initials }));
  } catch {}
}

function me(): { id: string; name: string; initials: string } {
  try {
    const raw = localStorage.getItem(ME_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return { id: p.id, name: p.name ?? "You", initials: p.initials ?? "ME" };
    }
  } catch {}
  return { id: "me", name: "You", initials: "ME" };
}

/* ---------- Fixtures ---------- */

// A few on-topic photos (Unsplash) and reliable placeholders for the rest (Lorem Picsum).
const UNSPLASH: Record<string, string> = {
  "eggs,carton": "photo-1569288052389-dac9b01c9c05",
  "grapefruit,tree": "photo-1582979512210-99b6a53386f9",
  "orange,cat": "photo-1574158622682-e40e69881006",
  "sunflower,bouquet": "photo-1597848212624-a19eb35e2651",
  "raised,garden": "photo-1416879595882-3373a0480b5b",
  "oak,chair": "photo-1503602642458-232111445657",
  "potluck,picnic": "photo-1529543544282-ea669407fca3",
};
const photo = (tag: string, lock: number, w = 900, h = 650) =>
  UNSPLASH[tag] ? `https://images.unsplash.com/${UNSPLASH[tag]}?w=${w}&h=${h}&fit=crop` : `https://picsum.photos/seed/${encodeURIComponent(tag)}-${lock}/${w}/${h}`;
const face = (n: number) => `https://i.pravatar.cc/150?img=${n}`;
const logo = (name: string, bg: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=128&bold=true&font-size=0.4`;

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
const daysFromNow = (d: number) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

export interface DemoProfile {
  id: string;
  name: string;
  address: string;
  section: string;
  avatar_initials: string;
  avatar_url?: string;
  status: "approved" | "pending" | "denied";
  role: "member" | "admin";
  show_address: boolean;
  created_at: string;
  proof_image_url?: string | null;
}

const P = (id: string, name: string, section: string, address: string, img: number, show = false): DemoProfile => ({
  id,
  name,
  address,
  section,
  avatar_initials: name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
  avatar_url: face(img),
  status: "approved",
  role: "member",
  show_address: show,
  created_at: hoursAgo(24 * 200),
});

export const PROFILES: DemoProfile[] = [
  P("u1", "Maria Gonzalez", "Section 3", "5219 E Sweetwater Ave", 47, true),
  P("u2", "Dave Reiter", "Section 2", "5044 E Cactus Rd", 12),
  P("u3", "Jake Morrison", "Section 4", "5533 E Thunderbird Rd", 59),
  P("u4", "Sarah Blackwood", "Section 7", "5410 E Sunnyside Dr", 32, true),
  P("u5", "Patty Nguyen", "Section 3", "5260 E Paradise Ln", 5),
  P("u6", "Tom Chen", "Section 2", "5102 E Charter Oak Rd", 60),
  P("u7", "Anne Fischer", "Section 4", "5588 E Hearn Rd", 44, true),
  P("u8", "Luis Ortega", "Section 7", "5430 E Acoma Dr", 68),
  P("u9", "Barbara Whitfield", "Section 3", "5251 E Sweetwater Ave", 20),
  P("u10", "Greg Hamilton", "Section 2", "5080 E Cactus Rd", 53),
  P("u11", "Priya Desai", "Section 4", "5561 E Thunderbird Rd", 25, true),
  P("u12", "Walt Benson", "Section 7", "5405 E Sunnyside Dr", 15),
];
PROFILES[9].role = "admin";

const pending: DemoProfile[] = [
  { ...P("p1", "Kevin Marsh", "Section 2", "5120 E Charter Oak Rd", 33), status: "pending", created_at: hoursAgo(30), proof_image_url: photo("document", 71, 600, 800) },
  { ...P("p2", "Dana Whitlock", "Section 7", "5444 E Acoma Dr", 41), status: "pending", created_at: hoursAgo(6), proof_image_url: null },
];

const by = (id: string) => {
  const p = PROFILES.find((x) => x.id === id)!;
  return { id: p.id, name: p.name, avatar_initials: p.avatar_initials, avatar_url: p.avatar_url, address: p.address, section: p.section, show_address: p.show_address };
};

interface Post {
  id: string;
  author_id: string;
  category: string;
  title: string;
  body: string;
  image_url: string | null;
  claimed_by: string | null;
  created_at: string;
  likes: { user_id: string }[];
  comments: { id: string }[];
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
}

let posts: Post[] = [
  { id: "post1", author_id: "u2", category: "safety", title: "Coyote on the south bridle path this morning", body: "Saw a big coyote near the south bridle path around 6am, headed west toward 52nd. Keep an eye on small dogs and chickens today.", image_url: null, claimed_by: null, created_at: hoursAgo(1), likes: [{ user_id: "u1" }, { user_id: "u3" }, { user_id: "u5" }, { user_id: "u9" }], comments: [{ id: "c1" }, { id: "c2" }] },
  { id: "post2", author_id: "u1", category: "eggs", title: "Two dozen fresh eggs on the porch", body: "Our girls were busy this week. Two dozen brown eggs in the blue cooler on the front porch, $5 a dozen or trade for citrus. First come first served.", image_url: photo("eggs,carton", 11), claimed_by: null, created_at: hoursAgo(3), likes: [{ user_id: "u4" }, { user_id: "u6" }], comments: [{ id: "c3" }] },
  { id: "post3", author_id: "u4", category: "lost_found", title: "Lost: orange tabby cat, answers to Mango", body: "Mango slipped out last night near 54th and Sweetwater. Very friendly, no collar, white chest. Please message me if you see him.", image_url: photo("orange,cat", 12), claimed_by: null, created_at: hoursAgo(5), likes: [{ user_id: "u1" }, { user_id: "u2" }, { user_id: "u7" }, { user_id: "u8" }, { user_id: "u11" }], comments: [{ id: "c4" }, { id: "c5" }, { id: "c6" }] },
  { id: "post4", author_id: "u3", category: "tools", title: "Post hole digger available to borrow", body: "Just finished my fence. Happy to lend the post hole digger and a 6 foot level this week. Section 4, pickup from the side gate.", image_url: null, claimed_by: null, created_at: hoursAgo(8), likes: [{ user_id: "u6" }], comments: [] },
  { id: "post5", author_id: "u5", category: "recommendation", title: "Great experience with Saguaro Pool Care", body: "They fixed our pump the same day I called and charged exactly what they quoted. Carlos even showed me how to backwash the filter. Highly recommend.", image_url: null, claimed_by: null, created_at: hoursAgo(14), likes: [{ user_id: "u1" }, { user_id: "u9" }, { user_id: "u10" }], comments: [{ id: "c7" }] },
  { id: "post6", author_id: "u6", category: "produce", title: "Grapefruit by the bag, come and get it", body: "The tree went nuts again. Bags by the gate on Charter Oak all week. Take as many as you want, please.", image_url: photo("grapefruit,tree", 13), claimed_by: null, created_at: hoursAgo(20), likes: [{ user_id: "u2" }, { user_id: "u4" }, { user_id: "u5" }, { user_id: "u7" }, { user_id: "u12" }], comments: [{ id: "c8" }, { id: "c9" }] },
  { id: "post7", author_id: "u7", category: "help", title: "Need a hand moving a couch Saturday morning", body: "Two people, 20 minutes, from the garage to the living room. Coffee and donuts on me. Around 9am if anyone is free.", image_url: null, claimed_by: null, created_at: hoursAgo(26), likes: [{ user_id: "u3" }], comments: [{ id: "c10" }, { id: "c11" }] },
  { id: "post8", author_id: "u9", category: "flowers", title: "Sunflower bouquets, free", body: "Cut a dozen this morning. Wrapped and on the porch table. Take one for your kitchen.", image_url: photo("sunflower,bouquet", 14), claimed_by: "u9", created_at: hoursAgo(40), likes: [{ user_id: "u1" }, { user_id: "u5" }, { user_id: "u11" }], comments: [{ id: "c12" }] },
  { id: "post9", author_id: "u8", category: "general", title: "Anyone else lose power last night around 11?", body: "Ours blinked twice then went out for about 20 minutes on Acoma. APS said it was a tripped feeder. Just checking it wasn't only us.", image_url: null, claimed_by: null, created_at: hoursAgo(50), likes: [{ user_id: "u10" }, { user_id: "u12" }], comments: [{ id: "c13" }, { id: "c14" }, { id: "c15" }] },
  { id: "post10", author_id: "u11", category: "seeds", title: "Heirloom tomato starts, 12 left", body: "Brandywine and Cherokee Purple in 4 inch pots. Free to a good garden. Front table on Thunderbird.", image_url: photo("tomato,seedling", 15), claimed_by: null, created_at: hoursAgo(70), likes: [{ user_id: "u1" }, { user_id: "u6" }], comments: [] },
  { id: "post11", author_id: "u10", category: "general", title: "Bulk trash is this week, bins out by Monday night", body: "Reminder from the board: bulk pickup starts Tuesday on the east side. Keep piles clear of the irrigation valves.", image_url: null, claimed_by: null, created_at: hoursAgo(90), likes: [{ user_id: "u2" }, { user_id: "u3" }, { user_id: "u4" }, { user_id: "u8" }], comments: [{ id: "c16" }] },
  { id: "post12", author_id: "u12", category: "free", title: "Free: kids bike, 20 inch, needs a tube", body: "Outgrown. Blue, decent shape, back tire needs a tube. On the driveway at Sunnyside.", image_url: photo("kids,bicycle", 16), claimed_by: null, created_at: hoursAgo(120), likes: [], comments: [] },
];

let comments: Comment[] = [
  { id: "c1", post_id: "post1", author_id: "u1", body: "Thanks Dave. Bringing the chickens in early today.", created_at: hoursAgo(0.8) },
  { id: "c2", post_id: "post1", author_id: "u9", body: "Saw the same one by the wash on Sunday evening.", created_at: hoursAgo(0.5) },
  { id: "c3", post_id: "post2", author_id: "u4", body: "Grabbing a dozen on my way home!", created_at: hoursAgo(2) },
  { id: "c4", post_id: "post3", author_id: "u2", body: "Will keep an eye out on Cactus. Is he chipped?", created_at: hoursAgo(4) },
  { id: "c5", post_id: "post3", author_id: "u4", body: "Yes, chipped. Thank you!", created_at: hoursAgo(3.8) },
  { id: "c6", post_id: "post3", author_id: "u11", body: "Possible sighting near 55th and Sweetwater around 7am, orange cat under a truck.", created_at: hoursAgo(1.5) },
  { id: "c7", post_id: "post5", author_id: "u10", body: "Same here, they've done our pool for years.", created_at: hoursAgo(12) },
  { id: "c8", post_id: "post6", author_id: "u5", body: "Took two bags, making marmalade. Thanks Tom!", created_at: hoursAgo(18) },
  { id: "c9", post_id: "post6", author_id: "u12", body: "Grabbed one. Delicious.", created_at: hoursAgo(10) },
  { id: "c10", post_id: "post7", author_id: "u3", body: "I can be there at 9.", created_at: hoursAgo(25) },
  { id: "c11", post_id: "post7", author_id: "u8", body: "Count me in too.", created_at: hoursAgo(24) },
  { id: "c12", post_id: "post8", author_id: "u1", body: "Beautiful, took one. Thank you Barbara.", created_at: hoursAgo(38) },
  { id: "c13", post_id: "post9", author_id: "u10", body: "Same on Cactus. Back on by 11:30.", created_at: hoursAgo(49) },
  { id: "c14", post_id: "post9", author_id: "u2", body: "Yep, whole section 2.", created_at: hoursAgo(48) },
  { id: "c15", post_id: "post9", author_id: "u8", body: "Good to know, thanks all.", created_at: hoursAgo(47) },
  { id: "c16", post_id: "post11", author_id: "u7", body: "Thanks for the reminder.", created_at: hoursAgo(88) },
];

interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number | null;
  is_free: boolean;
  condition: string;
  category: string;
  image_url: string | null;
  status: "available" | "pending" | "sold";
  created_at: string;
  listing_images: { id: string; image_url: string; position: number }[];
}

const L = (id: string, seller: string, title: string, price: number | null, category: string, condition: string, description: string, imgs: [string, number][], hours: number, status: Listing["status"] = "available"): Listing => ({
  id,
  seller_id: seller,
  title,
  description,
  price,
  is_free: price === null,
  condition,
  category,
  image_url: imgs[0] ? photo(imgs[0][0], imgs[0][1], 900, 900) : null,
  status,
  created_at: hoursAgo(hours),
  listing_images: imgs.map(([tag, lock], i) => ({ id: `${id}-${i}`, image_url: photo(tag, lock, 900, 900), position: i })),
});

let listings: Listing[] = [
  L("l1", "u3", "Western saddle, 16 inch seat", 450, "equestrian", "good", "Circle Y trail saddle, 16 inch. Some wear on the fenders, tree is solid. Comes with cinch and pad.", [["saddle,horse", 21], ["western,saddle", 22]], 4),
  L("l2", "u7", "Raised garden beds, set of two", 150, "home_garden", "like_new", "Cedar, 4x8 each, one season old. You haul. Perfect for winter greens.", [["raised,garden", 23]], 9),
  L("l3", "u6", "Oak dining chairs, set of four", null, "furniture", "good", "Solid oak, sturdy. One has a small scratch on the seat. Free to whoever can pick up this weekend.", [["oak,chair", 24], ["dining,chairs", 25]], 15, "pending"),
  L("l4", "u2", "Honda self-propelled mower", 175, "home_garden", "good", "Runs great, new blade this spring. Selling because we switched to desert landscaping.", [["lawn,mower", 26]], 22),
  L("l5", "u12", "Kids 20 inch bike", 40, "other", "fair", "Blue Schwinn, needs a rear tube. Otherwise fine.", [["kids,bike", 27]], 30),
  L("l6", "u8", "Utility trailer, 5x8", 900, "vehicles", "good", "Single axle, new lights and tires last year. Clean title.", [["utility,trailer", 28], ["trailer,hitch", 29]], 48),
  L("l7", "u9", "Patio set, table and 4 chairs", 120, "furniture", "good", "Powder coated steel, cushions included. Been under the ramada so not faded.", [["patio,furniture", 30]], 60),
  L("l8", "u5", "Chicken coop, holds 6", 200, "other", "like_new", "Built it last year, moving to a bigger run. 4x6 with nesting boxes and a hardware cloth floor.", [["chicken,coop", 31], ["backyard,chickens", 32]], 80),
  L("l9", "u11", "iPad 9th gen, 64GB", 180, "electronics", "like_new", "Barely used, comes with a case. Factory reset.", [["ipad,tablet", 33]], 100),
  L("l10", "u1", "Horse trailer, 2 horse straight load", 3200, "equestrian", "fair", "1998 WW, floor is solid, needs paint. Lights work.", [["horse,trailer", 34]], 130, "sold"),
];

interface Event {
  id: string;
  author_id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url: string | null;
  created_at: string;
  rsvps: { user_id: string }[];
}

let events: Event[] = [
  { id: "e1", author_id: "u10", title: "Community Potluck at Sereno Park", description: "Bring a dish to share. Burgers and drinks provided by the board. Kids welcome, bring lawn chairs and sunscreen.", event_date: daysFromNow(5), event_time: "17:00", location: "Sereno Park ramada", image_url: photo("potluck,picnic", 41, 1200, 700), created_at: hoursAgo(120), rsvps: ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u9", "u11", "u12"].map((u) => ({ user_id: u })) },
  { id: "e2", author_id: "u3", title: "Saturday Morning Trail Ride", description: "Casual group ride along the bridle paths. All experience levels. Meet at the arena by 6:45, we leave at 7 sharp.", event_date: daysFromNow(9), event_time: "07:00", location: "Horse arena on 56th", image_url: photo("horse,trail", 42, 1200, 700), created_at: hoursAgo(90), rsvps: ["u1", "u4", "u8"].map((u) => ({ user_id: u })) },
  { id: "e3", author_id: "u10", title: "Board Meeting", description: "Monthly board meeting. Agenda: winter irrigation schedule, bridle path repairs, 2027 budget first look. Residents welcome.", event_date: daysFromNow(12), event_time: "18:30", location: "Community center", image_url: null, created_at: hoursAgo(70), rsvps: ["u2", "u9"].map((u) => ({ user_id: u })) },
  { id: "e4", author_id: "u5", title: "Neighborhood Seed Swap", description: "Bring saved seeds, cuttings, and starter plants. Trade for next season's garden. Coffee provided.", event_date: daysFromNow(19), event_time: "09:00", location: "Sonrisa Park", image_url: photo("seeds,garden", 43, 1200, 700), created_at: hoursAgo(40), rsvps: ["u1", "u6", "u7", "u11", "u12"].map((u) => ({ user_id: u })) },
  { id: "e5", author_id: "u7", title: "Garage Sale Weekend", description: "Section 4 group garage sale. Put a balloon on your mailbox if you're participating.", event_date: daysFromNow(26), event_time: "07:00", location: "Section 4, multiple homes", image_url: photo("garage,sale", 44, 1200, 700), created_at: hoursAgo(20), rsvps: ["u3", "u11"].map((u) => ({ user_id: u })) },
];

let eventPhotos: { id: string; event_id: string; user_id: string; image_url: string; created_at: string }[] = [
  { id: "ep1", event_id: "e1", user_id: "u1", image_url: photo("picnic,table", 51, 800, 800), created_at: hoursAgo(300) },
  { id: "ep2", event_id: "e1", user_id: "u4", image_url: photo("bbq,grill", 52, 800, 800), created_at: hoursAgo(299) },
  { id: "ep3", event_id: "e1", user_id: "u9", image_url: photo("neighbors,party", 53, 800, 800), created_at: hoursAgo(298) },
];

interface Vendor {
  id: string;
  business_name: string;
  category: string;
  phone: string;
  description: string | null;
  email: string | null;
  website: string | null;
  image_url: string | null;
  logo_url?: string;
  tier: "free" | "featured";
  status: "approved" | "pending" | "denied";
  recommended_by: string;
  created_at: string;
  recommender: { name: string };
}

const V = (id: string, name: string, category: string, phone: string, description: string, rec: string, opts: Partial<Vendor> = {}): Vendor => ({
  id,
  business_name: name,
  category,
  phone,
  description,
  email: null,
  website: null,
  image_url: opts.image_url ?? null,
  logo_url: logo(name, ['2f5a44','1d4ed8','b45309','7c3aed','0f766e','be123c','4d7c0f','0369a1'][id.length % 8]),
  tier: "free",
  status: "approved",
  recommended_by: rec,
  created_at: hoursAgo(500),
  recommender: { name: PROFILES.find((p) => p.id === rec)?.name ?? "A neighbor" },
  ...opts,
});

let vendors: Vendor[] = [
  V("v1", "Saguaro Pool Care", "pool", "(480) 555-0141", "Weekly service, pump and filter repair. Same-day calls most of the year.", "u5", { tier: "featured", image_url: photo("swimming,pool", 61, 1200, 600), website: "saguaropoolcare.example", email: "hello@saguaropoolcare.example" }),
  V("v2", "Desert Sun Landscaping", "landscaping", "(480) 555-0177", "Irrigation lines, gravel, tree trimming. Knows the SBFE flood irrigation setup.", "u1", { tier: "featured", image_url: photo("desert,landscaping", 62, 1200, 600), website: "desertsunlandscape.example" }),
  V("v3", "Cactus Rd Plumbing", "plumbing", "(602) 555-0112", "Fixed our slab leak in a day. Fair pricing, cleaned up after.", "u2", { email: "office@cactusrdplumbing.example" }),
  V("v4", "Hearn Electric", "electrical", "(602) 555-0198", "Panel upgrades and ceiling fans. Licensed, showed up on time.", "u7"),
  V("v5", "Arcadia Cooling & Heating", "hvac", "(480) 555-0166", "Replaced our unit in August. Honest about what we did and didn't need.", "u9", { website: "arcadiacooling.example" }),
  V("v6", "Thunderbird Handyman", "handyman", "(480) 555-0133", "Drywall, doors, fence repair. Small jobs welcome.", "u4"),
  V("v7", "Sonoran Pest Solutions", "pest_control", "(602) 555-0155", "Scorpion sealing and monthly service. Pet safe products.", "u11"),
  V("v8", "Paradise Tree Service", "tree_service", "(480) 555-0129", "Took down a dead mesquite safely over the barn. Insured.", "u3"),
  V("v9", "Bridle Path Fencing", "fencing", "(602) 555-0188", "Horse fencing and gates. Did the arena fence on 56th.", "u8"),
  V("v10", "Sunnyside Cleaning Co.", "cleaning", "(480) 555-0102", "Biweekly house cleaning. Same two people every time.", "u12"),
  V("v11", "Mesa View Roofing", "roofing", "(602) 555-0171", "Tile repair after the monsoon. Fast quote.", "u6"),
  V("v12", "Copper State Garage Doors", "garage_doors", "(480) 555-0190", "Spring replacement, opener install.", "u10"),
];

let pendingVendors: Vendor[] = [
  { ...V("pv1", "Camelback Painting", "painting", "(602) 555-0144", "Interior and exterior, two coats, clean lines.", "u11"), status: "pending", created_at: hoursAgo(20), email: "camelbackpainting@example.com" },
];

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  read: boolean;
  created_at: string;
}

let messages: Message[] = [];
function seedMessages(meId: string) {
  if (messages.length) return;
  messages = [
    { id: "m1", sender_id: "u1", recipient_id: meId, body: "Hi! About your post “Post hole digger”: could I borrow it Thursday?", read: true, created_at: hoursAgo(30) },
    { id: "m2", sender_id: meId, recipient_id: "u1", body: "Sure, it's by the side gate. Grab it any time after 4.", read: true, created_at: hoursAgo(29) },
    { id: "m3", sender_id: "u1", recipient_id: meId, body: "Perfect, thank you! I'll bring it back Saturday.", read: false, created_at: hoursAgo(2) },
    { id: "m4", sender_id: "u4", recipient_id: meId, body: "Any chance you saw Mango near your place? Orange tabby.", read: false, created_at: hoursAgo(4) },
    { id: "m5", sender_id: meId, recipient_id: "u6", body: "Hi! About your listing “Oak dining chairs”: are they still available?", read: true, created_at: hoursAgo(26) },
    { id: "m6", sender_id: "u6", recipient_id: meId, body: "Someone's picking them up Saturday, but I'll let you know if that falls through.", read: true, created_at: hoursAgo(25) },
    { id: "m7", sender_id: "u10", recipient_id: meId, body: "Thanks for volunteering for the potluck setup. Can you be at the ramada by 4?", read: true, created_at: hoursAgo(50) },
    { id: "m8", sender_id: meId, recipient_id: "u10", body: "Yes, see you there.", read: true, created_at: hoursAgo(49) },
  ];
}

interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  read: boolean;
  related_post_id: string | null;
  related_event_id: string | null;
  created_at: string;
}

let notifications: Notification[] = [];
function seedNotifications(meId: string) {
  if (notifications.length) return;
  notifications = [
    { id: "n1", user_id: meId, type: "irrigation", message: "Irrigation update: Estimated Thu, Nov 6 to Sat, Nov 8", read: false, related_post_id: null, related_event_id: null, created_at: hoursAgo(1.5) },
    { id: "n2", user_id: meId, type: "comment", message: "Maria Gonzalez replied to your post “Post hole digger available to borrow”", read: false, related_post_id: "post4", related_event_id: null, created_at: hoursAgo(3) },
    { id: "n3", user_id: meId, type: "event", message: "Community Potluck at Sereno Park is in 5 days. 10 neighbors going.", read: false, related_post_id: null, related_event_id: "e1", created_at: hoursAgo(10) },
    { id: "n4", user_id: meId, type: "claim", message: "Tom Chen is interested in your listing “Patio set, table and 4 chairs”", read: true, related_post_id: null, related_event_id: null, created_at: hoursAgo(28) },
    { id: "n5", user_id: meId, type: "announcement", message: "Board: bulk trash pickup starts Tuesday on the east side.", read: true, related_post_id: "post11", related_event_id: null, created_at: hoursAgo(90) },
    { id: "n6", user_id: meId, type: "welcome", message: "Welcome to Sunburst Farms East! Start by sharing something with your neighbors.", read: true, related_post_id: null, related_event_id: null, created_at: hoursAgo(400) },
  ];
}

interface Irrigation {
  id: string;
  author_id: string;
  status: "awaiting" | "estimated" | "confirmed" | "delayed";
  window_start: string | null;
  window_end: string | null;
  note: string | null;
  created_at: string;
  author: { name: string };
}

let irrigation: Irrigation[] = [
  { id: "ir1", author_id: "u10", status: "estimated", window_start: daysFromNow(4), window_end: daysFromNow(6), note: "SRP says the canal is back on schedule after last week's rain. Gates open at 6am, east side first.", created_at: hoursAgo(1.5), author: { name: "Greg Hamilton" } },
  { id: "ir2", author_id: "u10", status: "confirmed", window_start: daysFromNow(-17), window_end: daysFromNow(-16), note: null, created_at: hoursAgo(24 * 20), author: { name: "Greg Hamilton" } },
  { id: "ir3", author_id: "u10", status: "delayed", window_start: daysFromNow(-38), window_end: daysFromNow(-37), note: "Pushed one day because of the canal maintenance on Cactus.", created_at: hoursAgo(24 * 40), author: { name: "Greg Hamilton" } },
];

/* ---------- Helpers ---------- */

const uid = () => `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const wait = <T,>(v: T): Promise<T> => new Promise((r) => setTimeout(() => r(v), 120));

function withAuthor<T extends { author_id: string }>(x: T) {
  const m = me();
  const author = x.author_id === m.id ? { id: m.id, name: m.name, avatar_initials: m.initials, avatar_url: undefined, address: "", section: "Section 3", show_address: false } : by(x.author_id);
  return { ...x, author };
}

/* ---------- Store API (mirrors database.ts) ---------- */

export const demo = {
  async uploadImage(file: File) {
    return wait(URL.createObjectURL(file));
  },

  async getPosts(category?: string) {
    const list = posts.filter((p) => !category || p.category === category).map(withAuthor);
    return wait(list.sort((a, b) => b.created_at.localeCompare(a.created_at)));
  },
  async getPost(id: string) {
    const p = posts.find((x) => x.id === id);
    if (!p) throw new Error("not found");
    return wait(withAuthor(p));
  },
  async createPost(authorId: string, category: string, title: string, body: string, imageUrl?: string) {
    const p: Post = { id: uid(), author_id: authorId, category, title, body, image_url: imageUrl ?? null, claimed_by: null, created_at: new Date().toISOString(), likes: [], comments: [] };
    posts = [p, ...posts];
    return wait(p);
  },
  async toggleLike(postId: string, userId: string) {
    const p = posts.find((x) => x.id === postId);
    if (!p) return false;
    const has = p.likes.some((l) => l.user_id === userId);
    p.likes = has ? p.likes.filter((l) => l.user_id !== userId) : [...p.likes, { user_id: userId }];
    return wait(!has);
  },
  async markPostClaimed(postId: string, authorId: string, claimed: boolean) {
    const p = posts.find((x) => x.id === postId);
    if (p) p.claimed_by = claimed ? authorId : null;
    return wait(undefined);
  },
  async deletePost(postId: string) {
    posts = posts.filter((x) => x.id !== postId);
    return wait(undefined);
  },
  async getComments(postId: string) {
    return wait(comments.filter((c) => c.post_id === postId).map(withAuthor));
  },
  async addComment(postId: string, authorId: string, body: string) {
    const c: Comment = { id: uid(), post_id: postId, author_id: authorId, body, created_at: new Date().toISOString() };
    comments = [...comments, c];
    const p = posts.find((x) => x.id === postId);
    if (p) p.comments = [...p.comments, { id: c.id }];
    return wait(c);
  },

  async getEvents() {
    const today = new Date().toISOString().slice(0, 10);
    return wait(events.filter((e) => e.event_date >= today).sort((a, b) => a.event_date.localeCompare(b.event_date)).map(withAuthor));
  },
  async getEvent(id: string) {
    const e = events.find((x) => x.id === id);
    if (!e) throw new Error("not found");
    const m = me();
    return wait({
      ...withAuthor(e),
      rsvps: e.rsvps.map((r) => ({ user_id: r.user_id, profiles: r.user_id === m.id ? { name: m.name, avatar_initials: m.initials } : { name: by(r.user_id).name, avatar_initials: by(r.user_id).avatar_initials, avatar_url: by(r.user_id).avatar_url } })),
    });
  },
  async createEvent(authorId: string, title: string, description: string, eventDate: string, eventTime: string, location: string, imageUrl?: string) {
    const e: Event = { id: uid(), author_id: authorId, title, description, event_date: eventDate, event_time: eventTime, location, image_url: imageUrl ?? null, created_at: new Date().toISOString(), rsvps: [] };
    events = [...events, e];
    return wait(e);
  },
  async toggleRsvp(eventId: string, userId: string) {
    const e = events.find((x) => x.id === eventId);
    if (!e) return false;
    const has = e.rsvps.some((r) => r.user_id === userId);
    e.rsvps = has ? e.rsvps.filter((r) => r.user_id !== userId) : [...e.rsvps, { user_id: userId }];
    return wait(!has);
  },
  async deleteEvent(eventId: string) {
    events = events.filter((x) => x.id !== eventId);
    return wait(undefined);
  },
  async getEventPhotos(eventId: string) {
    return wait(eventPhotos.filter((p) => p.event_id === eventId).map((p) => ({ ...p, uploader: { name: by(p.user_id).name, avatar_initials: by(p.user_id).avatar_initials } })));
  },
  async addEventPhoto(eventId: string, userId: string, imageUrl: string) {
    const p = { id: uid(), event_id: eventId, user_id: userId, image_url: imageUrl, created_at: new Date().toISOString() };
    eventPhotos = [p, ...eventPhotos];
    return wait({ ...p, uploader: { name: me().name, avatar_initials: me().initials } });
  },
  async deleteEventPhoto(photoId: string) {
    eventPhotos = eventPhotos.filter((p) => p.id !== photoId);
    return wait(undefined);
  },

  async getListings(category?: string) {
    const m = me();
    return wait(
      listings
        .filter((l) => l.status === "available" && (!category || l.category === category))
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((l) => ({ ...l, seller: l.seller_id === m.id ? { id: m.id, name: m.name, avatar_initials: m.initials, section: "Section 3" } : by(l.seller_id) })),
    );
  },
  async getListing(id: string) {
    const l = listings.find((x) => x.id === id);
    if (!l) throw new Error("not found");
    const m = me();
    return wait({ ...l, seller: l.seller_id === m.id ? { id: m.id, name: m.name, avatar_initials: m.initials, section: "Section 3" } : by(l.seller_id) });
  },
  async getMyListings(sellerId: string) {
    const mine = listings.filter((l) => l.seller_id === sellerId);
    // Give the reviewer a couple of their own to manage
    if (mine.length === 0) {
      listings = listings.map((l) => (l.id === "l7" || l.id === "l9" ? { ...l, seller_id: sellerId } : l));
    }
    return wait(listings.filter((l) => l.seller_id === sellerId));
  },
  async createListing(sellerId: string, title: string, description: string, category: string, condition: string, price: number | null, isFree: boolean, imageUrls?: string[]) {
    const l: Listing = {
      id: uid(),
      seller_id: sellerId,
      title,
      description,
      price,
      is_free: isFree,
      condition,
      category,
      image_url: imageUrls?.[0] ?? null,
      status: "available",
      created_at: new Date().toISOString(),
      listing_images: (imageUrls ?? []).map((u, i) => ({ id: uid(), image_url: u, position: i })),
    };
    listings = [l, ...listings];
    return wait(l);
  },
  async updateListingStatus(id: string, status: Listing["status"]) {
    const l = listings.find((x) => x.id === id);
    if (l) l.status = status;
    return wait(undefined);
  },
  async deleteListing(id: string) {
    listings = listings.filter((x) => x.id !== id);
    return wait(undefined);
  },

  async getConversations(userId: string) {
    seedMessages(userId);
    const map = new Map<string, any>();
    for (const msg of [...messages].sort((a, b) => b.created_at.localeCompare(a.created_at))) {
      const otherId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
      const other = by(otherId);
      if (!map.has(otherId)) {
        map.set(otherId, {
          otherUser: { id: other.id, name: other.name, avatarInitials: other.avatar_initials, avatarUrl: other.avatar_url, section: other.section },
          lastMessage: msg.body,
          lastMessageAt: msg.created_at,
          unreadCount: msg.recipient_id === userId && !msg.read ? 1 : 0,
        });
      } else if (msg.recipient_id === userId && !msg.read) map.get(otherId).unreadCount++;
    }
    return wait(Array.from(map.values()));
  },
  async getMessages(userId: string, otherId: string) {
    seedMessages(userId);
    return wait(messages.filter((m) => (m.sender_id === userId && m.recipient_id === otherId) || (m.sender_id === otherId && m.recipient_id === userId)).sort((a, b) => a.created_at.localeCompare(b.created_at)));
  },
  async sendMessage(senderId: string, recipientId: string, body: string) {
    const m: Message = { id: uid(), sender_id: senderId, recipient_id: recipientId, body, read: false, created_at: new Date().toISOString() };
    messages = [...messages, m];
    return wait(m);
  },
  async markMessagesRead(userId: string, otherId: string) {
    messages = messages.map((m) => (m.sender_id === otherId && m.recipient_id === userId ? { ...m, read: true } : m));
    return wait(undefined);
  },

  async getNotifications(userId: string) {
    seedNotifications(userId);
    return wait([...notifications].sort((a, b) => b.created_at.localeCompare(a.created_at)));
  },
  async markNotificationRead(id: string) {
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    return wait(undefined);
  },
  async getUnreadCounts(userId: string) {
    seedMessages(userId);
    seedNotifications(userId);
    return wait({ messages: messages.filter((m) => m.recipient_id === userId && !m.read).length, notifications: notifications.filter((n) => !n.read).length });
  },

  async getProfile(id: string) {
    const m = me();
    if (id === m.id) return wait({ id: m.id, name: m.name, avatar_initials: m.initials, section: "Section 3", address: "", show_address: false });
    return wait(by(id));
  },
  async getAllProfiles() {
    return wait([...PROFILES]);
  },
  async getPendingProfiles() {
    return wait([...pending]);
  },
  async approveProfile(id: string) {
    const i = pending.findIndex((p) => p.id === id);
    if (i >= 0) pending.splice(i, 1);
    return wait(undefined);
  },
  async denyProfile(id: string) {
    const i = pending.findIndex((p) => p.id === id);
    if (i >= 0) pending.splice(i, 1);
    return wait(undefined);
  },
  async updateProfileVisibility() {
    return wait(undefined);
  },

  async getVendors(category?: string) {
    return wait(vendors.filter((v) => v.status === "approved" && (!category || v.category === category)).sort((a, b) => (a.tier === b.tier ? a.business_name.localeCompare(b.business_name) : a.tier === "featured" ? -1 : 1)));
  },
  async getPendingVendors() {
    return wait([...pendingVendors]);
  },
  async recommendVendor(userId: string, businessName: string, category: string, phone: string, description?: string, email?: string, website?: string) {
    const v: Vendor = { ...V(uid(), businessName, category, phone, description ?? "", "u1"), status: "pending", email: email || null, website: website || null, recommender: { name: me().name } };
    pendingVendors = [...pendingVendors, v];
    return wait(v);
  },
  async approveVendor(id: string, tier: "free" | "featured") {
    const i = pendingVendors.findIndex((v) => v.id === id);
    if (i >= 0) {
      const v = { ...pendingVendors[i], status: "approved" as const, tier };
      pendingVendors.splice(i, 1);
      vendors = [...vendors, v];
    }
    return wait(undefined);
  },
  async denyVendor(id: string) {
    pendingVendors = pendingVendors.filter((v) => v.id !== id);
    return wait(undefined);
  },

  async getLatestIrrigation() {
    return wait(irrigation[0] ?? null);
  },
  async getIrrigationHistory() {
    return wait([...irrigation]);
  },
  async publishIrrigationUpdate(authorId: string, status: Irrigation["status"], windowStart: string | null, windowEnd: string | null, note: string | null) {
    const u: Irrigation = { id: uid(), author_id: authorId, status, window_start: windowStart, window_end: windowEnd, note, created_at: new Date().toISOString(), author: { name: me().name } };
    irrigation = [u, ...irrigation];
    return wait(u);
  },
  async notifyAllApproved() {
    return wait(PROFILES.length);
  },
};
