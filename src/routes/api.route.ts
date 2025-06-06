import { Router } from 'express';
import plaidRouter from './plaid.route';

const apiRoutes = Router();

apiRoutes.use('/plaid', plaidRouter);

export default apiRoutes;
