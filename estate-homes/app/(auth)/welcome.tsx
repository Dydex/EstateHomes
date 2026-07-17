import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/auth";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Calculate responsive ring sizes
const blueRingSize = screenWidth * 1.25;
const goldRingSize = screenWidth * 1.6;

export default function WelcomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const yellowText = useThemeColor({ dark: '#FFDE6F' }, 'text');
  const { signIn } = useAuth();
  const { from } = useLocalSearchParams<{ from?: string }>();

  useEffect(() => {
    // Automatically transition to dashboard (if coming from addProperty) or createAccount after 2.5 seconds
    const timer = setTimeout(() => {
      if (from === "addProperty") {
        signIn();
      } else {
        router.replace("/createAccount");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [from]);

  const handlePress = () => {
    if (from === "addProperty") {
      signIn();
    } else {
      router.replace("/createAccount");
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <TouchableOpacity 
        style={styles.container} 
        activeOpacity={1} 
        onPress={handlePress}
      >
        {/* Background Decorative Rings */}
        
        {/* Top Gold Ring */}
        <View style={styles.topGoldRing}>
          <View style={styles.topGoldRingDot} />
        </View>

        {/* Bottom Gold Ring */}
        <View style={styles.bottomGoldRing}>
          <View style={styles.bottomGoldRingDot} />
        </View>

        {/* Central Blue Ring */}
        <View style={styles.blueRing}>
          <View style={styles.blueRingDotTop} />
          <View style={styles.blueRingDotBottom} />
        </View>

        {/* Logo and Greeting */}
        <View style={styles.centerContainer}>
          <Image
            source={require("@/assets/images/home-logo-1.png")}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={[styles.welcomeText, { color: yellowText }]}>
            Welcome!
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  centerContainer: {
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 240,
    height: 140,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  // Blue Ring styles
  blueRing: {
    position: "absolute",
    width: blueRingSize,
    height: blueRingSize,
    borderRadius: blueRingSize / 2,
    borderWidth: 2.5,
    borderColor: "#00A3FF",
    top: (screenHeight - blueRingSize) / 2 - 20, // slightly adjusted vertically
    left: (screenWidth - blueRingSize) / 2,
    zIndex: 1,
  },
  blueRingDotTop: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#9747FF",
    top: -10,
    left: "50%",
    marginLeft: -10,
    // Glow effect
    shadowColor: "#9747FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  blueRingDotBottom: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#9747FF",
    bottom: -10,
    left: "50%",
    marginLeft: -10,
    // Glow effect
    shadowColor: "#9747FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  // Top Gold Ring styles
  topGoldRing: {
    position: "absolute",
    width: goldRingSize,
    height: goldRingSize,
    borderRadius: goldRingSize / 2,
    borderWidth: 1.5,
    borderColor: "rgba(255, 222, 111, 0.35)",
    top: -goldRingSize * 0.44,
    left: (screenWidth - goldRingSize) / 2,
    zIndex: 0,
  },
  topGoldRingDot: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#9747FF",
    bottom: goldRingSize * 0.12,
    left: goldRingSize * 0.18,
    // Glow effect
    shadowColor: "#9747FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  // Bottom Gold Ring styles
  bottomGoldRing: {
    position: "absolute",
    width: goldRingSize,
    height: goldRingSize,
    borderRadius: goldRingSize / 2,
    borderWidth: 1.5,
    borderColor: "rgba(255, 222, 111, 0.35)",
    bottom: -goldRingSize * 0.44,
    left: (screenWidth - goldRingSize) / 2,
    zIndex: 0,
  },
  bottomGoldRingDot: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#9747FF",
    top: goldRingSize * 0.12,
    right: goldRingSize * 0.18,
    // Glow effect
    shadowColor: "#9747FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
});
