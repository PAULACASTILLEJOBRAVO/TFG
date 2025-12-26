const AuthLayout = ({children}) => {
    return(
        <div className="
            min-h-screen 
            flex 
            items-center justify-center 
            bg-black
            px-4
        ">
            {children}
        </div>
    );
};

export default AuthLayout;