import { Request, Response } from "express";
import app from "./app";
import env from "./configs/env";

const port: number = parseInt(env.PORT)


app.get('/', (req:Request, res:Response) => {
    res.send("TypeScript With Express");
});


app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});

