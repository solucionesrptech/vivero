import { readStoreTwilioSmsEnv } from './twilio-store-sms.config';

const ENV_KEYS = [
  'ORDER_SMS_ENABLED',
  'ORDER_READY_SMS_ENABLED',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'STORE_NOTIFY_SMS_TO',
  'TWILIO_MESSAGING_SERVICE_SID',
  'TWILIO_FROM_NUMBER',
  'TWILIO_FROM',
] as const;

describe('readStoreTwilioSmsEnv', () => {
  afterEach(() => {
    for (const k of ENV_KEYS) {
      delete process.env[k];
    }
  });

  it('ORDER_SMS_ENABLED solo si tras trim es exactamente true', () => {
    expect(readStoreTwilioSmsEnv().orderSmsEnabled).toBe(false);
    process.env.ORDER_SMS_ENABLED = 'false';
    expect(readStoreTwilioSmsEnv().orderSmsEnabled).toBe(false);
    process.env.ORDER_SMS_ENABLED = 'true';
    expect(readStoreTwilioSmsEnv().orderSmsEnabled).toBe(true);
    process.env.ORDER_SMS_ENABLED = ' true ';
    expect(readStoreTwilioSmsEnv().orderSmsEnabled).toBe(true);
  });

  it('ORDER_READY_SMS_ENABLED independiente de ORDER_SMS_ENABLED', () => {
    expect(readStoreTwilioSmsEnv().orderReadyCustomerSmsEnabled).toBe(false);
    process.env.ORDER_READY_SMS_ENABLED = 'true';
    const e = readStoreTwilioSmsEnv();
    expect(e.orderReadyCustomerSmsEnabled).toBe(true);
    expect(e.orderSmsEnabled).toBe(false);
  });

  it('con MG válido solo messagingServiceSid; ignora FROM', () => {
    process.env.TWILIO_MESSAGING_SERVICE_SID = ' MGabc ';
    process.env.TWILIO_FROM_NUMBER = '+15551234567';
    process.env.TWILIO_FROM = '+19998887777';
    const e = readStoreTwilioSmsEnv();
    expect(e.messagingServiceSid).toBe('MGabc');
    expect(e.fromNumber).toBeNull();
  });

  it('MG inválido no usa Messaging Service y toma FROM_NUMBER', () => {
    process.env.TWILIO_MESSAGING_SERVICE_SID = 'NOTMG';
    process.env.TWILIO_FROM_NUMBER = '+15550001111';
    const e = readStoreTwilioSmsEnv();
    expect(e.messagingServiceSid).toBeNull();
    expect(e.fromNumber).toBe('+15550001111');
  });

  it('sin MG usa TWILIO_FROM si falta FROM_NUMBER', () => {
    process.env.TWILIO_FROM = ' +15550002222 ';
    const e = readStoreTwilioSmsEnv();
    expect(e.messagingServiceSid).toBeNull();
    expect(e.fromNumber).toBe('+15550002222');
  });

  it('TWILIO_FROM_NUMBER tiene prioridad sobre TWILIO_FROM', () => {
    process.env.TWILIO_FROM_NUMBER = '+111';
    process.env.TWILIO_FROM = '+222';
    expect(readStoreTwilioSmsEnv().fromNumber).toBe('+111');
  });

  it('trim y vacíos como ausentes en credenciales', () => {
    process.env.TWILIO_ACCOUNT_SID = '  ACxxx  ';
    process.env.TWILIO_AUTH_TOKEN = '   ';
    process.env.STORE_NOTIFY_SMS_TO = '';
    const e = readStoreTwilioSmsEnv();
    expect(e.accountSid).toBe('ACxxx');
    expect(e.authToken).toBeNull();
    expect(e.storeNotifyToRaw).toBeNull();
  });
});
