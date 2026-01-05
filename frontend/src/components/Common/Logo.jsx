const Logo = () => {
    return(
        <div className="flex items-center gap-1 sm:gap-3" >
            <img src="/LogoClicklass.png" alt="Clicklass Logo" className={`h-5 sm:h-10 w-auto `} />
            <span className="text-xl sm:text-3xl text-red-700 font-bold">Clicklass</span>
        </div>
    );
}

export default Logo;