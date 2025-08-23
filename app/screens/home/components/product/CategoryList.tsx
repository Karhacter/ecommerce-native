import { GET_ALL_PAGE } from "@/app/service/APIService";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const CategoryList = () => {
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
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GET_ALL_PAGE(
          "categories",
          0,
          10,
          "categoryId",
          "asc"
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
  // Categories for the top section
  const topCategories = [
    { id: "1", name: "Dresses" },
    { id: "2", name: "Jackets" },
    { id: "3", name: "Jeans" },
    { id: "4", name: "Shoes" },
  ];
  const [loading, setLoading] = useState(true);

  return (
    <>
      <View>
        <View style={styles.categoriesContainer}>
          {topCategories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryItem}>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <Text style={styles.title}>Dresses</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryItem: {
    borderRadius: 100,
    padding: 15,
    backgroundColor: "black",
    paddingVertical: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default CategoryList;
