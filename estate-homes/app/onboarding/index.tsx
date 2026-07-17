import { useRef } from 'react';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({ dark: '#D4D4D4' }, 'text');
  const scrollViewRef = useRef<ScrollView>(null);
  const { completeOnboarding } = useAuth();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView
        ref={scrollViewRef}
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
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, { backgroundColor: '#F6C10F' }]} />
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
          </View>
          <Text style={[styles.text, { color: textColor }]}>
            {"Effortlessly manage all your\nproperty details in one place.\nUpdate descriptions, amenities,\nand availability with ease."}
          </Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {
              scrollViewRef.current?.scrollTo({ x: width * 2, animated: true });
            }}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
              <Text style={[styles.skipButtonText, { color: textColor }]}>Skip</Text>
            </TouchableOpacity>
          </View>


        </View>
        <View style={[styles.slide, { width }]} >
          <Image source={require('@/assets/images/Frame-12.png')}
            style={styles.Frame}
            contentFit='contain'
          />
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
            <View style={[styles.indicator, { backgroundColor: '#F6C10F' }]} />
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
          </View>
          <Text style={[styles.text, { color: textColor }]} >
            {"Keep track of your tenants and\nstreamline communication. View\ntenant information, manage lease\ndetails, and connect seamlessly."}
          </Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {
              scrollViewRef.current?.scrollTo({ x: width * 3, animated: true });
            }}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
              <Text style={[styles.skipButtonText, { color: textColor }]}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.slide, { width }]} >
          <Image source={require('@/assets/images/Frame-13.png')}
            style={styles.Frame}
            contentFit='contain'
          />
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
            <View style={[styles.indicator, { backgroundColor: '#F6C10F' }]} />
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
          </View>
          <Text style={[styles.text, { color: textColor }]} >
            {"Send timely reminders to tenants\nabout upcoming rent payments.\nStay organized and ensure smooth\nfinancial management."}
          </Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {
              scrollViewRef.current?.scrollTo({ x: width * 4, animated: true });
            }}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
              <Text style={[styles.skipButtonText, { color: textColor }]}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.slide, { width }]} >
          <Image source={require('@/assets/images/Frame-14.png')}
            style={styles.Frame}
            contentFit='contain'
          />
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
            <View style={[styles.indicator, { backgroundColor: '#FFF7D7' }]} />
            <View style={[styles.indicator, { backgroundColor: '#F6C10F' }]} />
          </View>
          <Text style={[styles.text, { color: textColor }]} >
            {"Upload and manage stunning\nphotos and videos of your rentals.\nMake a lasting impression on\npotential tenants and showcase\nyour properties effectively."}
          </Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {
              scrollViewRef.current?.scrollTo({ x: width * 5, animated: true });
            }}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
            <View style={[styles.skipButton, { opacity: 0 }]} pointerEvents="none">
              <Text style={styles.skipButtonText}>Skip</Text>
            </View>
          </View>
        </View>
        <View style={[styles.slide, { width }]} >
          <Image source={require('@/assets/images/Frame-15.png')}
            style={styles.Frame}
            contentFit='contain'
          />
          <View style={[styles.indicatorContainer, { opacity: 0 }]} pointerEvents="none">
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
          <Text style={[styles.text, { color: textColor }]} >
            {"Select “ALLOW” to receive\nnotifications on real-time updates\nabout rental payment reminders,\nmaintenance requests and more."}
          </Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={[styles.button, { width: '75%' }]} onPress={completeOnboarding}>
              <Text style={styles.buttonText} numberOfLines={1} adjustsFontSizeToFit>
                Turn On Notifications
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
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
    marginBottom: 12,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.8,
    height: 120,
  },
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

