import { Client } from 'minio';
import { Readable } from 'stream';
import { ENV } from '../env';
import { Injectable } from "@nestjs/common";

@Injectable()
export class MinioClient {
  private minioClient: Client;

  constructor() {
    this.minioClient = new Client({
      endPoint: ENV.MINIO_HOST,
      port: ENV.MINIO_PORT,
      useSSL: false,
      accessKey: ENV.MINIO_ACCESS_KEY,
      secretKey: ENV.MINIO_SECRET_KEY,
    });
  }

  put(name: string, size: number, stream: Readable): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.minioClient.putObject(
        'songs',
        name,
        stream,
        size,
        (err, objInfo) => {
          if (err) {
            console.log(err); // err should be null
            reject();
          }
          console.log('Success', objInfo);
          resolve(true);
        },
      );
    });
  }

  get(name: string): Promise<Readable> {
    return new Promise((res, reject) => {
      this.minioClient.getObject('songs', name, (err, dataStream) => {
        if (err) {
          console.log(err);
          reject();
        }
        res(dataStream);
      });
    });
  }
}
