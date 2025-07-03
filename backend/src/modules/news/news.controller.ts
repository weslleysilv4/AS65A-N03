import { RequestHandler } from 'express';
import * as newsService from './news.service';

/**
 * Handler para listar notícias publicadas (público).
 *
 * @route GET /api/news
 * @query page, limit
 * @returns {200} Lista paginada de notícias publicadas
 * @throws {404} Se não houver notícias publicadas
 *
 * @example
 * GET /api/news?page=1&limit=10
 */
export const getPublishedNewsHandler: RequestHandler = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await newsService.getPublishedNews({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    });
    res.status(200).json({
      message: 'Notícias publicadas encontradas com sucesso',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handler para buscar uma notícia publicada por ID (público).
 *
 * @route GET /api/news/:id
 * @param {string} id - ID da notícia
 * @returns {200} Notícia encontrada
 * @throws {404} Se a notícia não existir ou não estiver publicada
 *
 * @example
 * GET /api/news/uuid
 */
export const getPublishedNewsByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await newsService.getPublishedNewsById(id);
    res.status(200).json({
      message: 'Notícia encontrada com sucesso',
      data: news,
    });
  } catch (error) {
    next(error);
  }
}; 