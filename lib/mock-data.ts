export type Property = {
  id: string;
  name: string;
  address: string;
  type: "single-family" | "multi-unit" | "condo";
  photoUrl: string | null;
  units: Unit[];
};

export type Unit = {
  id: string;
  propertyId: string;
  unitNumber: string;
  tenantName: string;
  tenantEmail: string;
  rentAmount: number;
};

export type Appliance = {
  id: string;
  unitId: string;
  propertyId: string;
  name: string;        // e.g. "Fridge", "Oven", "Router"
  brand: string;
  model: string;
  modelNumber: string;
  notes: string;
};

export type Ticket = {
  id: string;
  propertyId: string;
  unitId: string | null;
  applianceId: string | null;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  category: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "other";
  cost: number | null;
  imageUrl: string | null;
  createdAt: string;
  resolvedAt: string | null;
  bookingProviderId: string | null;
  bookingPlatform: "TaskRabbit" | "Thumbtack" | "Angi" | null;
  bookingConfirmedAt: string | null;
};

export type RecurringTask = {
  id: string;
  propertyId: string;
  title: string;
  intervalDays: number;
  lastCompletedAt: string | null;
  nextDueAt: string;
  category: Ticket["category"];
  bookingProviderId: string | null;
  bookingPlatform: "TaskRabbit" | "Thumbtack" | "Angi" | null;
  bookingConfirmedAt: string | null;
};

export type Expense = {
  id: string;
  propertyId: string;
  ticketId: string | null;
  description: string;
  amount: number;
  category: "repair" | "maintenance" | "improvement" | "supply" | "other";
  date: string;
};

export type TenantMessage = {
  id: string;
  unitId: string;
  propertyId: string;
  tenantName: string;
  body: string;
  imageUrl: string | null;
  receivedAt: string;
  isMaintenanceRelated: boolean;
  read: boolean;
  suggestedTitle: string;
  suggestedCategory: Ticket["category"];
  suggestedPriority: Ticket["priority"];
};

// ─── Service providers ────────────────────────────────────────────────────────

export type ServiceProvider = {
  id: string;
  name: string;
  platform: "TaskRabbit" | "Thumbtack" | "Angi";
  specialty: string;
  categories: Ticket["category"][];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  responseTime: string;
  avatarInitials: string;
  avatarColor: string;  // Tailwind bg class
};

export const mockProviders: ServiceProvider[] = [
  { id: "sp1", name: "Randy K.", platform: "TaskRabbit", specialty: "Plumbing & Water Damage", categories: ["plumbing"], rating: 4.9, reviewCount: 312, hourlyRate: 85, responseTime: "Within 2 hours", avatarInitials: "RK", avatarColor: "bg-blue-500" },
  { id: "sp2", name: "Marco T.", platform: "Thumbtack", specialty: "HVAC & Climate Systems", categories: ["hvac"], rating: 4.8, reviewCount: 178, hourlyRate: 95, responseTime: "Within 3 hours", avatarInitials: "MT", avatarColor: "bg-orange-500" },
  { id: "sp3", name: "Sarah M.", platform: "Angi", specialty: "Licensed Electrician", categories: ["electrical"], rating: 4.9, reviewCount: 245, hourlyRate: 90, responseTime: "Within 2 hours", avatarInitials: "SM", avatarColor: "bg-yellow-500" },
  { id: "sp4", name: "Dave L.", platform: "TaskRabbit", specialty: "Appliance Repair Specialist", categories: ["appliance"], rating: 4.7, reviewCount: 421, hourlyRate: 75, responseTime: "Same day", avatarInitials: "DL", avatarColor: "bg-green-500" },
  { id: "sp5", name: "Tom W.", platform: "Thumbtack", specialty: "General Contractor", categories: ["structural"], rating: 4.8, reviewCount: 156, hourlyRate: 80, responseTime: "Within 4 hours", avatarInitials: "TW", avatarColor: "bg-stone-500" },
  { id: "sp6", name: "Alex B.", platform: "TaskRabbit", specialty: "Handyman Pro", categories: ["other", "plumbing", "electrical"], rating: 4.6, reviewCount: 534, hourlyRate: 65, responseTime: "Within 1 hour", avatarInitials: "AB", avatarColor: "bg-violet-500" },
];

export function matchProvider(category: Ticket["category"]): ServiceProvider {
  return mockProviders.find(p => p.categories.includes(category)) ?? mockProviders[5]; // fallback: Alex B.
}

// ─── Keyword-based maintenance detection ─────────────────────────────────────

type DetectResult = {
  isMaintenance: boolean;
  category: Ticket["category"];
  priority: Ticket["priority"];
  title: string;
};

