import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/Colors';
import { usePatient } from '@/constants/PatientContext';
import { VoiceRecorder } from '@/components/VoiceRecorder';

type Mode = 'input' | 'processing' | 'edit';

export default function LogScreen() {
  const [mode, setMode] = useState<Mode>('input');
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVoiceEntry, setIsVoiceEntry] = useState(false);

  const handleRecordingComplete = (uri: string, duration: number) => {
    console.log('Recording completed:', uri, duration);
    setIsProcessing(true);
    setIsVoiceEntry(true);
    setMode('processing');
  };

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
    // Simulate AI summary generation
    setTimeout(() => {
      const mockSummary = '夕食8割摂取（お粥・煮物）。服薬確認済み。就寝前に足の痛みあり、マッサージで対応。夜間トイレ2回、移動は安定。';
      setSummary(mockSummary);
      setIsProcessing(false);
      setMode('edit');
    }, 1500);
  };

  const handleSave = () => {
    Alert.alert(
      '保存完了',
      '介護記録を保存しました。',
      [
        {
          text: 'OK',
          onPress: () => {
            setMode('input');
            setTranscription('');
            setSummary('');
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setMode('input');
    setTranscription('');
    setSummary('');
  };

  const renderInputMode = () => (
    <View style={styles.inputContainer}>
      <View style={[styles.inputCard, { backgroundColor: Colors.backgroundElevated }, Shadows.md]}>
        <Text style={[styles.inputTitle, { color: Colors.text }]}>音声で記録</Text>
        <Text style={[styles.inputDescription, { color: Colors.textSecondary }]}>
          今日の介護内容を音声で入力してください。{'\n'}
          AIが自動で要約します。
        </Text>
        <VoiceRecorder
          onRecordingComplete={handleRecordingComplete}
          onTranscriptionComplete={handleTranscriptionComplete}
        />
      </View>

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: Colors.border }]} />
        <Text style={[styles.dividerText, { color: Colors.textMuted }]}>または</Text>
        <View style={[styles.dividerLine, { backgroundColor: Colors.border }]} />
      </View>

      <TouchableOpacity
        style={[
          styles.textInputButton,
          { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryMuted },
        ]}
        onPress={() => {
          setIsVoiceEntry(false);
          setMode('edit');
        }}
        activeOpacity={0.7}
      >
        <Feather name="edit-3" size={20} color={Colors.primary} />
        <Text style={[styles.textInputButtonText, { color: Colors.primary }]}>
          テキストで入力
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderProcessingMode = () => (
    <View style={styles.processingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={[styles.processingText, { color: Colors.text }]}>
        AIが音声を処理中...
      </Text>
      <Text style={[styles.processingSubtext, { color: Colors.textMuted }]}>
        要約を生成しています
      </Text>
    </View>
  );

  const renderEditMode = () => (
    <KeyboardAvoidingView
      style={styles.editContainer}
    >
      <ScrollView
        style={styles.editScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[
          styles.summaryCard,
          { backgroundColor: Colors.backgroundElevated, borderColor: Colors.primaryLight },
          Shadows.sm,
        ]}>
          <View style={styles.cardHeader}>
            <Feather name={isVoiceEntry ? "zap" : "edit-3"} size={16} color={Colors.primary} />
            <Text style={[styles.cardLabelPrimary, { color: Colors.primary }]}>
              {isVoiceEntry ? 'AI要約（編集してください）' : '本日の記録'}
            </Text>
          </View>
          <TextInput
            style={[styles.summaryInput, { color: Colors.text }]}
            value={summary}
            onChangeText={setSummary}
            multiline
            placeholder="要約を入力または編集..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>
      </ScrollView>

      <View style={[styles.editActions, { backgroundColor: Colors.backgroundElevated, borderTopColor: Colors.border }]}>
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: Colors.border }]}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={[styles.cancelButtonText, { color: Colors.textSecondary }]}>キャンセル</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: Colors.primary }, Shadows.md]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Feather name="check" size={20} color={Colors.textInverse} />
          <Text style={[styles.saveButtonText, { color: Colors.textInverse }]}>保存</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      {mode === 'input' && renderInputMode()}
      {mode === 'processing' && renderProcessingMode()}
      {mode === 'edit' && renderEditMode()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    padding: Spacing.lg,
  },
  inputCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  inputDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    marginHorizontal: Spacing.md,
  },
  textInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
  },
  textInputButtonText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
  processingSubtext: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  editContainer: {
    flex: 1,
  },
  editScroll: {
    flex: 1,
    padding: Spacing.lg,
  },
  transcriptionCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardLabelPrimary: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transcriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  summaryCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
  },
  summaryInput: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  detailsCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  detailsInput: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});
