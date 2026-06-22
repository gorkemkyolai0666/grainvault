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
import { IntakesService } from './intakes.service';
import { CreateIntakeDto } from './dto/create-intake.dto';
import { UpdateIntakeDto } from './dto/update-intake.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('intakes')
@UseGuards(JwtAuthGuard)
export class IntakesController {
  constructor(private readonly intakesService: IntakesService) {}

  @Get()
  findAll() {
    return this.intakesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intakesService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateIntakeDto) {
    return this.intakesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIntakeDto) {
    return this.intakesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intakesService.remove(id);
  }
}
