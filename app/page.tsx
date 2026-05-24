import Link from "next/link";
import { Wrench, Building2, Receipt, Bell, CheckCircle, ArrowRight, Users, Home } from "lucide-react";
import { LogoIcon } from "@/components/ui/logo-icon";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-8 h-8" />
            <span className="font-heading font-bold text-xl text-foreground">PropKeep</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-white via-slate-50/60 to-blue-50/20 pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.15fr] gap-14 items-center">

          {/* LEFT — headline + CTAs */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-blue-100">
              <CheckCircle className="w-4 h-4" />
              Built for independent landlords
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Never miss a repair.{" "}
              <span className="text-primary">Never lose a receipt.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
              PropKeep keeps your rental properties maintained, organized, and profitable —
              without the chaos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 text-base"
              >
                View demo dashboard <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center bg-gray-100 text-foreground font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-200 transition-all text-base"
              >
                View pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free for 1 property · No credit card required
            </p>
          </div>

          {/* RIGHT — PropKeep dashboard preview (matches real app UI) */}
          <div className="hidden lg:flex flex-col h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 bg-[#EEF2F6]">

            {/* ── App topbar ── */}
            <div className="bg-white border-b border-gray-100 px-4 h-12 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <LogoIcon className="w-5 h-5" />
                <span className="text-sm font-bold text-gray-900">PropKeep</span>
              </div>
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-gray-400" />
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">AJ</span>
                </div>
              </div>
            </div>

            {/* ── Dashboard body ── */}
            <div className="flex-1 p-4 space-y-3 overflow-hidden">

              {/* Greeting */}
              <div>
                <p className="text-sm font-semibold text-gray-800">Good morning, Alex 👋</p>
                <p className="text-[11px] text-gray-500">Sunday · 2 properties managed</p>
              </div>

              {/* Stats row — 4 tiles matching the real dashboard */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Tenants",  value: "3",     sub: "3 units",    Icon: Users,        grad: "from-blue-500 to-blue-600"    },
                  { label: "Tickets",  value: "0",     sub: "all clear",  Icon: CheckCircle,  grad: "from-green-500 to-green-600"  },
                  { label: "Overdue",  value: "0",     sub: "on track",   Icon: Bell,         grad: "from-amber-500 to-orange-500" },
                  { label: "Expenses", value: "$4.8k", sub: "this month", Icon: Receipt,      grad: "from-violet-500 to-purple-600"},
                ].map(({ label, value, sub, Icon, grad }) => (
                  <div key={label} className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${grad} flex items-center justify-center mb-2`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">{value}</p>
                    <p className="text-[9px] text-gray-500 leading-none">{label}</p>
                  </div>
                ))}
              </div>

              {/* Property card — mirrors real PropertiesTab card */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                {/* Street view placeholder */}
                <div className="h-[86px] bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 flex items-center justify-center relative">
                  <Building2 className="w-9 h-9 text-slate-400" />
                  <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-white/85 backdrop-blur-sm rounded px-1.5 py-0.5">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/><circle cx="12" cy="9" r="2.5" fill="white"/></svg>
                    <span className="text-[7px] text-gray-500 font-medium">Google Maps</span>
                  </div>
                </div>
                {/* Card content */}
                <div className="px-3 pt-2.5 pb-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-gray-900">Speedway Duplex</p>
                    <span className="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium shrink-0 ml-1">Multi-Unit</span>
                  </div>
                  <p className="text-[9px] text-gray-500 mb-2">3814 Speedway, Austin, TX 78751</p>
                  <div className="flex items-center gap-3 text-[9px]">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Home className="w-2.5 h-2.5" /> 2 units
                    </span>
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> 0 open tickets
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-white rounded-xl px-3 py-2.5 border border-gray-100 shadow-sm flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-800 leading-none mb-0.5">Water heater leak resolved</p>
                  <p className="text-[9px] text-gray-500">Unit 2A · $185.00 logged</p>
                </div>
                <span className="text-[9px] text-gray-400 shrink-0">Just now</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 bg-[#F8F9FA] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to manage your properties
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Stop juggling spreadsheets, texts, and sticky notes. PropKeep puts it all in one place.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-10 text-center text-white">
            <h2 className="font-heading text-3xl font-bold mb-4">
              Stop letting maintenance chaos cost you money
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Every missed maintenance task is a bigger repair bill. Every lost receipt is money you can&apos;t deduct.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all text-base"
            >
              Try the demo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6" />
            <span className="font-heading font-bold text-foreground">PropKeep</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PropKeep. Built for landlords.</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  { icon: Wrench, title: "Maintenance Tickets", description: "Create, assign, and resolve tickets per property. Track status, priority, and repair costs all in one place." },
  { icon: Building2, title: "Multi-Property Management", description: "Manage multiple properties and individual units. Keep tenant info, rent amounts, and details organized." },
  { icon: Receipt, title: "Expense Tracking", description: "Log repair costs and categorize expenses. Get a clear picture of what each property costs to maintain." },
  { icon: Bell, title: "Recurring Reminders", description: "Never forget HVAC filters, smoke detector checks, or seasonal tasks. Set intervals and stay on schedule." },
];
