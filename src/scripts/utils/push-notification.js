import { AuthModel } from "../model/authModel";
import CONFIG from "../config";

const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function getSwRegistration() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker tidak didukung di browser ini.");
  }
  return navigator.serviceWorker.ready;
}

export async function getCurrentSubscription() {
  const registration = await getSwRegistration();
  return registration.pushManager.getSubscription();
}

export async function subscribePushNotification() {
  if (Notification.permission === "denied") {
    alert(
      "Anda telah memblokir notifikasi. Harap reset izin notifikasi di browser Anda."
    );
    throw new Error("Izin notifikasi ditolak.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Izin notifikasi tidak diberikan.");
  }

  const registration = await getSwRegistration();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  console.log("Berhasil subscribe:", subscription);

  await sendSubscriptionToApi(subscription);
}

export async function unsubscribePushNotification() {
  const subscription = await getCurrentSubscription();

  if (!subscription) {
    alert("Anda memang belum subscribe.");
    return;
  }

  try {
    const token = AuthModel.getToken();
    if (!token) throw new Error("Anda harus login untuk unsubscribe.");

    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "DELETE",
      body: JSON.stringify({ endpoint: subscription.endpoint }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();
    if (response.status >= 400) {
      throw new Error(responseJson.message);
    }

    await subscription.unsubscribe();

    console.log("Unsubscribe berhasil.");
    alert("Berhasil unsubscribe notifikasi.");
  } catch (error) {
    console.error("Gagal unsubscribe:", error);
    alert(`Gagal unsubscribe: ${error.message}`);
  }
}

async function sendSubscriptionToApi(subscription) {
  const token = AuthModel.getToken();
  if (!token) throw new Error("Harus login untuk subscribe.");

  const subscriptionObject = subscription.toJSON();
  delete subscriptionObject.expirationTime;

  try {
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "POST",
      body: JSON.stringify(subscriptionObject),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();
    if (response.status >= 400) {
      throw new Error(responseJson.message);
    }

    console.log("Subscription terkirim ke server API Dicoding.");
    alert("Berhasil subscribe notifikasi!");
  } catch (error) {
    console.error("Gagal mengirim subscription ke API:", error);
    alert(`Gagal subscribe: ${error.message}`);
    await subscription.unsubscribe();
    throw error;
  }
}
