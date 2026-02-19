import express, { Application } from 'express';
import specialityRoute from './Models/Speciality/specality.route';
import authRouter from './Models/Authentication/auth.route';
import { globalErrorHandler } from './middlewere/globalError';
import notFound from './middlewere/notFound';
import cookieParser from 'cookie-parser'
import userRouter from './Models/User/user.route';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import path from 'path';
const app:Application = express();

app.use('/api/auth', toNodeHandler(auth))

app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'src/Templates'));

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