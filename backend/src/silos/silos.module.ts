import { Module } from '@nestjs/common';
import { SilosController } from './silos.controller';
import { SilosService } from './silos.service';

@Module({
  controllers: [SilosController],
  providers: [SilosService],
})
export class SilosModule {}
