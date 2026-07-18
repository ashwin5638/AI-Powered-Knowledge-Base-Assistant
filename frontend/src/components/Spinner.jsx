const Spinner = ({ size = 'md', message = 'Loading...' }) => {
    const sizes = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
            <div className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600`} />
            {message && <p className="text-sm text-gray-500">{message}</p>}
        </div>
    )
}

export default Spinner
