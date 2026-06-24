const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'trade_vault_secret_786';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Seed Promoter Account & Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await prisma.user.findUnique({ where: { email } });

        // Special logic for Adnan Sheikh (Promoter)
        if (email === 'adnansheikh2165@gmail.com' && !user) {
            const hashedPassword = await bcrypt.hash('Jessica786', 10);
            user = await prisma.user.create({
                data: {
                    email: 'adnansheikh2165@gmail.com',
                    password: hashedPassword,
                    name: 'Adnan Sheikh',
                    balance: 400.00,
                    referrals: 2,
                    isPromoter: true
                }
            });
        }

        if (!user) return res.status(404).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, balance: user.balance, referrals: user.referrals, isPromoter: user.isPromoter } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: "Email already exists" });
    }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
    const user = await prisma.user.findUnique({ 
        where: { id: req.user.id },
        include: { trades: { orderBy: { createdAt: 'desc' }, take: 5 } }
    });
    res.json(user);
});

// Salary Claim Logic
app.post('/api/user/claim-salary', authenticateToken, async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    
    if (user.referrals >= 3 && user.balance >= 250 && !user.salaryClaimed) {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { 
                balance: user.balance + 60,
                salaryClaimed: true
            }
        });
        return res.json({ success: true, newBalance: updatedUser.balance });
    }
    res.status(400).json({ error: "Criteria not met: 3 referrals + $250 balance required." });
});

// Trade execution (Simulated for 7PM and 10PM)
app.post('/api/trade/execute', authenticateToken, async (req, res) => {
    const { amount, pair } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

    // Mock logic: 80% Win rate for users with 2+ referrals
    const win = user.referrals >= 2 ? Math.random() > 0.2 : Math.random() > 0.5;
    const profit = win ? amount * 0.85 : -amount;

    const trade = await prisma.trade.create({
        data: {
            userId: user.id,
            amount,
            profit,
            pair,
            status: win ? "WIN" : "LOSS"
        }
    });

    await prisma.user.update({
        where: { id: user.id },
        data: { balance: user.balance + profit }
    });

    res.json({ trade, newBalance: user.balance + profit });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
