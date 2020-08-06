import { EntityRepository, Repository } from "typeorm";
import { Organisation } from "./organisation.entity";
import { OrganisationTypes } from "./organisationTypes.enum";
import { tmpdir, networkInterfaces } from "os";
import { User } from "src/auth/user.entity";

@EntityRepository(Organisation)
export class OrganisationRepository extends Repository<Organisation>
{
    async createOrg(name:string,type:OrganisationTypes,sender:User)
    {
        const newOrg = new Organisation();
        newOrg.name=name;
        newOrg.type=type;
        newOrg.managers.push(sender);
        console.log("TUKA");
        await newOrg.save();
        sender.organisations.push(newOrg);
        await sender.save();
        return newOrg;
    }
}