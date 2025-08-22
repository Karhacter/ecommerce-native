import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import * as React from "react";
import { getCartByEmailAndId, getCartQtyOverlay } from "../service/APIService";

const TabNavigator = () => {
  const [cartBadge, setCartBadge] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    const loadBadge = async () => {
      try {
        const email = await AsyncStorage.getItem("user-email");
        const cartId = await AsyncStorage.getItem("cart-id");
        if (!email || !cartId) return;
        const [cart, overlay] = await Promise.all([
          getCartByEmailAndId(email, cartId),
          getCartQtyOverlay(cartId),
        ]);
        const total = (cart.products || []).reduce((sum: number, p: any) => {
          const q =
            overlay[String(p.productId)] ??
            p.cartQuantity ??
            p.quantityInCart ??
            p.productQuantity ??
            p.quantity ??
            1;
          return sum + (typeof q === "number" ? q : 1);
        }, 0);
        setCartBadge(total > 0 ? String(total) : undefined);
      } catch {
        setCartBadge(undefined);
      }
    };
    const unsubscribe = setInterval(loadBadge, 2500);
    loadBadge();
    return () => clearInterval(unsubscribe);
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === "index")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "cart")
            iconName = focused ? "cart" : "cart-outline";
          else if (route.name === "orders")
            iconName = focused ? "reader" : "reader-outline";
          else if (route.name === "profile")
            iconName = focused ? "person" : "person-outline";
          else iconName = "help-outline";
          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 11, marginBottom: 2 },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarStyle: {
          paddingVertical: 6,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarLabel: "Home" }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "My Cart",
          tabBarLabel: "Cart",
          tabBarBadge: cartBadge,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: "Orders", tabBarLabel: "Orders" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarLabel: "Profile" }}
      />
    </Tabs>
  );
};

export default TabNavigator;
