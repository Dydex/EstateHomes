import React, { useState } from "react";
import { 
  Text, 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function PasswordScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const purpleText = useThemeColor({ dark: '#9747FF' }, 'text');
  
  const inputBgThemeColor = useThemeColor({ light: '#F5F5F5', dark: '#222426' }, 'background');
  const borderThemeColor = useThemeColor({ light: '#E5E7EB', dark: '#2E3032' }, 'background');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Simple validation checks
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;
  const hasNoSpecialChars = !/[@&_!().^#]/.test(password);

  const canSubmit = hasLetter && hasNumber && hasMinLength && hasNoSpecialChars && password === confirmPassword;

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
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={20} color={textColor} />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: purpleText }]}>Set Up Your Password</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>
              Secure your account with your new password
            </Text>
          </View>

          {/* Password Requirements Card */}
          <View style={[
            styles.requirementsContainer, 
            { 
              borderColor: borderThemeColor, 
              backgroundColor: inputBgThemeColor 
            }
          ]}>
            <Text style={[styles.requirementsTitle, { color: textColor }]}>
              Your Password should contain:
            </Text>
            
            <View style={styles.requirementRow}>
              <FontAwesome 
                name={hasLetter ? "check-circle" : "circle-o"} 
                size={16} 
                color={hasLetter ? "#10B981" : textColor} 
                style={styles.reqIcon}
              />
              <Text style={[styles.requirementText, { color: textColor }]}>A letter</Text>
            </View>

            <View style={styles.requirementRow}>
              <FontAwesome 
                name={hasNumber ? "check-circle" : "circle-o"} 
                size={16} 
                color={hasNumber ? "#10B981" : textColor} 
                style={styles.reqIcon}
              />
              <Text style={[styles.requirementText, { color: textColor }]}>A number</Text>
            </View>

            <View style={styles.requirementRow}>
              <FontAwesome 
                name={hasMinLength ? "check-circle" : "circle-o"} 
                size={16} 
                color={hasMinLength ? "#10B981" : textColor} 
                style={styles.reqIcon}
              />
              <Text style={[styles.requirementText, { color: textColor }]}>Minimum of 8 characters</Text>
            </View>

            <View style={styles.requirementRow}>
              <FontAwesome 
                name={password.length > 0 && !hasNoSpecialChars ? "times-circle" : "check-circle"} 
                size={16} 
                color={password.length > 0 && !hasNoSpecialChars ? "#EF4444" : "#10B981"} 
                style={styles.reqIcon}
              />
              <Text style={[
                styles.requirementWarning, 
                { color: password.length > 0 && !hasNoSpecialChars ? "#EF4444" : textColor }
              ]}>
                Special characters like @, &, _, !, (.), ^, # are NOT allowed
              </Text>
            </View>
          </View>

          {/* Password Input */}
          <View style={[
            styles.inputRow,
            {
              borderColor: isPasswordFocused ? '#9747FF' : borderThemeColor,
              backgroundColor: inputBgThemeColor
            }
          ]}>
            <TextInput
              style={[styles.inputField, { color: textColor }]}
              placeholder="Enter your new password"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome 
                name={showPassword ? "eye" : "eye-slash"} 
                size={20} 
                color="#6B7280" 
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={[
            styles.inputRow,
            {
              borderColor: isConfirmPasswordFocused ? '#9747FF' : borderThemeColor,
              backgroundColor: inputBgThemeColor
            }
          ]}>
            <TextInput
              style={[styles.inputField, { color: textColor }]}
              placeholder="Confirm your new password"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setIsConfirmPasswordFocused(true)}
              onBlur={() => setIsConfirmPasswordFocused(false)}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesome 
                name={showConfirmPassword ? "eye" : "eye-slash"} 
                size={20} 
                color="#6B7280" 
              />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              { opacity: canSubmit ? 1 : 0.6 }
            ]} 
            onPress={() => router.push('/(auth)/goals')}
            // disabled={!canSubmit}
          >
            <Text style={styles.submitButtonText}>Save Password</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingRight: 16,
    marginTop: 8,
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
  requirementsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reqIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  requirementText: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
    flex: 1,
  },
  requirementWarning: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  eyeButton: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
});