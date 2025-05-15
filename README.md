# QuickDrop

QuickDrop is a modern file and text sharing web application built with Next.js and Supabase. It allows users to easily share files and text snippets using temporary links.

## Features

- **File Sharing**: Upload files up to 50MB and share via a link or QR code
- **Text Sharing**: Share text snippets with customizable expiration times
- **Short Codes**: Generate 4-character codes for easy sharing
- **Code Access**: Enter a shared code to access content from anywhere in the app
- **Easy Sharing**: Copy links or share directly to WhatsApp
- **QR Codes**: Generate QR codes for easy mobile access
- **Expiration Options**: Choose between 24-hour or 7-day link expiration

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/QuickDrop.git
   cd QuickDrop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

This project is optimized for deployment on Vercel. Follow these steps for deployment:

1. Push your code to a GitHub repository.

2. Connect your GitHub account to Vercel and import the repository.

3. Configure the following environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. Deploy the project.

5. (Optional) Configure a custom domain in the Vercel project settings.

## Supabase Setup

For this project to work correctly, you need to set up your Supabase project with:

1. A `text_drops` table with the following schema:
   - `id` (uuid, primary key)
   - `text` (text)
   - `nickname` (text, nullable)
   - `expiry` (timestamp with timezone)
   - `created_at` (timestamp with timezone, default: now())

2. A `codes` table with the following schema:
   - `id` (serial, primary key)
   - `code` (varchar(4), unique)
   - `resource_type` (varchar(10)) - 'text' or 'file'
   - `resource_id` (text) - Contains either the UUID for text or filepath for files
   - `created_at` (timestamp with timezone, default: now())
   - `expiry` (timestamp with timezone)

3. A storage bucket named `drops` with the following permissions:
   - Anonymous users: INSERT, SELECT

4. Set up storage policies as needed to allow file uploads and downloads.

See `supabase-schema-update.sql` for help setting up the codes table and required functions.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Technologies

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
