import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('bearer') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Логуємо тільки як warning, не як error
    if (err || !user) {
      this.logger.warn(`Auth failed for ${request.method} ${request.url}: ${info?.message || err?.message || 'Unauthorized'}`);
    }

    // Повертаємо стандартну обробку (це все ще кине UnauthorizedException)
    return super.handleRequest(err, user, info, context);
  }
}
