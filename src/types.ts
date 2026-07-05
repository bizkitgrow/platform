export interface MetaDataOpenGraph {
  url?: string;
  siteName?: string;
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
  }>;
  locale?: string;
  type?: string;
}

export interface MetaData {
  title?: string;
  ignoreTitleTemplate?: boolean;
  canonical?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
  description?: string;
  openGraph?: MetaDataOpenGraph;
  twitter?: {
    handle?: string;
    site?: string;
    cardType?: string;
  };
}
