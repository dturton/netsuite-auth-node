import NsAPI from "..";
import axios, { AxiosResponse } from "axios";

jest.mock("axios"); //This is needed to allow jest to modify axios at runtime

const mockedNsAPI = NsAPI as jest.Mocked<typeof NsAPI>;

describe("NsAPI should be return", () => {
  test("three positive numbers", () => {
    expect(1).toBe(1);
  });
});
