"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { TenantMessage } from "@/lib/mock-data";
import { MessageCircle, X, Camera, MessageSquare, Wrench, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const categoryLabels: Record<string, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  hvac: "HVAC",
  appliance: "Appliance",
  structural: "Structural",
  other: "Other",
};

const priorityStyles: Record<string, string> = {
  high: "text-red-600 bg-red-50",
  medium: "text-amber-600 bg-amber-50",
  low: "text-green-600 bg-green-50",
};

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Tenant attachment"
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

// ─── Ticket Suggestion Sheet ──────────────────────────────────────────────────

function TicketSuggestionSheet({
  message,
  propertyName,
  unitNumber,
  onCreateTicket,
  onDismiss,
  onClose,
}: {
  message: TenantMessage;
  propertyName: string;
  unitNumber: string;
  onCreateTicket: () => void;
  onDismiss: () => void;
  onClose: () => void;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Tenant Message
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Tenant info */}
          <div className="text-xs text-muted-foreground font-medium">
            {message.tenantName} · {unitNumber} · {timeAgo(message.receivedAt)}
          </div>

          {/* SMS speech bubble */}
          <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
            <p className="text-sm leading-relaxed">{message.body}</p>
          </div>

          {/* Image attachment */}
          {message.imageUrl && (
            <div>
              <button
                onClick={() => setLightboxOpen(true)}
                className="relative rounded-xl overflow-hidden block cursor-zoom-in group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={message.imageUrl}
                  alt="Tenant photo"
                  className="w-full max-h-44 object-cover rounded-xl group-hover:brightness-90 transition-all"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    View full image
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Suggested ticket card */}
          <div className="border rounded-xl p-3.5 space-y-3 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide">
              <Wrench className="w-3.5 h-3.5" />
              Suggested Ticket
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Title</p>
                <p className="text-sm font-medium">{message.suggestedTitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Category</p>
                  <p className="text-sm font-medium capitalize">{categoryLabels[message.suggestedCategory]}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Priority</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${priorityStyles[message.suggestedPriority]}`}>
                    {message.suggestedPriority}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Property · Unit</p>
                <p className="text-sm font-medium">{propertyName} · {unitNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Description</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{message.body}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button className="flex-1" onClick={onCreateTicket}>
              Create Ticket
            </Button>
            <Button variant="outline" className="flex-1" onClick={onDismiss}>
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>

      {lightboxOpen && message.imageUrl && (
        <Lightbox src={message.imageUrl} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}

// ─── Notification Panel ───────────────────────────────────────────────────────

function NotificationPanel({
  messages,
  properties,
  onSelectMessage,
  onClose,
}: {
  messages: TenantMessage[];
  properties: ReturnType<typeof useStore>["properties"];
  onSelectMessage: (id: string) => void;
  onClose: () => void;
}) {
  const maintenanceMessages = messages.filter((m) => m.isMaintenanceRelated);

  const getUnitNumber = (msg: TenantMessage) => {
    const prop = properties.find((p) => p.id === msg.propertyId);
    return prop?.units.find((u) => u.id === msg.unitId)?.unitNumber ?? "";
  };

  return (
    <div className="absolute bottom-16 right-0 w-80 bg-background border rounded-2xl shadow-2xl overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Tenant Messages</span>
          {maintenanceMessages.filter((m) => !m.read).length > 0 && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
              {maintenanceMessages.filter((m) => !m.read).length} new
            </Badge>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-0.5"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Message list */}
      <div className="max-h-80 overflow-y-auto divide-y">
        {maintenanceMessages.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-25" />
            No maintenance messages
          </div>
        ) : (
          maintenanceMessages.map((msg) => {
            const unitNumber = getUnitNumber(msg);
            return (
              <button
                key={msg.id}
                onClick={() => onSelectMessage(msg.id)}
                className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-start gap-3 ${!msg.read ? "bg-primary/5" : ""}`}
              >
                {/* Unread dot */}
                <div className="mt-1.5 shrink-0">
                  {!msg.read ? (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  ) : (
                    <div className="w-2 h-2" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold">{msg.tenantName}</span>
                    <span className="text-xs text-muted-foreground">· {unitNumber}</span>
                    {msg.imageUrl && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[#6B5F55] bg-[#EDE8E2] px-1.5 py-0.5 rounded-full font-medium">
                        <Camera className="w-2.5 h-2.5" /> Photo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                    {msg.body}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{timeAgo(msg.receivedAt)}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function TenantNotifications() {
  const { tenantMessages, properties, addTicket, markMessageRead, dismissMessage } = useStore();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const maintenanceMessages = tenantMessages.filter((m) => m.isMaintenanceRelated);
  const unreadCount = maintenanceMessages.filter((m) => !m.read).length;
  const selectedMessage = tenantMessages.find((m) => m.id === selectedMessageId) ?? null;

  const getPropertyAndUnit = (msg: TenantMessage) => {
    const property = properties.find((p) => p.id === msg.propertyId);
    const unit = property?.units.find((u) => u.id === msg.unitId);
    return { propertyName: property?.name ?? "", unitNumber: unit?.unitNumber ?? "" };
  };

  const handleSelectMessage = (id: string) => {
    setSelectedMessageId(id);
    setPanelOpen(false);
  };

  const handleCreateTicket = () => {
    if (!selectedMessage) return;
    addTicket({
      propertyId: selectedMessage.propertyId,
      unitId: selectedMessage.unitId,
      applianceId: null,
      title: selectedMessage.suggestedTitle,
      description: selectedMessage.body,
      status: "open",
      priority: selectedMessage.suggestedPriority,
      category: selectedMessage.suggestedCategory,
      cost: null,
      imageUrl: selectedMessage.imageUrl,
      bookingProviderId: null,
      bookingPlatform: null,
      bookingConfirmedAt: null,
    });
    markMessageRead(selectedMessage.id);
    setSelectedMessageId(null);
  };

  const handleDismiss = () => {
    if (!selectedMessage) return;
    dismissMessage(selectedMessage.id);
    setSelectedMessageId(null);
  };

  return (
    <>
      {/* Floating launcher */}
      <div className="fixed bottom-6 right-6 z-50">
        {panelOpen && (
          <NotificationPanel
            messages={maintenanceMessages}
            properties={properties}
            onSelectMessage={handleSelectMessage}
            onClose={() => setPanelOpen(false)}
          />
        )}

        <button
          onClick={() => setPanelOpen((o) => !o)}
          className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
            panelOpen
              ? "bg-primary text-white shadow-primary/30"
              : "bg-primary text-white shadow-primary/20 hover:shadow-primary/40"
          }`}
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1.5 shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Ticket suggestion dialog */}
      {selectedMessage && (() => {
        const { propertyName, unitNumber } = getPropertyAndUnit(selectedMessage);
        return (
          <Dialog open={true} onOpenChange={(open) => { if (!open) setSelectedMessageId(null); }}>
            <TicketSuggestionSheet
              message={selectedMessage}
              propertyName={propertyName}
              unitNumber={unitNumber}
              onCreateTicket={handleCreateTicket}
              onDismiss={handleDismiss}
              onClose={() => setSelectedMessageId(null)}
            />
          </Dialog>
        );
      })()}
    </>
  );
}
