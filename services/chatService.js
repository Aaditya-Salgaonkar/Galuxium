import { supabase } from "../lib/supabase";

async function sendMessage(sender_id, content, recipient_id, group_id) {
  const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id, content, recipient_id, group_id });
  if (error) throw error;
  return data;
}

async function fetchMessages(group_id, recipient_id) {
  const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`group_id.eq.${group_id},recipient_id.eq.${recipient_id}`)
      .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

async function editMessage(message_id, new_content) {
  const { data, error } = await supabase
      .from('messages')
      .update({ content: new_content, updated_at: new Date() })
      .eq('id', message_id);
  if (error) throw error;
  return data;
}

async function deleteMessage(message_id) {
  const { data, error } = await supabase
      .from('messages')
      .delete()
      .eq('id', message_id);
  if (error) throw error;
  return data;
}

async function createGroup(name, created_by) {
  const { data, error } = await supabase
      .from('groups')
      .insert({ name, created_by });
  if (error) throw error;
  return data;
}

async function addUserToGroup(group_id, user_id) {
  const { data, error } = await supabase
      .from('group_members')
      .insert({ group_id, user_id });
  if (error) throw error;
  return data;
}

async function fetchGroupMembers(group_id) {
  const { data, error } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', group_id);
  if (error) throw error;
  return data;
}
