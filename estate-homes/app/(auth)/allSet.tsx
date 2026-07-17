import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function AllSet() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const yellowText = useThemeColor({ dark: '#FFDE6F' }, 'text');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={20} color={textColor} />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={[styles.title, { color: yellowText }]}>
          All Set!
        </Text>
        <Text style={[styles.subtitle, { color: yellowText }]}>
          You're Good To Go!
        </Text>
        <Image
          source={require('@/assets/images/Frame 3913.png')}
          style={styles.Frame}
          contentFit="contain"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/addProperty")}
        >
          <Text style={styles.buttonText}>Add Your First property</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.maybeLaterButton} onPress={() => {}}>
          <Text style={[styles.maybeLaterText, { color: textColor }]}>Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  Frame: {
    width: 240,
    height: 240,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: "#9747FF",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
   maybeLaterButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  maybeLaterText: {
    color: '#D4D4D4',
    fontSize: 16,
    fontWeight: '500',
  }
});