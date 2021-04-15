import { Module } from '@nestjs/common';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
