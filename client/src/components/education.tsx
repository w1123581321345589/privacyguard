import { useState } from "react";
import { Book, Clock, User, Lightbulb, ExternalLink, ChevronDown, Shield, Lock, Eye, AlertCircle, CheckCircle, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Education() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  const articles = [
    {
      id: 1,
      title: "How Data Brokers Collect Your Information",
      category: "How-To",
      excerpt: "Understanding the methods data brokers use to gather and sell your personal data.",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      alt: "Digital security and data protection concept",
      categoryColor: "bg-secondary/10 text-secondary"
    },
    {
      id: 2,
      title: "Social Media Privacy Settings Checklist",
      category: "Guide",
      excerpt: "Step-by-step guide to maximize privacy on Facebook, Instagram, Twitter, and LinkedIn.",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      alt: "Person working on laptop with focus on digital privacy",
      categoryColor: "bg-accent/10 text-accent"
    },
    {
      id: 3,
      title: "Preventing Future Data Collection",
      category: "Best Practices",
      excerpt: "Proactive strategies to minimize your digital footprint before it becomes a problem.",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      alt: "Cybersecurity concept with data protection elements",
      categoryColor: "bg-primary/10 text-primary"
    }
  ];

  const faqs = [
    {
      id: "q1",
      question: "How long does it take to remove my data?",
      answer: "Most data brokers legally have 30-45 days to respond to removal requests. Some sites remove data within hours, while others may take several weeks. Our automated system handles all the follow-ups to ensure removal is completed."
    },
    {
      id: "q2",
      question: "Will my data reappear after removal?",
      answer: "Unfortunately, yes. Data brokers often refresh their databases and may re-acquire your information from other sources. This is why we provide continuous monitoring and automatic re-removal requests to keep your data off these sites."
    },
    {
      id: "q3",
      question: "Is my information safe with PrivacyGuard?",
      answer: "Absolutely. We use bank-level encryption to protect all personal information. We never sell, share, or use your data for any purpose other than removing it from broker sites. Your privacy is our top priority."
    },
    {
      id: "q4",
      question: "Can I do this manually instead?",
      answer: "Yes, but it's extremely time-consuming. Our research shows it takes 300+ hours annually to manually opt out of all major data brokers. Most people don't have the time to track down hundreds of sites and follow up consistently."
    },
    {
      id: "q5",
      question: "What if a broker refuses to remove my data?",
      answer: "We escalate to legal compliance teams and use state privacy laws (CCPA, GDPR, etc.) to enforce removal. In rare cases where brokers don't comply, we document everything and can provide evidence for legal action if needed."
    }
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Privacy Education Center</h2>
        <p className="text-muted-foreground">
          Learn how to protect your digital privacy and prevent data collection
        </p>
      </div>

      {/* Featured Article */}
      <Card className="overflow-hidden shadow-lg" data-testid="card-featured-article">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Modern workspace with privacy and security concept" 
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <Badge className="bg-primary/10 text-primary mb-4">Featured Guide</Badge>
            <h3 className="text-2xl font-bold text-foreground mt-4 mb-3">
              Complete Guide to Digital Privacy in 2025
            </h3>
            <p className="text-muted-foreground mb-6">
              Learn comprehensive strategies to protect your personal information online, from data brokers to social media privacy settings.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center">
                <Clock className="mr-2 w-4 h-4" />
                15 min read
              </span>
              <span className="flex items-center">
                <User className="mr-2 w-4 h-4" />
                Expert Guide
              </span>
            </div>
            <Button data-testid="button-read-featured">
              Read Full Guide
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Article Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-article-${article.id}`}>
            <img 
              src={article.image} 
              alt={article.alt} 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <Badge className={`${article.categoryColor} mb-3 text-xs font-semibold`}>
                {article.category}
              </Badge>
              <h4 className="text-lg font-semibold text-foreground mt-3 mb-2">
                {article.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="mr-1 w-3 h-3" />
                  {article.readTime}
                </span>
                <Button variant="link" size="sm" className="p-0 h-auto font-medium" data-testid={`button-read-article-${article.id}`}>
                  Read Article →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Privacy Tips Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20" data-testid="card-tip-immediate">
          <CardContent className="p-6">
            <Shield className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-3">Immediate Actions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                Enable two-factor authentication on all accounts
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                Review and update social media privacy settings
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                Use privacy-focused search engines like DuckDuckGo
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20" data-testid="card-tip-prevention">
          <CardContent className="p-6">
            <Lock className="w-8 h-8 text-secondary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-3">Prevention Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <Target className="w-4 h-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                Limit personal information sharing online
              </li>
              <li className="flex items-start">
                <Target className="w-4 h-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                Use different email addresses for different purposes
              </li>
              <li className="flex items-start">
                <Target className="w-4 h-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                Regularly review app permissions on devices
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20" data-testid="card-tip-monitoring">
          <CardContent className="p-6">
            <Eye className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-3">Ongoing Monitoring</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <AlertCircle className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                Set up Google Alerts for your name and personal info
              </li>
              <li className="flex items-start">
                <AlertCircle className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                Monitor credit reports for unauthorized activity
              </li>
              <li className="flex items-start">
                <AlertCircle className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                Check data broker sites quarterly
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq) => (
            <Collapsible key={faq.id} open={openFAQ === faq.id} onOpenChange={() => toggleFAQ(faq.id)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-6 border border-border rounded-lg hover:bg-muted"
                  data-testid={`button-faq-${faq.id}`}
                >
                  <span className="font-medium text-foreground text-left">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${
                    openFAQ === faq.id ? 'rotate-180' : ''
                  }`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-4 pt-2" data-testid={`content-faq-${faq.id}`}>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      {/* Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Privacy Tools</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.eff.org/privacybadger" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-testid="link-privacy-badger">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Privacy Badger (Browser Extension)
                  </a>
                </li>
                <li>
                  <a href="https://duckduckgo.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-testid="link-duckduckgo">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    DuckDuckGo (Private Search Engine)
                  </a>
                </li>
                <li>
                  <a href="https://www.torproject.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-testid="link-tor">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Tor Browser (Anonymous Browsing)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-testid="link-ccpa">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    California Consumer Privacy Act (CCPA)
                  </a>
                </li>
                <li>
                  <a href="https://gdpr.eu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-testid="link-gdpr">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    General Data Protection Regulation (GDPR)
                  </a>
                </li>
                <li>
                  <a href="https://www.ftc.gov/tips-advice/business-center/privacy-and-security" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-testid="link-ftc">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    FTC Privacy & Security Guidelines
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
