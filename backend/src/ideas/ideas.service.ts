// backend/src/ideas/ideas.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { Idea, IdeaDocument, Section } from './schemas/idea.schema';

@Injectable()
export class IdeasService {
  constructor(@InjectModel(Idea.name) private ideaModel: Model<IdeaDocument>) {}

  private generateSections(idea: string): Section[] {
    const sections: Section[] = [];
    const heroTitles = [`Welcome to ${idea}`, `Discover ${idea}`, `Experience ${idea}`];
    const heroContents = [`Transform your vision into reality with our innovative ${idea.toLowerCase()} solution.`, `Step into the future of ${idea.toLowerCase()} with our comprehensive platform.`];
    sections.push({ type: 'Hero', title: heroTitles[Math.floor(Math.random() * heroTitles.length)], content: heroContents[Math.floor(Math.random() * heroContents.length)] });

    const aboutTitles = ['Our Story', 'About Us'];
    const aboutContents = [`Founded with a passion for excellence, our ${idea.toLowerCase()} platform represents years of dedication.`, `Our journey began with a simple vision: to revolutionize the ${idea.toLowerCase()} industry.`];
    sections.push({ type: 'About', title: aboutTitles[Math.floor(Math.random() * aboutTitles.length)], content: aboutContents[Math.floor(Math.random() * aboutContents.length)] });

    const contactTitles = ['Get In Touch', 'Contact Us'];
    const contactContents = [`Ready to take the next step? Contact us today to discuss how our ${idea.toLowerCase()} solutions can help.`, `Have questions? Our friendly team is standing by to provide the answers.`];
    sections.push({ type: 'Contact', title: contactTitles[Math.floor(Math.random() * contactTitles.length)], content: contactContents[Math.floor(Math.random() * contactContents.length)] });
    
    return sections;
  }

  async create(createIdeaDto: CreateIdeaDto): Promise<Idea> {
    const sections = this.generateSections(createIdeaDto.idea);
    const createdIdea = new this.ideaModel({
      idea: createIdeaDto.idea,
      sections: sections,
    });
    return createdIdea.save();
  }
}