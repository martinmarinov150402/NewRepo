import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
//import * as uuid from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './tasks.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationService } from 'src/auth/authorization.service';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/auth/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { configObject } from 'src/config.object';
import { OrganisationRepository } from 'src/organisations/organisations.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository,UserRepository,OrganisationRepository]),
    AuthModule,
    JwtModule.register({
      secret: configObject.jwt_secret,
      signOptions: {
        expiresIn:3600,
      }
    })
  ],
  controllers: [TasksController],
  providers: [TasksService,AuthorizationService],
})
export class TasksModule {}
