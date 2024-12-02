import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PointCollection } from '@prisma/client';

@Injectable()
export class PointService {
  constructor(private prisma: PrismaService) {}

  async claimPoints(collectionId: number): Promise<PointCollection> {
    return this.prisma.$transaction(async (tx) => {
      const pointCollection = await tx.pointCollection.findUnique({
        where: { id: collectionId },
        include: { user: true },
      });

      if (!pointCollection) {
        throw new NotFoundException('Point collection not found');
      }

      // if (pointCollection.status === 'claimed') {
      //   throw new BadRequestException('Points already claimed');
      // }

      return await tx.pointCollection.update({
        where: { id: collectionId },
        data: { status: 'claimed' },
      });
    });
  }
}
