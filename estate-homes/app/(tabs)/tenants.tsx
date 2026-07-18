import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Linking
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

interface Tenant {
  id: string;
  name: string;
  property: string;
  location: string;
  phone: string;
  image: string;
  occupancy: string;
  roomNumber: string;
  dueDate: string;
  email: string;
  birthday: string;
  bloodGroup: string;
  permanentAddress: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
}

const INITIAL_TENANTS: Tenant[] = [
  {
    id: "1",
    name: "Tarun Agarwal",
    property: "Tea Villa",
    location: "Shiv Nagar, 2nd Street",
    phone: "+91 76768 67675",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    occupancy: "Couple",
    roomNumber: "02",
    dueDate: "5th of each month",
    email: "tarunag98@gmail.com",
    birthday: "01/05/1998",
    bloodGroup: "AB+",
    permanentAddress: "Plot No 1a, Ahmedabad Rd, Gujarat 382428",
    emergencyName: "Ramesh Agarwal",
    emergencyRelation: "Father",
    emergencyPhone: "+91 94420 12345"
  },
  {
    id: "2",
    name: "Raj Rahul",
    property: "Tea Villa",
    location: "Shiv Nagar, 2nd Street",
    phone: "+91 87654 32109",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    occupancy: "Single",
    roomNumber: "05",
    dueDate: "5th of each month",
    email: "rajrahul99@gmail.com",
    birthday: "15/08/1999",
    bloodGroup: "O+",
    permanentAddress: "Plot No 4b, Main Ring Rd, Pune 411001",
    emergencyName: "Sanjay Rahul",
    emergencyRelation: "Father",
    emergencyPhone: "+91 95531 98765"
  },
  {
    id: "3",
    name: "Aishwarya Nair",
    property: "Indie Flats",
    location: "H.M Road, BP-3rd Lane",
    phone: "+91 76543 21098",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    occupancy: "Single",
    roomNumber: "12",
    dueDate: "1st of each month",
    email: "aishwarya.nair@outlook.com",
    birthday: "22/11/1997",
    bloodGroup: "B+",
    permanentAddress: "Flat 102, Gokulam Apts, Bangalore 560002",
    emergencyName: "Gopal Nair",
    emergencyRelation: "Father",
    emergencyPhone: "+91 96642 54321"
  }
];

