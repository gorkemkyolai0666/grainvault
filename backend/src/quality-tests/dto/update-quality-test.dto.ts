import { PartialType } from '@nestjs/mapped-types';
import { CreateQualityTestDto } from './create-quality-test.dto';

export class UpdateQualityTestDto extends PartialType(CreateQualityTestDto) {}
