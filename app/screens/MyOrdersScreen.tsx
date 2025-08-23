import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GET_IMG, GET_USER_ORDERS } from "../service/APIService";

interface Product {
  productId: number;
  productName: string;
  image: string;
  price: number;
  discount: number;
}

interface OrderItem {
  orderItemId: number;
  product: Product;
  quantity: number;
  orderedProductPrice: number;
}

interface Order {
  orderId: number;
  email: string;
  orderItems: OrderItem[];
  orderDate: string;
  payment: {
    paymentId: number;
    paymentMethod: string;
  };
  totalAmount: number;
  orderStatus: string;
}

const MyOrdersScreen = () => {
  const [activeTab, setActiveTab] = useState<"Ongoing" | "Completed">(
    "Ongoing"
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const email = await AsyncStorage.getItem("user-email");
        if (!email) return;

        const response = await GET_USER_ORDERS(email);
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const translateStatus = (status: string): string => {
    switch (status.toLowerCase()) {
      case "order accepted !":
        return "Đã tiếp nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const filteredOrders = orders.filter((order) => {
    const status = order.orderStatus.toLowerCase();
    return activeTab === "Ongoing"
      ? status.includes("accepted") ||
          status.includes("processing") ||
          status.includes("shipped")
      : status.includes("delivered");
  });

  const renderOrder = ({ item }: { item: Order }) => {
    const firstItem = item.orderItems[0];
    const itemCount = item.orderItems.length;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("OrderDetail", { orderId: item.orderId })
        }
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Đơn hàng #{item.orderId}</Text>
          <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Image
            source={
              firstItem.product.image
                ? { uri: GET_IMG("products", firstItem.product.image) }
                : require("@/assets/images/sneakers.jpg")
            }
            style={styles.image}
          />
          <View style={styles.itemInfo}>
            <Text style={styles.productName}>
              {firstItem.product.productName}
            </Text>
            <Text style={styles.price}>
              {firstItem.orderedProductPrice.toLocaleString()}₫ ×{" "}
              {firstItem.quantity}
            </Text>
          </View>
        </View>

        {itemCount > 1 && (
          <Text style={styles.moreItems}>+{itemCount - 1} sản phẩm khác</Text>
        )}

        <View style={styles.orderFooter}>
          <Text style={styles.totalAmount}>
            Tổng tiền: {item.totalAmount.toLocaleString()}₫
          </Text>
          <View style={[styles.statusBadge, statusColor(item.orderStatus)]}>
            <Text style={styles.statusText}>
              {translateStatus(item.orderStatus)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch Sử Thanh Toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Ongoing" && styles.activeTab]}
          onPress={() => setActiveTab("Ongoing")}
        >
          <Text
            style={
              activeTab === "Ongoing" ? styles.activeTabText : styles.tabText
            }
          >
            Đã hoàn thành
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Completed" && styles.activeTab]}
          onPress={() => setActiveTab("Completed")}
        >
          <Text
            style={
              activeTab === "Completed" ? styles.activeTabText : styles.tabText
            }
          >
            Đang giao
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderId.toString()}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {activeTab === "Ongoing"
              ? "Không có đơn hàng đang giao"
              : "Không có đơn hàng đã hoàn thành"}
          </Text>
        }
      />
    </View>
  );
};

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "order accepted !":
      return { backgroundColor: "#E0F0FF" }; // Blue
    case "processing":
      return { backgroundColor: "#EEE5FF" }; // Purple
    case "shipped":
      return { backgroundColor: "#FFF3E0" }; // Orange
    case "delivered":
      return { backgroundColor: "#E0FFEE" }; // Green
    default:
      return { backgroundColor: "#F0F0F0" }; // Gray
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    color: "#999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderId: {
    fontWeight: "600",
    fontSize: 14,
  },
  orderDate: {
    fontSize: 12,
    color: "#666",
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#EEE",
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#333",
  },
  moreItems: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    textAlign: "right",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 12,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default MyOrdersScreen;
