import { storage } from "../storage";
import { type RemovalRequest } from "@shared/schema";

export class RemovalService {
  async startRemovalProcess(scanId: string): Promise<void> {
    const exposures = await storage.getExposuresByScanId(scanId);
    
    for (const exposure of exposures) {
      // Create removal request for each exposure
      await storage.createRemovalRequest({
        exposureId: exposure.id,
        status: "pending",
        retryCount: 0,
      });
    }

    // Start processing removal requests
    this.processRemovalRequests(scanId).catch(console.error);
  }

  private async processRemovalRequests(scanId: string): Promise<void> {
    const requests = await storage.getRemovalRequestsByScanId(scanId);
    
    for (const request of requests) {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

      const exposure = await storage.getExposure(request.exposureId);
      if (!exposure) continue;

      const broker = await storage.getDataBroker(exposure.dataBrokerId);
      if (!broker) continue;

      // Simulate different removal outcomes based on broker difficulty
      const outcome = this.simulateRemovalOutcome(broker.difficultyRating, broker.priority);

      await storage.updateRemovalRequest(request.id, {
        status: outcome.status,
        submittedAt: new Date(),
        actionRequired: outcome.actionRequired,
        notes: outcome.notes,
        ...(outcome.status === "completed" && { completedAt: new Date() }),
      });
    }
  }

  private simulateRemovalOutcome(difficultyRating: number, priority: string): {
    status: string;
    actionRequired?: string;
    notes?: string;
  } {
    // Use deterministic logic based on difficulty and priority
    // This ensures consistent test results while demonstrating variety
    
    // Very high difficulty brokers need ID verification
    if (difficultyRating >= 4) {
      return {
        status: "action-required",
        actionRequired: "id-verification",
        notes: "Broker requires government ID verification to complete removal",
      };
    }
    
    // Medium-high difficulty needs email verification
    if (difficultyRating === 3 && priority === "medium") {
      return {
        status: "action-required", 
        actionRequired: "email-verification",
        notes: "Email verification required to complete removal process",
      };
    }

    // High priority items are in progress
    if (priority === "high") {
      return {
        status: "in-progress",
        notes: "Removal request submitted successfully, awaiting broker response",
      };
    }

    // Low priority and easy ones complete quickly
    if (difficultyRating <= 2) {
      return {
        status: "completed",
        notes: "Data successfully removed from broker database",
      };
    }

    // Default to in-progress for everything else
    return {
      status: "in-progress",
      notes: "Removal request submitted successfully, awaiting broker response",
    };
  }

  async getRemovalProgress(scanId: string) {
    const requests = await storage.getRemovalRequestsByScanId(scanId);
    
    const stats = {
      total: requests.length,
      completed: requests.filter(r => r.status === "completed").length,
      inProgress: requests.filter(r => r.status === "in-progress").length,
      pending: requests.filter(r => r.status === "pending").length,
      actionRequired: requests.filter(r => r.status === "action-required").length,
    };

    const requestsWithDetails = await Promise.all(
      requests.map(async (request) => {
        const exposure = await storage.getExposure(request.exposureId);
        const broker = exposure ? await storage.getDataBroker(exposure.dataBrokerId) : null;
        return { ...request, exposure, broker };
      })
    );

    return { stats, requests: requestsWithDetails };
  }

  async updateRemovalStatus(requestId: string, status: string, notes?: string): Promise<RemovalRequest | null> {
    const updates: Partial<RemovalRequest> = { status, notes };
    
    if (status === "completed") {
      updates.completedAt = new Date();
    }

    const result = await storage.updateRemovalRequest(requestId, updates);
    return result || null;
  }
}

export const removalService = new RemovalService();
