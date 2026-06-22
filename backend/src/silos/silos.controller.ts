import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { SilosService } from './silos.service';
import { CreateSiloDto } from './dto/create-silo.dto';
import { UpdateSiloDto } from './dto/update-silo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('silos')
@UseGuards(JwtAuthGuard)
export class SilosController {
  constructor(private readonly silosService: SilosService) {}

  @Get()
  findAll() {
    return this.silosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.silosService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateSiloDto) {
    return this.silosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSiloDto) {
    return this.silosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.silosService.remove(id);
  }
}
