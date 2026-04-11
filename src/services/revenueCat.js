import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";

let isRevenueCatConfigured = false;

const ENTITLEMENT_ID = "Parents+ Pro";


export async function initRevenueCat(appUserID = null) {
  try {
    if (isRevenueCatConfigured) {
      return true;
    }

    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    const apiKey =
      Platform.OS === "ios"
        ? process.env.EXPO_PUBLIC_RC_IOS_KEY
        : process.env.EXPO_PUBLIC_RC_ANDROID_KEY;

    await Purchases.configure({
      apiKey,
      appUserID: appUserID || undefined,
    });

    isRevenueCatConfigured = true;
    return true;
  } catch (error) {
    console.error("RevenueCat init error:", error);
    return false;
  }
}

export async function getCurrentOffering() {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings?.current || null;
  } catch (error) {
    console.error("RevenueCat getOfferings error:", error);
    return null;
  }
}

export async function purchaseRevenueCatPackage(pkg) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return {
      success: true,
      customerInfo,
      isActive: !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID],
    };
  } catch (error) {
    if (error?.userCancelled) {
      return { success: false, cancelled: true };
    }
    console.error("RevenueCat purchase error:", error);
    return { success: false, error };
  }
}

export async function restoreUserPurchases() {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return {
      success: true,
      customerInfo,
      isActive: !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID],
    };
  } catch (error) {
    console.error("RevenueCat restore error:", error);
    return { success: false, error };
  }
}

export async function hasActiveProSubscription() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];
  } catch (error) {
    console.error("RevenueCat subscription check error:", error);
    return false;
  }
}