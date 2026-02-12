-- Seed data: Baw's 40th Birthday Oahu Trip
-- Feb 19-23, 2025 — 5 days, 21 activities

-- Trip
INSERT INTO trip (id, title, destination, start_date, end_date, description, created_at)
VALUES (
  'trip-oahu-2025',
  'Baw''s 40th Birthday Oahu',
  'Oahu, Hawaii',
  '2025-02-19',
  '2025-02-23',
  'Birthday celebration trip to Oahu. Guest groups: Long Beach (Kimmy, Linda, Tudy, Thien, Clarice), ABQ (Baw, Thy, Bu, Claudia, Ginger), TX (Kathy, Ellaine). Points of interest: Banzai Pipeline at Ehukai Beach Park, Rocky Point, Shark''s Cove, Ka''ena Point. Turtle spotting: Laniakea Beach.',
  unixepoch() * 1000
);

-- Day 1: Thursday 2/19 — Arrivals & Welcome
INSERT INTO day (id, trip_id, date, title, sort_order, created_at) VALUES
  ('day-1', 'trip-oahu-2025', '2025-02-19', 'Arrivals & Welcome', 1, unixepoch() * 1000);

INSERT INTO activity (id, day_id, title, start_time, location, category, notes, sort_order, created_at) VALUES
  ('act-1-1', 'day-1', 'Long Beach group arrives',    '11:35', NULL,        'travel',        'Kimmy, Linda, Tudy, Thien, Clarice', 1, unixepoch() * 1000),
  ('act-1-2', 'day-1', 'ABQ & Elaine arrives',        '12:45', NULL,        'travel',        NULL, 2, unixepoch() * 1000),
  ('act-1-3', 'day-1', 'Kathy & Ginger arrives',      '14:33', NULL,        'travel',        NULL, 3, unixepoch() * 1000),
  ('act-1-4', 'day-1', 'Check In',                    '15:00', NULL,        'lodging',       NULL, 4, unixepoch() * 1000),
  ('act-1-5', 'day-1', 'Kale Hale BBQ',               '19:15', 'Kale Hale', 'food',          'Hosted by Bu', 5, unixepoch() * 1000),
  ('act-1-6', 'day-1', 'Cirque De Soleil',            '20:00', NULL,        'entertainment', NULL, 6, unixepoch() * 1000);

-- Day 2: Friday 2/20 — North Shore & Waikiki
INSERT INTO day (id, trip_id, date, title, sort_order, created_at) VALUES
  ('day-2', 'trip-oahu-2025', '2025-02-20', 'North Shore & Waikiki', 2, unixepoch() * 1000);

INSERT INTO activity (id, day_id, title, start_time, location, category, notes, sort_order, created_at) VALUES
  ('act-2-1', 'day-2', 'Waimano Falls / Koko Head Hike', NULL,    'Waimano Falls / Koko Head', 'sightseeing',   NULL, 1, unixepoch() * 1000),
  ('act-2-2', 'day-2', 'North Shore Lunch',              NULL,    'North Shore',               'food',          'Dole''s, Shrimp truck, Whale and turtle hunt', 2, unixepoch() * 1000),
  ('act-2-3', 'day-2', 'Waikiki Beach',                  NULL,    'Waikiki Beach',             'sightseeing',   'White outfit', 3, unixepoch() * 1000),
  ('act-2-4', 'day-2', 'Mahina & Sun''s Dinner',         '18:30', 'Mahina & Sun''s',           'food',          'Hosted by Bu & Thy. Reservations at 6:30/6:45pm', 4, unixepoch() * 1000);

-- Day 3: Saturday 2/21 — Golf, Omakase & Cruise
INSERT INTO day (id, trip_id, date, title, sort_order, created_at) VALUES
  ('day-3', 'trip-oahu-2025', '2025-02-21', 'Golf, Omakase & Cruise', 3, unixepoch() * 1000);

INSERT INTO activity (id, day_id, title, start_time, location, category, notes, sort_order, created_at) VALUES
  ('act-3-1', 'day-3', 'Bayview Golf',               '07:00', 'Bayview Golf Course', 'sightseeing',   NULL, 1, unixepoch() * 1000),
  ('act-3-2', 'day-3', 'Amatersu Omakase',           '13:00', 'Amatersu',            'food',          'Hosted by Thy', 2, unixepoch() * 1000),
  ('act-3-3', 'day-3', 'Sunset Booze Cruise',        '17:30', NULL,                  'entertainment', 'Hawaiian/flora attire', 3, unixepoch() * 1000),
  ('act-3-4', 'day-3', 'Waikiki stroll / Beach picnic', NULL, 'Waikiki',             'sightseeing',   NULL, 4, unixepoch() * 1000);

-- Day 4: Sunday 2/22 — Sandbar Tour & Departures
INSERT INTO day (id, trip_id, date, title, sort_order, created_at) VALUES
  ('day-4', 'trip-oahu-2025', '2025-02-22', 'Sandbar Tour & Departures', 4, unixepoch() * 1000);

INSERT INTO activity (id, day_id, title, start_time, end_time, location, category, notes, sort_order, created_at) VALUES
  ('act-4-1', 'day-4', 'Kaneohe Sandbar Tour', '12:30', '16:30', 'Kaneohe Bay', 'sightseeing', 'Black swimsuits with blue/white/black covers', 1, unixepoch() * 1000),
  ('act-4-2', 'day-4', 'ABQ and TX departs',   '23:00', NULL,    NULL,          'departure',   NULL, 2, unixepoch() * 1000);

-- Day 5: Monday 2/23 — Checkout & Departures
INSERT INTO day (id, trip_id, date, title, sort_order, created_at) VALUES
  ('day-5', 'trip-oahu-2025', '2025-02-23', 'Checkout & Departures', 5, unixepoch() * 1000);

INSERT INTO activity (id, day_id, title, start_time, location, category, notes, sort_order, created_at) VALUES
  ('act-5-1', 'day-5', 'Claudia departs',                '09:00', NULL, 'departure', NULL, 1, unixepoch() * 1000),
  ('act-5-2', 'day-5', 'Check Out',                      '11:00', NULL, 'lodging',   NULL, 2, unixepoch() * 1000),
  ('act-5-3', 'day-5', 'Clarice, Tudy, Thein departs',   '13:40', NULL, 'departure', NULL, 3, unixepoch() * 1000),
  ('act-5-4', 'day-5', 'Linda, Kimmy departs',           '13:55', NULL, 'departure', NULL, 4, unixepoch() * 1000),
  ('act-5-5', 'day-5', 'Phoenix, David departs',         '21:55', NULL, 'departure', NULL, 5, unixepoch() * 1000);
