import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
const AuthSuccess = () => {
  const navigate = useNavigate();
  const [_, setCookie] = useCookies([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/signandlog?error=missing-token");
      return;
    }

    localStorage.setItem("token", token);
    setCookie("token", token, { path: "/", maxAge: 60 * 60 * 24 });

    // الآن استدعِ بيانات المستخدم من الباكند
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/userinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (result.user) {
          window.close();
          window.opener.location.href = "/";
        } else {
          navigate("/signandlog?error=no-user");
        }
      } catch (err) {
        console.error("فشل جلب المستخدم", err);
        navigate("/signandlog?error=server");
      }
    };

    fetchUser();
  }, [navigate, setCookie]);

  return <p>Logging in...</p>;
};

export default AuthSuccess;