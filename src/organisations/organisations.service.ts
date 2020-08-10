import { Injectable } from '@nestjs/common';
import { CreateOrgDTO } from './dto/createOrg.dto';
import { OrganisationRepository } from './organisations.repository';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';

@Injectable()
export class OrganisationsService {
    constructor(private organisationRepository:OrganisationRepository){}

    isUserInOrg(user:User,id:number)
    {
        let ids=[];
        ids = user.organisations.split(";");
        return ids.includes(id.toString());
    }
    async createOrganisation(data:CreateOrgDTO,sender:User)
    {
        const {name,type}=data;
        return await this.organisationRepository.createOrg(name,type,sender);

    }
    findOrganisations(user:User)
    {
        return user.organisations;
    }
    async listOrgs()
    {
        //return await this.organisationRepository.find();
        return await this.organisationRepository.listOrgs();
    }
    async joinOrg(user:User, id:number)
    {
        return await this.organisationRepository.addUserToOrganisation(user,id,"member");
    }
    async makeManager(user:User,orgid:number,userid:number)
    {
        return this.organisationRepository.makeManager(user,orgid,userid);
    }
    async members(user:User,orgid:number)
    {
        return await this.organisationRepository.members(user,orgid);
    }
    async kickMember(user:User,orgid:number,userid:number)
    {
        //return await this.organisationRepository.kickMember(user,orgid,userid);
    }
}
