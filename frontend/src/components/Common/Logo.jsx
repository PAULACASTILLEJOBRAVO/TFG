const Logo = ({size = 16}) => {
    return(
        <div className="flex items-center gap-3" >
            <img src="/LogoClicklass.png" alt="Clicklass Logo" className={`h-${size} w-auto`} />
            <span className="text-3xl text-red-700 font-bold">Clicklass</span>
        </div>
    );
}

export default Logo;