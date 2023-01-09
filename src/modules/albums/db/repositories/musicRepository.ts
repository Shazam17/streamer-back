import { IMusicRepository } from '../../../../db/interfaces/IMusicRepository';
import { AlbumEntity } from '../../../../db/entities/AlbumEntity';
import { PlaylistEntity } from '../../../../db/entities/PlaylistEntity';
import { InjectModel } from '@nestjs/mongoose';
import { AlbumSchemaDefinition } from '../../../../db/models/album';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { SongSchemaDefinition } from '../../../../db/models/song';

@Injectable()
export class MusicRepository implements IMusicRepository {
  constructor(
    @InjectModel(AlbumSchemaDefinition.name)
    private albumModel: Model<AlbumSchemaDefinition>,
    @InjectModel(SongSchemaDefinition.name)
    private songModel: Model<SongSchemaDefinition>,
  ) {}

  addSongToPlaylist(playlistId: Types.ObjectId, songId: Types.ObjectId) {}

  async createAlbum() {
    await this.albumModel.create({
      title: 'Periphery 1',
      year: '2011',
      performer: 'Periphery',
      songs: [],
    });
  }

  createPlaylist() {}

  async getAlbumById(albumId: Types.ObjectId) {
    const album = await this.albumModel.findOne({
      id: { $eq: albumId },
    });
    const songs = await this.songModel.find({
      album: { $eq: album.title },
    });
    return {
      title: album.title,
      year: album.year,
      artist: album.artist,
      songs: songs.map((item) => ({ title: item.title, id: item._id })),
    };
  }

  getAlbumsByUserId(userId: Types.ObjectId): AlbumEntity[] {
    return [];
  }

  getPlaylistByUserId(userId: Types.ObjectId): PlaylistEntity[] {
    return [];
  }

  async tryUploadAlbum() {}

  async uploadSong() {}

  async createSong(
    title: string,
    album: string,
    year: number,
    artist: string,
    fileAddress: string,
  ) {
    const songsFound = await this.songModel.findOne({
      title: { $eq: title },
      album: { $eq: album },
    });

    if (songsFound) {
      return songsFound;
    }

    return await this.songModel.create({
      title,
      artist,
      album,
      year,
      fileAddress,
    });
  }

  async tryCreateAlbum(title: string, year: number, artist: string) {
    const albumFound = await this.albumModel.findOne({
      title: { $eq: title },
      artist: { $eq: artist },
    });
    if (albumFound) {
      return albumFound;
    }
    return await this.albumModel.create({
      title,
      year,
      artist,
    });
  }

  async addSongToAlbum(albumId: Types.ObjectId, songId: Types.ObjectId) {
    const album = await this.albumModel.findOne({
      id: albumId,
    });
    album.songs = [...new Set([...album.songs, songId])];
    album.save();
  }

  getSongByPath(songPath: string) {
    return this.songModel.findOne({
      fileAddress: { $eq: songPath },
    });
  }

  getAllAlbums() {
    return this.albumModel.find();
  }

  async getSongById(id: Types.ObjectId) {
    return this.songModel.findOne({
      id: { $eq: id },
    });
  }

  async updateAlbumCover(albumId: Types.ObjectId, path: string) {
    this.albumModel.updateOne(
      {
        _id: albumId,
      },
      {
        coverPath: path,
      },
    );
  }
}
