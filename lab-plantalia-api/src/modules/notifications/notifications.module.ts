import { Module } from '@nestjs/common';
import { StoreSmsNotifierService } from './store-sms-notifier.service';

@Module({
  providers: [StoreSmsNotifierService],
  exports: [StoreSmsNotifierService],
})
export class NotificationsModule {}
