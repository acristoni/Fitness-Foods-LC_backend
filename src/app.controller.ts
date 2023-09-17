import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ProductDTO } from './dto/product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Alimentos')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary:
      'Detalhes da API, se conexão leitura e escritura com a base de dados está OK, horário da última vez que o CRON foi executado, tempo online e uso de memória.',
  })
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
  @ApiOperation({
    summary: 'Lista todos os produtos da base de dados, com paginação',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const products = await this.appService.findAll(page, limit);
    return products;
  }
}
