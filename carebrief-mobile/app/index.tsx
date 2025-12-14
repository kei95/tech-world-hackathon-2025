import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/Colors';
import { usePatient } from '@/constants/PatientContext';
import { Logo } from '@/components/Logo';
import { PatientCard } from '@/components/PatientCard';
import { PatientCardSkeleton } from '@/components/Skeleton';
import { useUsers } from '@/hooks/useUsers';
import type { Patient } from '@/lib/types';

export default function PatientSelectScreen() {
  const { selectedPatient, setSelectedPatient } = usePatient();
  const [localSelected, setLocalSelected] = useState<Patient | null>(selectedPatient);
  const { users, loading, refresh, isRefreshing, error } = useUsers();

  const handlePatientSelect = (patient: Patient) => {
    setLocalSelected(patient);
  };

  const handleContinue = () => {
    if (localSelected) {
      setSelectedPatient(localSelected);
      router.push('/(tabs)/log');
    }
  };

  const renderPatientItem = useCallback(
    ({ item }: { item: Patient }) => (
      <PatientCard
        patient={item}
        selected={localSelected?.id === item.id}
        onPress={() => handlePatientSelect(item)}
      />
    ),
    [localSelected]
  );

  const renderSkeletons = () => (
    <View style={styles.patientListContent}>
      {[1, 2, 3, 4].map((i) => (
        <PatientCardSkeleton key={i} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo size={44} />
          <Text style={[styles.logoText, { color: Colors.text }]}>CareBrief</Text>
        </View>
        <Text style={[styles.subtitle, { color: Colors.textMuted }]}>
          介護記録をもっとかんたんに
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>担当患者を選択</Text>
        <Text style={[styles.sectionSubtitle, { color: Colors.textSecondary }]}>
          記録を作成する患者様を選んでください
        </Text>

        {loading && !isRefreshing ? (
          renderSkeletons()
        ) : error ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={48} color={Colors.alertRed} />
            <Text style={[styles.errorText, { color: Colors.textSecondary }]}>
              データの読み込みに失敗しました
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: Colors.primary }]}
              onPress={refresh}
            >
              <Text style={[styles.retryButtonText, { color: Colors.textInverse }]}>
                再読み込み
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={users}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id}
            style={styles.patientList}
            contentContainerStyle={styles.patientListContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="users" size={48} color={Colors.textMuted} />
                <Text style={[styles.emptyText, { color: Colors.textMuted }]}>
                  患者データがありません
                </Text>
              </View>
            }
          />
        )}
      </View>

      <View style={[styles.footer, { backgroundColor: Colors.backgroundElevated, borderTopColor: Colors.border }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: localSelected ? Colors.primary : Colors.textMuted },
            Shadows.md,
          ]}
          onPress={handleContinue}
          disabled={!localSelected}
          activeOpacity={0.8}
        >
          <Text style={[styles.continueButtonText, { color: Colors.textInverse }]}>
            {localSelected ? `${localSelected.name}様の記録へ` : '患者を選択してください'}
          </Text>
          <Feather name="arrow-right" size={20} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  patientList: {
    flex: 1,
  },
  patientListContent: {
    paddingBottom: Spacing.lg,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  continueButton: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  errorText: {
    fontSize: 15,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  retryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: 15,
    marginTop: Spacing.md,
  },
});
