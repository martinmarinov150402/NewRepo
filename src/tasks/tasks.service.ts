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

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository:TaskRepository
        ){}
    async getTaskByID(id:number,user:User):Promise<Task>
    {
        const found = await this.taskRepository.findTaskById(id,user);
        
        if(!found)
        {
            throw new NotFoundException('Task not found');
        }
        return found;
    }
    async createTask(createTaskDto:CreateTaskDTO,user:User):Promise<Task>{
        return this.taskRepository.createTask(createTaskDto,user);
    }
    deleteTaskByID(id:number,user:User):void
    {
        this.taskRepository.deleteTask(id,user);
    }
    async patchTask(id: number,val: TaskStatus, user: User): Promise<void>
    {
        //const task = await this.getTaskByID(id, user);
        const { affected } = await this.taskRepository.update({ userId: user.id, id }, { status: val });
        if (!affected)
            throw new NotFoundException('Task was not found!');
    }
    async getTasks(getTasksFilterDto: GetTasksFilterDto, user:User):Promise<Task[]>
    {
        return await this.taskRepository.getTasks(getTasksFilterDto, user);
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
