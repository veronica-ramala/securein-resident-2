// constants/headerStyles.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

// Global header colors from facilities screen
export const HEADER_GRADIENT_COLORS = ['#0077B6', '#90CAF9'];
export const HEADER_TEXT_COLOR = '#FFFFFF'; // White text for contrast

// Custom header background component
export const HeaderBackground = () => (
  <LinearGradient
    colors={HEADER_GRADIENT_COLORS}
    style={{ flex: 1 }}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  />
);

// Global screen options for consistent header styling
export const globalHeaderOptions = {
  headerStyle: {
    backgroundColor: HEADER_GRADIENT_COLORS[0], // Primary color as fallback
  },
  headerTintColor: HEADER_TEXT_COLOR,
  headerTitleStyle: {
    fontWeight: 'bold' as const,
    fontSize: 18,
    color: HEADER_TEXT_COLOR,
  },
  headerBackground: () => <HeaderBackground />,
};