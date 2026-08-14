import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginMutation } from '../../src/services/api/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../src/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Lock } from '../../src/components/Icons';
import { useRouter } from 'expo-router';
import { C, R, F } from '../../src/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    try {
      const res = await login({ email: email.trim(), password }).unwrap();
      const token = res.accessToken ?? res.token ?? res.data?.accessToken;
      const user = res.user ?? res.data?.user ?? res.data;
      if (!token) { setError('Invalid credentials.'); return; }
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      dispatch(setCredentials({ user, accessToken: token }));
      router.replace('/(app)/dashboard');
    } catch (err: any) {
      setError(err?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Logo / Brand */}
          <View style={s.brandRow}>
            <View style={s.logoBox}>
              <Text style={s.logoText}>SRM</Text>
            </View>
            <View>
              <Text style={s.brandName}>All Fix</Text>
              <Text style={s.brandTagline}>Service Repair Management</Text>
            </View>
          </View>

          {/* Headline */}
          <Text style={s.headline}>Welcome back</Text>
          <Text style={s.subline}>Sign in to your workspace to continue</Text>

          {/* Error */}
          {!!error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          {/* Email */}
          <View style={s.fieldWrap}>
            <Text style={s.label}>Email address</Text>
            <View style={[s.inputRow, emailFocused && s.inputFocused]}>
              <Mail size={16} color={emailFocused ? C.primary : C.fgLight} />
              <TextInput
                style={s.input}
                placeholder="you@example.com"
                placeholderTextColor={C.fgLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={s.fieldWrap}>
            <Text style={s.label}>Password</Text>
            <View style={[s.inputRow, pwFocused && s.inputFocused]}>
              <Lock size={16} color={pwFocused ? C.primary : C.fgLight} />
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor={C.fgLight}
                secureTextEntry={!showPw}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPwFocused(true)}
                onBlur={() => setPwFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowPw(v => !v)}>
                <Text style={s.showPw}>{showPw ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={s.forgotRow}>
            <Text style={s.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[s.btn, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Sign in to workspace</Text>
            }
          </TouchableOpacity>

          {/* Register link */}
          <View style={s.registerRow}>
            <Text style={s.registerLabel}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={s.registerLink}>Request access</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 48, paddingBottom: 40 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 },
  logoBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },
  brandName: { fontWeight: '800', fontSize: F['2xl'], color: C.fg },
  brandTagline: { fontSize: F.xs, color: C.fgMuted, marginTop: 1 },
  headline: { fontSize: F['5xl'], fontWeight: '900', color: C.fg, marginBottom: 6 },
  subline: { fontSize: F.base, color: C.fgMuted, marginBottom: 32, lineHeight: 22 },
  errorBox: {
    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA',
    borderRadius: R.lg, padding: 12, marginBottom: 20,
  },
  errorText: { color: C.danger, fontSize: F.sm, fontWeight: '600' },
  fieldWrap: { marginBottom: 18 },
  label: { fontSize: F.md, fontWeight: '700', color: C.fg, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    height: 48, borderRadius: R.lg, borderWidth: 1.5,
    borderColor: C.border, backgroundColor: C.card,
    paddingHorizontal: 14, gap: 10,
  },
  inputFocused: { borderColor: C.primary },
  input: { flex: 1, fontSize: F.base, color: C.fg, height: '100%' },
  showPw: { fontSize: F.sm, fontWeight: '700', color: C.primary },
  forgotRow: { alignItems: 'flex-end', marginBottom: 24 },
  forgotText: { fontSize: F.sm, color: C.primary, fontWeight: '600' },
  btn: {
    height: 50, borderRadius: R.lg, backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    marginBottom: 24,
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: F.base, letterSpacing: 0.3 },
  registerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  registerLabel: { fontSize: F.sm, color: C.fgMuted },
  registerLink: { fontSize: F.sm, color: C.primary, fontWeight: '700' },
});
