export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  EmailSent: undefined;
  Profile: undefined;
  Home: undefined;
  ProductDetail: { productId: string };
  Checkout: undefined;
  Payment: { paymentUrl: string }; // paymentUrl sẽ lấy từ route.params
  ChangePassword: undefined;
  OrderSuccess: { txnRef?: string; amount?: string }; // 👈 cần khai báo đúng
  MyOrder: undefined;
  VNPayWebView: { paymentUrl: string };
  Search: undefined;
};
