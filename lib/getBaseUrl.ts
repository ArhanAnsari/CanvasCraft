const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? `https://http://localhost:3000/`
    : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  process.env.NODE_ENV === "production"
  ? `https://https://canvascraft-ten.vercel.app/`
  : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

export default getBaseUrl;