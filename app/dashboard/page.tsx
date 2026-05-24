"use client";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Building2, Wrench, Bell, Receipt, LogOut, CheckCircle2, Users } from "lucide-react";
import { LogoIcon } from "@/components/ui/logo-icon";
import PropertiesTab from "@/components/PropertiesTab";
import TicketsTab from "@/components/TicketsTab";
import ExpensesTab from "@/components/ExpensesTab";
import RecurringTab from "@/components/RecurringTab";
import TenantNotifications from "@/components/TenantNotifications";
import Link from "next/link";

type Tab = "overview" | "tickets" | "recurring" | "expenses";

function getGreeting() {
  const h = new Date().getHours();
  const tod = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const puns = [
    "Hope your Sunday isn't too draining! 🪠",
    "New week — time to nail the to-do list! 🔨",
    "Let's fix what matters today! 🔧",
    "Mid-week already? No leaks in your schedule! 💧",
    "Almost the weekend — don't let anything crack! 🪟",
    "TGIF! Your properties are absolutely nailing it. 🏠",
    "Weekend mode — unless a tenant calls… 😅",
  ];
  return { tod, pun: puns[new Date().getDay()] };
}

function ActionRow({ dot, onClick, children }: { dot: "red" | "amber" | "blue"; onClick?: () => void; children: React.ReactNode }) {
  const colors = { red: "bg-red-500", amber: "bg-amber-500", blue: "bg-blue-500" };
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 text-sm py-1.5 px-1 rounded-lg ${onClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${colors[dot]}`} />
      <span className="flex-1">{children}</span>
      {onClick && <span className="text-muted-foreground text-xs">→</span>}
    </div>
  );
}

export default function Dashboard() {
  const { properties, tickets, recurringTasks, expenses, tenantMessages } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const openTickets = tickets.filter(t => t.status !== "resolved").length;
  const overdueTasks = recurringTasks.filter(t => new Date(t.nextDueAt) < now).length;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, e) => sum + e.amount, 0);
  const totalUnits = properties.reduce((s, p) => s + p.units.length, 0);
  const totalTenants = properties.reduce((s, p) => s + p.units.filter(u => u.tenantName).length, 0);
  const highPriorityTickets = tickets.filter(t => t.status !== "resolved" && t.priority === "high");
  const unreadMaintenance = tenantMessages.filter(m => !m.read && m.isMaintenanceRelated);
  const notifCount = highPriorityTickets.length + (overdueTasks > 0 ? 1 : 0) + unreadMaintenance.length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "tickets", label: "Tickets", icon: Wrench },
    { id: "recurring", label: "Recurring", icon: Bell },
    { id: "expenses", label: "Expenses", icon: Receipt },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Abstract background — Apple-style soft blue wave */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1749877217773-6c844c38c874?w=2400&q=90&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover object-center saturate-[70%]"
        />
        {/* White veil — keeps background ambient while letting blue accents show */}
        <div className="absolute inset-0 bg-white/35" />
      </div>
      {/* Topbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/40 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-7 h-7" />
            <span className="font-heading font-bold text-lg">PropKeep</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>

              {/* Dropdown panel */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notifications</p>
                  </div>
                  <div className="p-2 space-y-0.5 max-h-80 overflow-y-auto">
                    {notifCount === 0 ? (
                      <div className="flex items-center gap-2.5 py-3 px-1 text-sm text-green-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        All caught up — no urgent items.
                      </div>
                    ) : (
                      <>
                        {highPriorityTickets.map(t => (
                          <ActionRow key={t.id} dot="red" onClick={() => { setActiveTab("tickets"); setNotifOpen(false); }}>
                            <span className="font-medium">{t.title}</span>
                            <span className="text-muted-foreground"> · High priority</span>
                          </ActionRow>
                        ))}
                        {overdueTasks > 0 && (
                          <ActionRow dot="amber" onClick={() => { setActiveTab("recurring"); setNotifOpen(false); }}>
                            {overdueTasks} recurring task{overdueTasks > 1 ? "s" : ""} overdue
                          </ActionRow>
                        )}
                        {unreadMaintenance.map(m => (
                          <ActionRow key={m.id} dot="blue">
                            <span className="font-medium">{m.tenantName}:</span>
                            <span className="text-muted-foreground"> &ldquo;{m.body.slice(0, 55)}&hellip;&rdquo;</span>
                          </ActionRow>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
              Exit
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 pb-32">
        {/* Greeting */}
        {(() => {
          const { tod, pun } = getGreeting();
          return (
            <div className="mb-6">
              <h1 className="text-3xl font-heading font-bold">
                <span className="bg-gradient-to-r from-[hsl(220,62%,32%)] to-[hsl(195,56%,44%)] bg-clip-text text-transparent">{tod}, Tash!</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{pun}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                {properties.length > 0 && ` · ${properties.length} ${properties.length === 1 ? "property" : "properties"}, ${totalUnits} ${totalUnits === 1 ? "unit" : "units"}`}
              </p>
            </div>
          );
        })()}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tenants",       value: totalTenants,                        sub: `${totalUnits} total units`,                                                       icon: Users,     gradient: true,  gradientFrom: "hsl(185,54%,28%)", gradientTo: "hsl(197,52%,40%)", iconBg: "bg-white/20", iconColor: "text-white",   valueColor: "text-white" },
            { label: "Open Tickets",  value: openTickets,                         sub: `${tickets.filter(t => t.status === "in-progress").length} in progress`,           icon: Wrench,    gradient: true,  gradientFrom: "hsl(215,58%,28%)", gradientTo: "hsl(222,52%,40%)", iconBg: "bg-white/20", iconColor: "text-white",   valueColor: "text-white" },
            { label: "Overdue Tasks", value: overdueTasks,                        sub: `${recurringTasks.length} total tasks`,                                             icon: Bell,      gradient: true,  gradientFrom: "hsl(197,52%,32%)", gradientTo: "hsl(210,52%,44%)", iconBg: "bg-white/20", iconColor: "text-white",   valueColor: "text-white" },
            { label: "This Month",    value: `$${monthExpenses.toLocaleString()}`, sub: `$${totalExpenses.toLocaleString()} all time`,                                    icon: Receipt,   gradient: true,  gradientFrom: "hsl(232,44%,32%)", gradientTo: "hsl(243,40%,46%)", iconBg: "bg-white/20", iconColor: "text-white",   valueColor: "text-white" },
          ].map(stat => (
            <div
              key={stat.label}
              className={`rounded-3xl p-4 shadow-soft relative overflow-hidden ${stat.gradient ? "" : "bg-white border border-[hsl(var(--border))]"}`}
              style={stat.gradient ? { background: `radial-gradient(ellipse at 78% 18%, rgba(255,255,255,0.22) 0%, transparent 52%), radial-gradient(ellipse at 12% 80%, rgba(255,255,255,0.13) 0%, transparent 44%), radial-gradient(ellipse at 55% 55%, rgba(255,255,255,0.07) 0%, transparent 38%), linear-gradient(135deg, ${stat.gradientFrom} 0%, ${stat.gradientTo} 100%)` } : undefined}
            >
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-medium ${stat.gradient ? "text-white/75" : "text-muted-foreground"}`}>{stat.label}</p>
                <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <p className={`text-2xl font-heading font-bold ${stat.valueColor}`}>{stat.value}</p>
              <p className={`text-xs mt-0.5 ${stat.gradient ? "text-white/70" : "text-muted-foreground"}`}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Onboarding empty state */}
        {properties.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-blue-200 p-12 text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-xl font-bold mb-2">Add your first property to get started</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
              Once you add a property, you can track tickets, log expenses, and set recurring maintenance reminders.
            </p>
            <button
              onClick={() => setActiveTab("overview")}
              className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add a property
            </button>
          </div>
        )}

        {/* Tab navigation — straddles container top: 40% above, 60% inside */}
        <div className="flex justify-center relative z-10 -mb-[26px] py-2">
          <div className="flex gap-1 bg-gradient-to-b from-white/90 to-white/65 backdrop-blur-md rounded-2xl p-1 border border-b-0 border-white/70 w-fit shadow-soft">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-0 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-primary shadow-[0_2px_8px_rgba(28,75,140,0.14),0_1px_2px_rgba(28,75,140,0.10),inset_0_1px_0_rgba(255,255,255,0.90)] ring-1 ring-primary/15"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/40 hover:shadow-[0_1px_3px_rgba(28,75,140,0.06)]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content container */}
        <div className="bg-white/75 backdrop-blur-md rounded-[56px] border border-white/50 px-6 pb-6 pt-10 shadow-soft relative">
          {activeTab === "overview" && <PropertiesTab />}
          {activeTab === "tickets" && <TicketsTab />}
          {activeTab === "recurring" && <RecurringTab />}
          {activeTab === "expenses" && <ExpensesTab />}
        </div>
      </main>

      {/* Floating tenant notification launcher — rendered outside <main> so it overlays everything */}
      <TenantNotifications />
    </div>
  );
}
