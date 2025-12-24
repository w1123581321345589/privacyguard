import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, AlertTriangle, Loader2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Scan } from "@shared/schema";

interface RemovalProgressProps {
  latestScan?: Scan;
}

export default function RemovalProgress({ latestScan }: RemovalProgressProps) {
  const { data: removalProgress, isLoading } = useQuery<{ stats: any; requests: any[] }>({
    queryKey: ["/api/scans", latestScan?.id, "removal-progress"],
    enabled: !!latestScan?.id,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });

  if (!latestScan) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No removal progress available</h2>
        <p className="text-muted-foreground">Start a scan and removal process to track progress here.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const stats = removalProgress?.stats || {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    actionRequired: 0,
  };

  const requests = removalProgress?.requests || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Loader2;
      case 'action-required': return AlertTriangle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-secondary';
      case 'in-progress': return 'text-primary';
      case 'action-required': return 'text-destructive';
      case 'pending': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'secondary' as const;
      case 'in-progress': return 'default' as const;
      case 'action-required': return 'destructive' as const;
      case 'pending': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Removal Progress</h2>
        <p className="text-muted-foreground">Track the status of all data removal requests</p>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card data-testid="card-total-sites">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-foreground mb-2">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Sites</div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20" data-testid="card-completed">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-secondary mb-2">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20" data-testid="card-in-progress">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-primary mb-2">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card className="border-accent/20" data-testid="card-pending">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-accent mb-2">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Progress</span>
            <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="mb-4" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{stats.completed} of {stats.total} removals completed</span>
            <span className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {stats.completed > 0 ? "Making progress" : "Starting removals"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Removal Timeline</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="default" data-testid="filter-timeline-all">All</Button>
            <Button size="sm" variant="outline" data-testid="filter-timeline-completed">Completed</Button>
            <Button size="sm" variant="outline" data-testid="filter-timeline-progress">In Progress</Button>
            <Button size="sm" variant="outline" data-testid="filter-timeline-pending">Pending</Button>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No removal requests yet</h3>
              <p className="text-muted-foreground">
                Start the removal process to see progress updates here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.slice(0, 10).map((request, index) => {
                const StatusIcon = getStatusIcon(request.status);
                const isLastItem = index === Math.min(9, requests.length - 1);

                return (
                  <div key={request.id} className="relative flex gap-6" data-testid={`timeline-item-${index}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-4 border-background ring-2 ${
                        request.status === 'completed' ? 'bg-secondary ring-secondary' :
                        request.status === 'in-progress' ? 'bg-primary ring-primary badge-pulse' :
                        request.status === 'action-required' ? 'bg-destructive ring-destructive' :
                        'bg-accent ring-accent'
                      }`}></div>
                      {!isLastItem && <div className="w-0.5 h-full bg-border mt-2"></div>}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground" data-testid={`text-broker-${index}`}>
                            {request.broker?.name} - {
                              request.status === 'completed' ? 'Removal Completed' :
                              request.status === 'in-progress' ? 'Awaiting Response' :
                              request.status === 'action-required' ? 'Action Required' :
                              'Queued for Removal'
                            }
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {request.notes || 'Processing removal request'}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground" data-testid={`time-${index}`}>
                          {request.status === 'completed' && request.completedAt 
                            ? new Date(request.completedAt).toLocaleDateString()
                            : request.submittedAt 
                            ? new Date(request.submittedAt).toLocaleDateString()
                            : 'Queued'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          <StatusIcon className={`mr-1 w-3 h-3 ${
                            request.status === 'in-progress' ? 'animate-spin' : ''
                          }`} />
                          {request.status === 'completed' ? 'Completed' :
                           request.status === 'in-progress' ? 'In Progress' :
                           request.status === 'action-required' ? 'Action Required' :
                           'Pending'}
                        </Badge>
                        {request.status === 'action-required' && (
                          <Button size="sm" variant="destructive" data-testid={`action-button-${index}`}>
                            {request.actionRequired === 'email-verification' ? 'Verify Email' :
                             request.actionRequired === 'id-verification' ? 'Verify ID' :
                             'Take Action'}
                          </Button>
                        )}
                        {request.status === 'in-progress' && (
                          <span className="text-xs text-muted-foreground">
                            Est. completion: {request.broker?.estimatedProcessingTime}
                          </span>
                        )}
                      </div>
                      {request.status === 'in-progress' && (
                        <div className="mt-3 w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{width: '15%'}}></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {requests.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline" data-testid="button-load-more-timeline">
                    Load More Timeline Items
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
