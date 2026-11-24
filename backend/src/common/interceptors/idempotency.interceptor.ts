import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);
  private static idempotencyStore: Map<string, { response: any; timestamp: number }> = new Map();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    // Only apply idempotency to state mutating operations (POST, PUT, PATCH)
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const idempotencyKey = req.headers['idempotency-key'] as string;

      if (!idempotencyKey) {
        throw new BadRequestException('Missing mandatory Idempotency-Key header for state-mutating transaction.');
      }

      const cached = IdempotencyInterceptor.idempotencyStore.get(idempotencyKey);
      if (cached) {
        this.logger.warn(`Idempotency match: Returning cached response for key ${idempotencyKey}`);
        return of(cached.response);
      }

      return next.handle().pipe(
        tap((data) => {
          IdempotencyInterceptor.idempotencyStore.set(idempotencyKey, {
            response: data,
            timestamp: Date.now(),
          });
        }),
      );
    }

    return next.handle();
  }
}
