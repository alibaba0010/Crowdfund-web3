import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThirdwebProvider } from "thirdweb/react";
import { BrowserRouter } from "react-router-dom";
import StateContextProvider from "./context/index.jsx";
import { activeChain, clientId } from "./utils";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThirdwebProvider activeChain={activeChain} clientId={clientId}>
      <BrowserRouter>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </BrowserRouter>
    </ThirdwebProvider>
  </StrictMode>
);
