import { Request, Response } from "express";
import app from "./app";

const port: number = 3000;


app.get('/', (req:Request, res:Response) => {
    res.send("TypeScript With Express");
});


app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});

