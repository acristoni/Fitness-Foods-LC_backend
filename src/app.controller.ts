import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ProductDTO } from './dto/product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Product } from './models/products.schema';
import { UpdateProductDto } from './dto/update-product.dto';

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
    summary: 'Listar todos os produtos da base de dados, com paginação',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const products = await this.appService.findAll(page, limit);
    return products;
  }

  @Get('products/:code')
  @ApiOperation({
    summary: 'Obter a informação somente de um produto da base de dados.',
  })
  async findOne(@Param('code') code: number): Promise<Product> {
    return await this.appService.getProductByCode(code);
  }

  @Delete('products/:code')
  @ApiOperation({
    summary: 'Mudar o status do produto para trash.',
  })
  async delete(@Param('code') code: number): Promise<string> {
    return await this.appService.delete(code);
  }

  @Put('products/:code')
  @ApiOperation({
    summary: 'Será responsável por receber atualizações do Projeto Web.',
  })
  async updateByClient(
    @Param('code') code: number,
    @Body() updatedData: UpdateProductDto,
  ): Promise<Product> {
    return await this.appService.updateByClient(code, updatedData);
  }
}
