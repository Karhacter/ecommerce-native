const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");
const axios = require("axios");
const API_URL = "http://192.168.1.3:8080/api";

// Lưu trữ thông tin order tạm thời (trong thực tế nên dùng database)
const pendingMyOrder = new Map();

// Enable CORS for web/Expo web requests
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());
app.use(express.json());

// Tự động lấy totalPrice từ cart API
async function resolveAmount(opts) {
  let { amount, email, cartId, token } = opts;

  console.log(`resolveAmount called with:`, {
    amount,
    email,
    cartId,
    hasToken: !!token,
  });

  // Nếu có amount hợp lệ thì dùng luôn
  const parsed = Number(amount);
  if (!Number.isNaN(parsed) && parsed > 0) {
    console.log(`Using provided amount: ${parsed}`);
    return Math.round(parsed);
  }

  // Nếu không có amount hoặc amount không hợp lệ, gọi API cart để lấy totalPrice
  if (email && cartId && token) {
    try {
      console.log(`Fetching cart total for email: ${email}, cartId: ${cartId}`);
      const url = `${API_URL}/public/users/${encodeURIComponent(
        email
      )}/carts/${cartId}`;
      console.log(`Calling cart API: ${url}`);

      const resp = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`Cart API response status: ${resp.status}`);
      console.log(`Cart API response data:`, resp.data);

      const total = Number(resp?.data?.totalPrice);
      if (!Number.isNaN(total) && total > 0) {
        console.log(`Successfully got cart totalPrice: ${total}`);
        return Math.round(total);
      } else {
        console.log(`Invalid totalPrice from cart API: ${total}`);
      }
    } catch (e) {
      console.log("Failed to fetch cart totalPrice:", e?.message);
      if (e.response) {
        console.log("Response status:", e.response.status);
        console.log("Response data:", e.response.data);
      }
    }
  } else {
    console.log(
      `Missing required params for cart API: email=${!!email}, cartId=${!!cartId}, hasToken=${!!token}`
    );
  }

  // Fallback nếu không lấy được gì
  console.log("Using fallback amount: 1");
  return 1;
}

async function buildPaymentUrl(opts = {}) {
  const vnpay = new VNPay({
    tmnCode: "XV01TBAT",
    secureSecret: "UN6ERU1UXDV4HIUGG8G8DZU9NWC98HSL",
    vnpayHost: "https://sandbox.vnpayment.vn",
    testMode: true,
    hashAlgorithm: "SHA512",
    loggerFn: ignoreLogger,
  });

  // Tự động resolve amount từ cart API
  const amount = await resolveAmount(opts);
  const txnRef = String(opts.txnRef ?? Date.now());
  const orderInfo = String(opts.orderInfo ?? `Thanh toan don hang ${txnRef}`);
  const ip = String(opts.ip ?? "192.168.1.3");
  const returnUrl = String(
    opts.returnUrl ?? "http://192.168.1.3:3000/api/check-payment-vnpay"
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  console.log(`Building VNPay URL with amount: ${amount}, txnRef: ${txnRef}`);

  const vnpayResponse = vnpay.buildPaymentUrl({
    // VNPay expects amount in VND x 100
    vnp_Amount: Math.max(1, Math.round(Number(amount))),
    vnp_IpAddr: ip,
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: returnUrl,
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(tomorrow),
  });
  return vnpayResponse;
}

app.get("/vnpay_return", function (req, res, next) {
  var vnp_Params = req.query;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  var config = require("config");
  var tmnCode = config.get("vnp_TmnCode");
  var secretKey = config.get("vnp_HashSecret");

  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  } else {
    res.render("success", { code: "97" });
  }
});

app.post("/api/create-qr", async (req, res) => {
  try {
    const clientIpRaw =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const clientIp = String(clientIpRaw).includes("::1")
      ? "127.0.0.1"
      : String(clientIpRaw).split(",")[0].trim();
    const { amount, txnRef, orderInfo, returnUrl, email, cartId, token } =
      req.body || {};

    console.log(
      `POST /api/create-qr - email: ${email}, cartId: ${cartId}, amount: ${amount}`
    );

    // Lưu thông tin order để callback sử dụng
    if (email && cartId) {
      pendingMyOrder.set(txnRef, {
        email,
        cartId,
        paymentMethod: "vnpay",
        token,
      });
      console.log(
        `Saved pending order: ${txnRef} -> ${email}, ${cartId}, hasToken: ${!!token}`
      );
    }

    const url = await buildPaymentUrl({
      amount,
      txnRef,
      orderInfo,
      returnUrl,
      ip: clientIp,
      email,
      cartId,
      token,
    });
    res.set("Access-Control-Allow-Origin", "*");
    return res.json({ paymentUrl: url });
  } catch (error) {
    console.error("Error in POST /api/create-qr:", error);
    res.status(500).send("Internal server error");
  }
});

