import axios from "axios";

export const fetcher = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
});

fetcher.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  const refresh_token = localStorage.getItem("refresh_token");
  if (token) {
    const verify_token_response = await axios.post(
      `${import.meta.env.VITE_PUBLIC_API_URL}/auth/verify-token`,
      {
        token,
      },
    );
    if (verify_token_response.status === 200) {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    }

    const refresh_token_response = await axios.post(
      `${import.meta.env.VITE_PUBLIC_API_URL}/auth/refresh-token`,
      {
        refresh_token,
      },
    );

    if (refresh_token_response.status === 200) {
      config.headers["Authorization"] =
        `Bearer ${refresh_token_response.data.access_token}`;

      return config;
    }
  }
  return config;
});
