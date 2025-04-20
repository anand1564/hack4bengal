import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return { user, isLoggedIn: !!user };
};

export default useAuth;