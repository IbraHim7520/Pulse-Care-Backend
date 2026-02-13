import express, { Application } from 'express';
import specialityRoute from './Models/Speciality/specality.route';
import authRouter from './Models/Authentication/auth.route';
import { globalErrorHandler } from './middlewere/globalError';
import notFound from './middlewere/notFound';
import cookieParser from 'cookie-parser'
import userRouter from './Models/User/user.route';
const app:Application = express();

//------MiddleWere's---------------
app.use(express.json())
app.use(cookieParser())
//*--------Routes------------//

//?---------Speciality Router
app.use('/api/v1/speicalities/', specialityRoute)

//*-----------Authentication Router------
app.use('/api/v1/auth', authRouter)


//?---------User Router
app.use('/api/v1/users', userRouter);


//---------Global Error Handler
app.use(globalErrorHandler)


//---------Not Found Route Handler
app.use(notFound)

export default app;