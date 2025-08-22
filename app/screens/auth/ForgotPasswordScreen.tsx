import { GET_ID } from "@/app/service/APIService";
import { saveOtp, verifyOtp } from "@/app/service/otpLocalStore";
import { resetPasswordWithFullUser } from "@/app/service/passwordHelpers";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#1E90FF";

type Step = "email" | "otp" | "reset" | "done";

const ForgotPasswordScreen = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [serverUser, setServerUser] = useState<any>(null);

  const [otp, setOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [showNew1, setShowNew1] = useState(false);
  const [showNew2, setShowNew2] = useState(false);

  const navigation = useNavigation<any>();

  const maskedEmail = useMemo(() => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    const visible = name.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
  }, [email]);

  const handleCheckEmail = async () => {
    try {
      if (!email.includes("@")) throw new Error("Email không hợp lệ");
      const res = await GET_ID("public/users/email", encodeURIComponent(email));
      if (!res?.data?.userId)
        throw new Error("Không tìm thấy tài khoản với email này");
      setServerUser(res.data);

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(code);
      setSending(true);

      await saveOtp(email, code, 5 * 60 * 1000, 5);

      try {
        const SERVICE_ID = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID as string;
        const TEMPLATE_ID = process.env
          .EXPO_PUBLIC_EMAILJS_TEMPLATE_ID as string;
        const PUBLIC_KEY = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY as string;

        if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
          await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              service_id: SERVICE_ID,
              template_id: TEMPLATE_ID,
              user_id: PUBLIC_KEY,
              template_params: { to_email: email, otp: code },
            }),
          });
        } else {
          Alert.alert("Mã xác thực (demo)", `OTP của bạn: ${code}`);
        }
      } catch (e) {
        Alert.alert(
          "Gửi email thất bại",
          "Hiển thị OTP trực tiếp để thử nghiệm."
        );
        Alert.alert("Mã xác thực (demo)", `OTP của bạn: ${code}`);
      } finally {
        setSending(false);
        setStep("otp");
      }
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message || "Không thể xác thực email");
    }
  };

  const handleVerifyOtp = async () => {
    const res = await verifyOtp(email, otpInput);
    if (res.ok) setStep("reset");
    else Alert.alert("Xác thực thất bại", res.reason || "Sai mã");
  };

  const handleReset = async () => {
    try {
      if (newPass.length < 4) throw new Error("Mật khẩu tối thiểu 4 ký tự");
      if (newPass !== newPass2) throw new Error("Mật khẩu nhập lại không khớp");
      await resetPasswordWithFullUser(email, newPass);
      setStep("done");
      Alert.alert("Thành công", "Đổi mật khẩu thành công, hãy đăng nhập lại.");
    } catch (e: any) {
      Alert.alert(
        "Không thể đặt lại mật khẩu",
        e?.message || "Vui lòng thử lại."
      );
    }
  };

  return (
    <View style={styles.container}>
      {step === "email" && (
        <View>
          <Text style={styles.title}>Forgot Password?</Text>
          <View style={styles.inputRow}>
            <Text style={styles.mailIcon}>✉️</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#A3A3A3"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            style={[styles.button, sending && { opacity: 0.6 }]}
            onPress={handleCheckEmail}
            disabled={sending}
          >
            <Text style={styles.buttonText}>Send Email</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "otp" && (
        <View>
          <Text style={styles.title}>Nhập mã xác thực</Text>
          <Text style={styles.note}>Mã đã gửi tới {maskedEmail}</Text>
          <TextInput
            value={otpInput}
            onChangeText={setOtpInput}
            keyboardType="number-pad"
            placeholder="6-digit code"
            style={styles.otpInput}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "reset" && (
        <View>
          <Text style={styles.title}>Đặt lại mật khẩu</Text>

          <View style={{ position: "relative" }}>
            <TextInput
              value={newPass}
              onChangeText={setNewPass}
              placeholder="Mật khẩu mới"
              secureTextEntry={!showNew1}
              style={styles.inputLine}
            />
            <TouchableOpacity
              onPress={() => setShowNew1((v) => !v)}
              style={styles.eyeBtnInline}
            >
              <Ionicons
                name={showNew1 ? "eye-off" : "eye"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <View style={{ position: "relative" }}>
            <TextInput
              value={newPass2}
              onChangeText={setNewPass2}
              placeholder="Nhập lại mật khẩu mới"
              secureTextEntry={!showNew2}
              style={styles.inputLine}
            />
            <TouchableOpacity
              onPress={() => setShowNew2((v) => !v)}
              style={styles.eyeBtnInline}
            >
              <Ionicons
                name={showNew2 ? "eye-off" : "eye"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Cập nhật mật khẩu</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "done" && (
        <View>
          <Text style={styles.title}>Hoàn tất!</Text>
          <Text style={styles.note}>Bạn có thể quay lại trang đăng nhập.</Text>
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backToLoginText: {
    color: "#007AFF",
    fontSize: 16,
  },
  backToLoginButton: {
    marginTop: 20,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
    marginBottom: 20,
  },
  mailIcon: { marginRight: 8, fontSize: 18 },
  input: { flex: 1, height: 40, color: "#0F172A" },
  button: {
    backgroundColor: "#F3F4F6",
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: PRIMARY, fontWeight: "700" },
  note: { color: "#6B7280", marginBottom: 10 },
  otpInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    color: "#0F172A",
  },
  inputLine: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
    color: "#0F172A",
  },
  eyeBtnInline: { position: "absolute", right: 12, top: 12, padding: 4 },
});

export default ForgotPasswordScreen;
