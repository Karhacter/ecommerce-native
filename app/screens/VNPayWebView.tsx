import { RootStackParamList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Alert, Platform } from "react-native";
import { WebView } from "react-native-webview";

type Props = NativeStackScreenProps<RootStackParamList, "VNPayWebView">;

const VNPayWebView: React.FC<Props> = ({ route, navigation }) => {
  const { paymentUrl } = route.params;

  if (Platform.OS === "web") {
    // ✅ Trên web thì mở link luôn
    window.location.href = paymentUrl;
    return null;
  }

  return (
    <WebView
      source={{ uri: paymentUrl }}
      javaScriptEnabled
      domStorageEnabled
      onMessage={(event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);

          if (data.status === "success") {
            // ✅ Điều hướng sang màn OrderSuccessScreen
            navigation.replace("OrderSuccess", {
              txnRef: data.txnRef,
              amount: data.amount,
            });
          } else {
            Alert.alert(
              "Thanh toán thất bại",
              data.reason || "Không rõ nguyên nhân"
            );
            navigation.goBack();
          }
        } catch (e) {
          console.log("Không parse được message từ WebView:", e);
        }
      }}
    />
  );
};

export default VNPayWebView;
