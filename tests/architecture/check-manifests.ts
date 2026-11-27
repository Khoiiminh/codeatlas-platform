// FND-05: checks that every workspace package.json lists only the @codeatlas/* dependencies
// allowed by packages/tooling-config/dependency-matrix.json (ADR-0011).
// Runs on Node's built-in TypeScript support: `node tests/architecture/check-manifests.ts`.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const matrixFile = join(root, "packages/tooling-config/dependency-matrix.json");
const matrix: Record<string, string[] | string> = JSON.parse(readFileSync(matrixFile, "utf8"));
const ALWAYS_ALLOWED = new Set(["tooling-config"]);
const SECTIONS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"] as const;

const violations: string[] = [];
const seen = new Set<string>();

for (const group of ["apps", "packages"]) {
    for (const entry of readdirSync(join(root, group), { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const dir = `${group}/${entry.name}`;
        const manifestPath = join(root, dir, "package.json");
        if (!existsSync(manifestPath)) {
            violations.push(`${dir} has no package.json`);
            continue;
        }
        seen.add(dir);

        const allowedRaw = matrix[dir];
        if (!Array.isArray(allowedRaw)) {
            violations.push(
                `${dir} is not in the dependency matrix; add it to docs/architecture/README.md and ${"packages/tooling-config/dependency-matrix.json"}`,
            );
            continue;
        }
        const allowed = new Set(allowedRaw);
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
        const expectedName = `@codeatlas/${entry.name}`;
        if (manifest.name !== expectedName) {
            violations.push(`${dir}/package.json is named ${manifest.name}; expected ${expectedName}`);
        }

        for (const section of SECTIONS) {
            for (const dep of Object.keys(manifest[section] ?? {})) {
                if (!dep.startsWith("@codeatlas/")) continue;
                const target = dep.slice("@codeatlas/".length);
                if (ALWAYS_ALLOWED.has(target) || allowed.has(target)) continue;
                violations.push(
                    `${dir} -> ${dep} (${section}) is forbidden by the dependency matrix (allowed: ${[...allowed].join(", ") || "none"})`,
                );
            }
        }
    }
}

for (const dir of Object.keys(matrix)) {
    if (!dir.startsWith("$") && !seen.has(dir)) violations.push(`matrix lists ${dir}, which does not exist`);
}

if (violations.length > 0) {
    console.error("Architecture manifest violations (see docs/architecture/README.md, ADR-0011):");
    for (const v of violations) console.error(`  ${v}`);
    process.exit(1);
}
console.log(`Manifest check passed: ${seen.size} workspace packages match the dependency matrix.`);
