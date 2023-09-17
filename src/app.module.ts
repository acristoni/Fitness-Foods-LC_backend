import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './models/products.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongooseConfig from './config/mongoose.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Carregue a configuração globalmente
      load: [mongooseConfig], // Carregue a configuração do Mongoose
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoose.uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
      imports: undefined,
    }),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
