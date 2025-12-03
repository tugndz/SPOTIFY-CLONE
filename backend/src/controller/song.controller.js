import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getFeaturedSongs = async (req, res, next) => {
    try {
        // lấy 6 bài hát ngẫu nhiên bằng cách sử dụng đường ống tổng hợp của mongodb
        const songs = await Song.aggregate([
            {
                $sample: { size: 6 },
            },
            {
                 $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                },
            },
        ]);
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getMadeForYouSongs = async (req, res, next) => { 
        try {
        // lấy 4 bài hát ngẫu nhiên bằng cách sử dụng đường ống tổng hợp của mongodb
        const songs = await Song.aggregate([
            {
                $sample: { size: 4 },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                },
            },
        ]);
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getTrendingSongs = async (req, res, next) => { 
        try {
        // lấy 4 bài hát ngẫu nhiên bằng cách sử dụng đường ống tổng hợp của mongodb
        const songs = await Song.aggregate([
            {
                $sample: { size: 4 },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                },
            },
        ]);
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const searchSongs = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.json([]);
    }

    const regex = new RegExp(q, "i");

    const songs = await Song.find({
      $or: [{ title: regex }, { artist: regex }],
    }).select("_id title artist albumId imageUrl audioUrl duration createdAt updatedAt");

    res.json(songs);
  } catch (error) {
    next(error);
  }
}; 