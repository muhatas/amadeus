import Cookies from "js-cookie";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type JsonRecord = Record<string, unknown>;

class Client {
  private axios: AxiosInstance;

  constructor() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = Cookies.get("token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    this.axios = axios.create({
      baseURL: API_URL,
      headers,
    });
  }

  private resolveResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  parseResponse<T>(res: AxiosResponse<{ data: { data: T } }>): T {
    return res.data.data.data;
  }

  async get<T>(
    path: string,
    params: JsonRecord = {},
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axios.get<T>(path, {
      params,
      ...(config ?? {}),
    });
    return this.resolveResponse<T>(response);
  }

  async post<TResponse, TBody = JsonRecord>(
    path: string,
    data: TBody = {} as TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.axios.post<TResponse>(path, data, config);
    return this.resolveResponse<TResponse>(response);
  }
}

export const ClientApi = new Client();
