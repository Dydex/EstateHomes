import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { useAuth } from "@/context/auth";
import { FontAwesome } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Responsive ring sizes matches welcome screen background circles
const blueRingSize = screenWidth * 1.25;
const goldRingSize = screenWidth * 1.6;

export default function PropertySuccessScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const yellowText = useThemeColor({ dark: '#FFDE6F' }, 'text');
  const { signIn, isLoggedIn } = useAuth();

  const handleGoHome = () => {
    if (!isLoggedIn) {
      signIn(); // Logs in new user to transition layout to dashboard
    } else {
      router.replace("/(tabs)"); // Redirects signed-in users back to tabs
    }
  };

  const handleAddAnother = () => {
    router.replace("/addProperty");
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.container}>
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

        {/* Content Area */}
        <View style={styles.contentContainer}>
          {/* Circular Success Badge */}
          <View style={styles.badgeCircle}>
            <FontAwesome name="check" size={56} color="#FFDE6F" />
          </View>

          {/* Success Message */}
          <Text style={[styles.successTitle, { color: yellowText }]}>
            Property Added{"\n"}Successfully
          </Text>

          {/* Action Buttons */}
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleAddAnother}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Add Another Property</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  contentContainer: {
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#18181A",
    borderWidth: 4,
    borderColor: "#9747FF",
    justifyContent: "center",
    alignItems: "center",
    // Glowing shadow
    shadowColor: "#9747FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 36,
    marginTop: 44,
    marginBottom: 44,
  },
  primaryButton: {
    backgroundColor: "#9747FF",
    borderRadius: 12,
    height: 52,
    width: 260,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    borderRadius: 12,
    height: 52,
    width: 260,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Ring backgrounds matches welcome.tsx
  blueRing: {
    position: "absolute",
    width: blueRingSize,
    height: blueRingSize,
    borderRadius: blueRingSize / 2,
    borderWidth: 2.5,
    borderColor: "#00A3FF",
    top: (screenHeight - blueRingSize) / 2 - 20,
    left: (screenWidth - blueRingSize) / 2,
    zIndex: 1,
    opacity: 0.35,
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
    shadowColor: "#9747FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  topGoldRing: {
    position: "absolute",
    width: goldRingSize,
    height: goldRingSize,
    borderRadius: goldRingSize / 2,
    borderWidth: 1.5,
    borderColor: "rgba(255, 222, 111, 0.2)",
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
    shadowColor: "#9747FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomGoldRing: {
    position: "absolute",
    width: goldRingSize,
    height: goldRingSize,
    borderRadius: goldRingSize / 2,
    borderWidth: 1.5,
    borderColor: "rgba(255, 222, 111, 0.2)",
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
    shadowColor: "#9747FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
});
