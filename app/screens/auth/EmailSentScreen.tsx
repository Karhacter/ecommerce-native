import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const EmailSentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { email } = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="email" size={80} color="#007AFF" />
        </View>

        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a password reset link to:
        </Text>
        <Text style={styles.email}>{email || "your email address"}</Text>

        <Text style={styles.description}>
          Please check your email and click on the link to reset your password.
          The link will expire in 15 minutes for security reasons.
        </Text>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>Didn't receive the email?</Text>
          <Text style={styles.instructionText}>• Check your spam folder</Text>
          <Text style={styles.instructionText}>
            • Make sure you entered the correct email
          </Text>
          <Text style={styles.instructionText}>
            • Try again in a few minutes
          </Text>
        </View>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.resendButtonText}>Resend Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToLoginButton}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  instructions: {
    width: "100%",
    marginBottom: 30,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  resendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  resendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backToLoginButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  backToLoginText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default EmailSentScreen;
