import { Controller, Get, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notifications & Alerts')
@Controller('notifications')
export class NotificationsController {
  private static notifs = [
    {
      id: 'notif_01',
      title: 'Salary Credited',
      message: '₹1,45,000.00 credited to Account ending 2391 via Apex Internal Clearing.',
      category: 'TRANSACTION',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif_02',
      title: 'Security Alert: Web Login',
      message: 'Successful login detected from Chrome Windows (IP: 103.212.14.88, Pune).',
      category: 'SECURITY',
      isRead: false,
      createdAt: new Date().toISOString(),
    }
  ];

  @Get()
  @ApiOperation({ summary: 'List customer notifications' })
  async list() {
    return NotificationsController.notifs;
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markRead(@Param('id') id: string) {
    const item = NotificationsController.notifs.find(n => n.id === id);
    if (item) item.isRead = true;
    return { success: true };
  }
}
