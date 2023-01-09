import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AlbumsService } from '../services/albums.service';
import { Types } from 'mongoose';

@Controller('music')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @Post('/create-album')
  async createAlbum() {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSong(@UploadedFile() file: Express.Multer.File) {
    return this.albumService.uploadFile(file);
  }

  @Post('upload/cover/:id')
  async uploadAlbumCover(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.albumService.uploadAlbumCover(new Types.ObjectId(id), file);
  }

  @Get('albums')
  getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get('albums/:id')
  getAlbumById(@Param('id') id: string) {
    return this.albumService.getAlbumById(new Types.ObjectId(id));
  }

  @Get('songs/:id')
  async getSong(@Param('id') id: string, @Res() res: Response) {
    const songStream = await this.albumService.getSongFile(
      new Types.ObjectId(id),
    );
    songStream.pipe(res);
  }
}
