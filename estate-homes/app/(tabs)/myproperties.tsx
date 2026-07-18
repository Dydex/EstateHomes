import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

interface Property {
  id: string;
  name: string;
  addedDate: string;
  tenantsCount: number;
  location: string;
  image: string;
  monthlyRent: string;
  securityDeposit: string;
  maintenanceCharges: string;
  electricityCharges: string;
  dueDate: string;
  photos: string[];
}

const INITIAL_PROPERTIES: Property[] = [
  {
    id: "1",
    name: "Tea Villa",
    addedDate: "01/01/2024",
    tenantsCount: 1,
    location: "Shiv Nagar, 2nd Street",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=60",
    monthlyRent: "Rs. 10,000",
    securityDeposit: "Rs. 20,000",
    maintenanceCharges: "Rs. 1000",
    electricityCharges: "Rs. 1500",
    dueDate: "5th of each month",
    photos: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "2",
    name: "Indie Flats",
    addedDate: "01/03/2024",
    tenantsCount: 3,
    location: "H.M Road, BP-3rd Lane",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=60",
    monthlyRent: "Rs. 12,000",
    securityDeposit: "Rs. 25,000",
    maintenanceCharges: "Rs. 1500",
    electricityCharges: "Rs. 1200",
    dueDate: "10th of each month",
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "3",
    name: "Sangeetha Nivas",
    addedDate: "01/03/2024",
    tenantsCount: 4,
    location: "Rajaji Marg, Block A",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=60",
    monthlyRent: "Rs. 15,000",
    securityDeposit: "Rs. 30,000",
    maintenanceCharges: "Rs. 2000",
    electricityCharges: "Rs. 1800",
    dueDate: "1st of each month",
    photos: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop&q=80"
    ]
  }
];

