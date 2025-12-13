import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/Colors';
import { usePatient } from '@/constants/PatientContext';
import { GoalCard } from '@/components/GoalCard';
import { SummaryCardSkeleton, GoalCardSkeleton } from '@/components/Skeleton';
import { useGoals } from '@/hooks/useGoals';
import type { Goal } from '@/lib/types';

type Filter = 'active' | 'completed' | 'all';

export default function GoalsScreen() {
  const { selectedPatient } = usePatient();
  const [filter, setFilter] = useState<Filter>('active');
  const [localGoals, setLocalGoals] = useState<Goal[]>([]);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  const {
    goals: apiGoals,
    summary,
    notes,
    loading,
    error,
    refresh,
    isRefreshing,
  } = useGoals({
    userId: selectedPatient?.id || '',
    enabled: !!selectedPatient?.id,
  });

  // Use local goals if there are local changes, otherwise use API goals
  const goals = hasLocalChanges ? localGoals : apiGoals;

  // Sync local goals when API goals change
  React.useEffect(() => {
    if (apiGoals.length > 0 && !hasLocalChanges) {
      setLocalGoals(apiGoals);
    }
  }, [apiGoals, hasLocalChanges]);

  const handleToggleComplete = (goalId: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    if (!goal.completed) {
      Alert.alert(
        '目標達成',
        'この目標を達成済みにしますか？',
        [
          { text: 'キャンセル', style: 'cancel' },
          {
            text: '達成',
            onPress: () => {
              setHasLocalChanges(true);
              setLocalGoals((prev) =>
                prev.map((g) =>
                  g.id === goalId
                    ? {
                        ...g,
                        completed: true,
                        completedDate: new Date().toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }),
                      }
                    : g
                )
              );
            },
          },
        ]
      );
    } else {
      setHasLocalChanges(true);
      setLocalGoals((prev) =>
        prev.map((g) =>
          g.id === goalId
            ? { ...g, completed: false, completedDate: null }
            : g
        )
      );
    }
  };

  const handleRefresh = useCallback(async () => {
    setHasLocalChanges(false);
    await refresh();
  }, [refresh]);

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'active') return !goal.completed;
    if (filter === 'completed') return goal.completed;
    return true;
  });

  const activeCount = goals.filter((g) => !g.completed).length;
  const completedCount = goals.filter((g) => g.completed).length;

  const redGoals = goals.filter((g) => g.level === 'red' && !g.completed);
  const yellowGoals = goals.filter((g) => g.level === 'yellow' && !g.completed);

  const renderSkeletons = () => (
    <View style={styles.contentContainer}>
      <View style={{ margin: Spacing.lg, marginBottom: Spacing.md }}>
        <SummaryCardSkeleton />
      </View>
      <View style={styles.goalsList}>
        {[1, 2, 3].map((i) => (
          <GoalCardSkeleton key={i} />
        ))}
      </View>
    </View>
  );

  if (!selectedPatient) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: Colors.background }]}>
        <Feather name="user" size={48} color={Colors.textMuted} />
        <Text style={[styles.emptyStateText, { color: Colors.textMuted }]}>
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
          onPress={handleRefresh}
        >
          <Text style={[styles.retryButtonText, { color: Colors.textInverse }]}>
            再読み込み
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Summary Card */}
      {summary ? (
        <View style={[
          styles.summaryCard,
          { backgroundColor: Colors.primaryLight, borderLeftColor: Colors.primary },
        ]}>
          <View style={styles.summaryHeader}>
            <Feather name="target" size={18} color={Colors.primary} />
            <Text style={[styles.summaryTitle, { color: Colors.primary }]}>ケアの方針</Text>
          </View>
          <Text style={[styles.summaryText, { color: Colors.textSecondary }]}>{summary}</Text>
        </View>
      ) : null}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {redGoals.length > 0 && (
          <View style={[styles.statBadge, { backgroundColor: Colors.alertRedLight }]}>
            <Feather name="alert-circle" size={14} color={Colors.alertRed} />
            <Text style={[styles.statText, { color: Colors.alertRed }]}>
              高 {redGoals.length}
            </Text>
          </View>
        )}
        {yellowGoals.length > 0 && (
          <View style={[styles.statBadge, { backgroundColor: Colors.alertYellowLight }]}>
            <Feather name="alert-triangle" size={14} color={Colors.alertYellow} />
            <Text style={[styles.statText, { color: Colors.alertYellow }]}>
              中 {yellowGoals.length}
            </Text>
          </View>
        )}
        <View style={[styles.statBadge, { backgroundColor: Colors.successLight }]}>
          <Feather name="check-circle" size={14} color={Colors.success} />
          <Text style={[styles.statText, { color: Colors.success }]}>
            達成 {completedCount}
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterTabsScroll}
        contentContainerStyle={styles.filterTabs}
      >
        <TouchableOpacity
          style={[
            styles.filterTab,
            { backgroundColor: filter === 'active' ? Colors.primary : Colors.backgroundSecondary },
          ]}
          onPress={() => setFilter('active')}
        >
          <Text
            style={[
              styles.filterTabText,
              { color: filter === 'active' ? Colors.textInverse : Colors.textSecondary },
            ]}
          >
            進行中 ({activeCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            { backgroundColor: filter === 'completed' ? Colors.primary : Colors.backgroundSecondary },
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text
            style={[
              styles.filterTabText,
              { color: filter === 'completed' ? Colors.textInverse : Colors.textSecondary },
            ]}
          >
            達成済み ({completedCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            { backgroundColor: filter === 'all' ? Colors.primary : Colors.backgroundSecondary },
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterTabText,
              { color: filter === 'all' ? Colors.textInverse : Colors.textSecondary },
            ]}
          >
            すべて ({goals.length})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Goals List */}
      <View style={styles.goalsList}>
        {filteredGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={Colors.textMuted} />
            <Text style={[styles.emptyStateText, { color: Colors.textMuted }]}>
              {filter === 'completed'
                ? '達成済みの目標はありません'
                : '進行中の目標はありません'}
            </Text>
          </View>
        ) : (
          filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              expanded={true}
              onToggleComplete={() => handleToggleComplete(goal.id)}
            />
          ))
        )}
      </View>

      {/* Notes Footer */}
      {notes && (
        <View style={[
          styles.notesFooter,
          { backgroundColor: Colors.backgroundSecondary },
        ]}>
          <Feather name="info" size={14} color={Colors.textMuted} />
          <Text style={[styles.notesText, { color: Colors.textMuted }]}>{notes}</Text>
        </View>
      )}
    </ScrollView>
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
  contentContainer: {
    paddingBottom: Spacing.lg,
  },
  summaryCard: {
    margin: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  filterTabsScroll: {
    marginBottom: Spacing.md,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
  },
  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  goalsList: {
    paddingHorizontal: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyStateText: {
    fontSize: 14,
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
  notesFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    marginLeft: Spacing.sm,
    lineHeight: 18,
  },
});
