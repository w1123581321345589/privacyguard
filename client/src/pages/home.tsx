import { Link } from "wouter";
import { Shield, CheckCircle, ArrowRight, PlayCircle, Lock, Ban, Bolt, Users, Clock, Target, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="text-primary text-2xl mr-3" />
              <span className="text-xl font-bold text-foreground">PrivacyGuard</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition">How It Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition">Pricing</a>
              <Link href="/onboarding">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium" data-testid="button-get-started">
                  Get Started
                </button>
              </Link>
            </div>
            <button className="md:hidden text-foreground" data-testid="button-mobile-menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-background z-0"></div>
        <div 
          className="absolute inset-0 z-0 opacity-8"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.08
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
                <CheckCircle className="text-primary mr-2 w-4 h-4" />
                <span className="text-sm font-medium text-primary">Trusted by 50,000+ users</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Erase Your Digital Footprint in <span className="text-primary">Minutes</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Remove your personal information from 420+ data broker sites automatically. Stop spam calls, protect your privacy, and take back control of your digital identity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/onboarding">
                  <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold text-lg shadow-lg" data-testid="button-start-scan">
                    Start Free Scan
                    <ArrowRight className="ml-2 w-5 h-5 inline" />
                  </button>
                </Link>
                <button className="px-8 py-4 bg-card border-2 border-border text-foreground rounded-lg hover:border-primary transition font-semibold text-lg" data-testid="button-watch-demo">
                  Watch Demo
                  <PlayCircle className="ml-2 w-5 h-5 inline" />
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Lock className="text-secondary mr-2 w-4 h-4" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center">
                  <Ban className="text-secondary mr-2 w-4 h-4" />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center">
                  <Bolt className="text-secondary mr-2 w-4 h-4" />
                  <span>Results in 7 Days</span>
                </div>
              </div>
            </div>
            
            {/* Privacy exposure visualization */}
            <div className="hidden md:block relative">
              <div className="relative bg-gradient-to-br from-card to-muted rounded-2xl shadow-2xl p-8 border border-border">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-destructive/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-muted-foreground">Your Data Exposure</span>
                    <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-semibold">High Risk</span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold text-foreground" data-testid="text-sites-found">23 Sites Found</span>
                      <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-gradient-to-r from-destructive to-accent h-3 rounded-full" style={{width: '76%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="text-primary w-4 h-4" />
                        <span className="text-sm font-medium">Whitepages</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded">Exposed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="text-primary w-4 h-4" />
                        <span className="text-sm font-medium">Spokeo</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded">Exposed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="text-primary w-4 h-4" />
                        <span className="text-sm font-medium">BeenVerified</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded">Exposed</span>
                    </div>
                    <div className="text-center pt-2">
                      <span className="text-xs text-muted-foreground">+ 20 more sites...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2" data-testid="text-stat-brokers">420+</div>
              <div className="text-sm text-muted-foreground">Data Brokers Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2" data-testid="text-stat-time-saved">318hrs</div>
              <div className="text-sm text-muted-foreground">Saved Per Year</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2" data-testid="text-stat-success">97%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2" data-testid="text-stat-users">50K+</div>
              <div className="text-sm text-muted-foreground">Protected Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comprehensive Privacy Protection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to eliminate your digital footprint and protect your personal information
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition" data-testid="card-feature-scanning">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Automated Scanning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Scan 420+ data broker sites automatically to discover where your personal information is exposed online.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition" data-testid="card-feature-removal">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">One-Click Removal</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate and submit personalized removal requests to all identified data brokers with a single click.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition" data-testid="card-feature-tracking">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor removal progress in real-time with detailed status updates for each data broker.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition" data-testid="card-feature-monitoring">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Continuous Monitoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatic monthly re-scans ensure your data doesn't reappear after removal.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition" data-testid="card-feature-education">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Privacy Education</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access expert guides on digital privacy best practices and prevention strategies.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition" data-testid="card-feature-reminders">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5V11a1 1 0 00-1-1H9a1 1 0 00-1 1v6h2l4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Smart Reminders</h3>
              <p className="text-muted-foreground leading-relaxed">
                Email alerts for follow-ups, re-scans, and when action is required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple 4-step process to reclaim your digital privacy
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border z-0" style={{margin: '0 10%'}}></div>

            <div className="relative z-10 text-center" data-testid="step-signup">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Sign Up</h3>
              <p className="text-muted-foreground">Create your account and provide basic information for scanning</p>
            </div>

            <div className="relative z-10 text-center" data-testid="step-scan">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl font-bold text-secondary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Scan</h3>
              <p className="text-muted-foreground">AI scans 420+ data broker sites to find your exposed data</p>
            </div>

            <div className="relative z-10 text-center" data-testid="step-remove">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl font-bold text-accent-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Remove</h3>
              <p className="text-muted-foreground">Automated removal requests sent to all identified brokers</p>
            </div>

            <div className="relative z-10 text-center" data-testid="step-monitor">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl font-bold text-primary-foreground">4</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Monitor</h3>
              <p className="text-muted-foreground">Continuous monitoring ensures your data stays removed</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/onboarding">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold text-lg shadow-lg" data-testid="button-start-free-scan">
                Start Your Free Scan
                <ArrowRight className="ml-2 w-5 h-5 inline" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Take Control of Your Privacy Today
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join 50,000+ users who have successfully removed their data from hundreds of data broker sites
          </p>
          <Link href="/onboarding">
            <button className="px-8 py-4 bg-white text-primary rounded-lg hover:shadow-xl transition font-semibold text-lg" data-testid="button-get-started-cta">
              Get Started - It's Free
              <Shield className="ml-2 w-5 h-5 inline" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="text-primary text-2xl mr-3" />
                <span className="text-xl font-bold">PrivacyGuard</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional data removal service helping you reclaim your digital privacy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Privacy Guides</a></li>
                <li><a href="#" className="hover:text-primary transition">Data Broker List</a></li>
                <li><a href="#" className="hover:text-primary transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 PrivacyGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
