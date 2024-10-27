import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })

      .compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should be able to SignIn if username and password is correct', async () => {
    mockUsersService.findOne.mockImplementation((username) =>
      Promise.resolve({ username, userId: 'testId', password: 'test' }),
    );

    mockJwtService.signAsync.mockResolvedValue('TEST_TOKEN');
    expect(await authService.signIn('test', 'test')).toEqual({
      access_token: 'TEST_TOKEN',
    });
    expect(mockUsersService.findOne).toHaveBeenCalledWith('test');
    expect(mockJwtService.signAsync).toHaveBeenCalledWith({
      username: 'test',
      sub: 'testId',
    });
  });

  it('should throw UnauthorizedException if username and password is incorrect', async () => {
    mockUsersService.findOne.mockImplementation(() => Promise.resolve());

    mockJwtService.signAsync.mockResolvedValue('TEST_TOKEN');

    expect(async () => {
      await authService.signIn('test', 'test');
    }).rejects.toThrow(UnauthorizedException);

    expect(mockUsersService.findOne).toHaveBeenCalledWith('test');
    expect(mockJwtService.signAsync).not.toHaveBeenCalled();
  });
});
