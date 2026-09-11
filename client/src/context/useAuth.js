import { useContext } from "react";
import { AuthContext } from "./AuthContextValue.js";

export function useAuth() {
    return useContext(AuthContext);
}