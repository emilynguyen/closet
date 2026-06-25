This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding New Clothing Items

1. Drop PNG files into the appropriate folder under `public/assets/clothing/<category>/`
2. Run:
   ```bash
   npm run add-items
   ```
   This detects new files, adds them to `lib/data/clothing.json`, then automatically runs `generate-crops`, `generate-pixel-coverage`, and `generate-brightness`.
3. If any item needs special fields (e.g. `layer`, `undergarments`), edit `lib/data/clothing.json` manually.
4. When ready to log the additions:
   ```bash
   npm run changelog
   ```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run add-items` | Scans asset folders for new PNGs, adds entries to `clothing.json`, and runs crop/pixel-coverage/brightness generation |
| `npm run generate-crops` | Calculates `cropY`/`cropScale` for each item and writes to `lib/data/cropOffsets.json` |
| `npm run generate-pixel-coverage` | Counts opaque pixels per item and writes to `lib/data/pixelCoverage.json` (used for inventory sort order) |
| `npm run generate-brightness` | Calculates average perceptual luminance per item and writes to `lib/data/brightness.json` (used as tiebreaker in inventory sort) |
| `npm run changelog` | Diffs `clothing.json` against the last git commit to detect new items, appends an entry to `lib/data/changelog.json`, and updates `lib/data/buildMeta.json` |
