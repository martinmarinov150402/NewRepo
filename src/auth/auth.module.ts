import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'
import { JwtStrategy } from './jwt-strategy';
import {configObject} from '../config.object'
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { AuthorizationService } from './authorization.service';

const configService = new ConfigService();
@Module({
  imports: [
    //ConfigModule.forFeature({})
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      secret: configObject.jwt_secret,
      signOptions: {
        expiresIn:3600,
      }
    })
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    JwtStrategy,
    AuthorizationService,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {
  constructor(private configService:ConfigService)
  {
      
      //console.log(configObject.jwt_secret);
        /*configObject = 
        {
          db_name:this.configService.get<string>('DB_DB_NAME'),
          db_password:this.configService.get<string>('DB_PASSWORD'),
          db_username:this.configService.get<string>('DB_USERNAME'),
          db_host:this.configService.get<string>('DB_HOST'),
          db_port:this.configService.get<number>('DB_PORT'),
          jwt_secret:this.configService.get<string>('JWT_SECRET'),
        };*/
    console.log("Sign secret: "+configObject.jwt_secret);
  }
}
