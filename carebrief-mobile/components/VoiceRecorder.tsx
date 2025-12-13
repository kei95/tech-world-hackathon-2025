import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAudioRecorder, RecordingPresets, AudioModule } from 'expo-audio';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/Colors';

interface VoiceRecorderProps {
  onRecordingComplete?: (uri: string, duration: number) => void;
  onTranscriptionComplete?: (text: string) => void;
}

export function VoiceRecorder({ onRecordingComplete, onTranscriptionComplete }: VoiceRecorderProps) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        console.log('Permission not granted');
        return;
      }

      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      console.log('Starting recording...');
      recorder.record();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    await recorder.stop();
    await AudioModule.setAudioModeAsync({
      allowsRecording: false,
    });

    const uri = recorder.uri;
    console.log('Recording stopped and stored at', uri);

    if (onRecordingComplete && uri) {
      onRecordingComplete(uri, recordingDuration);
    }

    // Simulate transcription (in real app, send to Whisper API)
    simulateTranscription();
  };

  const simulateTranscription = () => {
    // Simulating API delay
    setTimeout(() => {
      const mockTranscription = '本日の夕食は8割ほど摂取されました。お粥と煮物を好んで食べていました。食後に服薬確認を行い、問題なく服用されました。就寝前に少し足の痛みを訴えていましたが、マッサージ後は落ち着かれました。夜間のトイレは2回で、ふらつきなく移動できています。';

      if (onTranscriptionComplete) {
        onTranscriptionComplete(mockTranscription);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        {isRecording ? (
          <>
            <View style={styles.recordingIndicator}>
              <Animated.View
                style={[
                  styles.recordingDot,
                  { backgroundColor: Colors.alertRed },
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Text style={[styles.recordingText, { color: Colors.alertRed }]}>録音中...</Text>
            </View>
            <Text style={[styles.duration, { color: Colors.text }]}>
              {formatDuration(recordingDuration)}
            </Text>
          </>
        ) : (
          <Text style={[styles.hint, { color: Colors.textMuted }]}>
            マイクボタンを押して音声入力を開始
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.recordButton,
          { backgroundColor: isRecording ? Colors.alertRed : Colors.primary },
          Shadows.lg,
        ]}
        onPress={isRecording ? stopRecording : startRecording}
        activeOpacity={0.8}
      >
        <Feather
          name={isRecording ? 'square' : 'mic'}
          size={32}
          color={Colors.textInverse}
        />
      </TouchableOpacity>

      {isRecording && (
        <Text style={[styles.tapToStop, { color: Colors.textMuted }]}>タップで停止</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  statusContainer: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  duration: {
    fontSize: 32,
    fontWeight: '300',
    marginTop: Spacing.sm,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: 15,
    textAlign: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapToStop: {
    fontSize: 13,
    marginTop: Spacing.md,
  },
});
