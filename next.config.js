/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "fabideia-bucket.s3.amazonaws.com",
      "fabideia-bucket.s3.sa-east-1.amazonaws.com",
      "d3.davet.net.br",
      "app-vendas.nyc3.digitaloceanspaces.com",
    ],
  },
};

module.exports = nextConfig;
