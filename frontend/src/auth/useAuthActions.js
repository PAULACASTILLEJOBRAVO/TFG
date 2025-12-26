import { loginRequest } from '../services/auth.service';
import { useAuth } from './AuthContext';

export default useAuthActions = () => {
    const { login } = useAuth();

    const signIn = async (credentials) => {
        const data = await loginRequest(credentials);
        login(data);
        return data;
    }

    return { signIn };
};