import {
  View,
  Text,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import useAuthSocial from "@/hooks/useSocialAuth";

const { width, height } = Dimensions.get("window");

const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useAuthSocial();
  const isLoading = loadingStrategy !== null;
  return (
    <View className="flex-1 bg-surface-dark">
      <View className="absolute inset-0 overflow-hidden">
        <SafeAreaView className="flex-1">
          <View className="items-center pt-10">
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 100, height: 100, marginVertical: -20 }}
              contentFit="contain"
            />
            <Text className="text-center text-4xl font-bold text-primary font-serif tracking-wide uppercase">
              NewChat
            </Text>
          </View>
          <View className="flex-1 justify-center items-center px-6">
            <Image
              source={require("../../assets/images/auth.png")}
              style={{ width: width * 0.8, height: height * 0.3 }}
              contentFit="contain"
            />
            <View className="mt-2 items-center">
              <Text className="text-center text-4xl font-bold text-foreground font-sans">
                Connect & Chat
              </Text>
              <Text className="text-3xl font-bold text-primary font-mono">
                Seamlessly
              </Text>
            </View>
            {/* AUTH BUTTONS */}
            <View className="flex-row gap-4 mt-10">
              {/* google btn */}
              <Pressable
                className="flex-1 flex-row items-center justify-center gap-2  bg-white/95 py-4  rounded-2xl active:scale-[0.97] "
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Sign in with Google"
                onPress={() => !isLoading && handleSocialAuth("oauth_google")}
              >
                {loadingStrategy === "oauth_google" ? (
                  <ActivityIndicator size="small" color="#1a1a1a" />
                ) : (
                  <>
                    <Image
                      source={require("../../assets/images/google.png")}
                      style={{ width: 24, height: 24 }}
                      contentFit="contain"
                    />
                    <Text className="text-gray-900 font-semibold text-sm">
                      Google
                    </Text>
                  </>
                )}
              </Pressable>
              {/* Apple btn */}
              <Pressable
                className="flex-1 flex-row items-center justify-center gap-2  bg-white/10 py-4  rounded-2xl border border-white/20 active:scale-[0.97] "
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Sign in with Apple"
                onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
              >
                {loadingStrategy === "oauth_apple" ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
                    <Text className="text-foreground font-semibold text-sm">
                      Apple
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
      <Text>AuthScreen</Text>
    </View>
  );
};

export default AuthScreen;
