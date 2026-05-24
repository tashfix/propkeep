"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Property, Appliance } from "@/lib/mock-data";
import { Building2, Plus, Trash2, Home, Users, ChevronDown, ChevronRight, Package, MapPin } from "lucide-react";

function StreetViewImage({ address, photoUrl }: { address: string; photoUrl: string | null }) {
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  const src = apiKey
    ? `https://maps.googleapis.com/maps/api/streetview?size=900x600&location=${encodeURIComponent(address)}&key=${apiKey}&fov=80&pitch=5`
    : photoUrl ?? null;

  if (loading) {
    return (
      <div className="h-40 w-full bg-slate-100 animate-pulse flex flex-col items-center justify-center gap-1.5">
        <MapPin className="w-5 h-5 text-slate-400" />
        <span className="text-xs text-slate-400 tracking-wide">Fetching street view…</span>
      </div>
    );
  }

  if (src && !imgError) {
    return (
      <div className="h-40 w-full overflow-hidden relative">
        <img
          src={src}
          alt={`Street view of ${address}`}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
        {/* Google Maps watermark */}
        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-white/85 backdrop-blur-sm rounded px-1.5 py-0.5 shadow-sm">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
          <span className="text-[9px] text-gray-500 font-medium leading-none">Google Maps</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
      <Building2 className="w-12 h-12 text-slate-300" />
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const APPLIANCE_PRESETS = [
  "Fridge", "Oven", "Microwave", "Dishwasher", "Washer", "Dryer",
  "HVAC Unit", "Water Heater", "Garbage Disposal", "Router", "Other",
];

function AddPropertyDialog() {
  const { addProperty } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", type: "single-family" as Property["type"], photoUrl: null as string | null });

  const submit = () => {
    if (!form.name || !form.address) return;
    addProperty(form);
    setForm({ name: "", address: "", type: "single-family", photoUrl: null });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="w-4 h-4" />Add Property</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add New Property</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Property Name</Label>
            <Input placeholder="e.g. Maple Street Duplex" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input placeholder="123 Main St, City, State ZIP" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Property Type</Label>
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as Property["type"] }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single-family">Single Family</SelectItem>
                <SelectItem value="multi-unit">Multi-Unit</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={submit}>Save Property</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddUnitDialog({ propertyId }: { propertyId: string }) {
  const { addUnit } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ unitNumber: "", tenantName: "", tenantEmail: "", rentAmount: "" });

  const submit = () => {
    if (!form.unitNumber) return;
    addUnit(propertyId, { unitNumber: form.unitNumber, tenantName: form.tenantName, tenantEmail: form.tenantEmail, rentAmount: parseFloat(form.rentAmount) || 0 });
    setForm({ unitNumber: "", tenantName: "", tenantEmail: "", rentAmount: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Plus className="w-3 h-3" />Add Unit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Unit</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Unit Number / Label</Label>
            <Input placeholder="e.g. Unit A, #2B, Main" value={form.unitNumber} onChange={e => setForm(f => ({ ...f, unitNumber: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Tenant Name</Label>
            <Input placeholder="Optional" value={form.tenantName} onChange={e => setForm(f => ({ ...f, tenantName: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Tenant Email</Label>
            <Input type="email" placeholder="Optional" value={form.tenantEmail} onChange={e => setForm(f => ({ ...f, tenantEmail: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Monthly Rent ($)</Label>
            <Input type="number" placeholder="0" value={form.rentAmount} onChange={e => setForm(f => ({ ...f, rentAmount: e.target.value }))} />
          </div>
          <Button className="w-full" onClick={submit}>Save Unit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddApplianceDialog({ unitId, propertyId }: { unitId: string; propertyId: string }) {
  const { addAppliance } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", brand: "", model: "", modelNumber: "", notes: "" });

  const submit = () => {
    if (!form.name) return;
    addAppliance({ unitId, propertyId, ...form });
    setForm({ name: "", brand: "", model: "", modelNumber: "", notes: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">
          <Plus className="w-3 h-3" /> Add appliance
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Appliance</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Appliance</Label>
            <Select value={form.name} onValueChange={v => setForm(f => ({ ...f, name: v }))}>
              <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
              <SelectContent>
                {APPLIANCE_PRESETS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Brand</Label>
              <Input placeholder="e.g. Samsung" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Model Name</Label>
              <Input placeholder="e.g. RF28R7351SR" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Model / Serial Number</Label>
            <Input placeholder="e.g. SN-4829301" value={form.modelNumber} onChange={e => setForm(f => ({ ...f, modelNumber: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Notes <span className="text-muted-foreground">(optional)</span></Label>
            <Input placeholder="e.g. Installed Jan 2022, filter replaced Mar 2025" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <Button className="w-full" onClick={submit}>Save Appliance</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ApplianceList({ unitId, propertyId }: { unitId: string; propertyId: string }) {
  const { appliances, deleteAppliance } = useStore();
  const unitAppliances = appliances.filter(a => a.unitId === unitId);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-1">
      <button
        onClick={() => setExpanded(e => !e)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <Package className="w-3 h-3" />
        <span>
          Appliances
          {unitAppliances.length > 0 && (
            <span className="ml-1 bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-medium">
              {unitAppliances.length}
            </span>
          )}
        </span>
      </button>

      {expanded && (
        <div className="mt-2 ml-1 space-y-1.5 border-l-2 border-muted pl-3">
          {unitAppliances.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No appliances logged yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left font-medium pb-1.5 pr-3">Appliance</th>
                    <th className="text-left font-medium pb-1.5 pr-3">Brand</th>
                    <th className="text-left font-medium pb-1.5 pr-3">Model</th>
                    <th className="text-left font-medium pb-1.5 pr-3">Model / Serial #</th>
                    <th className="pb-1.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/50">
                  {unitAppliances.map((a: Appliance) => (
                    <tr key={a.id} className="group">
                      <td className="py-1.5 pr-3 font-medium text-foreground">{a.name}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{a.brand || "—"}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{a.model || "—"}</td>
                      <td className="py-1.5 pr-3">
                        {a.modelNumber ? (
                          <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">{a.modelNumber}</code>
                        ) : "—"}
                      </td>
                      <td className="py-1.5">
                        <button
                          onClick={() => deleteAppliance(a.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {unitAppliances.some((a: Appliance) => a.notes) && (
                <div className="mt-2 space-y-1">
                  {unitAppliances.filter((a: Appliance) => a.notes).map((a: Appliance) => (
                    <p key={a.id} className="text-[11px] text-muted-foreground">
                      <span className="font-medium">{a.name}:</span> {a.notes}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
          <AddApplianceDialog unitId={unitId} propertyId={propertyId} />
        </div>
      )}
    </div>
  );
}

const typeLabels: Record<Property["type"], string> = {
  "single-family": "Single Family",
  "multi-unit": "Multi-Unit",
  "condo": "Condo",
};

export default function PropertiesTab() {
  const { properties, tickets, deleteProperty, deleteUnit } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold">Properties</h2>
          <p className="text-sm text-muted-foreground">{properties.length} {properties.length === 1 ? "property" : "properties"} tracked</p>
        </div>
        <AddPropertyDialog />
      </div>

      {properties.length === 0 && (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No properties yet</p>
          <p className="text-sm mt-1">Add your first property to get started</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {properties.map(property => {
          const openTickets = tickets.filter(t => t.propertyId === property.id && t.status !== "resolved").length;
          return (
            <Card key={property.id} className="overflow-hidden">
              <StreetViewImage address={property.address} photoUrl={property.photoUrl} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{property.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{property.address}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Badge variant="secondary" className="max-w-[90px] overflow-hidden">
                      <span className="block truncate">{typeLabels[property.type]}</span>
                    </Badge>
                    <button onClick={() => deleteProperty(property.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5" />{property.units.length} {property.units.length === 1 ? "unit" : "units"}</span>
                  {openTickets > 0 && <span className="flex items-center gap-1 text-amber-600 font-medium"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />{openTickets} open ticket{openTickets > 1 ? "s" : ""}</span>}
                </div>

                {property.units.length > 0 && (
                  <div className="space-y-3">
                    {property.units.map(unit => (
                      <div key={unit.id} className="bg-muted/50 rounded-lg px-3 py-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">{unit.unitNumber}</span>
                            {unit.tenantName && <span className="text-xs text-muted-foreground">· {unit.tenantName}</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            {unit.rentAmount > 0 && <span className="text-xs font-medium text-primary">${unit.rentAmount.toLocaleString()}/mo</span>}
                            <button onClick={() => deleteUnit(property.id, unit.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <ApplianceList unitId={unit.id} propertyId={property.id} />
                      </div>
                    ))}
                  </div>
                )}

                <AddUnitDialog propertyId={property.id} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
