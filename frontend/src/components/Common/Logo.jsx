const Logo = () => {
    return(
        <div className="flex items-center gap-3" >
            <img src="/ClicklassLogo.png" alt="Clicklass Logo" className={`h-10 w-auto `} />
            <span className="text-3xl text-red-700 font-bold">Clicklass</span>
        </div>
    );
}

export default Logo;