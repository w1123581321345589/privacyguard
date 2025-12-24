import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ExternalLink, ChevronDown, Users, Search, CheckCircle, CreditCard, Database, Filter, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { dataBrokerCategories, priorityColors, categoryIcons } from "@/lib/data-brokers";
import RemovalFormModal from "./removal-form-modal";
import type { Scan } from "@shared/schema";

interface ScanResultsProps {
  latestScan?: Scan;
}

export default function ScanResults({ latestScan }: ScanResultsProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedExposureId, setSelectedExposureId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: scanResults, isLoading } = useQuery<{ exposures: any[] }>({
    queryKey: ["/api/scans", latestScan?.id, "results"],
    enabled: !!latestScan?.id && latestScan.status === "completed",
  });

  const startRemovalMutation = useMutation({
    mutationFn: async (scanId: string) => {
      const response = await apiRequest("POST", `/api/scans/${scanId}/remove`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Removal process started",
        description: "We're now working to remove your data from all identified brokers.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/scans"] });
    },
    onError: (error) => {
      toast({
        title: "Error starting removal process",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!latestScan) {
    return (
      <div className="text-center py-12">
        <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No scan results found</h2>
        <p className="text-muted-foreground">Start your first privacy scan to see results here.</p>
      </div>
    );
  }

  if (latestScan.status === "running") {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Scanning in progress...</h2>
          <p className="text-muted-foreground">
            We're scanning {latestScan.sitesScanned || 0} of 420 data broker sites
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-16 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const exposures = scanResults?.exposures || [];
  const filteredExposures = selectedFilter === "all" 
    ? exposures 
    : exposures.filter(e => e.broker?.priority === selectedFilter);

  const priorityCounts = {
    all: exposures.length,
    high: exposures.filter(e => e.broker?.priority === "high").length,
    medium: exposures.filter(e => e.broker?.priority === "medium").length,
    low: exposures.filter(e => e.broker?.priority === "low").length,
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'people-search': return Users;
      case 'marketing': return Search;
      case 'credit': return CreditCard;
      default: return Database;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Scan Results</h2>
        <p className="text-muted-foreground">
          Found {exposures.length} data broker sites with your personal information
        </p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="text-muted-foreground w-4 h-4" />
              <span className="text-sm font-medium text-foreground">Filter:</span>
            </div>
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
              data-testid="filter-all"
            >
              All ({priorityCounts.all})
            </Button>
            <Button
              variant={selectedFilter === "high" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("high")}
              data-testid="filter-high"
            >
              High Priority ({priorityCounts.high})
            </Button>
            <Button
              variant={selectedFilter === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("medium")}
              data-testid="filter-medium"
            >
              Medium Priority ({priorityCounts.medium})
            </Button>
            <Button
              variant={selectedFilter === "low" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("low")}
              data-testid="filter-low"
            >
              Low Priority ({priorityCounts.low})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Start Removal CTA */}
      {exposures.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to remove your data?
                </h3>
                <p className="text-muted-foreground">
                  Start the automated removal process for all {exposures.length} identified exposures.
                </p>
              </div>
              <Button
                onClick={() => startRemovalMutation.mutate(latestScan.id)}
                disabled={startRemovalMutation.isPending}
                className="ml-4"
                data-testid="button-start-removal"
              >
                {startRemovalMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting...
                  </>
                ) : (
                  "Start Removal Process"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Broker Cards */}
      <div className="space-y-4">
        {filteredExposures.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No {selectedFilter !== "all" ? `${selectedFilter} priority ` : ""}exposures found
              </h3>
              <p className="text-muted-foreground">
                {selectedFilter !== "all" 
                  ? "Try selecting a different filter to see more results."
                  : "Great news! We didn't find your data on any broker sites."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredExposures.map((exposure) => {
            const broker = exposure.broker;
            if (!broker) return null;

            const CategoryIcon = getCategoryIcon(broker.category);
            const priorityColor = priorityColors[broker.priority as keyof typeof priorityColors];

            return (
              <Card key={exposure.id} className="hover:shadow-lg transition-shadow" data-testid={`card-broker-${broker.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${priorityColor}/10 rounded-lg flex items-center justify-center`}>
                        <CategoryIcon className={`text-${priorityColor} text-xl w-6 h-6`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-broker-name-${broker.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          {broker.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {dataBrokerCategories[broker.category as keyof typeof dataBrokerCategories] || broker.category}
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant={broker.priority === 'high' ? 'destructive' : broker.priority === 'medium' ? 'default' : 'secondary'}>
                            {broker.priority.charAt(0).toUpperCase() + broker.priority.slice(1)} Priority
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Processing time: {broker.estimatedProcessingTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" data-testid={`button-remove-${broker.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      Remove Data
                    </Button>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Exposed Information:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(exposure.exposedData as string[]).map((dataType, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dataType}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedExposureId(exposure.id)}
                          data-testid={`button-generate-form-${broker.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <FileText className="mr-2 w-4 h-4" />
                          Generate Removal Form
                        </Button>
                        <a 
                          href={broker.optOutUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-primary hover:underline flex items-center"
                          data-testid={`link-opt-out-${broker.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <ExternalLink className="mr-1 w-3 h-3" />
                          View Manual Opt-Out Guide
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}

        {filteredExposures.length > 5 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Showing {Math.min(5, filteredExposures.length)} of {filteredExposures.length} data brokers
            </p>
            <Button variant="outline" data-testid="button-load-more">
              Load More Results
            </Button>
          </div>
        )}
      </div>

      {/* Removal Form Modal */}
      <RemovalFormModal 
        exposureId={selectedExposureId}
        onClose={() => setSelectedExposureId(null)}
      />
    </div>
  );
}
