// VerifyIdentityScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import OTPTextInput from "react-native-otp-textinput";
import { styles } from "./styles";

export default function VerifyIdentityScreen() {
  const [tab, setTab] = useState("app");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        
        {/* Shield Icon */}
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🛡️</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Verify your identity</Text>
        <Text style={styles.subtitle}>
          Enter the verification code sent to your registered device
        </Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {["app", "sms", "email"].map((item) => (
            <TouchableOpacity key={item} onPress={() => setTab(item)}>
              <Text
                style={[
                  styles.tabText,
                  tab === item && styles.activeTab,
                ]}
              >
                {item === "app" ? "Authenticator App" : item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* OTP Input */}
        <Text style={styles.otpLabel}>6-Digit Code</Text>
        <OTPTextInput
          inputCount={6}
          tintColor="#6C63FF"
          offTintColor="#ccc"
          containerStyle={styles.otpContainer}
        />

        {/* Verify Button */}
        <TouchableOpacity style={styles.verifyBtn}>
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>

        {/* Backup Code */}
        <TouchableOpacity>
          <Text style={styles.link}>Use backup code instead</Text>
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.grayText}>Don't have the code?</Text>
          <TouchableOpacity>
            <Text style={styles.resend}> Resend code (40s)</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up */}
        <View style={styles.signupRow}>
          <Text style={styles.grayText}>Don't have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.signup}> Sign up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}