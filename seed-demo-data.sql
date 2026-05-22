-- ============================================================
-- SUNBURST FARMS DEMO SEED DATA
-- Run this in the Supabase SQL Editor to populate the app
-- with ~50 realistic community members and activity.
-- ============================================================

-- Step 1: Create auth.users entries for our demo neighbors
-- (Your real account b7ca9c9e-89fa-4144-9029-946bf3bcc724 already exists)

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES
  ('a1000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maria.gonzalez@demo.sbfe', '$2a$10$demo', now() - interval '45 days', now() - interval '45 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tom.chen@demo.sbfe', '$2a$10$demo', now() - interval '44 days', now() - interval '44 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jake.morrison@demo.sbfe', '$2a$10$demo', now() - interval '43 days', now() - interval '43 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sarah.blackwood@demo.sbfe', '$2a$10$demo', now() - interval '42 days', now() - interval '42 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dave.reiter@demo.sbfe', '$2a$10$demo', now() - interval '41 days', now() - interval '41 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'patty.nguyen@demo.sbfe', '$2a$10$demo', now() - interval '40 days', now() - interval '40 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bill.hawkins@demo.sbfe', '$2a$10$demo', now() - interval '39 days', now() - interval '39 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nancy.kowalski@demo.sbfe', '$2a$10$demo', now() - interval '38 days', now() - interval '38 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ray.fuentes@demo.sbfe', '$2a$10$demo', now() - interval '37 days', now() - interval '37 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carol.jensen@demo.sbfe', '$2a$10$demo', now() - interval '36 days', now() - interval '36 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mike.thompson@demo.sbfe', '$2a$10$demo', now() - interval '35 days', now() - interval '35 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'linda.parekh@demo.sbfe', '$2a$10$demo', now() - interval '34 days', now() - interval '34 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'steve.ortiz@demo.sbfe', '$2a$10$demo', now() - interval '33 days', now() - interval '33 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'janet.mueller@demo.sbfe', '$2a$10$demo', now() - interval '32 days', now() - interval '32 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rick.barnes@demo.sbfe', '$2a$10$demo', now() - interval '31 days', now() - interval '31 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'diana.watts@demo.sbfe', '$2a$10$demo', now() - interval '30 days', now() - interval '30 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'frank.delgado@demo.sbfe', '$2a$10$demo', now() - interval '29 days', now() - interval '29 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'susan.yamamoto@demo.sbfe', '$2a$10$demo', now() - interval '28 days', now() - interval '28 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'gary.peterson@demo.sbfe', '$2a$10$demo', now() - interval '27 days', now() - interval '27 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'karen.lloyd@demo.sbfe', '$2a$10$demo', now() - interval '26 days', now() - interval '26 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'robert.price@demo.sbfe', '$2a$10$demo', now() - interval '25 days', now() - interval '25 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'anne.fischer@demo.sbfe', '$2a$10$demo', now() - interval '24 days', now() - interval '24 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dan.mcallister@demo.sbfe', '$2a$10$demo', now() - interval '23 days', now() - interval '23 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rosa.medina@demo.sbfe', '$2a$10$demo', now() - interval '22 days', now() - interval '22 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'paul.wright@demo.sbfe', '$2a$10$demo', now() - interval '21 days', now() - interval '21 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'helen.chang@demo.sbfe', '$2a$10$demo', now() - interval '20 days', now() - interval '20 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000027', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mark.sullivan@demo.sbfe', '$2a$10$demo', now() - interval '19 days', now() - interval '19 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000028', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'betty.sandoval@demo.sbfe', '$2a$10$demo', now() - interval '18 days', now() - interval '18 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000029', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jim.keller@demo.sbfe', '$2a$10$demo', now() - interval '17 days', now() - interval '17 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice.brennan@demo.sbfe', '$2a$10$demo', now() - interval '16 days', now() - interval '16 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'wayne.tran@demo.sbfe', '$2a$10$demo', now() - interval '15 days', now() - interval '15 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'laura.hoffman@demo.sbfe', '$2a$10$demo', now() - interval '14 days', now() - interval '14 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ed.murphy@demo.sbfe', '$2a$10$demo', now() - interval '13 days', now() - interval '13 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000034', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'grace.obrien@demo.sbfe', '$2a$10$demo', now() - interval '12 days', now() - interval '12 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000035', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'phil.vasquez@demo.sbfe', '$2a$10$demo', now() - interval '11 days', now() - interval '11 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000036', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'martha.king@demo.sbfe', '$2a$10$demo', now() - interval '10 days', now() - interval '10 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000037', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tony.russo@demo.sbfe', '$2a$10$demo', now() - interval '9 days', now() - interval '9 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000038', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'vicki.pham@demo.sbfe', '$2a$10$demo', now() - interval '8 days', now() - interval '8 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000039', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carl.newton@demo.sbfe', '$2a$10$demo', now() - interval '7 days', now() - interval '7 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'deb.maxwell@demo.sbfe', '$2a$10$demo', now() - interval '6 days', now() - interval '6 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jose.ramirez@demo.sbfe', '$2a$10$demo', now() - interval '5 days', now() - interval '5 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'barb.wellington@demo.sbfe', '$2a$10$demo', now() - interval '4 days', now() - interval '4 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000043', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'chris.dunn@demo.sbfe', '$2a$10$demo', now() - interval '3 days', now() - interval '3 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000044', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'irene.novak@demo.sbfe', '$2a$10$demo', now() - interval '2 days', now() - interval '2 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000045', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kevin.shaw@demo.sbfe', '$2a$10$demo', now() - interval '1 day', now() - interval '1 day', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000046', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pam.henderson@demo.sbfe', '$2a$10$demo', now() - interval '45 days', now() - interval '45 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000047', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'don.whitfield@demo.sbfe', '$2a$10$demo', now() - interval '40 days', now() - interval '40 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000048', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'yolanda.reyes@demo.sbfe', '$2a$10$demo', now() - interval '35 days', now() - interval '35 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000049', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bruce.tanaka@demo.sbfe', '$2a$10$demo', now() - interval '30 days', now() - interval '30 days', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000050', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'cathy.marsh@demo.sbfe', '$2a$10$demo', now() - interval '25 days', now() - interval '25 days', now(), '', '{"provider":"email","providers":["email"]}', '{}')
ON CONFLICT (id) DO NOTHING;

