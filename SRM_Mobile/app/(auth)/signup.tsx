import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { CustomInput } from '../../src/components/CustomInput';
import { CustomButton } from '../../src/components/CustomButton';
import { useRequestRegistrationMutation } from '../../src/services/api/authApiSlice';
import { Mail, User, Store } from '../../src/components/Icons';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const [form, setForm] = useState({
    shopName: '',
    email: '',
    phone: '',
    adminName: '',
  });
  
  const [requestRegistration, { isLoading }] = useRequestRegistrationMutation();
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await requestRegistration(form).unwrap();
      Alert.alert(
        'Registration Requested',
        'Your shop registration request has been submitted successfully. You will receive an email once approved.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
      );
    } catch (err: any) {
      Alert.alert('Signup Failed', err?.data?.message || 'Please check your details and try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#F8FAFC]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="mb-8">
          <Text className="text-3xl font-black text-[#0F172A] mb-2">Register Shop</Text>
          <Text className="text-base text-slate-500">Join the platform to manage your repairs efficiently.</Text>
        </View>

        <View className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <CustomInput
            label="Shop Name"
            placeholder="Tech Fix Hub"
            value={form.shopName}
            onChangeText={(text) => setForm({ ...form, shopName: text })}
            icon={<Store size={20} color="#94A3B8" />}
          />
          
          <CustomInput
            label="Admin Full Name"
            placeholder="John Doe"
            value={form.adminName}
            onChangeText={(text) => setForm({ ...form, adminName: text })}
            icon={<User size={20} color="#94A3B8" />}
          />

          <CustomInput
            label="Email Address"
            placeholder="admin@techfix.com"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={20} color="#94A3B8" />}
          />
          
          <CustomButton 
            title="Submit Request" 
            onPress={handleSignup}
            loading={isLoading}
            className="mt-4"
          />
        </View>
        
        <View className="flex-row justify-center items-center mt-2">
          <Text className="text-slate-500">Already have an account? </Text>
          <CustomButton 
            title="Sign In" 
            variant="outline" 
            className="h-auto p-0 border-0 bg-transparent"
            onPress={() => router.back()} 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
