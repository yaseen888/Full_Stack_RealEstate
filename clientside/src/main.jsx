import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css'


ReactDOM.createRoot(document.getElementById("root")).render(


  <MantineProvider defaultColorScheme="dark" >
    <React.StrictMode>
      <Auth0Provider
        domain="dev-l5doc43bopbeu0f8.us.auth0.com"
        clientId="tDWD98yLqNgKn96uoxt9Ohs0ssUVTbzo"
        authorizationParams={{
          redirect_uri: "https://full-stack-real-estate-client.vercel.app/",
        }}
        audience="http://localhost:8000"
        scope="openid profile email"
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  </MantineProvider>
);
