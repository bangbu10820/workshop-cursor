import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    // Add middleware for PointCollection updates
    this.$use(async (params, next) => {
      // Only run this middleware for PointCollection updates
      if (params.model === 'PointCollection' && params.action === 'update') {
        // Get the original point collection before update
        const originalPointCollection = await this.pointCollection.findUnique({
          where: { id: params.args.where.id },
          include: { user: true },
        });

        // Execute the update
        const result = await next(params);

        // If status changed to 'claimed' and wasn't claimed before
        if (
          result.status === 'claimed' &&
          originalPointCollection.status !== 'claimed'
        ) {
          // Update user's points
          await this.user.update({
            where: { id: result.userId },
            data: {
              points: {
                increment: result.amount,
              },
            },
          });
        }

        return result;
      }

      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
