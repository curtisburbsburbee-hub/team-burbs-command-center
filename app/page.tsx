"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? "");
      setLoading(false);
    }

    checkUser();
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f4f6f8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          color: "#68737d",
        }}
      >
        Loading Command Center...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        color: "#17202a",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "32px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                color: "#68737d",
                marginBottom: "8px",
              }}
            >
              TEAM BURBS | BOWDEN
            </div>

            <h1
              style={{
                fontSize: "36px",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Command Center
            </h1>

            <p
              style={{
                color: "#68737d",
                marginTop: "10px",
                marginBottom: 0,
              }}
            >
              Your real estate business — prioritized by AI.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e1e5e8",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "13px",
              }}
            >
              Signed in as {email}
            </div>

            <button
              onClick={handleSignOut}
              style={{
                background: "#17202a",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "12px 16px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <StatCard label="Do Now" value="—" />
          <StatCard label="Revenue Next" value="—" />
          <StatCard label="Waiting / Watching" value="—" />
          <StatCard label="Completed" value="—" />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          <DashboardColumn
            title="Do Now"
            subtitle="Urgent, overdue and high-priority work"
          />

          <DashboardColumn
            title="Revenue Next"
            subtitle="Leads and opportunities that move business forward"
          />

          <DashboardColumn
            title="Waiting / Watching"
            subtitle="Items waiting on someone else or being monitored"
          />

          <DashboardColumn
            title="Recently Completed"
            subtitle="Work the Command Center has closed"
          />
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e1e5e8",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <div
        style={{
          color: "#68737d",
          fontSize: "13px",
          fontWeight: 600,
          marginBottom: "8px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function DashboardColumn({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e1e5e8",
        borderRadius: "14px",
        minHeight: "300px",
        padding: "20px",
      }}
    >
      <h2
        style={{
          fontSize: "18px",
          marginTop: 0,
          marginBottom: "6px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#68737d",
          fontSize: "13px",
          marginTop: 0,
        }}
      >
        {subtitle}
      </p>

      <div
        style={{
          marginTop: "32px",
          padding: "24px",
          border: "1px dashed #cdd3d8",
          borderRadius: "10px",
          textAlign: "center",
          color: "#89939c",
          fontSize: "14px",
        }}
      >
        Live actions coming next
      </div>
    </div>
  );
}
