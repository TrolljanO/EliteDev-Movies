export default function MovieCard ({ movie, isFavorite, onDetails, onToggleFavorite }) {

    const img = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null

    return (
    <div className="bg-gray-800 text-white rounded shadow hover:shadow-lg transition overflow-hidden">
    {img && <img src={img} alt={movie.title} className="w-full h-72 object-cover" />}

        <div className="p-3">
            <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
            <div className="flex items-center justify-between mt-2">
                <button onClick={onDetails} className="text-sm text-blue-300 hover:underline">
                    Detalhes
                </button>
                <button onClick={onToggleFavorite} className={`text-sm ${isFavorite ? 'text-yellow-300' : 'text-gray-300'}`}>
                    {isFavorite ? '★ Favorito' : '☆ Favoritar'}
                </button>
            </div>
        </div>
    </div>
    )
}