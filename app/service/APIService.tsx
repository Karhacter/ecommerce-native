import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";

// let API_URL = "http://localhost:8080/api";
let API_URL = "http://10.18.14.78:8080/api";
// let API_URL = "http://10.18.14.77:8080/api";

async function getToken() {
  return await AsyncStorage.getItem("jwt-token");
}

export async function callApi(
  endpoint: string,
  method: string,
  data: any = null
): Promise<AxiosResponse<any>> {
  const token = await getToken();
  return axios({
    method,
    url: `${API_URL}/${endpoint}`,
    data,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

export function GET_ALL(endpoint: string): Promise<AxiosResponse<any>> {
  return callApi(endpoint, "GET");
}

export const GET_ALL_PAGE = (
  resource: string,
  page = 0,
  size = 10,
  sortBy = "id",
  sortOrder: "asc" | "desc" = "asc"
) => {
  const url = `public/${resource}?pageNumber=${page}&pageSize=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  return callApi(url, "GET");
};

export function GET_PAGE(
  endpoint: string,
  page: number = 0,
  size: number = 10,
  categoryId: string | null = null
): Promise<AxiosResponse<any>> {
  let url = `${endpoint}?page=${page}&size=${size}`;
  if (categoryId !== null) {
    url + "&categoryId=${categoryId}";
  }
  return callApi(url, "GET");
}

export function GET_ID(
  endpoint: string,
  id: string | number
): Promise<AxiosResponse<any>> {
  return callApi(`${endpoint}/${id}`, "GET");
}

export function POST_ADD(
  endpoint: string,
  data: any
): Promise<AxiosResponse<any>> {
  return callApi(endpoint, "POST", data);
}

export function PUT_EDIT(
  endpoint: string,
  data: any
): Promise<AxiosResponse<any>> {
  return callApi(endpoint, "PUT", data);
}

export function DELETE_ID(
  endpoint: string,
  id: string | number
): Promise<AxiosResponse<any>> {
  return callApi(`${endpoint}/${id}`, "DELETE");
}

export function GET_IMG(endpoint: string, imgName: string): string {
  //http://localhost:8080/api/public/products/image/bcff5da9-7714-45eb-99b5-625ca8835341.png
  return `${API_URL}/public/${endpoint}/image/${imgName}`;
}

export async function POST_LOGIN(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const token = response.data["jwt-token"];
    if (token) {
      await AsyncStorage.setItem("jwt-token", token);
      await AsyncStorage.setItem("user-email", email);
      console.log("user-email", email);
      const userResponse = await GET_ID(
        `public/users/email`,
        encodeURIComponent(email)
      );
      const cartId = userResponse.data.cart.cartId;
      await AsyncStorage.setItem("cart-id", String(cartId));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Login error", error);
    return false;
  }
}

// Function POst_register
export async function POST_REGISTER(userData: {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
  address: {
    street: string;
    buildingName: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
}): Promise<boolean> {
  try {
    const requestBody = {
      userId: 0, // mặc định
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobileNumber: userData.mobileNumber,
      email: userData.email,
      password: userData.password,
      roles: [
        {
          roleId: 102,
          roleName: "USER",
        },
      ],
      address: {
        addressId: 2, // mặc định
        street: "666666",
        buildingName: "666666",
        city: "666666",
        state: "666666",
        country: "666666",
        pincode: "666666",
      },
    };

    const response = await axios.post(`${API_URL}/register`, requestBody);

    if (response.status === 200 || response.status === 201) {
      console.log("Đăng ký thành công:", response.data);
      return true;
    } else {
      console.warn("Đăng ký thất bại với status:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return false;
  }
}

export async function handleLogout(navigation: any): Promise<void> {
  try {
    await AsyncStorage.multiRemove(["jwt-token", "user-email", "cart-id"]);
    console.log("✅ Đã đăng xuất và xóa dữ liệu người dùng.");

    // ⚠️ Dùng replace để không quay lại màn trước
    navigation.replace("SignIn");
  } catch (error) {
    console.error("❌ Lỗi khi đăng xuất:", error);
  }
}

export function GET_PRODUCTS_BY_CATEGORY(
  categoryId: number,
  page = 0,
  size = 10
): Promise<AxiosResponse<any>> {
  const url = `public/categories/${categoryId}/products?pageNumber=${page}&pageSize=${size}&sortBy=productId&sortOrder=asc`;
  return callApi(url, "GET");
}

//CART
export function UPDATE_PRODUCT_QUANTITY(
  cartId: number,
  productId: number,
  quantity: number
): Promise<AxiosResponse<any>> {
  const url = `public/carts/${cartId}/products/${productId}/quantity/${quantity}`;
  return callApi(url, "PUT");
}
export function REMOVE_PRODUCT_FROM_CART(
  cartId: number,
  productId: number
): Promise<AxiosResponse<any>> {
  const url = `public/carts/${cartId}/product/${productId}`;
  return callApi(url, "DELETE");
}
export function GET_CART_BY_USER_EMAIL_AND_ID(
  email: string,
  cartId: number
): Promise<AxiosResponse<any>> {
  const encodedEmail = encodeURIComponent(email);
  const url = `public/users/${encodedEmail}/carts/${cartId}`;
  return callApi(url, "GET");
}
export function ADD_TO_CART(
  cartId: number,
  productId: number,
  quantity: number
): Promise<AxiosResponse<any>> {
  const url = `public/carts/${cartId}/products/${productId}/quantity/${quantity}`;
  return callApi(url, "POST", {}); // gửi rỗng nếu backend yêu cầu body
}

export function GET_USER_ORDERS(email: string): Promise<AxiosResponse<any>> {
  const encodedEmail = encodeURIComponent(email);
  const url = `public/users/${encodedEmail}/orders`;
  return callApi(url, "GET");
}
