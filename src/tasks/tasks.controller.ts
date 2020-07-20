import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UsePipes,
    ValidationPipe,
    ParseIntPipe,
    UseGuards,
    Query
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import {GetTasksFilterDto} from "../auth/dto/get-tasks-filter.dto";
import {TaskStatus} from "./task-status.enum";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService:TasksService){}
    @Get("/:id")
    getTaskByID(@Param("id",ParseIntPipe) id:number, @GetUser() user:User):Promise<Task>
    {
        return this.tasksService.getTaskByID(id,user);
    }
    
    @Post()
    @UsePipes(ValidationPipe)
    crateNewTask(
        @Body() createtaskdto:CreateTaskDTO, @GetUser() user:User
    ):Promise<Task> {
        return this.tasksService.createTask(createtaskdto,user);
    }

    @Delete("/:id")
    deleteTask(@Param("id", ParseIntPipe) id:number,@GetUser() user:User):void
    {
        this.tasksService.deleteTaskByID(id,user);
    }
    @Get()
    getTasks(
      @Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto,
      @GetUser() user:User
    ): Promise<Task[]> {
        return this.tasksService.getTasks(getTasksFilterDto, user);
    }
    @Patch("/:id/status")
    patchTask(
      @Param("id",ParseIntPipe) id: number,
      @GetUser() user: User,
      @Body("val",TaskStatusValidationPipe) val: TaskStatus
    ): Promise<void>
    {
        return this.tasksService.patchTask(id, val, user);
    }
}
