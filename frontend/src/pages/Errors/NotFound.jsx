import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-lg">Página no encontrada</p>
            <Link to="/">
                <Button className="mt-4">
                    <House className="mr-2 h-4 w-4" />
                    Volver a Inicio
                </Button>
            </Link>
        </div>
    );
}

export default NotFound;