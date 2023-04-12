const {nextSafe} = require("next-safe");

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  async headers () {
		return [
			{
				source: '/:path*',
				headers: nextSafe({
          isDev: process.env.npm_lifecycle_event === "dev",
          contentSecurityPolicy: {
            mergeDefaultDirectives: true,
            "default-src": ["'self'"],
            "font-src": ["https://fonts.gstatic.com/"],
            "style-src": ["'self'", "https://fonts.googleapis.com/css2"],
            "script-src": ["'self'"]
          }
        }),
			},
		]
	},
}

module.exports = nextConfig;