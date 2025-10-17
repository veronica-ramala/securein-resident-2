// app/flash-screen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUserContext } from '../context/UserContext';
import ReAnimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Heart, MapPin, AlertCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Animated Watch Component
const AnimatedWatch = ({ animationProgress }) => {
  const watchScale = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          animationProgress.value,
          [0, 0.3, 0.6, 1],
          [0.3, 0.6, 0.95, 1.2]
        ),
      },
      {
        rotateZ: `${interpolate(
          animationProgress.value,
          [0, 0.4],
          [0, 360]
        )}deg`,
      },
    ],
    opacity: interpolate(
      animationProgress.value,
      [0.6, 0.75],
      [1, 0]
    ),
  }));

  return (
    <ReAnimated.View style={[styles.watchContainer, watchScale]}>
      <View style={styles.watchBody}>
        <View style={styles.watchScreen}>
          <View style={styles.screenContent}>
            <View style={styles.iconGrid}>
              <View style={styles.iconCell}>
                <Heart size={20} color="#EF4444" strokeWidth={2.5} />
                <Text style={styles.iconLabel}>Health</Text>
              </View>
              <View style={styles.iconCell}>
                <MapPin size={20} color="#10B981" strokeWidth={2.5} />
                <Text style={styles.iconLabel}>GPS</Text>
              </View>
              <View style={styles.iconCell}>
                <AlertCircle size={20} color="#F59E0B" strokeWidth={2.5} />
                <Text style={styles.iconLabel}>SOS</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.watchBand, { top: '30%' }]} />
        <View style={[styles.watchBand, { top: '70%' }]} />
      </View>
    </ReAnimated.View>
  );
};

export default function FlashScreen() {
  const router = useRouter();
  const { isLoggedIn } = useUserContext() || {};
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = withTiming(1, {
      duration: 2800,
    });

    // Show splash for 3s, then route based on login state
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/(drawer)');
      } else {
        router.replace('/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, isLoggedIn]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        <AnimatedWatch animationProgress={animationProgress} />
        <View style={styles.bottomContainer}>
          <Text style={styles.welcomeText}>Welcome to your community</Text>
          <Text style={styles.appName}>SECUREIN</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  
  // Watch Styles
  watchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },

  watchBody: {
    width: 200,
    height: 240,
    backgroundColor: '#1E1E1E',
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
    borderWidth: 8,
    borderColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  watchScreen: {
    width: '85%',
    height: '80%',
    backgroundColor: '#0A0E27',
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },

  screenContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  iconGrid: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
  },

  iconCell: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  iconLabel: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  watchBand: {
    position: 'absolute',
    width: '40%',
    height: '25%',
    backgroundColor: '#2A2A2A',
    left: '30%',
  },

  // Text Styles
  appName: {
    fontSize: 24, fontWeight: 'bold', color: '#0077B6',
    letterSpacing: 2, marginTop: 20,
    textShadowColor: 'rgba(0,0,0,0.05)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
  },
  bottomContainer: { alignItems: 'center', marginTop: 60 },
  welcomeText: { fontSize: 16, color: '#1E293B', fontWeight: '600', marginBottom: 10, textAlign: 'center' },
});
