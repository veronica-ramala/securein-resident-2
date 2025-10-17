import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Heart, MapPin, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// ========== Animated Icon Component with Glow Effect ==========
const AnimatedIconCell = ({ animationProgress, iconIndex, icon: Icon, color, label }) => {
  // Each icon starts appearing at different times
  const iconDelay = iconIndex * 0.15; // 0, 0.15, 0.3
  const startShow = 0.2 + iconDelay;
  const endShow = 0.35 + iconDelay;

  const iconStyle = useAnimatedStyle(() => {
    // Scale with pop effect
    const popScale = interpolate(
      animationProgress.value,
      [startShow - 0.02, startShow, endShow],
      [0, 1.3, 1],
      Extrapolate.CLAMP
    );

    // Opacity fade-in
    const opacity = interpolate(
      animationProgress.value,
      [startShow - 0.05, startShow],
      [0, 1],
      Extrapolate.CLAMP
    );

    // Pulsing glow effect
    const pulseScale = 1 + 0.15 * Math.sin((animationProgress.value - startShow) * Math.PI * 4);

    return {
      transform: [
        { scale: popScale * (animationProgress.value >= endShow ? 1 : pulseScale) },
      ],
      opacity,
    };
  });

  // Glow background effect
  const glowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(
      animationProgress.value,
      [startShow, endShow, 0.6],
      [0, 0.3, 0],
      Extrapolate.CLAMP
    );

    const glowScale = 1 + 0.3 * Math.sin((animationProgress.value - startShow) * Math.PI * 3);

    return {
      opacity: glowOpacity,
      transform: [{ scale: glowScale }],
    };
  });

  return (
    <Animated.View style={[styles.iconCell, iconStyle]}>
      {/* Glow background */}
      <Animated.View
        style={[
          styles.iconGlow,
          { backgroundColor: color },
          glowStyle,
        ]}
      />
      {/* Icon */}
      <Icon size={20} color={color} strokeWidth={2.5} />
      <Text style={styles.iconLabel}>{label}</Text>
    </Animated.View>
  );
};

// ========== Animated Watch Component ==========
const AnimatedWatchScreen = ({ animationProgress }) => {
  const watchScale = useAnimatedStyle(() => ({
    transform: [
      {
        // Zoom-in effect: starts small, rotates, then zooms in
        scale: interpolate(
          animationProgress.value,
          [0, 0.15, 0.35, 0.55],
          [0.2, 0.5, 0.8, 1.1]
        ),
      },
      {
        rotateZ: `${interpolate(
          animationProgress.value,
          [0, 0.35],
          [0, 360]
        )}deg`,
      },
    ],
    opacity: interpolate(
      animationProgress.value,
      [0.5, 0.65],
      [1, 0]
    ),
  }));

  return (
    <Animated.View style={[styles.watchContainer, watchScale]}>
      {/* Watch Body */}
      <View style={styles.watchBody}>
        {/* Watch Screen */}
        <View style={styles.watchScreen}>
          {/* Screen Content */}
          <View style={styles.screenContent}>
            {/* Icon Grid */}
            <View style={styles.iconGrid}>
              {/* Health Monitoring Icon */}
              <AnimatedIconCell
                animationProgress={animationProgress}
                iconIndex={0}
                icon={Heart}
                color="#EF4444"
                label="Health"
              />

              {/* GPS Tracking Icon */}
              <AnimatedIconCell
                animationProgress={animationProgress}
                iconIndex={1}
                icon={MapPin}
                color="#10B981"
                label="GPS"
              />

              {/* SOS Button Icon */}
              <AnimatedIconCell
                animationProgress={animationProgress}
                iconIndex={2}
                icon={AlertCircle}
                color="#F59E0B"
                label="SOS"
              />
            </View>
          </View>
        </View>

        {/* Watch Band */}
        <View style={[styles.watchBand, { top: '30%' }]} />
        <View style={[styles.watchBand, { top: '70%' }]} />
      </View>
    </Animated.View>
  );
};

// ========== Enhanced Particle System (Light Theme) ==========
const Particle = ({ animationProgress, particleIndex }) => {
  const particleStyle = useAnimatedStyle(() => {
    const startProgress = 0.55;
    const endProgress = 0.95;

    if (animationProgress.value < startProgress) {
      return { opacity: 0 };
    }

    const normalizedProgress = interpolate(
      animationProgress.value,
      [startProgress, endProgress],
      [0, 1],
      Extrapolate.CLAMP
    );

    // Randomized particle trajectories for more dynamic effect
    const angle = (particleIndex * 360) / 16; // 16 particles for more coverage
    const distance = normalizedProgress * 500;
    const radian = (angle * Math.PI) / 180;

    // Add some vertical scatter
    const verticalScatter = (Math.sin(particleIndex * 0.5) * normalizedProgress * 100);

    return {
      transform: [
        { translateX: Math.cos(radian) * distance },
        { translateY: Math.sin(radian) * distance + verticalScatter },
      ],
      opacity: interpolate(normalizedProgress, [0, 0.3, 1], [0, 1, 0]),
      scale: interpolate(normalizedProgress, [0, 0.4, 1], [0.5, 1.2, 0.1]),
    };
  });

  // Light theme colors: white, silver, and pastel blue
  const particleColors = ['#FFFFFF', '#F1F5F9', '#E0E7FF', '#C7D2FE', '#A5B4FC'];
  const particleColor = particleColors[particleIndex % particleColors.length];

  return (
    <Animated.View
      style={[
        styles.particle,
        particleStyle,
        {
          backgroundColor: particleColor,
        },
      ]}
    />
  );
};

