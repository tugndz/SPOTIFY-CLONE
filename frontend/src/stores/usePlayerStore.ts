import type { Song } from "@/types";
import { create } from "zustand";

interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;
    isShuffle: boolean;
    isRepeatOne: boolean;


    initializeQueue: (songs: Song[]) => void;
    playAlbum: (song: Song[], startIndex?: number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    playRandom: () => void;
    toggleShuffle: () => void;
    toggleRepeatOne: () => void;

}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    isShuffle: false,
    isRepeatOne: false,

    initializeQueue: (songs: Song[]) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex
        })
    },

    playAlbum: (songs: Song[], startIndex = 0) => {
        if (songs.length === 0) return;

        const song = songs[startIndex];

        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true,
        });
    },
    setCurrentSong: (song: Song | null) => {
        if (!song) return;

        const songIndex = get().queue.findIndex(s => s._id === song._id);
        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex
        });
    },
    togglePlay: () => {
        const willStarPlaying = !get().isPlaying;

        set({
            isPlaying: willStarPlaying,
        });
    },
    playNext: () => {
        const { currentIndex, queue, isShuffle } = get();

        if (!queue || queue.length === 0) return;

        // nếu đang bật shuffle thì chọn bài tiếp theo ngẫu nhiên
        if (isShuffle) {
            let randomIndex = Math.floor(Math.random() * queue.length);

            if (queue.length > 1) {
                let safety = 0;
                while (randomIndex === currentIndex && safety < 10) {
                    randomIndex = Math.floor(Math.random() * queue.length);
                    safety++;
                }
            }

            const nextSong = queue[randomIndex];

            set({
                currentSong: nextSong,
                currentIndex: randomIndex,
                isPlaying: true,
            });
            return;
        }

        // chế độ bình thường: phát tuần tự
        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
            const nextSong = queue[nextIndex];
            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            });
        } else {
            set({ isPlaying: false });
        }
    },

    playPrevious: () => {
        const { currentIndex, queue, isShuffle } = get();

        if (!queue || queue.length === 0) return;

        // nếu đang bật shuffle thì chọn bài bất kỳ khác bài hiện tại
        if (isShuffle) {
            let randomIndex = Math.floor(Math.random() * queue.length);

            if (queue.length > 1) {
                let safety = 0;
                while (randomIndex === currentIndex && safety < 10) {
                    randomIndex = Math.floor(Math.random() * queue.length);
                    safety++;
                }
            }

            const prevSong = queue[randomIndex];

            set({
                currentSong: prevSong,
                currentIndex: randomIndex,
                isPlaying: true,
            });
            return;
        }

        // chế độ bình thường: lùi lại 1 bài
        const prevIndex = currentIndex - 1;

        if (prevIndex >= 0) {
            const prevSong = queue[prevIndex];
            set({
                currentSong: prevSong,
                currentIndex: prevIndex,
                isPlaying: true,
            })
        } else {
            set({ isPlaying: false });
        }
    },
    playRandom: () => {
        const { queue, currentIndex } = get();

        // nếu queue rỗng thì không làm gì
        if (!queue || queue.length === 0) return;

        // chọn index ngẫu nhiên, cố gắng khác bài hiện tại
        let randomIndex = Math.floor(Math.random() * queue.length);

        if (queue.length > 1) {
            let safety = 0;
            while (randomIndex === currentIndex && safety < 10) {
                randomIndex = Math.floor(Math.random() * queue.length);
                safety++;
            }
        }

        const randomSong = queue[randomIndex];

        set({
            currentSong: randomSong,
            currentIndex: randomIndex,
            isPlaying: true,
        });
    },

    toggleShuffle: () => {
        set((state) => ({
            isShuffle: !state.isShuffle,
        }));
    },

    toggleRepeatOne: () => {
        set((state) => ({
            isRepeatOne: !state.isRepeatOne,
        }));
    },

}))