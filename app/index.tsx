import { RootStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Linking } from "react-native";
import EmailSentScreen from "./screens/auth/EmailSentScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import Login from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import Checkout from "./screens/Checkout";
import ProfileTab from "./screens/home/ProfileTab";
import HomeScreen from "./screens/HomeScreen";
import MyOrdersScreen from "./screens/MyOrdersScreen";
import ProductDetail from "./screens/ProductDetail";
import Splash from "./screens/Splash";
import VNPayWebView from "./screens/VNPayWebView";
import { AuthProvider, useAuth } from "./service/AuthContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} />
          <Stack.Screen name="Profile" component={ProfileTab} />
          <Stack.Screen name="MyOrder" component={MyOrdersScreen} />
          <Stack.Screen name="Checkout" component={Checkout} />
          <Stack.Screen name="VNPayWebView" component={VNPayWebView} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />

          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="EmailSent" component={EmailSentScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const DeepLinkHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      try {
        const parsedUrl = new URL(event.url);
        const screen = parsedUrl.host || parsedUrl.pathname.replace("/", ""); // lấy "OrderSuccess"

        if (screen === "OrderSuccess") {
          const payment = parsedUrl.searchParams.get("payment");
          const txnRef = parsedUrl.searchParams.get("txnRef");
          const amount = parsedUrl.searchParams.get("amount");

          navigation.navigate("OrderSuccess", { txnRef, amount });
        }
      } catch (err) {
        console.warn("Invalid deep link URL", err);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, [navigation]);

  return <>{children}</>;
};

export default function AppNavigator() {
  return (
    <AuthProvider>
      <DeepLinkHandler>
        <RootLayout />
      </DeepLinkHandler>
    </AuthProvider>
  );
}
