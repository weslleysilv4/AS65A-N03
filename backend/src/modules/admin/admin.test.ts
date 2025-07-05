import request from 'supertest';
import app from '../../app';

// Mock do middleware de autenticação
jest.mock('../../shared/middleware/auth.middleware', () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.user = { id: 'admin-123', email: 'admin@test.com', role: 'ADMIN' };
    next();
  },
}));

// Mock do middleware de roles
jest.mock('../../shared/middleware/roles.middleware', () => ({
  roleMiddleware: (roles: string[]) => (req: any, res: any, next: any) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ error: 'Acesso negado' });
    }
  },
}));

// Mock do Supabase
jest.mock('../../shared/lib/supabase', () => ({
  supabase: {
    auth: {
      admin: {
        createUser: jest.fn(),
        listUsers: jest.fn(),
        updateUserById: jest.fn(),
      },
    },
  },
}));

// Mock do Prisma
jest.mock('../../shared/lib/prisma', () => {
  const user = { findMany: jest.fn(), update: jest.fn(), findUnique: jest.fn() };
  const pendingChange = { findMany: jest.fn(), update: jest.fn(), findUnique: jest.fn() };
  const news = { findMany: jest.fn(), count: jest.fn(), update: jest.fn(), create: jest.fn(), findUnique: jest.fn() };
  const category = { findMany: jest.fn() };
  return { __esModule: true, default: { user, pendingChange, news, category } };
});
import prisma from '../../shared/lib/prisma';
import { supabase } from '../../shared/lib/supabase';

type PrismaMock = {
  user: { findMany: jest.Mock; update: jest.Mock; findUnique: jest.Mock };
  pendingChange: { findMany: jest.Mock; update: jest.Mock; findUnique: jest.Mock };
  news: { findMany: jest.Mock; count: jest.Mock; update: jest.Mock; create: jest.Mock; findUnique: jest.Mock };
  category: { findMany: jest.Mock };
};
const mockedPrisma = prisma as unknown as PrismaMock;
const mockedSupabase = supabase as any;

