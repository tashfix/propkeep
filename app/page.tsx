import Link from "next/link";
import { Wrench, Building2, Receipt, Bell, CheckCircle, ArrowRight } from "lucide-react";
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
      <section className="relative overflow-hidden min-h-[640px] flex items-center">

        {/* ── Full-bleed photo backsplash ── */}
        {/* Photo: Alef Morais / Unsplash — woman laughing at golden-hour ocean */}
        <div className="absolute inset-0 select-none pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1765813137535-2835d6f5e335?w=2400&q=88&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          {/* Left band: full white to protect copy legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-white from-[44%] via-white/55 via-[62%] to-transparent" />
          {/* Top fade: blends with sticky nav */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent" />
          {/* Bottom fade: blends into features section */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* ── Content: two-column grid ── */}
        <div className="relative w-full max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">

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
                className="inline-flex items-center justify-center bg-white/80 backdrop-blur-sm text-foreground font-semibold px-8 py-3.5 rounded-xl hover:bg-white transition-all border border-gray-200 text-base"
              >
                View pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free for 1 property · No credit card required
            </p>
          </div>

          {/* RIGHT — floating PropKeep UI mockup cards */}
          <div className="hidden lg:block relative h-[480px]">

            {/* Card 1: Ticket resolved */}
            <div className="absolute top-6 left-0 w-[288px] bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl shadow-black/10 border border-white/80">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-none mb-0.5">Ticket resolved</p>
                  <p className="text-xs text-gray-500">Water heater leak · Unit 2A</p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">Just now</span>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
                <span className="text-xs text-gray-500">Repair cost logged</span>
                <span className="text-xs font-semibold text-gray-800">$185.00</span>
              </div>
            </div>

            {/* Card 2: Properties at-a-glance */}
            <div className="absolute top-[168px] left-[28px] w-[308px] bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl shadow-black/10 border border-white/80">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">Your Properties</p>
                <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">All clear ✓</span>
              </div>
              <div className="space-y-2 mb-3">
                {[
                  { name: "Speedway Duplex", detail: "2 units · 0 open tickets" },
                  { name: "Sunshine Dr Rental", detail: "1 unit · 0 open tickets" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center gap-2.5 px-2.5 py-2 bg-gray-50 rounded-xl">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-800 leading-none mb-0.5">{p.name}</p>
                      <p className="text-[10px] text-gray-500">{p.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2.5 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
                <span><strong className="text-gray-800">3</strong> tenants</span>
                <span><strong className="text-gray-800">$4,820</strong> tracked</span>
                <span><strong className="text-gray-800">0</strong> overdue</span>
              </div>
            </div>

            {/* Card 3: Monthly expenses chip */}
            <div className="absolute top-[378px] left-[56px] bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/10 border border-white/80">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Monthly Expenses</p>
              <p className="text-[28px] font-bold text-gray-900 leading-none mb-1">$4,820</p>
              <p className="text-xs text-primary font-medium">All receipts logged ↑</p>
            </div>

          </div>
        </div>

        {/* Photo credit */}
        <span className="absolute bottom-3 right-4 text-[10px] text-gray-400/60 pointer-events-none select-none">
          Photo: Alef Morais / Unsplash
        </span>
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
