// app/welcome-flash.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, fontSize, spacing, s, vs, ms } from '../utils/responsive';

const { width, height } = Dimensions.get('window');

export default function WelcomeFlashScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [slideAnim] = useState(new Animated.Value(50));
  const [progressAnim] = useState(new Animated.Value(0));
  const [dotRotation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    Animated.timing(progressAnim, { toValue: 1, duration: 2000, useNativeDriver: false }).start();

    const rotationAnimation = Animated.loop(
      Animated.timing(dotRotation, { toValue: 1, duration: 2000, useNativeDriver: true })
    );
    rotationAnimation.start();

    const timer = setTimeout(() => {
      // ✅ Enter the Drawer (it opens Tabs by default)
      router.replace('/(drawer)');
    }, 2500);

    return () => {
      clearTimeout(timer);
      rotationAnimation.stop();
    };
  }, [router, fadeAnim, scaleAnim, slideAnim, progressAnim, dotRotation]);

  const spin = dotRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#2196F3" />
      <LinearGradient colors={['#2196F3', '#1E88E5', '#2196F3']} style={styles.gradient}>
        <View style={styles.content}>
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ],
              },
            ]}
          >
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.appName}>SECUREIN</Text>
            <Text style={styles.tagline}>Community Management</Text>
          </Animated.View>

          {/* Welcome Message */}
          <Animated.View
            style={[
              styles.welcomeContainer,
              { opacity: fadeAnim }
            ]}
          >
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subText}>Loading your community...</Text>
          </Animated.View>

          {/* Loading Indicator */}
          <Animated.View
            style={[
              styles.loadingContainer,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { width: progressWidth }
                ]}
              />
            </View>
            
            {/* Rotating Dots */}
            <Animated.View
              style={[
                styles.dotsContainer,
                { transform: [{ rotate: spin }] }
              ]}
            >
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </Animated.View>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196F3',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 140,
    height: 140,
    marginBottom: 24,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: '#E3F2FD',
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#E3F2FD',
    fontWeight: '400',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  progressBarContainer: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  dotsContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
  },
  dot1: {
    top: 0,
    left: 25,
  },
  dot2: {
    bottom: 0,
    left: 5,
  },
  dot3: {
    bottom: 0,
    right: 5,
  },
});
