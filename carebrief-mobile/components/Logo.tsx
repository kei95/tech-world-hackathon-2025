import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 32 }: LogoProps) {
  // Calculate border radius proportional to size (roughly 16% of size)
  const borderRadius = Math.round(size * 0.16);

  return (
    <Image
      source={require('@/assets/images/icon.png')}
      style={[styles.logo, { width: size, height: size, borderRadius }]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    overflow: 'hidden',
  },
});
