export interface NSApiOptions {
  consumerKey: string;
  consumerSecret: string;
  tokenId: string;
  tokenSecret: string;
  accountId: string;
  debugger?: boolean;
}

export interface NSApiRequestOptions {
  /** Path to the resource. For example: record/v1/salesOrder/13842048?expandSubResources=true */
  path?: string;
  /** POST,GET,PUT ETC */
  method: string;
  /** Data for the body content */
  body?: unknown;
}

export type NSRestletRequestOptions = NSApiRequestOptions;
