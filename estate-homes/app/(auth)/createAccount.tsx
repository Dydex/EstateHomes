import React, { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import {router} from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
];

export default function CreateAccountScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const purpleText = useThemeColor({ dark: '#9747FF' }, 'text');
  
  const inputBgThemeColor = useThemeColor({ light: '#F5F5F5', dark: '#222426' }, 'background');
  const borderThemeColor = useThemeColor({ light: '#E5E7EB', dark: '#2E3032' }, 'background');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[4]); // Default to India (+91)
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  );

  useEffect(() => {
    // Configure Google Sign-In with Web Client ID from the Google Developer Console
    GoogleSignin.configure({
      // webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const handleGoogleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google User Info:', userInfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled Google Sign-In');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Google Sign-In already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Google Play Services not available or outdated');
      } else {
        console.error('Google Sign-In error:', error);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: purpleText }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>Please enter your details below to continue.</Text>
          </View>

          {/* Phone Number Input with Country Picker */}
          <View style={[
            styles.inputRow,
            {
              borderColor: isPhoneFocused ? '#9747FF' : borderThemeColor,
              backgroundColor: inputBgThemeColor
            }
          ]}>
            <TouchableOpacity style={styles.countryPickerButton} onPress={() => setIsPickerVisible(true)}>
              <Image
                source={{ uri: `https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png` }}
                style={styles.flagImage}
                contentFit="contain"
              />
              <Text style={[styles.countryCodeText, { color: textColor }]}>{selectedCountry.dialCode}</Text>
              <Text style={[styles.dropdownIcon, { color: textColor }]}>⌄</Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.phoneInput, { color: textColor }]}
              placeholder="Enter your Mobile Number"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={() => setIsPhoneFocused(false)}
            />
          </View>

          {/* Email Input */}
          <TextInput
            style={[
              styles.inputField,
              {
                borderColor: isEmailFocused ? '#9747FF' : borderThemeColor,
                backgroundColor: inputBgThemeColor,
                color: textColor
              }
            ]}
            placeholder="Enter your Email Address"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
          />

          {/* Continue Button */}
          <TouchableOpacity style={styles.submitButton} onPress={() => router.replace('/(auth)/otp')}>
            <Text style={styles.submitButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Or Divider */}
          <View style={styles.orContainer}>
            <View style={[styles.orLine, { backgroundColor: borderThemeColor }]} />
            <Text style={[styles.orText, { color: textColor }]}>OR</Text>
            <View style={[styles.orLine, { backgroundColor: borderThemeColor }]} />
          </View>

          {/* Google Sign-Up Button */}
          <TouchableOpacity 
            style={[styles.googleButton, { borderColor: borderThemeColor }]} 
            onPress={handleGoogleSignUp}
          >
            <FontAwesome name="google" size={20} color="#DB4437" style={styles.googleIcon} />
            <Text style={[styles.googleButtonText, { color: textColor }]}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[{ color: textColor }]}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/login' as any)}>
              <Text style={[styles.loginText, { color: purpleText }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Code Picker Modal */}
      <Modal
        visible={isPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Select Country</Text>
              <TouchableOpacity onPress={() => { setIsPickerVisible(false); setSearchQuery(''); }}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* Search Input */}
            <TextInput
              style={[styles.searchInput, { borderColor: borderThemeColor, backgroundColor: inputBgThemeColor, color: textColor }]}
              placeholder="Search country..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.countryItem, { borderBottomColor: borderThemeColor }]}
                  onPress={() => {
                    setSelectedCountry(item);
                    setIsPickerVisible(false);
                    setSearchQuery('');
                  }}
                >
                  <Image
                    source={{ uri: `https://flagcdn.com/w40/${item.code.toLowerCase()}.png` }}
                    style={styles.countryItemFlagImage}
                    contentFit="contain"
                  />
                  <Text style={[styles.countryItemName, { color: textColor }]}>{item.name}</Text>
                  <Text style={styles.countryItemDialCode}>{item.dialCode}</Text>
                </TouchableOpacity>
              )}
            />
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.7,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingRight: 4,
  },
  flagImage: {
    width: 24,
    height: 16,
    borderRadius: 2,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownIcon: {
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 4,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#9747FF',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#9CA3AF',
    padding: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  countryItemFlagImage: {
    width: 30,
    height: 20,
    borderRadius: 2,
    marginRight: 16,
  },
  countryItemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  countryItemDialCode: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 52,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 4,
  },
  loginText: {
    fontSize: 15,
    fontWeight: '600',
  },
});