import { IsNotEmpty, IsNumber, IsString, IsIn, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateTransferDto {
  @ApiProperty({ example: 'acc_apex_sav_01' })
  @IsString()
  @IsNotEmpty()
  sourceAccountId: string;

  @ApiProperty({ example: 'Priya Sharma' })
  @IsString()
  @IsNotEmpty()
  counterpartyName: string;

  @ApiProperty({ example: 'HDFC0000240 / 918237465012' })
  @IsString()
  @IsNotEmpty()
  counterpartyDetail: string;

  @ApiProperty({ example: 'IMPS', enum: ['UPI', 'IMPS', 'NEFT', 'RTGS', 'INTERNAL_TRANSFER'] })
  @IsIn(['UPI', 'IMPS', 'NEFT', 'RTGS', 'INTERNAL_TRANSFER'])
  transferType: 'UPI' | 'IMPS' | 'NEFT' | 'RTGS' | 'INTERNAL_TRANSFER';

  @ApiProperty({ example: 12000 })
  @IsNumber()
  @Min(1, { message: 'Transfer amount must be at least ₹1' })
  amount: number;

  @ApiProperty({ example: 'Family maintenance' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
