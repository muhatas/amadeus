import Cookies from "js-cookie";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class Client {
  constructor() {
    let headers = {
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

  resolveResponse(response) {
    const { data } = response;

    return data;
  }

  parseResponse(res) {
    return res.data.data;
  }

  async get(path, params = {}) {
    const response = await this.axios.get(path, { params });
    return this.resolveResponse(response);
  }

  async post(path, data = {}) {
    const response = await this.axios.post(path, data);
    return response;
  }
}

export const ClientApi = new Client();
