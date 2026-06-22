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
import { DispatchesService } from './dispatches.service';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dispatches')
@UseGuards(JwtAuthGuard)
export class DispatchesController {
  constructor(private readonly dispatchesService: DispatchesService) {}

  @Get()
  findAll() {
    return this.dispatchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dispatchesService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateDispatchDto) {
    return this.dispatchesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDispatchDto) {
    return this.dispatchesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dispatchesService.remove(id);
  }
}
