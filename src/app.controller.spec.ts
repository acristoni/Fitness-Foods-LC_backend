import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getModelToken } from '@nestjs/mongoose';
import ProductMock from './mock/product.mock';

describe('AppController', () => {
  let appController: AppController;
  let productModelMock;
  let processModelMock;
  let findOneMock;
  let findMock;

  const getLastProcessMock = jest.fn();
  const memoryUsageMock = jest.fn();
  const uptimeMock = jest.fn();

  beforeEach(async () => {
    productModelMock = {
      countDocuments: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
    };

    processModelMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    findOneMock = {
      sort: jest.fn(),
      exec: jest.fn(),
    };

    findMock = {
      sort: jest.fn(),
      exec: jest.fn(),
      skip: jest.fn(),
      limit: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: 'getLastProcess',
          useValue: getLastProcessMock,
        },
        {
          provide: getModelToken('Process'),
          useValue: processModelMock,
        },
        {
          provide: getModelToken('Product'),
          useValue: productModelMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    (global as any).process.memoryUsage = memoryUsageMock;
    (global as any).process.uptime = uptimeMock;
  });

  describe('root', () => {
    it('should return API information', async () => {
      memoryUsageMock.mockReturnValue({
        heapTotal: 20971520,
        external: 20971520,
        arrayBuffers: 20971520,
      });
      uptimeMock.mockReturnValue(10.123456789);

      const lastProcessResult = {
        date: '2023-09-17 12:00:00',
      };

      processModelMock.findOne.mockReturnValue(findOneMock);
      findOneMock.sort.mockReturnThis();
      findOneMock.exec.mockResolvedValue(lastProcessResult);

      expect(await appController.getHello()).toBe(
        'API, conexão leitura e escritura com a base de dados está OK, uso de memória por parte da aplicação é de 60.00 MB, está online a 10 segundos e o horário da última vez que o CRON foi executado: 2023-09-17 12:00:00',
      );
    });
  });

  describe('products - GET', () => {
    it('should return list of all products, with pagination', async () => {
      const mockReturn = {
        data: [ProductMock],
        page: 1,
        limit: 10,
        totalProducts: 1,
      };

      productModelMock.countDocuments.mockResolvedValue(1);

      productModelMock.find.mockReturnValue(findMock);
      findMock.sort.mockReturnThis();
      findMock.skip.mockReturnThis();
      findMock.limit.mockReturnThis();
      findMock.exec.mockResolvedValue([ProductMock]);

      expect(await appController.findAll(1, 10)).toStrictEqual(mockReturn);
    });
  });
});
