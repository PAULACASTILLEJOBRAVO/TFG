import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../services/auth.service";
import { useAuth } from "../../auth/AuthContext";

const LoginForm_Navegation = () => {
    const [form, setForm] = useState({email: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState("");

    const { login } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try{
            const { message, data } = await loginRequest(form);
            login(data);
            setMessages(message);
            navigate("/courses");
        }catch(err){
            const errorMessage = err.response?.data?.message || "Error al iniciar sesión";
            setError(errorMessage);
        }finally{
            setLoading(false);
        }
    };

    return(
        <div>
            {messages && <p>{messages}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="Email"
                />
                <input 
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    placeholder="Contraseña"
                />
                <button disabled={loading} >
                    {loading ? "Entrando." : "Login"}
                </button>
                {error && <p>{error}</p>}
            </form>
        </div>
    )
}

export default LoginForm;