import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import {ConfigService} from '@nestjs/config';
import { TypeOrmConfigService } from './typeormconfig.service';
import {configObject} from './config.object';
import { FillModule } from './fill/fill.module';
import { OrganisationsModule } from './organisations/organisations.module';
/*function FillObject()
{
    configObject.db_username=this.configService.get<string>('DB_USERNAME');
    configObject.db_password=this.configService.get<string>('DB_PASSWORD');
    configObject.db_host=this.configService.get<string>('DB_HOST');
    configObject.db_port=this.configService.get<number>('DB_PORT');
    configObject.jwt_secret = this.configService.get<string>('JWT_SECRET');
    configObject.db_name=this.configService.get<string>('DB_DB_NAME');
    configObject.port = this.configService.get<number>('PORT');
    configObject.db_sync = this.configService.get<boolean>('DB_SYNC');
}
FillObject();*/
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      
    }),
    FillModule,
    TypeOrmModule.forRootAsync({useClass:TypeOrmConfigService}),
    AuthModule,
    TasksModule,
    OrganisationsModule,
    
  ],
  controllers: [],
})
export class AppModule {
  
  
  //configObject.db_name = this.configService.get<string>('DB_NAME');
}
