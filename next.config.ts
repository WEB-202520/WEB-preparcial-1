import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
    images: {
        remotePatterns : [
            new URL("https://static1.mujerhoy.com/**"),
            new URL("https://imagessl.casadellibro.com/**"),
            new URL("https://trabalibros.com/**"),
            new URL("https://upload.wikimedia.org/**"),
            new URL("https://images-na.ssl-images-amazon.com/**"),
            new URL("https://images.gr-assets.com/**"),
        ]
    }
}
