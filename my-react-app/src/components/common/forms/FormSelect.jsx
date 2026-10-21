function FormSelect({label, name, options=[], register, rules, error}){
    return(
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <select className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
                {...register(name,rules)}>
                <option value="">Select {label}</option>
                {options.map((option)=>(
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>))}
            </select>
            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error.message}
                </p>
            )}
        </div>
    )
}
export default FormSelect;