-- Also need identities for each user
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
SELECT id, id, jsonb_build_object('sub', id::text, 'email', email), 'email', id::text, now(), created_at, now()
FROM auth.users
WHERE id LIKE 'a1000001-%'
ON CONFLICT DO NOTHING;

-- Step 2: Create profiles for all demo users
-- Sections 1-7, realistic Phoenix/Scottsdale addresses on streets found in the area

INSERT INTO profiles (id, name, address, section, avatar_initials, status, role, show_address, created_at) VALUES
  ('a1000001-0000-0000-0000-000000000001', 'Maria Gonzalez',     '8721 E Desert Willow Dr',   'Section 3', 'MG', 'approved', 'member', true,  now() - interval '45 days'),
  ('a1000001-0000-0000-0000-000000000002', 'Tom Chen',            '8834 E Sunburst Dr',        'Section 2', 'TC', 'approved', 'member', true,  now() - interval '44 days'),
  ('a1000001-0000-0000-0000-000000000003', 'Jake Morrison',       '9102 E Calle de Valle',     'Section 4', 'JM', 'approved', 'member', true,  now() - interval '43 days'),
  ('a1000001-0000-0000-0000-000000000004', 'Sarah Blackwood',     '7645 E Windrose Dr',        'Section 7', 'SB', 'approved', 'member', true,  now() - interval '42 days'),
  ('a1000001-0000-0000-0000-000000000005', 'Dave Reiter',         '8850 E Sunburst Dr',        'Section 2', 'DR', 'approved', 'member', true,  now() - interval '41 days'),
  ('a1000001-0000-0000-0000-000000000006', 'Patty Nguyen',        '8729 E Desert Willow Dr',   'Section 3', 'PN', 'approved', 'member', true,  now() - interval '40 days'),
  ('a1000001-0000-0000-0000-000000000007', 'Bill Hawkins',        '9210 E Cactus Wren Rd',     'Section 5', 'BH', 'approved', 'member', true,  now() - interval '39 days'),
  ('a1000001-0000-0000-0000-000000000008', 'Nancy Kowalski',      '7702 E Cholla Ln',          'Section 1', 'NK', 'approved', 'member', true,  now() - interval '38 days'),
  ('a1000001-0000-0000-0000-000000000009', 'Ray Fuentes',         '9315 E Calle de Valle',     'Section 4', 'RF', 'approved', 'member', false, now() - interval '37 days'),
  ('a1000001-0000-0000-0000-000000000010', 'Carol Jensen',        '8901 E Sunburst Dr',        'Section 6', 'CJ', 'approved', 'member', true,  now() - interval '36 days'),
  ('a1000001-0000-0000-0000-000000000011', 'Mike Thompson',       '7800 E Cholla Ln',          'Section 1', 'MT', 'approved', 'member', true,  now() - interval '35 days'),
  ('a1000001-0000-0000-0000-000000000012', 'Linda Parekh',        '9105 E Cactus Wren Rd',     'Section 5', 'LP', 'approved', 'member', true,  now() - interval '34 days'),
  ('a1000001-0000-0000-0000-000000000013', 'Steve Ortiz',         '8740 E Desert Willow Dr',   'Section 3', 'SO', 'approved', 'member', false, now() - interval '33 days'),
  ('a1000001-0000-0000-0000-000000000014', 'Janet Mueller',       '7650 E Windrose Dr',        'Section 7', 'JU', 'approved', 'member', true,  now() - interval '32 days'),
  ('a1000001-0000-0000-0000-000000000015', 'Rick Barnes',         '8860 E Sunburst Dr',        'Section 2', 'RB', 'approved', 'member', true,  now() - interval '31 days'),
  ('a1000001-0000-0000-0000-000000000016', 'Diana Watts',         '9220 E Cactus Wren Rd',     'Section 5', 'DW', 'approved', 'member', true,  now() - interval '30 days'),
  ('a1000001-0000-0000-0000-000000000017', 'Frank Delgado',       '9320 E Calle de Valle',     'Section 4', 'FD', 'approved', 'member', true,  now() - interval '29 days'),
  ('a1000001-0000-0000-0000-000000000018', 'Susan Yamamoto',      '8910 E Sunburst Dr',        'Section 6', 'SY', 'approved', 'member', false, now() - interval '28 days'),
  ('a1000001-0000-0000-0000-000000000019', 'Gary Peterson',       '7810 E Cholla Ln',          'Section 1', 'GP', 'approved', 'member', true,  now() - interval '27 days'),
  ('a1000001-0000-0000-0000-000000000020', 'Karen Lloyd',         '8735 E Desert Willow Dr',   'Section 3', 'KL', 'approved', 'member', true,  now() - interval '26 days'),
  ('a1000001-0000-0000-0000-000000000021', 'Robert Price',        '7660 E Windrose Dr',        'Section 7', 'RP', 'approved', 'member', true,  now() - interval '25 days'),
  ('a1000001-0000-0000-0000-000000000022', 'Anne Fischer',        '9110 E Cactus Wren Rd',     'Section 5', 'AF', 'approved', 'member', true,  now() - interval '24 days'),
  ('a1000001-0000-0000-0000-000000000023', 'Dan McAllister',      '8870 E Sunburst Dr',        'Section 2', 'DM', 'approved', 'member', true,  now() - interval '23 days'),
  ('a1000001-0000-0000-0000-000000000024', 'Rosa Medina',         '9330 E Calle de Valle',     'Section 4', 'RM', 'approved', 'member', true,  now() - interval '22 days'),
  ('a1000001-0000-0000-0000-000000000025', 'Paul Wright',         '8920 E Sunburst Dr',        'Section 6', 'PW', 'approved', 'member', false, now() - interval '21 days'),
  ('a1000001-0000-0000-0000-000000000026', 'Helen Chang',         '7820 E Cholla Ln',          'Section 1', 'HC', 'approved', 'member', true,  now() - interval '20 days'),
  ('a1000001-0000-0000-0000-000000000027', 'Mark Sullivan',       '7670 E Windrose Dr',        'Section 7', 'MS', 'approved', 'member', true,  now() - interval '19 days'),
  ('a1000001-0000-0000-0000-000000000028', 'Betty Sandoval',      '8750 E Desert Willow Dr',   'Section 3', 'BS', 'approved', 'member', true,  now() - interval '18 days'),
  ('a1000001-0000-0000-0000-000000000029', 'Jim Keller',          '9230 E Cactus Wren Rd',     'Section 5', 'JK', 'approved', 'member', true,  now() - interval '17 days'),
  ('a1000001-0000-0000-0000-000000000030', 'Alice Brennan',       '8880 E Sunburst Dr',        'Section 2', 'AB', 'approved', 'member', true,  now() - interval '16 days'),
  ('a1000001-0000-0000-0000-000000000031', 'Wayne Tran',          '9340 E Calle de Valle',     'Section 4', 'WT', 'approved', 'member', false, now() - interval '15 days'),
  ('a1000001-0000-0000-0000-000000000032', 'Laura Hoffman',       '8930 E Sunburst Dr',        'Section 6', 'LH', 'approved', 'member', true,  now() - interval '14 days'),
  ('a1000001-0000-0000-0000-000000000033', 'Ed Murphy',           '7830 E Cholla Ln',          'Section 1', 'EM', 'approved', 'member', true,  now() - interval '13 days'),
  ('a1000001-0000-0000-0000-000000000034', 'Grace O''Brien',      '7680 E Windrose Dr',        'Section 7', 'GO', 'approved', 'member', true,  now() - interval '12 days'),
  ('a1000001-0000-0000-0000-000000000035', 'Phil Vasquez',        '9120 E Cactus Wren Rd',     'Section 5', 'PV', 'approved', 'member', true,  now() - interval '11 days'),
  ('a1000001-0000-0000-0000-000000000036', 'Martha King',         '8760 E Desert Willow Dr',   'Section 3', 'MK', 'approved', 'member', true,  now() - interval '10 days'),
  ('a1000001-0000-0000-0000-000000000037', 'Tony Russo',          '8890 E Sunburst Dr',        'Section 2', 'TR', 'approved', 'member', true,  now() - interval '9 days'),
  ('a1000001-0000-0000-0000-000000000038', 'Vicki Pham',          '9350 E Calle de Valle',     'Section 4', 'VP', 'approved', 'member', true,  now() - interval '8 days'),
  ('a1000001-0000-0000-0000-000000000039', 'Carl Newton',         '8940 E Sunburst Dr',        'Section 6', 'CN', 'approved', 'member', false, now() - interval '7 days'),
  ('a1000001-0000-0000-0000-000000000040', 'Deb Maxwell',         '7840 E Cholla Ln',          'Section 1', 'DX', 'approved', 'member', true,  now() - interval '6 days'),
  ('a1000001-0000-0000-0000-000000000041', 'Jose Ramirez',        '7690 E Windrose Dr',        'Section 7', 'JR', 'approved', 'member', true,  now() - interval '5 days'),
  ('a1000001-0000-0000-0000-000000000042', 'Barb Wellington',     '9130 E Cactus Wren Rd',     'Section 5', 'BW', 'approved', 'member', true,  now() - interval '4 days'),
  ('a1000001-0000-0000-0000-000000000043', 'Chris Dunn',          '8770 E Desert Willow Dr',   'Section 3', 'CD', 'approved', 'member', true,  now() - interval '3 days'),
  ('a1000001-0000-0000-0000-000000000044', 'Irene Novak',         '8900 E Sunburst Dr',        'Section 2', 'IN', 'approved', 'member', true,  now() - interval '2 days'),
  ('a1000001-0000-0000-0000-000000000045', 'Kevin Shaw',          '9360 E Calle de Valle',     'Section 4', 'KS', 'approved', 'member', true,  now() - interval '1 day'),
  ('a1000001-0000-0000-0000-000000000046', 'Pam Henderson',       '8950 E Sunburst Dr',        'Section 6', 'PH', 'approved', 'member', true,  now() - interval '45 days'),
  ('a1000001-0000-0000-0000-000000000047', 'Don Whitfield',       '7850 E Cholla Ln',          'Section 1', 'DW', 'approved', 'member', true,  now() - interval '40 days'),
  ('a1000001-0000-0000-0000-000000000048', 'Yolanda Reyes',       '7700 E Windrose Dr',        'Section 7', 'YR', 'approved', 'member', true,  now() - interval '35 days'),
  ('a1000001-0000-0000-0000-000000000049', 'Bruce Tanaka',        '9140 E Cactus Wren Rd',     'Section 5', 'BT', 'approved', 'member', true,  now() - interval '30 days'),
  ('a1000001-0000-0000-0000-000000000050', 'Cathy Marsh',         '8780 E Desert Willow Dr',   'Section 3', 'CM', 'approved', 'member', true,  now() - interval '25 days')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- Step 3: POSTS (25 posts across all categories, spread over time)