// ========== Particle Container ==========
const ParticleSystem = ({ animationProgress }) => {
  return (
    <View style={styles.particleContainer}>
      {Array.from({ length: 16 }).map((_, index) => (
        <Particle
          key={index}
          animationProgress={animationProgress}
          particleIndex={index}
        />
      ))}
    </View>
  );
};

// ========== Tabs Component ==========
const SecureBandTabs = () => {
  const [activeTab, setActiveTab] = useState('kids');

  return (
    <SafeAreaView style={styles.tabsContainer} edges={['top', 'bottom']}>
      {/* Tab Headers */}
      <View style={styles.tabHeader}>
        <Animated.View
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'kids' ? '#A5F3FC' : 'transparent',
              borderBottomWidth: activeTab === 'kids' ? 3 : 0,
              borderBottomColor: '#06B6D4',
            },
          ]}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: activeTab === 'kids' ? '#0E7490' : '#94A3B8',
              },
            ]}
            onPress={() => setActiveTab('kids')}
          >
            👦 Kids
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'adults' ? '#E2E8F0' : 'transparent',
              borderBottomWidth: activeTab === 'adults' ? 3 : 0,
              borderBottomColor: '#94A3B8',
            },
          ]}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: activeTab === 'adults' ? '#475569' : '#94A3B8',
              },
            ]}
            onPress={() => setActiveTab('adults')}
          >
            👨‍🦳 Adults
          </Text>
        </Animated.View>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'kids' ? (
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Kids Secure Band</Text>
            <Text style={styles.contentDescription}>
              Monitor and track your children with Health Monitoring, GPS Tracking, and Emergency SOS features.
            </Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>❤️ Real-time health monitoring</Text>
              <Text style={styles.featureItem}>📍 Precise GPS location tracking</Text>
              <Text style={styles.featureItem}>🚨 Instant SOS alerts</Text>
            </View>
          </View>
        ) : (
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Adults Secure Band</Text>
            <Text style={styles.contentDescription}>
              Advanced health monitoring and emergency response system for adults with real-time alerts.
            </Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>❤️ Advanced heart rate monitoring</Text>
              <Text style={styles.featureItem}>📍 Location tracking with geofencing</Text>
              <Text style={styles.featureItem}>🚨 Emergency hotline integration</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ========== Main Screen ==========
export default function SecureBandScreen() {
  const router = useRouter();
  const animationProgress = useSharedValue(0);
  const [showTabs, setShowTabs] = useState(false);

  useEffect(() => {
    animationProgress.value = withTiming(1, {
      duration: 3500,
    });

    // Show tabs after animation completes
    const timer = setTimeout(() => {
      runOnJS(setShowTabs)(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (showTabs) {
    return <SecureBandTabs />;
  }

  return (
    <SafeAreaView style={styles.animationContainer} edges={['bottom']}>
      {/* Light theme gradient background - Sky blue to soft white */}
      <LinearGradient
        colors={['#87CEEB', '#E0F2FE', '#FFFFFF']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientBackground}
      />

      {/* Subtle radial gradient overlay */}
      <View style={styles.animationBackground} />

      {/* Animated Watch */}
      <AnimatedWatchScreen animationProgress={animationProgress} />

      {/* Particle System */}
      <ParticleSystem animationProgress={animationProgress} />
    </SafeAreaView>
  );
}

// ========== Styles ==========
const styles = StyleSheet.create({
  // Animation Container
  animationContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },

  animationBackground: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 1.5,
    borderRadius: width,
    backgroundColor: 'rgba(147, 197, 253, 0.08)',
    top: '50%',
    left: '50%',
    marginTop: -width * 0.75,
    marginLeft: -width * 0.75,
    zIndex: 1,
  },

  // Watch Styles
  watchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  watchBody: {
    width: 200,
    height: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  watchScreen: {
    width: '85%',
    height: '80%',
    backgroundColor: '#F8FAFC',
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
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
    position: 'relative',
  },

  iconGlow: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.2,
  },

  iconLabel: {
    fontSize: 9,
    color: '#475569',
    marginTop: 2,
    fontWeight: '500',
    zIndex: 1,
  },

  watchBand: {
    position: 'absolute',
    width: '40%',
    height: '25%',
    backgroundColor: '#E2E8F0',
    left: '30%',
  },

  // Particle System
  particleContainer: {
    position: 'absolute',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },

  particle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#93C5FD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },

  // Tabs Styles
  tabsContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
    gap: 8,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },

  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },

  contentSection: {
    gap: 16,
  },

  contentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'Poppins',
    marginBottom: 8,
  },

  contentDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    fontFamily: 'Poppins',
  },

  featureList: {
    marginTop: 16,
    gap: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
  },

  featureItem: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    fontFamily: 'Poppins',
  },
});