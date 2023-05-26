/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false,
  },
  images: {
    domains: ["files.stripe.com", "source.unsplash.com", "images.unsplash.com", "d33wubrfki0l68.cloudfront.net", "v5.airtableusercontent.com", "asset.cloudinary.com", "res.cloudinary.com", "picsum.photos", "fastly.picsum.photos", "https://obs.line-scdn.net"],
  },
  env: {
    HOST: process.env.NEXT_PUBLIC_HOST,
  }
}

module.exports = nextConfig
