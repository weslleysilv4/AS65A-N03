import request from 'supertest';
import app from '../../app';

import prisma from '../../shared/lib/prisma';

import errorCodes from '../../shared/errors/errorCodes.json';
import errorMessages from '../../shared/errors/errorMessages.json';

// Mock the authentication middleware so every request is automatically
// authenticated with a fake user. We do this before importing the rest
// of the application modules to ensure the mocked version is used.
jest.mock('../../shared/middleware/auth.middleware', () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.user = { id: 'user-123' };
    next();
  },
}));

// Mock Prisma client to avoid touching the real database and to give us
// fine-grained control over the service-layer behaviour in each test case.
jest.mock('../../shared/lib/prisma', () => {
  const news = { findMany: jest.fn() };
  const pendingChange = { findMany: jest.fn(), create: jest.fn() };
  return { __esModule: true, default: { news, pendingChange } };
});

type PrismaMock = {
  news: { findMany: jest.Mock };
  pendingChange: { findMany: jest.Mock; create: jest.Mock };
};

const mockedPrisma = prisma as unknown as PrismaMock;

// Helper constant data used across multiple tests
const sampleNews = [
  {
    id: 'news-123',
    title: 'Sample news',
    text: 'Some cool content',
    publishedAt: new Date(),
    authorId: 'user-123',
  },
];

const samplePendingChange = {
  id: 'pc-123',
  authorId: 'user-123',
  type: 'CREATE',
  status: 'PENDING',
  content: {
    title: 'Sample news',
    text: 'Some cool content',
    categoryIds: ['11111111-1111-1111-1111-111111111111'],
  },
};

describe('Publisher Module', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/publisher/news', () => {
    it('should return published news for the authenticated user', async () => {
      mockedPrisma.news.findMany.mockResolvedValueOnce(sampleNews as any);

      const res = await request(app)
        .get('/api/publisher/news')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Notícias publicadas');
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].id).toBe('news-123');
    });

    it('should return 404 when the user has no published news', async () => {
      mockedPrisma.news.findMany.mockResolvedValueOnce([] as any);

      const res = await request(app)
        .get('/api/publisher/news')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe(errorMessages.notFound.news);
      expect(res.body.errorCode).toBe(errorCodes.notFound.news);
    });
  });

  describe('GET /api/publisher/changes', () => {
    it('should return pending changes for the authenticated user', async () => {
      mockedPrisma.pendingChange.findMany.mockResolvedValueOnce([
        samplePendingChange,
      ] as any);

      const res = await request(app)
        .get('/api/publisher/changes')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Notícias pendentes');
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].id).toBe('pc-123');
    });

    it('should return 404 when there are no pending changes', async () => {
      mockedPrisma.pendingChange.findMany.mockResolvedValueOnce([] as any);

      const res = await request(app)
        .get('/api/publisher/changes')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe(errorMessages.notFound.pendingChanges);
      expect(res.body.errorCode).toBe(errorCodes.notFound.pendingChanges);
    });
  });

  describe('POST /api/publisher/changes', () => {
    const validPayload = {
      title: 'A brand-new article',
      text: 'Amazing text',
      categoryIds: ['11111111-1111-1111-1111-111111111111'],
    };

    it('should create a pending change and return 201', async () => {
      mockedPrisma.pendingChange.create.mockResolvedValueOnce({
        ...samplePendingChange,
        content: validPayload,
      } as any);

      const res = await request(app)
        .post('/api/publisher/changes')
        .set('Authorization', 'Bearer valid-token')
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe(
        'Pedido de criação enviado com sucesso, aguarde a aprovação do administrador'
      );
      expect(res.body.data.id).toBe('pc-123');
      expect(mockedPrisma.pendingChange.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            authorId: 'user-123',
            type: 'CREATE',
            content: validPayload,
          }),
        })
      );
    });

    it('should return 400 when the payload is invalid', async () => {
      const res = await request(app)
        .post('/api/publisher/changes')
        .set('Authorization', 'Bearer valid-token')
        .send({}); // Missing required fields

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Erro de validação');
      expect(res.body.errors).toBeDefined();
    });

    it('should return 500 when prisma fails to create the pending change', async () => {
      mockedPrisma.pendingChange.create.mockResolvedValueOnce(null as any);

      const res = await request(app)
        .post('/api/publisher/changes')
        .set('Authorization', 'Bearer valid-token')
        .send(validPayload);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Falha ao solicitar criação de notícia');
      expect(res.body.errorCode).toBe(errorCodes.internal);
    });
  });

  describe('PUT /api/publisher/changes/:id', () => {
    const updatePayload = { title: 'Updated title' };

    it('should create an update pending change and return 201', async () => {
      mockedPrisma.pendingChange.create.mockResolvedValueOnce({
        ...samplePendingChange,
        id: 'pc-456',
        type: 'UPDATE',
        content: updatePayload,
      } as any);

      const res = await request(app)
        .put('/api/publisher/changes/news-123')
        .set('Authorization', 'Bearer valid-token')
        .send(updatePayload);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe(
        'Pedido de atualização enviado com sucesso, aguarde a aprovação do administrador'
      );
      expect(res.body.newsRequest.id).toBe('pc-456');
      expect(mockedPrisma.pendingChange.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            authorId: 'user-123',
            newsId: 'news-123',
            type: 'UPDATE',
            content: updatePayload,
          }),
        })
      );
    });

    it('should return 500 when prisma fails to create update request', async () => {
      mockedPrisma.pendingChange.create.mockResolvedValueOnce(null as any);

      const res = await request(app)
        .put('/api/publisher/changes/news-123')
        .set('Authorization', 'Bearer valid-token')
        .send(updatePayload);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe(
        'Falha ao solicitar atualização de notícia'
      );
      expect(res.body.errorCode).toBe(errorCodes.internal);
    });

    it('should return 400 for invalid payload', async () => {
      // title is an empty string which violates the update schema (min length 1)
      const res = await request(app)
        .put('/api/publisher/changes/news-123')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: '' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Erro de validação');
      expect(res.body.errors).toBeDefined();
    });
  });
});
