import type { IconName } from "@/components/ui/Icon";

export type Category =
  | "produce"
  | "eggs"
  | "flowers"
  | "seeds"
  | "tools"
  | "events"
  | "general"
  | "lost_found"
  | "safety"
  | "free"
  | "recommendation"
  | "help";

export type ListingCategory = "home_garden" | "furniture" | "tools" | "equestrian" | "electronics" | "vehicles" | "other";

export type ListingCondition = "new" | "like_new" | "good" | "fair";

export interface Post {
  id: string;
  author: { id?: string; name: string; avatar: string; avatarUrl?: string | null; address: string };
  category: Category;
  title: string;
  body: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  claimed?: boolean;
}

export interface Listing {
  id: string;
  seller: { name: string; avatar: string; section: string };
  title: string;
  description: string;
  price: number | null;
  isFree: boolean;
  condition: ListingCondition;
  category: ListingCategory;
  image?: string;
  status: "available" | "sold" | "pending";
  timestamp: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
  author: { name: string; avatar: string; avatarUrl?: string | null };
  image?: string;
  attendeeInitials?: string[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  produce: "Produce",
  eggs: "Eggs",
  flowers: "Flowers",
  seeds: "Seeds & plants",
  tools: "Tools to borrow",
  events: "Event",
  general: "Update",
  lost_found: "Lost & found",
  safety: "Safety alert",
  free: "Free",
  recommendation: "Recommendation",
  help: "Help needed",
};

export const CATEGORY_ICON: Record<Category, IconName> = {
  produce: "leaf",
  eggs: "egg",
  flowers: "flower",
  seeds: "sprout",
  tools: "wrench",
  events: "calendar",
  general: "message-circle",
  lost_found: "paw",
  safety: "alert-triangle",
  free: "gift",
  recommendation: "thumbs-up",
  help: "hand",
};

/** Categories where someone can take the item, so Available / Claimed applies. */
export const GIVEAWAY_CATEGORIES: Category[] = ["produce", "eggs", "flowers", "seeds", "free"];

export type PostKind = "conversation" | "giveaway" | "borrow" | "help" | "lost_found" | "alert";

export function postKind(category: Category): PostKind {
  if (GIVEAWAY_CATEGORIES.includes(category)) return "giveaway";
  if (category === "tools") return "borrow";
  if (category === "help") return "help";
  if (category === "lost_found") return "lost_found";
  if (category === "safety") return "alert";
  return "conversation";
}

/**
 * The action set for each kind of post. "message" opens a conversation with
 * the author; "reply" goes to the post's replies.
 */
export interface PostAction {
  label: string;
  icon: IconName;
  type: "message" | "reply";
  primary?: boolean;
}

export function postActions(category: Category): PostAction[] {
  switch (postKind(category)) {
    case "giveaway":
      return [
        { label: "I'll take it", icon: "hand", type: "message", primary: true },
        { label: "Reply", icon: "reply", type: "reply" },
      ];
    case "borrow":
      return [
        { label: "Ask to borrow", icon: "wrench", type: "message", primary: true },
        { label: "Reply", icon: "reply", type: "reply" },
      ];
    case "help":
      return [
        { label: "Offer help", icon: "hand", type: "message", primary: true },
        { label: "Reply", icon: "reply", type: "reply" },
      ];
    case "lost_found":
      return [
        { label: "Contact owner", icon: "message-circle", type: "message", primary: true },
        { label: "Share a sighting", icon: "eye", type: "reply" },
      ];
    case "alert":
      return [{ label: "Add an update", icon: "reply", type: "reply", primary: true }];
    default:
      return [{ label: "Reply", icon: "reply", type: "reply", primary: true }];
  }
}

/** Plain-language choices for the composer, mapped to categories. */
export const POST_CATEGORY_GROUPS: { title: string; categories: Category[] }[] = [
  { title: "Share with neighbors", categories: ["general", "recommendation", "safety", "lost_found"] },
  { title: "Give away or lend", categories: ["produce", "eggs", "flowers", "seeds", "free", "tools"] },
  { title: "Ask for help", categories: ["help"] },
];

export const LISTING_CATEGORY_LABELS: Record<ListingCategory, string> = {
  home_garden: "Home & garden",
  furniture: "Furniture",
  tools: "Tools",
  equestrian: "Equestrian",
  electronics: "Electronics",
  vehicles: "Vehicles",
  other: "Other",
};

export const LISTING_CATEGORY_ICON: Record<ListingCategory, IconName> = {
  home_garden: "home",
  furniture: "armchair",
  tools: "wrench",
  equestrian: "horseshoe",
  electronics: "smartphone",
  vehicles: "car",
  other: "package",
};

export const LISTING_CONDITION_LABELS: Record<ListingCondition, string> = {
  new: "New",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
};

export const VENDOR_CATEGORIES: { key: string; label: string }[] = [
  { key: "landscaping", label: "Landscaping" },
  { key: "plumbing", label: "Plumbing" },
  { key: "electrical", label: "Electrical" },
  { key: "hvac", label: "HVAC" },
  { key: "handyman", label: "Handyman" },
  { key: "pest_control", label: "Pest control" },
  { key: "pool", label: "Pool service" },
  { key: "roofing", label: "Roofing" },
  { key: "painting", label: "Painting" },
  { key: "fencing", label: "Fencing" },
  { key: "tree_service", label: "Tree service" },
  { key: "cleaning", label: "Cleaning" },
  { key: "garage_doors", label: "Garage doors" },
  { key: "other", label: "Other" },
];

export function vendorCategoryLabel(key: string): string {
  return VENDOR_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export const SECTIONS = ["Section 2", "Section 3", "Section 4", "Section 7"];

export const COMMUNITY_NAME = "Sunburst Farms East";

/* ---------- Development preview content only. Never written to the database. ---------- */

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: { name: "Maria Gonzalez", avatar: "MG", address: "Section 3" },
    category: "eggs",
    title: "Fresh eggs from this morning",
    body: "Our girls were busy today. Two dozen brown eggs available. Just swing by the front porch, they're in the blue cooler. First come first served.",
    image: "https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=800&h=500&fit=crop",
    timestamp: "25 min ago",
    likes: 8,
    comments: 3,
  },
  {
    id: "2",
    author: { name: "Dave Reiter", avatar: "DR", address: "Section 2" },
    category: "safety",
    title: "Coyote spotted near bridle path",
    body: "Heads up, saw a coyote near the south bridle path around 6am this morning. Keep an eye on small pets and chickens today.",
    timestamp: "1 hr ago",
    likes: 11,
    comments: 9,
  },
  {
    id: "3",
    author: { name: "Jake Morrison", avatar: "JM", address: "Section 4" },
    category: "tools",
    title: "Post hole digger available to borrow",
    body: "Just finished my fence project. Happy to lend out the post hole digger this week if anyone needs it.",
    timestamp: "2 hr ago",
    likes: 4,
    comments: 2,
  },
  {
    id: "4",
    author: { name: "Sarah Blackwood", avatar: "SB", address: "Section 7" },
    category: "lost_found",
    title: "Lost: orange tabby cat, answers to Mango",
    body: "Mango slipped out last night near 54th St and Sweetwater. Very friendly, no collar. Please message me if you see him.",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=500&fit=crop",
    timestamp: "3 hr ago",
    likes: 22,
    comments: 5,
  },
  {
    id: "5",
    author: { name: "Patty Nguyen", avatar: "PN", address: "Section 3" },
    category: "recommendation",
    title: "Great experience with Desert Sun Landscaping",
    body: "They redid our front yard irrigation lines last week. On time, fair price, and they cleaned up after themselves. Happy to share their number.",
    timestamp: "5 hr ago",
    likes: 13,
    comments: 4,
  },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "e1",
    title: "Community Potluck at Sereno Park",
    date: "2026-11-15",
    time: "5:00 PM",
    location: "Sereno Park Pavilion",
    description: "Bring a dish to share. Burgers and drinks provided by the community board. Kids welcome, bring lawn chairs.",
    attendees: 34,
    author: { name: "SBFE Board", avatar: "SB" },
    image: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1200&h=700&fit=crop",
    attendeeInitials: ["MG", "DR", "JM", "SB", "PN"],
  },
  {
    id: "e2",
    title: "Saturday Morning Trail Ride",
    date: "2026-11-22",
    time: "7:00 AM",
    location: "Horse Arena on 56th",
    description: "Casual group ride along the bridle paths. All experience levels welcome. Meet at the arena by 6:45.",
    attendees: 12,
    author: { name: "Jake Morrison", avatar: "JM" },
    attendeeInitials: ["JM", "SB", "PN"],
  },
];

export const MOCK_LISTINGS = [
  { id: "l1", title: "Lawn mower, runs great", price: 75, is_free: false, status: "available", category: "home_garden", image_url: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&h=800&fit=crop", seller: { name: "P.A.", section: "Section 3" } },
  { id: "l2", title: "Raised garden beds (set of 2)", price: 150, is_free: false, status: "available", category: "home_garden", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop", seller: { name: "Anne Fischer", section: "Section 5" } },
  { id: "l3", title: "Oak dining chairs", price: null, is_free: true, status: "pending", category: "furniture", image_url: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=800&fit=crop", seller: { name: "Tom Chen", section: "Section 2" } },
  { id: "l4", title: "Western saddle, 16 inch", price: 400, is_free: false, status: "sold", category: "equestrian", image_url: null, seller: { name: "Jake Morrison", section: "Section 4" } },
];
