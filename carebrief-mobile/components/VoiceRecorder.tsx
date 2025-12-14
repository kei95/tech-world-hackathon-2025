import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { Colors, Spacing,  Shadows } from '@/constants/Colors';

interface VoiceRecorderProps {
  onRecordingComplete?: (uri: string, duration: number) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Clean up recording on unmount
  const recordingRef = useRef<Audio.Recording | null>(null);
  recordingRef.current = recording;

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
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
      console.log('Requesting permissions...');
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('エラー', 'マイクへのアクセス許可が必要です。');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording...');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('エラー', '録音の開始に失敗しました。');
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');

    if (!recording) {
      console.error('No recording to stop');
      return;
    }

    // Capture duration before state changes
    const finalDuration = recordingDuration;

    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Check minimum recording duration
    if (finalDuration < 1) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
      Alert.alert(
        'エラー',
        '録音が短すぎます。もう少し長く録音してください。'
      );
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
      });

      const tempUri = recording.getURI();
      console.log('Recording stopped, URI:', tempUri);
      console.log('Recording duration:', finalDuration, 'seconds');

      setRecording(null);

      if (!tempUri) {
        console.error('No URI returned from recording');
        Alert.alert(
          'エラー',
          '録音に失敗しました。もう一度お試しください。'
        );
        return;
      }

      // Verify file exists
      const fileInfo = await FileSystem.getInfoAsync(tempUri);
      console.log('File info:', fileInfo);

      if (!fileInfo.exists) {
        Alert.alert(
          'エラー',
          '録音ファイルが見つかりません。もう一度お試しください。'
        );
        return;
      }

      if (onRecordingComplete) {
        // Copy to a persistent location
        const filename = `recording-${Date.now()}.m4a`;
        const persistentUri = `${FileSystem.documentDirectory}${filename}`;

        await FileSystem.copyAsync({
          from: tempUri,
          to: persistentUri,
        });

        console.log('Recording copied to', persistentUri);
        onRecordingComplete(persistentUri, finalDuration);
      }
    } catch (err) {
      console.error('Failed to process recording:', err);
      setRecording(null);
      Alert.alert(
        'エラー',
        '録音ファイルの保存に失敗しました。もう一度お試しください。'
      );
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
