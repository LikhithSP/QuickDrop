# SnapdropX

SnapdropX is a modern file and text sharing web application built with Next.js. It allows users to instantly share files or text with a link or QR code, without requiring any login.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deployment on Netlify

This project is configured for deployment on Netlify. Follow these steps to deploy:

### 1. Configure Environment Variables

In your Netlify dashboard, add the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_SITE_URL`: https://snapdropx.netlify.app (or your custom domain)

### 2. Deploy on Netlify

#### Option 1: Connect to GitHub

1. Push your code to GitHub
2. Log in to your Netlify account
3. Click "New site from Git"
4. Choose GitHub and select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"

#### Option 2: Manual Deploy

1. Build your project locally:
   ```bash
   npm run build
   ```
2. Deploy the `.next` folder using Netlify CLI:
   ```bash
   netlify deploy --prod
   ```

### 3. Configure Domain

1. In your Netlify site settings, go to "Domain management"
2. Add your custom domain or use the provided Netlify subdomain (snapdropx.netlify.app)

The site is now deployed and should be functioning correctly at https://snapdropx.netlify.app!

## Supabase Configuration for Netlify

For your application to work correctly on Netlify, you'll need to configure CORS settings in your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to Project Settings > API
3. Under "API Settings", find the CORS section
4. Add your Netlify domain to the allowed origins:
   - `https://snapdropx.netlify.app`
   - If you're using a custom domain, add that as well

This ensures that your frontend application hosted on Netlify can communicate with your Supabase backend.

### Storage Configuration

If you're using Supabase Storage (for file uploads):

1. In your Supabase dashboard, go to Storage > Buckets
2. Create a bucket named "drops" (or whatever name you're using in your code)
3. Set the public access level appropriately:
   - If you want anyone to access the files without authentication, set it to public
   - Otherwise, configure appropriate RLS policies

### Database Schema

Make sure your database schema includes the necessary tables:

```sql
-- For text sharing
CREATE TABLE text_drops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  nickname TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expiry TIMESTAMPTZ NOT NULL
);

-- Optional file metadata table if you're storing metadata separately
CREATE TABLE file_drops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_path TEXT NOT NULL,
  nickname TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expiry TIMESTAMPTZ NOT NULL
);
```
