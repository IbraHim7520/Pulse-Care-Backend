import express, { Application } from 'express';
import specialityRoute from './Models/Speciality/specality.route';
const app:Application = express();

//------MiddleWere's---------------
app.use(express.json())


//*--------Routes------------//
app.use('/api/v1/speicalities/', specialityRoute)

export default app;