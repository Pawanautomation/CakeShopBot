import dotenv from 'dotenv';
dotenv.config();

export const config = {
    telegramToken: process.env.TELEGRAM_TOKEN || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
    twilioWhatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || '',
    port: process.env.PORT || 3000
};