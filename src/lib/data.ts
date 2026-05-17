export type Category = "produce" | "eggs" | "flowers" | "seeds" | "tools" | "events" | "general";

export interface Post {
  id: string;
  author: { name: string; avatar: string; address: string };
  category: Category;
  title: string;
  body: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  claimed?: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
  author: { name: string; avatar: string };
}

export interface Notification {
  id: string;
  type: "comment" | "claim" | "event" | "welcome";
  message: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  produce: "Produce",
  eggs: "Eggs",
  flowers: "Flowers",
  seeds: "Seeds",
  tools: "Tools",
  events: "Events",
  general: "General",
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  produce: "\u{1F345}",
  eggs: "\u{1F95A}",
  flowers: "\u{1F33B}",
  seeds: "\u{1F331}",
  tools: "\u{1F527}",
  events: "\u{1F389}",
  general: "\u{1F4AC}",
};

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: { name: "Maria Gonzalez", avatar: "MG", address: "Section 3" },
    category: "eggs",
    title: "Fresh eggs from this morning",
    body: "Our girls were busy today! Two dozen brown eggs available. Just swing by the front porch, they're in the blue cooler. First come first served.",
    image: "https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=600&h=400&fit=crop",
    timestamp: "25 min ago",
    likes: 8,
    comments: 3,
  },
  {
    id: "2",
    author: { name: "Tom & Linda Chen", avatar: "TC", address: "Section 2" },
    category: "produce",
    title: "Citrus overflow!",
    body: "Our orange and grapefruit trees went crazy this season. We have bags and bags ready to go. Come grab as many as you want, we'll leave them by the gate all week.",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&h=400&fit=crop",
    timestamp: "1 hr ago",
    likes: 15,
    comments: 7,
  },
  {
    id: "3",
    author: { name: "Jake Morrison", avatar: "JM", address: "Section 4" },
    category: "tools",
    title: "Post hole digger available to borrow",
    body: "Just finished my fence project. Happy to lend out the post hole digger this week if anyone needs it. Text me to arrange pickup.",
    timestamp: "2 hrs ago",
    likes: 4,
    comments: 2,
  },
  {
    id: "4",
    author: { name: "Sarah Blackwood", avatar: "SB", address: "Section 7" },
    category: "flowers",
    title: "Sunflower bouquets ready",
    body: "Cut a bunch of sunflowers this morning. I have about 8 bouquets wrapped and ready on the porch. They're huge this year!",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&h=400&fit=crop",
    timestamp: "3 hrs ago",
    likes: 22,
    comments: 5,
  },
  {
    id: "5",
    author: { name: "Dave Reiter", avatar: "DR", address: "Section 2" },
    category: "general",
    title: "Coyote spotted near bridle path",
    body: "Heads up, saw a coyote near the south bridle path around 6am this morning. Keep an eye on small pets and chickens today.",
    timestamp: "4 hrs ago",
    likes: 11,
    comments: 9,
  },
  {
    id: "6",
    author: { name: "Patty Nguyen", avatar: "PN", address: "Section 3" },
    category: "seeds",
    title: "Heirloom tomato seeds",
    body: "Saved seeds from our best producers this year. Brandywine, Cherokee Purple, and San Marzano. Small bags on the front table, help yourself.",
    timestamp: "5 hrs ago",
    likes: 13,
    comments: 4,
  },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "e1",
    title: "Community Potluck at Sereno Park",
    date: "2026-05-24",
    time: "5:00 PM",
    location: "Sereno Park Pavilion",
    description: "Bring a dish to share! Burgers and drinks provided by the community board. Kids welcome, bring lawn chairs.",
    attendees: 34,
    author: { name: "SBFE Board", avatar: "SB" },
  },
  {
    id: "e2",
    title: "Saturday Morning Trail Ride",
    date: "2026-05-31",
    time: "7:00 AM",
    location: "Horse Arena on 56th",
    description: "Casual group ride along the bridle paths. All experience levels welcome. Meet at the arena by 6:45.",
    attendees: 12,
    author: { name: "Jake Morrison", avatar: "JM" },
  },
  {
    id: "e3",
    title: "Irrigation Schedule Meeting",
    date: "2026-06-03",
    time: "6:30 PM",
    location: "Community Center",
    description: "Summer irrigation schedule discussion and updates from the water committee.",
    attendees: 18,
    author: { name: "SBFE Board", avatar: "SB" },
  },
  {
    id: "e4",
    title: "Neighborhood Seed Swap",
    date: "2026-06-07",
    time: "9:00 AM",
    location: "Sonrisa Park",
    description: "Bring your saved seeds, cuttings, and starter plants. Trade with neighbors for next season's garden.",
    attendees: 21,
    author: { name: "Patty Nguyen", avatar: "PN" },
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "claim",
    message: "Tom Chen claimed your sunflower bouquet!",
    timestamp: "10 min ago",
    read: false,
    avatar: "TC",
  },
  {
    id: "n2",
    type: "comment",
    message: "Maria G. commented on your post: \"We'd love some grapefruit!\"",
    timestamp: "30 min ago",
    read: false,
    avatar: "MG",
  },
  {
    id: "n3",
    type: "event",
    message: "Community Potluck is this Saturday. 34 neighbors going!",
    timestamp: "1 hr ago",
    read: false,
  },
  {
    id: "n4",
    type: "comment",
    message: "Jake M. replied: \"I can drop off the digger tomorrow morning.\"",
    timestamp: "2 hrs ago",
    read: true,
    avatar: "JM",
  },
  {
    id: "n5",
    type: "welcome",
    message: "Welcome to Sunburst Farms! Start by sharing something with your neighbors.",
    timestamp: "1 day ago",
    read: true,
  },
];
