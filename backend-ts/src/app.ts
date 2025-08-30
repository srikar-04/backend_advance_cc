import express, { type Request, type Response, type Express } from "express";

interface MyExpress extends Express {
    db: string;
}

const app: MyExpress = express() as MyExpress;

app.use(express.json())

export default app