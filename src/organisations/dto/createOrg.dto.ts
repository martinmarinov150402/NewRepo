import { OrganisationTypes } from "../organisationTypes.enum";
import { IsEnum } from "class-validator";

export class CreateOrgDTO {
    name:string;

    @IsEnum(OrganisationTypes,{message:"Invalid organisation type"})
    type:OrganisationTypes;
}