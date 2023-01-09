import { Injectable } from '@nestjs/common';
import { parseBuffer } from 'music-metadata';
import { MusicRepository } from '../db/repositories/musicRepository';
import { Readable } from 'stream';
import { MinioClient } from '../../../infrastructure/minio/minio.client';
import { Types } from 'mongoose';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly musicRepository: MusicRepository,
    private readonly s3Client: MinioClient,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const metadata = await this.getFileMetadata(file);

    const songPath = metadata.album + '/' + file.originalname;
    const songFound = await this.musicRepository.getSongByPath(songPath);

    if (songFound) {
      console.log('song already exist with path:' + songPath);
      return;
    }

    await this.uploadSong(file, songPath);
    const song = await this.musicRepository.createSong(
      metadata.title,
      metadata.album,
      metadata.year,
      metadata.artist,
      songPath,
    );

    const album = await this.musicRepository.tryCreateAlbum(
      metadata.album,
      metadata.year,
      metadata.artist,
    );
    await this.musicRepository.addSongToAlbum(album._id, song._id);
  }

  getAllAlbums() {
    return this.musicRepository.getAllAlbums();
  }

  async getFileMetadata(file: Express.Multer.File) {
    const metadata = await parseBuffer(file.buffer, {
      mimeType: file.mimetype,
      size: file.size,
    });
    return {
      title: metadata.common.title,
      artist: metadata.common.artist,
      album: metadata.common.album,
      year: metadata.common.year,
      picture: metadata.common.picture,
      genre: metadata.common.genre,
    };
  }

  async uploadSong(file: Express.Multer.File, songPath: string) {
    const readable = Readable.from(file.buffer);
    await this.s3Client.put(songPath, file.size, readable);
  }

  async uploadSongCover(pictureBuffer: Buffer, songPath: string) {
    const readable = Readable.from(pictureBuffer);
    await this.s3Client.put(
      songPath,
      Buffer.byteLength(pictureBuffer),
      readable,
    );
  }

  getAlbumById(albumId: Types.ObjectId) {
    return this.musicRepository.getAlbumById(albumId);
  }

  async getSongFile(id: Types.ObjectId): Promise<Readable> {
    const song = await this.musicRepository.getSongById(id);
    if (!song) {
      console.log('song not found');
      return;
    }

    return this.s3Client.get(song.fileAddress);
  }

  async uploadAlbumCover(albumId: Types.ObjectId, file: Express.Multer.File) {
    const album = await this.getAlbumById(albumId);
    if (!album) {
      throw new Error('album not found');
    }
    const path = `${album.title}/${file.originalname}`;
    const readable = Readable.from(file.buffer);
    await this.s3Client.put(path, file.size, readable);
    await this.musicRepository.updateAlbumCover(albumId, path);
  }
}
