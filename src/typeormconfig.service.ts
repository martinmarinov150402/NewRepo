import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Task } from './tasks/task.entity'
import {configObject} from './config.object'
import { User } from './auth/user.entity'
import { Organisation } from './organisations/organisation.entity'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor (private readonly configService: ConfigService) {}
  createTypeOrmOptions (
    connectionName?: string
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host:configObject.db_host,
      port:Number(configObject.db_port),
      username:configObject.db_username,
      password:configObject.db_password,
      database:configObject.db_name,
      //url: this.configService.get<string>('TYPEORM_URL'),
      synchronize:true,
      //synchronize: configObject.db_sync,
      entities:[Task,User,Organisation],
    }
  }
}