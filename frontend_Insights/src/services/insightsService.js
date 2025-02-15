import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Update with your backend URL

const insightsService = {
  get: (endpoint) => axios.get(`${API_URL}${endpoint}`),
};

export default insightsService;
