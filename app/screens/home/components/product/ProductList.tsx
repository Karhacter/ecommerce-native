import { GET_ALL, GET_IMG } from "@/app/service/APIService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProductList = () => {
  const navigation = useNavigation<any>();

  const [products, setProducts] = useState([]);
  const [Categoires, setCategories] = useState([]);
  const [isNotificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Number | null>(null);

  useEffect(() => {
    const FetchProduct = async () => {
      try {
        const endpoint = selectedCategory
          ? `public/categories/${selectedCategory}/products?pageNumber=0&pageSize=5&sortBy=productId&sortOrder=asc`
          : "public/products?pagNumber=0&pageSize=5&sortBy=productId&sortOrder=asc";
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
          "public/categories?pageNumber=0&pageSize=5&sortBy=categoryId&sortOrder=asc"
        );
        setCategories(response.data.content);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <View style={styles.productList}>
        {products.map((product: any) => (
          <TouchableOpacity
            key={product.productId}
            style={styles.productCard}
            onPress={() =>
              navigation.push("ProductDetail", {
                productId: product.productId,
              })
            }
          >
            <Image
              source={{ uri: GET_IMG("products", product.image) }}
              style={styles.productImage}
            />
            <TouchableOpacity style={styles.heartIcon}>
              <Ionicons name="heart-outline" size={18} />
            </TouchableOpacity>
            {product.brand && (
              <Text style={styles.brand}>{product.categoryName}</Text>
            )}

            <Text style={styles.productName}>{product.productName}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ${product.price.toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
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
