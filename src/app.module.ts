import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { validate } from './env.validate';

import { ValidationPipe } from './pipes/validation.pipe';
import { GlobalExceptionsFilter } from './global-filters/global-exception.filter';

import { ResponseInterceptor } from './interceptors/response.interceptor';
import { StoreModule } from './stores/store.module';
import { ProductModule } from './products/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const uri = config
          .get<string>('MONGO_URI')
          .replace('<PASSWORD>', config.get<string>('MONGO_PASSWORD'));

        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    StoreModule,
    ProductModule,
    CartModule,
    OrderModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    JwtService,
  ],
})
export class AppModule { }