-- ============================================================

INSERT INTO posts (id, author_id, category, title, body, image_url, created_at) VALUES
  -- Produce
  ('b0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 'produce',
   'Fresh eggs on the porch',
   'A dozen free-range eggs from our girls. Help yourself, on the front porch at 8721 Desert Willow.',
   'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=600&h=400&fit=crop',
   now() - interval '1 day'),

  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000002', 'produce',
   'Citrus overflow!',
   'Our orange and grapefruit trees went crazy this season. We have bags and bags ready to go. Come grab as many as you want, we''ll leave them by the gate all week.',
   'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&h=400&fit=crop',
   now() - interval '3 hours'),

  ('b0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000024', 'produce',
   'Tomatoes and peppers ready',
   'Garden is producing like crazy. Have about 20 lbs of tomatoes and a bunch of jalapenos. Swing by the side gate, they''re in the cooler under the palo verde.',
   'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop',
   now() - interval '6 hours'),

  ('b0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000010', 'produce',
   'Zucchini galore',
   'If you''ve ever grown zucchini you know the struggle. I have way too much. Please come take some off my hands before they take over the kitchen.',
   null,
   now() - interval '2 days'),

  -- Eggs
  ('b0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000008', 'eggs',
   'Quail eggs available',
   'We raise Coturnix quail and have a surplus of eggs this week. Great for pickling or baking. $3/dozen or trade for produce.',
   'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=600&h=400&fit=crop',
   now() - interval '5 hours'),

  ('b0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000030', 'eggs',
   'Duck eggs this week',
   'Our Khaki Campbells are laying well. Duck eggs are amazing for baking. $5/dozen, on the honor system at the front door.',
   null,
   now() - interval '1 day 4 hours'),

  -- Flowers
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000004', 'flowers',
   'Sunflower bouquets ready',
   'Cut a bunch of sunflowers this morning. I have about 8 bouquets wrapped and ready on the porch. They''re huge this year!',
   'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&h=400&fit=crop',
   now() - interval '4 hours'),

  ('b0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000016', 'flowers',
   'Bougainvillea cuttings',
   'Trimmed back our bougainvillea and have about 30 healthy cuttings. They root easily in water. Free to anyone who wants some color in their yard.',
   'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
   now() - interval '2 days 3 hours'),

  -- Seeds
  ('b0000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000006', 'seeds',
   'Heirloom tomato seeds',
   'Saved seeds from our best producers this year. Brandywine, Cherokee Purple, and San Marzano. Small bags on the front table, help yourself.',
   null,
   now() - interval '8 hours'),

  ('b0000001-0000-0000-0000-000000000010', 'a1000001-0000-0000-0000-000000000020', 'seeds',
   'Desert wildflower seed mix',
   'Collected seeds from our wildflower patch. Mix of desert marigold, penstemon, and globe mallow. Perfect for a low-water garden. Bags on the mailbox.',
   'https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=600&h=400&fit=crop',
   now() - interval '3 days'),

  -- Tools
  ('b0000001-0000-0000-0000-000000000011', 'a1000001-0000-0000-0000-000000000003', 'tools',
   'Post hole digger available to borrow',
   'Just finished my fence project. Happy to lend out the post hole digger this week if anyone needs it. Text me to arrange pickup.',
   null,
   now() - interval '2 hours'),

  ('b0000001-0000-0000-0000-000000000012', 'a1000001-0000-0000-0000-000000000007', 'tools',
   'Pressure washer for loan',
   'Have a 3000 PSI gas pressure washer sitting in the garage. Happy to lend it out on weekends. Just bring it back with a full tank.',
   null,
   now() - interval '1 day 8 hours'),

  ('b0000001-0000-0000-0000-000000000013', 'a1000001-0000-0000-0000-000000000015', 'tools',
   'Chainsaw available this weekend',
   'Stihl MS 271 if anyone needs to take down a dead tree or do some heavy trimming. I can also help if you need an extra pair of hands.',
   null,
   now() - interval '12 hours'),

  -- Events
  ('b0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000011', 'events',
   'Block party this Saturday!',
   'Section 1 is hosting a block party this Saturday at 5pm. We''ll have the smoker going, bring a side dish or drinks. Kids welcome, we''ll have the bounce house.',
   null,
   now() - interval '1 day'),

  ('b0000001-0000-0000-0000-000000000015', 'a1000001-0000-0000-0000-000000000032', 'events',
   'Yoga in the park - every Tuesday',
   'Starting a free morning yoga group at Sereno Park, Tuesdays at 6:30am. All levels welcome. Bring a mat and water. See you there!',
   null,
   now() - interval '4 days'),

  -- General
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000005', 'general',
   'Coyote spotted near bridle path',
   'Heads up, saw a coyote near the south bridle path around 6am this morning. Keep an eye on small pets and chickens today.',
   null,
   now() - interval '7 hours'),

  ('b0000001-0000-0000-0000-000000000017', 'a1000001-0000-0000-0000-000000000019', 'general',
   'Thank you for the lemons!',
   'Whoever left a bag of lemons on our porch, THANK YOU! Made a huge batch of lemonade and lemon bars. This neighborhood is the best.',
   null,
   now() - interval '10 hours'),

  ('b0000001-0000-0000-0000-000000000018', 'a1000001-0000-0000-0000-000000000014', 'general',
   'Lost cat - gray tabby',
   'Our cat Pepper got out last night. She''s a gray tabby with a pink collar. Very friendly. If you spot her near Section 7, please message me!',
   null,
   now() - interval '30 minutes'),

  ('b0000001-0000-0000-0000-000000000019', 'a1000001-0000-0000-0000-000000000009', 'general',
   'Rattlesnake reminder',
   'Saw a diamondback on the trail near Section 4 this morning. Remember to watch where you step, especially at dawn and dusk. AZ Game & Fish can relocate if needed.',
   null,
   now() - interval '5 hours'),

  ('b0000001-0000-0000-0000-000000000020', 'a1000001-0000-0000-0000-000000000033', 'general',
   'Anyone know a good farrier?',
   'Our regular farrier moved out of state. Looking for recommendations for someone reliable who services the east valley. Thanks!',
   null,
   now() - interval '1 day 2 hours'),

  ('b0000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000022', 'produce',
   'Herb garden surplus',
   'Basil, rosemary, and mint are going wild. Come snip whatever you need. We''re at the corner of Cactus Wren and the walking path.',
   'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop',
   now() - interval '9 hours'),

  ('b0000001-0000-0000-0000-000000000022', 'a1000001-0000-0000-0000-000000000037', 'eggs',
   'Farm fresh eggs - weekly signup',
   'We have 12 hens now and more eggs than we know what to do with. If you want a standing weekly dozen, message me and I''ll add you to the list. $4/dozen.',
   'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=600&h=400&fit=crop',
   now() - interval '14 hours'),

  ('b0000001-0000-0000-0000-000000000023', 'a1000001-0000-0000-0000-000000000012', 'flowers',
   'Rose pruning workshop',
   'I''m doing my annual rose pruning this weekend and happy to show anyone who wants to learn. Bring your gloves and shears. Saturday 8am.',
   null,
   now() - interval '2 days 1 hour'),

  ('b0000001-0000-0000-0000-000000000024', 'a1000001-0000-0000-0000-000000000040', 'seeds',
   'Moringa seeds from my tree',
   'The moringa tree is dropping seed pods. These grow fast and are incredibly nutritious. Take a handful, they''re in the brown bag by the gate.',
   null,
   now() - interval '1 day 6 hours'),

  ('b0000001-0000-0000-0000-000000000025', 'a1000001-0000-0000-0000-000000000026', 'general',
   'Water outage Section 1 today',
   'SRP notified us about a planned water maintenance today from 10am-2pm affecting parts of Section 1. Fill up some jugs ahead of time!',
   null,
   now() - interval '16 hours')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- Step 4: COMMENTS on posts
