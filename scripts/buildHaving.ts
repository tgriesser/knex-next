import fs from "fs";
import path from "path";

const clausesDir = path.join(__dirname, "..", "packages", "core", "src", "clauses");

const data = fs.readFileSync(path.join(clausesDir, "WhereClauseBuilder.ts"), "utf-8");

const newData = data.replace(/where/g, "having").replace(/Where/g, "Having");

fs.writeFileSync(path.join(clausesDir, "HavingClauseBuilder.ts"), newData);
