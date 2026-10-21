function Button({
    text,
    type="button",
    onClick,
    className=""
}){
    return(
        <button type={type} onClick={onClick} className={`w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg font-medium ${className}`}>
            {text}
        </button>
    )
}
export default Button;

