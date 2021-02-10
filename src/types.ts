export interface NSApiOptions {
  consumerKey: string;
  consumerSecret: string;
  tokenId: string;
  tokenSecret: string;
  companyUrl: string;
  accountId: string;
}

export interface NSApiRequestOptions {
  path?: string;
  method?: string;
  body?: string;
}

export type NSRestletRequestOptions = NSApiRequestOptions;
