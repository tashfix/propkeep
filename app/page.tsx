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
      <section className="relative pt-20 pb-28 px-6 overflow-hidden min-h-[580px] flex items-center">

        {/* ── Photo backsplash ── */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Stock photo: person relaxing by the sea — David Salamanca / Unsplash */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1633100695251-582bda45f305?w=2200&q=82&auto=format&fit=crop&crop=right"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-right"
          />
          {/* Left-to-right gradient: full white behind text → transparent to reveal photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-white from-[40%] via-white/80 via-[60%] to-white/0" />
          {/* Top + bottom feather to blend with nav and features section */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* ── Text content ── */}
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="max-w-xl">
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
        </div>

        {/* Photo credit */}
        <span className="absolute bottom-3 right-4 text-[10px] text-muted-foreground/50 pointer-events-none select-none">
          Photo: David Salamanca / Unsplash
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
