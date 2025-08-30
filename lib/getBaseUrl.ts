const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? `https://http://localhost:3000/`
    : `https://canvascraft-ten.vercel.app/`;

  process.env.NODE_ENV === "production"
  ? `https://canvascraft.appwrite.network/`
  : `https://canvascraft-ten.vercel.app/`;

export default getBaseUrl;