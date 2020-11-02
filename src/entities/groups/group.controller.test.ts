import { Response, Request, NextFunction, ErrorRequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { groupController } from './group.controller';
import { groupService } from './group.service';
import { GroupInterface, UserGroupInterface } from './group.interface';
import { errorHandlerGlobal } from '../../utils/validation';

const generatedId = uuidv4();

let err: ErrorRequestHandler = jest.fn();

let req = ({
    body: {},
    params: { id: generatedId }
} as unknown) as Request;

let res = ({
    send: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
} as unknown) as Response;

let next: NextFunction = jest.fn();

describe('Group Controller', () => {
  
    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });
  
    describe('Get all groups ("getAll" method)', () => {

        it('should call group service', async () => {
            jest
                .spyOn(groupService, 'getAll')
                .mockImplementation(() => Promise.resolve([]));
            await groupController.getAll(req, res, next);
    
            expect(groupService.getAll).toBeCalledTimes(1);
        });

        it('should return "200 OK" and empty list if no one group exists', async () => {
            const listOfGroups = ([] as unknown) as GroupInterface[];
            jest
                .spyOn(groupService, 'getAll')
                .mockImplementation(() => Promise.resolve(listOfGroups));
            await groupController.getAll(req, res, next);
    
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('should return "200 OK" and list of groups if at least one group exists', async () => {
            const listOfGroups = (['Group 1'] as unknown) as GroupInterface[];
            jest
                .spyOn(groupService, 'getAll')
                .mockImplementation(() => Promise.resolve(listOfGroups));
            await groupController.getAll(req, res, next);
    
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(listOfGroups);
        });
        it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
            jest
                .spyOn(groupService, "getAll")
                .mockImplementation(() => Promise.reject(new Error()));
            await groupController.getAll(req, res, next);
            expect(next).toBeCalledTimes(1);
            await errorHandlerGlobal(err, req, res, next);
            expect(res.sendStatus).toBeCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
    });

    describe('Create new group ("add" method)', () => {

        it('should return "201 Created" and json with created group', async () => {
            req.body = { name: 'Group 1', permissions: '[READ, WRITE]' };
            const createdGroup = ({
                id: uuidv4(),
                ...req.body,
            } as unknown) as GroupInterface;
            jest
                .spyOn(groupService, 'add')
                .mockImplementation(() => Promise.resolve(createdGroup));
            await groupController.add(req, res, next);
    
            expect(groupService.add).toBeCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(createdGroup);
        });

        it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
            jest
                .spyOn(groupService, "add")
                .mockImplementation(() => Promise.reject(new Error()));
            await groupController.add(req, res, next);
            expect(next).toBeCalledTimes(1);
            await errorHandlerGlobal(err, req, res, next);
            expect(res.sendStatus).toBeCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
    });

    describe('Get group by ID ("getById" method)', () => {

        it('should return "200 OK" and json with existing group if exists', async () => {
            jest
                .spyOn(groupService, 'getById')
                .mockImplementation((id) => Promise.resolve(({ id } as unknown) as GroupInterface));
            await groupController.getById(req, res, next);
    
            expect(groupService.getById).toBeCalledTimes(1);
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ id: generatedId });
        });

        it('should return "404 Not Found" in case of group with expected ID doesn\'t exists', async () => {
            const { id } = req.params;
            jest
                .spyOn(groupService, "getById")
                .mockImplementation(() => Promise.resolve((null as unknown) as GroupInterface));
            await groupController.getById(req, res, next);

            expect(res.status).toBeCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ message: `Group with id ${id} not found` });
        });

        it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
            jest
                .spyOn(groupService, "getById")
                .mockImplementation(() => Promise.reject(new Error()));
            await groupController.getById(req, res, next);
            expect(next).toBeCalledTimes(1);
            await errorHandlerGlobal(err, req, res, next);
            expect(res.sendStatus).toBeCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
    });

    describe('Update group by ID ("update" method)', () => {

        it('should return "200 OK" and json with updated group if exists', async () => {
            req.body = { name: 'Group 2', permissions: '[READ]' };
            const updateGroup = ({
                id: uuidv4(),
                ...req.body,
            } as unknown) as GroupInterface;
            jest
                .spyOn(groupService, 'update')
                .mockImplementation(() => Promise.resolve(updateGroup));
            await groupController.update(req, res, next);
    
            expect(groupService.update).toBeCalledTimes(1);
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(updateGroup);
        });

        it('should return "404 Not Found" in case of group with expected ID doesn\'t exists', async () => {
            const { id } = req.params;
            jest
                .spyOn(groupService, "update")
                .mockImplementation(() => Promise.resolve((null as unknown) as GroupInterface));
            await groupController.update(req, res, next);

            expect(res.status).toBeCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ message: `Group with id ${id} not found` });
        });

        it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
            jest
                .spyOn(groupService, "update")
                .mockImplementation(() => Promise.reject(new Error()));
            await groupController.update(req, res, next);
            expect(next).toBeCalledTimes(1);
            await errorHandlerGlobal(err, req, res, next);
            expect(res.sendStatus).toBeCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
    });

    describe('Delete group by ID ("delete" method)', () => {

        it('should return "200 OK" and message about deletion of group', async () => {
            const { id } = req.params;
            jest
                .spyOn(groupService, 'delete')
                .mockImplementation(() => Promise.resolve(1));
            await groupController.delete(req, res, next);
    
            expect(groupService.delete).toBeCalledTimes(1);
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ message: `Group with id ${id} deleted` });
        });

        it('should return "404 Not Found" in case of group with expected ID doesn\'t exists', async () => {
            const { id } = req.params;
            jest
                .spyOn(groupService, "delete")
                .mockImplementation(() => Promise.resolve(0));
            await groupController.delete(req, res, next);

            expect(res.status).toBeCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ message: `Group with id ${id} not found` });
        });

        it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
            jest
                .spyOn(groupService, "delete")
                .mockImplementation(() => Promise.reject(new Error()));
            await groupController.delete(req, res, next);
            expect(next).toBeCalledTimes(1);
            await errorHandlerGlobal(err, req, res, next);
            expect(res.sendStatus).toBeCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
    });

    describe('Add user to group ("addUsers" method)', () => {

        it('should return "200 OK" and message about deletion of group', async () => {
            const { id } = req.params;
            req.body = { userIds: '[e2ffaec7-eabe-4342-9a1f-868202de95cf]' };
            const addUserToGroup = {
                id: id,
                ...req.body,
            };
            jest
                .spyOn(groupService, 'addUsers')
                .mockImplementation(() => Promise.resolve(addUserToGroup));
            await groupController.addUsers(req, res, next);
    
            expect(groupService.addUsers).toBeCalledTimes(1);
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(addUserToGroup);
        });

        it('should return "404 Not Found" if no one user exist', async () => {
            const { id } = req.params;
            jest
                .spyOn(groupService, 'addUsers')
                .mockImplementation(() => Promise.resolve((null as unknown) as UserGroupInterface));
            await groupController.addUsers(req, res, next);

            expect(res.status).toBeCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ message: `Group or User not found` });
        });

        it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
            jest
                .spyOn(groupService, "addUsers")
                .mockImplementation(() => Promise.reject(new Error()));
            await groupController.addUsers(req, res, next);
            expect(next).toBeCalledTimes(1);
            await errorHandlerGlobal(err, req, res, next);
            expect(res.sendStatus).toBeCalledTimes(1);
            expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
    });
});
