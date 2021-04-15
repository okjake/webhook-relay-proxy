import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Method } from 'axios';
import { omit } from 'lodash';

@Injectable()
export class ProxyService {
  private listeners = new Set<string>();
  private logger = new Logger('ProxyService');

  constructor(private httpService: HttpService) {}

  connect(listener: string) {
    this.listeners.add(listener);
    this.logger.log(`Connected ${listener}`);
  }

  disconnect(listener: string) {
    this.listeners.delete(listener);
    this.logger.log(`Disconnected ${listener}`);
  }

  async proxyRequest(req: Request) {
    const requests = [...this.listeners].map(async (listener: string) => {
      const method = req.method as Method;
      const url = `${listener}${req.path}`;

      const logContext = `[${method}] ${url}:`;

      try {
        const headers = omit(req.headers, 'content-length', 'host');

        const response = await this.httpService
          .request({
            baseURL: listener,
            url: req.path,
            params: req.params,
            data: req.body,
            method,
            headers,
          })
          .toPromise();

        this.logger.log(`${logContext} ${response.status}`);
      } catch (e) {
        this.logger.error(e, null, logContext);
      }
    });

    await Promise.all(requests);
  }
}
