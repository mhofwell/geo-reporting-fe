import { Button } from '@/components/ui/button';
import { BarChart3, Check } from 'lucide-react';

interface PricingProps {
  onGetStarted: () => void;
}

export function Pricing({ onGetStarted }: PricingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-primary/10">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={onGetStarted} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">GEO Reporting</span>
            </button>
            <div className="flex items-center gap-4 w-[176px] justify-end">
              <Button variant="outline" onClick={onGetStarted} className="w-[100px] flex-shrink-0">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you're ready
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Free Tier */}
          <div className="bg-card border rounded-xl p-8 space-y-6 hover:border-primary/50 transition-colors">
            <div>
              <h3 className="text-2xl font-bold">Free</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                Perfect for trying out GEO reporting
              </p>
            </div>

            <Button
              onClick={onGetStarted}
              variant="outline"
              className="w-full h-12 text-base"
            >
              Get Started
            </Button>

            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">1 free report per month</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">30 AI queries per report</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Share of Voice metrics</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Competitor analysis</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Basic insights</span>
              </div>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary rounded-xl p-8 space-y-6 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold">Pro</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-bold">$20</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                For teams serious about AI visibility
              </p>
            </div>

            <Button
              onClick={onGetStarted}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90"
            >
              Start Free Trial
            </Button>

            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">Unlimited reports</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">50 AI queries per report</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Advanced analytics & insights</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Trend tracking over time</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Priority support</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Export to PDF & CSV</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">API access</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto mt-20 text-center">
          <p className="text-muted-foreground">
            Have questions? Check out our{' '}
            <a href="#faq" className="text-primary hover:underline">
              FAQ section
            </a>{' '}
            or contact us at{' '}
            <a href="mailto:hello@georeporting.com" className="text-primary hover:underline">
              hello@georeporting.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
