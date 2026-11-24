import { Controller, Post, Body, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import * as crypto from 'crypto';

@ApiTags('Inbound Bank Switch Webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);
  private static readonly SECRET = 'apex_webhook_hmac_secret_2026';

  @Post('switch-callback')
  @ApiOperation({ summary: 'Handle signed webhooks from NPCI / RBI / Bank Partner switch' })
  async handleCallback(
    @Body() payload: any,
    @Headers('x-apex-signature') signature: string,
  ) {
    this.logger.log(`Received bank switch webhook notification for RRN: ${payload?.bankRrn || 'UNKNOWN'}`);

    // Verify cryptographic HMAC-SHA256 signature
    if (signature) {
      const computed = crypto.createHmac('sha256', WebhooksController.SECRET).update(JSON.stringify(payload)).digest('hex');
      if (signature !== computed) {
        throw new UnauthorizedException('Invalid cryptographic webhook signature.');
      }
    }

    return {
      acknowledged: true,
      processedAt: new Date().toISOString(),
    };
  }
}
