// backend/src/ideas/schemas/idea.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Section {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;
}
export const SectionSchema = SchemaFactory.createForClass(Section);

export type IdeaDocument = Idea & Document;

@Schema({ timestamps: true })
export class Idea {
  @Prop({ required: true })
  idea: string;

  @Prop([SectionSchema])
  sections: Section[];
}

export const IdeaSchema = SchemaFactory.createForClass(Idea);