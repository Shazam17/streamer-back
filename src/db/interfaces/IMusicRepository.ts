import { AlbumEntity } from '../entities/AlbumEntity';
import { PlaylistEntity } from '../entities/PlaylistEntity';
import { Types } from 'mongoose';

export interface IMusicRepository {
  getAlbumsByUserId(userId: Types.ObjectId): AlbumEntity[];
  getAlbumById(albumId: Types.ObjectId): AlbumEntity;
  getPlaylistByUserId(userId: Types.ObjectId): PlaylistEntity[];

  addSongToPlaylist(playlistId: Types.ObjectId, songId: Types.ObjectId);

  createAlbum();
  createPlaylist();
}
