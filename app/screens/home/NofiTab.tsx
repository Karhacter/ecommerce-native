import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

const NofiTab = () => {
  const navigation = useNavigation<any>();
  const notifications = [
    {
      id: "1",
      name: "Kristine Jones",
      message:
        "It is a long established fact that a reader will be distracted by the readable content of a page.",
      time: "2 hours ago",
      read: false,
      avatar: require("@/assets/images/avatar1.png"),
    },
    {
      id: "2",
      name: "Kay Hicks",
      message:
        "There are many variations of passages of Lorem Ipsum available.",
      time: "2 hours ago",
      read: false,
      avatar: require("@/assets/images/avatar1.png"),
    },
    {
      id: "3",
      name: "Cheryl Moretti",
      message:
        "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing.",
      time: "6 hours ago",
      read: true,
      avatar: require("@/assets/images/avatar1.png"),
    },
    {
      id: "4",
      name: "Cheryl Moretti",
      message:
        "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing.",
      time: "1 day ago",
      read: true,
      avatar: require("@/assets/images/avatar1.png"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("Search")}
          >
            <MaterialIcons name="search" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="settings" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Mentions</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationList}>
        {notifications.map((notification, index) => (
          <Animatable.View
            key={notification.id}
            animation="fadeInUp"
            duration={800}
            delay={index * 100}
            style={[
              styles.notificationItem,
              !notification.read && styles.unreadNotification,
            ]}
          >
            <View style={styles.avatarContainer}>
              <Image source={notification.avatar} style={styles.avatar} />
              {!notification.read && <View style={styles.unreadBadge} />}
            </View>

            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationName}>{notification.name}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              <Text style={styles.notificationMessage}>
                {notification.message}
              </Text>

              <View style={styles.notificationActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons name="reply" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons
                    name="bookmark-border"
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons name="delete-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingVertical: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "black",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
  },
  notificationList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "black",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "black",
    borderWidth: 2,
    borderColor: "#fff",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  notificationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  notificationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
  },
  actionButton: {
    padding: 5,
  },
});

export default NofiTab;
