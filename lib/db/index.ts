import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// For queries - use DATABASE_URL for pooled connections
// In edge runtime, we need to handle connection differently
const connectionString = process.env.DATABASE_URL!

// Create client with proper configuration for serverless/edge
const queryClient = postgres(connectionString, {
  max: 1, // Limit connections in serverless environment
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(queryClient, { schema })

