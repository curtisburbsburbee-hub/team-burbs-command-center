"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email or password is incorrect.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#17202a",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          border: "1px solid #e1e5e8",
          borderRadius: "16px",
          padding: "36px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            color: "#68737d",
            marginBottom: "10px",
          }}
        >
          TEAM BURBS | BOWDEN
        </div>

        <h1
          style={{
            fontSize: "30px",
            margin: "0 0 8px 0",
          }}
        >
          Command Center
        </h1>

        <p
          style={{
            color: "#68737d",
            marginTop: 0,
            marginBottom: "28px",
          }}
        >
          Sign in to access your business dashboard.
        </p>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "6px",
            }}
          >
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "18px",
              border: "1px solid #cfd6dc",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "6px",
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "18px",
              border: "1px solid #cfd6dc",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <div
              style={{
                background: "#fff1f1",
                border: "1px solid #f0caca",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "18px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "#17202a",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
