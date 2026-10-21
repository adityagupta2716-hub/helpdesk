function FormInput({
    label,
    type,
    placeholder,
    name,
    register,
    rules,
    error
}){
    return(
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input type={type} placeholder={placeholder} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
            {...register(name,rules)}/> 
            {error && (<p className="text-red-500 text-sm mt-1">{error.message}</p>)}

        </div>
    )
}
export default FormInput;