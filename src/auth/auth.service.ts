import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserRoles } from './enums/user-roles.enum';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
        private jwtService:JwtService,
    ){}
    async signUp(authCredentialsDto:AuthCredentialsDTO):Promise<void>
    {
        return this.userRepository.signUp(authCredentialsDto);
    }
    async signIn(authCredentialsDto:AuthCredentialsDTO):Promise<{accessToken:string}>
    {
        const username = await this.userRepository.signIn(authCredentialsDto);
        console.log("Username: "+username);
        if(!username)
        {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload:JwtPayload = {username};
        const accessToken = this.jwtService.sign(payload);
        return {accessToken};
    }
    async grant(userid:number, role:UserRoles):Promise<User>{
        let user:User = await this.userRepository.findUserById(userid);
        user.role=role;
        return await user.save();
        
    }
    async revoke(userid:number, role:UserRoles):Promise<User>{
        let user:User = await this.userRepository.findUserById(userid);
        user.role=role;
        return await user.save();
        
    }
    async getRole(user:User):Promise<String>
    {
        if(user.role==UserRoles.Admin)
        {
            return "Admin";
        }
        else
        {
            return "User";
        }
    }
}
