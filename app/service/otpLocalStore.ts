import AsyncStorage from "@react-native-async-storage/async-storage";

interface OtpRecord {
  code: string;
  expiresAt: number; // epoch ms
  attemptsLeft: number;
}

const keyFor = (email: string) => `otp:${email.toLowerCase()}`;

export async function saveOtp(
  email: string,
  code: string,
  ttlMs: number = 5 * 60 * 1000,
  maxAttempts = 5
) {
  const rec: OtpRecord = {
    code,
    expiresAt: Date.now() + ttlMs,
    attemptsLeft: maxAttempts,
  };
  await AsyncStorage.setItem(keyFor(email), JSON.stringify(rec));
}

export async function verifyOtp(
  email: string,
  code: string
): Promise<{ ok: boolean; reason?: string }> {
  const raw = await AsyncStorage.getItem(keyFor(email));
  if (!raw) return { ok: false, reason: "OTP not found" };
  let rec: OtpRecord;
  try {
    rec = JSON.parse(raw) as OtpRecord;
  } catch {
    return { ok: false, reason: "Corrupted OTP" };
  }

  if (Date.now() > rec.expiresAt) {
    await AsyncStorage.removeItem(keyFor(email));
    return { ok: false, reason: "OTP expired" };
  }
  if (rec.attemptsLeft <= 0) {
    await AsyncStorage.removeItem(keyFor(email));
    return { ok: false, reason: "Too many attempts" };
  }
  if (String(code).trim() !== String(rec.code).trim()) {
    rec.attemptsLeft -= 1;
    await AsyncStorage.setItem(keyFor(email), JSON.stringify(rec));
    return { ok: false, reason: "Incorrect code" };
  }
  await AsyncStorage.removeItem(keyFor(email));
  return { ok: true };
}
