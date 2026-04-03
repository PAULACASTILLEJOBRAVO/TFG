const AuthLayout = ({children}) => {
    return(
        <div className="
            relative
            min-h-screen 
            w-full
            flex 
            items-center justify-center 
            bg-black
            px-4
            overflow-hidden
        ">
            {children}
        </div>
    );
};

export default AuthLayout;