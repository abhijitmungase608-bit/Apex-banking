import { Controller, Get, Patch, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Debit Cards & Controls')
@Controller('cards')
export class CardsController {
  private static card = {
    id: 'card_apex_01',
    cardType: 'PREMIUM_SIGNATURE',
    cardNetwork: 'RuPay',
    lastFourDigits: '8842',
    maskedCardNumber: '5081 •••• •••• 8842',
    expiryMonth: 9,
    expiryYear: 2030,
    cardHolderName: 'RAHUL SHARMA',
    status: 'ACTIVE',
    dailyAtmLimit: 50000,
    dailyOnlineLimit: 150000,
    isDomesticActive: true,
    isInternationalActive: false,
    isContactlessActive: true,
  };

  @Get()
  @ApiOperation({ summary: 'Get active debit card details (Tokenized masked numbers only)' })
  async getCard() {
    return CardsController.card;
  }

  @Patch('status')
  @ApiOperation({ summary: 'Temporary freeze or unfreeze card' })
  async updateStatus(@Body('status') status: 'ACTIVE' | 'BLOCKED') {
    CardsController.card.status = status;
    return { success: true, status: CardsController.card.status };
  }

  @Put('limits')
  @ApiOperation({ summary: 'Update daily ATM, e-commerce and NFC spend controls' })
  async updateLimits(@Body() limits: any) {
    Object.assign(CardsController.card, limits);
    return { success: true, card: CardsController.card };
  }
}
