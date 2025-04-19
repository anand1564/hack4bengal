import { useMemo } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ use named import with camelCase

const useAuth = () => {
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token); // ✅ use jwtDecode instead of jwt_decode
    } catch {
      return null;
    }
  }, [token]);

  return { user, isLoggedIn: !!user };
};

export default useAuth;
