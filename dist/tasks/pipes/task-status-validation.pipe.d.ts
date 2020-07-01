import { PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";
export declare class TaskStatusValidationPipe implements PipeTransform {
    readonly ValidStatuses: TaskStatus[];
    transform(value: any): any;
    private isStatusValid;
}
