import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statischer Export -> erzeugt beim Build den Ordner `out/`,
  // lokal lauffähig und auf jedem Static-Host (Vercel/Netlify/Nginx) deploybar.
  output: "export",
  // Ohne Node-Server gibt es keine On-the-fly Bildoptimierung -> Bilder unverändert ausliefern.
  images: { unoptimized: true },
  // Saubere Ordner-URLs (/projects/ -> /projects/index.html) für simple Static-Hosts.
  trailingSlash: true,
};

export default nextConfig;
