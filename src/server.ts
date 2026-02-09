import { Request, Response } from "express";
import app from "./app";

const port: number = parseInt(process.env.PORT as string) || 5050;


app.get('/', (req:Request, res:Response) => {
    res.send("TypeScript With Express");
});


app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});

