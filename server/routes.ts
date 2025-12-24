import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { scanningService } from "./services/scanning";
import { removalService } from "./services/removal";
import { requireAuth } from "./auth-middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration/onboarding
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const user = await storage.createUser(userData);
      
      // Set session for new user
      req.session.userId = user.id;
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  // Get user by email - Protected: only authenticated users can access this
  app.get("/api/users/by-email/:email", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only allow users to access their own data
      if (user.id !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden - You can only access your own data" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Start privacy scan - Protected
  app.post("/api/scans", requireAuth, async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Verify the user is scanning for themselves
      if (userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden - You can only scan for yourself" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const scan = await scanningService.startScan(userId);
      res.json(scan);
    } catch (error) {
      res.status(500).json({ message: "Failed to start scan", error });
    }
  });

  // Get user's latest scan - Protected
  app.get("/api/users/:userId/latest-scan", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Verify the user is accessing their own data
      if (userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden - You can only access your own scans" });
      }
      
      const scan = await scanningService.getUserLatestScan(userId);
      
      if (!scan) {
        return res.status(404).json({ message: "No scans found for user" });
      }

      res.json(scan);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scan", error });
    }
  });

  // Get scan results with exposures - Protected
  app.get("/api/scans/:scanId/results", requireAuth, async (req, res) => {
    try {
      const { scanId } = req.params;
      
      // Get scan to verify ownership
      const scan = await storage.getScan(scanId);
      if (!scan) {
        return res.status(404).json({ message: "Scan not found" });
      }
      
      // Verify the user owns this scan
      if (scan.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden - You can only access your own scan results" });
      }
      
      const results = await scanningService.getScanResults(scanId);
      
      if (!results) {
        return res.status(404).json({ message: "Scan results not found" });
      }

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scan results", error });
    }
  });

  // Start removal process for a scan - Protected
  app.post("/api/scans/:scanId/remove", requireAuth, async (req, res) => {
    try {
      const { scanId } = req.params;
      
      const scan = await storage.getScan(scanId);
      if (!scan) {
        return res.status(404).json({ message: "Scan not found" });
      }

      // Verify the user owns this scan
      if (scan.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden - You can only start removal for your own scans" });
      }

      await removalService.startRemovalProcess(scanId);
      res.json({ message: "Removal process started" });
    } catch (error) {
      res.status(500).json({ message: "Failed to start removal process", error });
    }
  });

  // Get removal progress for a scan - Protected
  app.get("/api/scans/:scanId/removal-progress", requireAuth, async (req, res) => {
    try {
      const { scanId } = req.params;
      
      // Get scan to verify ownership
      const scan = await storage.getScan(scanId);
      if (!scan) {
        return res.status(404).json({ message: "Scan not found" });
      }
      
      // Verify the user owns this scan
      if (scan.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden - You can only access your own removal progress" });
      }
      
      const progress = await removalService.getRemovalProgress(scanId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get removal progress", error });
    }
  });

  // Update removal request status
  app.patch("/api/removal-requests/:requestId", async (req, res) => {
    try {
      const { requestId } = req.params;
      const { status, notes } = req.body;
      
      const updatedRequest = await removalService.updateRemovalStatus(requestId, status, notes);
      
      if (!updatedRequest) {
        return res.status(404).json({ message: "Removal request not found" });
      }

      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to update removal request", error });
    }
  });

  // Get all data brokers
  app.get("/api/data-brokers", async (req, res) => {
    try {
      const brokers = await storage.getDataBrokers();
      res.json(brokers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get data brokers", error });
    }
  });

  // Get data broker by ID
  app.get("/api/data-brokers/:id", async (req, res) => {
    try {
      const broker = await storage.getDataBroker(req.params.id);
      if (!broker) {
        return res.status(404).json({ message: "Data broker not found" });
      }
      res.json(broker);
    } catch (error) {
      res.status(500).json({ message: "Failed to get data broker", error });
    }
  });

  // Generate personalized removal form for an exposure
  app.get("/api/exposures/:exposureId/removal-form", requireAuth, async (req, res) => {
    try {
      const { exposureId } = req.params;
      const authenticatedUserId = req.session.userId;
      
      // Get exposure with related data
      const exposure = await storage.getExposure(exposureId);
      if (!exposure) {
        return res.status(404).json({ message: "Exposure not found" });
      }

      const broker = await storage.getDataBroker(exposure.dataBrokerId);
      if (!broker) {
        return res.status(404).json({ message: "Data broker not found" });
      }

      // Get scan to find user
      const scan = await storage.getScan(exposure.scanId);
      if (!scan) {
        return res.status(404).json({ message: "Scan not found" });
      }

      // Verify the authenticated user owns this exposure
      if (scan.userId !== authenticatedUserId) {
        return res.status(403).json({ message: "Forbidden - You don't have access to this exposure" });
      }

      const user = await storage.getUser(scan.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate prefilled form data
      const removalForm = {
        broker: {
          name: broker.name,
          url: broker.url,
          optOutUrl: broker.optOutUrl,
          optOutProcess: broker.optOutProcess,
          estimatedProcessingTime: broker.estimatedProcessingTime,
          difficultyRating: broker.difficultyRating,
        },
        userData: {
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          currentAddress: user.currentAddress,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode,
          previousAddresses: user.previousAddresses,
        },
        exposedData: exposure.exposedData,
        profileUrl: exposure.profileUrl,
        requiredInfo: broker.requiredInfo,
        formTemplate: generateFormText(broker, user, exposure),
      };

      res.json(removalForm);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate removal form", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate form text
function generateFormText(broker: any, user: any, exposure: any): string {
  const fullName = `${user.firstName} ${user.lastName}`;
  const fullAddress = `${user.currentAddress}, ${user.city}, ${user.state} ${user.zipCode}`;
  
  return `Subject: Data Removal Request - ${fullName}

Dear ${broker.name} Privacy Team,

I am writing to request the immediate removal of my personal information from your database. I have discovered that my information is being displayed on your website without my consent.

Personal Information to be Removed:
- Full Name: ${fullName}
- Current Address: ${fullAddress}
- Email: ${user.email}
- Phone: ${user.phone}
- Date of Birth: ${user.dateOfBirth}
${user.previousAddresses ? `- Previous Addresses: ${user.previousAddresses}` : ''}

Profile URL (if applicable): ${exposure.profileUrl || 'N/A'}

Exposed Data Found: ${Array.isArray(exposure.exposedData) ? exposure.exposedData.join(', ') : exposure.exposedData}

I am exercising my rights under applicable privacy laws, including but not limited to CCPA, GDPR, and other state/federal privacy regulations. I request that you:

1. Remove all of my personal information from your public-facing website
2. Remove my information from your internal databases
3. Do not sell, share, or distribute my personal information to third parties
4. Confirm in writing that my information has been removed

Please process this request within the timeframe required by law and confirm removal via email at ${user.email}.

Thank you for your prompt attention to this matter.

Sincerely,
${fullName}
${new Date().toLocaleDateString()}`;
}
