import { type KairoStartupBeforeEvent, router } from "@kairo-js/router";
import { ScriptEventSource, system } from "@minecraft/server";
import * as storage from "./database/DynamicPropertyStorage";
import { properties } from "./properties";

// Bootstrap listener: handles session-request/session-save before worldLoad.
// Must be set up at module load time, independent of the API pipeline lifecycle.
system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.sourceType !== ScriptEventSource.Server) return;

    if (ev.id === "kairo:session-request") {
        const raw = storage.load("kairo", "_kairo_session");
        system.sendScriptEvent("kairo:session-response", raw !== undefined ? JSON.stringify(raw) : "");
        return;
    }

    if (ev.id === "kairo:session-save") {
        try {
            const data = JSON.parse(ev.message) as unknown;
            storage.save("kairo", "_kairo_session", data);
        } catch {}
    }
});

router.init(properties);

router.beforeEvents.startup.subscribe((ev: KairoStartupBeforeEvent) => {
    ev.api.register<{ key: string; value: unknown }, void>("save", ({ key, value }, ctx) => {
        storage.save(ctx.callerAddonId, key, value);
    });

    ev.api.register<{ key: string; addonId?: string }, unknown>("load", ({ key, addonId }, ctx) => {
        return storage.load(addonId ?? ctx.callerAddonId, key);
    });

    ev.api.register<{ key: string }, void>("delete", ({ key }, ctx) => {
        storage.remove(ctx.callerAddonId, key);
    });

    ev.api.register<{ key: string; addonId?: string }, boolean>("has", ({ key, addonId }, ctx) => {
        return storage.has(addonId ?? ctx.callerAddonId, key);
    });
});
