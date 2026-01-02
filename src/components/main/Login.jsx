import React, { useState } from "react";
import { loginAdmin } from "../../apis/LoginService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!mobile || !password) {
    toast.error("Mobile & Password required");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      mobile,
      pin: password,
    };

    const response = await loginAdmin(payload);

    // ✅ SAFETY CHECK
    if (!response?.data?.token) {
      toast.error("Invalid response from server");
      return;
    }

    toast.success("Login successful 🎉");

    // ✅ CORRECT DATA
    localStorage.setItem("clientToken", response.data.token);
    localStorage.setItem("clientInfo", JSON.stringify(response.data.client));
    localStorage.setItem("tenant_db", response.data.client.tenant_db);

    navigate("/", { replace: true });

  } catch (error) {
    const msg = error?.response?.data?.message || "Login failed ❌";
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={styles.container}>
      <div style={styles.bgText}>MSP</div>

      <form style={styles.card} onSubmit={handleLogin}>
        <h2 style={styles.title}>MSP Login</h2>

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button} disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a", // dark premium bg
    overflow: "hidden",
  },

  /* 🔥 3D BMS Text */
  bgText: {
    position: "absolute",
    fontSize: "306px",
    fontWeight: "900",
    letterSpacing: "20px",
    color: "rgba(255,255,255,0.05)",
    transform: "rotateX(25deg) rotateY(-15deg)",
    textShadow: `
      0 20px 40px rgba(0,0,0,0.6),
      0 10px 20px rgba(238, 29, 29, 0.4)
    `,
    userSelect: "none",
    zIndex: 1,
  },

  card: {
    width: "340px",
    padding: "30px",
    // background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    borderRadius: "14px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    textAlign: "center",
    zIndex: 2,
  },

  title: {
    marginBottom: "20px",
    color: "#fff",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#ff6a00",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  message: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};

export default Login;
