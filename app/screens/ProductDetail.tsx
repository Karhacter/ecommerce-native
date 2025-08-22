import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GET_ID, GET_IMG, POST_ADD, PUT_EDIT } from "../service/APIService";
import { formatPrice } from "../utils/currencyFormatter";

const { width } = Dimensions.get("window");

const ProductDetail = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { productId } = route.params;
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [cartId, setCartId] = useState<number | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const FetchProductDetails = async () => {
      try {
        const response = await GET_ID("public/products", productId);
        setProduct(response.data);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error("Error fetching product details: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCartId = async () => {
      const email = await AsyncStorage.getItem("user-email");
      console.log("email: ", email);
      if (email) {
        const response = await GET_ID(
          "public/users/email",
          encodeURIComponent(email)
        );
        setCartId(response.data.cart?.cartId);
      }
    };

    FetchProductDetails();
    fetchCartId();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const handleAddToCart = async () => {
    if (!cartId) {
      console.error("Không tìm thấy ID giỏ hàng");
      return;
    }

    try {
      // Store original quantity with the product
      const productWithOriginalQuantity = {
        ...product,
        originalQuantity: product.quantity,
        selectedQuantity: quantity,
      };

      const endpoint = `public/carts/${cartId}/products/${productId}/quantity/${quantity}`;
      await POST_ADD(endpoint, productWithOriginalQuantity);
      alert(`Thêm sản phẩm vào giỏ hàng thành công!`);
      navigation.replace("Home");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        try {
          const updateEndpoint = `public/carts/${cartId}/products/${productId}/quantity/${quantity}`;
          await PUT_EDIT(updateEndpoint, null);
          alert(`Cập nhật số lượng thành công!`);
          navigation.replace("Home");
        } catch (updateError) {
          console.error("Lỗi khi cập nhật số lượng sản phẩm:", updateError);
          alert("Có lỗi xảy ra khi cập nhật số lượng sản phẩm.");
        }
      } else {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
      }
    }
  };

  const handleIncreaseQty = () => setQuantity(quantity + 1);

  const handleDecreaseQty = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const totalPrice = (product.specialPrice * quantity).toFixed(2);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.imageLoader}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
        <Image
          source={{ uri: GET_IMG("products", product.image) }}
          style={styles.productImage}
          resizeMode="cover"
          onLoad={() => setImageLoading(false)}
        />
      </View>

      {/* Product Info Card */}
      <Animated.View style={[styles.infoCard, { opacity: fadeAnim }]}>
        <View style={styles.brandContainer}>
          <Text style={styles.brand}>{product.brand}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
        </View>

        <Text style={styles.productName}>{product.productName}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>
            {formatPrice(product.specialPrice)}
          </Text>
          {product.price && (
            <Text style={styles.originalPrice}>
              {formatPrice(product.price)}
            </Text>
          )}
        </View>

        {/* Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Size</Text>
          <View style={styles.sizeSelector}>
            {["S", "M", "L", "XL"].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.sizeButtonActive,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeButtonText,
                    selectedSize === size && styles.sizeButtonTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecreaseQty}
            >
              <Ionicons name="remove" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncreaseQty}
            >
              <Ionicons name="add" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.stockText}>
            {product.quantity} items available
          </Text>
          <View>
            <Text>Total Price</Text>
            <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cartButton]}
            onPress={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.cartButtonText}>Add to Cart</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.buyButton]}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  totalPrice: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "right",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#000",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#fff",
    zIndex: 100,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
  },
  imageContainer: {
    width: width,
    height: 300,
    backgroundColor: "#f8f9fa",
  },
  imageLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  brandContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  brand: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8e1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    color: "#ff9800",
    marginLeft: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  originalPrice: {
    fontSize: 20,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  sizeSelector: {
    flexDirection: "row",
    gap: 12,
  },
  sizeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  sizeButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  sizeButtonText: {
    fontSize: 16,
    color: "#666",
  },
  sizeButtonTextActive: {
    color: "#fff",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    minWidth: 30,
    textAlign: "center",
  },
  stockText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cartButton: {
    backgroundColor: "#000",
  },
  buyButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buyButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetail;
