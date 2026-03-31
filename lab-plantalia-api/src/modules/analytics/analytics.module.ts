import { Module } from '@nestjs/common';
import { AdminJwtGuard } from '../admin/admin-jwt.guard';
import { AnalyticsBll } from './analytics.bll';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsDal } from './analytics.dal';
import { AnalyticsFacade } from './analytics.facade';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsDal, AnalyticsBll, AnalyticsFacade, AdminJwtGuard],
  exports: [AnalyticsDal],
})
export class AnalyticsModule {}
