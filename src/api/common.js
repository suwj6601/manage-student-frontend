import axios from "axios";
import { message } from "antd";
import { store } from "@/redux/store";
import { USER_LOG_OUT } from "@/redux/type";
import { useNavigate as navigate } from "react-router-dom";

const API_TIMEOUT = 10000;
const BASE_ENDPOINT = "https://testdb-zrzd.onrender.com";

const api = async (method = "get", url, requestBody, params) => {
  try {
    const { User } = store.getState();
    const { token } = User;

    const res = await axios({
      method,
      url: BASE_ENDPOINT + url,
      data: requestBody,
      params,
      timeout: API_TIMEOUT,
      headers: {
        accesstoken: token,
      },
    });

    if (res?.data?.code === 401) {
      message.error("Must to login");
      store.dispatch({
        type: USER_LOG_OUT,
      });
    }

    return res?.data;
  } catch (error) {
    return { error: error?.response?.data?.message };
  }
};

export default api;
