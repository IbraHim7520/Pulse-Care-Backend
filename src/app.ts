import express, { Application } from 'express';
const app:Application = express();

//------MiddleWere's---------------
app.use(express.json())

export default app;