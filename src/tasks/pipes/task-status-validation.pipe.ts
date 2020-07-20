import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses: TaskStatus[] = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ];

    transform(value: unknown): TaskStatus {
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`The value ${value} is an invalid status!`);
        }
        return value;
    }

    private isStatusValid(status: any): status is TaskStatus {
        return this.allowedStatuses.indexOf(status) !== -1;
    }
}
