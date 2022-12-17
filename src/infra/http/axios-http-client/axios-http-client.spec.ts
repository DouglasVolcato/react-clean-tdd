import { AxiosHttpClient } from "./axios-http-client";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient();
};

describe("AxiosHttpClient", () => {
  test("Should call axios with correct url.", async () => {
    const url = "any_url";
    const sut = makeSut();
    await sut.post({ url });
    expect(mockedAxios).toHaveBeenCalledWith("any_url");
  });
});