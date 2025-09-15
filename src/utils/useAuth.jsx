import { useEffect, useState } from "react";

function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://crm-backend-gsa9.onrender.com/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return user;
}

export default useAuth;
