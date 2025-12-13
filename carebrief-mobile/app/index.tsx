import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/Colors';
import { patients, Patient } from '@/constants/Data';
import { usePatient } from '@/constants/PatientContext';
import { PatientCard } from '@/components/PatientCard';

export default function PatientSelectScreen() {
  const { selectedPatient, setSelectedPatient } = usePatient();
  const [localSelected, setLocalSelected] = useState<Patient | null>(selectedPatient);

  const handlePatientSelect = (patient: Patient) => {
    setLocalSelected(patient);
  };

  const handleContinue = () => {
    if (localSelected) {
      setSelectedPatient(localSelected);
      router.push('/(tabs)/log');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: Colors.primaryLight }]}>
            <Feather name="heart" size={24} color={Colors.primary} />
          </View>
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

        <ScrollView
          style={styles.patientList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.patientListContent}
        >
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              selected={localSelected?.id === patient.id}
              onPress={() => handlePatientSelect(patient)}
            />
          ))}
        </ScrollView>
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
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
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
});
