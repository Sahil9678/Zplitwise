// const express = require('express');
import express from 'express';
import dotenv, { parse } from 'dotenv';
import {initDB} from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';
import job from './config/cron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV === "production") job.start();

app.use(rateLimiter);
app.use(express.json()); //middleware to parse incoming JSON requests
app.use('/api/transactions', transactionsRoute)

//custom middleware
// app.use((req,res,next) => {
//     console.log("we hit a req method", req.method)
//     next();
// })

app.get('/api/health', (req,res) => {
    res.status(200).json({ status : "ok" });
})



initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port: ", PORT);
    })
})