export default function MyPropertiesScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const purpleText = useThemeColor({ dark: '#9747FF' }, 'text');
  const yellowText = useThemeColor({ dark: '#FFDE6F' }, 'text');

  const inputBgThemeColor = useThemeColor({ light: '#F5F5F5', dark: '#1E1E20' }, 'background');
  const inputBorderThemeColor = useThemeColor({ light: '#E5E7EB', dark: '#2E3032' }, 'background');
  const placeholderColor = useThemeColor({ light: '#9CA3AF', dark: '#7C7C80' }, 'text');

  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = properties.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (property: Property) => {
    router.push({
      pathname: "/addProperty",
      params: { 
        name: property.name,
        address: property.location,
        editMode: "true"
      }
    });
  };

  const handleBack = () => {
    if (selectedProperty) {
      setSelectedProperty(null);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor }]}>
      {/* Header Row */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name="arrow-left" size={20} color={textColor} />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => { setSelectedProperty(null); router.replace("/(tabs)"); }}>
            <FontAwesome name="home" size={22} color={yellowText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert("Notifications", "No new alerts.")}>
            <FontAwesome name="bell-o" size={21} color={yellowText} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedProperty ? (
          /* PROPERTY DETAILS VIEW */
          <View style={styles.detailContainer}>
            <Text style={[styles.titleText, { color: purpleText, marginBottom: 20 }]}>
              {selectedProperty.name}
            </Text>

            {/* Property Card details */}
            <View style={styles.card}>
              <View style={styles.cardUpper}>
                <Image
                  source={{ uri: selectedProperty.image }}
                  style={styles.propertyImage}
                  contentFit="cover"
                />
                <View style={styles.cardDetails}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.propertyNameText} numberOfLines={1}>
                      {selectedProperty.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleEdit(selectedProperty)} style={styles.editBtn}>
                      <FontAwesome name="pencil-square-o" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.addedDateText}>
                    You added this property on {selectedProperty.addedDate}.
                  </Text>

                  {/* Inline Stats in Detail Card */}
                  <View style={styles.inlineInfoRow}>
                    <View style={styles.inlineCol}>
                      <FontAwesome name="user" size={12} color="#4B5563" />
                      <Text style={styles.inlineInfoText}>{selectedProperty.tenantsCount} Tenant</Text>
                    </View>
                    <View style={[styles.inlineCol, { marginTop: 4 }]}>
                      <FontAwesome name="map-marker" size={12} color="#4B5563" />
                      <Text style={styles.inlineInfoText} numberOfLines={1}>
                        {selectedProperty.location}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Property Details Section */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Property Details</Text>
              <TouchableOpacity onPress={() => handleEdit(selectedProperty)}>
                <FontAwesome name="pencil-square-o" size={20} color={yellowText} />
              </TouchableOpacity>
            </View>

            <View style={[styles.detailsCard, { backgroundColor: inputBgThemeColor }]}>
              {/* Row 1: Rent */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fixed Monthly Rent</Text>
                <View style={styles.detailValContainer}>
                  <Text style={styles.detailValue}>{selectedProperty.monthlyRent}</Text>
                  <Text style={styles.detailBar}> |</Text>
                </View>
              </View>

              {/* Row 2: Deposit */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Security Deposit</Text>
                <View style={styles.detailValContainer}>
                  <Text style={styles.detailValue}>{selectedProperty.securityDeposit}</Text>
                  <Text style={styles.detailBar}> |</Text>
                </View>
              </View>

              {/* Row 3: Maintenance */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Maintenance Charges</Text>
                <View style={styles.detailValContainer}>
                  <Text style={styles.detailValue}>{selectedProperty.maintenanceCharges}</Text>
                  <Text style={styles.detailBar}> |</Text>
                </View>
              </View>

              {/* Row 4: Electricity */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Electricity Charges</Text>
                <View style={styles.detailValContainer}>
                  <Text style={styles.detailValue}>{selectedProperty.electricityCharges}</Text>
                  <Text style={styles.detailBar}> |</Text>
                </View>
              </View>

              {/* Row 5: Due Date */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Due Date</Text>
                <View style={styles.detailValContainer}>
                  <Text style={styles.detailValue}>{selectedProperty.dueDate}</Text>
                  <Text style={styles.detailBar}> |</Text>
                </View>
              </View>
            </View>

            {/* Photos & Videos Section */}
            <View style={[styles.sectionHeader, { marginTop: 12 }]}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Photos and Videos</Text>
              <TouchableOpacity onPress={() => Alert.alert("Gallery", "Opening photos list.")}>
                <Text style={[styles.viewAllText, { color: yellowText }]}>View all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
              {selectedProperty.photos.map((photoUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: photoUrl }}
                  style={styles.detailPhoto}
                  contentFit="cover"
                />
              ))}
            </ScrollView>
          </View>
        ) : (
          /* PROPERTIES LIST VIEW */
          <View>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={[styles.titleLabel, { color: textColor }]}>Take a look at</Text>
              <Text style={[styles.titleText, { color: purpleText }]}>My Properties</Text>
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

            {/* Properties Cards List */}
            <View style={styles.propertiesList}>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedProperty(item)}
                    style={styles.card}
                  >
                    {/* Upper Section */}
                    <View style={styles.cardUpper}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.propertyImage}
                        contentFit="cover"
                      />
                      <View style={styles.cardDetails}>
                        <View style={styles.cardTitleRow}>
                          <Text style={styles.propertyNameText} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                            <FontAwesome name="pencil-square-o" size={20} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.addedDateText}>
                          You added this property on {item.addedDate}.
                        </Text>
                        <Text style={styles.helperText}>
                          Click on edit to change details regarding this property.
                        </Text>
                      </View>
                    </View>

                    {/* Divider Line */}
                    <View style={styles.divider} />

                    {/* Bottom Row */}
                    <View style={styles.cardBottom}>
                      <View style={styles.infoCol}>
                        <FontAwesome name="user" size={14} color="#4B5563" />
                        <Text style={styles.infoText}>{item.tenantsCount} Tenants</Text>
                      </View>
                      <View style={styles.infoCol}>
                        <FontAwesome name="map-marker" size={14} color="#4B5563" />
                        <Text style={styles.infoText} numberOfLines={1}>
                          {item.location}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <FontAwesome name="building-o" size={48} color={placeholderColor} style={{ marginBottom: 12 }} />
                  <Text style={[styles.emptyText, { color: placeholderColor }]}>No properties found</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/addProperty")}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
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
  backButton: {
    padding: 4,
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
    paddingBottom: 100, // Safe padding past FAB
  },
  titleSection: {
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 20,
  },
  titleLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  titleText: {
    fontSize: 28,
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
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  propertiesList: {
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  cardUpper: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  propertyImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  cardDetails: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  propertyNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    flex: 1,
  },
  editBtn: {
    paddingLeft: 12,
    paddingVertical: 4,
  },
  addedDateText: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 4,
  },
  helperText: {
    fontSize: 9,
    color: "#9CA3AF",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
  },
  infoCol: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: "#4B5563",
    marginLeft: 6,
    flex: 1,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  // DETAIL VIEW STYLES
  detailContainer: {
    paddingHorizontal: 24,
  },
  inlineInfoRow: {
    marginTop: 8,
  },
  inlineCol: {
    flexDirection: "row",
    alignItems: "center",
  },
  inlineInfoText: {
    fontSize: 11,
    color: "#4B5563",
    marginLeft: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  detailsCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B380FF",
  },
  detailValContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  detailBar: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#B380FF",
    opacity: 0.8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  photosScroll: {
    width: "100%",
  },
  detailPhoto: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginRight: 12,
  },
});
