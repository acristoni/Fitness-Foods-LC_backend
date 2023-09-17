import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ProductDTO } from './dto/product.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('importar')
  async importDataFromUrl() {
    return await this.appService.importAllLists();
  }

  @Post('importar')
  async createProduct(@Body() productDTO: ProductDTO) {
    return await this.appService.createProduct(productDTO);
  }

  @Get('products')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const products = await this.appService.findAll(page, limit);
    return products;
  }
}
