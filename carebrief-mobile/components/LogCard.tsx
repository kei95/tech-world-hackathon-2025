import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/Colors';
import type { CareLog } from '@/lib/types';

interface LogCardProps {
  log: CareLog;
}

export function LogCard({ log }: LogCardProps) {
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: Colors.backgroundElevated,
        borderLeftColor: Colors.primary
      },
      Shadows.sm,
    ]}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Feather name="calendar" size={14} color={Colors.textMuted} />
          <Text style={[styles.date, { color: Colors.textSecondary }]}>{log.date}</Text>
          <Text style={[styles.time, { color: Colors.textMuted }]}>{log.time}</Text>
        </View>
        <View style={styles.authorContainer}>
          <Feather name="user" size={12} color={Colors.textMuted} />
          <Text style={[styles.author, { color: Colors.textMuted }]}>{log.author}</Text>
        </View>
      </View>
      <Text style={[styles.content, { color: Colors.text }]}>{log.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
  time: {
    fontSize: 13,
    marginLeft: Spacing.sm,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    marginLeft: 4,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
});
