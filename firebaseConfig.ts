// firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAk16aV6q2xL6pS5NIf2hshLgzd52DBGKs",
  authDomain: "projct-42aa8.firebaseapp.com",
  projectId: "projct-42aa8",
  storageBucket: "projct-42aa8.firebasestorage.app",
  messagingSenderId: "745672219701",
  appId: "1:745672219701:web:c220ff08f44fe992d5e57c",
  measurementId: "G-HXRGGTECQV"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

let auth: Auth;
try {
  auth = getAuth(app);
} catch {
  if (isIOS) {
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } else {
    throw new Error("Auth already initialized unexpectedly");
  }
}

export { app, auth };
