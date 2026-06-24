import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const knowsAbout = [
  "Industrial Automation",
  "AMR / Autonomous Mobile Robots",
  "Process Digitalization",
  "SAP Integration",
  "Python Development",
  "React / FastAPI / Node.js",
  "AI-driven Process Automation",
  "Smart Factory",
];

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Marc Walde — Digital Solutions Expert",
    template: "%s · Marc Walde",
  },
  description: site.description,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: knowsAbout,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: site.url,
    siteName: site.name,
    title: "Marc Walde — Digital Solutions Expert",
    description:
      "Über 200.000 € nachgewiesene jährliche Einsparungen durch Digitalisierungsprojekte. AMR, SAP, Python, React, KI-Automation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marc Walde — Digital Solutions Expert",
    description:
      "Über 200.000 € nachgewiesene jährliche Einsparungen durch Digitalisierungsprojekte. AMR, SAP, Python, React, KI-Automation.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#090d18" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8fc" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.jobTitle,
  description:
    "Marc Walde ist Digitalisierungsexperte und Automatisierungsarchitekt mit über 10 Jahren Erfahrung bei Siemens Healthineers. Spezialisiert auf AMR-Integration, Prozessautomatisierung und smarte digitale Lösungen für produzierende Unternehmen.",
  url: site.url,
  image: `${site.url}/marc-walde.png`,
  knowsAbout,
  alumniOf: "FOM Hochschule",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Bayern",
    addressCountry: "DE",
  },
  worksFor: {
    "@type": "Organization",
    name: "Siemens Healthineers AG",
  },
  sameAs: [site.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Nav />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
