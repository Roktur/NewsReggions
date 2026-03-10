<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run locally

This contains everything you need to run your app locally.

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set `VITE_OPENROUTER_API_KEY` in `.env.local`
3. Run the app:
   `npm run dev`

## Publish to GitHub

1. Copy `.env.example` to `.env.local` for local development.
2. Create a GitHub repository and push the project to the `main` branch.
3. In GitHub, open `Settings -> Pages` and set `Source` to `GitHub Actions`.
4. Push to `main` again or run the `Deploy to GitHub Pages` workflow manually.

Note: `.env.local` is ignored by git. Do not commit real API keys.
