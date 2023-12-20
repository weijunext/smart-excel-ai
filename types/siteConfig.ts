export type AuthorsConfig = {
  name: string
  url: string
}
export type SiteConfig = {
  name: string
  description: string
  url: string
  keywords: string[]
  authors: AuthorsConfig[]
  creator: string
  ogImage: string
  links: {
    twitter: string
    github?: string
  },
  metadataBase: URL
  themeColor: string
  icons: {
    icon: string
    shortcut: string
    apple: string
  }
  openGraph: {
    type: string
    locale: string
    url: string
    title: string
    description: string
    siteName: string
  },
  twitter: {
    card: string
    title: string
    description: string
    images: string[]
    creator: string
  },
}
