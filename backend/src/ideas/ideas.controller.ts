// backend/src/ideas/ideas.controller.ts

import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dto/create-idea.dto';

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createIdeaDto: CreateIdeaDto) {
    return this.ideasService.create(createIdeaDto);
  }
}