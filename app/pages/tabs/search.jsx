import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Icon from "@/assets/icons";
import { hp, wp } from "../../../helpers/common";
import { supabase } from "../../../lib/supabase";
import { StatusBar } from "expo-status-bar";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { useRouter } from "expo-router";
import Avatar from "../../../components/Avatar";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchSearchResults = async (term) => {
    if (!term.trim()) {
      setResults([]); // Clear results if input is empty
      return;
    }
    setLoading(true);

    try {
      // Perform a case-insensitive search using ilike
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`name.ilike.%${term}%`); // Matches if the name contains the term

      if (error) throw error;

      setResults(data);
    } catch (err) {
      console.error("Error during search:", err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(fetchSearchResults, 300); // Delay API call by 300ms

  const handleSearchInput = (term) => {
    setSearchTerm(term);
    debouncedSearch(term); // Trigger debounced search
  };

  return (
    <ScreenWrapper>
      <StatusBar />
      <View className="flex-1 bg-primary-50 px-5">
        {/* Header */}
        <View className="flex mt-4 ml-3 flex-row justify-between">
          <Text className="font-rubik-bold text-3xl">Search</Text>
          <TouchableOpacity onPress={() => router.push("/pages/screens/menu")}>
            <Icon name="threeDotsHorizontal" size={hp(4)} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View className="mt-5 px-3">
          <Input
            icon={<Icon name="search" />}
            placeholder="Search users..."
            value={searchTerm}
            onChangeText={handleSearchInput}
            containerStyles={{
              borderWidth: 1,
              borderColor: "#F8D7A4",
              paddingTop: hp(3.5),
            }}
          />
        </View>

        {/* Loading Indicator */}
        {loading && <Loading />}

        {/* Search Results */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/pages/screens/profile",
                  params: { userId: item.id }, // Navigate to profile
                });
              }}
              className="mt-3 p-3 bg-white rounded-lg"
            >
              <View>
                <View className="bg-white p-5 rounded-3xl items-center m-2">
                  <View style={{ width: wp(85) }} className="flex-row gap-5">
                    <Avatar uri={item.image} />
                    <View>
                      <View className="flex flex-row justify-between">
                        <View className="flex-row">
                          <Text className="text-1xl font-rubik-bold">
                            {item.name}
                          </Text>
                          <Text className="text-1xl font-rubik-extrabold">
                            •
                          </Text>
                        </View>
                      </View>
                      <View className="pr-14 mt-2">
                        <Text className="text-1xl font-rubik-medium">
                          {item?.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loading && (
              <Text className="text-center text-gray-500 mt-5">
                No results found.
              </Text>
            )
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default SearchScreen;
