import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const PROPERTY_TYPES = ["Apartment", "Villa", "Independent House", "Condo", "Studio", "Commercial"];
const VACANT_ROOMS = ["1 Room", "2 Rooms", "3 Rooms", "4 Rooms", "5+ Rooms"];
const OCCUPANCY_TYPES = ["Single Room", "Shared Room", "Full House", "Any"];

export default function AddPropertyScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const purpleText = useThemeColor({ dark: '#9747FF' }, 'text');
  
  const inputBgThemeColor = useThemeColor({ light: '#F5F5F5', dark: '#1E1E20' }, 'background');
  const inputBorderThemeColor = useThemeColor({ light: '#E5E7EB', dark: '#2E3032' }, 'background');
  const placeholderColor = useThemeColor({ light: '#9CA3AF', dark: '#7C7C80' }, 'text');
  const modalBgColor = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');

  // Input states
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [vacantRooms, setVacantRooms] = useState("");
  const [occupancyType, setOccupancyType] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // UI state for dropdowns
  const [activeSelector, setActiveSelector] = useState<'propertyType' | 'vacantRooms' | 'occupancyType' | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // File upload simulation
  const handleUploadSimulate = () => {
    if (uploadedFiles.length >= 5) {
      Alert.alert("Limit Reached", "You can upload up to 5 files max.");
      return;
    }
    const dummyNames = [
      "lease_agreement.pdf",
      "property_tax_receipt.pdf",
      "utility_bill.png",
      "insurance_policy.pdf",
      "ownership_certificate.jpg"
    ];
    // Find a file name that is not already uploaded
    const availableName = dummyNames.find(name => !uploadedFiles.includes(name)) || `document_${uploadedFiles.length + 1}.pdf`;
    setUploadedFiles([...uploadedFiles, availableName]);
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f !== fileName));
  };

  const handleSubmit = () => {
    // if (!propertyName || !propertyType || !vacantRooms || !occupancyType || !streetAddress || !city || !pinCode) {
    //   Alert.alert("Required Fields", "Please fill in all non-optional fields.");
    //   return;
    // }
    // Route to main app
    router.replace("/propertySuccess");
  };

  const renderSelectorModal = () => {
    if (!activeSelector) return null;

    let title = "";
    let options: string[] = [];
    let selectedValue = "";
    let onSelect = (val: string) => {};

    if (activeSelector === "propertyType") {
      title = "Select Property Type";
      options = PROPERTY_TYPES;
      selectedValue = propertyType;
      onSelect = (val) => {
        setPropertyType(val);
        setActiveSelector(null);
      };
    } else if (activeSelector === "vacantRooms") {
      title = "Select Number of Vacant Rooms";
      options = VACANT_ROOMS;
      selectedValue = vacantRooms;
      onSelect = (val) => {
        setVacantRooms(val);
        setActiveSelector(null);
      };
    } else if (activeSelector === "occupancyType") {
      title = "Select Type of Occupancy";
      options = OCCUPANCY_TYPES;
      selectedValue = occupancyType;
      onSelect = (val) => {
        setOccupancyType(val);
        setActiveSelector(null);
      };
    }

    return (
      <Modal
        visible={!!activeSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveSelector(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setActiveSelector(null)}
        >
          <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>{title}</Text>
              <TouchableOpacity onPress={() => setActiveSelector(null)}>
                <FontAwesome name="times-circle" size={24} color={textColor} style={{ opacity: 0.5 }} />
              </TouchableOpacity>
            </View>
            <View style={styles.optionsContainer}>
              {options.map((option) => {
                const isSelected = selectedValue === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionItem,
                      { borderColor: inputBorderThemeColor }
                    ]}
                    onPress={() => onSelect(option)}
                  >
                    <Text style={[
                      styles.optionText, 
                      { 
                        color: isSelected ? "#9747FF" : textColor,
                        fontWeight: isSelected ? "bold" : "normal"
                      }
                    ]}>
                      {option}
                    </Text>
                    {isSelected && (
                      <FontAwesome name="check" size={16} color="#9747FF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={20} color={textColor} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: purpleText }]}>
            Add Your Property Details
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            Fill in the following details to add your first property
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Property Name */}
          <TextInput
            style={[
              styles.inputField,
              {
                backgroundColor: inputBgThemeColor,
                borderColor: focusedField === "propertyName" || propertyName ? "#9747FF" : inputBorderThemeColor,
                color: textColor
              }
            ]}
            placeholder="Name of your property"
            placeholderTextColor={placeholderColor}
            value={propertyName}
            onChangeText={setPropertyName}
            onFocus={() => setFocusedField("propertyName")}
            onBlur={() => setFocusedField(null)}
          />

          {/* Property Type Dropdown */}
          <TouchableOpacity 
            style={[
              styles.inputField, 
              styles.dropdownField,
              { 
                backgroundColor: inputBgThemeColor, 
                borderColor: propertyType ? "#9747FF" : inputBorderThemeColor 
              }
            ]}
            onPress={() => setActiveSelector("propertyType")}
          >
            <Text style={[
              styles.inputText, 
              { color: propertyType ? textColor : placeholderColor }
            ]}>
              {propertyType || "Type of property"}
            </Text>
            <FontAwesome name="chevron-down" size={14} color="#9747FF" />
          </TouchableOpacity>

          {/* Vacant Rooms Dropdown */}
          <TouchableOpacity 
            style={[
              styles.inputField, 
              styles.dropdownField,
              { 
                backgroundColor: inputBgThemeColor, 
                borderColor: vacantRooms ? "#9747FF" : inputBorderThemeColor 
              }
            ]}
            onPress={() => setActiveSelector("vacantRooms")}
          >
            <Text style={[
              styles.inputText, 
              { color: vacantRooms ? textColor : placeholderColor }
            ]}>
              {vacantRooms || "Number of vacant rooms"}
            </Text>
            <FontAwesome name="chevron-down" size={14} color="#9747FF" />
          </TouchableOpacity>

          {/* Occupancy Type Dropdown */}
          <TouchableOpacity 
            style={[
              styles.inputField, 
              styles.dropdownField,
              { 
                backgroundColor: inputBgThemeColor, 
                borderColor: occupancyType ? "#9747FF" : inputBorderThemeColor 
              }
            ]}
            onPress={() => setActiveSelector("occupancyType")}
          >
            <Text style={[
              styles.inputText, 
              { color: occupancyType ? textColor : placeholderColor }
            ]}>
              {occupancyType || "Type of occupancy"}
            </Text>
            <FontAwesome name="chevron-down" size={14} color="#9747FF" />
          </TouchableOpacity>

          {/* Street Address */}
          <TextInput
            style={[
              styles.inputField,
              {
                backgroundColor: inputBgThemeColor,
                borderColor: focusedField === "streetAddress" || streetAddress ? "#9747FF" : inputBorderThemeColor,
                color: textColor
              }
            ]}
            placeholder="Street Address"
            placeholderTextColor={placeholderColor}
            value={streetAddress}
            onChangeText={setStreetAddress}
            onFocus={() => setFocusedField("streetAddress")}
            onBlur={() => setFocusedField(null)}
          />

          {/* House No, Room, Floor (Optional) */}
          <TextInput
            style={[
              styles.inputField,
              {
                backgroundColor: inputBgThemeColor,
                borderColor: focusedField === "houseNo" || houseNo ? "#9747FF" : inputBorderThemeColor,
                color: textColor
              }
            ]}
            placeholder="House no., floor, room, etc. (optional)"
            placeholderTextColor={placeholderColor}
            value={houseNo}
            onChangeText={setHouseNo}
            onFocus={() => setFocusedField("houseNo")}
            onBlur={() => setFocusedField(null)}
          />

          {/* City */}
          <TextInput
            style={[
              styles.inputField,
              {
                backgroundColor: inputBgThemeColor,
                borderColor: focusedField === "city" || city ? "#9747FF" : inputBorderThemeColor,
                color: textColor
              }
            ]}
            placeholder="City"
            placeholderTextColor={placeholderColor}
            value={city}
            onChangeText={setCity}
            onFocus={() => setFocusedField("city")}
            onBlur={() => setFocusedField(null)}
          />

          {/* Pin code */}
          <TextInput
            style={[
              styles.inputField,
              {
                backgroundColor: inputBgThemeColor,
                borderColor: focusedField === "pinCode" || pinCode ? "#9747FF" : inputBorderThemeColor,
                color: textColor
              }
            ]}
            placeholder="Pin code"
            placeholderTextColor={placeholderColor}
            value={pinCode}
            onChangeText={setPinCode}
            keyboardType="numeric"
            onFocus={() => setFocusedField("pinCode")}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={[styles.uploadTitle, { color: textColor }]}>
            Upload property documents
          </Text>
          <Text style={[styles.uploadSubtitle, { color: placeholderColor }]}>
            Add your documents here, you can upload up to 5 files max
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.uploadBox, 
              { 
                borderColor: "#9747FF", 
                backgroundColor: inputBgThemeColor 
              }
            ]}
            onPress={handleUploadSimulate}
            activeOpacity={0.7}
          >
            <FontAwesome name="cloud-upload" size={24} color="#9747FF" style={{ marginBottom: 6 }} />
            <Text style={[styles.uploadBoxText, { color: textColor }]}>
              Tap to upload documents
            </Text>
            <Text style={[styles.uploadBoxSubtext, { color: placeholderColor }]}>
              PDF, PNG, JPG (max 5MB)
            </Text>
          </TouchableOpacity>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <View style={styles.fileList}>
              {uploadedFiles.map((file) => (
                <View 
                  key={file} 
                  style={[
                    styles.fileItem, 
                    { 
                      backgroundColor: inputBgThemeColor, 
                      borderColor: inputBorderThemeColor 
                    }
                  ]}
                >
                  <View style={styles.fileInfo}>
                    <FontAwesome name="file-text-o" size={16} color="#9747FF" style={{ marginRight: 8 }} />
                    <Text style={[styles.fileName, { color: textColor }]} numberOfLines={1}>
                      {file}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveFile(file)} style={styles.removeBtn}>
                    <FontAwesome name="trash" size={16} color="#FF4D4D" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Save & Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Dropdown Selector Modal */}
      {renderSelectorModal()}
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  formContainer: {
    width: "100%",
    marginBottom: 24,
  },
  inputField: {
    width: "100%",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    marginBottom: 16,
    justifyContent: "center",
  },
  dropdownField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    fontSize: 16,
  },
  uploadSection: {
    marginBottom: 32,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  uploadBox: {
    width: "100%",
    height: 110,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  uploadBoxText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  uploadBoxSubtext: {
    fontSize: 12,
  },
  fileList: {
    marginTop: 12,
    width: "100%",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    flex: 1,
  },
  removeBtn: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: "#9747FF",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionsContainer: {
    width: "100%",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});