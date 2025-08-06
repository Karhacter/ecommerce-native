import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import OrderSuccessModal from "./modal/OrderSuccessModal";

const Checkout = () => {
  const [cardNumber, setCardNumber] = useState("3829 4820 4629 5025");
  const [cardHolder, setCardHolder] = useState("Anita Rose");
  const [expDate, setExpDate] = useState("09/17");
  const [cvv, setCvv] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.paymentTitle}>Payment</Text>
      </View>

      {/* Card Preview */}
      <View style={styles.cardPreview}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>VISA</Text>
          <Image
            source={require("@/assets/images/visa-logo.jpg")} // Add your visa logo
            style={styles.cardLogo}
          />
        </View>

        <View style={styles.cardField}>
          <Text style={styles.cardLabel}>CARD NUMBER</Text>
          <Text style={styles.cardValue}>{cardNumber}</Text>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.cardField}>
            <Text style={styles.cardLabel}>CARD HOLDER NAME</Text>
            <Text style={styles.cardValue}>{cardHolder}</Text>
          </View>

          <View style={styles.cardField}>
            <Text style={styles.cardLabel}>VALID THRU</Text>
            <Text style={styles.cardValue}>{expDate}</Text>
          </View>
        </View>
      </View>

      {/* Form Title */}
      <Text style={styles.formTitle}>Card Details</Text>

      {/* Payment Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Card number</Text>
          <TextInput
            style={styles.input}
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholder="0000 0000 0000 0000"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.inputGroup, { flex: 2 }]}>
            <Text style={styles.inputLabel}>Exp date</Text>
            <TextInput
              style={styles.input}
              value={expDate}
              onChangeText={setExpDate}
              placeholder="MM/YY"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={setCvv}
              placeholder="•••"
              secureTextEntry
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setShowSuccess(true)}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 4,
  },
  paymentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  cardPreview: {
    backgroundColor: "#4285F4", // Blue color similar to Visa
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  cardType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cardLogo: {
    width: 60,
    height: 20,
    resizeMode: "contain",
  },
  cardField: {
    marginBottom: 15,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: "row",
    gap: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginLeft: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Checkout;
