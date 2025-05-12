// This file sets up any cross-origin requests needed for Netlify deployment
import Cors from 'cors';

// Build origins array, filtering out undefined values
const origins = ['https://snapdropx.netlify.app'];
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  origins.push(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

// Initialize the CORS middleware
const cors = Cors({
  // Options
  methods: ['GET', 'HEAD', 'POST'],
  origin: origins,
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: any,
  res: any,
  fn: (req: any, res: any, callback: (result: any) => void) => void
) {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve();
    });
  });
}

export default async function handler(
  req: any,
  res: {
    status: (code: number) => {
      json: (data: any) => void;
    };
  }
) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  // Handle the request
  res.status(200).json({ message: 'CORS policy established' });
}
