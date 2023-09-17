import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './models/products.schema';
import axios from 'axios';
import * as zlib from 'zlib';
import { ProductDTO } from './dto/product.dto';
import { Status } from './enums/status.enum';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

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

  async importAllLists() {
    const arrayListsNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const promises = arrayListsNumbers.map(async (listNumber: number) => {
      return await this.saveProductsFromList(listNumber);
    });

    const arraySuccessMessage = await Promise.all(promises);

    return arraySuccessMessage;
  }

  getHello(): string {
    const memoryUsage = process.memoryUsage();
    const uptimeInSeconds = process.uptime();

    const appMemory =
      memoryUsage.heapTotal + memoryUsage.external + memoryUsage.arrayBuffers;

    const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);

    return `API, conexão leitura e escritura com a base de dados está OK, uso de memória por parte da aplicação é de ${toMB(
      appMemory,
    )} MB, está online a ${Math.floor(uptimeInSeconds)} segundos`;
  }

  async getProductByCode(code) {
    try {
      const produtoEncontrado = await this.productModel
        .findOne({ code: code })
        .exec();

      if (produtoEncontrado) {
        return produtoEncontrado;
      } else {
        throw new NotFoundException(
          'Produto não encontrado para o código informado',
        );
      }
    } catch (error) {
      throw new NotFoundException(
        'Produto não encontrado para o código informado',
      );
    }
  }
}
