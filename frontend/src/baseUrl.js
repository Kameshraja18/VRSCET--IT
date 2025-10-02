export const baseApiURL = () => {
  // For Vercel deployment
  if (process.env.REACT_APP_VERCEL_ENV) {
    return process.env.REACT_APP_VERCEL_URL
      ? `https://${process.env.REACT_APP_VERCEL_URL}/api`
      : 'https://your-vercel-app.vercel.app/api';
  }

  // For local development
  return process.env.REACT_APP_APILINK || 'http://localhost:4000/api';
};
