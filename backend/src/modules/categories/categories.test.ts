import request from 'supertest';
import app from '../../app';

// Mock do Prisma igual ao publisher.test.ts
jest.mock('../../shared/lib/prisma', () => {
  const category = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { __esModule: true, default: { category } };
});
import prisma from '../../shared/lib/prisma';

type PrismaMock = {
  category: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};
const mockedPrisma = prisma as unknown as PrismaMock;

describe('Categories Module', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /api/categories', () => {
    it('deve criar uma categoria e retornar 201', async () => {
      const mockCategory = { id: 'cat-1', name: 'Tech', createdAt: new Date(), updatedAt: new Date() };
      mockedPrisma.category.create.mockResolvedValueOnce(mockCategory);
      const res = await request(app).post('/api/categories').send({ name: 'Tech' });
      expect(res.status).toBe(201);
      expect(res.body.category.name).toBe('Tech');
    });
    it('deve retornar 400 se o nome for inválido', async () => {
      const res = await request(app).post('/api/categories').send({});
      expect(res.status).toBe(400);
    });
    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.category.create.mockRejectedValueOnce(new Error('fail'));
      const res = await request(app).post('/api/categories').send({ name: 'Tech' });
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/categories', () => {
    it('deve retornar todas as categorias', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Tech', createdAt: new Date(), updatedAt: new Date() },
        { id: 'cat-2', name: 'Games', createdAt: new Date(), updatedAt: new Date() },
      ];
      mockedPrisma.category.findMany.mockResolvedValueOnce(mockCategories);
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.categories.length).toBe(2);
    });
    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.category.findMany.mockRejectedValueOnce(new Error('fail'));
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('deve retornar uma categoria por id', async () => {
      const mockCategory = { id: 'cat-1', name: 'Tech', createdAt: new Date(), updatedAt: new Date() };
      mockedPrisma.category.findUnique.mockResolvedValueOnce(mockCategory);
      const res = await request(app).get('/api/categories/cat-1');
      expect(res.status).toBe(200);
      expect(res.body.category.name).toBe('Tech');
    });
    it('deve retornar 404 se não encontrar', async () => {
      mockedPrisma.category.findUnique.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/categories/cat-404');
      expect(res.status).toBe(404);
    });
    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.category.findUnique.mockRejectedValueOnce(new Error('fail'));
      const res = await request(app).get('/api/categories/cat-1');
      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('deve atualizar uma categoria', async () => {
      const mockCategory = { id: 'cat-1', name: 'Atualizada', createdAt: new Date(), updatedAt: new Date() };
      mockedPrisma.category.update.mockResolvedValueOnce(mockCategory);
      const res = await request(app).put('/api/categories/cat-1').send({ name: 'Atualizada' });
      expect(res.status).toBe(200);
      expect(res.body.category.name).toBe('Atualizada');
    });
    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.category.update.mockRejectedValueOnce(new Error('fail'));
      const res = await request(app).put('/api/categories/cat-1').send({ name: 'Atualizada' });
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('deve deletar uma categoria', async () => {
      const mockCategory = { id: 'cat-1', name: 'Tech', createdAt: new Date(), updatedAt: new Date() };
      mockedPrisma.category.delete.mockResolvedValueOnce(mockCategory);
      const res = await request(app).delete('/api/categories/cat-1');
      expect(res.status).toBe(200);
      expect(res.body.category.name).toBe('Tech');
    });
    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.category.delete.mockRejectedValueOnce(new Error('fail'));
      const res = await request(app).delete('/api/categories/cat-1');
      expect(res.status).toBe(500);
    });
  });
}); 