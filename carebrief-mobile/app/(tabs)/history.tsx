import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/Colors';
import { usePatient } from '@/constants/PatientContext';
import { logsData } from '@/constants/Data';
import { LogCard } from '@/components/LogCard';

export default function HistoryScreen() {
  const { selectedPatient } = usePatient();

  const patientLogs = selectedPatient?.id ? logsData[selectedPatient.id] || [] : [];

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {patientLogs.length > 0 ? (
          patientLogs.map((log) => <LogCard key={log.id} log={log} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: Colors.textMuted }]}>
              記録がありません
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: 15,
  },
});
