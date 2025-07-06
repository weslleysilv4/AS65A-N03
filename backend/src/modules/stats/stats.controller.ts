import { RequestHandler } from "express";
import * as statsService from "./stats.service";

/**
 * Handler para buscar estatísticas de notícias.
 *
 * @route GET /api/stats/news
 * @returns {200} Estatísticas de notícias
 */
export const getNewsStatsHandler: RequestHandler = async (req, res, next) => {
  try {
    const stats = await statsService.getNewsStats();
    res.status(200).json({
      message: "Estatísticas de notícias encontradas com sucesso",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handler para buscar estatísticas de categorias.
 *
 * @route GET /api/stats/categories
 * @returns {200} Estatísticas de categorias
 */
export const getCategoryStatsHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const stats = await statsService.getCategoryStats();
    res.status(200).json({
      message: "Estatísticas de categorias encontradas com sucesso",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
