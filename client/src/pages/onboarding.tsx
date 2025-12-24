import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Info, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";
import type { InsertUser, User } from "@shared/schema";

const step1Schema = insertUserSchema.pick({
  firstName: true,
  lastName: true,
  dateOfBirth: true,
  currentAddress: true,
  city: true,
  state: true,
  zipCode: true,
});

const step2Schema = insertUserSchema.pick({
  email: true,
  phone: true,
  previousAddresses: true,
});

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Partial<InsertUser>>({});
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const step1Form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      currentAddress: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const step2Form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      email: "",
      phone: "",
      previousAddresses: "",
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: InsertUser): Promise<User> => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: (user) => {
      toast({
        title: "Account created successfully!",
        description: "Starting your privacy scan...",
      });
      
      // Store user data in localStorage for the dashboard
      localStorage.setItem("privacyguard_user", JSON.stringify(user));
      
      // Start scan automatically
      startScanMutation.mutate(user.id);
    },
    onError: (error) => {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startScanMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", "/api/scans", { userId });
      return response.json();
    },
    onSuccess: () => {
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error starting scan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStep1Submit = (data: z.infer<typeof step1Schema>) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: z.infer<typeof step2Schema>) => {
    const fullUserData: InsertUser = {
      ...step1Data,
      ...data,
    } as InsertUser;
    
    createUserMutation.mutate(fullUserData);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setLocation("/");
    }
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center" data-testid="step-1-indicator">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-foreground">Personal Info</div>
              </div>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-4"></div>
            <div className="flex items-center" data-testid="step-2-indicator">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-muted-foreground">Contact Details</div>
              </div>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-4"></div>
            <div className="flex items-center" data-testid="step-3-indicator">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-muted-foreground">Confirm</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500" 
              style={{width: `${progressPercentage}%`}}
              data-testid="progress-bar"
            ></div>
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="bg-card rounded-xl shadow-lg p-8 border border-border" data-testid="step-1-form">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Let's Start Your Privacy Scan</h2>
              <p className="text-muted-foreground">We need some basic information to scan data broker sites for your exposed data</p>
            </div>

            <Form {...step1Form}>
              <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={step1Form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          First Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} data-testid="input-first-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step1Form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Last Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} data-testid="input-last-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={step1Form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date of Birth <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-date-of-birth" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step1Form.control}
                  name="currentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Current Address <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} data-testid="input-current-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-3 gap-3">
                  <FormField
                    control={step1Form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="City" {...field} data-testid="input-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step1Form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="State" {...field} data-testid="input-state" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step1Form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="ZIP" {...field} data-testid="input-zip" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-start">
                    <Info className="text-primary mt-1 mr-3 w-5 h-5" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Why we need this:</strong> Data brokers index information by name, location, and date of birth. We use this to accurately identify your profiles across their databases.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={goBack} data-testid="button-back">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button type="submit" data-testid="button-continue-step-1">
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className="bg-card rounded-xl shadow-lg p-8 border border-border" data-testid="step-2-form">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Contact Information</h2>
              <p className="text-muted-foreground">This helps us verify removal requests and send you updates</p>
            </div>

            <Form {...step2Form}>
              <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
                <FormField
                  control={step2Form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email Address <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step2Form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone Number <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step2Form.control}
                  name="previousAddresses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Addresses (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any previous addresses where you've lived in the past 5 years (one per line)" 
                          rows={3} 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-previous-addresses"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-2">
                        This helps us find older records that data brokers may still have
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
                  <div className="flex items-start">
                    <Lock className="text-secondary mt-1 mr-3 w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Your data is secure</p>
                      <p className="text-xs text-muted-foreground">
                        We use bank-level encryption to protect your information and never share it with third parties.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={goBack} data-testid="button-back-step-2">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createUserMutation.isPending || startScanMutation.isPending}
                    data-testid="button-start-scan"
                  >
                    {createUserMutation.isPending || startScanMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Starting Scan...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 w-4 h-4" />
                        Start Privacy Scan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
