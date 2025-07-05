import request from 'supertest';
import app from '../../app';

// Mock do Prisma igual ao publisher.test.ts
jest.mock('../../shared/lib/prisma', () => {
  const news = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  };
  return { __esModule: true, default: { news } };
});
import prisma from '../../shared/lib/prisma';

type PrismaMock = {
  news: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    count: jest.Mock;
  };
};
const mockedPrisma = prisma as unknown as PrismaMock;

describe('News Module', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/news', () => {
    it('deve retornar notícias publicadas', async () => {
      const mockNews = [
        {
          id: 'news-1',
          title: 'Notícia 1',
          content: 'Conteúdo 1',
          status: 'PUBLISHED',
          authorId: 'user-1',
          categoryId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { id: 'user-1', name: 'Autor 1', email: 'autor1@test.com' },
          category: { id: 'cat-1', name: 'Tech' },
        },
        {
          id: 'news-2',
          title: 'Notícia 2',
          content: 'Conteúdo 2',
          status: 'PUBLISHED',
          authorId: 'user-2',
          categoryId: 'cat-2',
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { id: 'user-2', name: 'Autor 2', email: 'autor2@test.com' },
          category: { id: 'cat-2', name: 'Games' },
        },
      ];
      mockedPrisma.news.findMany.mockResolvedValueOnce(mockNews);
      mockedPrisma.news.count.mockResolvedValueOnce(2);

      const res = await request(app).get('/api/news?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.data.news.length).toBe(2);
      expect(res.body.data.news[0].title).toBe('Notícia 1');
    });

    it('deve retornar notícias com busca', async () => {
      const mockNews = [
        {
          id: 'news-1',
          title: 'Tech News',
          content: 'Tech content',
          status: 'PUBLISHED',
          authorId: 'user-1',
          categoryId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { id: 'user-1', name: 'Autor 1', email: 'autor1@test.com' },
          category: { id: 'cat-1', name: 'Tech' },
        },
      ];
      mockedPrisma.news.findMany.mockResolvedValueOnce(mockNews);
      mockedPrisma.news.count.mockResolvedValueOnce(1);

      const res = await request(app).get('/api/news?search=tech');

      expect(res.status).toBe(200);
      expect(res.body.data.news.length).toBe(1);
      expect(res.body.data.news[0].title).toBe('Tech News');
    });

    it('deve retornar 404 quando não há notícias', async () => {
      mockedPrisma.news.findMany.mockResolvedValueOnce([]);
      mockedPrisma.news.count.mockResolvedValueOnce(0);

      const res = await request(app).get('/api/news');

      expect(res.status).toBe(404);
    });

    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.news.findMany.mockRejectedValueOnce(new Error('fail'));

      const res = await request(app).get('/api/news');

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/news/:id', () => {
    it('deve retornar uma notícia por id', async () => {
      const mockNews = {
        id: 'news-1',
        title: 'Notícia 1',
        content: 'Conteúdo 1',
        status: 'PUBLISHED',
        authorId: 'user-1',
        categoryId: 'cat-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 'user-1', name: 'Autor 1', email: 'autor1@test.com' },
        category: { id: 'cat-1', name: 'Tech' },
      };
      mockedPrisma.news.findUnique.mockResolvedValueOnce(mockNews);

      const res = await request(app).get('/api/news/news-1');

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Notícia 1');
      expect(res.body.data.author.name).toBe('Autor 1');
      expect(res.body.data.category.name).toBe('Tech');
    });

    it('deve retornar 404 se não encontrar a notícia', async () => {
      mockedPrisma.news.findUnique.mockResolvedValueOnce(null);

      const res = await request(app).get('/api/news/news-404');

      expect(res.status).toBe(404);
    });

    it('deve retornar 404 se a notícia não estiver publicada', async () => {
      mockedPrisma.news.findUnique.mockResolvedValueOnce(null);

      const res = await request(app).get('/api/news/news-1');

      expect(res.status).toBe(404);
    });

    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.news.findUnique.mockRejectedValueOnce(new Error('fail'));

      const res = await request(app).get('/api/news/news-1');

      expect(res.status).toBe(500);
    });
  });
}); 