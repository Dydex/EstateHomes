import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const blueRingSize = screenWidth * 1.25;
const goldRingSize = screenWidth * 1.6;

// Dropdown option types
type DropdownType = "gender" | "blood" | "occupancy";

export default function AddTenantScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const purpleText = useThemeColor({ dark: '#9747FF' }, 'text');
  const yellowText = useThemeColor({ dark: '#FFDE6F' }, 'text');

  const inputBgThemeColor = useThemeColor({ light: '#F5F5F5', dark: '#1E1E20' }, 'background');
  const inputBorderThemeColor = useThemeColor({ light: '#E5E7EB', dark: '#2E3032' }, 'background');
  const placeholderColor = useThemeColor({ light: '#9CA3AF', dark: '#7C7C80' }, 'text');
  const cardBgThemeColor = useThemeColor({ light: '#FFFFFF', dark: '#1E1E20' }, 'background');

  // Step state (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);

  // --- Step 1 Form States ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");

  // --- Step 2 Form States ---
  const [stayGender, setStayGender] = useState(""); // gender field on step 2
  const [roomNumber, setRoomNumber] = useState("");
  const [occupancy, setOccupancy] = useState("");

  // --- Step 3 Form States ---
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyEmail, setEmergencyEmail] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyAddress, setEmergencyAddress] = useState("");

  // --- Step 4 Form States ---
  const [fatherName, setFatherName] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherPhone, setMotherPhone] = useState("");
  const [parentsOccupation, setParentsOccupation] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");

  // --- Step 5 Form States (Document simulation) ---
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  // Picker States
  const [activePicker, setActivePicker] = useState<DropdownType | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selDay, setSelDay] = useState("13");
  const [selMonth, setSelMonth] = useState("November");
  const [selYear, setSelYear] = useState("1995");

  const handleNext = () => {
    // Basic validation before moving to next step
    // if (currentStep === 1) {
    //   if (!firstName || !lastName || !gender || !address) {
    //     Alert.alert("Required Fields", "Please fill in the required fields (Name, Gender, Address).");
    //     return;
    //   }
    // } else if (currentStep === 2) {
    //   if (!roomNumber || !occupancy) {
    //     Alert.alert("Required Fields", "Please enter Room Number and Occupancy details.");
    //     return;
    //   }
    // } else if (currentStep === 3) {
    //   if (!mobileNumber || !email || !emergencyName || !emergencyPhone) {
    //     Alert.alert("Required Fields", "Please fill in contact and primary emergency contact details.");
    //     return;
    //   }
    // }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Go to Step 6 Success screen
      setCurrentStep(6);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Prevent back navigation from step 6 (success screen)
      if (currentStep === 6) {
        router.replace("/(tabs)/tenants");
      } else {
        setCurrentStep(currentStep - 1);
      }
    } else {
      router.back();
    }
  };

  const handleUploadDoc = (docType: string) => {
    if (uploadedDocs.includes(docType)) {
      setUploadedDocs(uploadedDocs.filter((d) => d !== docType));
    } else {
      setUploadedDocs([...uploadedDocs, docType]);
      Alert.alert("Uploaded", `${docType} simulated upload complete.`);
    }
  };

  const handleUploadLater = () => {
    setCurrentStep(6);
  };

  // Render modal picker dropdown
  const renderPickerModal = () => {
    if (!activePicker) return null;

    let title = "";
    let options: string[] = [];
    let onSelect = (val: string) => {};

    if (activePicker === "gender") {
      title = "Select Gender";
      options = ["Male", "Female", "Other"];
      onSelect = (val) => {
        if (currentStep === 1) setGender(val);
        else setStayGender(val);
      };
    } else if (activePicker === "blood") {
      title = "Select Blood Group";
      options = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      onSelect = (val) => setBloodGroup(val);
    } else if (activePicker === "occupancy") {
      title = "Select Occupancy Type";
      options = ["Single", "Double Sharing", "Couple"];
      onSelect = (val) => setOccupancy(val);
    }

    return (
      <Modal visible transparent animationType="fade" onRequestClose={() => setActivePicker(null)}>
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActivePicker(null)}
        >
          <View style={[styles.modalContent, { backgroundColor: cardBgThemeColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>{title}</Text>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.modalOption, { borderColor: inputBorderThemeColor }]}
                onPress={() => {
                  onSelect(opt);
                  setActivePicker(null);
                }}
              >
                <Text style={{ color: textColor, fontSize: 16 }}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderDatePickerModal = () => {
    if (!isDatePickerVisible) return null;

    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const years = Array.from({ length: 87 }, (_, i) => (2026 - i).toString());

    const handleConfirm = () => {
      const monthIndex = (months.indexOf(selMonth) + 1).toString().padStart(2, "0");
      setDob(`${selDay}/${monthIndex}/${selYear}`);
      setIsDatePickerVisible(false);
    };

    return (
      <Modal visible transparent animationType="slide" onRequestClose={() => setIsDatePickerVisible(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsDatePickerVisible(false)}
        >
          <TouchableOpacity 
            style={[styles.datePickerContent, { backgroundColor: cardBgThemeColor }]} 
            activeOpacity={1}
          >
            <View style={styles.handleBar} />
            <View style={styles.pickerWheelContainer}>
              <View style={styles.wheelColumn}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.wheelScrollContent}>
                  {days.map((d) => {
                    const isSelected = selDay === d;
                    return (
                      <TouchableOpacity key={d} style={styles.wheelItem} onPress={() => setSelDay(d)}>
                        <Text style={[styles.wheelItemText, isSelected ? { color: "#FFFFFF", fontWeight: "bold" } : { color: "#555" }]}>
                          {parseInt(d, 10)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={[styles.wheelColumn, { flex: 1.5 }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.wheelScrollContent}>
                  {months.map((m) => {
                    const isSelected = selMonth === m;
                    return (
                      <TouchableOpacity key={m} style={styles.wheelItem} onPress={() => setSelMonth(m)}>
                        <Text style={[styles.wheelItemText, isSelected ? { color: "#FFFFFF", fontWeight: "bold" } : { color: "#555" }]}>
                          {m}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={styles.wheelColumn}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.wheelScrollContent}>
                  {years.map((y) => {
                    const isSelected = selYear === y;
                    return (
                      <TouchableOpacity key={y} style={styles.wheelItem} onPress={() => setSelYear(y)}>
                        <Text style={[styles.wheelItemText, isSelected ? { color: "#FFFFFF", fontWeight: "bold" } : { color: "#555" }]}>
                          {y}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
            <View style={styles.selectionHighlightBar} pointerEvents="none" />
            <TouchableOpacity style={styles.okButton} onPress={handleConfirm}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  // Progress percentage calculation
  const progressPercent = `${currentStep * 20}%` as any;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor }]}>
      {/* Header Row */}
      {currentStep < 6 && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome name="arrow-left" size={20} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Add New Tenant</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.replace("/(tabs)")}>
              <FontAwesome name="home" size={22} color={yellowText} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert("Alert", "Notifications window.")}>
              <FontAwesome name="bell-o" size={21} color={yellowText} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Progress Bar indicator */}
      {currentStep < 6 && (
        <View style={[styles.progressBarBg, { backgroundColor: inputBorderThemeColor }]}>
          <View style={[styles.progressBarFill, { width: progressPercent }]} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={currentStep === 6 ? styles.successScrollContent : styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {currentStep === 1 && (
          /* STEP 1: PERSONAL DETAILS */
          <View style={styles.formContainer}>
            <Text style={[styles.stepLabel, { color: yellowText }]}>
              Personal Details<Text style={styles.requiredStar}>*</Text>
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="First Name"
              placeholderTextColor={placeholderColor}
              value={firstName}
              onChangeText={setFirstName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Last Name"
              placeholderTextColor={placeholderColor}
              value={lastName}
              onChangeText={setLastName}
            />

            {/* Gender Select */}
            <TouchableOpacity
              style={[styles.dropdownInput, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor }]}
              onPress={() => setActivePicker("gender")}
            >
              <Text style={{ color: gender ? textColor : placeholderColor, fontSize: 14 }}>
                {gender || "Gender"}
              </Text>
              <FontAwesome name="chevron-down" size={12} color={textColor} />
            </TouchableOpacity>

            {/* Date of Birth selector */}
            <TouchableOpacity
              style={[styles.dropdownInput, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor }]}
              onPress={() => setIsDatePickerVisible(true)}
            >
              <Text style={{ color: dob ? textColor : placeholderColor, fontSize: 14 }}>
                {dob || "Date of Birth"}
              </Text>
              <FontAwesome name="calendar" size={16} color={placeholderColor} />
            </TouchableOpacity>

            {/* Blood Group Select */}
            <TouchableOpacity
              style={[styles.dropdownInput, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor }]}
              onPress={() => setActivePicker("blood")}
            >
              <Text style={{ color: bloodGroup ? textColor : placeholderColor, fontSize: 14 }}>
                {bloodGroup || "Blood Group"}
              </Text>
              <FontAwesome name="chevron-down" size={12} color={textColor} />
            </TouchableOpacity>

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Address"
              placeholderTextColor={placeholderColor}
              value={address}
              onChangeText={setAddress}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 2 && (
          /* STEP 2: STAY DETAILS */
          <View style={styles.formContainer}>
            <Text style={[styles.stepLabel, { color: yellowText }]}>
              Stay Details<Text style={styles.requiredStar}>*</Text>
            </Text>

            {/* Stay Gender Select */}
            <TouchableOpacity
              style={[styles.dropdownInput, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor }]}
              onPress={() => setActivePicker("gender")}
            >
              <Text style={{ color: stayGender ? textColor : placeholderColor, fontSize: 14 }}>
                {stayGender || "Gender"}
              </Text>
              <FontAwesome name="chevron-down" size={12} color={textColor} />
            </TouchableOpacity>

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Room Number"
              placeholderTextColor={placeholderColor}
              keyboardType="numeric"
              value={roomNumber}
              onChangeText={setRoomNumber}
            />

            {/* Occupancy Select */}
            <TouchableOpacity
              style={[styles.dropdownInput, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor }]}
              onPress={() => setActivePicker("occupancy")}
            >
              <Text style={{ color: occupancy ? textColor : placeholderColor, fontSize: 14 }}>
                {occupancy || "Occupancy"}
              </Text>
              <FontAwesome name="chevron-down" size={12} color={textColor} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 3 && (
          /* STEP 3: CONTACT & EMERGENCY DETAILS */
          <View style={styles.formContainer}>
            <Text style={[styles.stepLabel, { color: yellowText }]}>
              Contact Details<Text style={styles.requiredStar}>*</Text>
            </Text>

            {/* Flag flag + country code simulated row */}
            <View style={styles.phoneInputRow}>
              <View style={[styles.flagCol, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor }]}>
                <Text style={{ fontSize: 16, marginRight: 4 }}>🇮🇳</Text>
                <Text style={{ color: textColor, fontSize: 13 }}>+91</Text>
                <FontAwesome name="chevron-down" size={8} color={textColor} style={{ marginLeft: 4 }} />
              </View>
              <TextInput
                style={[styles.phoneTextInput, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
                placeholder="Enter your Mobile Number"
                placeholderTextColor={placeholderColor}
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Email Address"
              placeholderTextColor={placeholderColor}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            {/* Emergency sub-form */}
            <Text style={[styles.subSectionTitle, { color: textColor }]}>
              Emergency Contact Details
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Emergency Contact Name"
              placeholderTextColor={placeholderColor}
              value={emergencyName}
              onChangeText={setEmergencyName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Emergency Contact Mobile Number"
              placeholderTextColor={placeholderColor}
              keyboardType="phone-pad"
              value={emergencyPhone}
              onChangeText={setEmergencyPhone}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Emergency Contact's Email Address"
              placeholderTextColor={placeholderColor}
              keyboardType="email-address"
              value={emergencyEmail}
              onChangeText={setEmergencyEmail}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Relationship with Emergency Contact"
              placeholderTextColor={placeholderColor}
              value={emergencyRelation}
              onChangeText={setEmergencyRelation}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Emergency Contact Address"
              placeholderTextColor={placeholderColor}
              value={emergencyAddress}
              onChangeText={setEmergencyAddress}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 4 && (
          /* STEP 4: PARENT'S & GUARDIAN DETAILS */
          <View style={styles.formContainer}>
            <Text style={[styles.stepLabel, { color: yellowText, marginBottom: 14 }]}>
              Parent's Details
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Father's Name"
              placeholderTextColor={placeholderColor}
              value={fatherName}
              onChangeText={setFatherName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Father's Mobile Number"
              placeholderTextColor={placeholderColor}
              keyboardType="phone-pad"
              value={fatherPhone}
              onChangeText={setFatherPhone}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Mother's Name"
              placeholderTextColor={placeholderColor}
              value={motherName}
              onChangeText={setMotherName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Mother's Mobile Number"
              placeholderTextColor={placeholderColor}
              keyboardType="phone-pad"
              value={motherPhone}
              onChangeText={setMotherPhone}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Parent's Occupation"
              placeholderTextColor={placeholderColor}
              value={parentsOccupation}
              onChangeText={setParentsOccupation}
            />

            {/* Local Guardian Section */}
            <Text style={[styles.subSectionTitle, { color: textColor }]}>
              Local Guardian Details
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Local Guardian's Name"
              placeholderTextColor={placeholderColor}
              value={guardianName}
              onChangeText={setGuardianName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Local Guardian's Contact"
              placeholderTextColor={placeholderColor}
              keyboardType="phone-pad"
              value={guardianPhone}
              onChangeText={setGuardianPhone}
            />

            <TextInput
              style={[styles.input, { backgroundColor: inputBgThemeColor, borderColor: inputBorderThemeColor, color: textColor }]}
              placeholder="Local Guardian's Email"
              placeholderTextColor={placeholderColor}
              keyboardType="email-address"
              value={guardianEmail}
              onChangeText={setGuardianEmail}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 5 && (
          /* STEP 5: UPLOAD DOCUMENTS */
          <View style={styles.formContainer}>
            <Text style={[styles.stepLabel, { color: yellowText, marginBottom: 14 }]}>
              Upload Documents
            </Text>

            {[
              "Agreement Paper",
              "Aadhar Card",
              "Voter Card",
              "Police Verification",
              "Father's ID",
              "Mother's ID"
            ].map((docType) => {
              const isUploaded = uploadedDocs.includes(docType);
              return (
                <TouchableOpacity
                  key={docType}
                  style={[
                    styles.uploadSlot,
                    { backgroundColor: inputBgThemeColor, borderColor: isUploaded ? "#25D366" : inputBorderThemeColor }
                  ]}
                  onPress={() => handleUploadDoc(docType)}
                >
                  <Text style={{ color: isUploaded ? "#25D366" : textColor, fontSize: 14 }}>
                    {docType}
                  </Text>
                  <FontAwesome 
                    name={isUploaded ? "check" : "upload"} 
                    size={14} 
                    color={isUploaded ? "#25D366" : textColor} 
                  />
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadLaterBtn} onPress={handleUploadLater}>
              <Text style={[styles.uploadLaterText, { color: placeholderColor }]}>
                Upload later
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 6 && (
          <View style={styles.successContainer}>
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
            <View style={styles.successContent}>
              <View style={styles.badgeCircle}>
                <FontAwesome name="check" size={56} color="#FFDE6F" />
              </View>

              <Text style={[styles.successTitle, { color: yellowText }]}>
                New Tenant Added{"\n"}Succesfully
              </Text>

              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={() => {
                  setFirstName("");
                  setLastName("");
                  setGender("");
                  setDob("");
                  setBloodGroup("");
                  setAddress("");
                  setStayGender("");
                  setRoomNumber("");
                  setOccupancy("");
                  setMobileNumber("");
                  setEmail("");
                  setEmergencyName("");
                  setEmergencyPhone("");
                  setEmergencyEmail("");
                  setEmergencyRelation("");
                  setEmergencyAddress("");
                  setFatherName("");
                  setFatherPhone("");
                  setMotherName("");
                  setMotherPhone("");
                  setParentsOccupation("");
                  setGuardianName("");
                  setGuardianPhone("");
                  setGuardianEmail("");
                  setUploadedDocs([]);
                  setCurrentStep(1);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Add Another Tenant</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={() => router.replace("/(tabs)/tenants")}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Go to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      {renderPickerModal()}
      {renderDatePickerModal()}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: 18,
    padding: 4,
  },
  progressBarBg: {
    height: 4,
    width: "100%",
    position: "relative",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#9747FF",
    borderRadius: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  requiredStar: {
    color: "#E2B93B",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 14,
  },
  dropdownInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iconInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iconInput: {
    flex: 1,
    fontSize: 14,
    height: "100%",
  },
  inputRightIcon: {
    marginLeft: 10,
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  flagCol: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    height: 48,
    width: 80,
    marginRight: 10,
  },
  phoneTextInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 16,
  },
  uploadSlot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  primaryBtn: {
    backgroundColor: "#9747FF",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
    shadowColor: "#9747FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadLaterBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  uploadLaterText: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  // Modal layout
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
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  // Date Picker wheel styles
  datePickerContent: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    position: "absolute",
    bottom: 0,
    alignItems: "center",
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#555558",
    marginBottom: 20,
  },
  pickerWheelContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    height: 200,
    position: "relative",
  },
  wheelColumn: {
    flex: 1,
    height: "100%",
  },
  wheelScrollContent: {
    paddingVertical: 80,
  },
  wheelItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  wheelItemText: {
    fontSize: 16,
  },
  selectionHighlightBar: {
    position: "absolute",
    height: 40,
    width: "100%",
    borderColor: "#3A3A3C",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    top: 108,
    zIndex: -1,
  },
  okButton: {
    marginTop: 24,
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
  },
  okButtonText: {
    color: "#9747FF",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Success page styles
  successScrollContent: {
    flexGrow: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    minHeight: screenHeight - 100,
    width: "100%",
  },
  successContent: {
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 40,
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
  // Background rings
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
