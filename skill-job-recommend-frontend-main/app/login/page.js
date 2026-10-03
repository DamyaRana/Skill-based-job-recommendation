"use client";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    try {
      const endpoint = isLogin 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/register`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Success");
      } else {
        setMessage(data.error || "Failed");
      }
    } catch (err) {
      console.log(err);
      setMessage("Network error");
    }
  }

  return (
    <div style={{ padding: 50 }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={handleSubmit}>{isLogin ? "Login" : "Register"}</button>
      <br /><br />
      <a onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Register" : "Switch to Login"}
      </a>
      <br /><br />
      <p>{message}</p>
    </div>
  );
}
