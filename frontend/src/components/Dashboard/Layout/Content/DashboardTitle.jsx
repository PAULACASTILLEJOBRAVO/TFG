import { useAuth } from "@/auth/AuthContext";

const DashboardTitle = () => {
    const { user } = useAuth();

    return(
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold my-4 md:my-6">
            { user.role === "admin" ? "Panel de administración" : `Hola, ${user.username}` }
        </h1>
    );
}

export default DashboardTitle;