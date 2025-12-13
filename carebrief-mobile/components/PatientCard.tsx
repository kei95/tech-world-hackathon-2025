import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/Colors';
import type { Patient } from '@/lib/types';

interface PatientCardProps {
  patient: Patient;
  onPress: () => void;
  selected: boolean;
}

const getFlagConfig = (level: string) => {
  switch (level) {
    case 'red':
      return {
        bgColor: Colors.alertRedLight,
        textColor: Colors.alertRed,
        icon: 'alert-circle' as const,
        label: '要注意（高）',
      };
    case 'yellow':
      return {
        bgColor: Colors.alertYellowLight,
        textColor: Colors.alertYellow,
        icon: 'alert-triangle' as const,
        label: '要注意（中）',
      };
    default:
      return {
        bgColor: Colors.successLight,
        textColor: Colors.success,
        icon: 'check-circle' as const,
        label: '安定',
      };
  }
};

export function PatientCard({ patient, onPress, selected }: PatientCardProps) {
  const flagConfig = getFlagConfig(patient.flagLevel);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: Colors.backgroundElevated,
          borderColor: selected ? Colors.primary : 'transparent',
        },
        selected && { backgroundColor: Colors.primaryLight },
        Shadows.md,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <View style={[styles.avatar, { backgroundColor: Colors.primaryLight }]}>
            <Feather name="user" size={20} color={Colors.primary} />
          </View>
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: Colors.text }]}>{patient.name}</Text>
            <Text style={[styles.meta, { color: Colors.textSecondary }]}>
              {patient.age}歳 · {patient.gender}
            </Text>
          </View>
        </View>
        {selected && (
          <View style={[styles.checkmark, { backgroundColor: Colors.primary }]}>
            <Feather name="check" size={16} color={Colors.textInverse} />
          </View>
        )}
      </View>

      <View style={[styles.flagBadge, { backgroundColor: flagConfig.bgColor }]}>
        <Feather name={flagConfig.icon} size={14} color={flagConfig.textColor} />
        <Text style={[styles.flagText, { color: flagConfig.textColor }]}>
          {flagConfig.label}
        </Text>
      </View>

      {patient.flagReason && (
        <Text style={[styles.flagReason, { color: Colors.textSecondary }]}>
          {patient.flagReason}
        </Text>
      )}

      <View style={[styles.footer, { borderTopColor: Colors.border }]}>
        <Feather name="clock" size={12} color={Colors.textMuted} />
        <Text style={[styles.lastUpdate, { color: Colors.textMuted }]}>
          最終更新: {patient.lastUpdate}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  meta: {
    fontSize: 13,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  flagText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  flagReason: {
    fontSize: 14,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  lastUpdate: {
    fontSize: 12,
    marginLeft: 4,
  },
});
