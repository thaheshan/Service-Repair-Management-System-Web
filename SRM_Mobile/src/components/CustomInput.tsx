import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, error, icon, ...props }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.errorBorder : styles.normalBorder]}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor="#94A3B8"
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  normalBorder: {
    borderColor: '#E2E8F0',
  },
  errorBorder: {
    borderColor: '#EF4444',
  },
  iconWrap: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});
