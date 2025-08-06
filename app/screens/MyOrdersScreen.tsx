import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const orders = [
  {
    id: "1",
    image: require("@/assets/images/sneakers.jpg"),
    name: "Vado Odelle Dress",
    size: "M",
    price: 1190,
    status: "Đang vận chuyển",
  },
  {
    id: "2",
    image: require("@/assets/images/sneakers.jpg"),
    name: "Vado Odelle Dress",
    size: "L",
    price: 1100,
    status: "Đã lấy hàng",
  },
];

const MyOrdersScreen = () => {
  const [activeTab, setActiveTab] = useState<"Ongoing" | "Completed">(
    "Ongoing"
  );
  const navigation = useNavigation<any>();

  const renderOrder = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.size}>Size {item.size}</Text>
        <Text style={styles.price}>$ {item.price.toLocaleString()}</Text>
      </View>
      <View style={styles.right}>
        <View style={[styles.statusBadge, statusColor(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <TouchableOpacity style={styles.trackBtn}>
          <Text style={styles.trackText}>Theo dõi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Order</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={24} />
        </TouchableOpacity>
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
            Ongoing
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
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default MyOrdersScreen;

const statusColor = (status: string) => {
  switch (status) {
    case "Đang vận chuyển":
      return { backgroundColor: "#E0F0FF" };
    case "Đã lấy hàng":
      return { backgroundColor: "#FDEEDC" };
    case "Đang đóng gói":
      return { backgroundColor: "#EEE5FF" };
    default:
      return { backgroundColor: "#DDD" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 50,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 25,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  tabText: {
    color: "#999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 70,
    resizeMode: "contain",
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
  },
  size: {
    fontSize: 13,
    color: "#666",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  right: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  trackBtn: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  trackText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
