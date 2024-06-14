require('dotenv').config(); // Load environment variables from .env file

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const FormDataModel = require('./models/FormData');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await FormDataModel.findOne({ email });
        if (user) {
            return res.json("Already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new FormDataModel({
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.json("User registered successfully");
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await FormDataModel.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.json("Success");
            } else {
                res.json("Wrong password");
            }
        } else {
            res.json("No records found!");
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
});

app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});
