// components/ProtectedRoute.js
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return user ? children : null;
}
