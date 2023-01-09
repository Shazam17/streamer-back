import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'songs'})
export class SongSchemaDefinition {
  @Prop()
  title: string;

  @Prop()
  year: number;

  @Prop()
  artist: string;

  @Prop()
  fileAddress: string;
}

export const SongSchema = SchemaFactory.createForClass(SongSchemaDefinition);
