import {
  GET_ALL,
  GET_ALL_PAGE,
  GET_IMG,
  GET_PRODUCTS_BY_CATEGORY,
} from "@/app/service/APIService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductNew = () => {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState([]);

  const [isNotificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Number | null>(null);

  const [categories, setCategories] = useState<
    { categoryId: number | null; categoryName: string }[]
  >([]);
  const [selectedCat, setSelectedCat] = useState<{
    categoryId: number | null;
    categoryName: string;
  }>({
    categoryId: null,
    categoryName: "Tất cả",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GET_ALL_PAGE(
          "categories",
          0,
          10,
          "categoryId",
          "desc"
        );
        const fetched = response.data.content;
        setCategories([
          { categoryId: null, categoryName: "Tất cả" },
          ...fetched,
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        if (selectedCat.categoryId === null) {
          const response = await GET_ALL_PAGE(
            "products",
            0,
            10,
            "productId",
            "desc"
          );
          setProducts(response.data.content);
        } else {
          const response = await GET_PRODUCTS_BY_CATEGORY(
            selectedCat.categoryId,
            0,
            10
          );
          setProducts(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCat]);

  useEffect(() => {
    const FetchProduct = async () => {
      try {
        const endpoint = selectedCategory
          ? `public/categories/${selectedCategory}/products?pageNumber=0&pageSize=5&sortBy=productId&sortOrder=desc`
          : "public/products?pagNumber=0&pageSize=5&sortBy=productId&sortOrder=desc";
        const response = await GET_ALL(endpoint);
        setProducts(response.data.content);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    FetchProduct();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GET_ALL(
          "public/categories?pageNumber=0&pageSize=5&sortBy=categoryId&sortOrder=desc"
        );
        setCategories(response.data.content);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
          contentContainerStyle={{ paddingVertical: 6 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.categoryId !== null ? cat.categoryId : "all"}
              onPress={() => setSelectedCat(cat)}
              style={[
                styles.category,
                selectedCat.categoryId === cat.categoryId &&
                  styles.selectedCategory,
              ]}
            >
              <Text
                style={[
                  styles.catText,
                  selectedCat.categoryId === cat.categoryId &&
                    styles.selectedCatText,
                ]}
              >
                {cat.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Products Grid */}
        {loading ? (
          <View
            style={{
              width: "100%",
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LottieView
              source={require("@/assets/animations/home.json")}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
          </View>
        ) : (
          <View style={styles.productList}>
            {products.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productCard}
                onPress={() =>
                  navigation.push("ProductDetail", {
                    productId: item.productId,
                  })
                }
              >
                <Image
                  source={{ uri: GET_IMG("products", item.image) }}
                  style={styles.productImage}
                />
                <TouchableOpacity style={styles.heartIcon}>
                  <Ionicons name="heart-outline" size={18} />
                </TouchableOpacity>
                <Text style={styles.productName}>{item.categoryName}</Text>
                <Text style={styles.productName}>{item.productName}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>
                    {(item.specialPrice || item.price).toLocaleString("vi-VN")}₫
                  </Text>
                  {item.discount > 0 && (
                    <Text style={styles.discount}>New</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  searchRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    height: 44,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  categories: {
    marginBottom: 20,
  },
  category: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    minHeight: 40,
  },
  selectedCategory: {
    backgroundColor: "#000",
  },
  catText: {
    fontSize: 15,
    color: "#555",
  },
  selectedCatText: {
    color: "#fff",
    fontWeight: "600",
  },
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
    marginTop: 8,
    fontWeight: "500",
    fontSize: 14,
  },
  categoryName: {
    marginTop: 8,
    fontWeight: "500",
    fontSize: 14,
    paddingBottom: 20,
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
  discount: {
    color: "red",
    fontWeight: "600",
    fontSize: 13,
  },
});
