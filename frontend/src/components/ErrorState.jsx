export default function ErrorState({ message = 'Algo deu errado.'}) {
    return (
        <div className="p-4 text-sm text-red-400 bg-red-950/20 rounded">
            {message}
        </div>
    )
}