export function detectMaintenance(text: string): DetectResult {
  const t = text.toLowerCase();

  const urgentWords = ["no heat", "no hot water", "flooding", "flood", "gas leak", "gas smell", "smoke", "fire", "no power", "no electricity"];
  const isUrgent = urgentWords.some(w => t.includes(w));

  if (/leak|drip|dripping|pipe|faucet|water damage|flood/.test(t)) {
    return { isMaintenance: true, category: "plumbing", priority: isUrgent ? "high" : "medium", title: "Plumbing issue reported by tenant" };
  }
  if (/heat|hvac|furnace|cooling|ac|air condition|thermostat|vent/.test(t)) {
    return { isMaintenance: true, category: "hvac", priority: isUrgent || t.includes("no heat") || t.includes("freezing") ? "high" : "medium", title: "HVAC issue reported by tenant" };
  }
  if (/outlet|electric|light|flickering|breaker|wiring|fan|switch/.test(t)) {
    return { isMaintenance: true, category: "electrical", priority: isUrgent ? "high" : "medium", title: "Electrical issue reported by tenant" };
  }
  if (/fridge|refrigerator|oven|stove|dishwasher|washer|dryer|microwave|disposal|appliance/.test(t)) {
    return { isMaintenance: true, category: "appliance", priority: isUrgent ? "high" : "medium", title: "Appliance issue reported by tenant" };
  }
  if (/door|window|roof|ceiling|wall|floor|crack|mold|pest|bug|rodent/.test(t)) {
    return { isMaintenance: true, category: "structural", priority: isUrgent ? "high" : "medium", title: "Structural issue reported by tenant" };
  }

  return { isMaintenance: false, category: "other", priority: "low", title: "" };
}

// ─── Default / seed data ──────────────────────────────────────────────────────

function msg(
  id: string, unitId: string, propertyId: string, tenantName: string,
  body: string, imageUrl: string | null, receivedAt: string
): TenantMessage {
  const detected = detectMaintenance(body);
  return {
    id, unitId, propertyId, tenantName, body, imageUrl, receivedAt,
    isMaintenanceRelated: detected.isMaintenance,
    read: false,
    suggestedTitle: detected.title,
    suggestedCategory: detected.category,
    suggestedPriority: detected.priority,
  };
}

