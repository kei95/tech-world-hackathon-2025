import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = BorderRadius.sm,
  style,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

// Patient card skeleton
export function PatientCardSkeleton() {
  return (
    <View style={[styles.patientCard, { backgroundColor: Colors.backgroundElevated }]}>
      <View style={styles.patientCardContent}>
        <View style={styles.patientCardLeft}>
          <Skeleton width={120} height={18} style={styles.mb8} />
          <Skeleton width={80} height={14} />
        </View>
        <View style={styles.patientCardRight}>
          <Skeleton width={60} height={24} borderRadius={BorderRadius.full} />
        </View>
      </View>
      <Skeleton width="70%" height={12} style={styles.mt12} />
    </View>
  );
}

// Log card skeleton
export function LogCardSkeleton() {
  return (
    <View style={[styles.logCard, { backgroundColor: Colors.backgroundElevated }]}>
      <View style={styles.logCardHeader}>
        <Skeleton width={100} height={14} />
        <Skeleton width={50} height={14} />
      </View>
      <Skeleton width="100%" height={14} style={styles.mt8} />
      <Skeleton width="80%" height={14} style={styles.mt8} />
      <Skeleton width="60%" height={14} style={styles.mt8} />
    </View>
  );
}

// Goal card skeleton
export function GoalCardSkeleton() {
  return (
    <View style={[styles.goalCard, { backgroundColor: Colors.backgroundElevated }]}>
      <View style={styles.goalCardHeader}>
        <Skeleton width={80} height={20} borderRadius={BorderRadius.full} />
        <Skeleton width={24} height={24} borderRadius={BorderRadius.full} />
      </View>
      <Skeleton width="90%" height={16} style={styles.mt12} />
      <View style={styles.mt12}>
        <Skeleton width="100%" height={12} style={styles.mt8} />
        <Skeleton width="85%" height={12} style={styles.mt8} />
        <Skeleton width="70%" height={12} style={styles.mt8} />
      </View>
    </View>
  );
}

// Summary card skeleton
export function SummaryCardSkeleton() {
  return (
    <View style={[styles.summaryCard, { backgroundColor: Colors.primaryLight }]}>
      <View style={styles.summaryHeader}>
        <Skeleton width={18} height={18} borderRadius={9} />
        <Skeleton width={80} height={14} style={{ marginLeft: Spacing.xs }} />
      </View>
      <Skeleton width="100%" height={14} style={styles.mt8} />
      <Skeleton width="90%" height={14} style={styles.mt8} />
    </View>
  );
}

// Log edit card skeleton
export function LogEditSkeleton() {
  return (
    <View style={styles.logEditContainer}>
      <View style={[styles.logEditCard, { backgroundColor: Colors.backgroundElevated }]}>
        <View style={styles.logEditHeader}>
          <Skeleton width={16} height={16} borderRadius={8} />
          <Skeleton width={180} height={12} style={{ marginLeft: Spacing.xs }} />
        </View>
        <View style={styles.mt12}>
          <Skeleton width="100%" height={14} style={styles.mt8} />
          <Skeleton width="95%" height={14} style={styles.mt8} />
          <Skeleton width="88%" height={14} style={styles.mt8} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.border,
  },
  mb8: {
    marginBottom: Spacing.sm,
  },
  mt8: {
    marginTop: Spacing.sm,
  },
  mt12: {
    marginTop: 12,
  },
  patientCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  patientCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patientCardLeft: {
    flex: 1,
  },
  patientCardRight: {
    marginLeft: Spacing.md,
  },
  logCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  logCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    padding: Spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logEditContainer: {
    padding: Spacing.lg,
  },
  logEditCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  logEditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
