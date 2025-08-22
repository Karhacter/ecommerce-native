import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useNavigation } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GET_ID, POST_ADD } from "../service/APIService";
import OrderSuccessModal from "./modal/OrderSuccessModal";

const Checkout = () => {
  const [cardNumber, setCardNumber] = useState("3829 4820 4629 5025");
  const [cardHolder, setCardHolder] = useState("Anita Rose");
  const [expDate, setExpDate] = useState("09/17");
  const [cvv, setCvv] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation<any>();

  const [selectedMethod, setSelectedMethod] = useState<
    "card" | "cash" | "vnpay"
  >("card");

  const [userInfo, setUserInfo] = useState<any>(null);

  // 🟢 Lấy thông tin user và giỏ hàng
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await AsyncStorage.getItem("user-email");
        if (!email) return;
        const encodedEmail = encodeURIComponent(email);
        const res = await GET_ID("public/users/email", encodedEmail);
        setUserInfo(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy user info:", err);
      }
    };

    const fetchCartTotal = async () => {
      try {
        const cartId = await AsyncStorage.getItem("cart-id");
        if (cartId) {
          setCartTotal(150000); // TODO: thay bằng API lấy giỏ hàng thật
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy tổng giỏ hàng:", err);
      }
    };

    fetchUserData();
    fetchCartTotal();
  }, []);

  // 🟢 Lắng nghe Deep Link từ VNPay
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);

      if (!queryParams?.vnp_TxnRef) {
        Alert.alert("❌ Lỗi", "Thiếu mã giao dịch");
        return;
      }

      try {
        // 🟢 Gọi API check-payment-vnpay
        const resp = await axios.get(
          "http://192.168.1.3:3000/api/check-payment-vnpay",
          {
            params: { vnp_TxnRef: queryParams.vnp_TxnRef },
          }
        );

        if (resp.data.success) {
          Alert.alert(
            "✅ Thanh toán thành công",
            `Mã đơn: ${queryParams.vnp_TxnRef}`
          );
          setShowSuccess(true);
        } else {
          Alert.alert(
            "❌ Thanh toán thất bại",
            resp.data.message || "Lỗi không xác định"
          );
        }
      } catch (err) {
        console.error("❌ Lỗi check-payment-vnpay:", err);
        Alert.alert("❌ Không thể xác minh thanh toán", "Vui lòng thử lại.");
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // 🟢 Thanh toán
  const handleCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const email = await AsyncStorage.getItem("user-email");
      const cartId = await AsyncStorage.getItem("cart-id");
      const token = await AsyncStorage.getItem("jwt-token");

      if (!email || !cartId) {
        alert("Không tìm thấy thông tin người dùng hoặc giỏ hàng.");
        setIsProcessing(false);
        return;
      }

      if (selectedMethod === "vnpay") {
        if (cartTotal <= 0) {
          alert("Giỏ hàng trống hoặc không có sản phẩm.");
          setIsProcessing(false);
          return;
        }

        const txnRef = `ORD_${Date.now()}`;
        const orderInfo = `Thanh toan don hang ${txnRef}`;

        const resp = await axios.get("http://192.168.1.3:3000/api/create-qr", {
          params: {
            txnRef,
            orderInfo,
            email,
            cartId,
            token,
            paymentMethod: "vnpay",
            returnUrl: "ecommercenative://payment-result", // 🟢 return về app
          },
          responseType: "text",
        });

        const url: string =
          typeof resp.data === "string" ? resp.data : resp?.data?.url ?? "";

        if (!url) {
          Alert.alert("Lỗi", "Không tạo được liên kết thanh toán");
          setIsProcessing(false);
          return;
        }

        // 🟢 Mở VNPay trong trình duyệt
        try {
          await WebBrowser.openBrowserAsync(url);
        } catch (err) {
          console.warn(
            "⚠️ WebBrowser không khả dụng, fallback sang Linking:",
            err
          );
          await Linking.openURL(url);
        }

        setIsProcessing(false);
        return;
      }

      // 🟢 Các phương thức khác (card, cash)
      const encodedEmail = encodeURIComponent(email);
      const endpoint = `public/users/${encodedEmail}/carts/${cartId}/payments/${selectedMethod}/order`;

      const response = await POST_ADD(endpoint, {});
      console.log("✅ Đặt hàng thành công:", response.data);

      setShowSuccess(true);
    } catch (error) {
      console.error("❌ Lỗi khi đặt hàng:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.paymentTitle}>Payment</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Payment Method Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.methodContainer}>
          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === "card" && styles.methodCardActive,
            ]}
            onPress={() => setSelectedMethod("card")}
          >
            <View style={styles.methodIcon}>
              <FontAwesome
                name="credit-card"
                size={20}
                color={selectedMethod === "card" ? "#fff" : "#666"}
              />
            </View>
            <Text
              style={[
                styles.methodText,
                selectedMethod === "card" && styles.methodTextActive,
              ]}
            >
              Credit Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === "cash" && styles.methodCardActive,
            ]}
            onPress={() => setSelectedMethod("cash")}
          >
            <View style={styles.methodIcon}>
              <FontAwesome
                name="money"
                size={20}
                color={selectedMethod === "cash" ? "#fff" : "#666"}
              />
            </View>
            <Text
              style={[
                styles.methodText,
                selectedMethod === "cash" && styles.methodTextActive,
              ]}
            >
              Cash on Delivery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === "vnpay" && styles.methodCardActive,
            ]}
            onPress={() => setSelectedMethod("vnpay")}
          >
            <View style={styles.methodIcon}>
              <Text
                style={[
                  styles.vnpayIcon,
                  selectedMethod === "vnpay" && styles.vnpayIconActive,
                ]}
              >
                VN
              </Text>
            </View>
            <Text
              style={[
                styles.methodText,
                selectedMethod === "vnpay" && styles.methodTextActive,
              ]}
            >
              VNPAY
            </Text>
          </TouchableOpacity>
        </View>

        {/* Web-specific VNPay message */}

        {/* VNPay Info */}
        {selectedMethod === "vnpay" && (
          <View style={styles.vnpayInfo}>
            <Text style={styles.vnpayInfoText}>
              💳 Thanh toán qua VNPay - An toàn và tiện lợi
            </Text>
            <Text style={styles.vnpayInfoText}>
              💰 Tổng tiền: {cartTotal.toLocaleString("vi-VN")} VND
            </Text>
          </View>
        )}
      </View>

      {/* Card Preview */}
      {selectedMethod === "card" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          <View style={styles.cardPreview}>
            <View style={styles.cardGradient}>
              <View style={styles.cardHeader}>
                <Image
                  source={require("@/assets/images/visa-logo.jpg")}
                  style={styles.cardChip}
                />
                <Image
                  source={require("@/assets/images/visa-logo.jpg")}
                  style={styles.cardLogo}
                />
              </View>

              <View style={styles.cardNumberContainer}>
                <Text style={styles.cardNumberText}>{cardNumber}</Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.cardField}>
                  <Text style={styles.cardLabel}>CARD HOLDER</Text>
                  <Text style={styles.cardValue}>{cardHolder}</Text>
                </View>

                <View style={styles.cardField}>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardValue}>{expDate}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Payment Form */}
      {selectedMethod === "card" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Information</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="credit-card"
                  size={18}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="0000 0000 0000 0000"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Holder Name</Text>
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="user"
                  size={18}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  placeholder="Name on card"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.inputLabel}>Expiration Date</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="date-range"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={expDate}
                    onChangeText={setExpDate}
                    placeholder="MM/YY"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="lock"
                    size={18}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="•••"
                    secureTextEntry
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            isProcessing && styles.confirmButtonDisabled,
          ]}
          onPress={handleCheckout}
          disabled={isProcessing}
        >
          <Text style={styles.confirmButtonText}>
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </Text>
          {!isProcessing && (
            <FontAwesome
              name="check-circle"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
          )}
        </TouchableOpacity>
      </View>

      <OrderSuccessModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onTrackOrder={() => {
          setShowSuccess(false);
          navigation.navigate("MyOrder");
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  paymentTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  methodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  methodCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  methodCardActive: {
    backgroundColor: "#4285F4",
    borderColor: "#4285F4",
  },
  methodIcon: {
    marginRight: 8,
  },
  methodText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  methodTextActive: {
    color: "#fff",
  },
  cardPreview: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardGradient: {
    padding: 24,
    backgroundColor: "#4285F4",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  cardChip: {
    width: 40,
    height: 30,
    resizeMode: "contain",
  },
  cardLogo: {
    width: 60,
    height: 20,
    resizeMode: "contain",
  },
  cardNumberContainer: {
    marginBottom: 30,
  },
  cardNumberText: {
    fontSize: 20,
    letterSpacing: 2,
    color: "#fff",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardField: {
    marginBottom: 0,
  },
  cardLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  vnpayIcon: {
    fontSize: 18,
    color: "#666",
  },
  vnpayIconActive: {
    color: "#fff",
  },
  vnpayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#4285F4",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  vnpayHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  vnpayCloseButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  confirmButtonDisabled: {
    opacity: 0.7,
    backgroundColor: "#ccc",
  },
  webVnpayMessage: {
    backgroundColor: "#e0f7fa",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  webVnpayText: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "500",
  },
  vnpayInfo: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  vnpayInfoText: {
    fontSize: 14,
    color: "#0066cc",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
  },
});

export default Checkout;
