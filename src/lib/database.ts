import { supabase } from "./supabase";
import type { Category } from "./data";

export async function uploadPostImage(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("post-images").upload(path, file);
  if (error) return null;
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function getPosts(category?: Category) {
  let query = supabase
    .from("posts")
    .select(`
      *,
      author:profiles!author_id(name, avatar_initials, address, section),
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
  const { data, error } = await supabase
    .from("posts")
    .insert({ author_id: authorId, category, title, body, image_url: imageUrl })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleLike(postId: string, userId: string) {
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
  const { data, error } = await supabase
    .from("events")
    .insert({ author_id: authorId, title, description, event_date: eventDate, event_time: eventTime, location, image_url: imageUrl ?? null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleRsvp(eventId: string, userId: string) {
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
  await supabase.from("notifications").update({ read: true }).eq("id", notifId);
}

export async function getPendingProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function approveProfile(profileId: string) {
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
  const { error } = await supabase
    .from("profiles")
    .update({ status: "denied" })
    .eq("id", profileId);
  if (error) throw error;
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addComment(postId: string, authorId: string, body: string) {
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: authorId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getComments(postId: string) {
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
  const { error } = await supabase
    .from("listings")
    .update({ status: "sold" })
    .eq("id", listingId);
  if (error) throw error;
}

export async function uploadListingImage(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `listings/${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("post-images").upload(path, file);
  if (error) return null;
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function getConversations(userId: string) {
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
  const { data, error } = await supabase
    .from("messages")
    .insert({ sender_id: senderId, recipient_id: recipientId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markMessagesRead(userId: string, otherUserId: string) {
  await supabase
    .from("messages")
    .update({ read: true })
    .eq("sender_id", otherUserId)
    .eq("recipient_id", userId)
    .eq("read", false);
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function uploadEventPhoto(userId: string, eventId: string, file: File): Promise<string | null> {
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
  const { data, error } = await supabase
    .from("event_photos")
    .insert({ event_id: eventId, user_id: userId, image_url: imageUrl })
    .select(`*, uploader:profiles!user_id(name, avatar_initials)`)
    .single();
  if (error) throw error;
  return data;
}

export async function getEventPhotos(eventId: string) {
  const { data, error } = await supabase
    .from("event_photos")
    .select(`*, uploader:profiles!user_id(name, avatar_initials)`)
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteEventPhoto(photoId: string, userId: string) {
  const { error } = await supabase
    .from("event_photos")
    .delete()
    .eq("id", photoId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function getVendors(category?: string) {
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
  const { error } = await supabase
    .from("vendors")
    .update({ status: "approved", tier })
    .eq("id", vendorId);
  if (error) throw error;
}

export async function denyVendor(vendorId: string) {
  const { error } = await supabase
    .from("vendors")
    .update({ status: "denied" })
    .eq("id", vendorId);
  if (error) throw error;
}

export async function updateVendorTier(vendorId: string, tier: "free" | "featured") {
  const { error } = await supabase
    .from("vendors")
    .update({ tier })
    .eq("id", vendorId);
  if (error) throw error;
}

export async function deleteVendor(vendorId: string) {
  const { error } = await supabase
    .from("vendors")
    .delete()
    .eq("id", vendorId);
  if (error) throw error;
}

export async function updateProfileVisibility(profileId: string, showAddress: boolean) {
  const { error } = await supabase
    .from("profiles")
    .update({ show_address: showAddress })
    .eq("id", profileId);
  if (error) throw error;
}