describe('Admin Module', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /api/admin/users', () => {
    it('deve criar um usuário e retornar 201', async () => {
      const mockUser = { id: 'user-1', email: 'user@test.com', name: 'User', role: 'PUBLISHER' };
      mockedSupabase.auth.admin.createUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const res = await request(app).post('/api/admin/users').send({
        email: 'user@test.com',
        password: 'password123',
        name: 'User',
        role: 'PUBLISHER',
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Usuário criado com sucesso!');
    });

    it('deve retornar 500 se o supabase falhar', async () => {
      mockedSupabase.auth.admin.createUser.mockRejectedValueOnce(new Error('fail'));

      const res = await request(app).post('/api/admin/users').send({
        email: 'user@test.com',
        password: 'password123',
        name: 'User',
        role: 'PUBLISHER',
      });

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/admin/users', () => {
    it('deve retornar todos os usuários', async () => {
      const mockUsers = [
        { id: 'user-1', email: 'user1@test.com', name: 'User 1', role: 'PUBLISHER' },
        { id: 'user-2', email: 'user2@test.com', name: 'User 2', role: 'ADMIN' },
      ];
      mockedSupabase.auth.admin.listUsers.mockResolvedValueOnce({
        data: { users: mockUsers },
        error: null,
      });

      const res = await request(app).get('/api/admin/users');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Usuários recuperados com sucesso');
      expect(res.body.users.length).toBe(2);
    });

    it('deve retornar 500 se o supabase falhar', async () => {
      mockedSupabase.auth.admin.listUsers.mockRejectedValueOnce(new Error('fail'));

      const res = await request(app).get('/api/admin/users');

      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/admin/users/:id', () => {
    it('deve atualizar um usuário', async () => {
      const mockUser = { 
        id: 'user-1', 
        email: 'user@test.com', 
        user_metadata: { name: 'Updated User', role: 'ADMIN' } 
      };
      mockedSupabase.auth.admin.updateUserById.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const res = await request(app).put('/api/admin/users/user-1').send({
        name: 'Updated User',
        role: 'ADMIN',
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Usuário atualizado com sucesso');
      expect(res.body.data.name).toBe('Updated User');
    });

    it('deve retornar 500 se o supabase falhar', async () => {
      mockedSupabase.auth.admin.updateUserById.mockRejectedValueOnce(new Error('fail'));

      const res = await request(app).put('/api/admin/users/user-1').send({
        name: 'Updated User',
        role: 'ADMIN',
      });

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/admin/changes/pending', () => {
    it('deve retornar mudanças pendentes', async () => {
      const mockChanges = [
        {
          id: 'change-1',
          newsId: 'news-1',
          field: 'title',
          oldValue: 'Old Title',
          newValue: 'New Title',
          status: 'PENDING',
        },
      ];
      mockedPrisma.pendingChange.findMany.mockResolvedValueOnce(mockChanges);

      const res = await request(app).get('/api/admin/changes/pending');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Mudanças pendentes recuperadas com sucesso');
      expect(res.body.data.length).toBe(1);
    });

    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.pendingChange.findMany.mockRejectedValueOnce(new Error('fail'));

      const res = await request(app).get('/api/admin/changes/pending');

      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/admin/changes/:id/approve', () => {
    it('deve aprovar uma mudança', async () => {
      const mockChange = {
        id: 'change-1',
        newsId: 'news-1',
        type: 'CREATE',
        status: 'PENDING',
        content: { title: 'New Title', text: 'New Text' },
        authorId: 'user-1',
      };
      const mockUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockNews = { id: 'news-1', title: 'New Title' };
      
      mockedPrisma.pendingChange.findUnique.mockResolvedValueOnce(mockChange);
      mockedPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
      mockedPrisma.pendingChange.update.mockResolvedValueOnce({ ...mockChange, status: 'APPROVED' });
      mockedPrisma.news.create.mockResolvedValueOnce(mockNews);

      const res = await request(app).post('/api/admin/changes/change-1/approve');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Mudança aprovada com sucesso');
    });

    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.pendingChange.findUnique.mockRejectedValueOnce(new Error('fail'));

      const res = await request(app).post('/api/admin/changes/change-1/approve');

      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/admin/changes/:id/reject', () => {
    it('deve rejeitar uma mudança', async () => {
      const mockChange = {
        id: 'change-1',
        newsId: 'news-1',
        type: 'UPDATE',
        status: 'PENDING',
        content: { title: 'New Title' },
        authorId: 'user-1',
      };
      const mockUser = { id: 'admin-123', email: 'admin@test.com' };
      
      mockedPrisma.pendingChange.findUnique.mockResolvedValueOnce(mockChange);
      mockedPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
      mockedPrisma.pendingChange.update.mockResolvedValueOnce({ 
        ...mockChange, 
        status: 'REJECTED', 
        rejectionReason: 'Invalid content' 
      });

      const res = await request(app).post('/api/admin/changes/change-1/reject').send({
        rejectionReason: 'Invalid content',
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Mudança rejeitada com sucesso');
    });

    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.pendingChange.findUnique.mockRejectedValueOnce(new Error('fail'));

      const res = await request(app).post('/api/admin/changes/change-1/reject').send({
        rejectionReason: 'Invalid content',
      });

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/admin/news', () => {
    it('deve retornar todas as notícias', async () => {
      const mockNews = [
        { id: 'news-1', title: 'News 1', status: 'PUBLISHED' },
        { id: 'news-2', title: 'News 2', status: 'DRAFT' },
      ];
      mockedPrisma.news.findMany.mockResolvedValueOnce(mockNews);
      mockedPrisma.news.count.mockResolvedValueOnce(2);

      const res = await request(app).get('/api/admin/news');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Notícias recuperadas com sucesso');
      expect(res.body.data.news.length).toBe(2);
    });

    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.news.findMany.mockRejectedValueOnce(new Error('fail'));

      const res = await request(app).get('/api/admin/news');

      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/admin/news/:id', () => {
    it('deve atualizar uma notícia diretamente', async () => {
      const mockNews = { id: 'news-1', title: 'Updated News', status: 'APPROVED' };
      const mockAdmin = { id: 'admin-123', email: 'admin@test.com' };
      
      mockedPrisma.news.findUnique.mockResolvedValueOnce(mockNews);
      mockedPrisma.user.findUnique.mockResolvedValueOnce(mockAdmin);
      mockedPrisma.news.update.mockResolvedValueOnce(mockNews);

      const res = await request(app).put('/api/admin/news/news-1').send({
        title: 'Updated News',
        status: 'APPROVED',
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Notícia atualizada com sucesso');
      expect(res.body.data.title).toBe('Updated News');
    });

    it('deve retornar 500 se o prisma falhar', async () => {
      mockedPrisma.news.findUnique.mockRejectedValueOnce(new Error('fail'));

      const res = await request(app).put('/api/admin/news/news-1').send({
        title: 'Updated News',
        status: 'APPROVED',
      });

      expect(res.status).toBe(500);
    });
  });
}); 