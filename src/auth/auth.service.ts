import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; access_token: string }> {
    // Check if user already exists
    const existingUser = await this.databaseService.findUserByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user
    const userData = {
      ...registerDto,
      password: hashedPassword,
    };

    const user = await this.databaseService.createUser(userData);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const access_token = await this.jwtService.signAsync(payload);

    // Remove password from response
    const { password, ...userResponse } = user;

    return {
      user: userResponse,
      access_token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; access_token: string }> {
    // Find user by email
    const user = await this.databaseService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const access_token = await this.jwtService.signAsync(payload);

    // Remove password from response
    const { password, ...userResponse } = user;

    return {
      user: userResponse,
      access_token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    return await this.databaseService.findUserById(payload.sub);
  }
}
