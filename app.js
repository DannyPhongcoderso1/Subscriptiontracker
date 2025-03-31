import express from 'express';
import cookieParser from "cookie-parser";


//route
import authRouter from './Routes/auth.routes.js';
import userRouter from './Routes/user.routes.js';
import subscriptionRouter from './Routes/subscription.routes.js';

import {PORT} from './config/env.js'; //environment (help switch env easily)
import connecttoDatabase from "./database/mongodb.js"; // database
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./Routes/workflow.routes.js";
 //catch error, preact

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware)


app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API!');
})

app.listen(PORT, async() => {
    console.log(`Subscription Tracker API is running on http://localhost:${ PORT }`);
    await connecttoDatabase();
})

export default app;