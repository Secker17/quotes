require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String
}));

const Quote = mongoose.model('Quote', new mongoose.Schema({
    text: String,
    userId: mongoose.Schema.Types.ObjectId
}));

// Middleware to authenticate
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
};

app.post('/eksamen/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/eksamen/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

app.get('/eksamen/quotes', authenticate, async (req, res) => {
    const quotes = await Quote.find({ userId: req.userId });
    res.json(quotes);
});

app.post('/eksamen/quotes', authenticate, async (req, res) => {
    const newQuote = new Quote({ text: req.body.text, userId: req.userId });
    await newQuote.save();
    res.status(201).json(newQuote);
});

app.put('/eksamen/quotes/:id', authenticate, async (req, res) => {
    const updatedQuote = await Quote.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { text: req.body.text },
        { new: true }
    );
    if (!updatedQuote) {
        return res.status(404).send('Quote not found');
    }
    res.json(updatedQuote);
});

app.delete('/eksamen/quotes/:id', authenticate, async (req, res) => {
    await Quote.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.status(200).json({ message: 'Quote deleted successfully' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
