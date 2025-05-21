// signInWithCustomToken.tsx
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "../../../firebaseConfig";

// Initialize Firebase app if not already initialized

export async function signInWithCustomTokenFunc(customToken: string) {
    const auth = getAuth(app);
    try {
        const userCredential = await signInWithCustomToken(auth, customToken);
        // Retrieve the ID token from the signed-in user:
        const idToken = await userCredential.user.getIdToken();
        return { userCredential, idToken };
    } catch (error) {
        console.error("Error signing in with custom token:", error);
        throw error;
    }
}
