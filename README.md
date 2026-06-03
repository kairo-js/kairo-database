# Kairo Database

Persistent data store for [Kairo](https://github.com/kairo-js/kairo) addons.

## Stability Guarantee

**As of version 2.0.0, Kairo Database will receive no further updates under normal circumstances.**

Its UUID and internal format are frozen. Data written to Kairo Database persists indefinitely — even when Kairo itself is updated or reinstalled with a new UUID. This stability is intentional: Kairo Database exists solely as a long-lived data layer.

## Storage

Data is stored using Minecraft's Dynamic Properties API. Large values are automatically split into 30,000-character chunks and reassembled on read, making storage effectively unlimited for practical use.

## Installation

Download `kairo-database.mcpack` from [GitHub Releases](https://github.com/kairo-js/kairo-database/releases) and apply it to your world alongside [Kairo](https://github.com/kairo-js/kairo/releases).

## Usage

Storage is accessed through `@kairo-js/router`. Kairo Database does not expose any direct API.

```typescript
// Save
await router.save('my-key', { score: 100 })

// Load (undefined if not found)
const value = await router.load<{ score: number }>('my-key')

// Check existence
const exists = await router.has('my-key')

// Delete
await router.delete('my-key')

// Read another addon's data
const value = await router.load('their-key', { addonId: 'other-addon' })
```

See the [kairo-docs](https://kairo-js.github.io/kairo-docs/) for full documentation.

## Supported Minecraft Script API

- `@minecraft/server` — 2.7.0
- `@minecraft/server-ui` — 2.0.0

## Development

```bash
pnpm install
pnpm run build
```
