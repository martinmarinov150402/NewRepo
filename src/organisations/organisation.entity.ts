import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { OrganisationTypes } from "./organisationTypes.enum";
import { User } from "src/auth/user.entity";

@Entity()
export class Organisation extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    type:OrganisationTypes;

    @Column({default:""})
    members:string;

    @Column({default:""})
    managers:string;
}