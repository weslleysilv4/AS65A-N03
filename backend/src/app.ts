import express from 'express';
import routes from './routes';
import { errorHandler } from './shared/middleware/error.middleware';

const app = express();

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
