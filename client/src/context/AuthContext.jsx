import {
    useEffect,
    useState,
} from "react";

import { AuthContext } from "./AuthContextValue.js";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const restoreUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/auth/me",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        cache: "no-store",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    localStorage.removeItem("token");
                    setUser(null);
                    return;
                }

                setUser(data.user);
            } catch (error) {
                console.error(
                    "Failed to restore authentication:",
                    error
                );
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}