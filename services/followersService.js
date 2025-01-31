import { supabase } from "../lib/supabase";

export const getFollowers = async (userId) => {
    try {
        const { data, error } = await supabase
            .from("followers")
            .select(
                `
                follower_id,
                users!followers_follower_id_fkey (
                    id, name, image, bio, is_verified, last_active
                )
            `
            )
            .eq("followed_id", userId);

        if (error) {
            return { success: false, msg: error?.message };
        }
        return { success: true, data };
    } catch (error) {
        console.log("Error fetching followers:", error);
        return { success: false, msg: error.message };
    }
};

export const getFollowing = async (userId) => {
    try {
        const { data, error } = await supabase
            .from("followers")
            .select(
                `
                followed_id,
                users!followers_followed_id_fkey (
                    id, name, image, bio, is_verified, last_active
                )
            `
            )
            .eq("follower_id", userId);

        if (error) {
            return { success: false, msg: error?.message };
        }
        return { success: true, data };
    } catch (error) {
        console.log("Error fetching following list:", error);
        return { success: false, msg: error.message };
    }
};

export const followUser = async (followerId, followedId) => {
    try {
        const { error } = await supabase.from("followers").insert({
            follower_id: followerId,
            followed_id: followedId,
        });

        if (error) {
            return { success: false, msg: error?.message };
        }
        return { success: true, msg: "User followed successfully" };
    } catch (error) {
        console.log("Error following user:", error);
        return { success: false, msg: error.message };
    }
};

export const unfollowUser = async (followerId, followedId) => {
    try {
        const { error } = await supabase
            .from("followers")
            .delete()
            .eq("follower_id", followerId)
            .eq("followed_id", followedId);

        if (error) {
            return { success: false, msg: error?.message };
        }
        return { success: true, msg: "User unfollowed successfully" };
    } catch (error) {
        console.log("Error unfollowing user:", error);
        return { success: false, msg: error.message };
    }
};

export const isMutualFollow = async (userId, otherUserId) => {
    try {
        const { data, error } = await supabase
            .from("followers")
            .select("id")
            .eq("follower_id", otherUserId)
            .eq("followed_id", userId);

        if (error) {
            return { success: false, msg: error?.message };
        }
        return { success: true, isMutual: data.length > 0 };
    } catch (error) {
        console.log("Error checking mutual follow:", error);
        return { success: false, msg: error.message };
    }
};
