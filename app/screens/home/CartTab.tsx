import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CartTab = () => {
  const cartItems = [
    {
      id: "1",
      name: "Soludos",
      description: "Ibiza Classic Lace Sneakers",
      quantity: 1,
      size: "42",
      color: "#000000", // Black color dot
      price: "$120.00",
      image: require("@/assets/images/sneakers.jpg"), // Replace with your image
    },
    {
      id: "2",
      name: "On Ear Headphone",
      description: "Beats Solo3 Wireless Kulak",
      quantity: 1,
      size: "M",
      color: "#000000", // Black color dot
      price: "$50.00",
      image: require("@/assets/images/headphones.jpg"), // Replace with your image
    },
  ];

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.price.replace("$", ""));
  }, 0);

  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Order</Text>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.itemsContainer}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image
              source={item.image}
              style={styles.itemImage}
              resizeMode="contain"
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>

              <View style={styles.itemSpecs}>
                <Text style={styles.specText}>Quality: {item.quantity}</Text>
                <Text style={styles.specText}>Size: {item.size}</Text>
                <View style={styles.colorContainer}>
                  <Text style={styles.specText}>Color: </Text>
                  <View
                    style={[styles.colorDot, { backgroundColor: item.color }]}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Order Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Completed</Text>
      </View>

      {/* Total Price */}
      <View style={styles.totalContainer}>
        {cartItems.map((item) => (
          <Text key={`price-${item.id}`} style={styles.itemPrice}>
            {item.price}
          </Text>
        ))}
        <View style={styles.grandTotal}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => navigation.navigate("Checkout")}
      >
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemCard: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  itemSpecs: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  specText: {
    fontSize: 12,
    color: "#666",
    marginRight: 16,
    marginBottom: 4,
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  statusContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50", // Green color for completed status
  },
  totalContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  checkoutButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    margin: 20,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CartTab;
