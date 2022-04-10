import { ConfigService, IEnvConfig } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    service = new ConfigService();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate input', () => {
    it('should be defined', () => {
      expect(service.validateInput).toBeDefined();
    });

    it('should return valdiatedEnvConfig', () => {
      const schemaSpy = jest.spyOn(service.schema, 'validate').mockReturnValue({
        error: undefined,
        value: 'any',
      });
      const payload: IEnvConfig = {
        PORT: 3,
        NODE_ENV: 'test',
        DOT_DEBUG: true,

        POSTGRES_DB: 'gateway',
        POSTGRES_HOST: 'localhost',
        POSTGRES_PASSWORD: 'postgres',
        POSTGRES_PORT: 5432,
        POSTGRES_USER: 'postgres',
        POSTGRES_SYNC: true,

        JWT_ACCESS_TOKEN_SECRET: 'secret',
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: '60s',
      };

      const response = service.validateInput(payload);

      expect(response).toEqual('any');
      expect(schemaSpy).toHaveBeenCalledTimes(1);
      expect(schemaSpy).toHaveBeenCalledWith(payload);
    });

    it('should throw error', () => {
      const schemaSpy = jest.spyOn(service.schema, 'validate').mockReturnValue({
        error: { message: 'error' },
        value: 'any',
      } as never);
      const payload: IEnvConfig = {
        PORT: 3,
        NODE_ENV: 'test',
        DOT_DEBUG: true,

        POSTGRES_DB: 'gateway',
        POSTGRES_HOST: 'localhost',
        POSTGRES_PASSWORD: 'postgres',
        POSTGRES_PORT: 5432,
        POSTGRES_USER: 'postgres',
        POSTGRES_SYNC: true,

        JWT_ACCESS_TOKEN_SECRET: 'SECRET',
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: '60s',
      };
      const expected = new Error(`Config validation error: error`);

      expect(() => {
        service.validateInput(payload);
      }).toThrow(expected);

      expect(schemaSpy).toHaveBeenCalledTimes(1);
      expect(schemaSpy).toHaveBeenCalledWith(payload);
    });
  });

  it('should return port', () => {
    const response = service.port;

    expect(response).toEqual(6007);
  });

  it('get postgres config', () => {
    const rs = service.postgresConfig;

    expect(rs).toEqual({
      database: 'gateway',
      host: 'localhost',
      password: 'postgres',
      port: 5432,
      synchronize: true,
      username: 'postgres',
    });
  });

  it('get jwt access config', () => {
    const rs = service.jwtAccessConfig;

    expect(rs).toEqual({
      expiresIn: '5m',
      secret: 'changeme',
    });
  });
});
