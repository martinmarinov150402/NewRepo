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
        newOrg.managers += "a"+ sender.id.toString()+"a";
        console.log("TUKA");
        await newOrg.save();
        if(sender.organisations==="") sender.organisations+="a"+newOrg.id.toString()+"a";
        else sender.organisations+= ";" + "a"+ newOrg.id.toString()+"a";
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
        if(user.organisations === "") user.organisations += "a"+ orgid.toString()+"a";
        else user.organisations += ";" + "a"+ orgid.toString()+"a";
        await user.save();
        if(position === "member")
        {
            if(organisation.members === "") organisation.members += "a"+ user.id.toString()+"a";
            else organisation.members += ";" + "a"+ user.id.toString()+"a";
        }
        else if(position === "manager")
        {
            if(organisation.managers === "") organisation.managers += "a"+ user.id.toString()+"a";
            else organisation.managers += ";" + "a"+ user.id.toString()+"a";
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
            
            let str=";"+"a"+ userid.toString()+"a";
            let strdel=str;
            if(org.members.length<strdel.length)
            {
                strdel="a"+ userid.toString()+"a";
            }
            let idx = org.members.indexOf(strdel);
            org.members=org.members.replace(strdel,"");
            if(org.managers.length===0)
            {
                org.managers+="a"+ userid.toString()+"a";
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
        if(!user.organisations.includes("a"+ orgid.toString()+"a"))
        {
            throw new BadRequestException("You are not a member in that organisation");
        }
        else
        {
            return "Member IDS: "+org.members.replace("a","")+"\n Manager IDS: "+org.managers.replace("a","");
        }
    }
    async kickMember(user:User,orgid:number,userid:number)
    {
        let org = await this.findOne({id:orgid});
        if(!org.managers.includes("a"+ user.id.toString()+"a"))
        {
            return "NOTMAN";
        }
        else
        {
            if(!org.members.includes("a"+userid.toString()+"a"))
            {
                return "IOKMEMB";
            }
            else
            {
                let str=";"+ "a"+ userid.toString()+"a";
                if(str.length>org.members.length)
                {
                    str="a"+ userid.toString()+"a";
                }
                org.members=org.members.replace(str,"");
                await org.save();
                return "OK";
            }
        }
    }
}