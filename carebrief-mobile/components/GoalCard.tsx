import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/Colors";
import { Goal } from "@/constants/Data";

interface GoalCardProps {
  goal: Goal;
  onToggleComplete: () => void;
  onToggleExpand: () => void;
}

const getLevelConfig = (level: string) => {
  switch (level) {
    case "red":
      return {
        bgColor: Colors.alertRedLight,
        borderColor: Colors.alertRedMuted,
        iconColor: Colors.alertRed,
      };
    case "yellow":
      return {
        bgColor: Colors.alertYellowLight,
        borderColor: Colors.alertYellowMuted,
        iconColor: Colors.alertYellow,
      };
    default:
      return {
        bgColor: Colors.backgroundSecondary,
        borderColor: Colors.border,
        iconColor: Colors.textMuted,
      };
  }
};

export function GoalCard({
  goal,
  onToggleComplete,
  onToggleExpand,
}: GoalCardProps) {
  const levelConfig = getLevelConfig(goal.level);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: Colors.backgroundElevated },
        goal.completed && styles.cardCompleted,
        Shadows.sm,
      ]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <TouchableOpacity
          style={[
            styles.checkbox,
            { borderColor: Colors.border },
            goal.completed && {
              backgroundColor: Colors.primary,
              borderColor: Colors.primary,
            },
          ]}
          onPress={onToggleComplete}
          activeOpacity={0.7}
        >
          {goal.completed && (
            <Feather name="check" size={14} color={Colors.textInverse} />
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: levelConfig.bgColor },
            ]}
          >
            <Text
              style={[styles.categoryText, { color: levelConfig.iconColor }]}
            >
              {goal.category}
            </Text>
          </View>
          <Text
            style={[
              styles.goalText,
              { color: Colors.text },
              goal.completed && {
                textDecorationLine: "line-through",
                color: Colors.textMuted,
              },
            ]}
          >
            {goal.goal}
          </Text>
          {goal.completed && goal.completedDate && (
            <Text style={[styles.completedDate, { color: Colors.success }]}>
              {goal.completedDate} に達成
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View
        style={[
          styles.actionsContainer,
          {
            backgroundColor: Colors.backgroundSecondary,
            borderTopColor: Colors.border,
          },
        ]}
      >
        <Text style={[styles.actionsLabel, { color: Colors.textSecondary }]}>
          アクション項目
        </Text>
        {goal.actions.map((action, index) => (
          <View key={index} style={styles.actionItem}>
            <View
              style={[styles.actionBullet, { backgroundColor: Colors.primary }]}
            />
            <Text style={[styles.actionText, { color: Colors.textSecondary }]}>
              {action.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  cardCompleted: {
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  goalText: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22,
  },
  completedDate: {
    fontSize: 12,
    marginTop: 4,
  },
  actionsContainer: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  actionsLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.xs,
  },
  actionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
