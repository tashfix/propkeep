"use client";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { Ticket, Appliance, Property, Unit, matchProvider, mockProviders, ServiceProvider } from "@/lib/mock-data";
import { Wrench, Plus, Trash2, CheckCircle, Clock, AlertCircle, Package, X, ImageIcon, Sparkles, Star, CheckCircle2, ExternalLink, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Ticket attachment"
        className="max-w-full max-h-full rounded-xl object-contain shadow-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

// ─── Platform badge colours ────────────────────────────────────────────────────

const platformStyles: Record<ServiceProvider["platform"], string> = {
  TaskRabbit: "bg-[#0D9B4E]/10 text-[#0D9B4E]",
  Thumbtack: "bg-blue-50 text-blue-700",
  Angi: "bg-orange-50 text-orange-700",
};

// ─── Service Suggestion Dialog ────────────────────────────────────────────────

function ServiceSuggestionDialog({
  ticket,
  appliance,
  property,
  unit,
}: {
  ticket: Ticket;
  appliance: Appliance | null;
  property: Property | null;
  unit: Unit | null;
}) {
  const { attachBooking } = useStore();
  const isManageMode = !!ticket.bookingProviderId;
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"suggest" | "confirmed">(isManageMode ? "confirmed" : "suggest");
  const [form, setForm] = useState({
    issueSummary: ticket.title + (ticket.description ? ` — ${ticket.description}` : ""),
    preferredTime: "tomorrow-morning",
    notes: ticket.description ?? "",
  });

  // Track whether a new booking was just confirmed (vs. just viewing manage mode)
  const isNewBooking = useRef(false);

  const provider = isManageMode
    ? (mockProviders.find(p => p.id === ticket.bookingProviderId) ?? matchProvider(ticket.category))
    : matchProvider(ticket.category);

  const handleOpen = (val: boolean) => {
    if (val) {
      // When opening, always derive step from current ticket booking state
      setStep(ticket.bookingProviderId ? "confirmed" : "suggest");
    }
    setOpen(val);
    if (!val) {
      // Only persist booking once — when it was freshly confirmed
      if (isNewBooking.current) {
        attachBooking(ticket.id, provider.id, provider.platform);
        isNewBooking.current = false;
      }
    }
  };

  const handleConfirm = () => {
    isNewBooking.current = true;
    setStep("confirmed");
  };

  const ticketRef = `#TK-${ticket.id.slice(-5).toUpperCase()}`;

  // Determine if we're viewing an already-booked ticket (manage mode)
  const viewingManage = isManageMode && !isNewBooking.current;
  const bookedAt = ticket.bookingConfirmedAt
    ? new Date(ticket.bookingConfirmedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <button className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 transition-colors">
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
                  {/* Avatar */}
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
                  <Label className="text-xs">Issue Summary</Label>
                  <Input
                    value={form.issueSummary}
                    onChange={e => setForm(f => ({ ...f, issueSummary: e.target.value }))}
                    className="text-sm"
                  />
                </div>

                {/* Appliance info — only when linked */}
                {appliance && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Appliance</Label>
                    <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-3 py-2 rounded-lg">
                      <Package className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {appliance.name}
                        {appliance.brand && ` · ${appliance.brand}`}
                        {appliance.model && ` ${appliance.model}`}
                        {appliance.modelNumber && (
                          <code className="ml-1.5 text-[10px] font-mono opacity-75">S/N: {appliance.modelNumber}</code>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Location */}
                {property && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Location</Label>
                    <div className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
                      {property.address}{unit ? ` · ${unit.unitNumber}` : ""}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs">Preferred Time</Label>
                  <Select value={form.preferredTime} onValueChange={v => setForm(f => ({ ...f, preferredTime: v }))}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tomorrow-morning">Tomorrow morning</SelectItem>
                      <SelectItem value="tomorrow-afternoon">Tomorrow afternoon</SelectItem>
                      <SelectItem value="this-week">Any time this week</SelectItem>
                      <SelectItem value="next-week">Next week</SelectItem>
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
                <Button
                  className="flex-1 gap-1.5"
                  onClick={handleConfirm}
                >
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
                <code className="font-mono font-semibold">{ticketRef}</code>
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
                <span className="text-muted-foreground">Issue</span>
                <span className="font-medium truncate ml-8 text-right">{ticket.title}</span>
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

// ─── Add Ticket Dialog ─────────────────────────────────────────────────────────

function AddTicketDialog() {
  const { properties, appliances, addTicket } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", propertyId: "", unitId: "" as string | null,
    applianceId: "" as string | null,
    status: "open" as Ticket["status"], priority: "medium" as Ticket["priority"],
    category: "other" as Ticket["category"], cost: "",
  });

  const selectedProperty = properties.find(p => p.id === form.propertyId);
  const relevantAppliances = form.unitId
    ? appliances.filter(a => a.unitId === form.unitId)
    : form.propertyId
    ? appliances.filter(a => a.propertyId === form.propertyId)
    : [];

  const submit = () => {
    if (!form.title || !form.propertyId) return;
    addTicket({
      ...form,
      unitId: form.unitId || null,
      applianceId: form.applianceId || null,
      cost: form.cost ? parseFloat(form.cost) : null,
      imageUrl: null,
      bookingProviderId: null,
      bookingPlatform: null,
      bookingConfirmedAt: null,
    });
    setForm({ title: "", description: "", propertyId: "", unitId: null, applianceId: null, status: "open", priority: "medium", category: "other", cost: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="w-4 h-4" />New Ticket</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Create Maintenance Ticket</DialogTitle></DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input placeholder="e.g. Leaking kitchen faucet" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea placeholder="Describe the issue..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Property</Label>
              <Select value={form.propertyId} onValueChange={v => setForm(f => ({ ...f, propertyId: v, unitId: null, applianceId: null }))}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Unit (optional)</Label>
              <Select value={form.unitId ?? ""} onValueChange={v => setForm(f => ({ ...f, unitId: v || null, applianceId: null }))}>
                <SelectTrigger><SelectValue placeholder="All units" /></SelectTrigger>
                <SelectContent>
                  {selectedProperty?.units.map(u => <SelectItem key={u.id} value={u.id}>{u.unitNumber}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {relevantAppliances.length > 0 && (
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                Related Appliance <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Select value={form.applianceId ?? ""} onValueChange={v => setForm(f => ({ ...f, applianceId: v || null }))}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  {relevantAppliances.map(a => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}{a.brand ? ` · ${a.brand}` : ""}{a.model ? ` ${a.model}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v as Ticket["priority"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as Ticket["category"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="appliance">Appliance</SelectItem>
                  <SelectItem value="structural">Structural</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full" onClick={submit}>Create Ticket</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Status / priority configs ─────────────────────────────────────────────────

const statusConfig = {
  open: { label: "Open", variant: "destructive" as const, icon: AlertCircle },
  "in-progress": { label: "In Progress", variant: "warning" as const, icon: Clock },
  resolved: { label: "Resolved", variant: "success" as const, icon: CheckCircle },
};

const priorityConfig = {
  low: { label: "Low", color: "text-green-600 bg-green-50" },
  medium: { label: "Medium", color: "text-amber-600 bg-amber-50" },
  high: { label: "High", color: "text-red-600 bg-red-50" },
};

// ─── Main tab ──────────────────────────────────────────────────────────────────

export default function TicketsTab() {
  const { tickets, properties, appliances, updateTicketStatus, deleteTicket } = useStore();
  const [filter, setFilter] = useState<Ticket["status"] | "all">("all");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const filtered = filter === "all" ? tickets : tickets.filter(t => t.status === filter);
  const getProperty = (id: string) => properties.find(p => p.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold">Maintenance Tickets</h2>
          <p className="text-sm text-muted-foreground">{tickets.filter(t => t.status !== "resolved").length} open issues</p>
        </div>
        <AddTicketDialog />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "open", "in-progress", "resolved"] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            {s === "all" ? "All" : s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-1.5 text-xs opacity-70">
              {s === "all" ? tickets.length : tickets.filter(t => t.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
          <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No tickets found</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(ticket => {
          const property = getProperty(ticket.propertyId);
          const status = statusConfig[ticket.status];
          const priority = priorityConfig[ticket.priority];
          const StatusIcon = status.icon;
          const linkedAppliance = ticket.applianceId ? appliances.find(a => a.id === ticket.applianceId) ?? null : null;
          const linkedUnit = property?.units.find(u => u.id === ticket.unitId) ?? null;

          return (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ticket.status === "resolved" ? "bg-green-100" : ticket.status === "in-progress" ? "bg-amber-100" : "bg-red-100"}`}>
                    <StatusIcon className={`w-4 h-4 ${ticket.status === "resolved" ? "text-green-600" : ticket.status === "in-progress" ? "text-amber-600" : "text-red-600"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{ticket.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{property?.name} {ticket.unitId && `· ${property?.units.find(u => u.id === ticket.unitId)?.unitNumber}`}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.color}`}>{priority.label}</span>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    </div>
                    {ticket.description && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{ticket.description}</p>}

                    {linkedAppliance && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium px-2 py-0.5 rounded-full">
                          <Package className="w-3 h-3" />
                          {linkedAppliance.name}
                          {linkedAppliance.brand && ` · ${linkedAppliance.brand}`}
                          {linkedAppliance.model && ` ${linkedAppliance.model}`}
                          {linkedAppliance.modelNumber && (
                            <code className="ml-1 text-[10px] font-mono opacity-75">{linkedAppliance.modelNumber}</code>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Booking info strip */}
                    {ticket.bookingProviderId && (() => {
                      const bookedPro = mockProviders.find(p => p.id === ticket.bookingProviderId);
                      if (!bookedPro) return null;
                      return (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                          <span className="font-medium text-foreground">{bookedPro.name}</span>
                          <span>·</span>
                          <span>{ticket.bookingPlatform}</span>
                          <span>·</span>
                          <span className="font-mono text-[11px]">#TK-{ticket.id.slice(-5).toUpperCase()}</span>
                        </div>
                      );
                    })()}

                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded capitalize">{ticket.category}</span>
                      {ticket.imageUrl && (
                        <button
                          onClick={() => setLightboxSrc(ticket.imageUrl!)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          <ImageIcon className="w-3 h-3" />
                          Image 1
                        </button>
                      )}
                      {ticket.cost && <span className="text-xs font-medium text-primary">${ticket.cost.toLocaleString()}</span>}
                      <div className="ml-auto flex items-center gap-3">
                        {/* Book a Pro — shown for non-resolved tickets */}
                        {ticket.status !== "resolved" && (
                          <ServiceSuggestionDialog
                            ticket={ticket}
                            appliance={linkedAppliance}
                            property={property ?? null}
                            unit={linkedUnit}
                          />
                        )}
                        {ticket.status === "open" && (
                          <button onClick={() => updateTicketStatus(ticket.id, "in-progress")} className="text-xs text-amber-600 hover:underline">Start</button>
                        )}
                        {ticket.status === "in-progress" && (
                          <button onClick={() => updateTicketStatus(ticket.id, "resolved")} className="text-xs text-green-600 hover:underline">Resolve</button>
                        )}
                        <button onClick={() => deleteTicket(ticket.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Global lightbox for ticket images */}
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  );
}
