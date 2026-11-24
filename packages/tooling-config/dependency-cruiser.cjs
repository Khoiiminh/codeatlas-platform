// Architecture boundary rules for codeatlas-platform (FND-05, ADR-0011).
// Source-level counterpart of the matrix in docs/architecture/README.md.
// Run from the repository root: `pnpm check:imports`.

const ADAPTERS = "(persistence|messaging|engine-client|ai-providers|source-control)";

// Frameworks and infrastructure that must never reach domain or application code.
const INFRASTRUCTURE_PACKAGES =
  "node_modules/(@nestjs|next|react|react-dom|@prisma|prisma|drizzle-orm|kysely|pg|postgres|pgvector|" +
  "ioredis|redis|bullmq|@aws-sdk|openai|@anthropic-ai|@google|axios|undici|@octokit|zod)(/|$)";

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // --- domain
    {
      name: "domain-is-innermost",
      comment: "packages/domain imports no other workspace package or app (ADR-0011 rule 1).",
      severity: "error",
      from: { path: "^packages/domain/" },
      to: { path: "^(apps|packages)/", pathNot: "^packages/domain/" },
    },
    {
      name: "domain-context-isolation",
      comment: "A domain context imports only itself and shared-kernel.",
      severity: "error",
      from: { path: "^packages/domain/src/([^/]+)/" },
      to: { path: "^packages/domain/src/", pathNot: "^packages/domain/src/($1|shared-kernel)/" },
    },
    // --- application
    {
      name: "application-depends-only-on-domain",
      comment: "packages/application imports only packages/domain (ADR-0011 rule 1).",
      severity: "error",
      from: { path: "^packages/application/" },
      to: { path: "^(apps|packages)/", pathNot: "^packages/(application|domain)/" },
    },
    {
      name: "application-cross-context-via-index",
      comment: "Contexts call each other only through the other context's public index.ts (ADR-0011 rule 5).",
      severity: "error",
      from: { path: "^packages/application/src/([^/]+)/" },
      to: {
        path: "^packages/application/src/[^/]+/",
        pathNot: "^packages/application/src/($1/|[^/]+/index\\.ts$)",
      },
    },
    {
      name: "inner-layers-free-of-infrastructure",
      comment: "No framework, ORM, queue, HTTP, LLM SDK or Node built-in in domain/application (ADR-0011 rule 3).",
      severity: "error",
      from: { path: "^packages/(domain|application)/" },
      to: { path: INFRASTRUCTURE_PACKAGES },
    },
    {
      name: "inner-layers-free-of-node-builtins",
      comment: "Domain and application are runtime-agnostic; I/O goes through ports.",
      severity: "error",
      from: { path: "^packages/(domain|application)/" },
      to: { dependencyTypes: ["core"] },
    },
    // --- public entry points
    {
      name: "domain-entry-points-only",
      comment: "Code outside packages/domain imports a context only through its index.ts.",
      severity: "error",
      from: { pathNot: "^packages/domain/" },
      to: { path: "^packages/domain/src/", pathNot: "^packages/domain/src/[^/]+/index\\.ts$" },
    },
    {
      name: "application-entry-points-only",
      comment: "Code outside packages/application imports a context only through its index.ts.",
      severity: "error",
      from: { pathNot: "^packages/application/" },
      to: { path: "^packages/application/src/", pathNot: "^packages/application/src/[^/]+/index\\.ts$" },
    },
    // --- adapters
    {
      name: "adapters-depend-inward-only",
      comment: "An adapter imports domain, application and itself; adapters never import each other (ADR-0011 rule 4).",
      severity: "error",
      from: { path: `^packages/${ADAPTERS}/` },
      to: { path: "^(apps|packages)/", pathNot: "^packages/(domain|application|contracts|$1)/" },
    },
    {
      name: "contracts-only-in-engine-client-and-roots",
      comment: "Generated engine contract types are adapter-level; only engine-client and apps/api|worker|web use them.",
      severity: "error",
      from: { path: "^packages/", pathNot: "^packages/(engine-client|contracts)/" },
      to: { path: "^packages/contracts/" },
    },
    {
      name: "contracts-standalone",
      comment: "packages/contracts is generated and imports no workspace package.",
      severity: "error",
      from: { path: "^packages/contracts/" },
      to: { path: "^(apps|packages)/", pathNot: "^packages/contracts/" },
    },
    // --- apps
    {
      name: "apps-do-not-import-each-other",
      comment: "Deployables integrate over HTTP or the queue, never by importing another app.",
      severity: "error",
      from: { path: "^apps/([^/]+)/" },
      to: { path: "^apps/", pathNot: "^apps/$1/" },
    },
    {
      name: "web-uses-contracts-only",
      comment: "apps/web calls apps/api over HTTP and imports only contract types (ADR-0011 rule 7).",
      severity: "error",
      from: { path: "^apps/web/" },
      to: { path: "^packages/", pathNot: "^packages/contracts/" },
    },
    // --- hygiene
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "not-to-unresolvable",
      comment: "Every import must resolve; an undeclared workspace dependency does not resolve under pnpm.",
      severity: "error",
      from: {},
      to: { couldNotResolve: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "(^|/)(node_modules|dist|\\.next|coverage)/" },
    tsPreCompilationDeps: true,
    combinedDependencies: false,
    preserveSymlinks: false,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      mainFields: ["module", "main", "types"],
      extensions: [".ts", ".tsx", ".js", ".mjs", ".cjs", ".json"],
    },
  },
};
