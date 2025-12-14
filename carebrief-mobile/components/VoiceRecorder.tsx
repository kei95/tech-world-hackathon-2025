import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAudioRecorder, RecordingPresets, AudioModule } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/Colors';

interface VoiceRecorderProps {
  onRecordingComplete?: (uri: string, duration: number) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
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

    const tempUri = recorder.uri;
    console.log('Recording stopped and stored at', tempUri);

    if (onRecordingComplete && tempUri) {
      try {
        // Copy to a persistent location to avoid file being cleaned up
        const filename = `recording-${Date.now()}.m4a`;
        const persistentUri = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.copyAsync({
          from: tempUri,
          to: persistentUri,
        });
        console.log('Recording copied to', persistentUri);
        onRecordingComplete(persistentUri, recordingDuration);
      } catch (err) {
        console.error('Failed to copy recording:', err);
        // Fallback to original URI
        onRecordingComplete(tempUri, recordingDuration);
      }
    }
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
