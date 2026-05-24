"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoIcon } from "@/components/ui/logo-icon";
import { CheckCircle, Lock, ArrowLeft, ShieldCheck } from "lucide-react";

// ─── Stripe wordmark SVG ──────────────────────────────────────────────────────

function StripeLogo() {
  return (
    <svg viewBox="0 0 60 25" className="h-5 fill-[#635BFF]" aria-label="Stripe">
      <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.19 10.19 0 0 1-4.56 1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.58zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.23c0-1.85-1.07-2.58-2.06-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.45.94V5.55h3.94l.12 1.07c.6-.72 1.7-1.33 3.23-1.33 2.99 0 5.3 2.68 5.3 7.44 0 5.25-2.35 7.57-5.22 7.57zM40 9.45c-.95 0-1.54.34-1.97.81l.03 6.26c.4.44.98.78 1.94.78 1.52 0 2.54-1.65 2.54-3.94C42.54 11.1 41.52 9.45 40 9.45zM28.24 5.55h4.47v14.5h-4.47V5.55zm0-4.47C28.24.48 28.72 0 29.47 0c.76 0 1.24.48 1.24 1.08 0 .61-.48 1.09-1.24 1.09-.75 0-1.23-.48-1.23-1.09zM23.95 7.46l-.28-1.91h-3.86v14.5h4.45V10.7c1.05-1.37 2.83-1.12 3.38-.94V5.55c-.56-.2-2.61-.55-3.69 1.91zM14.08 3.64L9.72 4.56l-.02 13.09c0 2.42 1.82 4.2 4.24 4.2 1.34 0 2.32-.24 2.86-.53v-3.4c-.52.2-3.1.96-3.1-1.45V9.28h3.1V5.55h-3.1l.38-1.91zM4.15 10.06c0-.68.56-.94 1.49-.94 1.33 0 3.02.4 4.35 1.12V6.11A11.6 11.6 0 0 0 5.64 5.3C2.25 5.3 0 7.1 0 10.28c0 5.01 6.9 4.21 6.9 6.37 0 .8-.7 1.07-1.68 1.07-1.45 0-3.31-.6-4.78-1.4v4.19c1.62.7 3.27 1 4.78 1 3.5 0 5.9-1.73 5.9-4.97-.02-5.4-6.97-4.45-6.97-6.48z" />
    </svg>
  );
}

// ─── Card brand detector ──────────────────────────────────────────────────────

function CardBrandIcon({ number }: { number: string }) {
  const n = number.replace(/\s/g, "");
  if (n.startsWith("4")) return <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">VISA</span>;
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">MC</span>;
  if (n.startsWith("34") || n.startsWith("37")) return <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">AMEX</span>;
  return null;
}

// ─── Input component ──────────────────────────────────────────────────────────

function StripeInput({
  label, id, placeholder, value, onChange, type = "text", maxLength, className = "",
}: {
  label: string; id: string; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string; maxLength?: number; className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[11px] font-medium text-gray-500 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={maxLength}
        className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]/30 focus:border-[#635BFF] transition-all placeholder:text-gray-300"
      />
    </div>
  );
}

// ─── Format helpers ───────────────────────────────────────────────────────────

