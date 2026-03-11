"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Expense } from "@/lib/mock-data";
import { Receipt, Plus, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryColors: Record<Expense["category"], string> = {
  repair: "bg-red-100 text-red-700",
  maintenance: "bg-[#EDE8E2] text-[#6B5F55]",
  improvement: "bg-[#E8EDF0] text-[#4A6070]",
  supply: "bg-green-100 text-green-700",
  other: "bg-gray-100 text-gray-700",
};

function AddExpenseDialog() {
  const { properties, addExpense } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", propertyId: "", category: "repair" as Expense["category"], date: new Date().toISOString().split("T")[0] });

  const submit = () => {
    if (!form.description || !form.amount || !form.propertyId) return;
    addExpense({ ...form, amount: parseFloat(form.amount), ticketId: null });
    setForm({ description: "", amount: "", propertyId: "", category: "repair", date: new Date().toISOString().split("T")[0] });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="w-4 h-4" />Log Expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Log Expense</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input placeholder="e.g. Plumber visit" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Amount ($)</Label>
              <Input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Property</Label>
              <Select value={form.propertyId} onValueChange={v => setForm(f => ({ ...f, propertyId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as Expense["category"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                  <SelectItem value="supply">Supply</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full" onClick={submit}>Save Expense</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ExpensesTab() {
  const { expenses, properties, deleteExpense } = useStore();

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, e) => sum + e.amount, 0);

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const getPropertyName = (id: string) => properties.find(p => p.id === id)?.name ?? "Unknown";
  const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold">Expenses</h2>
          <p className="text-sm text-muted-foreground">{expenses.length} entries logged</p>
        </div>
        <AddExpenseDialog />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Spend</p>
            <p className="text-2xl font-heading font-bold text-foreground">${total.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">This Month</p>
            <p className="text-2xl font-heading font-bold text-primary">${thisMonth.toLocaleString()}</p>
          </CardContent>
        </Card>
        {Object.entries(byCategory).slice(0, 2).map(([cat, amt]) => (
          <Card key={cat}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1 capitalize">{cat}</p>
              <p className="text-2xl font-heading font-bold text-foreground">${amt.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {expenses.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
          <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No expenses logged yet</p>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" />Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {sorted.map(expense => (
              <div key={expense.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className={`w-24 shrink-0 inline-block text-center text-xs font-medium px-2 py-0.5 rounded-full capitalize ${categoryColors[expense.category]}`}>{expense.category}</span>
                  <div>
                    <p className="text-sm font-medium">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{getPropertyName(expense.propertyId)} · {new Date(expense.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">${expense.amount.toLocaleString()}</span>
                  <button onClick={() => deleteExpense(expense.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
