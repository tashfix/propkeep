"use client";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { RecurringTask, matchProvider, mockProviders, ServiceProvider } from "@/lib/mock-data";
import { Bell, Plus, Trash2, Check, CheckCircle, AlertTriangle, Sparkles, Star, CheckCircle2, ExternalLink, CalendarCheck, Droplets, Zap, Wind, Hammer, Package, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ─── Platform badge styles (mirrors TicketsTab) ───────────────────────────────

const platformStyles: Record<ServiceProvider["platform"], string> = {
  TaskRabbit: "bg-[#0D9B4E]/10 text-[#0D9B4E]",
  Thumbtack: "bg-blue-50 text-blue-700",
  Angi: "bg-orange-50 text-orange-700",
};

const categoryConfig: Record<RecurringTask["category"], React.ElementType> = {
  plumbing:   Droplets,
  electrical: Zap,
  hvac:       Wind,
  appliance:  Package,
  structural: Hammer,
  other:      Wrench,
};

// ─── Preferred-time helpers ───────────────────────────────────────────────────

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function subtractDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function preferredTimeOptions(nextDueAt: string) {
  return [
    { value: "on-due-date",    label: `On due date — ${fmtShort(nextDueAt)}` },
    { value: "2-days-before",  label: `2 days before — ${subtractDays(nextDueAt, 2)}` },
    { value: "1-week-before",  label: `1 week before — ${subtractDays(nextDueAt, 7)}` },
    { value: "asap",           label: "As soon as possible" },
  ];
}

// ─── RecurringServiceDialog ───────────────────────────────────────────────────

function RecurringServiceDialog({
  task,
  propertyAddress,
}: {
  task: RecurringTask;
  propertyAddress: string;
}) {
  const { attachRecurringBooking } = useStore();
  const isManageMode = !!task.bookingProviderId;
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"suggest" | "confirmed">(isManageMode ? "confirmed" : "suggest");
  const [form, setForm] = useState({
    issueSummary: task.title,
    preferredTime: "on-due-date",
    notes: "",
  });

  const isNewBooking = useRef(false);

  const provider = isManageMode
    ? (mockProviders.find(p => p.id === task.bookingProviderId) ?? matchProvider(task.category))
    : matchProvider(task.category);

  const timeOptions = preferredTimeOptions(task.nextDueAt);
  const taskRef = `#RT-${task.id.slice(-5).toUpperCase()}`;

  const handleOpen = (val: boolean) => {
    if (val) {
      setStep(task.bookingProviderId ? "confirmed" : "suggest");
    }
    setOpen(val);
    if (!val && isNewBooking.current) {
      attachRecurringBooking(task.id, provider.id, provider.platform);
      isNewBooking.current = false;
    }
  };

  const handleConfirm = () => {
    isNewBooking.current = true;
    setStep("confirmed");
  };

  const viewingManage = isManageMode && !isNewBooking.current;
  const bookedAt = task.bookingConfirmedAt ? fmtShort(task.bookingConfirmedAt) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors font-medium">
          {isManageMode ? (
            <><CalendarCheck className="w-3 h-3" />Manage Service Call</>
          ) : (
            <><Sparkles className="w-3 h-3" />Book a Pro</>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        {step === "suggest" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Suggested Service Provider
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-1">
              {/* Provider card */}
              <div className="rounded-xl border bg-gradient-to-br from-muted/40 to-muted/10 p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-full ${provider.avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {provider.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{provider.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${platformStyles[provider.platform]}`}>
                        {provider.platform}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{provider.specialty}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs">
                      <span className="flex items-center gap-0.5 font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {provider.rating} <span className="text-muted-foreground font-normal">({provider.reviewCount})</span>
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="font-medium">${provider.hourlyRate}/hr</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-green-600 font-medium">{provider.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-filled service request */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Service Request</p>

                <div className="space-y-1.5">
                  <Label className="text-xs">Task Summary</Label>
                  <Input
                    value={form.issueSummary}
                    onChange={e => setForm(f => ({ ...f, issueSummary: e.target.value }))}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Location</Label>
                  <div className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
                    {propertyAddress}
                  </div>
                </div>

                {/* Preferred time anchored to nextDueAt */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Preferred Time</Label>
                  <Select value={form.preferredTime} onValueChange={v => setForm(f => ({ ...f, preferredTime: v }))}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Additional Notes</Label>
                  <Textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="text-sm resize-none"
                    rows={2}
                    placeholder="Any extra details for the pro..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button className="flex-1 gap-1.5" onClick={handleConfirm}>
                  <ExternalLink className="w-3.5 h-3.5" />
                  Confirm Booking via {provider.platform}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </div>
          </>
        ) : (
          /* ─── Step 2: Confirmed / Manage ─── */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <div>
              {viewingManage ? (
                <>
                  <h3 className="font-heading text-lg font-semibold">Service Call Active</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Booked via <span className="font-medium text-foreground">{provider.platform}</span>
                    {bookedAt && <> on <span className="font-medium text-foreground">{bookedAt}</span></>}.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-heading text-lg font-semibold">Booking Submitted!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium text-foreground">{provider.name}</span> has been notified via {provider.platform}.
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Expected contact: <span className="font-medium text-foreground">{provider.responseTime.toLowerCase()}</span>
                  </p>
                </>
              )}
            </div>

            {/* Confirmation details */}
            <div className="bg-muted/60 rounded-xl px-4 py-3 text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <code className="font-mono font-semibold">{taskRef}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">{provider.name} · {provider.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate</span>
                <span className="font-medium">${provider.hourlyRate}/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Task</span>
                <span className="font-medium truncate ml-8 text-right">{task.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next service due</span>
                <span className="font-medium">{fmtShort(task.nextDueAt)}</span>
              </div>
            </div>

            <Button className="w-full" onClick={() => handleOpen(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Booking strip ────────────────────────────────────────────────────────────

function BookingStrip({ task }: { task: RecurringTask }) {
  if (!task.bookingProviderId) return null;
  const bookedPro = mockProviders.find(p => p.id === task.bookingProviderId);
  if (!bookedPro) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
      <span className="font-medium text-foreground">{bookedPro.name}</span>
      <span>·</span>
      <span>{task.bookingPlatform}</span>
      <span>·</span>
      <span className="font-mono text-[11px]">#RT-{task.id.slice(-5).toUpperCase()}</span>
    </div>
  );
}

// ─── Interval & category options ─────────────────────────────────────────────

const INTERVAL_OPTIONS = [
  { label: "Every 30 days", value: 30 },
  { label: "Every 90 days", value: 90 },
  { label: "Every 6 months", value: 180 },
  { label: "Every year", value: 365 },
];

const CATEGORY_OPTIONS = [
  { label: "Plumbing", value: "plumbing" },
  { label: "Electrical", value: "electrical" },
  { label: "HVAC", value: "hvac" },
  { label: "Appliance", value: "appliance" },
  { label: "Structural", value: "structural" },
  { label: "Other", value: "other" },
] as const;

// ─── Add Task Dialog ──────────────────────────────────────────────────────────

function AddTaskDialog() {
  const { properties, addRecurringTask } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    propertyId: "",
    intervalDays: 90,
    category: "other" as RecurringTask["category"],
  });

  const submit = () => {
    if (!form.title || !form.propertyId) return;
    addRecurringTask({
      title: form.title,
      propertyId: form.propertyId,
      intervalDays: form.intervalDays,
      category: form.category,
      bookingProviderId: null,
      bookingPlatform: null,
      bookingConfirmedAt: null,
    });
    setForm({ title: "", propertyId: "", intervalDays: 90, category: "other" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="w-4 h-4" />Add Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Recurring Task</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Task Name</Label>
            <Input placeholder="e.g. Replace HVAC filters" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Property</Label>
            <Select value={form.propertyId} onValueChange={v => setForm(f => ({ ...f, propertyId: v }))}>
              <SelectTrigger><SelectValue placeholder="Select property..." /></SelectTrigger>
              <SelectContent>
                {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Select value={String(form.intervalDays)} onValueChange={v => setForm(f => ({ ...f, intervalDays: parseInt(v) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INTERVAL_OPTIONS.map(o => <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as RecurringTask["category"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full" onClick={submit}>Save Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main tab ──────────────────────────────────────────────────────────────────

export default function RecurringTab() {
  const { recurringTasks, properties, completeTask, deleteRecurringTask } = useStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const now = new Date();
  const overdue = recurringTasks.filter(t => new Date(t.nextDueAt) < now);
  const upcoming = recurringTasks.filter(t => new Date(t.nextDueAt) >= now);
  const getProperty = (id: string) => properties.find(p => p.id === id);

  const daysUntil = (dateStr: string) =>
    Math.ceil((new Date(dateStr).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const daysAgo = (dateStr: string) =>
    Math.ceil((now.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold">Recurring Tasks</h2>
          <p className="text-sm text-muted-foreground">{recurringTasks.length} scheduled tasks</p>
        </div>
        <AddTaskDialog />
      </div>

      {overdue.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-blue-400" />
            <p className="font-semibold text-blue-700">{overdue.length} overdue task{overdue.length > 1 ? "s" : ""}</p>
          </div>
          <div className="space-y-2">
            {overdue.map(task => {
              const property = getProperty(task.propertyId);
              return (
                <div key={task.id} className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{property?.name ?? "Unknown"} · {daysAgo(task.nextDueAt)}d overdue</p>
                    <BookingStrip task={task} />
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <RecurringServiceDialog task={task} propertyAddress={property?.address ?? ""} />
                    <button onClick={() => completeTask(task.id)} className="text-xs bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors font-medium">Mark Done</button>
                    <button onClick={() => deleteRecurringTask(task.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recurringTasks.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No recurring tasks</p>
          <p className="text-sm mt-1">Add HVAC filters, smoke detector checks, and more</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Upcoming</h3>
          {upcoming.map(task => {
            const days = daysUntil(task.nextDueAt);
            const isSoon = days <= 14;
            const property = getProperty(task.propertyId);
            return (
              <Card key={task.id} className="hover:shadow-md hover:bg-blue-50/40 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {(() => { const CategoryIcon = categoryConfig[task.category]; return (
                      <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-muted">
                        <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ); })()}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{property?.name ?? "Unknown"} · every {task.intervalDays} days</p>
                          <BookingStrip task={task} />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={isSoon ? "warning" : "success"}>
                            {days === 0 ? "Due today" : `${days}d`}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <RecurringServiceDialog task={task} propertyAddress={property?.address ?? ""} />
                            <button
                              onClick={() => completeTask(task.id)}
                              className="p-1 rounded-md text-muted-foreground hover:text-green-600 hover:bg-green-50 transition-colors"
                              title="Mark complete"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            {deletingId === task.id ? (
                              <span className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">Delete?</span>
                                <button
                                  onClick={() => { deleteRecurringTask(task.id); setDeletingId(null); }}
                                  className="p-1 rounded-md text-destructive hover:bg-red-50 transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingId(null)}
                                  className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            ) : (
                              <button
                                onClick={() => setDeletingId(task.id)}
                                className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {task.lastCompletedAt && (
                        <p className="text-xs text-muted-foreground mt-1.5">Last completed {new Date(task.lastCompletedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
