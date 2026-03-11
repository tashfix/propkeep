"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { defaultData, Property, Unit, Ticket, RecurringTask, Expense, Appliance, TenantMessage, ServiceProvider } from "./mock-data";

type Store = {
  properties: Property[];
  tickets: Ticket[];
  recurringTasks: RecurringTask[];
  expenses: Expense[];
  appliances: Appliance[];
  tenantMessages: TenantMessage[];

  addProperty: (p: Omit<Property, "id" | "units">) => void;
  deleteProperty: (id: string) => void;
  addUnit: (propertyId: string, u: Omit<Unit, "id" | "propertyId">) => void;
  deleteUnit: (propertyId: string, unitId: string) => void;

  addTicket: (t: Omit<Ticket, "id" | "createdAt" | "resolvedAt">) => void;
  updateTicketStatus: (id: string, status: Ticket["status"], cost?: number) => void;
  deleteTicket: (id: string) => void;

  addRecurringTask: (t: Omit<RecurringTask, "id" | "lastCompletedAt" | "nextDueAt">) => void;
  completeTask: (id: string) => void;
  deleteRecurringTask: (id: string) => void;

  addExpense: (e: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;

  addAppliance: (a: Omit<Appliance, "id">) => void;
  deleteAppliance: (id: string) => void;

  markMessageRead: (id: string) => void;
  dismissMessage: (id: string) => void;

  attachBooking: (ticketId: string, providerId: string, platform: ServiceProvider["platform"]) => void;
  attachRecurringBooking: (taskId: string, providerId: string, platform: ServiceProvider["platform"]) => void;
};

const DATA_VERSION = "v3";

const StoreContext = createContext<Store | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [tenantMessages, setTenantMessages] = useState<TenantMessage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedVersion = localStorage.getItem("propkeep_version");
      const saved = localStorage.getItem("propkeep");
      if (saved && savedVersion === DATA_VERSION) {
        const parsed = JSON.parse(saved);
        setProperties(parsed.properties ?? defaultData.properties);
        setTickets(parsed.tickets ?? defaultData.tickets);
        setRecurringTasks(parsed.recurringTasks ?? defaultData.recurringTasks);
        setExpenses(parsed.expenses ?? defaultData.expenses);
        setAppliances(parsed.appliances ?? defaultData.appliances);
        setTenantMessages(parsed.tenantMessages ?? defaultData.tenantMessages);
      } else {
        setProperties(defaultData.properties);
        setTickets(defaultData.tickets);
        setRecurringTasks(defaultData.recurringTasks);
        setExpenses(defaultData.expenses);
        setAppliances(defaultData.appliances);
        setTenantMessages(defaultData.tenantMessages);
      }
    } catch {
      setProperties(defaultData.properties);
      setTickets(defaultData.tickets);
      setRecurringTasks(defaultData.recurringTasks);
      setExpenses(defaultData.expenses);
      setAppliances(defaultData.appliances);
      setTenantMessages(defaultData.tenantMessages);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("propkeep", JSON.stringify({ properties, tickets, recurringTasks, expenses, appliances, tenantMessages }));
    localStorage.setItem("propkeep_version", DATA_VERSION);
  }, [properties, tickets, recurringTasks, expenses, appliances, tenantMessages, loaded]);

  const store: Store = {
    properties, tickets, recurringTasks, expenses, appliances, tenantMessages,

    addProperty: (p) =>
      setProperties((prev) => [...prev, { ...p, id: uid(), units: [] }]),
    deleteProperty: (id) => {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setTickets((prev) => prev.filter((t) => t.propertyId !== id));
      setRecurringTasks((prev) => prev.filter((t) => t.propertyId !== id));
      setExpenses((prev) => prev.filter((e) => e.propertyId !== id));
      setAppliances((prev) => prev.filter((a) => a.propertyId !== id));
    },

    addUnit: (propertyId, u) =>
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? { ...p, units: [...p.units, { ...u, id: uid(), propertyId }] }
            : p
        )
      ),
    deleteUnit: (propertyId, unitId) => {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, units: p.units.filter((u) => u.id !== unitId) } : p
        )
      );
      setAppliances((prev) => prev.filter((a) => a.unitId !== unitId));
    },

    addTicket: (t) =>
      setTickets((prev) => [
        ...prev,
        { ...t, id: uid(), createdAt: new Date().toISOString(), resolvedAt: null },
      ]),
    updateTicketStatus: (id, status, cost) =>
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                resolvedAt: status === "resolved" ? new Date().toISOString() : t.resolvedAt,
                cost: cost !== undefined ? cost : t.cost,
              }
            : t
        )
      ),
    deleteTicket: (id) => setTickets((prev) => prev.filter((t) => t.id !== id)),

    addRecurringTask: (t) =>
      setRecurringTasks((prev) => [
        ...prev,
        {
          ...t,
          id: uid(),
          lastCompletedAt: null,
          nextDueAt: addDays(new Date(), t.intervalDays),
        },
      ]),
    completeTask: (id) =>
      setRecurringTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                lastCompletedAt: new Date().toISOString(),
                nextDueAt: addDays(new Date(), t.intervalDays),
                bookingProviderId: null,
                bookingPlatform: null,
                bookingConfirmedAt: null,
              }
            : t
        )
      ),
    deleteRecurringTask: (id) =>
      setRecurringTasks((prev) => prev.filter((t) => t.id !== id)),

    addExpense: (e) => setExpenses((prev) => [...prev, { ...e, id: uid() }]),
    deleteExpense: (id) => setExpenses((prev) => prev.filter((e) => e.id !== id)),

    addAppliance: (a) => setAppliances((prev) => [...prev, { ...a, id: uid() }]),
    deleteAppliance: (id) => setAppliances((prev) => prev.filter((a) => a.id !== id)),

    markMessageRead: (id) =>
      setTenantMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      ),
    dismissMessage: (id) =>
      setTenantMessages((prev) => prev.filter((m) => m.id !== id)),

    attachRecurringBooking: (taskId, providerId, platform) =>
      setRecurringTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                bookingProviderId: providerId,
                bookingPlatform: platform,
                bookingConfirmedAt: new Date().toISOString(),
              }
            : t
        )
      ),

    attachBooking: (ticketId, providerId, platform) =>
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status: "in-progress" as const,
                bookingProviderId: providerId,
                bookingPlatform: platform,
                bookingConfirmedAt: new Date().toISOString(),
              }
            : t
        )
      ),
  };

  if (!loaded) return null;
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
