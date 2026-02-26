// styles.js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    elevation: 5,
    alignItems: "center",
  },

  iconCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#6C63FF20",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  icon: {
    fontSize: 28,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },

  tabText: {
    fontSize: 14,
    color: "#888",
  },

  activeTab: {
    color: "#6C63FF",
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: "#6C63FF",
  },

  otpLabel: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  otpContainer: {
    marginBottom: 20,
  },

  verifyBtn: {
    backgroundColor: "#6C63FF",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  verifyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  link: {
    color: "#6C63FF",
    fontSize: 13,
    marginBottom: 12,
  },

  resendRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  signupRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  grayText: {
    color: "#777",
    fontSize: 12,
  },

  resend: {
    color: "#6C63FF",
    fontSize: 12,
  },

  signup: {
    color: "#6C63FF",
    fontWeight: "600",
  },
});