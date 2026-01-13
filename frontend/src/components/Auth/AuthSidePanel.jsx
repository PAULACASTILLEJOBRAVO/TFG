import AuthButton from "@/components/Auth/AuthButton";

const AuthSidePanel = ({onToggle}) => {

    return (
        <div className={`absolute h-full inset-0 sm:flex hidden`}>

            <div className={`
                w-1/2 
                h-full
                flex flex-col
                justify-center items-center text-center
                px-8
            `}>

                <div className="flex-1"/>

                <div className="mb-8">
                    <img 
                        src="/ClicklassLogo.png"
                        alt="Clicklass"
                        className="w-auto h-20 mx-auto"
                    />
                </div>

                <div className="flex flex-col gap-3 mb-8">
                    <h1 className="text-4xl font-bold text-red-700">
                        Clicklass
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-[320px] text-gray-600">
                        Interactive responsive system for active learning
                    </p>                
                </div>

                <div className="px-4 w-full">
                    <AuthButton variant="outline" className="mt-4" onClick={onToggle}>
                        SING UP
                    </AuthButton> 
                </div>       

                <div className="flex-1"/>
            </div>
            
            <div className={`
                w-1/2 
                h-full
                flex flex-col
                justify-center items-center text-center
                px-6
            `}>

                <div className="flex-1"/>

                <div className="mb-8">
                    <img 
                        src="/ClicklassLogo.png"
                        alt="Clicklass"
                        className="w-auto h-20 mx-auto"
                    />
                </div>

                <div className="flex flex-col gap-3 mb-8">
                    <h1 className="text-4xl font-bold text-red-700">
                        Clicklass
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-[320px] text-gray-600">
                        Interactive responsive system for active learning
                    </p>                
                </div>

                <div className="px-4 w-full">
                    <AuthButton variant="outline" className="mt-4" onClick={onToggle}>
                        SING IN
                    </AuthButton>  
                </div>          

                <div className="flex-1"/>
            </div>
        </div>
    );
}

export default AuthSidePanel;