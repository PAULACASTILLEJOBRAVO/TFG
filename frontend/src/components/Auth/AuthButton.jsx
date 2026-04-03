import { Button } from "../ui/button";

const AuthButton = ({children, ...props }) => {
    return(
        <Button 
            {...props} 
            className="w-full bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-full border border-black"    
        >
            {children}
        </Button>
    )
}

export default AuthButton;