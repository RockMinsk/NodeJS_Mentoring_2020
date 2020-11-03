import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { userController } from "./user.controller";
import { userService } from "./user.service";
import { UserInterface } from "./user.interface";
import { errorHandlerGlobal } from "../../utils/validation";

const generatedId = uuidv4();

let err: ErrorRequestHandler = jest.fn();

let req = ({
    body: {},
    params: { id: generatedId },
    query: { loginSubstring: 'User 1', limit: 2 }
} as unknown) as Request;

let res = ({
    send: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
} as unknown) as Response;

let next: NextFunction = jest.fn();

describe("User Controller", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe('Get all users ("getAll" method)', () => {
    it("should call user service", async () => {
        jest
            .spyOn(userService, "getAll")
            .mockImplementation(() => Promise.resolve([]));
        await userController.getAll(req, res, next);

        expect(userService.getAll).toBeCalledTimes(1);
    });

    it('should return "200 OK" and empty list if no one user exists', async () => {
        const listOfUsers = ([] as unknown) as UserInterface[];
        jest
            .spyOn(userService, "getAll")
            .mockImplementation(() => Promise.resolve(listOfUsers));
        await userController.getAll(req, res, next);

        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([]);
        });

    it('should return "200 OK" and list of users if at least one user exists', async () => {
        const listOfUsers = (["User 1"] as unknown) as UserInterface[];
        jest
            .spyOn(userService, "getAll")
            .mockImplementation(() => Promise.resolve(listOfUsers));
        await userController.getAll(req, res, next);

        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(listOfUsers);
    });

    it('should return "200 OK" when loginSubstring and limit query parameters are used', async () => {
        const listOfUsers = (["User 1", "User 2", "User 3"] as unknown) as UserInterface[];
        jest
            .spyOn(userService, "getAll")
            .mockImplementation(() => Promise.resolve(listOfUsers));
        await userController.getAll(req, res, next);

        expect(userService.getAll).toHaveBeenCalledWith("User 1", 2);
        expect(res.json).toBeCalledTimes(1);
    });

    it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
        jest
            .spyOn(userService, "getAll")
            .mockImplementation(() => Promise.reject(new Error()));
        await userController.getAll(req, res, next);
        expect(next).toBeCalledTimes(1);
        await errorHandlerGlobal(err, req, res, next);
        expect(res.sendStatus).toBeCalledTimes(1);
        expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('Create new user ("add" method)', () => {
    it('should return "201 Created" and json with created user', async () => {
        req.body = { login: 'User 1', password: 'changeit', age: 25 };
        const createdUser = ({
            id: uuidv4(),
            ...req.body,
            is_deleted: false
        } as unknown) as UserInterface;
        jest
            .spyOn(userService, "add")
            .mockImplementation(() => Promise.resolve(createdUser));
        await userController.add(req, res, next);

        expect(userService.add).toBeCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(createdUser);
    });

    it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
        jest
            .spyOn(userService, "add")
            .mockImplementation(() => Promise.reject(new Error()));
        await userController.add(req, res, next);
        expect(next).toBeCalledTimes(1);
        await errorHandlerGlobal(err, req, res, next);
        expect(res.sendStatus).toBeCalledTimes(1);
        expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('Get user by ID ("getById" method)', () => {
    it('should return "200 OK" and json with existing user if exists', async () => {
        jest
            .spyOn(userService, "getById")
            .mockImplementation((id) => Promise.resolve(({ id } as unknown) as UserInterface));
        await userController.getById(req, res, next);

        expect(userService.getById).toBeCalledTimes(1);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ id: generatedId });
    });

    it('should return "404 Not Found" in case of user with expected ID doesn\'t exists', async () => {
      const { id } = req.params;
        jest
            .spyOn(userService, "getById")
            .mockImplementation(() => Promise.resolve((null as unknown) as UserInterface));
        await userController.getById(req, res, next);

        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: true, message: `User with id ${id} not found` });
    });

    it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
        jest
            .spyOn(userService, "getById")
            .mockImplementation(() => Promise.reject(new Error()));
        await userController.getById(req, res, next);
        expect(next).toBeCalledTimes(1);
        await errorHandlerGlobal(err, req, res, next);
        expect(res.sendStatus).toBeCalledTimes(1);
        expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('Update user by ID ("update" method)', () => {
    it('should return "200 OK" and json with updated user if exists', async () => {
        req.body = { login: 'User 2', password: 'changeit', age: 30 };
        const updateUser = ({
            id: uuidv4(),
            ...req.body
        } as unknown) as UserInterface;
        jest
            .spyOn(userService, "update")
            .mockImplementation(() => Promise.resolve(updateUser));
        await userController.update(req, res, next);

        expect(userService.update).toBeCalledTimes(1);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(updateUser);
    });

    it('should return "404 Not Found" in case of user with expected ID doesn\'t exists', async () => {
        const { id } = req.params;
        jest
            .spyOn(userService, "update")
            .mockImplementation(() => Promise.resolve((null as unknown) as UserInterface));
        await userController.update(req, res, next);

        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: true, message: `User with id ${id} not found` });
    });

    it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
        jest
            .spyOn(userService, "update")
            .mockImplementation(() => Promise.reject(new Error()));
        await userController.update(req, res, next);
        expect(next).toBeCalledTimes(1);
        await errorHandlerGlobal(err, req, res, next);
        expect(res.sendStatus).toBeCalledTimes(1);
        expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('Delete user by ID ("delete" method)', () => {
    it('should return "200 OK" and message about deletion of user', async () => {
        jest
            .spyOn(userService, "softDelete")
            .mockImplementation((id) => Promise.resolve(({ id } as unknown) as UserInterface));
        await userController.delete(req, res, next);

        expect(userService.softDelete).toBeCalledTimes(1);
        expect(userService.softDelete).toHaveBeenCalledWith(generatedId);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ message: `User with id ${generatedId} deleted` });
    });

    it('should return "404 Not Found" in case of user with expected ID doesn\'t exists', async () => {
        jest
            .spyOn(userService, "softDelete")
            .mockImplementation(() => Promise.resolve((null as unknown) as UserInterface));
        await userController.delete(req, res, next);

        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: true, message: `User with id ${generatedId} not found` });
    });

    it('should return "500 Internal Server Error" in case of some unexpected error', async () => {
        jest
            .spyOn(userService, "softDelete")
            .mockImplementation(() => Promise.reject(new Error()));
        await userController.delete(req, res, next);
        expect(next).toBeCalledTimes(1);
        await errorHandlerGlobal(err, req, res, next);
        expect(res.sendStatus).toBeCalledTimes(1);
        expect(res.sendStatus).toHaveBeenCalledWith(500);
        });
    });
});

