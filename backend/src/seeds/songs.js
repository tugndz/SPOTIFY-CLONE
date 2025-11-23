import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
  {
    title: "Chạy Ngay Đi",
    artist: "Sơn Tùng M-TP",
    imageUrl: "/cover-images/1.jpg",
    audioUrl: "/songs/1.mp3",
    duration: 46, // 0:46
  },
  {
    title: "Ước Gì",
    artist: "Mỹ Tâm",
    imageUrl: "/cover-images/2.jpg",
    audioUrl: "/songs/2.mp3",
    duration: 41, // 0:41
  },
  {
    title: "Lạc Trôi",
    artist: "Sơn Tùng M-TP",
    imageUrl: "/cover-images/3.jpg",
    audioUrl: "/songs/3.mp3",
    duration: 24, // 0:24
  },
  {
    title: "Mượn Rượu Tỏ Tình",
    artist: "BigDaddy & Emily",
    imageUrl: "/cover-images/4.jpg",
    audioUrl: "/songs/4.mp3",
    duration: 24, // 0:24
  },
  {
    title: "Ngày Chưa Giông Bão",
    artist: "Bùi Lan Hương",
    imageUrl: "/cover-images/5.jpg",
    audioUrl: "/songs/5.mp3",
    duration: 36, // 0:36
  },
  {
    title: "Nàng Thơ",
    artist: "Hoàng Dũng",
    imageUrl: "/cover-images/6.jpg",
    audioUrl: "/songs/6.mp3",
    duration: 40, // 0:40
  },
  {
    title: "Hai Mươi Hai (22)",
    artist: "AMEE",
    imageUrl: "/cover-images/7.jpg",
    audioUrl: "/songs/7.mp3",
    duration: 39, // 0:39
  },
  {
    title: "Bước Qua Nhau",
    artist: "Vũ.",
    imageUrl: "/cover-images/8.jpg",
    audioUrl: "/songs/8.mp3",
    duration: 28, // 0:28
  },
  {
    title: "Tháng Tư Là Lời Nói Dối Của Em",
    artist: "Hà Anh Tuấn",
    imageUrl: "/cover-images/9.jpg",
    audioUrl: "/songs/9.mp3",
    duration: 28, // 0:28
  },
  {
    title: "Em Gì Ơi",
    artist: "Jack & K-ICM",
    imageUrl: "/cover-images/10.jpg",
    audioUrl: "/songs/10.mp3",
    duration: 30, // 0:30
  },
  {
    title: "Anh Ơi Ở Lại",
    artist: "Chi Pu",
    imageUrl: "/cover-images/11.jpg",
    audioUrl: "/songs/11.mp3",
    duration: 29, // 0:29
  },
  {
    title: "Đi Về Nhà",
    artist: "Đen Vâu & JustaTee",
    imageUrl: "/cover-images/12.jpg",
    audioUrl: "/songs/12.mp3",
    duration: 17, // 0:17
  },
  {
    title: "Hai Triệu Năm",
    artist: "Đen Vâu",
    imageUrl: "/cover-images/13.jpg",
    audioUrl: "/songs/13.mp3",
    duration: 39, // 0:39
  },
  {
    title: "Bánh Mì Không",
    artist: "ĐạtG & DuUyen",
    imageUrl: "/cover-images/14.jpg",
    audioUrl: "/songs/14.mp3",
    duration: 27, // 0:27
  },
  {
    title: "Hơn Cả Yêu",
    artist: "Đức Phúc",
    imageUrl: "/cover-images/15.jpg",
    audioUrl: "/songs/15.mp3",
    duration: 36, // 0:36
  },
  {
    title: "Em Gái Mưa",
    artist: "Hương Tràm",
    imageUrl: "/cover-images/16.jpg",
    audioUrl: "/songs/16.mp3",
    duration: 39, // 0:39
  },
  {
    title: "Phía Sau Một Cô Gái",
    artist: "Soobin Hoàng Sơn",
    imageUrl: "/cover-images/17.jpg",
    audioUrl: "/songs/17.mp3",
    duration: 39, // 0:39
  },
  {
    title: "Người Ta Có Thương Mình Đâu",
    artist: "Trúc Nhân",
    imageUrl: "/cover-images/18.jpg",
    audioUrl: "/songs/18.mp3",
    duration: 29, // 0:29
  },
];

const seedSongs = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Xóa bài hát hiện có
		await Song.deleteMany({});

		// Chèn bài hát mới
		await Song.insertMany(songs);

		console.log("Bài hát đã được gieo mầm thành công!");
	} catch (error) {
		console.error("Lỗi khi gieo hạt bài hát:", error);
	} finally {
		mongoose.connection.close();
	}
};

seedSongs();