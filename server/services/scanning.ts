import { storage } from "../storage";
import { type Scan, type Exposure } from "@shared/schema";

export class ScanningService {
  async startScan(userId: string): Promise<Scan> {
    console.log(`[Scanning] Starting scan for user ${userId}`);
    // Create initial scan record
    const scan = await storage.createScan({
      userId,
      status: "running",
      sitesScanned: 0,
      sitesFound: 0,
      privacyScore: 0,
    });

    console.log(`[Scanning] Created scan ${scan.id}, starting performScan`);
    // Start scanning process asynchronously
    this.performScan(scan.id).catch((err) => {
      console.error(`[Scanning] Error in performScan:`, err);
    });

    return scan;
  }

  private async performScan(scanId: string): Promise<void> {
    console.log(`[performScan] Starting scan ${scanId}`);
    const scan = await storage.getScan(scanId);
    if (!scan) {
      console.log(`[performScan] Scan ${scanId} not found`);
      return;
    }

    const user = await storage.getUser(scan.userId);
    if (!user) {
      console.log(`[performScan] User ${scan.userId} not found`);
      return;
    }

    const dataBrokers = await storage.getDataBrokers();
    console.log(`[performScan] Found ${dataBrokers.length} data brokers to scan`);
    
    let sitesScanned = 0;
    let sitesFound = 0;
    
    // Simulate scanning process
    for (let i = 0; i < dataBrokers.length; i++) {
      const broker = dataBrokers[i];
      // Simulate scan delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use deterministic pseudo-random based on broker index and priority
      // This ensures consistent results for testing while appearing random
      const seed = (i + 1) * (broker.priority === 'high' ? 7 : broker.priority === 'medium' ? 3 : 1);
      const pseudoRandom = (seed % 10) / 10;
      
      const findProbability = broker.priority === 'high' ? 0.6 : 
                             broker.priority === 'medium' ? 0.3 : 0.1;
      
      const isFound = pseudoRandom < findProbability;

      sitesScanned++;
      
      if (isFound) {
        sitesFound++;
        
        // Create exposure record
        const exposedData = this.generateExposedData(broker.requiredInfo as string[], user);
        
        await storage.createExposure({
          scanId: scan.id,
          dataBrokerId: broker.id,
          exposedData: exposedData,
          profileUrl: `${broker.url}/profile/${user.firstName}-${user.lastName}`,
        });
      }
      
      // Update scan progress
      await storage.updateScan(scan.id, {
        sitesScanned,
        sitesFound,
      });
    }

    // Calculate privacy score
    const exposures = await storage.getExposuresByScanId(scanId);
    const privacyScore = this.calculatePrivacyScore(exposures.length, dataBrokers.length);

    console.log(`[performScan] Scan ${scanId} complete: ${exposures.length} exposures found, privacy score: ${privacyScore}`);
    
    // Mark scan as completed
    await storage.updateScan(scanId, {
      status: "completed",
      privacyScore,
      completedAt: new Date(),
    });
  }

  private generateExposedData(requiredInfo: string[], user: any): string[] {
    const possibleData = [
      "Full Name",
      "Current Address", 
      "Phone Number",
      "Age",
      "Email Address",
      "Previous Addresses",
      "Date of Birth",
      "Relatives",
      "Social Profiles",
      "Criminal Records",
      "Associates",
      "Public Records",
      "Address History",
      "Phone Numbers",
      "Contact Info",
      "Reputation Score",
      "Reviews",
      "Photos",
      "Family Members"
    ];

    // Return deterministic items from possible data
    const exposedData: string[] = [];
    
    // Always include items from requiredInfo first
    for (const item of requiredInfo) {
      if (possibleData.includes(item) && exposedData.length < 6) {
        exposedData.push(item);
      }
    }
    
    // Fill remaining slots with common exposure types
    const commonExposures = ["Full Name", "Current Address", "Phone Number", "Email Address"];
    for (const item of commonExposures) {
      if (!exposedData.includes(item) && exposedData.length < 6) {
        exposedData.push(item);
      }
    }

    return exposedData.length > 0 ? exposedData : ["Full Name", "Phone Number", "Address"];
  }

  private calculatePrivacyScore(exposuresFound: number, totalSites: number): number {
    // Privacy score calculation: 
    // 100 - (exposures found / total sites * 100)
    // Adjusted to make it more realistic
    const exposurePercentage = (exposuresFound / totalSites) * 100;
    const score = Math.max(0, Math.round(100 - exposurePercentage * 1.5));
    return score;
  }

  async getUserLatestScan(userId: string): Promise<Scan | null> {
    const scans = await storage.getScansByUserId(userId);
    if (scans.length === 0) return null;
    
    return scans.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }

  async getScanResults(scanId: string) {
    const scan = await storage.getScan(scanId);
    if (!scan) return null;

    const exposures = await storage.getExposuresByScanId(scanId);
    const exposuresWithBrokers = await Promise.all(
      exposures.map(async (exposure) => {
        const broker = await storage.getDataBroker(exposure.dataBrokerId);
        return { ...exposure, broker };
      })
    );

    return {
      scan,
      exposures: exposuresWithBrokers,
    };
  }
}

export const scanningService = new ScanningService();
