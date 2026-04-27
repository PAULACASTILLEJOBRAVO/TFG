const Logo = () => {
    return(
        <div className="flex items-center gap-3" >
            <img src="/QuizlectiveLogo.png" alt="Quizlective Logo" className={`h-10 w-auto `} />
            <span className="text-3xl hidden md:flex text-red-700 font-bold">Quizlective</span>
        </div>
    );
}

export default Logo;