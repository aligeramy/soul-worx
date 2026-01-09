import { readFileSync } from "fs";
import { join } from "path";

const sqlPath = "/tmp/episodes-sql-only.sql";
const sqlContent = readFileSync(sqlPath, "utf-8");

console.log(sqlContent);



