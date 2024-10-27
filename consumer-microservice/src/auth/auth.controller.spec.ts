import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })

      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should be able to SignIn', async () => {
    mockAuthService.signIn.mockImplementation(() =>
      Promise.resolve({ access_token: 'TEST_TOKEN' }),
    );
    expect(
      await authController.signIn({ username: 'test', password: 'test' }),
    ).toEqual({ access_token: 'TEST_TOKEN' });
    expect(mockAuthService.signIn).toHaveBeenCalledWith('test', 'test');
  });
});
