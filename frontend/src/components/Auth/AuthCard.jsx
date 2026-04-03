import { Card, CardContent } from "../ui/card";

const AuthCard = ({mode = "login", children}) => {
    return(
        <div className={`
            absolute
            w-full sm:w-[46%]
            sm:top-1/2
            sm:right-1/2
            sm:-translate-y-1/2
            sm:transition-transform sm:duration-1000 sm:ease-in-out          
            ${mode === "login" ? "sm:translate-x-full" : "sm:translate-x-0"}
            z-10
        `}>
            <Card className="
                h-[580px] 
                bg-red-600 
                text-white
                shadow-lg
            ">
                <CardContent className="p-6 h-full">
                    {children}
                </CardContent>
            </Card>
        </div>
    )
}

export default AuthCard;