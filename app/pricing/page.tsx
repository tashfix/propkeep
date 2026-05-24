import Link from "next/link";
import { CheckCircle, Wrench, ArrowLeft } from "lucide-react";
import { LogoIcon } from "@/components/ui/logo-icon";

const FREE_FEATURES = ["1 property", "10 maintenance tickets", "5 recurring tasks", "Expense tracking", "Mobile friendly"];
const PLUS_FEATURES = ["Unlimited properties", "Unlimited tickets", "Unlimited recurring tasks", "Full expense history", "Priority support", "Export to CSV (coming soon)"];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <LogoIcon className="w-7 h-7" />
            <span className="font-heading font-bold text-lg">PropKeep</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground mb-3">Simple, honest pricing</h1>
          <p className="text-muted-foreground text-lg">Start free. Upgrade when you grow.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Free</p>
              <div className="flex items-end gap-1">
                <span className="font-heading text-4xl font-bold">$0</span>
                <span className="text-muted-foreground mb-1">/forever</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Perfect for getting started with one property.</p>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="block text-center bg-gray-100 text-foreground font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors text-sm">
              Get started free
            </Link>
          </div>

          {/* Plus */}
          <div className="bg-primary rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">BEST VALUE</div>
            <div className="mb-6">
              <p className="text-sm font-semibold text-blue-200 uppercase tracking-wide mb-2">PropKeep Plus</p>
              <div className="flex items-end gap-1">
                <span className="font-heading text-4xl font-bold">$49</span>
                <span className="text-blue-200 mb-1">/year</span>
              </div>
              <p className="text-sm text-blue-200 mt-2">That&apos;s $4/month to manage your entire portfolio.</p>
            </div>
            <ul className="space-y-3 mb-8">
              {PLUS_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-200 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link href="/checkout" className="block text-center bg-white text-primary font-semibold py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
              Upgrade to Plus
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Secure payment via Stripe · Cancel anytime · No hidden fees
        </p>
      </div>
    </div>
  );
}
