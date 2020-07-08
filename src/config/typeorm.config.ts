import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import * as config from 'config';
import { User } from 'src/auth/user.entity';
const dbConfig = config.get('db');
export const typeOrmConfig:TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.DB_HOST || dbConfig.host,
    port: process.env.DB_PORT || dbConfig.port,
    username: process.env.DB_USERNAME || dbConfig.username,
    password: process.env.DB_PASSWORD ||dbConfig.password,
    database: process.env.DB_DB_NAME || dbConfig.database,
    entities: [Task,User],
    synchronize:dbConfig.synchronize,
};