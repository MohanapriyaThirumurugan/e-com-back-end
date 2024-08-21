
import express from 'express';
import ProductRoutes from './Routers/ProductsRoutes.js';
import databaseconnect from './Models/index.js';
import dotenv from 'dotenv';
import errorhanding from './Common/errormiddleware.js';
import userroutes from './Routers/userRoutes.js';
import cookieParser from 'cookie-parser';
import Orderroutes from './Routers/Orderroutes.js';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import paymentroute from './Routers/paymentsroute.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

dotenv.config({ path: path.join(__dirname, 'config/config.env') });
const app = express();

const port = process.env.PORT || 8000;
app.use(cors());
databaseconnect();
app.use(express.json());
// For cookies, send the token
app.use(cookieParser());

const upload = multer();

// Get the directory name using import.meta.url
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', ProductRoutes);
app.use('/', userroutes);
app.use('/', Orderroutes);
app.use('/', paymentroute);


app.use(errorhanding);
app.listen(port, () => console.log(`App is listening on port ${port} in environment ${process.env.NODE_ENV}`));
