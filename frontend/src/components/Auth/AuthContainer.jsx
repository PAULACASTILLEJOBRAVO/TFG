const AuthContainer = ({ children }) => {
    return(
        <div className="
            relative
            w-full max-w-[900px]
            max-h-[520px] min-h-[520px]
            bg-white
            rounded-xl 
            shadow-xl 
        ">
            {children}
        </div>
    );
};

export default AuthContainer;