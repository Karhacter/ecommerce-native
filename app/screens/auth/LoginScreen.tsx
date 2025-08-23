import { POST_LOGIN } from "@/app/service/APIService";
import { useAuth } from "@/app/service/AuthContext";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const handleLogin = async () => {
    const token = await POST_LOGIN(email, password); // token là string | null
    if (token) {
      Alert.alert("Đăng nhập thành công");
      await login(token); // ✅ đúng kiểu string
      navigation.replace("Home");
    } else {
      Alert.alert("Đăng nhập thất bại", "Sai email hoặc mật khẩu");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xin Chào!</Text>
      <Text style={styles.subtitle}>
        please login or sign up to continue our app
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="***********"
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={[styles.socialButton, styles.facebookButton]}
          // onPress={() => handleSocialLogin("facebook")}
        >
          <FontAwesome name="facebook" size={20} color="white" />
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          // onPress={() => handleSocialLogin("google")}
        >
          <AntDesign name="google" size={20} color="white" />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
  },
  socialButtonsContainer: {
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  socialButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  facebookButton: {
    backgroundColor: "#3b5998",
    borderRadius: 100,
  },
  googleButton: {
    backgroundColor: "#DB4437",
    borderRadius: 100,
  },
  forgotPasswordButton: {
    alignItems: "center",
    marginTop: 15,
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
