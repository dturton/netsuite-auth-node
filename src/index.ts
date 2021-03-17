/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @packageDocumentation A small ultility to connect to NetSuite's SuiteTalk REST Web Services
 */

import OAuth, { RequestOptions } from "oauth-1.0a";
import axios, { AxiosResponse } from "axios";
import * as crypto from "crypto";
import { NSApiOptions, NSApiRequestOptions } from "./types";

export default class NsApi {
  private readonly oauth: OAuth;
  private readonly token: string;
  private readonly secret: string;
  private readonly companyUrl: string;

  constructor(private readonly options: NSApiOptions) {
    this.token = this.options.tokenId;
    this.secret = this.options.tokenSecret;
    this.companyUrl = this.options.companyUrl;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
   *
   * @param path - path to the resource. For example: ecord/v1/salesOrder/13842048?expandSubResources=true
   * @param method - POST,GET,PUT ETC.
   * @type {string }
   *
   * @param body - String of for the body content.
   * @type {string }
   * @public
   */
  public async request(opts: NSApiRequestOptions): Promise<AxiosResponse> {
    const { path, method, body } = opts;

    const url = `${this.companyUrl}/services/rest/${path}`;

    const requestOptions: OAuth.RequestOptions = {
      url,
      method,
      data: body,
    };

    const token: OAuth.Token = {
      key: this.token,
      secret: this.secret,
    };
    const headers = this.generateAuthorizationHeaderFromRequest(
      requestOptions,
      token
    );

    return await axios.get(url, {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  /**
   * Used to call any NetSuite Rest API endpoint
   *
   * @param path - path to the resource. For example: ecord/v1/salesOrder/13842048?expandSubResources=true
   * @param method - POST,GET,PUT ETC.
   * @type {string }
   *
   * @param body - String of for the body content.
   * @type {string }
   * @public
   */
  public async callRestlet(opts: NSApiRequestOptions): Promise<AxiosResponse> {
    const { path, method, body } = opts;

    const url = `${this.companyUrl}/app/site/hosting/restlet.nl${path}`;

    const requestOptions: OAuth.RequestOptions = {
      url,
      method,
      data: body,
    };

    const token: OAuth.Token = {
      key: this.token,
      secret: this.secret,
    };
    const headers = this.generateAuthorizationHeaderFromRequest(
      requestOptions,
      token
    );

    return await axios.get(url, {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
}
