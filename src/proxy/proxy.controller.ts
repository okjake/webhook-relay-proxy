import { Controller, All, Post, Body, Req } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Request } from 'express';

class ConnectionMetaDTO {
  listener: string;
}

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post('connect')
  connect(@Body() connectionMeta: ConnectionMetaDTO) {
    this.proxyService.connect(connectionMeta.listener);
  }

  @Post('disconnect')
  disconnect(@Body() connectionMeta: ConnectionMetaDTO) {
    this.proxyService.disconnect(connectionMeta.listener);
  }

  @All()
  async proxy(@Req() req: Request) {
    await this.proxyService.proxyRequest(req);
  }
}
