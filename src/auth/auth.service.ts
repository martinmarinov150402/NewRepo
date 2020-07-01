import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
    ){}
    async signUp(authCredentialsDto:AuthCredentialsDTO):Promise<void>
    {
        return this.userRepository.signUp(authCredentialsDto);
    }
    async signIn(authCredentialsDto:AuthCredentialsDTO)
    {
        return await this.userRepository.signIn(authCredentialsDto);
    }
}
