import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";

const ProductDetail = () => {
  const product = {
    brand: "Roller Rabbit",
    name: "Vado Odelle Dress",
    price: "$198.00",
    rating: 5,
    reviewCount: 320,
    description:
      "Get a little lift from these Sam Edelman sandals featuring rushed straps and leather lace-up ties, while a braided jute sole makes a fresh statement for summer.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: require("@/assets/images/sneakers.jpg"), // Replace with your image
  };

  const navigation = useNavigation<any>();

  const [selectedSize, setSelectedSize] = React.useState("M");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={24} />
      </View>
      {/* Product Image - Full width */}
      <Image
        source={product.image}
        style={styles.productImage}
        resizeMode="cover"
      />

      {/* Product Info */}
      <View style={styles.contentContainer}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <StarRatingDisplay
            rating={product.rating}
            starSize={20}
            color="#FFD700"
            emptyColor="#E0E0E0"
            style={styles.starRating}
          />
          <Text style={styles.reviewCount}>({product.reviewCount} Review)</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Size Selection */}
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.sizeContainer}>
          {product.sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeButton,
                selectedSize === size && styles.selectedSizeButton,
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedSizeText,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.price}>{product.price}</Text>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => navigation.navigate("Home", { screen: "Cart" })}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  //product
  productImage: {
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
    borderRadius: 100,
    width: "100%",
    height: 350,
  },
  contentContainer: {
    padding: 20,
  },
  brand: {
    fontSize: 18,
    color: "#666",
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  starRating: {
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  sizeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    marginBottom: 12,
  },
  selectedSizeButton: {
    borderColor: "#000",
    backgroundColor: "#000",
  },
  sizeText: {
    fontSize: 14,
    color: "#000",
  },
  selectedSizeText: {
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  addToCartButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetail;