// Simple GET to avoid preflight on web
app.get("/api/create-qr", async (req, res) => {
  try {
    const { amount, txnRef, orderInfo, returnUrl, email, cartId, token } =
      req.query || {};
    const clientIpRaw =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const clientIp = String(clientIpRaw).includes("::1")
      ? "127.0.0.1"
      : String(clientIpRaw).split(",")[0].trim();
    returnUrl;
    console.log(
      `GET /api/create-qr - email: ${email}, cartId: ${cartId}, amount: ${amount}`
    );

    // Lưu thông tin order để callback sử dụng
    if (email && cartId) {
      pendingMyOrder.set(txnRef, {
        email,
        cartId,
        paymentMethod: "vnpay",
        token,
      });
      console.log(
        `Saved pending order: ${txnRef} -> ${email}, ${cartId}, hasToken: ${!!token}`
      );
    }

    const url = await buildPaymentUrl({
      amount,
      txnRef,
      orderInfo,
      returnUrl,
      ip: clientIp,
      email,
      cartId,
      token,
    });
    res.set("Access-Control-Allow-Origin", "*");
    return res.json({ paymentUrl: url });
  } catch (error) {
    console.error("Error in GET /api/create-qr:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/api/complete-payment", async (req, res) => {
  try {
    const { email, cartId, paymentMethod, txnRef, amount } = req.query;

    console.log("=== COMPLETE PAYMENT START ===");
    console.log("Received params:", {
      email,
      cartId,
      paymentMethod,
      txnRef,
      amount,
    });

    if (!email || !cartId) {
      console.log("Missing required params");
      return res.status(400).json({ error: "Missing email or cartId" });
    }

    console.log(`Completing payment for email: ${email}, cartId: ${cartId}`);

    // 1. Tạo đơn hàng trong database - sử dụng đúng API path
    try {
      const orderPath = `public/users/${encodeURIComponent(
        email
      )}/carts/${cartId}/payments/${encodeURIComponent(
        paymentMethod || "vnpay"
      )}/order`;
      const orderUrl = `${API_URL}/${orderPath}`;

      console.log(`Calling createOrder API: ${orderUrl}`);
      console.log(`Full URL: ${orderUrl}`);
      console.log(`API_URL: ${API_URL}`);
      console.log(`Order path: ${orderPath}`);

      const orderResponse = await axios.post(
        orderUrl,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order created successfully:", orderResponse.data);
      console.log("Order response status:", orderResponse.status);

      // 2. Xóa giỏ hàng - sử dụng đúng API path
      try {
        const clearCartUrl = `${API_URL}/public/users/${encodeURIComponent(
          email
        )}/carts/${cartId}`;
        console.log(`Clearing cart: ${clearCartUrl}`);

        await axios.delete(clearCartUrl);
        console.log("Cart cleared successfully");
      } catch (cartError) {
        console.log("Failed to clear cart:", cartError.message);
        if (cartError.response) {
          console.log("Clear cart response status:", cartError.response.status);
          console.log("Clear cart response data:", cartError.response.data);
        }
      }

      console.log("=== COMPLETE PAYMENT SUCCESS ===");
      res.json({
        success: true,
        message: "Payment completed successfully",
        orderId: orderResponse.data?.orderId || txnRef,
      });
    } catch (orderError) {
      console.log("=== ORDER CREATION FAILED ===");
      console.log("Failed to create order:", orderError.message);
      if (orderError.response) {
        console.log("Order API response status:", orderError.response.status);
        console.log("Order API response data:", orderError.response.data);
        console.log("Order API response headers:", orderError.response.headers);
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  } catch (error) {
    console.log("=== COMPLETE PAYMENT ERROR ===");
    console.error("Error in complete-payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/check-payment-vnpay", async (req, res) => {
  try {
    console.log("Payment check endpoint reached:", req.query);

    // Lấy thông tin từ VNPay callback
    const {
      vnp_Amount,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_OrderInfo,
      vnp_ResponseCode,
      vnp_TxnRef,
      vnp_TransactionNo,
      vnp_TransactionStatus,
    } = req.query;

    // Kiểm tra trạng thái thanh toán
    if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
      console.log("Payment successful!");
      console.log("Amount:", vnp_Amount, "VND");
      console.log("Order Info:", vnp_OrderInfo);
      console.log("Transaction Ref:", vnp_TxnRef);

      // Tạo order và xóa giỏ hàng khi thanh toán thành công
      try {
        // Lấy thông tin order đã lưu
        const orderInfo = pendingMyOrder.get(vnp_TxnRef);
        if (!orderInfo) {
          console.log("No pending order found for:", vnp_TxnRef);
          const errorUrl =
            "http://192.168.1.3:8081/MyOrder?payment=error&reason=no_order_info";
          return res.redirect(errorUrl);
        }

        const { email, cartId, paymentMethod } = orderInfo;
        console.log("Creating order after successful payment:", {
          email,
          cartId,
          paymentMethod,
        });

        // Tạo order bằng API createOrder (giống như thanh toán tiền mặt)
        const orderPath = `public/users/${encodeURIComponent(
          email
        )}/carts/${cartId}/payments/${encodeURIComponent(paymentMethod)}/order`;
        const orderUrl = `${API_URL}/${orderPath}`;

        console.log(`Calling createOrder API: ${orderUrl}`);
        console.log(`Full URL: ${orderUrl}`);
        console.log(`API_URL: ${API_URL}`);
        console.log(`Order path: ${orderPath}`);

        // Lấy token từ pending order info nếu có
        const token = orderInfo.token || "";
        console.log(`Using token: ${token ? "Yes" : "No"}`);

        const orderResponse = await axios.post(
          orderUrl,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        console.log("Order created successfully:", orderResponse.data);
        console.log("Order response status:", orderResponse.status);

        // Xóa giỏ hàng
        try {
          const clearCartUrl = `${API_URL}/public/users/${encodeURIComponent(
            email
          )}/carts/${cartId}`;
          await axios.delete(clearCartUrl);
          console.log("Cart cleared successfully");
        } catch (cartError) {
          console.log("Failed to clear cart:", cartError.message);
        }

        // Xóa thông tin order tạm thời
        pendingMyOrder.delete(vnp_TxnRef);

        // Redirect về trang MyOrder với thông báo thành công
        if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
          // ✅ Thanh toán thành công → redirect về deep link
          const successUrl = `ecommercenative://payment-result?status=success&amount=${
            vnp_Amount / 100
          }&order=${vnp_TxnRef}`;
          return res.redirect(successUrl);
        } else {
          // ❌ Thanh toán thất bại
          const failUrl = `ecommercenative://payment-result?status=fail&reason=${vnp_ResponseCode}`;
          return res.redirect(failUrl);
        }
      } catch (orderError) {
        console.log(
          "Failed to create order after payment:",
          orderError.message
        );
        if (orderError.response) {
          console.log("Order API response status:", orderError.response.status);
          console.log("Order API response data:", orderError.response.data);
        }
        // Redirect về MyOrder với thông báo lỗi
        const errorUrl =
          "http://192.168.1.3:8081/MyOrder?payment=error&reason=order_creation_failed";
        res.redirect(errorUrl);
      }
    } else {
      console.log("Payment failed or pending");
      console.log("Response Code:", vnp_ResponseCode);
      console.log("Transaction Status:", vnp_TransactionStatus);

      // Redirect về trang MyOrder với thông báo thất bại
      const failUrl =
        "http://192.168.1.3:8081/MyOrder?payment=failed&reason=" +
        (vnp_ResponseCode || "unknown");
      res.redirect(failUrl);
    }
  } catch (error) {
    console.error("Error processing payment callback:", error);
    res.redirect("http://192.168.1.3:8081/MyOrder?payment=error");
  }
});

app.listen(port, () => {
  console.log(`VNPay service listening on port ${port}`);
});
