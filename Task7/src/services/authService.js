import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export function subscribeToAuth(onUser, onError) {
  return onAuthStateChanged(auth, onUser, onError);
}

export function signupWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function logoutUser() {
  return signOut(auth);
}

export function getAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "This email address is not valid.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Wrong email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "The Google sign-in window was closed.";
    case "auth/popup-blocked":
      return "The browser blocked the sign-in window. Allow pop-ups and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    case "auth/unauthorized-domain":
      return "This website is not allowed in Firebase (Authorized domains).";
    default:
      return "Something went wrong. Please try again.";
  }
}