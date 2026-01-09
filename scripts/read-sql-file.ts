import { readFileSync } from "fs";

const sqlPath = "/tmp/episodes-sql-only.sql";
const sqlContent = readFileSync(sqlPath, "utf-8");

// Output the SQL content
process.stdout.write(sqlContent);



