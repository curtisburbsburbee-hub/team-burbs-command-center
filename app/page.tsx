"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";

type Action = {
  id: string;
  title: string;
  description: string | null;
  owner: string | null;
  state: string;
  priority: string | null;
  due_at: string | null;
  completed_at: string | null;
  updated_at: string | null;
  created_at: string | null;
};

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [actions, setActions] = useState<Action[]>([]);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
  const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? "");

      const { data, error } = await supabase
        .from("actions")
        .select(
          "id,title,description,owner,state,priority,due_at,completed_at,updated_at,created_at"
        )
        .order("updated_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
        return;
      }

      setActions((data ?? []) as Action[]);
      setLoading(false);
    };

  useEffect(() => {
  const supabase = createClient();

  async function initialLoad() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    setEmail(user.email ?? "");

    const { data, error } = await supabase
      .from("actions")
      .select(
        "id,title,description,owner,state,priority,due_at,completed_at,updated_at,created_at"
      )
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setActions((data ?? []) as Action[]);
    setLoading(false);
  }

  initialLoad();
}, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const activeActions = actions.filter(
    (action) => action.state === "ACTION"
  );

  const waitingActions = actions.filter(
    (action) =>
      action.state === "WAITING" ||
      action.state === "WATCHING"
  );

  const completedActions = actions
    .filter((action) => action.state === "COMPLETE")
    .slice(0, 10);

  const now = new Date();

  const doNowActions = activeActions
    .filter((action) => {
      const priority =
        action.priority?.toUpperCase() ?? "NORMAL";

      const isHighPriority =
        priority === "HIGH" ||
        priority === "CRITICAL";

      const isDue =
        action.due_at &&
        new Date(action.due_at).getTime() <=
          endOfToday().getTime();

      return isHighPriority || isDue;
    })
    .sort(sortActions);

  const otherActiveActions = activeActions
    .filter(
      (action) =>
        !doNowActions.some(
          (doNow) => doNow.id === action.id
        )
    )
    .sort(sortActions);

  if (loading) {
    return (
      <main style={loadingStyle}>
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

        {error && (
          <div
            style={{
              background: "#fff1f1",
              border: "1px solid #f0caca",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            Could not load actions: {error}
          </div>
        )}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <StatCard
            label="Do Now"
            value={doNowActions.length}
          />

          <StatCard
            label="Active"
            value={activeActions.length}
          />

          <StatCard
            label="Waiting / Watching"
            value={waitingActions.length}
          />

          <StatCard
            label="Completed"
            value={
              actions.filter(
                (action) => action.state === "COMPLETE"
              ).length
            }
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            alignItems: "start",
          }}
        >
          <DashboardColumn
            title="Do Now"
            subtitle="Urgent, overdue and high-priority work"
            actions={doNowActions}
            emptyText="Nothing urgent right now"
            now={now}
            onActionUpdated={loadDashboard}
          />

          <DashboardColumn
            title="Active Work"
            subtitle="Other active work requiring attention"
            actions={otherActiveActions}
            emptyText="No additional active work"
            now={now}
            onActionUpdated={loadDashboard}
          />

          <DashboardColumn
            title="Waiting / Watching"
            subtitle="Waiting on someone else or being monitored"
            actions={waitingActions}
            emptyText="Nothing currently waiting"
            now={now}
            onActionUpdated={loadDashboard}
          />

          <DashboardColumn
            title="Recently Completed"
            subtitle="Work recently closed by the Command Center"
            actions={completedActions}
            emptyText="No completed work yet"
            now={now}
            onActionUpdated={loadDashboard}
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
  value: number;
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
  actions,
  emptyText,
  now,
  onActionUpdated,
}: {
  title: string;
  subtitle: string;
  actions: Action[];
  emptyText: string;
  now: Date;
  onActionUpdated: () => void;
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
          marginBottom: "20px",
        }}
      >
        {subtitle}
      </p>

      {actions.length === 0 ? (
        <div
          style={{
            padding: "24px",
            border: "1px dashed #cdd3d8",
            borderRadius: "10px",
            textAlign: "center",
            color: "#89939c",
            fontSize: "14px",
          }}
        >
          {emptyText}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {actions.map((action) => (
           <ActionCard
  key={action.id}
  action={action}
  now={now}
  onActionUpdated={onActionUpdated}
/>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionCard({
  action,
  now,
  onActionUpdated,
}: {
  action: Action;
  now: Date;
  onActionUpdated: () => void;
}) {
const completeAction = async () => {
  const supabase = createClient();

  const { error } = await supabase
    .from("actions")
    .update({
      state: "COMPLETE",
      completed_at: new Date().toISOString(),
    })
    .eq("id", action.id);

  if (error) {
    console.error("Failed to complete action:", error);
    alert("Could not complete this action.");
    return;
  }

  onActionUpdated();
};
  
  const priority =
    action.priority?.toUpperCase() ?? "NORMAL";

  const dueDate = action.due_at
    ? new Date(action.due_at)
    : null;

  const overdue =
    dueDate &&
    dueDate.getTime() < now.getTime() &&
    action.state !== "COMPLETE";

  return (
    <div
      style={{
        border: overdue
          ? "2px solid #b42318"
          : "1px solid #e1e5e8",
        borderRadius: "12px",
        padding: "16px",
        background: overdue ? "#fff7f6" : "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "15px",
            lineHeight: 1.35,
          }}
        >
          {action.title}
        </div>

        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            border: "1px solid #d6dce1",
            borderRadius: "999px",
            padding: "4px 7px",
            whiteSpace: "nowrap",
          }}
        >
          {priority}
        </span>
      </div>

      {action.description && (
        <div
          style={{
            fontSize: "13px",
            lineHeight: 1.5,
            color: "#56616b",
            marginBottom: "12px",
          }}
        >
          {action.description}
        </div>
      )}

            <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 14px",
          fontSize: "11px",
          color: "#737e87",
        }}
      >
        <span>
          Owner: {action.owner || "Unassigned"}
        </span>

        <span>State: {action.state}</span>

        {dueDate && (
          <span
            style={{
              fontWeight: overdue ? 700 : 400,
              color: overdue ? "#b42318" : "#737e87",
            }}
          >
            {overdue ? "OVERDUE: " : "Due: "}
            {formatDate(dueDate)}
          </span>
        )}
      </div>

      {action.state !== "COMPLETE" && (
        <div
          style={{
            marginTop: "14px",
            paddingTop: "12px",
            borderTop: "1px solid #eef1f3",
          }}
        >
          <button
            onClick={completeAction}
            style={{
              border: "1px solid #cfd6dc",
              borderRadius: "8px",
              background: "#ffffff",
              padding: "7px 12px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✓ Complete
          </button>
        </div>
      )}
    </div>
  );
}
function endOfToday() {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

function sortActions(a: Action, b: Action) {
  const priorityRank: Record<string, number> = {
    CRITICAL: 4,
    HIGH: 3,
    NORMAL: 2,
    LOW: 1,
  };

  const aPriority =
    priorityRank[a.priority?.toUpperCase() ?? "NORMAL"] ??
    2;

  const bPriority =
    priorityRank[b.priority?.toUpperCase() ?? "NORMAL"] ??
    2;

  if (aPriority !== bPriority) {
    return bPriority - aPriority;
  }

  if (a.due_at && b.due_at) {
    return (
      new Date(a.due_at).getTime() -
      new Date(b.due_at).getTime()
    );
  }

  if (a.due_at) return -1;
  if (b.due_at) return 1;

  return 0;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const loadingStyle = {
  minHeight: "100vh",
  background: "#f4f6f8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial, sans-serif",
  color: "#68737d",
};
