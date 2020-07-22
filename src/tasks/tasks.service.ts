import { Injectable, NotFoundException } from '@nestjs/common';
//import { Task, TaskStatus } from './task.model';
import {TaskStatus} from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult, QueryBuilder } from 'typeorm';
import { User } from 'src/auth/user.entity';
import {GetTasksFilterDto} from "../auth/dto/get-tasks-filter.dto";
import { AuthorizationService } from 'src/auth/authorization.service';
import { Operations } from 'src/auth/enums/operations.enum';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository:TaskRepository,
        private authorizationService:AuthorizationService,
        ){}
    async getTaskByID(id:number,user:User):Promise<Task>
    {
        let found;
        if(this.authorizationService.isAuthorized(user,Operations.AccessAllTasks))
        {
            found = await this.taskRepository.findTaskByIdA(id,user);
        }
        else
        {
            found = await this.taskRepository.findTaskById(id,user);  
        }
        
        if(!found)
        {
            throw new NotFoundException('Task not found');
        }
        return found;
    }
    async createTask(createTaskDto:CreateTaskDTO,user:User):Promise<Task>{
        return this.taskRepository.createTask(createTaskDto,user);
    }
    async deleteTaskByID(id:number,user:User):Promise<void>
    {
        if(this.authorizationService.isAuthorized(user,Operations.AccessAllTasks))
        {
        await this.taskRepository.deleteTaskA(id,user);
        }
        else
        {
            await this.taskRepository.deleteTask(id,user);
        }
    }
    async patchTask(id: number,val: TaskStatus, user: User): Promise<void>
    {
        //const task = await this.getTaskByID(id, user);
        if(this.authorizationService.isAuthorized(user,Operations.AccessAllTasks))
        {
            const { affected } = await this.taskRepository.update({ id }, { status: val });
                if (!affected)
                throw new NotFoundException('Task was not found!');
        }
        else
        {
            const { affected } = await this.taskRepository.update({ userId: user.id, id }, { status: val });
                if (!affected)
                throw new NotFoundException('Task was not found!');
        }
        
    }
    async getTasks(getTasksFilterDto: GetTasksFilterDto, user:User):Promise<Task[]>
    {
        if(this.authorizationService.isAuthorized(user,Operations.AccessAllTasks))
        {
            return await this.taskRepository.getTasksA(getTasksFilterDto, user);
        }
        else
        {
            return await this.taskRepository.getTasks(getTasksFilterDto, user);
        }
        
    }
    /*private tasks: Task[] = [];
    getAllTasks(): Task[] {
        return this.tasks;
    }
    
    patchTask(id:string,item:string,val:string):Task
    {
        let taskid = this.tasks.findIndex(task => task.id===id);
        this.tasks[taskid][item]=val;
        return this.tasks[taskid];
    }*/
}
