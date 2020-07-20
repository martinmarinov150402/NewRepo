import { Repository, EntityRepository, DeleteResult } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import {GetTasksFilterDto} from "../auth/dto/get-tasks-filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async findTaskById(id:Number,user:User):Promise<Task>
    {
        const query=this.createQueryBuilder('task');
        query.andWhere("task.userId = :userId",{userId:user.id});
        query.andWhere("task.id = :taskId",{taskId:id});
        return await query.getOne();
    }
    async getTasks(getTasksFilterDto: GetTasksFilterDto, user:User): Promise<Task[]>
    {
        const { search, status } = getTasksFilterDto;
        const query = this.createQueryBuilder('task');

        if (search)
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });

        if (status)
            query.andWhere('task.status = :status', { status });

        query.andWhere('task.userId = :userId',{userId:user.id});
        return  await query.getMany();
    }
    async createTask(createTaskDto:CreateTaskDTO,user:User){
        const task=new Task();
        const {title,description} = createTaskDto;
        task.title=title;
        task.description=description;
        task.status=TaskStatus.OPEN;
        task.user=user;
        
        await task.save();
        delete task.user;
        return task;
    }
    async deleteTask(id:number,user:User):Promise<void>
    {
        const task=await this.delete({id,userId:user.id});
        if(task.affected === 0)
        {
            throw new NotFoundException('Task not found');
        }
    }
}