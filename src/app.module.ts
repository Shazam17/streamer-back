import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumSchema, AlbumSchemaDefinition } from './db/models/album';
import { ENV } from './infrastructure/env';
import { AlbumsService } from './modules/albums/services/albums.service';
import { AlbumsController } from './modules/albums/api/albums.controller';
import { MusicRepository } from './modules/albums/db/repositories/musicRepository';
import { MinioClient } from './infrastructure/minio/minio.client';
import { SongSchema, SongSchemaDefinition } from './db/models/song';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${ENV.MONGO.USER}:${ENV.MONGO.PASSWORD}@${ENV.MONGO.HOST}:${ENV.MONGO.PORT}/`,
    ),
    MongooseModule.forFeature([
      { name: AlbumSchemaDefinition.name, schema: AlbumSchema },
      { name: SongSchemaDefinition.name, schema: SongSchema },
    ]),
  ],
  controllers: [AppController, AlbumsController],
  providers: [AppService, AlbumsService, MusicRepository, MinioClient],
})
export class AppModule {}
