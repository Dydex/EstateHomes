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
import { useAuth } from "@/context/auth";

export default function LoginScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const purpleText = useThemeColor({ dark: '#9747FF' }, 'text');

  const inputBgThemeColor = useThemeColor({ light: '#F5F5F5', dark: '#222426' }, 'background');
  const borderThemeColor = useThemeColor({ light: '#E5E7EB', dark: '#2E3032' }, 'background');

  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  // TODO: call POST /api/auth/login and store the returned token once the app is connected to the backend
  const handleSignIn = async () => {
    await signIn();
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
            <Text style={[styles.title, { color: purpleText }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>
              Sign in to continue managing your properties.
            </Text>
          </View>

          {/* Email Input */}
          <View style={[
            styles.inputRow,
            {
              borderColor: isEmailFocused ? '#9747FF' : borderThemeColor,
              backgroundColor: inputBgThemeColor
            }
          ]}>
            <TextInput
              style={[styles.inputField, { color: textColor }]}
              placeholder="Enter your Email Address"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
            />
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
              placeholder="Enter your password"
              placeholderTextColor="#6B7280"
              textContentType="password"
              autoComplete="password"
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

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { opacity: canSubmit ? 1 : 0.6 }]}
            onPress={handleSignIn}
            disabled={!canSubmit}
          >
            <Text style={styles.submitButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={{ color: textColor }}>Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/createAccount')}>
              <Text style={[styles.footerLink, { color: purpleText }]}>Create Account</Text>
            </TouchableOpacity>
          </View>
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  footerLink: {
    fontWeight: '600',
  },
});
