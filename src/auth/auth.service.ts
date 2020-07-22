import { Injectable, UnauthorizedException, Body, BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserRoles } from './enums/user-roles.enum';
import { User } from './user.entity';
import { ChangeRoleDTO } from './dto/change-role.dto';
import { AuthorizationService } from './authorization.service';
import { Operations } from './enums/operations.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
        private jwtService:JwtService,
        private authorizationService:AuthorizationService,
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
    async grant(sender:User, data:ChangeRoleDTO):Promise<User>{
        if(this.authorizationService.isAuthorized(sender,Operations.Grant))
        {
            const {userid,role} = data;
            let user:User = await this.userRepository.findUserById(userid);
            let admins= await this.userRepository.countAdmins();
            if(userid===sender.id)
            {
                throw new BadRequestException("You can't grant yourself");
            }
            user.role=role;
            return await user.save(); 
        }
        else
        {
            throw new UnauthorizedException("You don't have permission to do this");
        }
        
    }
    async revoke(sender:User, data:ChangeRoleDTO):Promise<User>{
        if(this.authorizationService.isAuthorized(sender,Operations.Revoke))
        {
            const {userid,role} = data;
            let user:User = await this.userRepository.findUserById(userid);
            let admins= await this.userRepository.countAdmins();
            if(admins==1)
            {
                throw new BadRequestException("You can't revoke yourself because you are the last admin");
            }
            user.role=role;
            return await user.save(); 
        }
        else
        {
            throw new UnauthorizedException("You don't have permission to do this");
        }
        
        
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
