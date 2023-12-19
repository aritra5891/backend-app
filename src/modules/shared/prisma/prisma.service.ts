import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * The `onModuleInit` function is an asynchronous function that connects to a database.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * The function enables shutdown hooks for a Nest application, which closes the application and
   * disconnects from a database before the process exits.
   * @param {INestApplication} app - The `app` parameter is of type `INestApplication`, which
   * represents the Nest application instance. It is used to control the lifecycle of the application,
   * such as starting and stopping the server, registering routes, and configuring middleware.
   */
  async enableShutdownHooks(app: INestApplication) {
    await process.on('beforeExit', async () => {
      await app.close();
      await this.$disconnect();
    });
  }
}
