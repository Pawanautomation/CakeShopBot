// src/cakeShopBot.ts
import { Telegraf, Context, Markup } from 'telegraf';
// import Stripe from 'stripe';  // Commented for now
// import twilio from 'twilio';  // Commented for now
import { config } from './config';
import { CakeMenu, SizeMultipliers, OrderStore, Order } from './types';

export class CakeShopBot {
  private bot: Telegraf;
  // private stripe: Stripe;  // Commented for now
  // private twilioClient: twilio.Twilio;  // Commented for now
  private orders: OrderStore = {};
  
  private readonly menu: CakeMenu = {
    chocolate: { price: 3500, sizes: ['6inch', '8inch', '10inch'] },
    vanilla: { price: 3000, sizes: ['6inch', '8inch', '10inch'] },
    red_velvet: { price: 4000, sizes: ['6inch', '8inch', '10inch'] },
    fruit: { price: 4500, sizes: ['6inch', '8inch', '10inch'] }
  };

  private readonly sizeMultipliers: SizeMultipliers = {
    '6inch': 1.0,
    '8inch': 1.5,
    '10inch': 2.0
  };

  constructor() {
    this.bot = new Telegraf(config.telegramToken);
    // this.stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2024-11-20.acacia' });
    // this.twilioClient = twilio(config.twilioAccountSid, config.twilioAuthToken);
    
    this.setupTelegramHandlers();
  }

  private setupTelegramHandlers(): void {
    this.bot.command('start', this.handleStart.bind(this));
    this.bot.action('menu', this.handleMenu.bind(this));
    this.bot.action(/^select_flavor_/, this.handleFlavorSelection.bind(this));
    this.bot.action(/^select_size_/, this.handleSizeSelection.bind(this));
    this.bot.action('track', this.handleOrderTracking.bind(this));
  }

  private async handleStart(ctx: Context): Promise<void> {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('View Menu 🎂', 'menu')],
      [Markup.button.callback('Place Order 🛍️', 'order')],
      [Markup.button.callback('Track Order 🔍', 'track')]
    ]);

    await ctx.reply('Welcome to our Cake Shop! How can I help you today?', keyboard);
  }

  private async handleMenu(ctx: Context): Promise<void> {
    if (!ctx.callbackQuery) return;

    let menuText = '🎂 Our Available Cakes:\n\n';
    const keyboard = [];

    for (const [flavor, details] of Object.entries(this.menu)) {
      const flavorName = flavor.replace('_', ' ').charAt(0).toUpperCase() + flavor.slice(1);
      menuText += `${flavorName}:\n`;
      menuText += `- Base price: $${(details.price / 100).toFixed(2)}\n`;
      menuText += `- Available sizes: ${details.sizes.join(', ')}\n\n`;

      keyboard.push([
        Markup.button.callback(`Order ${flavorName}`, `select_flavor_${flavor}`)
      ]);
    }

    keyboard.push([Markup.button.callback('Back to Main Menu', 'start')]);

    await ctx.editMessageText(menuText, Markup.inlineKeyboard(keyboard));
  }

  private async handleFlavorSelection(ctx: Context): Promise<void> {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

    const flavor = ctx.callbackQuery.data.split('_')[2];
    if (!flavor || !this.menu[flavor]) return;

    const keyboard = this.menu[flavor].sizes.map((size: string) => [
      Markup.button.callback(size, `select_size_${flavor}_${size}`)
    ]);
    keyboard.push([Markup.button.callback('Back to Menu', 'menu')]);

    await ctx.editMessageText(
      `You selected ${flavor.replace('_', ' ')} cake. Please choose size:`,
      Markup.inlineKeyboard(keyboard)
    );
  }

  private async handleSizeSelection(ctx: Context): Promise<void> {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

    const [_, __, flavor, size] = ctx.callbackQuery.data.split('_');
    if (!flavor || !size) return;

    const basePrice = this.menu[flavor].price;
    const multiplier = this.sizeMultipliers[size];
    const finalPrice = Math.round(basePrice * multiplier);

    const orderId = Object.keys(this.orders).length + 1;
    const order: Order = {
      flavor,
      size,
      price: finalPrice,
      status: 'pending',
      paymentIntentId: `DEMO-${orderId}`, // Temporary ID for demo
      platform: 'telegram',
      userId: ctx.from?.id.toString() || '',
      orderDate: new Date()
    };
    
    this.orders[orderId] = order;

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('Confirm Order', 'confirm_order')],
      [Markup.button.callback('Cancel Order', 'cancel_order')],
      [Markup.button.callback('Back to Menu', 'menu')]
    ]);

    await ctx.editMessageText(
      `Order Summary:\n` +
      `- ${size} ${flavor.replace('_', ' ')} cake\n` +
      `- Total: $${(finalPrice / 100).toFixed(2)}\n\n` +
      `Would you like to confirm your order?`,
      keyboard
    );
  }

  private async handleOrderTracking(ctx: Context): Promise<void> {
    if (!ctx.callbackQuery || !ctx.from) return;

    const userOrders = Object.entries(this.orders)
      .filter(([_, order]) => order.userId === ctx.from?.id.toString());

    if (userOrders.length === 0) {
      await ctx.editMessageText(
        'No orders found. Would you like to place an order?',
        Markup.inlineKeyboard([[
          Markup.button.callback('Place Order', 'order')
        ]])
      );
      return;
    }

    let orderText = 'Your Orders:\n\n';
    for (const [orderId, order] of userOrders) {
      orderText += `Order #${orderId}:\n` +
        `- ${order.size} ${order.flavor.replace('_', ' ')} cake\n` +
        `- Status: ${order.status}\n` +
        `- Price: $${(order.price / 100).toFixed(2)}\n\n`;
    }

    await ctx.editMessageText(
      orderText,
      Markup.inlineKeyboard([[
        Markup.button.callback('Back to Main Menu', 'start')
      ]])
    );
  }

  public startBot(): void {
    this.bot.launch();
    console.log('Bot is running...');
  }
}