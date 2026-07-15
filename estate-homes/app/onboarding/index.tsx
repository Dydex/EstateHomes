import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({#D4D4D4}, 'text');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Slide 1: Logo Only */}
        <View style={[styles.slide, { width }]}>
          <Image
            source={require('@/assets/images/home-logo-1.png')}
            style={styles.home}
            contentFit="contain"
          />
        </View>

        {/* Slide 2: Feature Introduction */}
        <View style={[styles.slide, { width }]}>
          <Image
            source={require('@/assets/images/Frame-11.png')}
            style={styles.Frame}
            contentFit="contain"
          />
          <Text style={[styles.text, { color: textColor }]}>
            {"Effortlessly manage all your\nproperty details in one place.\nUpdate descriptions, amenities,\nand availability with ease."}
          </Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={() => { }}>
              <Text style={[styles.skipButtonText, { color: textColor }]}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.slide, { width }]} >
          <Image source={require('@/assets/images/Frame-12.png')}
            style={styles.Frame}
            contentFit='contain'
          />
          <Text style={[styles.text, { color: textColor }]} >
            {"Keep track of your tenants and\nstreamline communication. View\ntenant information, manage lease\ndetails, and connect seamlessly."}
          </Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={() => { }}>
              <Text style={[styles.skipButtonText, { color: textColor }]}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.slide, { width }]} >
          <Image source={require('@/assets/images/Frame-13.png')}
            style={styles.Frame}
            contentFit='contain'
          />
          <Text style={[styles.text, { color: textColor }]} >
            {"Send timely reminders to tenants\nabout upcoming rent payments.\nStay organized and ensure smooth\nfinancial management."}
          </Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={() => { }}>
              <Text style={[styles.skipButtonText, { color: textColor }]}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.slide, { width }]} >
          <Image source={require('@/assets/images/Frame-14.png')}
            style={styles.Frame}
            contentFit='contain'
          />
          <Text style={[styles.startText, { color: textColor }]} >
            {"Upload and manage stunning\nphotos and videos of your rentals.\nMake a lasting impression on\npotential tenants and showcase\nyour properties effectively."}
          </Text>
          <View style={styles.startButttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.slide, { width }]} >
          <Image source={require('@/assets/images/Frame-15.png')}
            style={styles.Frame}
            contentFit='contain'
          />
          <Text style={[styles.text, { color: textColor }]} >
            {"Select “ALLOW” to receive\nnotifications on real-time updates\nabout rental payment reminders,\nmaintenance requests and more."}
          </Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>Turn On Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={() => { }}>
              <Text style={[styles.skipButtonText, { color: textColor }]}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  home: {
    width: 200,
    height: 120,
    alignSelf: 'center',
  },
  Frame: {
    width: 240,
    height: 240,
    alignSelf: 'center',
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.8,
  },
  startText: {fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 42,
    opacity: 0.8,},
  button: {
    backgroundColor: '#9747FF',
    borderRadius: 12,
    paddingVertical: 10,
    width: '50%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80,
  },
  startButttonWrapper: {
     width: '100%',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#D4D4D4',
    fontSize: 16,
    fontWeight: '500',
  },
});
