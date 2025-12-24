import { type User, type InsertUser, type DataBroker, type InsertDataBroker, type Scan, type InsertScan, type Exposure, type InsertExposure, type RemovalRequest, type InsertRemovalRequest } from "@shared/schema";
import { users, dataBrokers, scans, exposures, removalRequests } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Data Brokers
  getDataBrokers(): Promise<DataBroker[]>;
  getDataBroker(id: string): Promise<DataBroker | undefined>;
  createDataBroker(broker: InsertDataBroker): Promise<DataBroker>;

  // Scans
  getScan(id: string): Promise<Scan | undefined>;
  getScansByUserId(userId: string): Promise<Scan[]>;
  createScan(scan: InsertScan): Promise<Scan>;
  updateScan(id: string, updates: Partial<Scan>): Promise<Scan | undefined>;

  // Exposures
  getExposure(id: string): Promise<Exposure | undefined>;
  getExposuresByScanId(scanId: string): Promise<Exposure[]>;
  createExposure(exposure: InsertExposure): Promise<Exposure>;

  // Removal Requests
  getRemovalRequest(id: string): Promise<RemovalRequest | undefined>;
  getRemovalRequestsByExposureId(exposureId: string): Promise<RemovalRequest[]>;
  getRemovalRequestsByScanId(scanId: string): Promise<RemovalRequest[]>;
  createRemovalRequest(request: InsertRemovalRequest): Promise<RemovalRequest>;
  updateRemovalRequest(id: string, updates: Partial<RemovalRequest>): Promise<RemovalRequest | undefined>;
  getAllRemovalRequests(): Promise<RemovalRequest[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Data Brokers
  async getDataBrokers(): Promise<DataBroker[]> {
    return await db.select().from(dataBrokers);
  }

  async getDataBroker(id: string): Promise<DataBroker | undefined> {
    const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, id));
    return broker || undefined;
  }

  async createDataBroker(insertBroker: InsertDataBroker): Promise<DataBroker> {
    const [broker] = await db
      .insert(dataBrokers)
      .values(insertBroker)
      .returning();
    return broker;
  }

  // Scans
  async getScan(id: string): Promise<Scan | undefined> {
    const [scan] = await db.select().from(scans).where(eq(scans.id, id));
    return scan || undefined;
  }

  async getScansByUserId(userId: string): Promise<Scan[]> {
    return await db.select().from(scans).where(eq(scans.userId, userId)).orderBy(desc(scans.createdAt));
  }

  async createScan(insertScan: InsertScan): Promise<Scan> {
    const [scan] = await db
      .insert(scans)
      .values(insertScan)
      .returning();
    return scan;
  }

  async updateScan(id: string, updates: Partial<Scan>): Promise<Scan | undefined> {
    const [scan] = await db
      .update(scans)
      .set(updates)
      .where(eq(scans.id, id))
      .returning();
    return scan || undefined;
  }

  // Exposures
  async getExposure(id: string): Promise<Exposure | undefined> {
    const [exposure] = await db.select().from(exposures).where(eq(exposures.id, id));
    return exposure || undefined;
  }

  async getExposuresByScanId(scanId: string): Promise<Exposure[]> {
    return await db.select().from(exposures).where(eq(exposures.scanId, scanId));
  }

  async createExposure(insertExposure: InsertExposure): Promise<Exposure> {
    const [exposure] = await db
      .insert(exposures)
      .values(insertExposure)
      .returning();
    return exposure;
  }

  // Removal Requests
  async getRemovalRequest(id: string): Promise<RemovalRequest | undefined> {
    const [request] = await db.select().from(removalRequests).where(eq(removalRequests.id, id));
    return request || undefined;
  }

  async getRemovalRequestsByExposureId(exposureId: string): Promise<RemovalRequest[]> {
    return await db.select().from(removalRequests).where(eq(removalRequests.exposureId, exposureId));
  }

  async getRemovalRequestsByScanId(scanId: string): Promise<RemovalRequest[]> {
    // Join exposures to filter removal requests by scanId
    const results = await db
      .select({
        id: removalRequests.id,
        exposureId: removalRequests.exposureId,
        status: removalRequests.status,
        actionRequired: removalRequests.actionRequired,
        notes: removalRequests.notes,
        retryCount: removalRequests.retryCount,
        submittedAt: removalRequests.submittedAt,
        completedAt: removalRequests.completedAt,
      })
      .from(removalRequests)
      .innerJoin(exposures, eq(removalRequests.exposureId, exposures.id))
      .where(eq(exposures.scanId, scanId));
    
    return results;
  }

  async createRemovalRequest(insertRequest: InsertRemovalRequest): Promise<RemovalRequest> {
    const [request] = await db
      .insert(removalRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updateRemovalRequest(id: string, updates: Partial<RemovalRequest>): Promise<RemovalRequest | undefined> {
    const [request] = await db
      .update(removalRequests)
      .set(updates)
      .where(eq(removalRequests.id, id))
      .returning();
    return request || undefined;
  }

  async getAllRemovalRequests(): Promise<RemovalRequest[]> {
    return await db.select().from(removalRequests);
  }
}

export const storage = new DatabaseStorage();
