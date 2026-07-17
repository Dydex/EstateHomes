import React, { useState, useRef } from "react";
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

export default function OTPVerificationScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const purpleText = useThemeColor({ dark: '#9747FF' }, 'text');
  
  const inputBgThemeColor = useThemeColor({ light: '#F5F5F5', dark: '#222426' }, 'background');
  const borderThemeColor = useThemeColor({ light: '#E5E7EB', dark: '#2E3032' }, 'background');

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChangeText = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleanText.length > 0) {
      // Use the last character typed
      const digit = cleanText[cleanText.length - 1];
      newOtp[index] = digit;
      setOtp(newOtp);

      // Auto-focus the next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

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
            <Text style={[styles.title, { color: purpleText }]}>6-digit Code</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>
              Enter the 6-digit code sent to{"\n"}
              <Text style={{ fontWeight: '600' }}>9143214569</Text>
            </Text>
          </View>

          {/* 6 OTP Input Fields */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInputBox,
                  {
                    borderColor: focusedIndex === index ? '#9747FF' : borderThemeColor,
                    backgroundColor: inputBgThemeColor,
                    color: textColor
                  }
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity 
            style={[
              styles.submitButton,
              { opacity: isOtpComplete ? 1 : 0.6 }
            ]} 
            onPress={() => router.push('/(auth)/password')}
            // disabled={!isOtpComplete}
          >
            <Text style={styles.submitButtonText}>Verify</Text>
          </TouchableOpacity>

          {/* Resend Code Button */}
          <View style={styles.resendContainer}>
            <Text style={{ color: textColor }}>Didn't receive the code?</Text>
            <TouchableOpacity onPress={() => console.log('Resend OTP')}>
              <Text style={[styles.resendText, { color: purpleText }]}>Resend code</Text>
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
    marginTop: 16,
    marginBottom: 32,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  otpInputBox: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 4,
  },
  resendText: {
    fontSize: 15,
    fontWeight: '600',
  },
});