export default function TenantsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const purpleText = useThemeColor({ dark: '#9747FF' }, 'text');
  const yellowText = useThemeColor({ dark: '#FFDE6F' }, 'text');

  const cardBgThemeColor = useThemeColor({ light: '#FFFFFF', dark: '#1E1E20' }, 'background');
  const inputBgThemeColor = useThemeColor({ light: '#F5F5F5', dark: '#1E1E20' }, 'background');
  const inputBorderThemeColor = useThemeColor({ light: '#E5E7EB', dark: '#2E3032' }, 'background');
  const placeholderColor = useThemeColor({ light: '#9CA3AF', dark: '#7C7C80' }, 'text');

  const [searchQuery, setSearchQuery] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [activeSegment, setActiveSegment] = useState<"Details" | "Bills">("Details");
  const [isEmergencyExpanded, setIsEmergencyExpanded] = useState(false);
  const [isElectricityPaid, setIsElectricityPaid] = useState(false);
  const [isMaintenancePaid, setIsMaintenancePaid] = useState(false);

  // Form State for Add Tenant Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantProperty, setNewTenantProperty] = useState("Tea Villa");
  const [newTenantLocation, setNewTenantLocation] = useState("Shiv Nagar, 2nd Street");
  const [newTenantPhone, setNewTenantPhone] = useState("");

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() =>
      Alert.alert("Error", "Unable to open phone dialer.")
    );
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`).catch(() =>
      Alert.alert(
        "WhatsApp Redirect",
        `WhatsApp application is not installed. Copy phone: ${phone}`
      )
    );
  };

  const handleRemove = (tenantId: string, tenantName: string) => {
    Alert.alert(
      "Remove Tenant",
      `Are you sure you want to remove ${tenantName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setTenants(tenants.filter((t) => t.id !== tenantId));
            if (selectedTenant?.id === tenantId) {
              setSelectedTenant(null);
            }
          }
        }
      ]
    );
  };

  const handleAddTenant = () => {
    if (!newTenantName || !newTenantPhone) {
      Alert.alert("Missing Fields", "Please enter the tenant name and phone number.");
      return;
    }

    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: newTenantName,
      property: newTenantProperty,
      location: newTenantLocation,
      phone: newTenantPhone,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
      occupancy: "Single",
      roomNumber: "03",
      dueDate: "5th of each month",
      email: `${newTenantName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      birthday: "01/01/2000",
      bloodGroup: "O+",
      permanentAddress: "Permanent address details here",
      emergencyName: "Emergency Name",
      emergencyRelation: "Relative",
      emergencyPhone: "+91 99999 88888"
    };

    setTenants([...tenants, newTenant]);
    setIsModalVisible(false);

    // Reset fields
    setNewTenantName("");
    setNewTenantPhone("");
  };

  const handleEdit = (tenant: Tenant) => {
    Alert.alert("Edit Tenant", `Edit properties for ${tenant.name}.`);
  };

  const handleBack = () => {
    if (selectedTenant) {
      setSelectedTenant(null);
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
          <TouchableOpacity style={styles.iconBtn} onPress={() => { setSelectedTenant(null); router.replace("/(tabs)"); }}>
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
        {selectedTenant ? (
          /* TENANT DETAILS VIEW */
          <View style={styles.detailContainer}>
            {/* Search Input prefilled with Active Tenant */}
            <View style={[styles.searchRow, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, marginBottom: 20 }]}>
              <FontAwesome name="search" size={16} color="#9747FF" style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: textColor }]}
                value={selectedTenant.name}
                editable={false}
              />
              <TouchableOpacity onPress={() => setSelectedTenant(null)}>
                <FontAwesome name="close" size={18} color={placeholderColor} />
              </TouchableOpacity>
            </View>

            {/* Tenant Card details (no bottom actions) */}
            <View style={[styles.card, { backgroundColor: cardBgThemeColor }]}>
              <View style={styles.cardUpper}>
                <Image
                  source={{ uri: selectedTenant.image }}
                  style={styles.profileImage}
                  contentFit="cover"
                />
                <View style={styles.cardDetails}>
                  <View style={styles.cardTitleRow}>
                    <Text style={[styles.tenantNameText, { color: textColor }]} numberOfLines={1}>
                      {selectedTenant.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleEdit(selectedTenant)} style={styles.editBtn}>
                      <FontAwesome name="pencil-square-o" size={20} color={textColor} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.metaRow}>
                    <FontAwesome name="home" size={14} color="#9747FF" style={styles.metaIcon} />
                    <Text style={[styles.metaText, { color: textColor }]}>{selectedTenant.property}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <FontAwesome name="map-marker" size={14} color="#9747FF" style={styles.metaIcon} />
                    <Text style={[styles.metaText, { color: textColor }]} numberOfLines={1}>
                      {selectedTenant.location}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Segmented Control */}
            <View style={styles.segmentContainer}>
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  activeSegment === "Details" ? styles.segmentBtnActive : styles.segmentBtnInactive
                ]}
                onPress={() => setActiveSegment("Details")}
              >
                <Text style={styles.segmentText}>Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  activeSegment === "Bills" ? styles.segmentBtnActive : { backgroundColor: "rgba(151, 71, 255, 0.45)" }
                ]}
                onPress={() => setActiveSegment("Bills")}
              >
                <Text style={styles.segmentText}>Bills & Dues</Text>
              </TouchableOpacity>
            </View>

            {activeSegment === "Details" ? (
              /* TAB 1: DETAILS CONTENT */
              <View>
                {/* Block 1: Occupancy details */}
                <View style={[styles.detailsCard, { backgroundColor: inputBgThemeColor }]}>
                  {/* Full Name */}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Full Name</Text>
                    <View style={styles.detailValContainer}>
                      <Text style={[styles.detailValue, { color: textColor }]}>{selectedTenant.name}</Text>
                      <Text style={styles.detailBar}> |</Text>
                    </View>
                  </View>

                  {/* Occupancy */}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Occupancy</Text>
                    <View style={styles.detailValContainer}>
                      <Text style={[styles.detailValue, { color: textColor }]}>{selectedTenant.occupancy}</Text>
                      <Text style={styles.detailBar}> |</Text>
                    </View>
                  </View>

                  {/* Room Number */}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Room Number</Text>
                    <View style={styles.detailValContainer}>
                      <Text style={[styles.detailValue, { color: textColor }]}>{selectedTenant.roomNumber}</Text>
                      <Text style={styles.detailBar}> |</Text>
                    </View>
                  </View>

                  {/* Due Date */}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Due Date</Text>
                    <View style={styles.detailValContainer}>
                      <Text style={[styles.detailValue, { color: textColor }]}>{selectedTenant.dueDate}</Text>
                      <Text style={styles.detailBar}> |</Text>
                    </View>
                  </View>
                </View>

                {/* Section Header: Personal Details */}
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: textColor }]}>Personal Details</Text>
                  <TouchableOpacity onPress={() => handleEdit(selectedTenant)}>
                    <FontAwesome name="pencil-square-o" size={20} color={yellowText} />
                  </TouchableOpacity>
                </View>

                {/* Block 2: Personal details */}
                <View style={[styles.personalCard, { backgroundColor: inputBgThemeColor }]}>
                  {/* Phone */}
                  <View style={styles.personalRow}>
                    <View style={styles.personalIconBox}>
                      <FontAwesome name="phone" size={16} color="#B380FF" />
                    </View>
                    <Text style={styles.personalDivider}>|</Text>
                    <Text style={[styles.personalText, { color: textColor }]}>{selectedTenant.phone}</Text>
                  </View>

                  {/* Email */}
                  <View style={styles.personalRow}>
                    <View style={styles.personalIconBox}>
                      <FontAwesome name="envelope-o" size={15} color="#B380FF" />
                    </View>
                    <Text style={styles.personalDivider}>|</Text>
                    <Text style={[styles.personalText, { color: textColor }]}>{selectedTenant.email}</Text>
                  </View>

                  {/* Birthday */}
                  <View style={styles.personalRow}>
                    <View style={styles.personalIconBox}>
                      <FontAwesome name="birthday-cake" size={15} color="#B380FF" />
                    </View>
                    <Text style={styles.personalDivider}>|</Text>
                    <Text style={[styles.personalText, { color: textColor }]}>{selectedTenant.birthday}</Text>
                  </View>

                  {/* Blood Group */}
                  <View style={styles.personalRow}>
                    <View style={styles.personalIconBox}>
                      <FontAwesome name="tint" size={16} color="#B380FF" />
                    </View>
                    <Text style={styles.personalDivider}>|</Text>
                    <Text style={[styles.personalText, { color: textColor }]}>{selectedTenant.bloodGroup}</Text>
                  </View>

                  {/* Permanent Address */}
                  <View style={styles.personalRow}>
                    <View style={styles.personalIconBox}>
                      <FontAwesome name="home" size={16} color="#B380FF" />
                    </View>
                    <Text style={styles.personalDivider}>|</Text>
                    <Text style={[styles.personalText, { color: textColor }]} numberOfLines={2}>
                      {selectedTenant.permanentAddress}
                    </Text>
                  </View>
                </View>

                {/* Block 3: Emergency Contact Header */}
                <TouchableOpacity 
                  style={[styles.sectionHeader, styles.emergencyHeaderCard, { backgroundColor: inputBgThemeColor }]}
                  onPress={() => setIsEmergencyExpanded(!isEmergencyExpanded)}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.sectionTitle, { color: textColor }]}>Emergency Contact</Text>
                  <View style={styles.emergencyHeaderRight}>
                    <TouchableOpacity onPress={() => handleEdit(selectedTenant)} style={{ marginRight: 16 }}>
                      <FontAwesome name="pencil-square-o" size={20} color={yellowText} />
                    </TouchableOpacity>
                    <FontAwesome 
                      name={isEmergencyExpanded ? "chevron-up" : "chevron-down"} 
                      size={14} 
                      color={textColor} 
                    />
                  </View>
                </TouchableOpacity>

                {isEmergencyExpanded && (
                  <View style={[styles.emergencyContent, { backgroundColor: inputBgThemeColor }]}>
                    <View style={styles.emergencyRow}>
                      <Text style={styles.emergencyLabel}>Contact Name:</Text>
                      <Text style={[styles.emergencyVal, { color: textColor }]}>{selectedTenant.emergencyName} ({selectedTenant.emergencyRelation})</Text>
                    </View>
                    <View style={[styles.emergencyRow, { marginTop: 8 }]}>
                      <Text style={styles.emergencyLabel}>Phone:</Text>
                      <TouchableOpacity onPress={() => handleCall(selectedTenant.emergencyPhone)}>
                        <Text style={[styles.emergencyPhoneText, { color: yellowText }]}>{selectedTenant.emergencyPhone}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              /* TAB 2: BILLS & DUES CONTENT */
              <View style={styles.billsListContainer}>
                {/* Card 1: Electricity Bill */}
                <View style={[styles.billCard, { backgroundColor: inputBgThemeColor }]}>
                  <View style={styles.billCardHeader}>
                    <Text style={styles.billCardTitle}>Electricity Bill</Text>
                    <Text style={styles.billCardAmount}>Rs. 1500</Text>
                  </View>
                  <View style={styles.billCardDetails}>
                    <View style={styles.billCardMetaCol}>
                      <FontAwesome name="calendar" size={14} color="#B380FF" />
                      <Text style={styles.billCardMetaText}>June</Text>
                    </View>
                    <View style={styles.billCardMetaCol}>
                      <Text style={styles.billCardMetaText}>
                        {isElectricityPaid ? "Paid Successfully" : "Due on 05 June, 2024"}
                      </Text>
                      <FontAwesome 
                        name={isElectricityPaid ? "check-circle" : "clock-o"} 
                        size={14} 
                        color={isElectricityPaid ? "#25D366" : "#B380FF"} 
                        style={{ marginLeft: 6 }}
                      />
                    </View>
                  </View>
                  {!isElectricityPaid && (
                    <View style={styles.billCardButtons}>
                      <TouchableOpacity 
                        style={styles.billOutlineBtn}
                        onPress={() => {
                          Alert.alert("Success", "Electricity Bill has been marked as paid.");
                          setIsElectricityPaid(true);
                        }}
                      >
                        <Text style={styles.billOutlineBtnText}>Mark as Paid</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.billSolidBtn}
                        onPress={() => {
                          Alert.alert("Reminder Sent", `A payment reminder for Electricity Bill has been sent to ${selectedTenant.name}.`);
                        }}
                      >
                        <Text style={styles.billSolidBtnText}>Remind to Pay</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Card 2: Maintenance Bill */}
                <View style={[styles.billCard, { backgroundColor: inputBgThemeColor }]}>
                  <View style={styles.billCardHeader}>
                    <Text style={styles.billCardTitle}>Maintenance Bill</Text>
                    <Text style={styles.billCardAmount}>Rs. 1000</Text>
                  </View>
                  <View style={styles.billCardDetails}>
                    <View style={styles.billCardMetaCol}>
                      <FontAwesome name="calendar" size={14} color="#B380FF" />
                      <Text style={styles.billCardMetaText}>June</Text>
                    </View>
                    <View style={styles.billCardMetaCol}>
                      <Text style={styles.billCardMetaText}>
                        {isMaintenancePaid ? "Paid Successfully" : "Due on 05 June, 2024"}
                      </Text>
                      <FontAwesome 
                        name={isMaintenancePaid ? "check-circle" : "clock-o"} 
                        size={14} 
                        color={isMaintenancePaid ? "#25D366" : "#B380FF"} 
                        style={{ marginLeft: 6 }}
                      />
                    </View>
                  </View>
                  {!isMaintenancePaid && (
                    <View style={styles.billCardButtons}>
                      <TouchableOpacity 
                        style={styles.billOutlineBtn}
                        onPress={() => {
                          Alert.alert("Success", "Maintenance Bill has been marked as paid.");
                          setIsMaintenancePaid(true);
                        }}
                      >
                        <Text style={styles.billOutlineBtnText}>Mark as Paid</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.billSolidBtn}
                        onPress={() => {
                          Alert.alert("Reminder Sent", `A payment reminder for Maintenance Bill has been sent to ${selectedTenant.name}.`);
                        }}
                      >
                        <Text style={styles.billSolidBtnText}>Remind to Pay</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        ) : (
          /* PROPERTIES LIST VIEW */
          <View>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={[styles.titleLabel, { color: textColor }]}>Everything about</Text>
              <Text style={[styles.titleText, { color: purpleText }]}>My Tenants</Text>
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

            {/* Tenant Cards List */}
            <View style={styles.tenantsList}>
              {filteredTenants.length > 0 ? (
                filteredTenants.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.9}
                    onPress={() => { setSelectedTenant(item); setActiveSegment("Details"); }}
                    style={[styles.card, { backgroundColor: cardBgThemeColor }]}
                  >
                    {/* Upper Section */}
                    <View style={styles.cardUpper}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.profileImage}
                        contentFit="cover"
                      />
                      <View style={styles.cardDetails}>
                        <View style={styles.cardTitleRow}>
                          <Text style={[styles.tenantNameText, { color: textColor }]} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                            <FontAwesome name="pencil-square-o" size={20} color={textColor} />
                          </TouchableOpacity>
                        </View>

                        {/* Property Row */}
                        <View style={styles.metaRow}>
                          <FontAwesome name="home" size={14} color="#9747FF" style={styles.metaIcon} />
                          <Text style={[styles.metaText, { color: textColor }]}>{item.property}</Text>
                        </View>

                        {/* Location Row */}
                        <View style={styles.metaRow}>
                          <FontAwesome name="map-marker" size={14} color="#9747FF" style={styles.metaIcon} />
                          <Text style={[styles.metaText, { color: textColor }]} numberOfLines={1}>
                            {item.location}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Divider Line */}
                    <View style={[styles.divider, { backgroundColor: inputBorderThemeColor }]} />

                    {/* Action Buttons Row */}
                    <View style={styles.cardBottom}>
                      {/* Call Tenant */}
                      <TouchableOpacity 
                        style={styles.actionCol} 
                        onPress={() => handleCall(item.phone)}
                      >
                        <FontAwesome name="phone" size={16} color="#9747FF" />
                        <Text style={styles.actionText}>Call Tenant</Text>
                      </TouchableOpacity>

                      {/* Divider */}
                      <View style={[styles.verticalDivider, { backgroundColor: inputBorderThemeColor }]} />

                      {/* WhatsApp */}
                      <TouchableOpacity 
                        style={styles.actionCol} 
                        onPress={() => handleWhatsApp(item.phone)}
                      >
                        <FontAwesome name="whatsapp" size={18} color="#25D366" />
                        <Text style={styles.actionText}>WhatsApp</Text>
                      </TouchableOpacity>

                      {/* Divider */}
                      <View style={[styles.verticalDivider, { backgroundColor: inputBorderThemeColor }]} />

                      {/* Remove Tenant */}
                      <TouchableOpacity 
                        style={styles.actionCol} 
                        onPress={() => handleRemove(item.id, item.name)}
                      >
                        <FontAwesome name="user-times" size={16} color="#9747FF" />
                        <Text style={styles.actionText}>Remove Tenant</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <FontAwesome name="users" size={48} color={placeholderColor} style={{ marginBottom: 12 }} />
                  <Text style={[styles.emptyText, { color: placeholderColor }]}>No tenants found</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/(auth)/addTenant")}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Add Tenant Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBgThemeColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Add New Tenant</Text>
            
            {/* Input Name */}
            <Text style={[styles.inputLabel, { color: textColor }]}>Tenant Name</Text>
            <TextInput
              style={[styles.modalInput, { color: textColor, borderColor: inputBorderThemeColor }]}
              placeholder="Enter name"
              placeholderTextColor={placeholderColor}
              value={newTenantName}
              onChangeText={setNewTenantName}
            />

            {/* Input Property Selection */}
            <Text style={[styles.inputLabel, { color: textColor }]}>Assigned Property</Text>
            <View style={styles.simulatedPickerRow}>
              {["Tea Villa", "Indie Flats"].map((prop) => (
                <TouchableOpacity
                  key={prop}
                  style={[
                    styles.pickerOption,
                    newTenantProperty === prop && { backgroundColor: "#9747FF" }
                  ]}
                  onPress={() => {
                    setNewTenantProperty(prop);
                    setNewTenantLocation(
                      prop === "Tea Villa"
                        ? "Shiv Nagar, 2nd Street"
                        : "H.M Road, BP-3rd Lane"
                    );
                  }}
                >
                  <Text style={{ color: newTenantProperty === prop ? "#FFF" : textColor, fontSize: 13 }}>
                    {prop}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Input Phone */}
            <Text style={[styles.inputLabel, { color: textColor }]}>Phone Number</Text>
            <TextInput
              style={[styles.modalInput, { color: textColor, borderColor: inputBorderThemeColor }]}
              placeholder="e.g. +91 98765 43210"
              placeholderTextColor={placeholderColor}
              keyboardType="phone-pad"
              value={newTenantPhone}
              onChangeText={setNewTenantPhone}
            />

            {/* Modal Buttons */}
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn, { borderColor: inputBorderThemeColor }]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={{ color: textColor, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleAddTenant}
              >
                <Text style={{ color: "#FFF", fontWeight: "600" }}>Save Tenant</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    paddingBottom: 100,
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
  tenantsList: {
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  cardUpper: {
    flexDirection: "row",
    padding: 18,
    alignItems: "center",
  },
  profileImage: {
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
    marginBottom: 4,
  },
  tenantNameText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  editBtn: {
    paddingLeft: 12,
    paddingVertical: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  metaIcon: {
    marginRight: 8,
    width: 14,
    textAlign: "center",
  },
  metaText: {
    fontSize: 13,
    opacity: 0.8,
  },
  divider: {
    height: 1,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  actionCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  verticalDivider: {
    width: 1,
    height: 24,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B380FF",
    marginLeft: 6,
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
  // Modal layout
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
    fontSize: 14,
  },
  simulatedPickerRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9747FF",
    marginRight: 10,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtn: {
    borderWidth: 1.5,
    marginRight: 12,
  },
  saveBtn: {
    backgroundColor: "#9747FF",
  },

  // DETAILS VIEW STYLES
  detailContainer: {
    paddingHorizontal: 24,
  },
  segmentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  segmentBtnActive: {
    backgroundColor: "#9747FF",
  },
  segmentBtnInactive: {
    backgroundColor: "rgba(151, 71, 255, 0.45)",
  },
  segmentText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
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
  },
  detailBar: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#B380FF",
    opacity: 0.8,
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
  personalCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  personalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  personalIconBox: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  personalDivider: {
    fontSize: 14,
    color: "#B380FF",
    marginHorizontal: 12,
    opacity: 0.8,
  },
  personalText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  emergencyHeaderCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  emergencyHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  emergencyContent: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  emergencyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emergencyLabel: {
    fontSize: 14,
    color: "#B380FF",
    fontWeight: "500",
    marginRight: 8,
  },
  emergencyVal: {
    fontSize: 14,
    fontWeight: "500",
  },
  emergencyPhoneText: {
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  // Tab 2: Bills list
  billsListContainer: {
    paddingBottom: 24,
  },
  billCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  billCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  billCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  billCardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFDE6F",
  },
  billCardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  billCardMetaCol: {
    flexDirection: "row",
    alignItems: "center",
  },
  billCardMetaText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginLeft: 6,
  },
  billCardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billOutlineBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  billOutlineBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  billSolidBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#9747FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  billSolidBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
});
