
-- Insert channel: Ball Handling Fundamentals
INSERT INTO community_channel (
  id, slug, title, description, "longDescription", category, status,
  "coverImage", "thumbnailImage", "requiredTierLevel", "isFeatured",
  tags, "videoCount", "metaTitle", "metaDescription", "sortOrder",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  'ball-handling-fundamentals',
  'Ball Handling Fundamentals',
  'Master essential ball handling skills with no-court drills you can practice anywhere. Develop coordination, control, and confidence with the basketball.',
  'Transform your ball handling skills with this comprehensive program designed for players at all levels. These drills require no court access and can be practiced in your driveway, garage, or any open space. Learn fundamental techniques including pound dribbles, crossovers, figure-8s, and advanced combinations. Each episode focuses on building muscle memory, improving hand-eye coordination, and developing the ball control needed to excel on the court. Perfect for daily practice sessions and building a strong foundation for your game.',
  'basketball',
  'published',
  '/optimized/0K0A0925.jpg',
  '/optimized/0K0A0925.jpg',
  1,
  true,
  '["ball-handling","dribbling","fundamentals","no-court","training","basketball-skills"]'::jsonb,
  0,
  'Ball Handling Fundamentals - No Court Required Basketball Training',
  'Master ball handling skills with professional basketball drills you can practice anywhere. Learn pound dribbles, crossovers, figure-8s, and advanced combinations.',
  1,
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "longDescription" = EXCLUDED."longDescription",
  "updatedAt" = '2025-12-10T17:07:25.443Z'
RETURNING id;



-- Insert video: Ball Handling & Footwork Introduction (Episode 1)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'ball-handling-footwork-introduction',
  'Ball Handling & Footwork Introduction',
  'Introduction to ball handling fundamentals and footwork. Learn the basics of proper technique and body positioning for effective ball control.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e1.mp4',
  NULL,
  NULL,
  true,
  1,
  1,
  1,
  'published',
  0,
  '["ball-handling","footwork","introduction","fundamentals"]'::jsonb,
  'Ball Handling & Footwork Introduction - Episode 1',
  'Learn the fundamentals of ball handling and footwork with proper technique and body positioning.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Ball Handling Pound Drill (Episode 2)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'ball-handling-pound-drill',
  'Ball Handling Pound Drill',
  'Master the foundational pound dribble drill. Practice variations including pound to the knee and higher pound techniques to build strength and control.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e2.mp4',
  NULL,
  NULL,
  false,
  2,
  1,
  2,
  'published',
  0,
  '["pound-dribble","ball-handling","drills","fundamentals"]'::jsonb,
  'Ball Handling Pound Drill - Episode 2',
  'Learn the pound dribble drill with variations to build ball handling strength and control.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Injured Player Ball Handling Drills (Episode 3)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'injured-player-ball-handling-drills',
  'Injured Player Ball Handling Drills',
  'Maintain your ball handling skills even when injured. Practice variations around the body to keep your touch sharp during recovery.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e3.mp4',
  NULL,
  NULL,
  false,
  3,
  1,
  2,
  'published',
  0,
  '["injured-training","ball-handling","recovery","variations"]'::jsonb,
  'Injured Player Ball Handling Drills - Episode 3',
  'Maintain ball handling skills during injury recovery with body movement variations.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Advanced Footwork Drills (Episode 4)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'advanced-footwork-drills',
  'Advanced Footwork Drills',
  'Develop quick feet and better coordination with advanced footwork drills. Improve your agility and movement patterns for better on-court performance.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e4.mp4',
  NULL,
  NULL,
  false,
  4,
  1,
  2,
  'published',
  0,
  '["footwork","agility","coordination","advanced"]'::jsonb,
  'Advanced Footwork Drills - Episode 4',
  'Improve agility and coordination with advanced footwork drills for basketball.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Dribble Drag Drill (Episode 5)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'dribble-drag-drill',
  'Dribble Drag Drill',
  'Master the dribble drag technique to create space and maintain control. Learn how to effectively use this move to beat defenders.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e5.mp4',
  NULL,
  NULL,
  false,
  5,
  1,
  2,
  'published',
  0,
  '["dribble-drag","ball-handling","moves","technique"]'::jsonb,
  'Dribble Drag Drill - Episode 5',
  'Learn the dribble drag technique to create space and maintain ball control.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Pound Between the Legs & Behind the Back (Episode 6)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'pound-between-legs-behind-back',
  'Pound Between the Legs & Behind the Back',
  'Advanced pound dribble variations including between the legs and behind the back techniques. Build advanced ball handling skills with expert commentary.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e6.mp4',
  NULL,
  NULL,
  false,
  6,
  1,
  2,
  'published',
  0,
  '["pound-dribble","between-legs","behind-back","advanced"]'::jsonb,
  'Pound Between the Legs & Behind the Back - Episode 6',
  'Master advanced pound dribble variations including between the legs and behind the back techniques.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Pound Dribble Front Cross Combinations (Episode 7)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'pound-dribble-front-cross-combinations',
  'Pound Dribble Front Cross Combinations',
  'Learn pound dribble into front cross combinations. Master these essential combo moves to keep defenders guessing and improve your ball handling repertoire.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e7.mp4',
  NULL,
  NULL,
  false,
  7,
  1,
  2,
  'published',
  0,
  '["pound-dribble","crossover","combinations","moves"]'::jsonb,
  'Pound Dribble Front Cross Combinations - Episode 7',
  'Master pound dribble into front cross combinations for advanced ball handling.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Pre-Practice Warm Up Routine (Episode 8)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'pre-practice-warm-up-routine',
  'Pre-Practice Warm Up Routine',
  'Essential warm-up routine to prepare your body and hands for ball handling practice. Get your muscles ready and prevent injury with proper preparation.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e8.mp4',
  NULL,
  NULL,
  false,
  8,
  1,
  2,
  'published',
  0,
  '["warm-up","preparation","injury-prevention","routine"]'::jsonb,
  'Pre-Practice Warm Up Routine - Episode 8',
  'Essential warm-up routine to prepare for ball handling practice and prevent injury.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Figure 8 Ball Handling Drill (Episode 9)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'figure-8-ball-handling-drill',
  'Figure 8 Ball Handling Drill',
  'Master the classic figure-8 drill to improve hand coordination and ball control. This fundamental exercise builds the foundation for advanced moves.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e9.mp4',
  NULL,
  NULL,
  false,
  9,
  1,
  2,
  'published',
  0,
  '["figure-8","ball-handling","coordination","fundamentals"]'::jsonb,
  'Figure 8 Ball Handling Drill - Episode 9',
  'Master the figure-8 drill to improve hand coordination and ball control.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Double Punch to Double Behind the Back (Episode 10)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'double-punch-double-behind-back',
  'Double Punch to Double Behind the Back',
  'Advanced combination move: double punch to double behind the back. Learn the technique and timing with detailed explanation to execute this move effectively.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e10.mp4',
  NULL,
  NULL,
  false,
  10,
  1,
  2,
  'published',
  0,
  '["advanced","combinations","behind-back","technique"]'::jsonb,
  'Double Punch to Double Behind the Back - Episode 10',
  'Master the advanced double punch to double behind the back combination move.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Line Ladder Ball Handling Work (Episode 11)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'line-ladder-ball-handling-work',
  'Line Ladder Ball Handling Work',
  'Improve your ball handling precision and control with line ladder work. Develop better hand-eye coordination and spatial awareness.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e11.mp4',
  NULL,
  NULL,
  false,
  11,
  1,
  2,
  'published',
  0,
  '["ladder-drill","ball-handling","precision","coordination"]'::jsonb,
  'Line Ladder Ball Handling Work - Episode 11',
  'Improve ball handling precision with line ladder drills for better coordination.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Double Pound Double Front Cross (Episode 12)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'double-pound-double-front-cross',
  'Double Pound Double Front Cross',
  'Master the double pound double front cross combination. Learn the rhythm and technique with detailed explanation to execute this advanced move smoothly.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e12.mp4',
  NULL,
  NULL,
  false,
  12,
  1,
  2,
  'published',
  0,
  '["double-pound","crossover","combinations","advanced"]'::jsonb,
  'Double Pound Double Front Cross - Episode 12',
  'Master the double pound double front cross combination with detailed technique explanation.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Wrapping the Ball - Unable to Dribble Training (Episode 13)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'wrapping-ball-unable-dribble-training',
  'Wrapping the Ball - Unable to Dribble Training',
  'Develop ball control and hand strength with wrapping drills when you can''t dribble. Perfect for indoor practice or when space is limited.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e13.mp4',
  NULL,
  NULL,
  false,
  13,
  1,
  2,
  'published',
  0,
  '["ball-wrapping","indoor-training","ball-control","hand-strength"]'::jsonb,
  'Wrapping the Ball Training - Episode 13',
  'Develop ball control with wrapping drills perfect for indoor or limited space practice.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Stretching & Flexibility for Ball Handlers (Episode 14)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'stretching-flexibility-ball-handlers',
  'Stretching & Flexibility for Ball Handlers',
  'Essential stretching routine for ball handlers. Improve flexibility, prevent injury, and maintain mobility for optimal performance.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e14.mp4',
  NULL,
  NULL,
  false,
  14,
  1,
  2,
  'published',
  0,
  '["stretching","flexibility","injury-prevention","recovery"]'::jsonb,
  'Stretching & Flexibility for Ball Handlers - Episode 14',
  'Essential stretching routine to improve flexibility and prevent injury for ball handlers.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Pound Cross Combination Drill (Episode 15)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'pound-cross-combination-drill',
  'Pound Cross Combination Drill',
  'Master the pound cross combination to improve your ability to change direction quickly. Build the muscle memory needed for game situations.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e15.mp4',
  NULL,
  NULL,
  false,
  15,
  1,
  2,
  'published',
  0,
  '["pound-dribble","crossover","combinations","direction-change"]'::jsonb,
  'Pound Cross Combination Drill - Episode 15',
  'Master the pound cross combination for quick direction changes and better ball control.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Figure 8 Technique Explanation (Episode 16)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'figure-8-technique-explanation',
  'Figure 8 Technique Explanation',
  'Detailed explanation of figure-8 ball handling technique. Understand the proper form, common mistakes, and how to maximize effectiveness.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e16.mp4',
  NULL,
  NULL,
  false,
  16,
  1,
  2,
  'published',
  0,
  '["figure-8","technique","explanation","fundamentals"]'::jsonb,
  'Figure 8 Technique Explanation - Episode 16',
  'Learn proper figure-8 technique with detailed explanation of form and common mistakes.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Advanced Line Ladder Work (Episode 17)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'advanced-line-ladder-work',
  'Advanced Line Ladder Work',
  'Take your line ladder work to the next level with advanced patterns and combinations. Challenge yourself with more complex movements.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e17.mp4',
  NULL,
  NULL,
  false,
  17,
  1,
  2,
  'published',
  0,
  '["ladder-drill","advanced","patterns","coordination"]'::jsonb,
  'Advanced Line Ladder Work - Episode 17',
  'Advanced line ladder patterns and combinations for improved ball handling.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Pound Double Between the Legs (Episode 18)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'pound-double-between-legs',
  'Pound Double Between the Legs',
  'Master the pound double between the legs move. Learn the singular through-the-leg technique with proper form and timing.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e18.mp4',
  NULL,
  NULL,
  false,
  18,
  1,
  2,
  'published',
  0,
  '["pound-dribble","between-legs","technique","advanced"]'::jsonb,
  'Pound Double Between the Legs - Episode 18',
  'Master the pound double between the legs move with proper technique and timing.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Training Tips & Best Practices (Episode 19)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'training-tips-best-practices',
  'Training Tips & Best Practices',
  'Essential training tips and best practices for ball handling development. Learn how to structure your practice sessions for maximum improvement.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e19.mp4',
  NULL,
  NULL,
  false,
  19,
  1,
  2,
  'published',
  0,
  '["training-tips","best-practices","practice-structure","development"]'::jsonb,
  'Training Tips & Best Practices - Episode 19',
  'Essential training tips and best practices for effective ball handling development.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Motivational Training Mindset (Episode 20)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'motivational-training-mindset',
  'Motivational Training Mindset',
  'Develop the right mindset for consistent improvement. Learn how to stay motivated and maintain discipline in your daily practice routine.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e20.mp4',
  NULL,
  NULL,
  false,
  20,
  1,
  2,
  'published',
  0,
  '["mindset","motivation","discipline","mental-game"]'::jsonb,
  'Motivational Training Mindset - Episode 20',
  'Develop the right mindset and motivation for consistent ball handling improvement.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Insert video: Lighthearted Training Moments (Episode 21)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1),
  'lighthearted-training-moments',
  'Lighthearted Training Moments',
  'Enjoy some lighthearted moments from training. Remember that improvement comes with consistent practice and a positive attitude.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/ball-handling-s1e21.mp4',
  NULL,
  NULL,
  false,
  21,
  1,
  2,
  'published',
  0,
  '["motivation","fun","training","mindset"]'::jsonb,
  'Lighthearted Training Moments - Episode 21',
  'Enjoy lighthearted training moments and maintain a positive attitude toward improvement.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z',
  '2025-12-10T17:07:25.443Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.443Z';



-- Update video count for channel: Ball Handling Fundamentals
UPDATE community_channel
SET "videoCount" = (
  SELECT COUNT(*) FROM video WHERE "channelId" = (
    SELECT id FROM community_channel WHERE slug = 'ball-handling-fundamentals' LIMIT 1
  )
)
WHERE slug = 'ball-handling-fundamentals';



-- Insert channel: Shooting Fundamentals - Solo Practice
INSERT INTO community_channel (
  id, slug, title, description, "longDescription", category, status,
  "coverImage", "thumbnailImage", "requiredTierLevel", "isFeatured",
  tags, "videoCount", "metaTitle", "metaDescription", "sortOrder",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  'shooting-fundamentals-solo-practice',
  'Shooting Fundamentals - Solo Practice',
  'Master your shooting form and accuracy with solo practice drills. Perfect your jump shot, free throws, and three-point shooting without needing a rebounder.',
  'Transform your shooting game with this comprehensive solo practice program. Learn proper shooting form, develop consistency, and build confidence from all areas of the court. These drills are designed for players practicing alone, focusing on form shooting, jump shots, bank shots, and three-point shooting. Each episode includes detailed explanations of technique, common mistakes, and how to maximize your practice time. Perfect for daily shooting workouts and developing muscle memory for game situations.',
  'basketball',
  'published',
  '/optimized/0K0A0826.jpg',
  '/optimized/0K0A0826.jpg',
  1,
  true,
  '["shooting","form","solo-practice","jump-shot","three-point","fundamentals"]'::jsonb,
  0,
  'Shooting Fundamentals - Solo Practice Basketball Training',
  'Master shooting form and accuracy with solo practice drills. Learn jump shots, free throws, and three-point shooting without a rebounder.',
  2,
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "longDescription" = EXCLUDED."longDescription",
  "updatedAt" = '2025-12-10T17:07:25.444Z'
RETURNING id;



-- Insert video: Bank Shot Fundamentals (Episode 1)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'bank-shot-fundamentals',
  'Bank Shot Fundamentals',
  'Master the art of bank shots from various angles. Learn proper technique, angle selection, and how to use the backboard effectively for consistent scoring.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e1.mp4',
  NULL,
  NULL,
  true,
  1,
  1,
  1,
  'published',
  0,
  '["bank-shot","shooting","fundamentals","backboard"]'::jsonb,
  'Bank Shot Fundamentals - Episode 1',
  'Learn proper bank shot technique and angle selection for consistent scoring.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Regular Jump Shot Form (Episode 2)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'regular-jump-shot-form',
  'Regular Jump Shot Form',
  'Develop consistent jump shot form with proper mechanics. Focus on balance, release point, and follow-through for accurate shooting.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e2.mp4',
  NULL,
  NULL,
  false,
  2,
  1,
  2,
  'published',
  0,
  '["jump-shot","form","shooting-mechanics","technique"]'::jsonb,
  'Regular Jump Shot Form - Episode 2',
  'Develop consistent jump shot form with proper balance, release, and follow-through.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Knee Flossing Stretching Routine (Episode 3)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'knee-flossing-stretching-routine',
  'Knee Flossing Stretching Routine',
  'Essential knee flossing and stretching routine for shooters. Maintain flexibility and prevent injury with proper warm-up and recovery exercises.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e3.mp4',
  NULL,
  NULL,
  false,
  3,
  1,
  2,
  'published',
  0,
  '["stretching","knee-flossing","injury-prevention","recovery"]'::jsonb,
  'Knee Flossing Stretching Routine - Episode 3',
  'Essential stretching routine for shooters to maintain flexibility and prevent injury.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Footwork for Shooting Drills - Explanation (Episode 4)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'footwork-shooting-drills-explanation',
  'Footwork for Shooting Drills - Explanation',
  'Detailed explanation of proper footwork for shooting drills. Learn how foot positioning affects your shot accuracy and consistency.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e4.mp4',
  NULL,
  NULL,
  false,
  4,
  1,
  2,
  'published',
  0,
  '["footwork","shooting","technique","explanation"]'::jsonb,
  'Footwork for Shooting Drills Explanation - Episode 4',
  'Learn proper footwork for shooting drills and how it affects shot accuracy.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Jump Shot Form & Technique Explanation (Episode 5)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'jump-shot-form-technique-explanation',
  'Jump Shot Form & Technique Explanation',
  'Comprehensive explanation of jump shot form and technique. Understand the key components of a successful shot and how to develop consistency.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e5.mp4',
  NULL,
  NULL,
  false,
  5,
  1,
  2,
  'published',
  0,
  '["jump-shot","form","technique","explanation"]'::jsonb,
  'Jump Shot Form & Technique Explanation - Episode 5',
  'Comprehensive guide to jump shot form and technique for consistent shooting.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Dead Leg to Jumper on the Move (Episode 6)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'dead-leg-jumper-on-move',
  'Dead Leg to Jumper on the Move',
  'Master the dead leg to jumper combination for shooting on the move. Learn how to create space and maintain balance while shooting off the dribble.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e6.mp4',
  NULL,
  NULL,
  false,
  6,
  1,
  2,
  'published',
  0,
  '["dead-leg","jumper","on-move","advanced"]'::jsonb,
  'Dead Leg to Jumper on the Move - Episode 6',
  'Master shooting on the move with dead leg to jumper combinations.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Form Shooting Fundamentals (Episode 7)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'form-shooting-fundamentals',
  'Form Shooting Fundamentals',
  'Build your shooting foundation with form shooting drills. Focus on proper mechanics close to the basket before moving to longer distances.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e7.mp4',
  NULL,
  NULL,
  false,
  7,
  1,
  2,
  'published',
  0,
  '["form-shooting","fundamentals","close-range","mechanics"]'::jsonb,
  'Form Shooting Fundamentals - Episode 7',
  'Build shooting foundation with form shooting drills focusing on proper mechanics.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Shooting Drills & Conditioning Explanation (Episode 8)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'shooting-drills-conditioning-explanation',
  'Shooting Drills & Conditioning Explanation',
  'Learn how to combine shooting drills with conditioning for game-like practice. Understand the importance of shooting while fatigued.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e8.mp4',
  NULL,
  NULL,
  false,
  8,
  1,
  2,
  'published',
  0,
  '["shooting-drills","conditioning","game-like","explanation"]'::jsonb,
  'Shooting Drills & Conditioning Explanation - Episode 8',
  'Learn to combine shooting drills with conditioning for game-like practice situations.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Advanced Bank Shot Techniques (Episode 9)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'advanced-bank-shot-techniques',
  'Advanced Bank Shot Techniques',
  'Take your bank shot game to the next level with advanced techniques. Learn when and how to use the backboard from different angles.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e9.mp4',
  NULL,
  NULL,
  false,
  9,
  1,
  2,
  'published',
  0,
  '["bank-shot","advanced","backboard","technique"]'::jsonb,
  'Advanced Bank Shot Techniques - Episode 9',
  'Master advanced bank shot techniques from various angles and positions.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Dead Leg to Jumper - Detailed Explanation (Episode 10)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'dead-leg-jumper-detailed-explanation',
  'Dead Leg to Jumper - Detailed Explanation',
  'Detailed breakdown of the dead leg to jumper move. Learn the footwork, timing, and mechanics needed to execute this advanced shooting technique.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e10.mp4',
  NULL,
  NULL,
  false,
  10,
  1,
  2,
  'published',
  0,
  '["dead-leg","jumper","footwork","explanation"]'::jsonb,
  'Dead Leg to Jumper Detailed Explanation - Episode 10',
  'Detailed breakdown of dead leg to jumper footwork and shooting mechanics.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Form Shooting Technique Breakdown (Episode 11)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'form-shooting-technique-breakdown',
  'Form Shooting Technique Breakdown',
  'In-depth breakdown of form shooting technique. Understand each component of proper shooting form and how to develop consistency.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e11.mp4',
  NULL,
  NULL,
  false,
  11,
  1,
  2,
  'published',
  0,
  '["form-shooting","technique","breakdown","fundamentals"]'::jsonb,
  'Form Shooting Technique Breakdown - Episode 11',
  'In-depth breakdown of form shooting technique and proper mechanics.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: 5 Spot Three-Point Drill (Episode 12)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  '5-spot-three-point-drill',
  '5 Spot Three-Point Drill',
  'Master three-point shooting from five key spots on the court. Develop consistency and accuracy from all three-point positions.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e12.mp4',
  NULL,
  NULL,
  false,
  12,
  1,
  2,
  'published',
  0,
  '["three-point","5-spot","drill","consistency"]'::jsonb,
  '5 Spot Three-Point Drill - Episode 12',
  'Master three-point shooting from five key spots for consistent accuracy.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Arc Drill Behind Backboard (Episode 13)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'arc-drill-behind-backboard',
  'Arc Drill Behind Backboard',
  'Challenge yourself with the arc drill behind the backboard. Improve your shooting arc and develop touch from difficult angles.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e13.mp4',
  NULL,
  NULL,
  false,
  13,
  1,
  2,
  'published',
  0,
  '["arc-drill","backboard","shooting-arc","advanced"]'::jsonb,
  'Arc Drill Behind Backboard - Episode 13',
  'Improve shooting arc and touch with challenging backboard arc drills.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Three-Point Form Shooting (Episode 14)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'three-point-form-shooting',
  'Three-Point Form Shooting',
  'Apply proper form shooting principles to three-point range. Learn how to maintain mechanics while extending your range.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e14.mp4',
  NULL,
  NULL,
  false,
  14,
  1,
  2,
  'published',
  0,
  '["three-point","form-shooting","range","mechanics"]'::jsonb,
  'Three-Point Form Shooting - Episode 14',
  'Apply proper form shooting mechanics to three-point range for consistent accuracy.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Training Day Reflection & Tips (Episode 15)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'training-day-reflection-tips',
  'Training Day Reflection & Tips',
  'Reflect on your training day with valuable insights and tips. Learn how to analyze your shooting performance and make adjustments.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e15.mp4',
  NULL,
  NULL,
  false,
  15,
  1,
  2,
  'published',
  0,
  '["reflection","tips","analysis","improvement"]'::jsonb,
  'Training Day Reflection & Tips - Episode 15',
  'Learn to analyze shooting performance and make adjustments for improvement.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Full Court Three-Point Drill (Episode 16)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'full-court-three-point-drill',
  'Full Court Three-Point Drill',
  'Build endurance and consistency with full court three-point shooting. Challenge yourself to maintain form throughout extended practice.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e16.mp4',
  NULL,
  NULL,
  false,
  16,
  1,
  2,
  'published',
  0,
  '["full-court","three-point","endurance","consistency"]'::jsonb,
  'Full Court Three-Point Drill - Episode 16',
  'Build endurance and consistency with full court three-point shooting practice.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Corner Three-Point Shooting (Episode 17)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'corner-three-point-shooting',
  'Corner Three-Point Shooting',
  'Master corner three-point shooting with proper form and footwork. Develop consistency from one of the most important spots on the court.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e17.mp4',
  NULL,
  NULL,
  false,
  17,
  1,
  2,
  'published',
  0,
  '["corner-three","three-point","shooting","consistency"]'::jsonb,
  'Corner Three-Point Shooting - Episode 17',
  'Master corner three-point shooting with proper form and consistency.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Wing Three-Point Shooting (Episode 18)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'wing-three-point-shooting',
  'Wing Three-Point Shooting',
  'Develop your wing three-point shooting game. Learn proper positioning, footwork, and form for consistent shooting from the wings.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e18.mp4',
  NULL,
  NULL,
  false,
  18,
  1,
  2,
  'published',
  0,
  '["wing-three","three-point","positioning","footwork"]'::jsonb,
  'Wing Three-Point Shooting - Episode 18',
  'Develop consistent wing three-point shooting with proper positioning and form.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Advanced Bank Shot Practice (Episode 19)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'advanced-bank-shot-practice',
  'Advanced Bank Shot Practice',
  'Advanced bank shot practice from various angles and distances. Refine your touch and develop consistency using the backboard.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e19.mp4',
  NULL,
  NULL,
  false,
  19,
  1,
  2,
  'published',
  0,
  '["bank-shot","advanced","practice","backboard"]'::jsonb,
  'Advanced Bank Shot Practice - Episode 19',
  'Advanced bank shot practice from various angles for improved consistency.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Slot Three-Point Shooting & Form Analysis (Episode 20)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'slot-three-point-shooting-form-analysis',
  'Slot Three-Point Shooting & Form Analysis',
  'Master slot three-point shooting with detailed form analysis. Learn why you might be missing shots and how to correct common mistakes.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e20.mp4',
  NULL,
  NULL,
  false,
  20,
  1,
  2,
  'published',
  0,
  '["slot-three","form-analysis","troubleshooting","technique"]'::jsonb,
  'Slot Three-Point Shooting & Form Analysis - Episode 20',
  'Master slot three-point shooting with form analysis and mistake correction.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: 5 Shots in a Row Challenge (Episode 21)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  '5-shots-row-challenge',
  '5 Shots in a Row Challenge',
  'Build consistency and mental toughness with the 5 shots in a row challenge. Develop the focus needed to make consecutive shots.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e21.mp4',
  NULL,
  NULL,
  false,
  21,
  1,
  2,
  'published',
  0,
  '["challenge","consistency","mental-toughness","focus"]'::jsonb,
  '5 Shots in a Row Challenge - Episode 21',
  'Build consistency and mental toughness with consecutive shooting challenges.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Insert video: Daily Training Reflection & Progress (Episode 22)
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1),
  'daily-training-reflection-progress',
  'Daily Training Reflection & Progress',
  'Reflect on your daily training progress and understand what to focus on. Learn how to track improvement and adjust your practice accordingly.',
  'https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/shooting-on-court-s1e22.mp4',
  NULL,
  NULL,
  false,
  22,
  1,
  2,
  'published',
  0,
  '["reflection","progress","tracking","improvement"]'::jsonb,
  'Daily Training Reflection & Progress - Episode 22',
  'Learn to track shooting progress and adjust practice for continuous improvement.',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z',
  '2025-12-10T17:07:25.444Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '2025-12-10T17:07:25.444Z';



-- Update video count for channel: Shooting Fundamentals - Solo Practice
UPDATE community_channel
SET "videoCount" = (
  SELECT COUNT(*) FROM video WHERE "channelId" = (
    SELECT id FROM community_channel WHERE slug = 'shooting-fundamentals-solo-practice' LIMIT 1
  )
)
WHERE slug = 'shooting-fundamentals-solo-practice';
