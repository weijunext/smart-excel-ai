import { SiteConfig } from "@/types/siteConfig"

const baseSiteConfig = {
  name: "Smart Excel",
  description:
    "Generate the Excel formulas in seconds.",
  url: "https://smartexcel.cc",
  ogImage: "https://smartexcel.cc/og.jpg",
  metadataBase: new URL("https://www.smartexcel.cc"),
  keywords: ["SmartExcel", "ChatGPT", "Excel formulas", "Excel AI", "文心一言", "智谱"],
  authors: [
    {
      name: "weijunext",
      url: "https://weijunext.com",
    }
  ],
  creator: '@weijunext',
  themeColor: '#fff',
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  links: {
    twitter: "https://twitter.com/weijunext",
    github: "https://github.com/weijunext/smartexcel",
  },
}

export const siteConfig: SiteConfig = {
  ...baseSiteConfig,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseSiteConfig.url,
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    siteName: baseSiteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    images: [`${baseSiteConfig.url}/og.png`],
    creator: baseSiteConfig.creator,
  },
}
