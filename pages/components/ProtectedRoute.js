// components/ProtectedRoute.js
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth initialization completes before redirecting
    if (!initializing && !user) {
      router.push("/");
    }
  }, [user, router, initializing]);

  if (initializing) return null;

  return user ? children : null;
}
