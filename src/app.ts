import express, { Application } from 'express';
import specialityRoute from './Models/Speciality/specality.route';
import authRouter from './Models/Authentication/auth.route';
const app:Application = express();

//------MiddleWere's---------------
app.use(express.json())


//*--------Routes------------//

//?---------Speciality Router
app.use('/api/v1/speicalities/', specialityRoute)

//*-----------Authentication Router------
app.use('/api/v1/auth', authRouter)

export default app;