import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import { Task } from "src/tasks/task.entity";
import { UserRoles } from "./enums/user-roles.enum";

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

}