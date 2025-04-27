const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { NlpManager } = require('node-nlp');
const WhatsappSession = require('../models/whatsapp-session.model');
const Transaction = require('../models/transaction.model');
const Budget = require('../models/budget.model');
const config = require('../config/config');

class WhatsAppService {
    constructor() {
        this.nlpManager = new NlpManager({ languages: ['id'] });
        this.clients = new Map(); // Store WhatsApp clients by user ID
        this.initNLP();
    }

    async initNLP() {
        // Add Indonesian language patterns
        this.addTransactionPatterns();
        this.addBudgetPatterns();
        this.addReportPatterns();
        await this.nlpManager.train();
    }

    addTransactionPatterns() {
        // Income patterns
        this.nlpManager.addDocument('id', 'terima gaji {amount}', 'transaction.income');
        this.nlpManager.addDocument('id', 'dapat uang {amount}', 'transaction.income');
        this.nlpManager.addDocument('id', 'masuk {amount}', 'transaction.income');
        
        // Expense patterns
        this.nlpManager.addDocument('id', 'bayar {amount}', 'transaction.expense');
        this.nlpManager.addDocument('id', 'beli {item} {amount}', 'transaction.expense');
        this.nlpManager.addDocument('id', 'keluar {amount}', 'transaction.expense');

        // Add more patterns...
    }

    addBudgetPatterns() {
        this.nlpManager.addDocument('id', 'atur budget {category} {amount}', 'budget.set');
        this.nlpManager.addDocument('id', 'lihat budget', 'budget.view');
        this.nlpManager.addDocument('id', 'sisa budget', 'budget.remaining');
        // Add more patterns...
    }

    addReportPatterns() {
        this.nlpManager.addDocument('id', 'laporan harian', 'report.daily');
        this.nlpManager.addDocument('id', 'laporan mingguan', 'report.weekly');
        this.nlpManager.addDocument('id', 'laporan bulanan', 'report.monthly');
        // Add more patterns...
    }

    async initializeClient(userId, sessionId) {
        try {
            const session = await WhatsappSession.findById(sessionId);
            if (!session) throw new Error('Session not found');

            const client = new Client({
                authStrategy: new LocalAuth({
                    clientId: sessionId,
                    dataPath: config.whatsappSessionDir
                }),
                puppeteer: {
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--disable-gpu'
                    ]
                }
            });

            // Set up event handlers
            client.on('qr', async (qr) => {
                const qrCode = await qrcode.toDataURL(qr);
                session.qrCode = qrCode;
                await session.save();
            });

            client.on('ready', async () => {
                session.status = 'active';
                await session.save();
            });

            client.on('message', async (msg) => {
                await this.handleMessage(msg, userId);
            });

            client.on('disconnected', async () => {
                session.status = 'inactive';
                await session.save();
                this.clients.delete(userId);
            });

            await client.initialize();
            this.clients.set(userId, client);
            return true;

        } catch (error) {
            console.error('WhatsApp client initialization error:', error);
            throw error;
        }
    }

    async handleMessage(msg, userId) {
        try {
            if (msg.body.startsWith('!')) return; // Ignore commands

            const response = await this.nlpManager.process('id', msg.body);
            if (response.intent) {
                await this.processIntent(response, msg, userId);
            } else {
                await msg.reply('Maaf, saya tidak mengerti pesan Anda. Silakan coba lagi dengan format yang benar.');
            }
        } catch (error) {
            console.error('Message handling error:', error);
            await msg.reply('Maaf, terjadi kesalahan dalam memproses pesan Anda.');
        }
    }

    async processIntent(response, msg, userId) {
        const { intent, entities } = response;
        
        switch (intent) {
            case 'transaction.income':
            case 'transaction.expense':
                await this.handleTransactionIntent(intent, entities, msg, userId);
                break;
            case 'budget.set':
                await this.handleBudgetSetIntent(entities, msg, userId);
                break;
            case 'budget.view':
            case 'budget.remaining':
                await this.handleBudgetViewIntent(intent, msg, userId);
                break;
            case 'report.daily':
            case 'report.weekly':
            case 'report.monthly':
                await this.handleReportIntent(intent, msg, userId);
                break;
            default:
                await msg.reply('Maaf, saya tidak dapat memproses permintaan tersebut.');
        }
    }

    async handleTransactionIntent(intent, entities, msg, userId) {
        try {
            const amount = this.extractAmount(entities);
            const category = this.extractCategory(entities);
            const type = intent === 'transaction.income' ? 'income' : 'expense';

            const transaction = await Transaction.create({
                user: userId,
                type,
                amount,
                category: category || 'uncategorized',
                description: msg.body,
                source: 'whatsapp',
                whatsappNumber: msg.from
            });

            const response = `✅ ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'} sebesar Rp${amount.toLocaleString('id-ID')} telah dicatat.`;
            await msg.reply(response);

        } catch (error) {
            console.error('Transaction handling error:', error);
            await msg.reply('Maaf, terjadi kesalahan dalam mencatat transaksi.');
        }
    }

    extractAmount(entities) {
        // Implementation to extract amount from entities
        // This would include currency conversion and number parsing
        return 0;
    }

    extractCategory(entities) {
        // Implementation to extract and normalize category from entities
        return 'uncategorized';
    }

    async disconnect(userId) {
        const client = this.clients.get(userId);
        if (client) {
            await client.destroy();
            this.clients.delete(userId);
        }
    }
}

module.exports = new WhatsAppService();
