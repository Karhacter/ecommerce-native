import { Image } from "expo-image";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import CategoryList from "./components/product/CategoryList";
import FeaturedProducts from "./components/product/FeaturedProducts";
import ProductList from "./components/product/ProductList";

const HomeTab = () => {
  // Bottom categories section data
  const bottomCategories = [
    {
      id: "1",
      name: "New Arrivals",
      count: "208 Product",
      image: require("@/assets/images/sneakers.jpg"),
    },
    {
      id: "2",
      name: "Clothes",
      count: "358 Product",
      image: require("@/assets/images/clothes.jpg"),
    },
    {
      id: "3",
      name: "Bags",
      count: "160 Product",
      image: require("@/assets/images/bags.jpg"),
    },
    {
      id: "4",
      name: "Shoese",
      count: "230 Product",
      image: require("@/assets/images/shoese.jpg"),
    },
    {
      id: "5",
      name: "Electronics",
      count: "130 Product",
      image: require("@/assets/images/headphones.jpg"),
    },
    {
      id: "6",
      name: "Home",
      count: "",
      image: require("@/assets/images/jewelry.jpg"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.container1}>
          <Image
            source={require("@/assets/images/jewelry.jpg")}
            style={styles.logo}
          />
          <Image
            source={require("@/assets/images/person.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Welcome,</Text>
        <Text style={styles.subtitle}>Our Fashions App</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Featured Product Card */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <FeaturedProducts />
        <Text style={styles.title}>Categoires</Text>

        {/* Categories Section */}
        <CategoryList />

        {/* Featured Products */}
        <ProductList />
        <Button style={styles.SeeMore}>
          <Text style={styles.buttonmore}>See More...</Text>
        </Button>

        <View style={styles.bottomCategoriesContainer}>
          {bottomCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.bottomCategoryItem}
            >
              <Image
                source={category.image}
                style={styles.categoryImage}
                blurRadius={5} // This adds the blur effect to the image
              />
              <View style={styles.categoryTextContainer}>
                <Text style={styles.bottomCategoryName}>{category.name}</Text>
                {category.count && (
                  <Text style={styles.bottomCategoryCount}>
                    {category.count}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Test
  container1: {
    flexDirection: "row", // arrange horizontally
    justifyContent: "space-between", // push logos to far
    alignItems: "center", // vertical alignment
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  //
  buttonmore: {
    color: "white",
  },
  SeeMore: {
    marginBottom: 20,
    borderRadius: 200,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  // Bottom Categories
  bottomCategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bottomCategoryItem: {
    width: "48%",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden", // Important for the blur effect
    position: "relative", // For text positioning
  },
  categoryImage: {
    width: "100%",
    height: 120, // Adjust as needed
  },
  categoryTextContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.3)", // Semi-transparent overlay
  },
  bottomCategoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // White text for better contrast
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)", // Text shadow for better readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bottomCategoryCount: {
    fontSize: 14,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default HomeTab;
