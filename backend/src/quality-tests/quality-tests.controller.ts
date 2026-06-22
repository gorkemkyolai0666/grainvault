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
import { QualityTestsService } from './quality-tests.service';
import { CreateQualityTestDto } from './dto/create-quality-test.dto';
import { UpdateQualityTestDto } from './dto/update-quality-test.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quality-tests')
@UseGuards(JwtAuthGuard)
export class QualityTestsController {
  constructor(private readonly qualityTestsService: QualityTestsService) {}

  @Get()
  findAll() {
    return this.qualityTestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qualityTestsService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateQualityTestDto) {
    return this.qualityTestsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQualityTestDto) {
    return this.qualityTestsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qualityTestsService.remove(id);
  }
}
