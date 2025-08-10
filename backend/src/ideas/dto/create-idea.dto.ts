// backend/src/ideas/dto/create-idea.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIdeaDto {
  @IsString()
  @IsNotEmpty()
  idea: string;
}