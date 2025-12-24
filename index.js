//External Module
import express from 'express';
import 'dotenv/config';
import cors from 'cors';

//Local Module
import {connectDB} from './lib/db.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);


app.listen(PORT, '0.0.0.0', ()=> {
    console.log(`Server is waiting at http://localhost:${PORT}`);
})
