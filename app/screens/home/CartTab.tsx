import {
  GET_ID,
  GET_IMG,
  REMOVE_PRODUCT_FROM_CART,
  UPDATE_PRODUCT_QUANTITY,
} from "@/app/service/APIService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";

const CartTab = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchProductStock = async (productId: number) => {
    try {
      const response = await GET_ID("public/products", productId);
      if (response.status === 200) {
        return response.data.quantity;
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy tồn kho:", err);
    }
    return null;
  };

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const email = await AsyncStorage.getItem("user-email");
      const cartIdStr = await AsyncStorage.getItem("cart-id");

      if (!email || !cartIdStr) {
        Alert.alert("Bạn chưa đăng nhập");
        setCartItems([]);
        return;
      }

      // const cartId = parseInt(cartIdStr);
      const response = await GET_ID(
        `public/users/${encodeURIComponent(email)}/carts`,
        cartIdStr
      );

      if (response.status === 200) {
        const items = response.data.products || [];

        const itemsWithStock = await Promise.all(
          items.map(async (item: any) => {
            const stock = await fetchProductStock(item.productId);
            return {
              ...item,
              stockQuantity: stock ?? 0,
            };
          })
        );

        setCartItems(itemsWithStock);
      } else {
        Alert.alert("Không thể lấy giỏ hàng");
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy giỏ hàng:", error);
      Alert.alert("Đã có lỗi xảy ra khi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      const cartIdStr = await AsyncStorage.getItem("cart-id");
      if (!cartIdStr) return;
      const cartId = parseInt(cartIdStr);

      const item = cartItems.find((item) => item.productId === productId);
      if (!item) return;

      if (newQuantity > item.stockQuantity) {
        Alert.alert(
          "Stock Limit Exceeded",
          `Only ${item.stockQuantity} items available in stock.`
        );
        return;
      }

      await UPDATE_PRODUCT_QUANTITY(cartId, productId, newQuantity);

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err: any) {
      console.error("❌ Lỗi cập nhật:", err);
      const errorMessage =
        err?.response?.data?.message || "Không thể cập nhật số lượng.";

      if (errorMessage.includes("quantity") || errorMessage.includes("stock")) {
        Alert.alert("Stock Issue", errorMessage);
      } else {
        Alert.alert("Lỗi", errorMessage);
      }
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    try {
      const cartIdStr = await AsyncStorage.getItem("cart-id");
      if (!cartIdStr) return;
      const cartId = parseInt(cartIdStr);

      await REMOVE_PRODUCT_FROM_CART(cartId, productId);
      fetchCartItems();
    } catch (err) {
      console.error("❌ Lỗi xoá:", err);
      Alert.alert("Lỗi", "Không thể xoá sản phẩm.");
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.specialPrice || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const vat = 0;
  const total = subtotal + vat;

  // Render item hiển thị
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Image
        source={{ uri: GET_IMG("products", item.image) }}
        style={styles.itemImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.productName}</Text>
        <Text style={styles.itemPrice}>
          {(item.specialPrice * item.quantity).toLocaleString("vi-VN")}
        </Text>

        <Text style={{ color: "#888", fontSize: 12 }}>
          Tồn kho: {item.stockQuantity}
        </Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() =>
              handleUpdateQuantity(item.productId, item.quantity - 1)
            }
            disabled={item.quantity <= 1}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyNumber}>{item.quantity}</Text>

          <TouchableOpacity
            style={[
              styles.qtyButton,
              {
                backgroundColor:
                  item.quantity >= item.stockQuantity ? "#ccc" : "#ddd",
              },
            ]}
            onPress={() =>
              handleUpdateQuantity(item.productId, item.quantity + 1)
            }
            disabled={item.quantity >= item.stockQuantity}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render item ẩn (khi vuốt)
  const renderHiddenItem = ({ item }: { item: any }) => (
    <View style={styles.hiddenItem}>
      <TouchableOpacity
        style={styles.hiddenDeleteButton}
        onPress={() => handleRemoveProduct(item.productId)}
      >
        <Text style={styles.hiddenDeleteText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#000" />
        <Text>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerSubtitle}>
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>
            Add some products to get started!
          </Text>
        </View>
      ) : (
        <SwipeListView
          data={cartItems}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-75}
          disableLeftSwipe={false}
          disableRightSwipe={false}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          style={styles.itemsContainer}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyExtractor={(item) => item.productId.toString()}
        />
      )}

      {/* Summary & Checkout */}
      {cartItems.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {subtotal.toLocaleString("vi-VN")}đ
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>VAT</Text>
            <Text style={styles.summaryValue}>
              {vat.toLocaleString("vi-VN")}đ
            </Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {total.toLocaleString("vi-VN")}đ
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Checkout")}
            activeOpacity={0.8}
          >
            <Text style={styles.checkoutText}>
              Proceed to Checkout ({cartItems.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6c757d",
  },
  itemsContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6c757d",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#adb5bd",
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 16,
  },
  hiddenItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 16,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  hiddenDeleteButton: {
    backgroundColor: "#ff4757",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: "100%",
    borderRadius: 12,
  },
  hiddenDeleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  qtyButton: {
    width: 32,
    height: 32,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#495057",
  },
  qtyNumber: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#6c757d",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  checkoutButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CartTab;
