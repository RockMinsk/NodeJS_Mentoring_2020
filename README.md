NodeJS Global Mentoring Program (2020Q3)

## Prerequisites
1. NODE version >= 12.18.3
2. NPM version >= 6.14.6
3. Git

## Specific information
- Module 1 - BASICS. NODEJS FUNDAMENTAL THEORY 
    - Task 1.1   - run command "npm run task-1-1" to get reversed text in console
    - Task 1.2.1 - run command "npm run task-1-2-1" to convert csv file to txt using ReadFile / WriteFile methods
    - Task 1.2.2 - run command "npm run task-1-2-2" to convert csv file to txt using Streams and Pipes

---

- Module 2 - IN MEMORY CRUD REST SERVICE WITH VALIDATION 
- Module 3 - POSTGRESQL AND LAYERED ARCHITECTURE 
- Module 4 - SECOND ENTITY AND MANY-TO-MANY ENTITY RELATIONSHIPS
    - run command "npm i" to install all project dependencies
    - PostgreSQL database must be installed and running
    - check parameters for application and database in .env file and update them if needed
    - run command 'npm start' to start application
    - run command 'npm test' to start tests
    - run command 'npm run coverage' to see test coverage

NOTE: 
 - database synchronization is used during starting of application but you can also execute below SQL query to predefine user (login: Test, password: changeit):

> INSERT INTO users (id, login, password, age, is_deleted) VALUES ('87de8657-ba7b-465c-8a77-c22f7669ddc5', 'Test', '$2b$10$yrrcVZkANk2xL..uKEzpbOF7C4oFx3enr.CY2uQ7dNl/s/34STbm.', 33, false);

 - you can see API documentation on http://localhost:3000/api-docs/