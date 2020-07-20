import { TaskStatus } from "../../tasks/task-status.enum";
import { IsEnum, IsOptional } from "class-validator";

export class GetTasksFilterDto {
  public search?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Not a valid status' })
  public status?: TaskStatus;
}