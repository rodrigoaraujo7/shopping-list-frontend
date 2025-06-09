import axios from "axios";

export const api = axios.create({
  baseURL:
    "https://shopping-list-backend-rodrigoaraujo7-rodrigo-araujos-projects.vercel.app/",
});
