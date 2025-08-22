import { GET_ID, callApi } from './APIService';

// Some backends only allow password updates via PUT /public/users/{userId}
// and expect the full user payload. This helper fetches current user, then
// submits the full object with the new password.
export async function resetPasswordWithFullUser(email: string, newPassword: string) {
  // 1) Get current user by email
  const userRes = await GET_ID('public/users/email', encodeURIComponent(email));
  const user = userRes.data;
  if (!user?.userId) throw new Error('User not found');

  // 2) Build payload retaining original fields (including cart if present)
  const payload: any = {
    userId: user.userId,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    mobileNumber: user.mobileNumber ?? '',
    email: user.email,
    password: newPassword,
    roles: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : [{ roleId: 102, roleName: 'USER' }],
    address: user.address ?? {
      addressId: user.address?.addressId ?? user.addressId ?? 0,
      street: user.address?.street ?? '',
      buildingName: user.address?.buildingName ?? '',
      city: user.address?.city ?? '',
      state: user.address?.state ?? '',
      country: user.address?.country ?? '',
      pincode: user.address?.pincode ?? '',
    },
  };
  if (user.cart) payload.cart = user.cart; // keep existing cart if API expects it

  // 3) PUT to public users/{id}
  try {
    await callApi(`public/users/${user.userId}`, 'PUT', payload);
    return true;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.response?.data || err?.message || 'Update failed';
    throw new Error(String(message));
  }
}
