import { Card, CardContent } from "../ui/card";

const AuthCard = ({mode = "login", children}) => {
    return(
        <div className={`
            absolute
            w-[46%]
            top-1/2
            right-1/2
            -translate-y-1/2
            transition-transform duration-1000 ease-in-out          
            ${mode === "login" ? "translate-x-full" : "translate-x-0"}
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