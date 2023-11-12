import { AppService } from './app.service';

describe('App service', () => {
  let db: any;
  let bucket: any;

  let service: AppService;

  describe('[Unit] Tests', () => {
    let createProductSpy: jest.SpyInstance;
    let sendFileSpy: jest.SpyInstance;

    beforeEach(() => {
      db = {
        model: { create: jest.fn().mockResolvedValue({}) },
      };
      bucket = { send: jest.fn().mockResolvedValue({}) };

      service = new AppService(db, bucket);

      createProductSpy = jest.spyOn(db.model, 'create');
      sendFileSpy = jest.spyOn(bucket, 'send');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should create product', async () => {
      const dto = {
        name: 'test',
        price: 100,
      };
      const file = {
        originalname: 'test',
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      await service.createProduct(dto, file);

      expect(createProductSpy).toHaveBeenCalledTimes(1);
      expect(sendFileSpy).toHaveBeenCalledTimes(1);
    });
  });
});
