import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProductList = () => {
  const navigation = useNavigation<any>();

  const products = [
    {
      id: "1",
      brand: "Roller Rabbit",
      name: "Vado Odelle Dress",
      price: "$198.00",
      image: require("@/assets/images/sneakers.jpg"),
      widthRatio: 0.6,
    },
    {
      id: "2",
      brand: "endless rose",
      name: "Bubble Elastic T-shirt",
      price: "$50.00",
      image: require("@/assets/images/sneakers.jpg"),
      widthRatio: 0.4,
    },
    {
      id: "3",
      brand: "Theory",
      name: "Irregular Rib Skirt",
      price: "$175.00",
      image: require("@/assets/images/sneakers.jpg"),
      widthRatio: 0.5,
    },
    {
      id: "4",
      brand: "Theory",
      name: "Irregular Rib Skirt",
      price: "$175.00",
      image: require("@/assets/images/sneakers.jpg"),
      widthRatio: 0.5,
    },
  ];
  return (
    <View style={styles.productList}>
      {products.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.productCard}
          onPress={() =>
            navigation.navigate("ProductDetail", { product: item })
          }
        >
          <Image source={item.image} style={styles.productImage} />
          <TouchableOpacity style={styles.heartIcon}>
            <Ionicons name="heart-outline" size={18} />
          </TouchableOpacity>
          {item.brand && <Text style={styles.brand}>{item.brand}</Text>}

          <Text style={styles.productName}>{item.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${item.price.toLocaleString()}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  productList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 12,
    marginBottom: 20,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    resizeMode: "cover",
  },
  heartIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 20,
  },
  productName: {
    fontWeight: "500",
    fontSize: 14,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 14,
  },
  brand: { fontSize: 14, color: "#666", marginTop: 10 },
});

export default ProductList;
