import { UserRoles } from "../enums/user-roles.enum";
import { IsEnum, IsInt, IsPositive, IsNumber } from "class-validator";
import { User } from "../user.entity";
import { Type } from 'class-transformer';

export class ChangeRoleDTO 
{
    @Type(() => Number)
    userid:number;
    @IsEnum(UserRoles,{message:"Invalid role"})
    role:UserRoles;
}