-- ============================================================

INSERT INTO comments (post_id, author_id, body, created_at) VALUES
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000001', 'We''d love some grapefruit! Coming by this afternoon.', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000008', 'Just grabbed a bag of oranges, they''re incredible. Thank you!', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000020', 'Do you have any Meyer lemons too? Love those!', now() - interval '45 minutes'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000015', 'Made fresh juice this morning, amazing. Thanks Tom!', now() - interval '30 minutes'),

  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000002', 'Those are gorgeous! Saving one for our kitchen table.', now() - interval '3 hours'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000010', 'Grabbed two, they really are huge this year!', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000036', 'Any tips for growing them that tall? Mine are always short.', now() - interval '1 hour'),

  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000003', 'Thanks for the heads up. Will keep the chickens inside today.', now() - interval '6 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000014', 'Saw it again around noon near the wash. Be careful everyone.', now() - interval '4 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000007', 'Keep an eye on small dogs too. Our neighbor lost a Yorkie last year.', now() - interval '3 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000030', 'Called AZ Game & Fish, they said they''ll send someone to check.', now() - interval '2 hours'),

  ('b0000001-0000-0000-0000-000000000011', 'a1000001-0000-0000-0000-000000000017', 'I could use that! Working on a gate this weekend. Can I borrow it Saturday morning?', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000011', 'a1000001-0000-0000-0000-000000000003', 'Saturday works! I''ll drop it at your place Friday evening.', now() - interval '45 minutes'),

  ('b0000001-0000-0000-0000-000000000018', 'a1000001-0000-0000-0000-000000000021', 'I think I saw a gray tabby near the horse arena around 7pm. Could be Pepper!', now() - interval '20 minutes'),
  ('b0000001-0000-0000-0000-000000000018', 'a1000001-0000-0000-0000-000000000034', 'Will keep an eye out. Hope she comes home soon!', now() - interval '15 minutes'),
  ('b0000001-0000-0000-0000-000000000018', 'a1000001-0000-0000-0000-000000000004', 'Try leaving her litter box outside, they can smell it from far away.', now() - interval '10 minutes'),

  ('b0000001-0000-0000-0000-000000000020', 'a1000001-0000-0000-0000-000000000003', 'We use Dusty at Desert Shoeing. He''s great and very gentle with the horses. 480-555-0187.', now() - interval '20 hours'),
  ('b0000001-0000-0000-0000-000000000020', 'a1000001-0000-0000-0000-000000000007', 'Second Dusty. He''s done all four of ours for years.', now() - interval '18 hours'),
  ('b0000001-0000-0000-0000-000000000020', 'a1000001-0000-0000-0000-000000000024', 'Also check out Valley Farrier Services. They come out to SBFE regularly.', now() - interval '16 hours'),

  ('b0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000028', 'Just picked up tomatoes. These are SO good. Thank you Rosa!', now() - interval '5 hours'),
  ('b0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000006', 'Still any jalapenos left? Making salsa this weekend.', now() - interval '4 hours'),

  ('b0000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000012', 'Grabbed the Cherokee Purple seeds. Can''t wait to try them!', now() - interval '7 hours'),
  ('b0000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000032', 'The Brandywines are the best tasting tomato I''ve ever grown. Thanks Patty!', now() - interval '6 hours'),

  ('b0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000019', 'Count us in! We''ll bring our famous potato salad.', now() - interval '20 hours'),
  ('b0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000026', 'Can''t wait! The kids have been asking about the bounce house all week.', now() - interval '18 hours'),
  ('b0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000040', 'We''ll bring pulled pork. What time should we come set up?', now() - interval '16 hours'),

  ('b0000001-0000-0000-0000-000000000022', 'a1000001-0000-0000-0000-000000000001', 'Just signed up! My kids love collecting eggs in the morning.', now() - interval '12 hours'),
  ('b0000001-0000-0000-0000-000000000022', 'a1000001-0000-0000-0000-000000000016', 'Put me down for a weekly dozen please! Will message you.', now() - interval '10 hours'),

  ('b0000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000009', 'The basil is incredible. Made pesto tonight. Thanks Anne!', now() - interval '8 hours'),
  ('b0000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000038', 'Grabbed some rosemary. My house smells amazing now.', now() - interval '7 hours')
ON CONFLICT DO NOTHING;


-- ============================================================
-- Step 5: LIKES on posts (spread across many users for realism)
-- ============================================================

INSERT INTO likes (post_id, user_id, created_at) VALUES
  -- Citrus post (popular - 15 likes)
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000001', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000003', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000006', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000008', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000010', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000012', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000015', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000019', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000020', now() - interval '45 minutes'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000022', now() - interval '45 minutes'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000028', now() - interval '30 minutes'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000032', now() - interval '30 minutes'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000036', now() - interval '30 minutes'),
  ('b0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000040', now() - interval '15 minutes'),
  ('b0000001-0000-0000-0000-000000000002', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', now() - interval '10 minutes'),

  -- Sunflowers (popular - 22 likes)
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000001', now() - interval '3 hours'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000002', now() - interval '3 hours'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000005', now() - interval '3 hours'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000006', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000008', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000010', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000012', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000014', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000016', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000018', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000020', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000022', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000024', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000026', now() - interval '45 minutes'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000028', now() - interval '45 minutes'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000030', now() - interval '30 minutes'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000032', now() - interval '30 minutes'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000034', now() - interval '30 minutes'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000036', now() - interval '15 minutes'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000038', now() - interval '15 minutes'),
  ('b0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000040', now() - interval '10 minutes'),
  ('b0000001-0000-0000-0000-000000000007', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', now() - interval '5 minutes'),

  -- Coyote warning (11 likes)
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000001', now() - interval '6 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000003', now() - interval '5 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000004', now() - interval '5 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000006', now() - interval '4 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000014', now() - interval '4 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000017', now() - interval '3 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000021', now() - interval '3 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000030', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000034', now() - interval '2 hours'),
  ('b0000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000042', now() - interval '1 hour'),
  ('b0000001-0000-0000-0000-000000000016', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', now() - interval '30 minutes'),

  -- Other posts (scattered likes)
  ('b0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000002', now() - interval '20 hours'),
  ('b0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000006', now() - interval '18 hours'),
  ('b0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000010', now() - interval '16 hours'),
  ('b0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000015', now() - interval '14 hours'),
  ('b0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000020', now() - interval '12 hours'),
  ('b0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000028', now() - interval '10 hours'),
  ('b0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000032', now() - interval '8 hours'),
  ('b0000001-0000-0000-0000-000000000001', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', now() - interval '6 hours'),

  ('b0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000001', now() - interval '5 hours'),
  ('b0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000006', now() - interval '4 hours'),
  ('b0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000028', now() - interval '4 hours'),
  ('b0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000033', now() - interval '3 hours'),
  ('b0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000038', now() - interval '2 hours'),

  ('b0000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000012', now() - interval '7 hours'),
  ('b0000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000020', now() - interval '6 hours'),
  ('b0000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000032', now() - interval '6 hours'),
  ('b0000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000040', now() - interval '5 hours'),
  ('b0000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000022', now() - interval '5 hours'),

  ('b0000001-0000-0000-0000-000000000017', 'a1000001-0000-0000-0000-000000000002', now() - interval '9 hours'),
  ('b0000001-0000-0000-0000-000000000017', 'a1000001-0000-0000-0000-000000000010', now() - interval '8 hours'),
  ('b0000001-0000-0000-0000-000000000017', 'a1000001-0000-0000-0000-000000000016', now() - interval '8 hours'),
  ('b0000001-0000-0000-0000-000000000017', 'a1000001-0000-0000-0000-000000000024', now() - interval '7 hours'),
  ('b0000001-0000-0000-0000-000000000017', 'a1000001-0000-0000-0000-000000000036', now() - interval '7 hours'),
  ('b0000001-0000-0000-0000-000000000017', 'a1000001-0000-0000-0000-000000000044', now() - interval '6 hours'),
  ('b0000001-0000-0000-0000-000000000017', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', now() - interval '5 hours'),

  ('b0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000019', now() - interval '20 hours'),
  ('b0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000026', now() - interval '18 hours'),
  ('b0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000033', now() - interval '16 hours'),
  ('b0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000040', now() - interval '14 hours'),
  ('b0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000008', now() - interval '12 hours'),
  ('b0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000047', now() - interval '10 hours'),
  ('b0000001-0000-0000-0000-000000000014', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', now() - interval '8 hours'),

  ('b0000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000009', now() - interval '8 hours'),
  ('b0000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000018', now() - interval '7 hours'),
  ('b0000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000025', now() - interval '6 hours'),
  ('b0000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000038', now() - interval '5 hours'),
  ('b0000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000042', now() - interval '4 hours'),
  ('b0000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000050', now() - interval '3 hours'),

  ('b0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000001', now() - interval '4 hours'),
  ('b0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000006', now() - interval '3 hours'),
  ('b0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000012', now() - interval '3 hours'),

  ('b0000001-0000-0000-0000-000000000010', 'a1000001-0000-0000-0000-000000000006', now() - interval '2 days'),
  ('b0000001-0000-0000-0000-000000000010', 'a1000001-0000-0000-0000-000000000032', now() - interval '2 days'),
  ('b0000001-0000-0000-0000-000000000010', 'a1000001-0000-0000-0000-000000000044', now() - interval '2 days'),
  ('b0000001-0000-0000-0000-000000000010', 'a1000001-0000-0000-0000-000000000008', now() - interval '2 days'),

  ('b0000001-0000-0000-0000-000000000018', 'a1000001-0000-0000-0000-000000000004', now() - interval '25 minutes'),
  ('b0000001-0000-0000-0000-000000000018', 'a1000001-0000-0000-0000-000000000021', now() - interval '20 minutes'),
  ('b0000001-0000-0000-0000-000000000018', 'a1000001-0000-0000-0000-000000000034', now() - interval '15 minutes'),
  ('b0000001-0000-0000-0000-000000000018', 'a1000001-0000-0000-0000-000000000048', now() - interval '10 minutes'),
  ('b0000001-0000-0000-0000-000000000018', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', now() - interval '5 minutes')
ON CONFLICT DO NOTHING;


-- ============================================================
-- Step 6: EVENTS
-- ============================================================

INSERT INTO events (id, author_id, title, description, event_date, event_time, location, created_at) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000011', 'Community Potluck at Sereno Park',
   'Bring a dish to share! Burgers and drinks provided by the community board. Kids welcome, bring lawn chairs.',
   '2026-05-24', '5:00 PM', 'Sereno Park Pavilion', now() - interval '5 days'),

  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000003', 'Saturday Morning Trail Ride',
   'Casual group ride along the bridle paths. All experience levels welcome. Meet at the arena by 6:45.',
   '2026-05-31', '7:00 AM', 'Horse Arena on 56th', now() - interval '3 days'),

  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000011', 'Irrigation Schedule Meeting',
   'Summer irrigation schedule discussion and updates from the water committee. Important for all property owners.',
   '2026-06-03', '6:30 PM', 'Community Center', now() - interval '7 days'),

  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000006', 'Neighborhood Seed Swap',
   'Bring your saved seeds, cuttings, and starter plants. Trade with neighbors for next season''s garden.',
   '2026-06-07', '9:00 AM', 'Sonrisa Park', now() - interval '4 days'),

  ('e0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000032', 'Morning Yoga in the Park',
   'Free morning yoga for all levels. Bring a mat and water. We''ll stretch under the shade trees.',
   '2026-05-27', '6:30 AM', 'Sereno Park - East Lawn', now() - interval '6 days'),

  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000007', 'Horse Tack Swap Meet',
   'Clean out your tack room! Bring saddles, bridles, blankets, and gear to sell or trade. Coffee and donuts provided.',
   '2026-06-14', '8:00 AM', 'Horse Arena on 56th', now() - interval '2 days'),

  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000019', 'Movie Night Under the Stars',
   'Family movie night at the park. We''ll project on the big screen. Bring blankets and snacks. Movie TBD by vote.',
   '2026-06-20', '7:30 PM', 'Sereno Park - Main Field', now() - interval '1 day'),

  ('e0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000015', 'July 4th Planning Committee',
   'We need volunteers to plan the annual July 4th celebration. Come share ideas and sign up for tasks.',
   '2026-06-10', '6:00 PM', 'Community Center', now() - interval '8 days')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- Step 7: RSVPs on events
