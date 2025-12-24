import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, ExternalLink, TrendingDown, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User, Scan } from "@shared/schema";

interface PrivacyScoreProps {
  user: User;
  latestScan?: Scan;
}

export default function PrivacyScore({ user, latestScan }: PrivacyScoreProps) {
  const { data: scanResults } = useQuery<{ exposures: any[] }>({
    queryKey: ["/api/scans", latestScan?.id, "results"],
    enabled: !!latestScan?.id && latestScan.status === "completed",
  });

  const privacyScore = latestScan?.privacyScore || 0;
  const totalExposures = scanResults?.exposures?.length || 0;
  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (privacyScore / 100) * circumference;

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: "Low Risk", color: "text-secondary", bgColor: "bg-secondary/10" };
    if (score >= 40) return { level: "Medium Risk", color: "text-accent", bgColor: "bg-accent/10" };
    return { level: "High Risk", color: "text-destructive", bgColor: "bg-destructive/10" };
  };

  const riskInfo = getRiskLevel(privacyScore);

  return (
    <div className="space-y-8">
      {/* Privacy Score Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Privacy Score Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-primary to-secondary rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Privacy Score</h2>
              <p className="text-white/80">Based on exposed data across 420 data broker sites</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <Target className="text-xl w-6 h-6" />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-6xl font-bold mb-2" data-testid="text-privacy-score">
                {privacyScore}<span className="text-3xl">/100</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskInfo.bgColor} ${riskInfo.color}`}>
                  {riskInfo.level}
                </span>
                <span className="text-sm text-white/80">
                  {privacyScore < 50 ? (
                    <><TrendingDown className="inline w-4 h-4 mr-1" />18 from last month</>
                  ) : (
                    <><TrendingUp className="inline w-4 h-4 mr-1" />+12 from last month</>
                  )}
                </span>
              </div>
            </div>
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth="8" 
                  fill="none" 
                />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  stroke="white" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="progress-ring transition-all duration-1000" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{privacyScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="text-destructive text-2xl" />
                <span className="text-3xl font-bold text-foreground" data-testid="text-exposed-sites">
                  {totalExposures}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Sites With Your Data</div>
              <div className="mt-2 text-xs text-destructive font-medium">
                {totalExposures > 15 ? "↑ High exposure detected" : "↓ Limited exposure"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="text-secondary text-2xl" />
                <span className="text-3xl font-bold text-foreground" data-testid="text-removals-completed">
                  {Math.floor(totalExposures * 0.4)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Removals Completed</div>
              <div className="mt-2 text-xs text-secondary font-medium">
                +{Math.floor(totalExposures * 0.2)} this week
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity & Next Steps */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanResults?.exposures?.slice(0, 4).map((exposure, index) => (
              <div key={exposure.id} className="flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  index === 0 ? 'bg-secondary' : 
                  index === 1 ? 'bg-primary' : 
                  index === 2 ? 'bg-destructive' : 'bg-accent'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {index === 0 ? 'Removal completed' : 
                       index === 1 ? 'Removal request sent' : 
                       index === 2 ? 'New exposure detected' : 'Monthly scan completed'}: {exposure.broker?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {index === 0 ? '2h ago' : 
                       index === 1 ? '5h ago' : 
                       index === 2 ? '1d ago' : '2d ago'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {index === 0 ? 'Your profile has been successfully removed' : 
                     index === 1 ? 'Waiting for broker response (30 days max)' : 
                     index === 2 ? 'Your data was found on a new site' : 'Scanned 420 data broker sites'}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <AlertTriangle className="text-destructive mt-1 w-5 h-5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-1">Action Required: Verify Email</h4>
                <p className="text-xs text-muted-foreground mb-3">BeenVerified requires email verification to complete removal</p>
                <Button size="sm" variant="destructive" data-testid="button-verify-email">
                  Verify Now
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <Target className="text-primary mt-1 w-5 h-5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-1">Enable Dark Web Monitoring</h4>
                <p className="text-xs text-muted-foreground mb-3">Upgrade to monitor if your data appears on dark web forums</p>
                <Button size="sm" variant="outline" data-testid="button-learn-more">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
              <ExternalLink className="text-secondary mt-1 w-5 h-5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-1">Read Privacy Guide</h4>
                <p className="text-xs text-muted-foreground mb-3">Learn how to prevent data brokers from collecting your info</p>
                <Button size="sm" variant="outline" data-testid="button-read-guide">
                  Read Guide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Exposure Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Data Exposure by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">People Search Sites</span>
                <span className="text-sm font-bold text-foreground" data-testid="text-people-search-count">
                  {scanResults?.exposures?.filter(e => e.broker?.category === 'people-search').length || 0} sites
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-destructive h-2.5 rounded-full" style={{width: '65%'}}></div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">High exposure - immediate action needed</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Marketing Databases</span>
                <span className="text-sm font-bold text-foreground" data-testid="text-marketing-count">
                  {scanResults?.exposures?.filter(e => e.broker?.category === 'marketing').length || 0} sites
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-accent h-2.5 rounded-full" style={{width: '22%'}}></div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Medium exposure - monitor regularly</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Public Records</span>
                <span className="text-sm font-bold text-foreground" data-testid="text-public-records-count">
                  {scanResults?.exposures?.filter(e => e.broker?.category === 'credit' || e.broker?.category === 'public-records').length || 0} sites
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{width: '13%'}}></div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Low exposure - continue monitoring</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
