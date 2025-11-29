import type { Song } from "@/types";
import { create } from "zustand";
import { useChatStore } from "./useChatStore";

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

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`,
            });
        }

        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true,
        });
    },
    setCurrentSong: (song: Song | null) => {
        if (!song) return;

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`,
            });
        }

        const songIndex = get().queue.findIndex(s => s._id === song._id);
        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex
        });
    },
    togglePlay: () => {
        const willStarPlaying = !get().isPlaying;

        const currentSong = get().currentSong;
        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity:
                    willStarPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
            });
        }

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

            const socket = useChatStore.getState().socket;
            if (socket?.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
                });
            }

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

            const socket = useChatStore.getState().socket;
            if (socket?.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
                });
            }

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

        // Nếu bật shuffle thì chọn ngẫu nhiên bài khác bài hiện tại
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

            // Cập nhật trạng thái đang nghe cho bạn bè qua socket chat
            const socket = useChatStore.getState().socket;
            if (socket?.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
                });
            }

            set({
                currentSong: prevSong,
                currentIndex: randomIndex,
                isPlaying: true,
            });
            return;
        }

        // Chế độ tuần tự: lùi lại 1 bài
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            const prevSong = queue[prevIndex];

            // Cập nhật trạng thái đang nghe cho bạn bè qua socket chat
            const socket = useChatStore.getState().socket;
            if (socket?.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
                });
            }

            set({
                currentSong: prevSong,
                currentIndex: prevIndex,
                isPlaying: true,
            });
        } else {
            set({ isPlaying: false });
        }
    },

    playRandom: () => {
        const { queue, currentIndex } = get();
        if (!queue || queue.length === 0) return;

        // Chọn index ngẫu nhiên, cố gắng khác bài hiện tại
        let randomIndex = Math.floor(Math.random() * queue.length);
        if (queue.length > 1) {
            let safety = 0;
            while (randomIndex === currentIndex && safety < 10) {
                randomIndex = Math.floor(Math.random() * queue.length);
                safety++;
            }
        }

        const randomSong = queue[randomIndex];

        // Cập nhật trạng thái đang nghe cho bạn bè qua socket chat
        const socket = useChatStore.getState().socket;
        if (socket?.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${randomSong.title} by ${randomSong.artist}`,
            });
        }

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