import { Injectable, Logger } from '@nestjs/common';
import twilio from 'twilio';
import type { ClosedOrderNotifyPayload } from './closed-order-notify.types';
import type { CustomerOrderReadySmsPayload } from './customer-order-ready-sms.types';
import { formatCustomerOrderReadySmsBody } from './format-customer-order-ready-sms-body';
import { formatStoreOrderSmsBody } from './format-store-order-sms-body';
import { normalizeStoreSmsE164 } from './normalize-e164.util';
import {
  readStoreTwilioSmsEnv,
  type StoreTwilioSmsEnv,
} from './twilio-store-sms.config';

@Injectable()
export class StoreSmsNotifierService {
  private readonly logger = new Logger(StoreSmsNotifierService.name);

  /**
   * Aviso a la tienda por SMS. No lanza: errores de red/Twilio se registran y se ignoran.
   */
  async notifyStoreForClosedOrder(
    payload: ClosedOrderNotifyPayload,
  ): Promise<void> {
    const env = readStoreTwilioSmsEnv();
    if (!env.orderSmsEnabled) {
      return;
    }
    if (!env.accountSid || !env.authToken || !env.storeNotifyToRaw) {
      this.logger.warn(
        'SMS omitido: faltan TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN o STORE_NOTIFY_SMS_TO con ORDER_SMS_ENABLED=true',
      );
      return;
    }
    if (!env.messagingServiceSid && !env.fromNumber) {
      this.logger.warn(
        'SMS omitido: define TWILIO_MESSAGING_SERVICE_SID (MG…) o TWILIO_FROM_NUMBER / TWILIO_FROM',
      );
      return;
    }
    const to = normalizeStoreSmsE164(env.storeNotifyToRaw);
    if (!to) {
      this.logger.warn('SMS omitido: STORE_NOTIFY_SMS_TO no válido para E.164');
      return;
    }
    const body = formatStoreOrderSmsBody(payload);
    await this.sendTwilioSms(
      env,
      to,
      body,
      `SMS tienda enviado para pedido ${payload.publicCode}`,
      `SMS tienda falló para pedido ${payload.publicCode}`,
    );
  }

  /**
   * SMS al cliente: pedido listo para retiro o entrega. No lanza.
   * Requiere ORDER_READY_SMS_ENABLED=true (independiente de ORDER_SMS_ENABLED).
   */
  async notifyCustomerOrderReady(
    payload: CustomerOrderReadySmsPayload,
  ): Promise<void> {
    const env = readStoreTwilioSmsEnv();
    if (!env.orderReadyCustomerSmsEnabled) {
      return;
    }
    if (!env.accountSid || !env.authToken) {
      this.logger.warn(
        'SMS listo cliente omitido: faltan TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN con ORDER_READY_SMS_ENABLED=true',
      );
      return;
    }
    if (!env.messagingServiceSid && !env.fromNumber) {
      this.logger.warn(
        'SMS listo cliente omitido: define TWILIO_MESSAGING_SERVICE_SID o TWILIO_FROM_NUMBER / TWILIO_FROM',
      );
      return;
    }
    const to = normalizeStoreSmsE164(payload.customerPhone);
    if (!to) {
      this.logger.warn(
        `SMS listo cliente omitido: teléfono no válido (${payload.publicCode})`,
      );
      return;
    }
    const body = formatCustomerOrderReadySmsBody(payload);
    await this.sendTwilioSms(
      env,
      to,
      body,
      `SMS listo cliente enviado para pedido ${payload.publicCode}`,
      `SMS listo cliente falló para pedido ${payload.publicCode}`,
    );
  }

  private async sendTwilioSms(
    env: StoreTwilioSmsEnv,
    to: string,
    body: string,
    logOk: string,
    logErr: string,
  ): Promise<void> {
    try {
      const client = twilio(env.accountSid as string, env.authToken as string);
      if (env.messagingServiceSid) {
        await client.messages.create({
          body,
          to,
          messagingServiceSid: env.messagingServiceSid,
        });
      } else {
        const from = env.fromNumber;
        if (!from) {
          return;
        }
        await client.messages.create({
          body,
          from,
          to,
        });
      }
      this.logger.log(logOk);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`${logErr}: ${msg}`);
    }
  }
}
