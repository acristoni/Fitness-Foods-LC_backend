import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './models/products.schema';
import axios from 'axios';
import * as zlib from 'zlib';
import { ProductDTO } from './dto/product.dto';
import { Status } from './enums/status.enum';
import { UpdateProductDto } from './dto/update-product.dto';
import * as cron from 'node-cron';
import { Process } from './models/process.schema copy';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Process.name) private readonly processModel: Model<Process>,
  ) {
    cron.schedule(
      '11 15 * * *', // agendamento para salvar no bd as 03 da manhã diariamente
      () => {
        this.saveProcess();
        this.updateAllLists();
      },
      {
        scheduled: true,
        timezone: 'America/Sao_Paulo',
      },
    );
  }

  async saveProcess() {
    try {
      const newProcess = new this.processModel();

      newProcess.process_name = 'CRON';
      newProcess.date = new Date();

      return newProcess.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getLastProcess() {
    try {
      return await this.processModel.findOne({}).sort({ date: -1 }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(page: number, limit: number) {
    if (page < 1) {
      throw new BadRequestException(
        'Número da página deve ser maior ou igual a 1, no mínimo',
      );
    }

    const skip = (page - 1) * limit;
    const totalProducts = await this.productModel.countDocuments().exec();
    const products = await this.productModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    return {
      data: products,
      page,
      limit,
      totalProducts,
    };
  }

  async updateProductByCron(productDTO: ProductDTO): Promise<Product> {
    let product = await this.getProductByCode(
      parseInt(productDTO.code.substring(1, 14)),
      false,
    );

    if (!product) {
      product = new this.productModel();
      product.code = parseInt(productDTO.code.substring(1, 14));
      product.status = Status.DRAFT;
      product.imported_t = new Date();
    }

    if (product.status === 'published') {
      return product;
    }

    product.url = productDTO.url;
    product.creator = productDTO.creator;
    product.created_t = new Date(productDTO.created_datetime);
    product.last_modified_t = new Date(productDTO.last_modified_datetime);
    product.product_name = productDTO.product_name;
    product.quantity = productDTO.quantity;
    product.brands = productDTO.brands;
    product.categories = productDTO.categories;
    product.labels = productDTO.labels;
    product.cities = productDTO.cities;
    product.purchase_places = productDTO.purchase_places;
    product.stores = productDTO.stores;
    product.ingredients_text = productDTO.ingredients_text;
    product.traces = productDTO.traces;
    product.serving_size = productDTO.serving_size;
    product.serving_quantity = Number.isNaN(
      parseInt(productDTO.serving_quantity),
    )
      ? 0
      : parseInt(productDTO.serving_quantity);
    product.nutriscore_score = Number.isNaN(
      parseInt(productDTO.nutriscore_score),
    )
      ? 0
      : parseInt(productDTO.nutriscore_score);
    product.nutriscore_grade = productDTO.nutriscore_grade;
    product.main_category = productDTO.main_category;
    product.image_url = productDTO.image_url;

    return await product.save();
  }

  async createProduct(productDTO: ProductDTO): Promise<Product> {
    const newProduct = new this.productModel();
    newProduct.code = parseInt(productDTO.code.substring(1, 14));
    newProduct.status = Status.DRAFT;
    newProduct.imported_t = new Date();
    newProduct.url = productDTO.url;
    newProduct.creator = productDTO.creator;
    newProduct.created_t = new Date(productDTO.created_datetime);
    newProduct.last_modified_t = new Date(productDTO.last_modified_datetime);
    newProduct.product_name = productDTO.product_name;
    newProduct.quantity = productDTO.quantity;
    newProduct.brands = productDTO.brands;
    newProduct.categories = productDTO.categories;
    newProduct.labels = productDTO.labels;
    newProduct.cities = productDTO.cities;
    newProduct.purchase_places = productDTO.purchase_places;
    newProduct.stores = productDTO.stores;
    newProduct.ingredients_text = productDTO.ingredients_text;
    newProduct.traces = productDTO.traces;
    newProduct.serving_size = productDTO.serving_size;
    newProduct.serving_quantity = Number.isNaN(
      parseInt(productDTO.serving_quantity),
    )
      ? 0
      : parseInt(productDTO.serving_quantity);
    newProduct.nutriscore_score = Number.isNaN(
      parseInt(productDTO.nutriscore_score),
    )
      ? 0
      : parseInt(productDTO.nutriscore_score);
    newProduct.nutriscore_grade = productDTO.nutriscore_grade;
    newProduct.main_category = productDTO.main_category;
    newProduct.image_url = productDTO.image_url;

    return newProduct.save();
  }

  async importData(listNumber: number): Promise<string[]> {
    const url = `https://challenges.coode.sh/food/data/json/products_0${listNumber}.json.gz`;

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(url, { responseType: 'stream' });
        if (response.status === 200) {
          const gzipStream = response.data.pipe(zlib.createGunzip());
          let time = 0;
          const nutritionFacts = [];

          gzipStream.on('data', (chunk) => {
            const jsonChunk = chunk.toString('utf8');
            time++;
            nutritionFacts.push(jsonChunk);

            if (time >= 100) {
              gzipStream.destroy();
              console.log('Reached time limit');
              resolve(nutritionFacts);
            }
          });

          gzipStream.on('end', () => {
            console.log('Streaming de dados concluído');
            resolve(nutritionFacts);
          });
        } else {
          throw new Error(
            `Falha ao baixar o arquivo. Status: ${response.status}`,
          );
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async saveProductsFromList(listNumber: number): Promise<string> {
    let string = '';
    const array = await this.importData(listNumber);
    array.forEach((line) => {
      string = string + line;
    });
    const arrayStrings = string.split('}');
    const arrayObj: ProductDTO[] = [];
    for (let i = 0; i < 100; i++) {
      const facts = arrayStrings[i];
      const factsObj = JSON.parse(facts + '}');
      arrayObj.push(factsObj);
    }

    const promises = arrayObj.map(async (productInfo: ProductDTO) => {
      return await this.createProduct(productInfo);
    });

    await Promise.all(promises);

    return `Produtos da lista 0${listNumber} salvos com sucesso`;
  }

  async updateProductsFromList(listNumber: number): Promise<string> {
    let string = '';
    const array = await this.importData(listNumber);
    array.forEach((line) => {
      string = string + line;
    });
    const arrayStrings = string.split('}');
    const arrayObj: ProductDTO[] = [];
    for (let i = 0; i < 100; i++) {
      const facts = arrayStrings[i];
      const factsObj = JSON.parse(facts + '}');
      arrayObj.push(factsObj);
    }

    const promises = arrayObj.map(async (productInfo: ProductDTO) => {
      return await this.updateProductByCron(productInfo);
    });

    await Promise.all(promises);

    return `Produtos da lista 0${listNumber} atualizados com sucesso`;
  }

  async importAllLists() {
    const arrayListsNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const promises = arrayListsNumbers.map(async (listNumber: number) => {
      return await this.saveProductsFromList(listNumber);
    });

    const arraySuccessMessage = await Promise.all(promises);

    return arraySuccessMessage;
  }

  async updateAllLists() {
    console.time('Tempo para realizar');
    this.logger.log('Iniciando atualização diária dos dados em rascunho');
    const arrayListsNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const promises = arrayListsNumbers.map(async (listNumber: number) => {
      return await this.updateProductsFromList(listNumber);
    });

    await Promise.all(promises);

    this.logger.log('Dados diários atualizados');
    console.timeEnd('Tempo para realizar');
  }

  async getHello(): Promise<string> {
    const memoryUsage = process.memoryUsage();
    const uptimeInSeconds = process.uptime();
    const lastProcess = await this.getLastProcess();
    const appMemory =
      memoryUsage.heapTotal + memoryUsage.external + memoryUsage.arrayBuffers;

    const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);

    return `API, conexão leitura e escritura com a base de dados está OK, uso de memória por parte da aplicação é de ${toMB(
      appMemory,
    )} MB, está online a ${Math.floor(
      uptimeInSeconds,
    )} segundos e o horário da última vez que o CRON foi executado: ${
      lastProcess.date
    }`;
  }

  async getProductByCode(code: number, throwError = true): Promise<Product> {
    try {
      const produtoEncontrado = await this.productModel
        .findOne({ code: code })
        .exec();

      if (produtoEncontrado) {
        return produtoEncontrado;
      } else {
        if (throwError) {
          throw new NotFoundException(
            'Produto não encontrado para o código informado',
          );
        } else {
          return null;
        }
      }
    } catch (error) {
      if (throwError) {
        throw new NotFoundException(
          'Produto não encontrado para o código informado',
        );
      } else {
        return null;
      }
    }
  }

  async delete(code: number): Promise<string> {
    const foundProduct = await this.getProductByCode(code);

    try {
      foundProduct.status = Status.TRASH;
      await foundProduct.save();
      return `Produto ${foundProduct.product_name} excluído com sucesso!`;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async updateByClient(code: number, updateProductDto: UpdateProductDto) {
    const foundProduct = await this.getProductByCode(code);

    try {
      Object.assign(foundProduct, updateProductDto);
      return await foundProduct.save();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
