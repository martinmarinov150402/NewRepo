import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt';
import { noop } from "rxjs";
import { UserRoles } from "./enums/user-roles.enum";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User>
{
    async removeMemberFromOrg(user:User,orgid:number,userid:number)
    {
        let us=await this.findOne({id:userid});
        let str=";"+ "a"+ orgid.toString()+"a";
        if(str.length>us.organisations.length)
        {
            str="a"+ orgid.toString()+"a";
        }
        us.organisations=us.organisations.replace(str,"");
    }
    async signUp(authCredentialsDto:AuthCredentialsDTO):Promise<void>
    {
        const { username,password } = authCredentialsDto;
        const user = new User();
        const salt=await bcrypt.genSalt();
        user.username=username;
        user.password=await this.hashPassword(password,salt);
        user.role=UserRoles.User;
        user.salt=salt;
        //user.organisations=[];
        try
        {
           await user.save(); 
        }
        catch(error)
        {
            switch (error.code) {
                case '23505':
                    throw new ConflictException('User already exists');
                    break;
                default:
                    throw  new InternalServerErrorException();
            }
        }
        
    }
    private async hashPassword(password: string, salt: string): Promise<string>
    {
        return await bcrypt.hash(password, salt);
    }
    signIn(authCredentialsDto:AuthCredentialsDTO):Promise<string>
    {
        return this.validateUserPassword(authCredentialsDto);
    }
    public async findUserById(userid:number):Promise<User>
    {
        return await this.findOne(userid);
    }
    private async validateUserPassword(authCredentialsDto):Promise<string>
    {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });
        if (user)
            var hashed = await this.hashPassword(password, user.salt);
        else
            return undefined;

        if (hashed === user.password)
            return username;

        return undefined;
    }
    async countAdmins()
    {
        const query = this.createQueryBuilder('user');
        query.andWhere('(user.role = :role )', { role:UserRoles.Admin});
        let admins = await query.getCount();
        return admins;
    }
}
