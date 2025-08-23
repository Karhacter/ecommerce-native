import { callApi, GET_IMG } from "@/app/service/APIService"; // nhớ import GET_IMG
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    try {
      setLoading(true);
      const res = await callApi(
        `public/products/keyword/${encodeURIComponent(
          searchText
        )}?pageNumber=0&pageSize=10&sortBy=productId&sortOrder=asc&categoryId=0`,
        "GET"
      );
      setResults(res.data.content || []);
    } catch (err) {
      console.error("❌ Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item.productId })
      }
    >
      <Image
        source={{ uri: GET_IMG("products", item.image) }}
        style={styles.productImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.productName}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Ô search */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && <Text style={{ marginTop: 20 }}>Đang tìm kiếm...</Text>}

      {/* Không tìm thấy */}
      {!loading && results.length === 0 && searchText.trim() !== "" && (
        <View style={styles.noResult}>
          <Image
            source={require("@/assets/images/clothes.jpg")}
            style={styles.image}
          />
          <Text style={styles.noResultText}>Không tìm thấy kết quả!</Text>
          <Text style={styles.suggestion}>
            Hãy thử từ khoá khác tổng quát hơn.
          </Text>
        </View>
      )}

      {/* Danh sách kết quả */}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.productId.toString()} // đổi từ id → productId
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 55,
    backgroundColor: "#fffafc", // nền tone pastel
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fdfdfd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 8,
    color: "#333",
  },
  searchBtn: {
    backgroundColor: "#ff4081", // hồng fashion
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  noResult: {
    marginTop: 80,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 60,
  },
  noResultText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#444",
  },
  suggestion: {
    marginTop: 6,
    color: "#999",
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 12,
    marginRight: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
  },
  price: {
    color: "#ff4081",
    marginTop: 6,
    fontWeight: "700",
    fontSize: 16,
  },
});