-- ============================================================

INSERT INTO rsvps (event_id, user_id) VALUES
  -- Potluck (34 going)
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000002'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000003'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000004'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000005'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000006'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000007'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000008'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000010'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000011'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000012'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000014'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000015'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000016'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000019'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000020'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000022'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000024'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000026'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000028'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000030'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000032'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000033'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000034'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000036'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000037'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000038'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000040'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000042'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000044'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000046'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000048'),
  ('e0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000050'),
  ('e0000001-0000-0000-0000-000000000001', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724'),

  -- Trail Ride (12 going)
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000003'),
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000007'),
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000009'),
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000015'),
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000021'),
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000027'),
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000033'),
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000035'),
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000041'),
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000047'),
  ('e0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000049'),
  ('e0000001-0000-0000-0000-000000000002', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724'),

  -- Irrigation Meeting (18 going)
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000002'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000005'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000007'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000008'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000010'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000011'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000013'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000015'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000019'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000023'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000025'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000029'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000031'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000037'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000039'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000043'),
  ('e0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000045'),
  ('e0000001-0000-0000-0000-000000000003', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724'),

  -- Seed Swap (21 going)
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000001'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000004'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000006'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000008'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000010'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000012'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000016'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000018'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000020'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000022'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000024'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000026'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000028'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000032'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000036'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000038'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000040'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000042'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000044'),
  ('e0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000050'),
  ('e0000001-0000-0000-0000-000000000004', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724'),

  -- Yoga (8 going)
  ('e0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000004'),
  ('e0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000012'),
  ('e0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000016'),
  ('e0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000020'),
  ('e0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000026'),
  ('e0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000038'),
  ('e0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000046'),
  ('e0000001-0000-0000-0000-000000000005', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724'),

  -- Tack Swap (15 going)
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000003'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000007'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000009'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000015'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000017'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000021'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000027'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000029'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000033'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000035'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000041'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000047'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000049'),
  ('e0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000034'),
  ('e0000001-0000-0000-0000-000000000006', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724'),

  -- Movie Night (25 going)
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000001'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000002'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000004'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000006'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000008'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000010'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000011'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000014'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000016'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000019'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000020'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000022'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000024'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000026'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000028'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000030'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000032'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000034'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000036'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000040'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000042'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000044'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000046'),
  ('e0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000048'),
  ('e0000001-0000-0000-0000-000000000007', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724'),

  -- July 4th Planning (10 going)
  ('e0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000011'),
  ('e0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000015'),
  ('e0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000019'),
  ('e0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000023'),
  ('e0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000032'),
  ('e0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000036'),
  ('e0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000040'),
  ('e0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000046'),
  ('e0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000050'),
  ('e0000001-0000-0000-0000-000000000008', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724')
ON CONFLICT DO NOTHING;


-- ============================================================
-- Step 8: MARKETPLACE LISTINGS
-- ============================================================

INSERT INTO listings (id, seller_id, title, description, price, is_free, condition, category, image_url, status, created_at) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000003', 'English Saddle - 17"',
   'Bates Caprilli close contact saddle. Medium tree, great condition. Includes girth and stirrup leathers. Barely used, my daughter outgrew it.',
   450.00, false, 'like_new', 'equestrian',
   'https://images.unsplash.com/photo-1450052590821-8bf91254a353?w=600&h=600&fit=crop',
   'available', now() - interval '3 days'),

  ('d0000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000007', 'Riding Lawn Mower - John Deere',
   'John Deere E120 42-inch riding mower. 3 years old, runs great. Moving to smaller lot, don''t need it anymore.',
   1200.00, false, 'good', 'tools',
   'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&h=600&fit=crop',
   'available', now() - interval '2 days'),

  ('d0000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000016', 'Patio Furniture Set',
   'Beautiful wrought iron patio set. Table with 4 chairs and cushions. Desert-proof finish, no rust. Looks brand new.',
   350.00, false, 'like_new', 'furniture',
   'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=600&fit=crop',
   'available', now() - interval '4 days'),

  ('d0000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000012', 'Free Chicken Coop',
   'Wooden chicken coop, fits 6-8 birds. Some wear from the sun but structurally solid. Free to whoever can pick it up.',
   null, true, 'fair', 'home_garden',
   null,
   'available', now() - interval '1 day'),

  ('d0000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000009', 'Western Saddle - Circle Y',
   'Circle Y trail saddle, 16 inch seat. Dark oil finish, fleece lined skirt. Comes with breast collar.',
   600.00, false, 'good', 'equestrian',
   'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=600&fit=crop',
   'available', now() - interval '5 days'),

  ('d0000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000022', 'Raised Garden Beds (3)',
   'Three cedar raised garden beds, 4x8 feet each. Already filled with good soil mix. Just need to be picked up.',
   150.00, false, 'good', 'home_garden',
   'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop',
   'available', now() - interval '6 hours'),

  ('d0000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000033', 'Horse Blankets (2)',
   'Two winter horse blankets, 78 inch. One is a Weatherbeeta, the other is a Horseware. Both in great shape, just don''t need them anymore.',
   80.00, false, 'good', 'equestrian',
   null,
   'available', now() - interval '3 days'),

  ('d0000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000005', 'Weber Gas Grill',
   'Weber Spirit II E-310, 3-burner gas grill. Used for two summers. Includes cover and propane tank. Moving, must sell.',
   275.00, false, 'good', 'home_garden',
   'https://images.unsplash.com/photo-1529262363086-a235d8b84aae?w=600&h=600&fit=crop',
   'available', now() - interval '1 day'),

  ('d0000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000030', 'Free Moving Boxes',
   'About 30 moving boxes, various sizes. Some packing paper and bubble wrap too. Need them gone by this weekend.',
   null, true, 'fair', 'other',
   null,
   'available', now() - interval '12 hours'),

  ('d0000001-0000-0000-0000-000000000010', 'a1000001-0000-0000-0000-000000000015', 'Stihl Chainsaw MS 251',
   'Stihl MS 251 chainsaw, 18 inch bar. Runs perfect, just upgraded to a bigger one. Includes case and extra chain.',
   250.00, false, 'good', 'tools',
   null,
   'available', now() - interval '2 days'),

  ('d0000001-0000-0000-0000-000000000011', 'a1000001-0000-0000-0000-000000000024', 'Vintage Rocking Chair',
   'Beautiful oak rocking chair, early 1900s. Perfect for a covered porch. Minor wear adds character.',
   200.00, false, 'good', 'furniture',
   null,
   'available', now() - interval '4 days'),

  ('d0000001-0000-0000-0000-000000000012', 'a1000001-0000-0000-0000-000000000019', 'Golf Cart - Club Car',
   'Club Car Precedent electric golf cart. Great for getting around the neighborhood. New batteries last year.',
   3500.00, false, 'good', 'vehicles',
   'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=600&fit=crop',
   'available', now() - interval '1 day'),

  ('d0000001-0000-0000-0000-000000000013', 'a1000001-0000-0000-0000-000000000040', 'iPad Air (4th gen)',
   'iPad Air 64GB, Sky Blue. Includes Apple Pencil and keyboard case. Barely used, upgrading to Pro.',
   380.00, false, 'like_new', 'electronics',
   null,
   'available', now() - interval '8 hours'),

  -- A couple sold listings for realism
  ('d0000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000011', 'Hay Bales (10)',
   'Ten bales of Bermuda hay. Good quality, stored in the barn. $8 per bale or $70 for all.',
   70.00, false, 'new', 'equestrian',
   null,
   'sold', now() - interval '7 days'),

  ('d0000001-0000-0000-0000-000000000015', 'a1000001-0000-0000-0000-000000000028', 'Drip Irrigation Kit',
   'Complete drip irrigation starter kit. Enough for a medium garden. Timer included.',
   45.00, false, 'like_new', 'home_garden',
   null,
   'sold', now() - interval '10 days')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- Step 9: MESSAGES (conversations with your account)
-- ============================================================

-- Conversation with Maria Gonzalez about eggs
INSERT INTO messages (sender_id, recipient_id, body, read, created_at) VALUES
  ('a1000001-0000-0000-0000-000000000001', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'Hi! Saw your post about the eggs. Do you have any left?', true, now() - interval '22 hours'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'a1000001-0000-0000-0000-000000000001', 'Yes! Still have about a dozen. Swing by anytime.', true, now() - interval '21 hours 30 minutes'),
  ('a1000001-0000-0000-0000-000000000001', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'Perfect, I''ll come by this afternoon. Thank you!', true, now() - interval '21 hours'),
  ('a1000001-0000-0000-0000-000000000001', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'Just picked them up, they look amazing! My kids will love them.', true, now() - interval '18 hours');

-- Conversation with Jake Morrison about the saddle listing
INSERT INTO messages (sender_id, recipient_id, body, read, created_at) VALUES
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'a1000001-0000-0000-0000-000000000003', 'Hey Jake, is the English saddle still available?', true, now() - interval '2 days'),
  ('a1000001-0000-0000-0000-000000000003', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'Hey! Yes it is. Want to come take a look? I''m home most evenings.', true, now() - interval '1 day 23 hours'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'a1000001-0000-0000-0000-000000000003', 'Would Thursday evening work?', true, now() - interval '1 day 22 hours'),
  ('a1000001-0000-0000-0000-000000000003', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'Thursday is perfect. Come by around 6, I''ll have it out in the barn.', true, now() - interval '1 day 21 hours'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'a1000001-0000-0000-0000-000000000003', 'Sounds good, see you then!', true, now() - interval '1 day 20 hours');

-- Conversation with Tom Chen about citrus
INSERT INTO messages (sender_id, recipient_id, body, read, created_at) VALUES
  ('a1000001-0000-0000-0000-000000000002', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'Hi neighbor! Did you get any of our citrus?', false, now() - interval '2 hours'),
  ('a1000001-0000-0000-0000-000000000002', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'We also have some kumquats if you''re interested. They''re great for marmalade!', false, now() - interval '1 hour');

-- Conversation with Sarah Blackwood about the community
INSERT INTO messages (sender_id, recipient_id, body, read, created_at) VALUES
  ('a1000001-0000-0000-0000-000000000004', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'Welcome to the neighborhood app! Love seeing more neighbors join.', true, now() - interval '3 days'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'a1000001-0000-0000-0000-000000000004', 'Thanks Sarah! It''s great to be connected with everyone. Love the sunflowers by the way!', true, now() - interval '3 days'),
  ('a1000001-0000-0000-0000-000000000004', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'Come grab some anytime! I always have extras this time of year.', true, now() - interval '2 days 20 hours');

-- Conversation with Bill Hawkins about the trail ride
INSERT INTO messages (sender_id, recipient_id, body, read, created_at) VALUES
  ('a1000001-0000-0000-0000-000000000007', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'Are you coming to the trail ride this Saturday? Would be great to have you.', false, now() - interval '4 hours'),
  ('a1000001-0000-0000-0000-000000000007', 'b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'We usually do about 5 miles, nice and easy pace. Perfect weather for it.', false, now() - interval '3 hours 30 minutes');


-- ============================================================
-- Step 10: NOTIFICATIONS for your account
-- ============================================================

INSERT INTO notifications (user_id, type, message, read, created_at) VALUES
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'comment', 'Maria Gonzalez commented: "Just picked them up, they look amazing!"', false, now() - interval '18 hours'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'claim', 'Tom Chen claimed your fresh eggs!', false, now() - interval '20 hours'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'event', 'Community Potluck is this Saturday. 34 neighbors going!', false, now() - interval '1 hour'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'comment', 'Jake Morrison replied: "Thursday is perfect. Come by around 6."', true, now() - interval '1 day 21 hours'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'event', 'Saturday Morning Trail Ride - 12 neighbors are going!', true, now() - interval '2 days'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'comment', 'Sarah Blackwood commented: "Come grab some anytime!"', true, now() - interval '2 days 20 hours'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'event', 'New event: Neighborhood Seed Swap on June 7th', true, now() - interval '4 days'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'comment', 'Bill Hawkins commented on trail ride: "Would be great to have you."', false, now() - interval '4 hours'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'event', 'New event: Movie Night Under the Stars on June 20th', true, now() - interval '1 day'),
  ('b7ca9c9e-89fa-4144-9029-946bf3bcc724', 'approved', 'Welcome to Sunburst Farms! Your account has been approved. Start sharing with your neighbors!', true, now() - interval '30 days')
ON CONFLICT DO NOTHING;

-- Also add 3 pending profiles for the admin panel demo
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES
  ('a1000001-0000-0000-0000-000000000051', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pending1@demo.sbfe', '$2a$10$demo', now(), now() - interval '2 hours', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000052', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pending2@demo.sbfe', '$2a$10$demo', now(), now() - interval '6 hours', now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a1000001-0000-0000-0000-000000000053', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pending3@demo.sbfe', '$2a$10$demo', now(), now() - interval '1 day', now(), '', '{"provider":"email","providers":["email"]}', '{}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, name, address, section, avatar_initials, status, role, show_address, created_at) VALUES
  ('a1000001-0000-0000-0000-000000000051', 'Rachel Cooper',   '9400 E Calle de Valle',  'Section 4', 'RC', 'pending', 'member', false, now() - interval '2 hours'),
  ('a1000001-0000-0000-0000-000000000052', 'Liam Foster',     '7900 E Cholla Ln',       'Section 1', 'LF', 'pending', 'member', false, now() - interval '6 hours'),
  ('a1000001-0000-0000-0000-000000000053', 'Megan Torres',    '8800 E Desert Willow Dr', 'Section 3', 'MT', 'pending', 'member', false, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;


-- Done! Your app should now be full of realistic community activity.
