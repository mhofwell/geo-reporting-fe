import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BarChart3, Target, TrendingUp, AlertCircle, Sparkles, Clock, Zap, Shield } from 'lucide-react';

interface HomepageProps {
  onSubmit: (company: string, industry: string) => void;
  onLogin: () => void;
  onPricingClick: () => void;
  isLoading: boolean;
}

export function Homepage({ onSubmit, onLogin, onPricingClick, isLoading }: HomepageProps) {
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company.trim() && industry.trim()) {
      onSubmit(company.trim(), industry.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-primary/10">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => window.location.reload()} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">GEO Reporting</span>
            </button>
            <div className="flex items-center gap-4 w-[176px] justify-end">
              <button
                onClick={onPricingClick}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                Pricing
              </button>
              <Button variant="outline" onClick={onLogin} className="w-[100px] flex-shrink-0">
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Headline */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Generative Engine Optimization
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Discover Your Brand's Visibility in{' '}
            <span className="text-primary">AI Responses</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how Claude, GPT, and other AI models recommend your brand when customers search for solutions
          </p>
        </div>

        {/* Centered Form with Floating Elements */}
        <div className="relative max-w-xl mx-auto">
          {/* Form - Centered with higher z-index */}
          <form onSubmit={handleSubmit} className="w-full relative z-20">
            <div className="bg-gradient-to-br from-card to-primary/5 border-2 border-primary/20 hover:border-primary/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all space-y-5">
              <h2 className="text-2xl font-bold text-center">Get Your Free Report</h2>
              <div className="flex flex-col gap-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Nike"
                    disabled={isLoading}
                    required
                    className="h-14 text-base focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="industry" className="text-sm font-medium">
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Athletic Apparel"
                    disabled={isLoading}
                    required
                    className="h-14 text-base focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !company.trim() || !industry.trim()}
                size="lg"
                className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isLoading ? 'Analyzing...' : 'Analyze My Brand'}
              </Button>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>2-3 minutes</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Zap className="h-3.5 w-3.5" />
                  <span>30 AI queries</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  <span>No credit card</span>
                </div>
              </div>
            </div>
          </form>

          {/* Floating 3D Elements - Left Side (Desktop Only) */}
          <div className="hidden lg:block absolute left-0 top-0 w-full h-full pointer-events-none">

            {/* Share of Voice - Close (<< distance) */}
            <div className="absolute -left-[300px] top-0 animate-float" style={{ zIndex: 15, animationDelay: '0s' }}>
              <div className="w-56 p-5 bg-gradient-to-br from-card to-primary/10 border border-border rounded-xl shadow-xl transform hover:scale-105 transition-transform" style={{ transform: 'perspective(1000px) rotateY(15deg) rotateX(-2deg)' }}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>Share of Voice</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">64.2%</div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '64.2%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Positioning - Far (<<<< distance) */}
            <div className="absolute -left-[400px] top-32 animate-float-delayed" style={{ zIndex: 5, animationDelay: '1.5s' }}>
              <div className="w-48 p-4 bg-gradient-to-br from-card/60 to-secondary/10 border border-border/50 rounded-lg shadow-lg opacity-60 blur-[0.5px] transform" style={{ transform: 'perspective(1000px) rotateY(25deg) rotateX(5deg) scale(0.8)' }}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="h-3 w-3" />
                    <span>Brand Positioning</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs">Beginner-friendly</span>
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs">Templates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Analysis - Medium (<<< distance) */}
            <div className="absolute -left-[350px] top-64 animate-float" style={{ zIndex: 10, animationDelay: '0.8s' }}>
              <div className="w-52 p-4 bg-gradient-to-br from-card to-accent/10 border border-border rounded-lg shadow-lg opacity-75 transform hover:scale-105 transition-transform" style={{ transform: 'perspective(1000px) rotateY(20deg) rotateX(3deg) scale(0.88)' }}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Gap Analysis</span>
                  </div>
                  <div className="text-2xl font-bold text-destructive">15</div>
                  <div className="text-xs text-muted-foreground">queries missing your brand</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating 3D Elements - Right Side (Desktop Only) */}
          <div className="hidden lg:block absolute right-0 top-0 w-full h-full pointer-events-none">
            {/* Top Competitors - Close (<< distance) */}
            <div className="absolute -right-[300px] top-0 animate-float-delayed" style={{ zIndex: 15, animationDelay: '0.3s' }}>
              <div className="w-56 p-5 bg-gradient-to-br from-card to-accent/10 border border-border rounded-xl shadow-xl transform hover:scale-105 transition-transform" style={{ transform: 'perspective(1000px) rotateY(-15deg) rotateX(-2deg)' }}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="h-3.5 w-3.5" />
                    <span>Top Competitors</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Unbounce</span>
                      <span className="text-muted-foreground">45%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Instapage</span>
                      <span className="text-muted-foreground">38%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Trend - Far (<<<< distance) */}
            <div className="absolute -right-[400px] top-28 animate-float" style={{ zIndex: 5, animationDelay: '1.8s' }}>
              <div className="w-52 p-4 bg-gradient-to-br from-card/60 to-primary/10 border border-border/50 rounded-lg shadow-lg opacity-60 blur-[0.5px] transform" style={{ transform: 'perspective(1000px) rotateY(-25deg) rotateX(5deg) scale(0.8)' }}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>Visibility Trend</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[35, 55, 45, 70, 50, 65].map((height, i) => (
                      <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${height}px` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Attribute Analysis - Medium (<<< distance) */}
            <div className="absolute -right-[350px] top-56 animate-float-delayed" style={{ zIndex: 10, animationDelay: '1.1s' }}>
              <div className="w-56 p-5 bg-gradient-to-br from-card to-secondary/20 border border-border rounded-xl shadow-lg opacity-75 transform hover:scale-105 transition-transform" style={{ transform: 'perspective(1000px) rotateY(-20deg) rotateX(3deg) scale(0.88)' }}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Attribute Analysis</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Easy to use</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Templates</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Drag-drop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            What You'll Discover
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <div className="bg-card border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Share of Voice</h3>
              <p className="text-sm text-muted-foreground">
                Track how often your brand appears in AI responses compared to competitors
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-card border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Competitor Analysis</h3>
              <p className="text-sm text-muted-foreground">
                See which competitors appear alongside your brand and their positioning
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-card border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Positioning Insights</h3>
              <p className="text-sm text-muted-foreground">
                Understand how AI models perceive your brand's features and sentiment
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-card border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Gap Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Identify missed opportunities where competitors are mentioned but you're not
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Report Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">See What Your Report Looks Like</h2>
            <p className="text-lg text-muted-foreground">
              Get actionable insights in minutes with comprehensive AI visibility metrics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sample Metric 1 - Share of Voice */}
            <div className="bg-card/50 border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Share of Voice</h3>
                <span className="text-3xl font-bold text-primary">64.2%</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Claude</span>
                  <span className="font-medium">68.5%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '68.5%' }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">GPT-4</span>
                  <span className="font-medium">59.8%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '59.8%' }} />
                </div>
              </div>
            </div>

            {/* Sample Metric 2 - Top Competitors */}
            <div className="bg-card/50 border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Top Competitors Mentioned</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-semibold">
                      1
                    </div>
                    <span className="font-medium">Unbounce</span>
                  </div>
                  <span className="text-sm text-muted-foreground">45.2% SOV</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-semibold">
                      2
                    </div>
                    <span className="font-medium">Instapage</span>
                  </div>
                  <span className="text-sm text-muted-foreground">38.7% SOV</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-semibold">
                      3
                    </div>
                    <span className="font-medium">ClickFunnels</span>
                  </div>
                  <span className="text-sm text-muted-foreground">32.1% SOV</span>
                </div>
              </div>
            </div>

            {/* Sample Metric 3 - Brand Attributes */}
            <div className="bg-card/50 border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">How AI Describes Your Brand</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Easy to use
                </span>
                <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Drag-and-drop
                </span>
                <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Small business
                </span>
                <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Templates
                </span>
                <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Conversion focused
                </span>
                <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Beginner-friendly
                </span>
              </div>
            </div>

            {/* Sample Metric 4 - Key Insight */}
            <div className="bg-card/50 border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">AI-Generated Insight</h3>
              <div className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-sm font-medium mb-2">💡 Opportunity Detected</p>
                  <p className="text-sm text-muted-foreground">
                    Your brand is mentioned 23% more in "best landing page" queries vs. "landing page software" queries. Consider optimizing content for broader search terms.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>15 queries where competitors appear but you don't</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              This is sample data. Your actual report will contain real metrics from 30 AI queries across Claude and GPT-4.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-36">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about GEO reporting
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">What is Generative Engine Optimization (GEO)?</AccordionTrigger>
              <AccordionContent>
                GEO is the practice of optimizing your brand's visibility in AI-generated responses from models like Claude, ChatGPT, and other large language models. Just as SEO optimizes for search engines, GEO ensures your brand appears when AI assistants recommend solutions to users.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">How does the analysis work?</AccordionTrigger>
              <AccordionContent>
                We generate 30+ diverse queries across different categories (comparisons, features, use cases, etc.) relevant to your industry. These queries are sent to leading AI models, and we analyze the responses to track brand mentions, positioning, competitor presence, and sentiment. The entire process takes 2-3 minutes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">What's included in the free report?</AccordionTrigger>
              <AccordionContent>
                Your free report includes: Share of Voice metrics showing how often your brand appears, competitor analysis revealing which brands are mentioned alongside yours, attribute classification showing how AI describes your brand, positioning insights, and gap analysis identifying missed opportunities where competitors appear but you don't.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg">Which AI models do you analyze?</AccordionTrigger>
              <AccordionContent>
                We currently analyze responses from Claude (Anthropic) and GPT-4 (OpenAI), the two most widely-used AI assistants. We're constantly expanding our coverage to include additional models as they gain market adoption.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg">How accurate are the insights?</AccordionTrigger>
              <AccordionContent>
                Our analysis uses advanced AI models to parse and classify brand mentions, competitors, and attributes with high accuracy. While AI responses can vary over time, our reports provide a reliable snapshot of your current brand visibility and actionable insights for improvement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg">Do I need a credit card to get started?</AccordionTrigger>
              <AccordionContent>
                No! Your first analysis is completely free with no credit card required. Simply enter your company name and industry to receive a comprehensive visibility report.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 GEO Reporting. Track your brand's visibility in AI responses.
          </p>
        </div>
      </footer>
    </div>
  );
}
