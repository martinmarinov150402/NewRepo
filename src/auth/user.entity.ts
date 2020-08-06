import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, OneToMany, JoinTable, ManyToMany } from "typeorm";
import { Task } from "src/tasks/task.entity";
import { UserRoles } from "./enums/user-roles.enum";
import { Organisation } from "src/organisations/organisation.entity";
import { OrganisationsService } from "src/organisations/organisations.service";

@Entity()
@Unique(['username'])
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username:string;

    @Column()
    password:string;

    @Column()
    salt:string;

    @Column({nullable:true})
    role:UserRoles;

    @OneToMany(type=>Task, task=>task.user, {eager:true})
    tasks:Task[];

    @ManyToMany(type=>Organisation,{cascade:true})
    @JoinTable()
    organisations:Organisation[];

}