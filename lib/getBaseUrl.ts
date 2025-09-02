const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? `https://localhost:3000`
    : `https://canvascraft.appwrite.network`;

  process.env.NODE_ENV === "production"
  ? `https://canvascraft.appwrite.network`
  : `https://canvascraft.appwrite.network`;

export default getBaseUrl;