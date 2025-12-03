import type { Song } from "@/types";
import { create } from "zustand";
import { useChatStore } from "./useChatStore";

const ensureSongIndex = (queue: Song[], song: Song) => {
  let idx = queue.findIndex((s) => s._id === song._id);
  if (idx === -1) {
    queue.push(song); // thêm vào cuối nếu chưa có
    idx = queue.length - 1;
  }
  return { queue, idx };
};

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

    const state = get();
    const { queue, idx } = ensureSongIndex([...state.queue], song); // copy queue cũ

    set({
        queue,
        currentSong: song,
        isPlaying: true,
        currentIndex: idx,
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
    const { currentSong, currentIndex, queue, isShuffle } = get();
    if (!queue || queue.length === 0) return;

    // xác định index hiện tại an toàn
    const baseIndex =
        currentIndex >= 0
            ? currentIndex
            : currentSong
            ? queue.findIndex((s) => s._id === currentSong._id)
            : 0;

    // giữ nguyên khối shuffle cũ
    if (isShuffle) {
        let randomIndex = Math.floor(Math.random() * queue.length);
        if (queue.length > 1) {
            let safety = 0;
            while (randomIndex === baseIndex && safety < 10) {
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
        set({ currentSong: nextSong, currentIndex: randomIndex, isPlaying: true });
        return;
    }

    // bình thường: tiến 1 bài
    const nextIndex = baseIndex + 1;
    if (nextIndex < queue.length) {
        const nextSong = queue[nextIndex];
        const socket = useChatStore.getState().socket;
        if (socket?.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
            });
        }
        set({ currentSong: nextSong, currentIndex: nextIndex, isPlaying: true });
    } else {
        set({ isPlaying: false });
    }
},


playPrevious: () => {
    const { currentSong, currentIndex, queue, isShuffle } = get();
    if (!queue || queue.length === 0) return;

    const baseIndex =
        currentIndex >= 0
            ? currentIndex
            : currentSong
            ? queue.findIndex((s) => s._id === currentSong._id)
            : 0;

    // giữ nguyên khối shuffle cũ
    if (isShuffle) {
        let randomIndex = Math.floor(Math.random() * queue.length);
        if (queue.length > 1) {
            let safety = 0;
            while (randomIndex === baseIndex && safety < 10) {
                randomIndex = Math.floor(Math.random() * queue.length);
                safety++;
            }
        }
        const prevSong = queue[randomIndex];
        const socket = useChatStore.getState().socket;
        if (socket?.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
            });
        }
        set({ currentSong: prevSong, currentIndex: randomIndex, isPlaying: true });
        return;
    }

    // bình thường: lùi 1 bài
    const prevIndex = baseIndex - 1;
    if (prevIndex >= 0) {
        const prevSong = queue[prevIndex];
        const socket = useChatStore.getState().socket;
        if (socket?.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
            });
        }
        set({ currentSong: prevSong, currentIndex: prevIndex, isPlaying: true });
    } else {
        set({ isPlaying: false });
    }
},


playRandom: () => {
    const { queue, currentIndex } = get();
    if (!queue || queue.length === 0) return;

    // bật chế độ shuffle để Next/Prev dùng random
    let randomIndex = Math.floor(Math.random() * queue.length);
    if (queue.length > 1) {
        let safety = 0;
        while (randomIndex === currentIndex && safety < 10) {
            randomIndex = Math.floor(Math.random() * queue.length);
            safety++;
        }
    }

    const randomSong = queue[randomIndex];

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
        isShuffle: true, // bật shuffle để Next/Prev random
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