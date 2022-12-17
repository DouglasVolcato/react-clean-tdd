import { InvalidCredentialsError } from "../../../domain/errors/invalid-credentials-error";
import { HttpStatusCode } from "../../protocols/http/http-response";
import { HttpPostClientSpy } from "../../test/mock-http-client";
import { mockAuthentication } from "../../test/mock-authentication";
import { RemoteAuthentication } from "./remote-authentication";

type SutTypes = {
  sut: RemoteAuthentication;
  httpPostClientSpy: HttpPostClientSpy;
};

const url = "other_url";

const makeSut = (url = "any_url"): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy();
  const sut = new RemoteAuthentication(url, httpPostClientSpy);
  return { sut, httpPostClientSpy };
};

describe("RemoteAuthentication", () => {
  test("Should call HttpPostClient with correct URL.", async () => {
    const { sut, httpPostClientSpy } = makeSut(url);
    await sut.auth(mockAuthentication());
    expect(httpPostClientSpy.url).toBe(url);
  });

  test("Should call HttpPostClient with correct Body.", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    await sut.auth(mockAuthentication());
    expect(httpPostClientSpy.body).toEqual(mockAuthentication());
  });

  test("Should throw InvalidCredentialsError if HttpPostClient returns 401.", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized,
    };
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });
});
