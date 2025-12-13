import { Text, type TextProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  color?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'muted';
};

export function ThemedText({
  style,
  color: customColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  let color: string;
  if (customColor) {
    color = customColor;
  } else if (type === 'muted') {
    color = Colors.textMuted;
  } else if (type === 'link') {
    color = Colors.primary;
  } else {
    color = Colors.text;
  }

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'muted' ? styles.muted : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
  },
  muted: {
    fontSize: 14,
    lineHeight: 20,
  },
});
