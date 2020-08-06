import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from 'src/tasks/tasks.repository';
import { UserRepository } from 'src/auth/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { configObject } from 'src/config.object';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { OrganisationRepository } from './organisations.repository';

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
    providers: [OrganisationsService],
    controllers: [OrganisationsController],
})
export class OrganisationsModule {}
