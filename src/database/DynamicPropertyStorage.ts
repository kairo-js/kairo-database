import { world } from "@minecraft/server";

const CHUNK_SIZE = 30_000;

function makePrefix(addonId: string, key: string): string {
    return `dp/${sanitize(addonId)}/${sanitize(key)}`;
}

function sanitize(s: string): string {
    return (s ?? "")
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^A-Za-z0-9_\-.]/g, "-")
        .slice(0, 100);
}

function chunkKey(prefix: string, index: number): string {
    return `${prefix}:${index}`;
}

function countKey(prefix: string): string {
    return `${prefix}:n`;
}

function getCount(prefix: string): number {
    const raw = world.getDynamicProperty(countKey(prefix));
    return typeof raw === "number" ? raw : 0;
}

export function save(addonId: string, key: string, value: unknown): void {
    const data = JSON.stringify(value);
    const prefix = makePrefix(addonId, key);
    const chunks = Math.ceil(data.length / CHUNK_SIZE);
    const prevCount = getCount(prefix);

    if (chunks <= 1) {
        world.setDynamicProperty(prefix, data);
        for (let i = 0; i < prevCount; i++) {
            world.setDynamicProperty(chunkKey(prefix, i), undefined);
        }
        if (prevCount > 0) {
            world.setDynamicProperty(countKey(prefix), undefined);
        }
    } else {
        world.setDynamicProperty(prefix, undefined);
        world.setDynamicProperty(countKey(prefix), chunks);
        for (let i = 0; i < chunks; i++) {
            world.setDynamicProperty(chunkKey(prefix, i), data.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
        }
        for (let i = chunks; i < prevCount; i++) {
            world.setDynamicProperty(chunkKey(prefix, i), undefined);
        }
    }
}

export function load(addonId: string, key: string): unknown {
    const prefix = makePrefix(addonId, key);
    const single = world.getDynamicProperty(prefix);
    if (typeof single === "string") {
        return JSON.parse(single);
    }
    const count = getCount(prefix);
    if (count === 0) return undefined;
    let data = "";
    for (let i = 0; i < count; i++) {
        data += (world.getDynamicProperty(chunkKey(prefix, i)) as string) ?? "";
    }
    return JSON.parse(data);
}

export function remove(addonId: string, key: string): void {
    const prefix = makePrefix(addonId, key);
    const count = getCount(prefix);
    world.setDynamicProperty(prefix, undefined);
    if (count > 0) {
        for (let i = 0; i < count; i++) {
            world.setDynamicProperty(chunkKey(prefix, i), undefined);
        }
        world.setDynamicProperty(countKey(prefix), undefined);
    }
}

export function has(addonId: string, key: string): boolean {
    const prefix = makePrefix(addonId, key);
    if (world.getDynamicProperty(prefix) !== undefined) return true;
    return getCount(prefix) > 0;
}
