import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';

import * as morgan from 'morgan';
import helmet from 'helmet';
import * as compression from 'compression';

import { AppModule } from './app.module';

import { Signals } from './enums/signals.enum';
import { Environment } from './env.validate';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*', methods: '*' },
  });

  // Add application version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (process.env.NODE_ENV !== Environment.PRODUCTION) {
    app.use(morgan('dev'));
  }

  if (process.env.NODE_ENV === Environment.PRODUCTION) {
    // Enable security middleware
    app.use(helmet());
  }

  // Enable compression middleware
  app.use(compression());

  await app.listen(process.env.PORT ?? 4000, () => {
    new Logger('AppLogStarter').log(`App is running on: ${process.env.PORT}`);
  });

  process.on(Signals.UNHANDLED_REJECTION, async (reason: any) => {
    console.error(`Unhandled rejection, reason: ${reason.message}`);

    await app.close();
  });

  process.on(Signals.SIGTERM, async () => {
    console.info('SIGTERM signal received. Shutting down...');

    await app.close();
  });

  process.on(Signals.SIGINT, async (err: any) => {
    process.exit(err ? 1 : 0);
  });
}
bootstrap();
