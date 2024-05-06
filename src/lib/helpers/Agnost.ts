import { AgnostError } from "@/types";
import axios, { type AxiosRequestConfig } from "axios";

type BodyType = Record<string, any> | FormData;

type AxiosHeaders = Record<string, string>;

type FetcherResponse<T> = {
  data: T | undefined;
  error?: any;
  errorResponse?: any;
  status: number;
};

function removeFirstSlash(path: string) {
  return path.replace(/^\//, "");
}

class Agnost {
  private headers(init?: AxiosRequestConfig): AxiosHeaders {
    let headers: Record<string, string> = {};

    if (!(init?.data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      headers["Authorization"] = process.env.AGNOST_API_KEY as string;
    }

    if (init?.headers) {
      // @ts-ignore
      headers = {
        ...init.headers,
        ...headers,
      };
    }

    return headers as AxiosHeaders;
  }

  private body(data?: BodyType) {
    if (!data) return undefined;
    if (data instanceof FormData) return data;
    return JSON.stringify(data);
  }

  private async fetcher<T>(
    path: string,
    init?: AxiosRequestConfig,
  ): Promise<FetcherResponse<T>> {
    const res = await axios<T>(
      `${process.env.NEXT_PUBLIC_AGNOST_API_URL}/${removeFirstSlash(path)}`,
      {
        ...init,
        data: this.body(init?.data),
        validateStatus: () => true,
        ...(init && { headers: this.headers(init) }),
      },
    );

    if (res.status >= 400 && res.status < 600) {
      console.log("method:", init?.method);
      console.log("data:", init?.data);
      console.log(
        "path:",
        `${process.env.NEXT_PUBLIC_AGNOST_API_URL}/${removeFirstSlash(path)}`,
      );
      console.error(JSON.stringify(res.data, null, 4));

      return this.errorResponse({
        // @ts-ignore
        message: res.data?.message ?? res.statusText,
        status: res.status,
        rawResponse: res.data as AgnostError[],
      });
    }

    return this.dataResponse<T>(res.data, res.status);
  }

  get<T>(path: string, headers?: AxiosHeaders) {
    return this.fetcher<T>(path, {
      method: "GET",
      headers,
    });
  }

  post<T>(path: string, data?: BodyType, headers?: AxiosHeaders) {
    return this.fetcher<T>(path, {
      method: "POST",
      data,
      headers,
    });
  }

  put<T>(path: string, data?: BodyType, headers?: AxiosHeaders) {
    return this.fetcher<T>(path, {
      method: "PUT",
      data,
      headers,
    });
  }

  delete<T>(path: string, data?: BodyType, headers?: AxiosHeaders) {
    return this.fetcher<T>(path, {
      method: "DELETE",
      data,
      headers,
    });
  }

  private errorResponse(payload: {
    message: string;
    status: number;
    rawResponse: AgnostError[];
  }) {
    return {
      data: undefined,
      status: payload.status,
      error: payload.message,
      errorResponse: payload.message,
      rawResponse: payload.rawResponse,
    };
  }

  private dataResponse<T>(data: T, status?: number) {
    return {
      data,
      error: undefined,
      status: status ?? 200,
    };
  }
}

export const agnost = new Agnost();
