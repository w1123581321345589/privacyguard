import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ExternalLink, Users, Megaphone, CreditCard, Database, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { dataBrokerCategories, categoryIcons } from "@/lib/data-brokers";

export default function OptOutGuides() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dataBrokers, isLoading } = useQuery<any[]>({
    queryKey: ["/api/data-brokers"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-16 w-full" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const filteredBrokers = dataBrokers?.filter((broker: any) =>
    broker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    broker.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const brokersByCategory = filteredBrokers.reduce((acc: any, broker: any) => {
    if (!acc[broker.category]) {
      acc[broker.category] = [];
    }
    acc[broker.category].push(broker);
    return acc;
  }, {});

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'people-search': return Users;
      case 'marketing': return Megaphone;
      case 'credit': return CreditCard;
      default: return Database;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'people-search': return 'text-primary';
      case 'marketing': return 'text-secondary';
      case 'credit': return 'text-accent';
      default: return 'text-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Manual Opt-Out Guides</h2>
        <p className="text-muted-foreground">
          Step-by-step instructions for removing your data manually from each broker
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for a data broker..."
              className="pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-brokers"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(dataBrokerCategories).map(([category, label]) => {
          const count = brokersByCategory[category]?.length || 0;
          const CategoryIcon = getCategoryIcon(category);
          
          return (
            <Card key={category} className="text-center" data-testid={`card-category-${category}`}>
              <CardContent className="p-4">
                <CategoryIcon className={`w-6 h-6 mx-auto mb-2 ${getCategoryColor(category)}`} />
                <div className="text-2xl font-bold text-foreground">{count}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Guide Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(brokersByCategory).map(([category, brokers]) => {
          const brokerList = brokers as any[];
          const CategoryIcon = getCategoryIcon(category);
          const categoryLabel = dataBrokerCategories[category as keyof typeof dataBrokerCategories] || category;
          
          return (
            <Card key={category} data-testid={`card-guides-${category}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CategoryIcon className={`mr-3 w-5 h-5 ${getCategoryColor(category)}`} />
                  {categoryLabel}
                  <Badge variant="outline" className="ml-auto">
                    {brokerList.length} guides
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {brokerList.slice(0, 3).map((broker: any) => (
                  <a
                    key={broker.id}
                    href={broker.optOutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition group"
                    data-testid={`link-broker-${broker.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div>
                      <div className="font-medium text-foreground">{broker.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {broker.difficultyRating >= 4 ? 'ID verification required' :
                         broker.difficultyRating >= 3 ? 'Email verification required' :
                         broker.difficultyRating >= 2 ? '2-step process' :
                         'Simple form submission'}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge 
                        variant={broker.priority === 'high' ? 'destructive' : 
                                broker.priority === 'medium' ? 'default' : 'secondary'}
                        className="mr-2 text-xs"
                      >
                        {broker.priority}
                      </Badge>
                      <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${getCategoryColor(category)}`} />
                    </div>
                  </a>
                ))}
                
                {brokerList.length > 3 && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-center text-sm hover:underline"
                    data-testid={`button-view-all-${category}`}
                  >
                    View All {brokerList.length} Guides →
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Guide List */}
      {searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBrokers.length === 0 ? (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords or browse by category above.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBrokers.map((broker: any) => (
                  <div key={broker.id} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`result-${broker.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">{broker.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {dataBrokerCategories[broker.category as keyof typeof dataBrokerCategories]}
                        </Badge>
                        <Badge 
                          variant={broker.priority === 'high' ? 'destructive' : 
                                  broker.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {broker.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {broker.optOutProcess}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Processing time: {broker.estimatedProcessingTime} • 
                        Difficulty: {'★'.repeat(broker.difficultyRating)}{'☆'.repeat(5 - broker.difficultyRating)}
                      </div>
                    </div>
                    <a
                      href={broker.optOutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4"
                    >
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Opt Out
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Reference */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-2">High Priority Sites</h4>
              <p className="text-muted-foreground">
                Start with these sites as they expose the most sensitive information publicly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Processing Times</h4>
              <p className="text-muted-foreground">
                Most brokers respond within 30-45 days. Some are faster, others may take longer.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Follow-Up</h4>
              <p className="text-muted-foreground">
                Set reminders to check back in 3-6 months as data often reappears.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
