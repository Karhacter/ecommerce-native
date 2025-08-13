import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmailSentScreen from "./screens/auth/EmailSentScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import Checkout from "./screens/Checkout";
import ProfileTab from "./screens/home/ProfileTab";
import HomeScreen from "./screens/HomeScreen";
import MyOrdersScreen from "./screens/MyOrdersScreen";
import ProductDetail from "./screens/ProductDetail";
import Splash from "./screens/Splash";

const Stack = createNativeStackNavigator<any>();

export default function RootLayout() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={Splash} />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="Profile" component={ProfileTab} />
      <Stack.Screen name="MyOrder" component={MyOrdersScreen} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="EmailSent" component={EmailSentScreen} />
    </Stack.Navigator>
  );
}
