import { supabase } from "./supabase";
import type { Category } from "./data";
import { isDemo, demo } from "./demo";

export async function uploadPostImage(userId: string, file: File): Promise<string | null> {
  if (isDemo()) return demo.uploadImage(file) as any;
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("post-images").upload(path, file);
  if (error) return null;
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function getPosts(category?: Category) {
  if (isDemo()) return demo.getPosts(category) as any;
  let query = supabase
    .from("posts")
    .select(`
      *,
      author:profiles!author_id(id, name, avatar_initials, address, section, show_address),
      likes(user_id),
      comments(id)
    `)
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createPost(authorId: string, category: Category, title: string, body: string, imageUrl?: string) {
  if (isDemo()) return demo.createPost(authorId, category, title, body, imageUrl) as any;
  const { data, error } = await supabase
    .from("posts")
    .insert({ author_id: authorId, category, title, body, image_url: imageUrl })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleLike(postId: string, userId: string) {
  if (isDemo()) return demo.toggleLike(postId, userId) as any;
  const { data: existing } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", userId);
    return false;
  } else {
    await supabase.from("likes").insert({ post_id: postId, user_id: userId });
    return true;
  }
}

export async function getEvents() {
  if (isDemo()) return demo.getEvents() as any;
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      author:profiles!author_id(name, avatar_initials),
      rsvps(user_id)
    `)
    .gte("event_date", new Date().toISOString().split("T")[0])
    .order("event_date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getEvent(eventId: string) {
  if (isDemo()) return demo.getEvent(eventId) as any;
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      author:profiles!author_id(id, name, avatar_initials, section),
      rsvps(user_id, profiles:profiles!user_id(name, avatar_initials))
    `)
    .eq("id", eventId)
    .single();
  if (error) throw error;
  return data;
}

export async function createEvent(authorId: string, title: string, description: string, eventDate: string, eventTime: string, location: string, imageUrl?: string) {
  if (isDemo()) return demo.createEvent(authorId, title, description, eventDate, eventTime, location, imageUrl) as any;
  const { data, error } = await supabase
    .from("events")
    .insert({ author_id: authorId, title, description, event_date: eventDate, event_time: eventTime, location, image_url: imageUrl ?? null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleRsvp(eventId: string, userId: string) {
  if (isDemo()) return demo.toggleRsvp(eventId, userId) as any;
  const { data: existing } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    await supabase.from("rsvps").delete().eq("event_id", eventId).eq("user_id", userId);
    return false;
  } else {
    await supabase.from("rsvps").insert({ event_id: eventId, user_id: userId });
    return true;
  }
}

export async function getNotifications(userId: string) {
  if (isDemo()) return demo.getNotifications(userId) as any;
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data;
}

export async function markNotificationRead(notifId: string) {
  if (isDemo()) return demo.markNotificationRead(notifId) as any;
  await supabase.from("notifications").update({ read: true }).eq("id", notifId);
}

export async function getPendingProfiles() {
  if (isDemo()) return demo.getPendingProfiles() as any;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function approveProfile(profileId: string) {
  if (isDemo()) return demo.approveProfile(profileId) as any;
  const { error } = await supabase
    .from("profiles")
    .update({ status: "approved" })
    .eq("id", profileId);
  if (error) throw error;

  await supabase.from("notifications").insert({
    user_id: profileId,
    type: "approved",
    message: "Welcome to Sunburst Farms! Your account has been approved. Start sharing with your neighbors!",
  });
}

export async function denyProfile(profileId: string) {
  if (isDemo()) return demo.denyProfile(profileId) as any;
  const { error } = await supabase
    .from("profiles")
    .update({ status: "denied" })
    .eq("id", profileId);
  if (error) throw error;
}

export async function getAllProfiles() {
  if (isDemo()) return demo.getAllProfiles() as any;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addComment(postId: string, authorId: string, body: string) {
  if (isDemo()) return demo.addComment(postId, authorId, body) as any;
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: authorId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getComments(postId: string) {
  if (isDemo()) return demo.getComments(postId) as any;
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      author:profiles!author_id(name, avatar_initials)
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getListing(listingId: string) {
  if (isDemo()) return demo.getListing(listingId) as any;
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      seller:profiles!seller_id(id, name, avatar_initials, section),
      listing_images(id, image_url, position)
    `)
    .eq("id", listingId)
    .single();
  if (error) throw error;
  return data;
}

export async function getListings(category?: string) {
  if (isDemo()) return demo.getListings(category) as any;
  let query = supabase
    .from("listings")
    .select(`
      *,
      seller:profiles!seller_id(name, avatar_initials, section),
      listing_images(id, image_url, position)
    `)
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createListing(
  sellerId: string,
  title: string,
  description: string,
  category: string,
  condition: string,
  price: number | null,
  isFree: boolean,
  imageUrls?: string[]
) {
  if (isDemo()) return demo.createListing(sellerId, title, description, category, condition, price, isFree, imageUrls) as any;
  const { data, error } = await supabase
    .from("listings")
    .insert({
      seller_id: sellerId,
      title,
      description,
      category,
      condition,
      price,
      is_free: isFree,
      image_url: imageUrls?.[0] ?? null,
    })
    .select()
    .single();
  if (error) throw error;

  if (imageUrls && imageUrls.length > 0) {
    const rows = imageUrls.map((url, i) => ({
      listing_id: data.id,
      image_url: url,
      position: i,
    }));
    const { error: imgError } = await supabase.from("listing_images").insert(rows);
    if (imgError) console.error("listing_images insert error:", imgError.message);
  }

  return data;
}

export async function markListingSold(listingId: string) {
  if (isDemo()) return demo.updateListingStatus(listingId, "sold") as any;
  const { error } = await supabase
    .from("listings")
    .update({ status: "sold" })
    .eq("id", listingId);
  if (error) throw error;
}

export async function uploadListingImage(userId: string, file: File): Promise<string | null> {
  if (isDemo()) return demo.uploadImage(file) as any;
  const ext = file.name.split(".").pop();
  const path = `listings/${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("post-images").upload(path, file);
  if (error) return null;
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function getConversations(userId: string) {
  if (isDemo()) return demo.getConversations(userId) as any;
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:profiles!sender_id(id, name, avatar_initials, section),
      recipient:profiles!recipient_id(id, name, avatar_initials, section)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const convMap = new Map<string, any>();
  for (const msg of data ?? []) {
    const otherId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
    if (!convMap.has(otherId)) {
      const other = msg.sender_id === userId ? msg.recipient : msg.sender;
      convMap.set(otherId, {
        otherUser: {
          id: other.id,
          name: other.name,
          avatarInitials: other.avatar_initials,
          section: other.section,
        },
        lastMessage: msg.body,
        lastMessageAt: msg.created_at,
        unreadCount: msg.recipient_id === userId && !msg.read ? 1 : 0,
      });
    } else if (msg.recipient_id === userId && !msg.read) {
      convMap.get(otherId).unreadCount++;
    }
  }
  return Array.from(convMap.values());
}

export async function getMessages(userId: string, otherUserId: string) {
  if (isDemo()) return demo.getMessages(userId, otherUserId) as any;
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:profiles!sender_id(name, avatar_initials)
    `)
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`
    )
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendMessage(senderId: string, recipientId: string, body: string) {
  if (isDemo()) return demo.sendMessage(senderId, recipientId, body) as any;
  const { data, error } = await supabase
    .from("messages")
    .insert({ sender_id: senderId, recipient_id: recipientId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markMessagesRead(userId: string, otherUserId: string) {
  if (isDemo()) return demo.markMessagesRead(userId, otherUserId) as any;
  await supabase
    .from("messages")
    .update({ read: true })
    .eq("sender_id", otherUserId)
    .eq("recipient_id", userId)
    .eq("read", false);
}

export async function getProfile(userId: string) {
  if (isDemo()) return demo.getProfile(userId) as any;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function uploadEventPhoto(userId: string, eventId: string, file: File): Promise<string | null> {
  if (isDemo()) return demo.uploadImage(file) as any;
  const ext = file.name.split(".").pop();
  const path = `${userId}/event-${eventId}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("post-images").upload(path, file);
  if (error) {
    console.error("Storage upload error:", error.message);
    return null;
  }
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function addEventPhoto(eventId: string, userId: string, imageUrl: string) {
  if (isDemo()) return demo.addEventPhoto(eventId, userId, imageUrl) as any;
  const { data, error } = await supabase
    .from("event_photos")
    .insert({ event_id: eventId, user_id: userId, image_url: imageUrl })
    .select(`*, uploader:profiles!user_id(name, avatar_initials)`)
    .single();
  if (error) throw error;
  return data;
}

export async function getEventPhotos(eventId: string) {
  if (isDemo()) return demo.getEventPhotos(eventId) as any;
  const { data, error } = await supabase
    .from("event_photos")
    .select(`*, uploader:profiles!user_id(name, avatar_initials)`)
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteEventPhoto(photoId: string, userId: string) {
  if (isDemo()) return demo.deleteEventPhoto(photoId) as any;
  const { error } = await supabase
    .from("event_photos")
    .delete()
    .eq("id", photoId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function getVendors(category?: string) {
  if (isDemo()) return demo.getVendors(category) as any;
  let query = supabase
    .from("vendors")
    .select("*, recommender:profiles!recommended_by(name)")
    .eq("status", "approved")
    .order("tier", { ascending: false })
    .order("business_name", { ascending: true });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getPendingVendors() {
  if (isDemo()) return demo.getPendingVendors() as any;
  const { data, error } = await supabase
    .from("vendors")
    .select("*, recommender:profiles!recommended_by(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function recommendVendor(
  userId: string,
  businessName: string,
  category: string,
  phone: string,
  description?: string,
  email?: string,
  website?: string,
  imageUrl?: string,
) {
  if (isDemo()) return demo.recommendVendor(userId, businessName, category, phone, description, email, website) as any;
  const { data, error } = await supabase
    .from("vendors")
    .insert({
      business_name: businessName,
      category,
      phone,
      description: description || null,
      email: email || null,
      website: website || null,
      image_url: imageUrl || null,
      recommended_by: userId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function approveVendor(vendorId: string, tier: "free" | "featured" = "free") {
  if (isDemo()) return demo.approveVendor(vendorId, tier) as any;
  const { error } = await supabase
    .from("vendors")
    .update({ status: "approved", tier })
    .eq("id", vendorId);
  if (error) throw error;
}

export async function denyVendor(vendorId: string) {
  if (isDemo()) return demo.denyVendor(vendorId) as any;
  const { error } = await supabase
    .from("vendors")
    .update({ status: "denied" })
    .eq("id", vendorId);
  if (error) throw error;
}

export async function updateVendorTier(vendorId: string, tier: "free" | "featured") {
  if (isDemo()) return undefined as any;
  const { error } = await supabase
    .from("vendors")
    .update({ tier })
    .eq("id", vendorId);
  if (error) throw error;
}

export async function deleteVendor(vendorId: string) {
  if (isDemo()) return undefined as any;
  const { error } = await supabase
    .from("vendors")
    .delete()
    .eq("id", vendorId);
  if (error) throw error;
}

export async function updateProfileVisibility(profileId: string, showAddress: boolean) {
  if (isDemo()) return demo.updateProfileVisibility() as any;
  const { error } = await supabase
    .from("profiles")
    .update({ show_address: showAddress })
    .eq("id", profileId);
  if (error) throw error;
}

/* ---------- Added in the redesign ---------- */

export async function getPost(postId: string) {
  if (isDemo()) return demo.getPost(postId) as any;
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles!author_id(id, name, avatar_initials, address, section, show_address),
      likes(user_id),
      comments(id)
    `)
    .eq("id", postId)
    .single();
  if (error) throw error;
  return data;
}

/** Authors mark their own give-away post as claimed (RLS only allows author updates). */
export async function markPostClaimed(postId: string, authorId: string, claimed: boolean) {
  if (isDemo()) return demo.markPostClaimed(postId, authorId, claimed) as any;
  const { error } = await supabase
    .from("posts")
    .update({ claimed_by: claimed ? authorId : null })
    .eq("id", postId)
    .eq("author_id", authorId);
  if (error) throw error;
}

export async function deletePost(postId: string, authorId: string) {
  if (isDemo()) return demo.deletePost(postId) as any;
  const { error, count } = await supabase
    .from("posts")
    .delete({ count: "exact" })
    .eq("id", postId)
    .eq("author_id", authorId);
  if (error) throw error;
  if (!count) throw new Error("not_permitted");
}

export async function deleteListing(listingId: string, sellerId: string) {
  if (isDemo()) return demo.deleteListing(listingId) as any;
  const { error, count } = await supabase
    .from("listings")
    .delete({ count: "exact" })
    .eq("id", listingId)
    .eq("seller_id", sellerId);
  if (error) throw error;
  if (!count) throw new Error("not_permitted");
}

export async function updateListingStatus(listingId: string, status: "available" | "pending" | "sold") {
  if (isDemo()) return demo.updateListingStatus(listingId, status) as any;
  const { error } = await supabase.from("listings").update({ status }).eq("id", listingId);
  if (error) throw error;
}

export async function getMyListings(sellerId: string) {
  if (isDemo()) return demo.getMyListings(sellerId) as any;
  const { data, error } = await supabase
    .from("listings")
    .select(`*, listing_images(id, image_url, position)`)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteEvent(eventId: string, authorId: string) {
  if (isDemo()) return demo.deleteEvent(eventId) as any;
  const { error, count } = await supabase
    .from("events")
    .delete({ count: "exact" })
    .eq("id", eventId)
    .eq("author_id", authorId);
  if (error) throw error;
  if (!count) throw new Error("not_permitted");
}

export async function getUnreadCounts(userId: string) {
  if (isDemo()) return demo.getUnreadCounts(userId) as any;
  const [msgs, notifs] = await Promise.all([
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("recipient_id", userId).eq("read", false),
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("read", false),
  ]);
  return { messages: msgs.count ?? 0, notifications: notifs.count ?? 0 };
}

/* Irrigation status. Backed by the irrigation_updates table from
   migrations/2026-11-01-irrigation.sql. Until that migration runs, these
   return null and the Irrigation screen falls back to the association website. */

export type IrrigationStatus = "awaiting" | "estimated" | "confirmed" | "delayed";

export interface IrrigationUpdate {
  id: string;
  status: IrrigationStatus;
  window_start: string | null;
  window_end: string | null;
  note: string | null;
  created_at: string;
  author?: { name: string } | null;
}

export async function getLatestIrrigation(): Promise<IrrigationUpdate | null | undefined> {
  if (isDemo()) return demo.getLatestIrrigation() as any;
  const { data, error } = await supabase
    .from("irrigation_updates")
    .select("*, author:profiles!author_id(name)")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    // Table missing or not readable: caller treats undefined as "feature not set up"
    return undefined;
  }
  return data as IrrigationUpdate | null;
}

export async function getIrrigationHistory(limit = 10): Promise<IrrigationUpdate[]> {
  if (isDemo()) return demo.getIrrigationHistory() as any;
  const { data, error } = await supabase
    .from("irrigation_updates")
    .select("*, author:profiles!author_id(name)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as IrrigationUpdate[];
}

export async function publishIrrigationUpdate(
  authorId: string,
  status: IrrigationStatus,
  windowStart: string | null,
  windowEnd: string | null,
  note: string | null,
) {
  if (isDemo()) return demo.publishIrrigationUpdate(authorId, status, windowStart, windowEnd, note) as any;
  const { data, error } = await supabase
    .from("irrigation_updates")
    .insert({ author_id: authorId, status, window_start: windowStart, window_end: windowEnd, note })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function notifyAllApproved(type: string, message: string) {
  if (isDemo()) return demo.notifyAllApproved() as any;
  // Fan out a notification to every approved resident. Only used by board tools.
  const { data: profiles, error } = await supabase.from("profiles").select("id").eq("status", "approved");
  if (error) throw error;
  const rows = (profiles ?? []).map((p) => ({ user_id: p.id, type, message }));
  if (rows.length === 0) return 0;
  const { error: insErr } = await supabase.from("notifications").insert(rows);
  if (insErr) throw insErr;
  return rows.length;
}
