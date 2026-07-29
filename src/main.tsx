import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";


ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <HelmetProvider>

    <BrowserRouter>

      <App />

    </BrowserRouter>

  </HelmetProvider>

);