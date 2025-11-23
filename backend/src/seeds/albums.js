import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Xóa dữ liệu hiện có
        await Album.deleteMany({});
        await Song.deleteMany({});

        // Đầu tiên, tạo tất cả các bài hát
        const createdSongs = await Song.insertMany([
            {
                title: "Hai Mươi Hai (22)",
                artist: "AMEE",
                imageUrl: "/cover-images/7.jpg",
                audioUrl: "/songs/7.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 244, // 4:04
            },
            {
                title: "Ngày Chưa Giông Bão",
                artist: "Bùi Lan Hương",
                imageUrl: "/cover-images/5.jpg",
                audioUrl: "/songs/5.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 228, // 3:48
            },
            {
                title: "Hơn Cả Yêu",
                artist: "Đức Phúc",
                imageUrl: "/cover-images/15.jpg",
                audioUrl: "/songs/15.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 256, // 4:16
            },
            {
                title: "Hai Triệu Năm",
                artist: "Đen Vâu",
                imageUrl: "/cover-images/13.jpg",
                audioUrl: "/songs/13.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 217, // 3:37
            },
            {
                title: "Mượn Rượu Tỏ Tình",
                artist: "BigDaddy & Emily",
                imageUrl: "/cover-images/4.jpg",
                audioUrl: "/songs/4.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 227, // 3:47
            },
            {
                title: "Tháng Tư Là Lời Nói Dối Của Em",
                artist: "Hà Anh Tuấn",
                imageUrl: "/cover-images/9.jpg",
                audioUrl: "/songs/9.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 356, // 5:56
            },
            {
                title: "Em Gái Mưa",
                artist: "Hương Tràm",
                imageUrl: "/cover-images/16.jpg",
                audioUrl: "/songs/16.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 298, // 4:58
            },
            {
                title: "Em Gì Ơi",
                artist: "Jack & K-ICM",
                imageUrl: "/cover-images/10.jpg",
                audioUrl: "/songs/10.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 247, // 4:07
            },
            {
                title: "Chạy Ngay Đi",
                artist: "Sơn Tùng M-TP",
                imageUrl: "/cover-images/1.jpg",
                audioUrl: "/songs/1.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 273, // 4:33
            },
            {
                title: "Ước Gì",
                artist: "Mỹ Tâm",
                imageUrl: "/cover-images/2.jpg",
                audioUrl: "/songs/2.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 331, // 5:31
            },
            {
                title: "Bánh Mì Không",
                artist: "ĐạtG & DuUyen",
                imageUrl: "/cover-images/14.jpg",
                audioUrl: "/songs/14.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 234, // 3:54
            },
            {
                title: "Lạc Trôi",
                artist: "Sơn Tùng M-TP",
                imageUrl: "/cover-images/3.jpg",
                audioUrl: "/songs/3.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 230, // 3:50
            },
            {
                title: "Phía Sau Một Cô Gái",
                artist: "Soobin Hoàng Sơn",
                imageUrl: "/cover-images/17.jpg",
                audioUrl: "/songs/17.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 227, // 3:47
            },
            {
                title: "Đi Về Nhà",
                artist: "Đen Vâu & JustaTee",
                imageUrl: "/cover-images/12.jpg",
                audioUrl: "/songs/12.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 231, // 3:51
            },
        ]);

        // Tạo album có tham chiếu đến ID bài hát
        const albums = [
            {
                title: "Nhạc Trẻ Việt Hot",
                artist: "Nhiều Nghệ Sĩ",
                imageUrl: "/albums/1.jpg",
                releaseYear: 2024,
                songs: createdSongs.slice(0, 4).map((song) => song._id),
            },
            {
                title: "Ballad Việt Sâu Lắng",
                artist: "Nhiều Nghệ Sĩ",
                imageUrl: "/albums/2.jpg",
                releaseYear: 2024,
                songs: createdSongs.slice(4, 8).map((song) => song._id),
            },
            {
                title: "Hit Đình Đám",
                artist: "Nhiều Nghệ Sĩ",
                imageUrl: "/albums/3.jpg",
                releaseYear: 2024,
                songs: createdSongs.slice(8, 11).map((song) => song._id),
            },
            {
                title: "Rap & Indie Việt",
                artist: "Nhiều Nghệ Sĩ",
                imageUrl: "/albums/4.jpg",
                releaseYear: 2024,
                songs: createdSongs.slice(11, 14).map((song) => song._id),
            },
        ];

        // Chèn tất cả album
        const createdAlbums = await Album.insertMany(albums);

        // Cập nhật bài hát với tham chiếu album của chúng
        for (let i = 0; i < createdAlbums.length; i++) {
            const album = createdAlbums[i];
            const albumSongs = albums[i].songs;

            await Song.updateMany({ _id: { $in: albumSongs } }, { albumId: album._id });
        }

        console.log("Đã gieo hạt cơ sở dữ liệu thành công!");
    } catch (error) {
        console.error("Lỗi khi gieo hạt cơ sở dữ liệu:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();