export interface NSApiOptions {
  consumerKey: string;
  consumerSecret: string;
  tokenId: string;
  tokenSecret: string;
  accountId: string;
}

export interface NSApiRequestOptions {
  path?: string;
  method: string;
  body?: unknown;
}

export type NSRestletRequestOptions = NSApiRequestOptions;
