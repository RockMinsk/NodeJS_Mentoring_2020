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

NOTE: database synchronization is used during starting of application but you can also execute below SQL query to predefine some users

>         DROP TABLE IF EXISTS <SCHEMA_NAME>."users";
>         
>         CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
>         
>         CREATE TABLE <SCHEMA_NAME>."users"
>         (
>             id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
>             login VARCHAR ( 255 ) UNIQUE NOT NULL,
>             password VARCHAR ( 255 ) NOT NULL,
>             age INTEGER NOT NULL,
>             is_deleted BOOLEAN NOT NULL
>         )
>         
>         TABLESPACE pg_default;
>         
>         ALTER TABLE <SCHEMA_NAME>."users"
>             OWNER to postgres;
>         	
>             INSERT INTO users (login, password, age, is_deleted) VALUES ('Robin Wieruch', 'changeit1', 33, false);
>             INSERT INTO users (login, password, age, is_deleted) VALUES ('Dave Davids', 'changeit1', 25, false);
>             INSERT INTO users (login, password, age, is_deleted) VALUES ('Anghel Botos', 'changeit1', 41, false);
>             INSERT INTO users (login, password, age, is_deleted) VALUES ('Michel Voide', 'changeit1', 39, false);
>             INSERT INTO users (login, password, age, is_deleted) VALUES ('Dave Bautista', 'changeit1', 51, false);
