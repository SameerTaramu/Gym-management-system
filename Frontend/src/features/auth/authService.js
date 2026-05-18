import axios from "axios";

const API_URL = "http://localhost:5005/api/auth/";
const storedUser = JSON.parse(localStorage.getItem("user"));
if (storedUser?.token) {
  axios.defaults.headers.common["Authorization"] =
    `Bearer ${storedUser.token}`;
}

const register = async (userData) => {
  const res = await axios.post(`${API_URL}register`, userData);
  return res.data;
};

const login = async (userData) => {
  const res = await axios.post(`${API_URL}login`, userData);

  const fullUser = {
    _id: res.data.user._id,
    name: res.data.user.name,
    email: res.data.user.email,
    role: res.data.user.role, // ✅ REQUIRED
    token: res.data.token,
  };

  localStorage.setItem("user", JSON.stringify(fullUser));

  axios.defaults.headers.common["Authorization"] =
    `Bearer ${res.data.token}`;

  return fullUser;
};

   
const logout = () => {
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"];
};

export default {
  register,
  login,
  logout,
};
