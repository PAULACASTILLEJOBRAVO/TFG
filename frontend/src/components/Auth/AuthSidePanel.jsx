import AuthButton from "@/components/Auth/AuthButton";

const AuthSidePanel = ({position = "left", onToggle}) => {

    return (
        <div className={`absolute inset-0 flex`}>

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
                        src="/public/vite.svg"
                        alt="Clicklass"
                        className="w-16 h-16 mx-auto"
                    />
                </div>

                <div className="flex flex-col gap-3 mb-8">
                    <h1 className="text-3xl font-bold text-red-700">
                        Clicklass
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-[320px] text-gray-600">
                        Interactive responsive system for active learning
                    </p>                
                </div>

                <AuthButton variant="outline" className="mt-4" onClick={onToggle}>
                    {position === "left" ? "SING UP" : "SING IN"}
                </AuthButton>                

                <div className="flex-1"/>
            </div>
            
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
                        src="/public/vite.svg"
                        alt="Clicklass"
                        className="w-16 h-16 mx-auto"
                    />
                </div>

                <div className="flex flex-col gap-3 mb-8">
                    <h1 className="text-3xl font-bold text-red-700">
                        Clicklass
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-[320px] text-gray-600">
                        Interactive responsive system for active learning
                    </p>                
                </div>

                <AuthButton variant="outline" className="mt-4" onClick={onToggle}>
                    {position === "left" ? "SING UP" : "SING IN"}
                </AuthButton>                

                <div className="flex-1"/>
            </div>
        </div>
    );
}

export default AuthSidePanel;