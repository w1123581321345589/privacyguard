import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  currentAddress: text("current_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  previousAddresses: text("previous_addresses"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dataBrokers = pgTable("data_brokers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(), // people-search, marketing, credit, public-records
  priority: text("priority").notNull(), // high, medium, low
  optOutUrl: text("opt_out_url"),
  optOutProcess: text("opt_out_process").notNull(),
  requiredInfo: jsonb("required_info").notNull(), // array of required fields
  estimatedProcessingTime: text("estimated_processing_time").notNull(),
  difficultyRating: integer("difficulty_rating").notNull(), // 1-5 scale
});

export const scans = pgTable("scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  status: text("status").notNull(), // running, completed, failed
  sitesScanned: integer("sites_scanned").default(0),
  sitesFound: integer("sites_found").default(0),
  privacyScore: integer("privacy_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const exposures = pgTable("exposures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scanId: varchar("scan_id").references(() => scans.id).notNull(),
  dataBrokerId: varchar("data_broker_id").references(() => dataBrokers.id).notNull(),
  exposedData: jsonb("exposed_data").notNull(), // array of exposed data types
  profileUrl: text("profile_url"),
  discoveredAt: timestamp("discovered_at").defaultNow().notNull(),
});

export const removalRequests = pgTable("removal_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  exposureId: varchar("exposure_id").references(() => exposures.id).notNull(),
  status: text("status").notNull(), // pending, submitted, in-progress, completed, failed, action-required
  submittedAt: timestamp("submitted_at"),
  completedAt: timestamp("completed_at"),
  actionRequired: text("action_required"), // email-verification, id-verification, etc.
  notes: text("notes"),
  retryCount: integer("retry_count").default(0),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertScanSchema = createInsertSchema(scans).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertDataBrokerSchema = createInsertSchema(dataBrokers).omit({
  id: true,
});

export const insertExposureSchema = createInsertSchema(exposures).omit({
  id: true,
  discoveredAt: true,
});

export const insertRemovalRequestSchema = createInsertSchema(removalRequests).omit({
  id: true,
  submittedAt: true,
  completedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type DataBroker = typeof dataBrokers.$inferSelect;
export type InsertDataBroker = z.infer<typeof insertDataBrokerSchema>;
export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;
export type Exposure = typeof exposures.$inferSelect;
export type InsertExposure = z.infer<typeof insertExposureSchema>;
export type RemovalRequest = typeof removalRequests.$inferSelect;
export type InsertRemovalRequest = z.infer<typeof insertRemovalRequestSchema>;
