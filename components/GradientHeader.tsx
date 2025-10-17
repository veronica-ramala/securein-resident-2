import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { s, vs, fontSize } from '../utils/responsive';
import { HEADER_GRADIENT_COLORS } from '../constants/headerStyles';

interface GradientHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  centerContent?: React.ReactNode;
}

export default function GradientHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  leftAction,
  rightAction,
  centerContent,
}: GradientHeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <LinearGradient
      colors={HEADER_GRADIENT_COLORS}
      style={[styles.header, { paddingTop: statusBarHeight + vs(15) }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContent}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : leftAction ? (
            leftAction
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          {centerContent ? (
            centerContent
          ) : (
            <>
              {title && <Text style={styles.title}>{title}</Text>}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </>
          )}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightAction || <View style={styles.placeholder} />}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: vs(15),
    paddingHorizontal: s(15),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    width: s(40),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(8),
  },
  rightSection: {
    width: s(40),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    padding: s(5),
  },
  placeholder: {
    width: s(24),
  },
  title: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.medium,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: vs(2),
  },
});