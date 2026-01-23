import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

const ProfileTab = () => {
  const { signOut } = useAuth();
  return (
    <ScrollView
      className="bg-surface"
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text className="text-white">Profile Tab</Text>
      <Pressable
        onPress={() => signOut()}
        className="mt-4 p-4 bg-red-600 rounded"
      >
        <Text>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProfileTab;
