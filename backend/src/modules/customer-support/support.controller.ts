import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Customer Support & Dispute Redressal')
@Controller('support')
export class SupportController {
  private static tickets = [
    {
      id: 'tkt_01',
      ticketNumber: 'APX-TCK-88192',
      subject: 'International Transaction Enablement Query',
      description: 'How do I enable international online & POS limits on my RuPay Signature card?',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      category: 'CARDS',
      adminResponse: 'Dear Rahul, you can easily toggle International Transactions directly from Cards Management in your Apex Banking app with customized per-day spend limits.',
    }
  ];

  @Get('tickets')
  @ApiOperation({ summary: 'List customer support tickets' })
  async getTickets() {
    return SupportController.tickets;
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Create new customer support or dispute ticket' })
  async createTicket(@Body() body: any) {
    const newT = {
      ...body,
      id: `tkt_${Date.now()}`,
      ticketNumber: `APX-TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    SupportController.tickets.unshift(newT);
    return newT;
  }
}