export const defaultData = {
  properties: [
    {
      id: "p1",
      name: "Speedway Duplex",
      address: "3814 Speedway, Austin, TX 78751",
      type: "multi-unit" as const,
      photoUrl: "/streetview/p1.jpg",
      units: [
        { id: "u1", propertyId: "p1", unitNumber: "Unit A", tenantName: "Sarah Johnson", tenantEmail: "sarah@email.com", rentAmount: 1400 },
        { id: "u2", propertyId: "p1", unitNumber: "Unit B", tenantName: "Marcus Lee", tenantEmail: "marcus@email.com", rentAmount: 1350 },
      ],
    },
    {
      id: "p2",
      name: "Sunshine Dr Rental",
      address: "5204 Sunshine Dr, Austin, TX 78756",
      type: "single-family" as const,
      photoUrl: "/streetview/p2.jpg",
      units: [
        { id: "u3", propertyId: "p2", unitNumber: "Main", tenantName: "Emily Chen", tenantEmail: "emily@email.com", rentAmount: 2100 },
      ],
    },
  ] as Property[],

  tickets: [
    { id: "t1", propertyId: "p1", unitId: "u1", applianceId: null, title: "Leaking kitchen faucet", description: "Dripping steadily, wasting water", status: "open" as const, priority: "medium" as const, category: "plumbing" as const, cost: null, imageUrl: null, createdAt: "2026-03-01T10:00:00Z", resolvedAt: null, bookingProviderId: null, bookingPlatform: null, bookingConfirmedAt: null },
    { id: "t2", propertyId: "p1", unitId: "u2", applianceId: "a2", title: "HVAC not cooling", description: "Unit says 72° but feels like 80°", status: "in-progress" as const, priority: "high" as const, category: "hvac" as const, cost: null, imageUrl: null, createdAt: "2026-02-28T14:00:00Z", resolvedAt: null, bookingProviderId: null, bookingPlatform: null, bookingConfirmedAt: null },
    { id: "t3", propertyId: "p2", unitId: "u3", applianceId: "a3", title: "Broken garbage disposal", description: "Humming but not spinning", status: "resolved" as const, priority: "low" as const, category: "appliance" as const, cost: 180, imageUrl: null, createdAt: "2026-02-15T09:00:00Z", resolvedAt: "2026-02-18T12:00:00Z", bookingProviderId: null, bookingPlatform: null, bookingConfirmedAt: null },
    { id: "t4", propertyId: "p1", unitId: "u1", applianceId: null, title: "Bathroom light flickering", description: "Started after the rain last week", status: "open" as const, priority: "medium" as const, category: "electrical" as const, cost: null, imageUrl: null, createdAt: "2026-03-05T08:00:00Z", resolvedAt: null, bookingProviderId: null, bookingPlatform: null, bookingConfirmedAt: null },
  ] as Ticket[],

  recurringTasks: [
    { id: "r1", propertyId: "p1", title: "Replace HVAC filters", intervalDays: 90, lastCompletedAt: "2025-12-01T00:00:00Z", nextDueAt: "2026-03-01T00:00:00Z", category: "hvac" as const, bookingProviderId: null, bookingPlatform: null, bookingConfirmedAt: null },
    { id: "r2", propertyId: "p1", title: "Test smoke detectors", intervalDays: 180, lastCompletedAt: "2025-09-01T00:00:00Z", nextDueAt: "2026-03-01T00:00:00Z", category: "other" as const, bookingProviderId: null, bookingPlatform: null, bookingConfirmedAt: null },
    { id: "r3", propertyId: "p2", title: "Gutter cleaning", intervalDays: 180, lastCompletedAt: "2026-01-15T00:00:00Z", nextDueAt: "2026-07-15T00:00:00Z", category: "structural" as const, bookingProviderId: null, bookingPlatform: null, bookingConfirmedAt: null },
    { id: "r4", propertyId: "p2", title: "Replace HVAC filters", intervalDays: 90, lastCompletedAt: "2026-01-10T00:00:00Z", nextDueAt: "2026-04-10T00:00:00Z", category: "hvac" as const, bookingProviderId: null, bookingPlatform: null, bookingConfirmedAt: null },
  ] as RecurringTask[],

  appliances: [
    { id: "a1", unitId: "u1", propertyId: "p1", name: "Fridge", brand: "Samsung", model: "RF28R7351SR", modelNumber: "SN-4829301", notes: "Installed Jan 2022" },
    { id: "a2", unitId: "u2", propertyId: "p1", name: "HVAC Unit", brand: "Carrier", model: "24ACC636A003", modelNumber: "SN-7761204", notes: "Last serviced Feb 2025" },
    { id: "a3", unitId: "u3", propertyId: "p2", name: "Garbage Disposal", brand: "InSinkErator", model: "Badger 5", modelNumber: "SN-0039271", notes: "Replaced Feb 2026" },
    { id: "a4", unitId: "u3", propertyId: "p2", name: "Router", brand: "TP-Link", model: "Archer AX21", modelNumber: "SN-5512873", notes: "Landlord supplied, rack in utility closet" },
    { id: "a5", unitId: "u1", propertyId: "p1", name: "Oven", brand: "GE", model: "JB735SPSS", modelNumber: "SN-2200541", notes: "" },
  ] as Appliance[],

  expenses: [
    { id: "e1", propertyId: "p1", ticketId: null, description: "Plumber visit - pipe inspection", amount: 250, category: "maintenance" as const, date: "2026-02-10" },
    { id: "e2", propertyId: "p2", ticketId: "t3", description: "Garbage disposal replacement", amount: 180, category: "repair" as const, date: "2026-02-18" },
    { id: "e3", propertyId: "p1", ticketId: null, description: "HVAC service call", amount: 320, category: "maintenance" as const, date: "2026-03-02" },
    { id: "e4", propertyId: "p2", ticketId: null, description: "Exterior paint touch-up", amount: 600, category: "improvement" as const, date: "2026-01-20" },
  ] as Expense[],

  tenantMessages: [
    msg("m1", "u1", "p1", "Sarah Johnson",
      "Hey, the kitchen faucet is dripping really bad, can someone come fix it? It's been going for 2 days now.",
      "https://images.unsplash.com/photo-1697374981215-ce207e5ab8c0?w=600&q=80&auto=format&fit=crop",
      "2026-03-09T08:15:00Z"),
    msg("m2", "u2", "p1", "Marcus Lee",
      "The heat stopped working last night, it's freezing in here. No heat at all.",
      null,
      "2026-03-09T06:45:00Z"),
    msg("m3", "u1", "p1", "Sarah Johnson",
      "Hi, just wanted to confirm — is rent still due this Friday or has that changed?",
      null,
      "2026-03-08T14:30:00Z"),
    msg("m4", "u2", "p1", "Marcus Lee",
      "The bathroom exhaust fan is making a loud grinding noise every time I turn it on. Sending a pic.",
      "https://images.unsplash.com/photo-1572081790780-1a7739896259?w=600&q=80&auto=format&fit=crop",
      "2026-03-08T11:00:00Z"),
    msg("m5", "u3", "p2", "Emily Chen",
      "Fridge is leaking water onto the floor. I put towels down but it's getting worse.",
      "https://images.unsplash.com/photo-1722649939430-9f615b049e7c?w=600&q=80&auto=format&fit=crop",
      "2026-03-07T19:20:00Z"),
    msg("m6", "u3", "p2", "Emily Chen",
      "One of the bedroom outlets stopped working completely. Nothing turns on when I plug into it.",
      null,
      "2026-03-07T10:05:00Z"),
  ] as TenantMessage[],
};
