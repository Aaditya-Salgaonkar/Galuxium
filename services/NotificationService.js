// Create notification function (updated)
import { supabase } from "../lib/supabase";

export const createNotification = async (notification) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log("Post notification error:", error);
      return { success: false, msg: "Could not notify the user" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Post notification error:", error);
    return { success: false, msg: "Could not notify the user" };
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    // Check if notificationId is provided
    if (!notificationId) {
      return { success: false, msg: "Notification ID is required" };
    }

    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId); // Add the condition to delete the specific notification

    if (error) {
      console.log("Delete notification error:", error);
      return { success: false, msg: "Could not delete the notification" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Delete notification error:", error);
    return { success: false, msg: "Could not delete the notification" };
  }
};