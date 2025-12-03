import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Search } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import type { Song } from "@/types";

const TopBarSearch = () => {
    const { playAlbum } = usePlayerStore();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const handle = setTimeout(async () => {
            try {
                setIsLoading(true);
                const res = await axiosInstance.get("/songs/search", {
                    params: { q: query },
                });

                // đảm bảo luôn là mảng
                const data = Array.isArray(res.data) ? res.data : [];
                setResults(data);
            } catch (err) {
                console.error(err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 400); // debounce

        return () => clearTimeout(handle);
    }, [query]);

    const showDropdown = isFocused && (query.trim().length > 0 || isLoading);

    return (
        <div className="relative max-w-md w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 
                     text-sm outline-none focus:border-emerald-500"
                />
            </div>

            {showDropdown && (
                <div className="absolute mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
                    {isLoading && (
                        <div className="px-3 py-2 text-xs text-zinc-400">
                            Đang tìm kiếm...
                        </div>
                    )}

                    {!isLoading && results.length === 0 && query.trim() && (
                        <div className="px-3 py-2 text-xs text-zinc-400">
                            Không tìm thấy kết quả
                        </div>
                    )}

                    {!isLoading &&
                        Array.isArray(results) &&
                        results.map((song: Song, index) => (
                            <button
                                key={song._id}
                                type="button"
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-zinc-800/80"
                                onClick={() => {
                                    playAlbum(results, index);
                                    setQuery("");
                                    setResults([]);
                                }}
                            >
                                <img
                                    src={song.imageUrl}
                                    alt={song.title}
                                    className="w-9 h-9 rounded object-cover"
                                />
                                <div className="min-w-0">
                                    <div className="text-sm font-medium truncate">
                                        {song.title}
                                    </div>
                                    <div className="text-xs text-zinc-400 truncate">
                                        {song.artist}
                                    </div>
                                </div>
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
};

export default TopBarSearch;