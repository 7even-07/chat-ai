const SITE_URL = "http://localhost:3000";

const config = {
  SITE_URL,
  BACKENDSITEURL: "http://localhost:8000",

  API: {
    BASE_URL: "https://api.example.com",
    USER: "/users",
    AUTH: "/auth",
  },

  APP: {
    NAME: "Seven Oceans",
    VERSION: "1.0.0",
    DESCRIPTION: "Seven Oceans",
    FAVICON: "../app/Static/img/seven-ocean.png",
  },

  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
  },

  WEBSIE_SITE_ASSETS_PATH: "/website",

  BACKEND_SITE_ASSETS_PATH: "http://localhost:8000/uploads",

};

export default config;
