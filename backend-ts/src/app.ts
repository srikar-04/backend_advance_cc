import express, { type Request, type Response, type Express } from "express";


const app = express()

app.use(express.json())

export default app