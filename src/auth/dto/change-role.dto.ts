import { UserRoles } from "../enums/user-roles.enum";
import { IsEnum, IsInt, IsPositive } from "class-validator";
import { User } from "../user.entity";

export class ChangeRoleDTO 
{
    @IsInt()
    @IsPositive()
    userid:number;
    @IsEnum(UserRoles,{message:"Invalid role"})
    role:UserRoles;
}