import { Router } from 'express';
import { createLinkToken, exchangePublicToken, getTransactions } from '../controllers/plaid';

const plaidRouter = Router();

plaidRouter.post("/createLinkToken", createLinkToken);
// @ts-ignore
plaidRouter.post("/exchangePublicToken", exchangePublicToken);
// @ts-ignore
plaidRouter.post("/getTransactions", getTransactions);

export default plaidRouter;
