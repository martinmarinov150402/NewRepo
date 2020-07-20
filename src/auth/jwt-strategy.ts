import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
import {configObject} from '../config.object';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
        //private configService:ConfigService,
    )
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configObject.jwt_secret,
        });
        console.log("Check secret: "+configObject.jwt_secret);
    }
    async validate(payload: JwtPayload):Promise<User>
    {
        const {username} = payload;
        const user = await this.userRepository.findOne({username});
        if(!user)
        {
            throw new UnauthorizedException();
        }
        return user;
    }
}