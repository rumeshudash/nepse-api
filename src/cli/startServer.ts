import { NextFunction, Request, Response } from 'express';
import { Nepse } from '../core/Nepse';
import { IndexIDEnum } from '../enums';

export async function startServer(): Promise<void> {
  const express = require('express');
  const app = express();
  const nepse = new Nepse();
  nepse.setTLSVerification(false);

  const routes = {
    PriceVolumeHistory: '/priceVolumeHistory',
    Summary: '/summary',
    TopGainers: '/topGainers',
    TopLosers: '/topLosers',
    TopTenTradeScrips: '/topTenTradeScrips',
    TopTenTurnoverScrips: '/topTenTurnoverScrips',
    TopTenTransactionScrips: '/topTenTransactionScrips',
    IsNepseOpen: '/isNepseOpen',
    NepseIndex: '/nepseIndex',
    NepseSubIndices: '/nepseSubIndices',
    DailyIndexGraph: '/dailyIndexGraph',
    DailyNepseIndexGraph: '/dailyNepseIndexGraph',
    DailyScripPriceGraph: '/dailyScripPriceGraph',
    SecurityPriceVolumeHistory: '/securityPriceVolumeHistory',
    SecurityDetails: '/securityDetails',
    CompanyList: '/companyList',
    SecurityList: '/securityList',
    LiveMarket: '/liveMarket',
    MarketDepth: '/marketDepth',
    Floorsheet: '/floorsheet',
  };

  app.get('/', (req: Request, res: Response) => {
    const content = Object.entries(routes)
      .map(([key, value]) => `<a href=${value}> ${key} </a>`)
      .join('<BR>');
    res.send(`Serving hot stock data <BR>${content}`);
  });

  app.get(routes.Summary, async (req: Request, res: Response) => {
    try {
      const summary = await nepse.getMarketSummary();
      res.json(summary);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.NepseIndex, async (req: Request, res: Response) => {
    try {
      const indices = await nepse.getNepseIndex();
      const response = indices.reduce((acc: Record<string, unknown>, obj) => {
        acc[obj.index] = obj;
        return acc;
      }, {});
      res.json(response);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.NepseSubIndices, async (req: Request, res: Response) => {
    try {
      const subIndices = await nepse.getNepseSubIndices();
      const response = subIndices.reduce(
        (acc: Record<string, unknown>, obj) => {
          acc[obj.index] = obj;
          return acc;
        },
        {}
      );
      res.json(response);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.TopTenTradeScrips, async (req: Request, res: Response) => {
    try {
      const data = await nepse.getTopTenTradeScrips();
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(
    routes.TopTenTransactionScrips,
    async (req: Request, res: Response) => {
      try {
        const data = await nepse.getTopTenTransactionScrips();
        res.json(data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: errorMessage });
      }
    }
  );

  app.get(routes.TopTenTurnoverScrips, async (req: Request, res: Response) => {
    try {
      const data = await nepse.getTopTenTurnoverScrips();
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.TopGainers, async (req: Request, res: Response) => {
    try {
      const data = await nepse.getTopTenGainers();
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.TopLosers, async (req: Request, res: Response) => {
    try {
      const data = await nepse.getTopTenLosers();
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(
    routes.SecurityPriceVolumeHistory,
    async (req: Request, res: Response) => {
      try {
        const { symbol } = req.query as { symbol?: string };
        if (!symbol) {
          return res
            .status(400)
            .json({ error: 'Symbol parameter is required' });
        }
        const data = await nepse.getSecurityPriceVolumeHistory(symbol);
        res.json(data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: errorMessage });
      }
    }
  );

  app.get(routes.SecurityDetails, async (req: Request, res: Response) => {
    const { symbol } = req.query as { symbol?: string };
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    try {
      const data = await nepse.getSecurityDetails(symbol);
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.CompanyList, async (req: Request, res: Response) => {
    try {
      const data = await nepse.getCompanyList();
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.SecurityList, async (req: Request, res: Response) => {
    try {
      const data = await nepse.getSecurityList();
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.LiveMarket, async (req: Request, res: Response) => {
    try {
      const data = await nepse.getLiveMarket();
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.MarketDepth, async (req: Request, res: Response) => {
    try {
      const { symbol } = req.query as { symbol?: string };
      if (!symbol) {
        return res.status(400).json({ error: 'Symbol parameter is required' });
      }
      const data = await nepse.getMarketDepth(symbol);
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.IsNepseOpen, async (req: Request, res: Response) => {
    try {
      const data = await nepse.getMarketStatus();
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.PriceVolumeHistory, async (req: Request, res: Response) => {
    try {
      const { page, size, businessDate } = req.query as {
        page?: string;
        size?: string;
        businessDate?: string;
      };
      const data = await nepse.getTodaysPriceVolumeHistory({
        page: page ? parseInt(page) : undefined,
        size: size ? parseInt(size) : undefined,
        businessDate: businessDate || undefined,
      });
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.DailyIndexGraph, async (req: Request, res: Response) => {
    try {
      const { index_id } = req.query as { index_id?: string };
      if (!index_id) {
        return res.status(400).json({
          error: 'index_id parameter is required',
          help: `Valid index IDs are: ${Object.entries(IndexIDEnum)
            .map(([key, value]) => `'${value}(${key})'`)
            .join(', ')}`,
        });
      }

      const data = await nepse.getIndexDailyGraph(index_id as IndexIDEnum);
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.DailyNepseIndexGraph, async (req: Request, res: Response) => {
    try {
      const data = await nepse.getNepseIndexDailyGraph();
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });
  app.get(routes.DailyScripPriceGraph, async (req: Request, res: Response) => {
    try {
      const { symbol } = req.query as { symbol?: string };
      if (!symbol) {
        return res.status(400).json({ error: 'Symbol parameter is required' });
      }
      const data = await nepse.getSecurityDailyGraph(symbol);
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get(routes.Floorsheet, async (req: Request, res: Response) => {
    try {
      const { page, size, symbol, buyerBroker, sellerBroker } = req.query as {
        page?: string;
        size?: string;
        symbol?: string;
        buyerBroker?: string;
        sellerBroker?: string;
      };
      const data = await nepse.getFloorSheet({
        page: page ? parseInt(page) : undefined,
        size: size ? parseInt(size) : undefined,
        symbol: symbol || undefined,
        buyerBroker: buyerBroker ? parseInt(buyerBroker) : undefined,
        sellerBroker: sellerBroker ? parseInt(sellerBroker) : undefined,
      });
      res.json(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Enable CORS
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEPSE API server running on http://0.0.0.0:${PORT}`);
  });
}
