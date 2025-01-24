import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase"

const ProfileScreen = () => {
  const router = useRouter();
  const { userId } = router.params;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
        return;
      }

      setUserData(data);
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (!userData) return <Text>Loading...</Text>;

  return (
    <View>
      <Image source={{ uri: userData.image }} style={{ width: 100, height: 100 }} />
      <Text>{userData.name}</Text>
      <Text>{userData.email}</Text>
      {/* Add more profile details here */}
    </View>
  );
};

export default ProfileScreen;
