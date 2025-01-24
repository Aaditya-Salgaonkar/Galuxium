import { supabase } from "../lib/supabase";

export const createNotification = async (notification) => {
  try {
    const {data,error}=await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single();
    if (error) {
      console.log("Post notification error:", error);
      return { success: false, msg: "Could not notify the user" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Post notification error:", error);
    return { success: false, msg: "Could not notify the user" };
  }
};