import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return {
      status: 'ok',
      service: 'grainvault-api',
      timestamp: new Date().toISOString(),
    };
  }
}
