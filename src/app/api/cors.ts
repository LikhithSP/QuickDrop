// This file sets up any cross-origin requests needed for Netlify deployment
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  // Options
  methods: ['GET', 'HEAD', 'POST'],
  origin: ['https://snapdropx.netlify.app', process.env.NEXT_PUBLIC_SUPABASE_URL],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  // Handle the request
  res.status(200).json({ message: 'CORS policy established' });
}
