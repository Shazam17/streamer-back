import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'albums' })
export class AlbumSchemaDefinition {
  @Prop()
  title: string;

  @Prop()
  year: number;

  @Prop()
  artist: string;

  @Prop()
  songs: Types.ObjectId[];

  @Prop()
  coverPath: string;
}

export const AlbumSchema = SchemaFactory.createForClass(AlbumSchemaDefinition);
