import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, StyleSheet } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  style,
  ...props
}) => {
  const btnStyle = variant === 'primary'
    ? styles.primary
    : variant === 'secondary'
    ? styles.secondary
    : styles.outline;

  const textStyle = variant === 'outline' ? styles.outlineText : styles.primaryText;

  return (
    <TouchableOpacity
      style={[styles.base, btnStyle, props.disabled && styles.disabled, style as any]}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#4F46E5' : '#fff'} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#4F46E5',
  },
  secondary: {
    backgroundColor: '#1E293B',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#4F46E5',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  outlineText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 15,
  },
});
