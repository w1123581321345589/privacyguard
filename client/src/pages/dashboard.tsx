import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Shield, LayoutDashboard, Search, CheckSquare, Book, GraduationCap, Settings, User, Bell, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import PrivacyScore from "@/components/privacy-score";
import ScanResults from "@/components/scan-results";
import RemovalProgress from "@/components/removal-progress";
import OptOutGuides from "@/components/opt-out-guides";
import Education from "@/components/education";
import type { User as UserType } from "@shared/schema";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<UserType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("privacyguard_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const { data: latestScan } = useQuery({
    queryKey: ["/api/users", user?.id, "latest-scan"],
    enabled: !!user?.id,
  });

  const startScanMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not found");
      const response = await apiRequest("POST", "/api/scans", { userId: user.id });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "latest-scan"] });
      toast({
        title: "New scan started",
        description: "We're scanning data broker sites for your information",
      });
    },
    onError: () => {
      toast({
        title: "Failed to start scan",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "scan-results", label: "Scan Results", icon: Search },
    { id: "removal-progress", label: "Removal Progress", icon: CheckSquare },
    { id: "opt-out-guides", label: "Opt-Out Guides", icon: Book },
    { id: "education", label: "Privacy Education", icon: GraduationCap },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">PrivacyGuard</h1>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="sidebar w-64 bg-card border-r border-border flex-shrink-0" data-testid="sidebar">
          <div className="p-6 border-b border-border">
            <div className="flex items-center">
              <Shield className="text-primary text-2xl mr-3" />
              <span className="text-xl font-bold">PrivacyGuard</span>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
            <button className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition" data-testid="nav-settings">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </button>
          </nav>

          <div className="absolute bottom-0 w-64 p-4 border-t border-border">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="text-primary w-5 h-5" />
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-foreground" data-testid="text-user-name">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-muted-foreground">Premium Plan</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-card border-b border-border px-8 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Privacy Dashboard</h1>
                <p className="text-sm text-muted-foreground">Monitor and manage your digital footprint</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-muted rounded-lg transition" data-testid="button-notifications">
                  <Bell className="text-muted-foreground w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                </button>
                <Button 
                  className="font-medium" 
                  data-testid="button-run-scan"
                  onClick={() => startScanMutation.mutate()}
                  disabled={startScanMutation.isPending}
                >
                  <RotateCcw className={`mr-2 w-4 h-4 ${startScanMutation.isPending ? 'animate-spin' : ''}`} />
                  {startScanMutation.isPending ? "Starting Scan..." : "Run New Scan"}
                </Button>
              </div>
            </div>
          </header>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "overview" && <PrivacyScore user={user} latestScan={latestScan} />}
            {activeTab === "scan-results" && <ScanResults latestScan={latestScan} />}
            {activeTab === "removal-progress" && <RemovalProgress latestScan={latestScan} />}
            {activeTab === "opt-out-guides" && <OptOutGuides />}
            {activeTab === "education" && <Education />}
          </div>
        </main>
      </div>
    </div>
  );
}
