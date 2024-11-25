import { createContext, useContext } from "react";
const StateContext = createContext();

export const useStateContext = () => useContext(StateContext);
