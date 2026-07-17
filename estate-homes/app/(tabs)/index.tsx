import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

// Monthly mockup data for interactive selector
const MONTHLY_SUMMARIES: Record<string, { collection: string; due: string }> = {
  "June": { collection: "Rs.10,000", due: "Rs.2,000" },
  "July": { collection: "Rs.15,200", due: "Rs.1,200" },
  "August": { collection: "Rs.12,500", due: "Rs.3,500" },
  "September": { collection: "Rs.18,000", due: "Rs.500" }
};

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const purpleText = useThemeColor({ dark: '#9747FF' }, 'text');
  const yellowText = useThemeColor({ dark: '#FFDE6F' }, 'text');
  
  const inputBgThemeColor = useThemeColor({ light: '#F5F5F5', dark: '#1E1E20' }, 'background');
  const inputBorderThemeColor = useThemeColor({ light: '#E5E7EB', dark: '#2E3032' }, 'background');
  const cardBgColor = useThemeColor({ light: '#FFFFFF', dark: '#1E1E20' }, 'background');
  const placeholderColor = useThemeColor({ light: '#9CA3AF', dark: '#7C7C80' }, 'text');

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("June");
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);

  const currentSummary = MONTHLY_SUMMARIES[selectedMonth];

  const handleActionPress = (actionName: string) => {
    if (actionName === "Edit Property Details") {
      router.push("/addProperty");
    } else {
      Alert.alert(actionName, `You clicked the action: "${actionName}".`);
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/home-logo-1.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <FontAwesome name="home" size={22} color={yellowText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <FontAwesome name="bell-o" size={21} color={yellowText} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.greetingText, { color: textColor }]}>Good Morning,</Text>
          <Text style={[styles.nameText, { color: purpleText }]}>Somnath Mukherjee</Text>
        </View>

        {/* Search Input */}
        <View style={[styles.searchRow, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor }]}>
          <FontAwesome name="search" size={16} color="#9747FF" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search"
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => Alert.alert("Voice Search", "Voice input simulation activated.")}>
            <FontAwesome name="microphone" size={16} color={placeholderColor} />
          </TouchableOpacity>
        </View>

        {/* Summary Month Title Row */}
        <View style={styles.summaryTitleRow}>
          <Text style={[styles.summaryTitle, { color: textColor }]}>
            Summary for <Text style={{ fontWeight: "bold" }}>{selectedMonth}</Text>
          </Text>
          <TouchableOpacity 
            style={[styles.monthSelector, { borderColor: inputBorderThemeColor }]}
            onPress={() => setIsMonthPickerVisible(true)}
          >
            <Text style={[styles.monthSelectorText, { color: textColor }]}>{selectedMonth}</Text>
            <FontAwesome name="chevron-down" size={10} color="#9747FF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* Horizontal Stats Cards Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsScrollContent}
        >
          {/* Card 1: Total Collection */}
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={[styles.statCard, { backgroundColor: cardBgColor, borderColor: "#9747FF", borderWidth: 1.5 }]}
          >
            <View style={styles.statCardLeft}>
              <Text style={[styles.statCardTitle, { color: textColor }]}>Total Collection</Text>
              <Text style={[styles.statCardVal, { color: "#9747FF" }]}>{currentSummary.collection}</Text>
            </View>
            <Image
              source={require("@/assets/images/Goal-Card.png")}
              style={styles.walletImage}
              contentFit="contain"
            />
          </TouchableOpacity>

          {/* Card 2: Total Due */}
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={[styles.statCard, { backgroundColor: cardBgColor, borderColor: inputBorderThemeColor, borderWidth: 1.5 }]}
          >
            <View style={styles.statCardLeft}>
              <Text style={[styles.statCardTitle, { color: textColor }]}>Total Due</Text>
              <Text style={[styles.statCardVal, { color: "#9747FF" }]}>{currentSummary.due}</Text>
            </View>
            <View style={styles.dueIconBg}>
              <FontAwesome name="credit-card" size={24} color="#9747FF" />
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Frequently Used Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={[styles.actionsTitle, { color: yellowText }]}>Frequently Used Actions</Text>
          
          <View style={[styles.actionsCard, { backgroundColor: cardBgColor }]}>
            <View style={styles.actionsCardHeader}>
              <Text style={[styles.propertyName, { color: textColor }]}>Tea Villa</Text>
              <View style={styles.locationContainer}>
                <FontAwesome name="map-marker" size={14} color="#FF4D4D" />
                <Text style={[styles.locationText, { color: textColor }]}>Shivnagar</Text>
              </View>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.buttonsRow}
            >
              {/* Action 1 */}
              <TouchableOpacity 
                style={styles.actionBtnContainer}
                onPress={() => handleActionPress("Edit Property Details")}
              >
                <View style={styles.actionIconBox}>
                  <FontAwesome name="home" size={24} color="#9747FF" />
                </View>
                <Text style={[styles.actionBtnText, { color: textColor }]}>Edit Property Details</Text>
              </TouchableOpacity>

              {/* Action 2 */}
              <TouchableOpacity 
                style={styles.actionBtnContainer}
                onPress={() => handleActionPress("Add New Tenant")}
              >
                <View style={styles.actionIconBox}>
                  <FontAwesome name="users" size={22} color="#9747FF" />
                </View>
                <Text style={[styles.actionBtnText, { color: textColor }]}>Add New Tenant</Text>
              </TouchableOpacity>

              {/* Action 3 */}
              <TouchableOpacity 
                style={styles.actionBtnContainer}
                onPress={() => handleActionPress("Maintenance Requests")}
              >
                <View style={styles.actionIconBox}>
                  <FontAwesome name="wrench" size={22} color="#9747FF" />
                </View>
                <Text style={[styles.actionBtnText, { color: textColor }]}>Maintenance Requests</Text>
              </TouchableOpacity>

              {/* Action 4 */}
              <TouchableOpacity 
                style={styles.actionBtnContainer}
                onPress={() => handleActionPress("Track Payments")}
              >
                <View style={styles.actionIconBox}>
                  <FontAwesome name="money" size={22} color="#9747FF" />
                </View>
                <Text style={[styles.actionBtnText, { color: textColor }]}>Track Payments</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/addProperty")}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Month Selection Modal */}
      <Modal
        visible={isMonthPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMonthPickerVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMonthPickerVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Select Month</Text>
            {Object.keys(MONTHLY_SUMMARIES).map((month) => {
              const isSelected = selectedMonth === month;
              return (
                <TouchableOpacity
                  key={month}
                  style={[styles.modalOption, { borderColor: inputBorderThemeColor }]}
                  onPress={() => {
                    setSelectedMonth(month);
                    setIsMonthPickerVisible(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: isSelected ? "#9747FF" : textColor, fontWeight: isSelected ? "bold" : "normal" }]}>
                    {month}
                  </Text>
                  {isSelected && <FontAwesome name="check" size={16} color="#9747FF" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  logo: {
    width: 80,
    height: 32,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: 18,
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding to scroll past FAB
  },
  welcomeSection: {
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 14,
    opacity: 0.7,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 2,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 28,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  summaryTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  monthSelectorText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsScroll: {
    width: "100%",
    paddingLeft: 24,
    marginBottom: 28,
  },
  statsScrollContent: {
    paddingRight: 48, // Padding at the end of scroll list
  },
  statCard: {
    width: 220,
    height: 100,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 12,
  },
  statCardLeft: {
    flex: 1,
    justifyContent: "center",
  },
  statCardTitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  statCardVal: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  walletImage: {
    width: 55,
    height: 55,
  },
  dueIconBg: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(151, 71, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionsSection: {
    paddingHorizontal: 24,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },
  actionsCard: {
    borderRadius: 24,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionsCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
    opacity: 0.8,
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  actionBtnContainer: {
    alignItems: "center",
    marginRight: 20,
    width: 75,
  },
  actionIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#FFDE6F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionBtnText: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#9747FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
  },
});
