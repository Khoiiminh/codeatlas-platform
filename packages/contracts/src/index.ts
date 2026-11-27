// Re-exports the engine's canonical contract package, pinned in package.json as the vendored
// tarball vendor/codeatlas-contracts-0.1.0.tgz (FND-03, ADR-0009). Nothing here is hand-written
// contract code: change the engine schema, publish a new artifact, then update the pin.
//
// Only this package imports the artifact (dependency-cruiser rule
// `engine-contract-artifact-only-via-contracts`); adapters and apps import `@codeatlas/contracts`.

export * from "codeatlas-engine-contracts";
