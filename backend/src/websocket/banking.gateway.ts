import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ path: '/ws' })
export class BankingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(BankingGateway.name);
  private clients: Set<WebSocket> = new Set();

  handleConnection(client: WebSocket) {
    this.clients.add(client);
    this.logger.log(`Client connected to Banking WebSocket stream. Total: ${this.clients.size}`);
    
    // Welcome payload with switch status
    client.send(JSON.stringify({
      event: 'SYSTEM_STATUS',
      data: {
        switchStatus: 'OPERATIONAL',
        latencyMs: 142,
        rbiClearingActive: true,
        timestamp: new Date().toISOString(),
      }
    }));
  }

  handleDisconnect(client: WebSocket) {
    this.clients.delete(client);
    this.logger.log(`Client disconnected from Banking WebSocket stream. Total: ${this.clients.size}`);
  }

  // Broadcast financial transaction state machine event to all active client channels
  broadcastTransactionEvent(event: {
    referenceNumber: string;
    status: 'CREATED' | 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REVERSED';
    amount: number;
    channel: string;
    counterparty: string;
  }) {
    const payload = JSON.stringify({
      event: 'TRANSACTION_STATE_UPDATE',
      data: {
        ...event,
        timestamp: new Date().toISOString(),
      }
    });

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  @SubscribeMessage('PING')
  handlePing(client: WebSocket) {
    client.send(JSON.stringify({ event: 'PONG', timestamp: Date.now() }));
  }
}
