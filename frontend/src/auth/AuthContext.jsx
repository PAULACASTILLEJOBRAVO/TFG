import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) =>  {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

        if(storedToken && storedUser !== "undefined") {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = (data, rememberMe = false) => {
        const userData = {
            _id: data._id,
            username: data.username,
            email: data.email,
            role: data.role
        };

        setToken(data.token);
        setUser(userData);

        if(rememberMe){
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(userData));
        }
    }

    const logout = () => {
        setToken(null);
        setUser(null);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    }

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout
    }

    if (loading) return null;

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);