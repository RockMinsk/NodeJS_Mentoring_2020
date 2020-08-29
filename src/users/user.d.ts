import { UserInterface } from './user.type';
import { Request } from 'express';

export interface RequestUser extends Request {
    item?: UserInterface
}
