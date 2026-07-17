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

const GOALS = [
  {
    id: "tenant",
    title: "Managing Tenant Information",
    image: require("@/assets/images/Front.png"),
  },
  {
    id: "properties",
    title: "Managing Properties",
    image: require("@/assets/images/Goal-Card.png"),
  },
  {
    id: "documents",
    title: "Store and Manage Documents",
    image: require("@/assets/images/Front-1.png"),
  },
  {
    id: "reminders",
    title: "Send Payment Reminders",
    image: require("@/assets/images/Front-3.png"),
  },
  {
    id: "maintenance",
    title: "Track Maintenance Requests",
    image: require("@/assets/images/Front-2.png"),
  },
  {
    id: "photos",
    title: "Manage Property Photos and Videos",
    image: require("@/assets/images/Front-4.png"),
  },
];

export default function GoalsScreen() {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
    const purpleText = useThemeColor({ dark: '#9747FF' }, 'text');
    const cardBgColor = useThemeColor({ light: '#F3F4F6', dark: '#18181A' }, 'background');


    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const toggleGoal = (id: string) => {
        if (selectedGoals.includes(id)) {
            setSelectedGoals(selectedGoals.filter((g) => g !== id));
        } else {
            setSelectedGoals([...selectedGoals, id]);
        }
    };

    const handleContinue = () => {
        router.replace("/allSet");
    }; 

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={20} color={textColor} />
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                    <Text style={[styles.title, { color: purpleText }]}>Select Your Goals</Text>
                    <Text style={[styles.subtitle, { color: textColor }]}>{"Select all the tasks you want to manage\nthrough Home"}</Text>
                </View>

                <View style={styles.grid}>
                    {GOALS.map((goal) => {
                        const isSelected = selectedGoals.includes(goal.id);
                        return (
                            <TouchableOpacity
                                key={goal.id}
                                activeOpacity={0.8}
                                onPress={() => toggleGoal(goal.id)}
                                style={styles.gridItem}
                            >
                                <View style={[
                                    styles.card,
                                    { 
                                        backgroundColor: cardBgColor,
                                        borderColor: isSelected ? "#9747FF" : "transparent",
                                    }
                                ]}>
                                    <Image 
                                        source={goal.image} 
                                        style={styles.image}
                                        contentFit="contain" 
                                    />
                                </View>
                                <Text style={[styles.cardText, { color: textColor }]} numberOfLines={2}>
                                    {goal.title}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: "#9747FF" }]} 
                    onPress={handleContinue}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "space-between",
    },
    backButton: {
        alignSelf: 'flex-start',
        paddingVertical: 12,
        paddingRight: 16,
        marginTop: 8,
    },
    headerContainer: {
        marginBottom: 32,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        opacity: 0.8,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    gridItem: {
        width: "48%",
        alignItems: "center",
        marginBottom: 20,
    },
    card: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
    },
    image: {
        width: "65%",
        height: "65%",
    },
    cardText: {
        fontSize: 12,
        fontWeight: "500",
        textAlign: "center",
        lineHeight: 16,
        marginTop: 8,
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
});