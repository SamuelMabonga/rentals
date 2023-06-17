/** @type {import('next').NextConfig} */
const cron = require('node-cron')

// 0 8 * * * - everyday at 8am
cron.schedule("* * * * *", function() {
  fetch(`http://localhost:3000/api/bills/cron`)
})
// cron.schedule('* * * * *', function () {
//   console.log('Say scheduled hello')
// });

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false,
  },
  images: {
    domains: ["files.stripe.com", "source.unsplash.com", "images.unsplash.com", "d33wubrfki0l68.cloudfront.net", "v5.airtableusercontent.com", "asset.cloudinary.com", "res.cloudinary.com", "picsum.photos", "fastly.picsum.photos", "https://obs.line-scdn.net"],
  },
  env: {
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
  }
}

module.exports = nextConfig
