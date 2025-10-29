export default function Spinner({ label = 'Carregando...' }) {
    return (
        <div className="flex items-center gap-2 p-4 text-gray-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            <span className="text-sm">{label}</span>
        </div>
    )
}