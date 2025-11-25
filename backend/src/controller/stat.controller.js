import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const getStats = async (req, res, next) => {
    try {
        const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
            Song.countDocuments(),
            Album.countDocuments(),
            User.countDocuments(),

            Song.aggregate([
                {
                    // chỉ lấy các bài hát có nghệ sĩ hợp lệ
                    $match: {
                        artist: { $ne: null, $nin: ["", " "] },
                    },
                },
                {
                    // group theo tên nghệ sĩ → mỗi nghệ sĩ chỉ 1 bản ghi
                    $group: {
                        _id: "$artist",
                    },
                },
                {
                    // đếm số nghệ sĩ
                    $count: "count",
                },
            ]),
        ]);
        res.status(200).json({
            totalSongs,
            totalAlbums,
            totalUsers,
            totalArtists: uniqueArtists[0]?.count || 0,
        });

    } catch (error) {
        next(error);
    }
};