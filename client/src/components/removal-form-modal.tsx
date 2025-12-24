import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Download, ExternalLink, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RemovalFormModalProps {
  exposureId: string | null;
  onClose: () => void;
}

export default function RemovalFormModal({ exposureId, onClose }: RemovalFormModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { data: formData, isLoading } = useQuery({
    queryKey: ["/api/exposures", exposureId, "removal-form"],
    enabled: !!exposureId,
  });

  const copyToClipboard = async () => {
    if (formData?.formTemplate) {
      await navigator.clipboard.writeText(formData.formTemplate);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The removal request has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadAsText = () => {
    if (formData?.formTemplate) {
      const blob = new Blob([formData.formTemplate], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.broker.name}-removal-request.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Download started",
        description: "Your removal request has been downloaded.",
      });
    }
  };

  return (
    <Dialog open={!!exposureId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Personalized Removal Request</DialogTitle>
          <DialogDescription>
            Use this pre-filled form to request removal of your data from {formData?.broker.name}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Broker Info */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{formData?.broker.name}</h3>
                {formData?.broker.optOutUrl && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(formData.broker.optOutUrl, '_blank')}
                    data-testid="button-open-optout-url"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Go to Opt-Out Page
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{formData?.broker.optOutProcess}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-muted-foreground">
                  Processing Time: <span className="text-foreground">{formData?.broker.estimatedProcessingTime}</span>
                </span>
                <span className="text-muted-foreground">
                  Difficulty: <span className="text-foreground">{formData?.broker.difficultyRating}/5</span>
                </span>
              </div>
            </div>

            {/* Required Information */}
            <div>
              <h4 className="font-medium mb-2">Required Information</h4>
              <div className="flex flex-wrap gap-2">
                {formData?.requiredInfo?.map((info: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {info}
                  </span>
                ))}
              </div>
            </div>

            {/* Pre-filled Form */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Pre-filled Removal Request</h4>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={copyToClipboard}
                    data-testid="button-copy-form"
                  >
                    {copied ? (
                      <><CheckCircle className="w-4 h-4 mr-2" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" /> Copy</>
                    )}
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={downloadAsText}
                    data-testid="button-download-form"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg border border-border">
                <pre className="whitespace-pre-wrap text-sm font-mono">{formData?.formTemplate}</pre>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Next Steps</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>Copy the removal request above or download it as a text file</li>
                <li>Click "Go to Opt-Out Page" to visit {formData?.broker.name}'s removal page</li>
                <li>Follow their specific opt-out process and paste/submit the request</li>
                <li>Keep track of confirmation emails and response times</li>
              </ol>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
