import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/Colors';
import { usePatient } from '@/constants/PatientContext';

function PatientHeader() {
  const { selectedPatient } = usePatient();

  return (
    <View style={styles.patientHeader}>
      <View style={[styles.patientAvatar, { backgroundColor: Colors.primaryLight }]}>
        <Feather name="user" size={16} color={Colors.primary} />
      </View>
      <View>
        <Text style={[styles.patientName, { color: Colors.text }]}>
          {selectedPatient?.name || '患者未選択'}
        </Text>
        {selectedPatient && (
          <Text style={[styles.patientMeta, { color: Colors.textMuted }]}>
            {selectedPatient.age}歳 · {selectedPatient.gender}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.backgroundElevated,
          borderTopColor: Colors.border,
          paddingTop: Spacing.xs,
          paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.sm,
          height: 60 + (insets.bottom > 0 ? insets.bottom : Spacing.sm),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: Colors.backgroundElevated,
        },
        headerTintColor: Colors.primary,
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginLeft: Spacing.md }}
          >
            <Feather name="arrow-left" size={24} color={Colors.primary} />
          </TouchableOpacity>
        ),
        headerTitle: () => <PatientHeader />,
      }}
    >
      <Tabs.Screen
        name="log"
        options={{
          title: '記録作成',
          tabBarIcon: ({ color, size }) => (
            <Feather name="edit-3" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '記録履歴',
          tabBarIcon: ({ color, size }) => (
            <Feather name="clock" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: '目標管理',
          tabBarIcon: ({ color, size }) => (
            <Feather name="target" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
  },
  patientMeta: {
    fontSize: 12,
  },
});
