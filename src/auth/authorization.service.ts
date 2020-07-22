import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRoles } from './enums/user-roles.enum';
import { Operations } from './enums/operations.enum';

@Injectable()
export class AuthorizationService {
    isAuthorized(user:User, operation:Operations)
    {
        if(user.role===UserRoles.Admin)
        {
            return true;
        }
        else
        {
            if(operation==Operations.AccessOwnTasks)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
