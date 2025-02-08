import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Icon from "@/assets/icons";
import { hp } from "../../../helpers/common";
import { supabase } from "../../../lib/supabase";
import { StatusBar } from "expo-status-bar";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { useRouter } from "expo-router";
import Avatar from "../../../components/Avatar";
import { useFocusEffect } from "@react-navigation/native";

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
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`name.ilike.%${term}%`);

      if (error) throw error;

      setResults(data);
    } catch (err) {
      console.error("Error during search:", err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(fetchSearchResults, 300);

  const handleSearchInput = (term) => {
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setSearchTerm("");
        setResults([]);
      };
    }, [])
  );

  return (
    <ScreenWrapper>
      <StatusBar />
      <View className="flex-1 bg-primary-50 px-5">
        {/* Header */}
        <View className="flex mt-5 flex-row justify-between">
          <Text className="font-rubik-bold text-3xl">Search</Text>
         
        </View>

        {/* Search Input with Clear Button */}
        <View className="absolute left-10 right-10 top-20 flex-row items-center">
          <View className="flex-1">
            <Input
              icon={<Icon name="search" />}
              placeholder="Search users..."
              value={searchTerm}
              onChangeText={handleSearchInput}
            />
          </View>
          {searchTerm ? (
            <TouchableOpacity
              onPress={clearSearch}
              className=" bg-white p-2 rounded-3xl ml-5"
            >
              <Icon name="cross" size={hp(3)} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View className="mt-40">
          {/* Initial Image */}
          {!searchTerm && !loading && results.length === 0 && (
            <View className="flex-1  items-center justify-start mt-20">
              <Image
                source={require("../../../assets/images/search.png")}
                className="size-96"
                resizeMode="contain"
              />
            </View>
          )}

          {/* Loading Indicator */}
          {loading && <Loading />}

          {/* No Results Message */}
          {searchTerm && !loading && results.length === 0 && (
            <View className="flex items-center justify-center mt-20">
              
              <Image 
              source={require('../../../assets/images/nosearch.png')}
              resizeMode="contain"
              className="size-72"
              />
              <Text className="text-gray-500 text-3xl font-rubik-semibold">
                No results found!
              </Text>
            </View>
          )}

          {/* Search Results */}
          {!loading && results.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/pages/profileinfo",
                      params: { userId: item.id },
                    });
                  }}
                >
                  <View>
                    <View className="bg-white p-5 gap mt-5 rounded-3xl">
                      <View className="flex flex-row items-center gap-5">
                        <View>
                          <Avatar uri={item.image} />
                        </View>
                        <View>
                          <Text className="font-rubik-semibold">
                            {item.name}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SearchScreen;
