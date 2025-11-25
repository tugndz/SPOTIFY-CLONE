import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);

    const { currentSong, isPlaying } = usePlayerStore();

    // xử lý logic phát/tạm dừng
    useEffect(() => {
        if (isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
    }, [isPlaying]);

    // xử lý bài hát kết thúc (repeat-one + next/shuffle)
    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => {
            const { isRepeatOne, playNext } = usePlayerStore.getState();

            if (isRepeatOne && audioRef.current) {
                // lặp lại chính bài hiện tại
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                usePlayerStore.setState({ isPlaying: true });
            } else {
                // chuyển sang bài tiếp theo, tôn trọng shuffle trong playNext
                playNext();
            }
        };

        audio?.addEventListener("ended", handleEnded);

        return () => audio?.removeEventListener("ended", handleEnded);
    }, []);

    // xử lý thay đổi bài hát
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        const audio = audioRef.current;

        //kiểm tra xem đây có thực sự là một bài hát mới không
        const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
        if (isSongChange) {
            audio.src = currentSong?.audioUrl
            // đặt lại vị trí phát lại
            audio.currentTime = 0;

            prevSongRef.current = currentSong?.audioUrl;

            if (isPlaying) audio.play();
        }
    }, [currentSong, isPlaying]);

    return <audio ref={audioRef} />
}

export default AudioPlayer
