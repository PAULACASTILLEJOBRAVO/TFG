const AuthContainer = ({ children }) => {
    return(
        <div className="
            relative
            w-full max-w-[900px]
            h-[80vh] max-h-[520px]
            bg-white
            rounded-xl 
            shadow-xl 
            overflow-visible
        ">
            {children}
        </div>
    );
};

export default AuthContainer;