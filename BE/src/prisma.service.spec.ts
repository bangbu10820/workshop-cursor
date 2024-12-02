import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { User, PointCollection } from '@prisma/client';

describe('PrismaService', () => {
  let service: PrismaService;
  let testUser: User;
  let testPointCollection: PointCollection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    // Initialize the service and middleware
    await service.onModuleInit();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await service.pointCollection.deleteMany();
    await service.user.deleteMany();

    // Create test user
    testUser = await service.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        points: 0,
      },
    });

    // Create test point collection
    testPointCollection = await service.pointCollection.create({
      data: {
        amount: 100,
        status: 'pending',
        userId: testUser.id,
      },
    });
  });

  afterAll(async () => {
    await service.$disconnect();
  });

  describe('PointCollection middleware', () => {
    it('should update user points when point collection is claimed', async () => {
      // Update point collection status to claimed
      await service.pointCollection.update({
        where: { id: testPointCollection.id },
        data: { status: 'claimed' },
      });

      // Check if user points were updated
      const updatedUser = await service.user.findUnique({
        where: { id: testUser.id },
      });

      expect(updatedUser.points).toBe(100);
    });

    it('should not update points if collection is already claimed', async () => {
      // First claim
      await service.pointCollection.update({
        where: { id: testPointCollection.id },
        data: { status: 'claimed' },
      });

      // Second claim attempt
      await service.pointCollection.update({
        where: { id: testPointCollection.id },
        data: { status: 'claimed' },
      });

      const updatedUser = await service.user.findUnique({
        where: { id: testUser.id },
      });

      // Points should only be added once
      expect(updatedUser.points).toBe(100);
    });

    it('should not update points for non-claim status changes', async () => {
      // Update to a different status
      await service.pointCollection.update({
        where: { id: testPointCollection.id },
        data: { status: 'processing' },
      });

      const updatedUser = await service.user.findUnique({
        where: { id: testUser.id },
      });

      expect(updatedUser.points).toBe(0);
    });

    it('should handle multiple point collections for the same user', async () => {
      // Create second point collection
      const secondCollection = await service.pointCollection.create({
        data: {
          amount: 50,
          status: 'pending',
          userId: testUser.id,
        },
      });

      // Claim both collections
      await service.pointCollection.update({
        where: { id: testPointCollection.id },
        data: { status: 'claimed' },
      });

      await service.pointCollection.update({
        where: { id: secondCollection.id },
        data: { status: 'claimed' },
      });

      const updatedUser = await service.user.findUnique({
        where: { id: testUser.id },
      });

      expect(updatedUser.points).toBe(150); // 100 + 50
    });
  });
});
