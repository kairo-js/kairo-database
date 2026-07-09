import type { AddonProperties } from "@kairo-js/properties";

export const properties: AddonProperties = {
    id: "kairo-database",
    metadata: {
        authors: ["shizuku86"],
    },
    header: {
        name: "Kairo Database",
        description:
            "Persistent data store for Kairo addons. Install once and never update — your data stays safe forever.",
        version: {
            major: 1,
            minor: 0,
            patch: 0,
            prerelease: "beta.4",
        },
        min_engine_version: { major: 1, minor: 21, patch: 132 },
    },
    minecraftDependencies: [
        { module_name: "@minecraft/server", version: "2.0.0" },
        { module_name: "@minecraft/server-ui", version: "2.0.0" },
    ],
    optionalDependencies: {},
    dependencies: {
        kairo: "*",
    },
    tags: ["official", "stable"],
};
