import { Request, Response } from "express";
import { Configuration, CountryCode, Institution, PlaidApi, PlaidEnvironments, Products } from "plaid";
import { env } from "../config/env";

const configuration = new Configuration({
  basePath: PlaidEnvironments[env.PLAID_ENV!],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
      "PLAID-SECRET": env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const accessTokens = {} as Record<string, string>;

export const createLinkToken = async (req: Request, res: Response) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: req.body.user.client_user_id,
      },
      client_name: "PaperCut Plaid Demo",
      products: env.PLAID_PRODUCTS!.split(",") as Products[],
      country_codes: env.PLAID_COUNTRY_CODES!.split(",") as CountryCode[],
      language: "en",
    });

    res.status(200).json({
      success: true,
      message: "Link token created successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error creating link token:", error);
    res.status(500).json({
      error: "Failed to create link token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const exchangePublicToken = async (req: Request, res: Response) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });

    const accessToken = response.data.access_token;
    accessTokens[req.body.userId] = accessToken;

    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const institutionItem = await plaidClient.itemGet({
      access_token: accessToken,
    });

    const institutionId = institutionItem.data.item.institution_id;

    let institution: Partial<Institution> | null = null;
    if (institutionId) {
      const institutionResponse = await plaidClient.institutionsGetById({
        institution_id: institutionId,
        country_codes: env.PLAID_COUNTRY_CODES!.split(",") as CountryCode[],
      });
      institution = {
        institution_id: institutionResponse.data.institution.institution_id,
        name: institutionResponse.data.institution.name,
      };
    }

    const accountData = {
      access_token: accessToken,
      item_id: response.data.item_id,
      institution,
      accounts: accountResponse.data.accounts,
    }

    res.status(200).json({
      success: true,
      message: "Public token exchanged successfully",
      data: accountData,
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return res.status(500).json({
      error: "Failed to exchange public token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { access_token, account_ids, start_date, end_date } = req.body;
    
    const response = await plaidClient.transactionsGet({
      access_token,
      start_date,
      end_date,
      options: {
        account_ids,
        count: 500,
        offset: 0
      }
    });

    res.json({
      success: true,
      transactions: response.data.transactions,
      total_transactions: response.data.total_transactions
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return res.status(500).json({
      error: "Failed to exchange public token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
