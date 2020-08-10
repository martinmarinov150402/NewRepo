import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CreateOrgDTO } from './dto/createOrg.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { OrganisationsService } from './organisations.service';
import { User } from 'src/auth/user.entity';
import { OrganisationsModule } from './organisations.module';

@Controller('organisations')
@UseGuards(AuthGuard())
export class OrganisationsController {
    constructor(private organisationsService:OrganisationsService){}
    @Post('/create')
    async createOrg(@Body() data:CreateOrgDTO,@GetUser() sender)
    {
        return await this.organisationsService.createOrganisation(data,sender);

    }
    @Get('/myorganisations')
    async myOrgs(@GetUser() sender)
    {
        return this.organisationsService.findOrganisations(sender);
    }
    @Get('/list')
    async listOrgs()
    {
        return await this.organisationsService.listOrgs();
    }
    @Post('/join')
    async joinOrganisation(@GetUser() sender:User, @Body('id') id:number){
        return await this.organisationsService.joinOrg(sender,id);
    }
    @Post('/makemanager')
    async makeManager(@GetUser() sender:User,@Body('orgid') orgid,@Body('userid') userid)
    {
        return this.organisationsService.makeManager(sender,orgid,userid);
    }
    @Post('/members')
    async members(@GetUser() sender:User,@Body('orgid') orgid:number)
    {
        return await this.organisationsService.members(sender,orgid);
    }
}
