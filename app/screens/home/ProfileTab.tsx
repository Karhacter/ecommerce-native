import { handleLogout } from "@/app/service/APIService";
import { useNavigation } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileTab = () => {
  const navigation = useNavigation<any>();
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>Fscreation</Text>
        <Text style={styles.profileEmail}>Fscreation441@gmail.com</Text>
      </View>

      {/* Personal Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("MyOrder")}
        >
          <Text style={styles.menuItemText}>My Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>My Favourites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Shipping Address</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>My Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Support Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.supportItem}>
          <Text style={styles.supportItemText}>1. FAQs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportItem}>
          <Text style={styles.supportItemText}>2. Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleLogout(navigation)}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  profileHeader: {
    paddingVertical: 30,
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
    paddingLeft: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  supportItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  supportItemText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginTop: 30,
    marginBottom: 50,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#ff4444",
    fontWeight: "500",
  },
});

export default ProfileTab;
