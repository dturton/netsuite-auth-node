"use strict";
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @packageDocumentation A small ultility to connect to NetSuite's SuiteTalk REST Web Services
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_1_0a_1 = __importDefault(require("oauth-1.0a"));
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
const debug_1 = __importDefault(require("debug"));
class NsApi {
    constructor(options) {
        this.options = options;
        this.hashFunction = (base_string, key) => {
            return crypto
                .createHmac("sha256", key)
                .update(base_string)
                .digest("base64");
        };
        this.token = this.options.tokenId;
        this.secret = this.options.tokenSecret;
        this.accountId = options.accountId;
        if (options.debugger) {
            this.debug = (0, debug_1.default)("nsapi");
        }
        this.oauth = new oauth_1_0a_1.default({
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
    generateAuthorizationHeaderFromRequest(options, token) {
        return this.oauth.toHeader(this.oauth.authorize(options, token));
    }
    /**
     * Used to call any NetSuite Rest API endpoint
     *
     * @type {string }
     *
     * @type {string }
     * @public
     * @param opts
     */
    async request(opts) {
        const { path, body } = opts;
        const method = opts.method;
        if (this.debug) {
            this.debug(opts);
        }
        const urlAccountId = this.accountId.replace(/_/g, "-").toLowerCase();
        const url = `https://${urlAccountId}.suitetalk.api.netsuite.com/services/rest/${path}`;
        const requestOptions = {
            url,
            method,
            data: body,
            includeBodyHash: true,
        };
        if (this.debug) {
            this.debug(`requestOptions ${JSON.stringify(requestOptions)}`);
        }
        const token = {
            key: this.token,
            secret: this.secret,
        };
        const headers = this.generateAuthorizationHeaderFromRequest(requestOptions, token);
        const request = {
            url,
            headers: { ...headers, "Content-Type": "application/json" },
            method,
            data: body,
        };
        return await axios_1.default.request(request);
    }
}
exports.default = NsApi;
