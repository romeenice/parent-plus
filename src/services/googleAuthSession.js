// src/services/googleAuthSession.js
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID =
  "623215589148-47ls87mjeic68qcvue4cp43r97iol2ev.apps.googleusercontent.com";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export async function signInWithGoogleExpo() {
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  const request = new AuthSession.AuthRequest({
    clientId: CLIENT_ID,
    redirectUri,
    scopes: ["openid", "profile", "email"],
    responseType: "id_token",
    usePKCE: false, // ← ВАЖЛИВО: вимикаємо PKCE, інакше буде code_challenge_method
  });

  const result = await request.promptAsync(discovery, { useProxy: true });

  if (result.type !== "success") {
    throw new Error("Google sign-in cancelled or failed");
  }

  const idToken = result.params.id_token;
  if (!idToken) {
    throw new Error("No Google ID token");
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const userCred = await signInWithCredential(auth, credential);
  return userCred.user;
}
