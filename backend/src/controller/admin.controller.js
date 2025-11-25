import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// helper function for cloudinary uploads
const uploadToClouduinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (error) {
        console.log("Lỗi trong uploadToClouduinary", error);
        throw new Error("Lỗi khi tải lên Cloudinary");
    }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Vui lòng tải lên đủ tệp âm thanh và hình ảnh" });
    }

    const { title, artist, albumId, duration } = req.body;

    if (!title?.trim() || !artist?.trim() || duration === undefined) {
      return res.status(400).json({ message: "Thiếu title/artist/duration" });
    }

    const durationNumber = Number(duration);
    if (Number.isNaN(durationNumber) || durationNumber <= 0) {
      return res.status(400).json({ message: "duration phải là số > 0" });
    }

    // upload & lưu
    const audioUrl = await uploadToClouduinary(req.files.audioFile);
    const imageUrl = await uploadToClouduinary(req.files.imageFile);

    const song = new Song({
      title: title.trim(),
      artist: artist.trim(),
      audioUrl,
      imageUrl,
      duration: durationNumber,
      albumId: albumId || null,
    });

    await song.save();
    if (albumId) await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
    res.status(201).json(song);
  } catch (error) {
    console.log("Lỗi trong createSong:", error);
    next(error);
  }
};


export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params

        const song = await Song.findById(id)

        //nếu bài hát thuộc về một album, hãy xóa bài hát khỏi mảng bài hát của album
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id },
            })
        }
        await Song.findByIdAndDelete(id);
        res.status(200).json({ message: "Đã xóa bài hát thành công" });

    } catch (error) {
        console.log("Lỗi khi xóa bài hát:", error);
        next(error);
    }
};

export const createAlbum = async (req, res, next) => {
    try {
        const { title, artist, releaseYear } = req.body;
        const { imageFile } = req.files;

        const imageUrl = await uploadToClouduinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear,
        })
        await album.save()
        res.status(201).json(album)
    } catch (error) {
        console.log("Lỗi khi tạo Album:", error);
        next(error);
    }
};

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Song.deleteMany({ albumId: id });
        await Album.findByIdAndDelete(id);
        res.status(200).json({ message: "Đã xóa album thành công" });
    } catch (error) {
        console.log("Lỗi khi xóaAlbum:", error);
        next(error);
    }
};

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ admin: true });
};