import axios from "axios";

const API_URL = "http://localhost:8080/api/user/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data.token;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
