<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project conventions

## Renaming clothing items
When the user asks to rename a clothing item, always update both:
1. The `name` field in `lib/data/clothing.json`
2. The physical PNG file in `public/assets/clothing/<category>/` and the corresponding `assetPath` in `clothing.json`