function fmtCard(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function fmtExpiry(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d.length === 2 && raw.length < 5 ? d : d.slice(0, 2);
}

// ─── Checkout page ────────────────────────────────────────────────────────────

type Stage = "form" | "processing" | "success";

export default function CheckoutPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("form");
  const [form, setForm] = useState({
    email: "",
    card: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const set = (field: keyof typeof form) => (v: string) =>
    setForm(f => ({ ...f, [field]: v }));

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStage("processing");
    setTimeout(() => setStage("success"), 1800);
  };

  // Auto-redirect after success
  useEffect(() => {
    if (stage === "success") {
      const t = setTimeout(() => router.push("/dashboard"), 2200);
      return () => clearTimeout(t);
    }
  }, [stage, router]);

  // ── Success overlay ──
  if (stage === "success") {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-[scale-in_0.3s_ease-out]">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-2">Payment successful!</h1>
          <p className="text-gray-500 text-sm mb-1">Welcome to PropKeep Plus.</p>
          <p className="text-gray-400 text-sm">Taking you to your dashboard…</p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-40 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#635BFF] rounded-full animate-[grow_2.2s_linear_forwards]" />
            </div>
          </div>
        </div>
        <style>{`
          @keyframes scale-in { from { transform: scale(0.6); opacity: 0 } to { transform: scale(1); opacity: 1 } }
          @keyframes grow { from { width: 0% } to { width: 100% } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] lg:grid lg:grid-cols-[420px_1fr]">

      {/* ── LEFT — order summary ── */}
      <div className="bg-white border-r border-gray-100 px-8 py-10 flex flex-col">

        {/* Back */}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-10 w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to pricing
        </Link>

        {/* Merchant */}
        <div className="flex items-center gap-2.5 mb-8">
          <LogoIcon className="w-8 h-8" />
          <span className="font-heading font-bold text-lg text-gray-900">PropKeep</span>
        </div>

        {/* Product */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Subscribing to</p>
          <h2 className="font-heading text-xl font-bold text-gray-900">PropKeep Plus</h2>
          <p className="text-sm text-gray-400 mt-0.5">Annual plan · billed today</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-8">
          <span className="font-heading text-4xl font-bold text-gray-900">$49</span>
          <span className="text-gray-400 text-sm">/ year</span>
        </div>

        {/* Line items */}
        <div className="space-y-2 border-t border-gray-100 pt-5 mb-5 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>PropKeep Plus × 1</span>
            <span>$49.00</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-100 pt-4 mb-8">
          <span>Total due today</span>
          <span>$49.00 USD</span>
        </div>

        {/* Features */}
        <ul className="space-y-2 text-xs text-gray-500 mb-auto">
          {[
            "Unlimited properties & units",
            "Unlimited maintenance tickets",
            "Unlimited recurring tasks",
            "Full expense history",
            "Priority support",
            "CSV export (coming soon)",
          ].map(f => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Guarantee */}
        <div className="flex items-center gap-2 mt-8 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
          30-day money-back guarantee · Cancel anytime
        </div>
      </div>

      {/* ── RIGHT — payment form ── */}
      <div className="px-8 py-10 flex flex-col max-w-lg mx-auto w-full">

        {/* Demo notice */}
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-4 py-2.5 mb-7 flex items-center gap-2">
          <span className="font-semibold">Demo mode</span>
          · No real payment will be processed. Use any values.
        </div>

        <h2 className="font-heading text-lg font-bold text-gray-900 mb-6">Pay with card</h2>

        <form onSubmit={handlePay} className="space-y-5 flex-1">

          {/* Contact */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Contact</p>
            <StripeInput
              label="Email address"
              id="email"
              type="email"
              placeholder="alex@example.com"
              value={form.email}
              onChange={set("email")}
            />
          </div>

          {/* Payment */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Payment details</p>
            <div className="space-y-3">

              {/* Card number */}
              <div>
                <label htmlFor="card" className="block text-[11px] font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Card number
                </label>
                <div className="relative">
                  <input
                    id="card"
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form.card}
                    onChange={e => set("card")(fmtCard(e.target.value))}
                    className="w-full h-10 px-3 pr-16 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]/30 focus:border-[#635BFF] transition-all placeholder:text-gray-300 font-mono tracking-wider"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CardBrandIcon number={form.card} />
                  </div>
                </div>
              </div>

              {/* Expiry + CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="expiry" className="block text-[11px] font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Expiration
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    inputMode="numeric"
                    placeholder="MM / YY"
                    value={form.expiry}
                    onChange={e => set("expiry")(fmtExpiry(e.target.value))}
                    maxLength={7}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]/30 focus:border-[#635BFF] transition-all placeholder:text-gray-300 font-mono tracking-wider"
                  />
                </div>
                <StripeInput
                  label="CVC"
                  id="cvc"
                  placeholder="123"
                  value={form.cvc}
                  onChange={v => set("cvc")(v.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className="font-mono"
                />
              </div>

              {/* Name */}
              <StripeInput
                label="Name on card"
                id="name"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={set("name")}
              />
            </div>
          </div>

          {/* Pay button */}
          <button
            type="submit"
            disabled={stage === "processing"}
            className="w-full h-12 rounded-xl bg-[#635BFF] hover:bg-[#5246e5] active:bg-[#4438d0] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-80 shadow-md shadow-[#635BFF]/30 mt-2"
          >
            {stage === "processing" ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Processing…
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                Subscribe — $49.00
              </>
            )}
          </button>
        </form>

        {/* Stripe footer */}
        <div className="flex items-center justify-center gap-1.5 mt-8 text-xs text-gray-400">
          <span>Powered by</span>
          <StripeLogo />
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 text-[11px] text-gray-300">
          <span className="hover:text-gray-500 cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-gray-500 cursor-pointer transition-colors">Privacy</span>
        </div>
      </div>
    </div>
  );
}
