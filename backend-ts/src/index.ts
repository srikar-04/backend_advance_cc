import dotenv from "dotenv"
dotenv.config()
import express, { type Request, type Response } from "express";

const PORT = process.env.PORT || 5000

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World from new ts project");
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});