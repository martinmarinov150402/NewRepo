import { EntityRepository, Repository } from "typeorm";
import { Organisation } from "./organisation.entity";
import { OrganisationTypes } from "./organisationTypes.enum";
import { tmpdir, networkInterfaces } from "os";
import { User } from "src/auth/user.entity";
import { BadRequestException } from "@nestjs/common";
import { UserRepository } from "src/auth/user.repository";

@EntityRepository(Organisation)
export class OrganisationRepository extends Repository<Organisation>
{
    async createOrg(name:string,type:OrganisationTypes,sender:User)
    {
        const newOrg = new Organisation();
        newOrg.name=name;
        newOrg.type=type;
        newOrg.managers="";
        newOrg.managers += sender.id.toString();
        console.log("TUKA");
        await newOrg.save();
        if(sender.organisations==="") sender.organisations+=newOrg.id.toString();
        else sender.organisations+= ";" + newOrg.id.toString();
        await sender.save();
        return newOrg;
    }
    async addUserToOrganisation(user:User, orgid:number, position:string)
    {
        let organisation = await this.findOne({id:orgid});
        if(!organisation)
        {
            throw new BadRequestException("Organisation not found");
        }
        if(user.organisations === "") user.organisations += orgid.toString();
        else user.organisations += ";" + orgid.toString();
        await user.save();
        if(position === "member")
        {
            if(organisation.members === "") organisation.members += user.id.toString();
            else organisation.members += ";" + user.id.toString();
        }
        else if(position === "manager")
        {
            if(organisation.managers === "") organisation.managers += user.id.toString();
            else organisation.managers += ";" + user.id.toString();
        }
        else
        {
            throw new BadRequestException("Bad Possition");
        }
        await organisation.save();

    }
    async listOrgs()
    {
        return await this.find();
    }
    async findOrg(id:number)
    {
        return this.findOne({id});
    }
    async makeManager(user:User,orgid:number,userid:number)
    {
        let org = await this.findOne({id:orgid});
        if(!org.members.includes(userid.toString()))
        {
            throw new BadRequestException("This user isn't in this organisation or is already manager");
        }
        else
        {
            
            let str=";"+userid.toString();
            let strdel=str;
            if(org.members.length<strdel.length)
            {
                strdel=userid.toString();
            }
            let idx = org.members.indexOf(strdel);
            org.members=org.members.replace(strdel,"");
            if(org.managers.length===0)
            {
                org.managers+=userid.toString();
            }
            else
            {
                org.managers+=str;
            }
        }
        return await org.save();
    }
    async members(user:User,orgid:number)
    {
        let org = await this.findOne({id:orgid});
        if(!user.organisations.includes(orgid.toString()))
        {
            throw new BadRequestException("This user is not a member in that organisation");
        }
        else
        {
            return "Member IDS: "+org.members+"\n Manager IDS: "+org.managers;
        }
    }
    /*async kickMember(user:User,orgid:number,userid:number)
    {
        let org = await this.findOne({id:orgid});
        if(!org.managers.includes(user.id.toString()))
        {
            throw new BadRequestException("You aren't a manager of this organisation");
        }
        else
        {
            if(!org.members.includes(userid.toString()))
            {
                throw new BadRequestException("The user you want to kick isn't a member of that organisation");
            }
            else
            {
                let str=";"+userid.toString();
                if(str.length>org.members.length)
                {
                    str=userid.toString();
                }
                org.members=org.members.replace(str,"");
                await org.save();
            }
        }
    }*/
}