import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import {useAuth} from '@/context/AuthContext'
const Settings = () => {
    const {user} = useAuth()
  const [userData, setUserData] = useState(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('account_visibility')
          .eq('id', user.id)
          .single();  // Assuming user has a unique ID

        if (error) throw error;
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [user.id]);

  const toggleAccountVisibility = async () => {
    if (!userData) {
      console.error("User data is not available yet.");
      return;
    }

    try {
      const newVisibility = userData.account_visibility === 'public' ? 'private' : 'public';
      await supabase.from('users').update({ account_visibility: newVisibility }).eq('id', user.id);
      setUserData((prev) => ({ ...prev, account_visibility: newVisibility }));
      Alert.alert("Account visibility updated!");
    } catch (error) {
      console.error("Error updating visibility:", error.message);
    }
  };

  // Ensure that userData is available before rendering
  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <TouchableOpacity onPress={toggleAccountVisibility} className="mt-5">
      <Text className="text-primary-100">
        {userData.account_visibility === "public" ? "Make Private" : "Make Public"}
      </Text>
    </TouchableOpacity>
  );
};

export default Settings;
