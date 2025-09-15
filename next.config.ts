import {withSentryConfig} from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },

       // Placeholder Providers
      { 
         protocol: "https", 
         hostname: "picsum.photos" 
      },

       // Free Stock Image Platforms
      { 
         protocol: "https", 
         hostname: "images.unsplash.com" 
      },
      { 
         protocol: "https", 
         hostname: "unsplash.com" 
      },
      { 
         protocol: "https", 
         hostname: "images.pexels.com" 
      },
      { 
         protocol: "https", 
         hostname: "pexels.com" 
      },
      { 
         protocol: "https", 
         hostname: "cdn.pixabay.com" 
      },
      { 
         protocol: "https", 
         hostname: "pixabay.com" 
      },
      { 
         protocol: "https", 
         hostname: "rawpixel.com" 
      },
      { 
         protocol: "https", 
         hostname: "burst.shopifycdn.com" 
      }, // Burst by Shopify

       // Wikimedia / Public Domain
      { 
         protocol: "https", 
         hostname: "commons.wikimedia.org" 
      },
      { 
         protocol: "https", 
         hostname: "upload.wikimedia.org" 
      },

      // General media domains (optional if you want to cover wide usage)
      { 
         protocol: "https", 
         hostname: "media.tenor.com" 
      }, // GIFs
      { 
         protocol: "https", 
         hostname: "i.giphy.com" 
      },     // GIFs
      { 
         protocol: "https", 
         hostname: "giphy.com" 
      },
    ],
  },
  // Enable React strict mode
  reactStrictMode: true,
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "arhanansari",

  project: "canvascraft",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
