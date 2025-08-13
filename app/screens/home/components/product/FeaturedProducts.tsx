import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const FeaturedProducts = () => {
  const featuredProduct = {
    brand: "Axel Arigato",
    name: "Clean 90 Triple Sneakers",
    price: "$245.00",
    image: require("@/assets/images/sneakers.jpg"),
  };
  return (
    <>
      <View style={styles.featuredCard}>
        <Image
          source={featuredProduct.image}
          style={styles.featuredImage}
          resizeMode="contain"
        />
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredBrand}>{featuredProduct.brand}</Text>
          <Text style={styles.featuredName}>{featuredProduct.name}</Text>
          <Text style={styles.featuredPrice}>{featuredProduct.price}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  featuredCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  featuredImage: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
});

export default FeaturedProducts;
