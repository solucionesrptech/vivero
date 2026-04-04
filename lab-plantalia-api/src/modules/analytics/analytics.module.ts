import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { AnalyticsBll } from './bll/analytics.bll';
import { AnalyticsController } from './controller/analytics.controller';
import { AnalyticsDal } from './dal/analytics.dal';
import { AnalyticsFacade } from './facade/analytics.facade';

@Module({
  imports: [AdminModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsDal, AnalyticsBll, AnalyticsFacade],
  exports: [AnalyticsBll],
})
export class AnalyticsModule {}
