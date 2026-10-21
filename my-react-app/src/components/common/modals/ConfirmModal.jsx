function ConfirmModal({
    isOpen,
    title,
    message,
    showTextarea=false,
    textareaValue="",
    onTextareaChange,
    textareaPlaceholder="",
    error="",

    onConfirm,
    onCancel,

    confirmText="Delete",
    cancelText="Cancel"
})
{
    if(!isOpen)
    {
        return null;
    }
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    🗑️
                </div>
                <h2 className="text-xl font-semibold">
                    {title}
                </h2>
                <p className="text-gray-600 mt-3">
                    {message}
                </p>
                {showTextarea && (
                    <>
                        <textarea
                            value={textareaValue}
                            onChange={(e)=>onTextareaChange(e.target.value)}
                            placeholder={textareaPlaceholder}
                            rows={4}
                            className="w-full mt-4 border rounded-lg p-3 resize-none"
                        />
                        {error && (
                            <p className="text-red-600 text-sm mt-2">
                                {error}
                            </p>
                        )}
                    </>
                )}
                
                {error && (
                    <p className="text-red-600 text-sm mt-2">
                        {error}
                    </p>
                )}
                <div className="flex justify-end gap-3 mt-6">
                    <button 
                    onClick={onCancel}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                        {cancelText}
                    </button>
                    <button 
                    onClick={onConfirm}
                    className="px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default ConfirmModal;