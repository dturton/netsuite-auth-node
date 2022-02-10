/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @packageDocumentation A small utility to connect to NetSuite's SuiteTalk REST Web Services
 */

import OAuth, { RequestOptions } from "oauth-1.0a";
import axios, { AxiosResponse, AxiosRequestConfig, Method } from "axios";
import * as crypto from "crypto";
import Debug from "debug";
import { NSApiOptions, NSApiRequestOptions } from "./types";

export default class NsApi {
  private readonly oauth: OAuth;
  private readonly token: string;
  private readonly secret: string;
  private debug: Debug.Debugger | undefined;
  private accountId: string;

  constructor(private readonly options: NSApiOptions) {
    this.token = this.options.tokenId;
    this.secret = this.options.tokenSecret;
    this.accountId = options.accountId;
    if (options.debugger) {
      this.debug = Debug("nsapi");
    }

    this.oauth = new OAuth({
      consumer: {
        key: this.options.consumerKey,
        secret: this.options.consumerSecret,
      },
      signature_method: "HMAC-SHA256",
      hash_function: this.hashFunction,
      realm: options.accountId,
      version: "1.0",
    });
  }

  private hashFunction = (
    base_string: crypto.BinaryLike,
    key:
      | string
      | Uint8Array
      | Uint8ClampedArray
      | Uint16Array
      | Uint32Array
      | Int8Array
      | Int16Array
      | Int32Array
      | BigUint64Array
      | BigInt64Array
      | Float32Array
      | Float64Array
      | DataView
      | crypto.KeyObject
  ) => {
    return crypto
      .createHmac("sha256", key)
      .update(base_string)
      .digest("base64");
  };

  private generateAuthorizationHeaderFromRequest(
    options: RequestOptions,
    token?: OAuth.Token
  ): OAuth.Header {
    return this.oauth.toHeader(this.oauth.authorize(options, token));
  }

  /**
   * Used to call any NetSuite Rest API endpoint
   * @public
   * @param opts
   * @type NSApiRequestOptions
   */
  public async request(opts: NSApiRequestOptions): Promise<AxiosResponse> {
    const { path, body } = opts;
    const method = opts.method as Method;

    if (this.debug) {
      this.debug(opts);
    }

    const urlAccountId = this.accountId.replace(/_/g, "-").toLowerCase();
    const url = `https://${urlAccountId}.suitetalk.api.netsuite.com/services/rest/${path}`;

    const requestOptions: OAuth.RequestOptions = {
      url,
      method,
      data: body,
      includeBodyHash: true,
    };

    if (this.debug) {
      this.debug(`requestOptions ${JSON.stringify(requestOptions)}`);
    }

    const token: OAuth.Token = {
      key: this.token,
      secret: this.secret,
    };
    const headers = this.generateAuthorizationHeaderFromRequest(
      requestOptions,
      token
    );

    const request: AxiosRequestConfig = {
      url,
      headers: { ...headers, "Content-Type": "application/json" },
      method,
      data: body,
    };

    return await axios.request(request);
  }
}
