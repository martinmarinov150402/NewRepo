import { Injectable } from '@nestjs/common';
import { CreateOrgDTO } from './dto/createOrg.dto';
import { OrganisationRepository } from './organisations.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class OrganisationsService {
    constructor(private organisationRepository:OrganisationRepository){}
    async createOrganisation(data:CreateOrgDTO,sender:User)
    {
        const {name,type}=data;
        return await this.organisationRepository.createOrg(name,type,sender);

    }
    findOrganisations(user:User)
    {
        return user.organisations;
    }
}
