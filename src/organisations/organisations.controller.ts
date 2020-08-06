import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CreateOrgDTO } from './dto/createOrg.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { OrganisationsService } from './organisations.service';

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
}
