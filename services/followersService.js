import { supabase } from "../lib/supabase";

// Fetch users following the given user
export const getFollowers = async (userId) => {
  try {
    // Step 1: Fetch follower ids
    const { data: followerIds, error: followersError } = await supabase
      .from("followers")
      .select("follower_id")
      .eq("followed_id", userId);

    if (followersError) throw followersError;

    // Step 2: Fetch user details for each follower
    if (followerIds.length > 0) {
      const followerIdsList = followerIds.map(f => f.follower_id);

      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, name, bio, image, is_verified")
        .in("id", followerIdsList);  // Use the 'in' operator to fetch users by their ids

      if (usersError) throw usersError;

      // Combine the followers' ids with their user data
      const followersWithDetails = followerIds.map(f => {
        const user = users.find(u => u.id === f.follower_id);
        return { ...f, users: user };
      });

      return followersWithDetails;
    } else {
      return [];
    }

  } catch (error) {
    console.error("Error fetching followers:", error.message);
    return [];
  }
};


export const getFollowing = async (userId) => {
  if (!userId) {
    console.error("getFollowing called with undefined userId");
    return [];
  }

  try {
    // Step 1: Fetch followed user IDs
    const { data: followingIds, error: followingError } = await supabase
      .from("followers")
      .select("followed_id")
      .eq("follower_id", userId);

    if (followingError) throw followingError;
    if (!followingIds || followingIds.length === 0) return [];

    // Extract followed IDs correctly
    const followingIdsList = followingIds.map(f => f.followed_id).filter(id => id); // Ensure no undefined values

    // Step 2: Fetch user details
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, bio, image, is_verified")
      .in("id", followingIdsList);

    if (usersError) throw usersError;

    // Combine user data with followed IDs
    const followingsWithDetails = followingIds.map(f => {
      const user = users.find(u => u.id === f.followed_id);
      return user ? { ...f, users: user } : null;
    }).filter(Boolean); // Remove null values

    return followingsWithDetails;
  } catch (error) {
    console.error("Error fetching followings:", error.message);
    return [];
  }
};



// Check if a user follows another
export const isFollowing = async (userId, otherUserId) => {
  try {
    const { data, error } = await supabase
      .from("followers")
      .select("*")
      .or(`follower_id.eq.${userId},followed_id.eq.${otherUserId}`)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking following status:", error.message);
    return false;
  }
};

// Send follow request
export const sendFollowRequest = async (followerId, followedId) => {
  try {
    const { data, error } = await supabase
      .from("follow_requests")
      .insert([{ follower_id: followerId, followed_id: followedId }]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sending follow request:", error.message);
    return null;
  }
};

// Approve follow request
export const approveFollowRequest = async (requestId, followerId, followedId) => {
  try {
    await supabase.from("followers").insert([{ follower_id: followerId, followed_id: followedId }]);
    await supabase.from("follow_requests").delete().eq("id", requestId);
    return true;
  } catch (error) {
    console.error("Error approving follow request:", error.message);
    return false;
  }
};

// Reject follow request
export const rejectFollowRequest = async (requestId) => {
  try {
    await supabase.from("follow_requests").delete().eq("id", requestId);
    return true;
  } catch (error) {
    console.error("Error rejecting follow request:", error.message);
    return false;
  }
};
