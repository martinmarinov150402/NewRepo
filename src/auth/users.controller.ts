import { Controller, Post, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRoles } from './enums/user-roles.enum';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ChangeRoleDTO } from './dto/change-role.dto';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
    constructor(private authService:AuthService){};
    @Post('/grant')
    grant(@Body() data:ChangeRoleDTO)
    {
        return this.authService.grant(data);
    }
    @Post('/revoke')
    revoke(@Body() data:ChangeRoleDTO)
    {
        return this.authService.revoke(data);
    }
    @Post('/myrole')
    myrole(@GetUser() user:User)
    {
        //console.log(user);
        return this.authService.getRole(user);
    }
}
