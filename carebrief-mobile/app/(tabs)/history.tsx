import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { usePatient } from '@/constants/PatientContext';
import { LogCard } from '@/components/LogCard';
import { LogCardSkeleton } from '@/components/Skeleton';
import { useLogs } from '@/hooks/useLogs';
import type { CareLog } from '@/lib/types';

export default function HistoryScreen() {
  const { selectedPatient } = usePatient();

  const {
    logs,
    loading,
    error,
    refresh,
    isRefreshing,
    disconnect,
  } = useLogs({
    userId: selectedPatient?.id || '',
    enabled: !!selectedPatient?.id,
  });

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const renderLogItem = useCallback(
    ({ item }: { item: CareLog }) => <LogCard log={item} />,
    []
  );

  const renderSkeletons = () => (
    <View style={styles.scrollContent}>
      {[1, 2, 3, 4, 5].map((i) => (
        <LogCardSkeleton key={i} />
      ))}
    </View>
  );

  if (!selectedPatient) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: Colors.background }]}>
        <Feather name="user" size={48} color={Colors.textMuted} />
        <Text style={[styles.emptyText, { color: Colors.textMuted }]}>
          患者を選択してください
        </Text>
      </View>
    );
  }

  if (loading && !isRefreshing) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        {renderSkeletons()}
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: Colors.background }]}>
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
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => String(item.id)}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
          <View style={styles.emptyState}>
            <Feather name="file-text" size={48} color={Colors.textMuted} />
            <Text style={[styles.emptyText, { color: Colors.textMuted }]}>
              記録がありません
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: Spacing.md,
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
});
