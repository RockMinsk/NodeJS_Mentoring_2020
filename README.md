NodeJS Global Mentoring Program (2020Q3)

## Prerequisites
1. NODE version >= 12.18.3
2. NPM version >= 6.14.6
3. Git

## Specific information
- Module 1 - BASICS. NODEJS FUNDAMENTAL THEORY 
    - Task 1.1   - run script "npm run task-1-1" to get reversed text in console
    - Task 1.2.1 - run script "npm run task-1-2-1" to convert csv file to txt using ReadFile / WriteFile methods
    - Task 1.2.2 - run script "npm run task-1-2-2" to convert csv file to txt using Streams and Pipes


- Module 2 - IN MEMORY CRUD REST SERVICE WITH VALIDATION 
    - Task 2 - run script 'npm run start' to start in memory CRUD REST service with validation


- Module 3 - POSTGRESQL AND LAYERED ARCHITECTURE 
    - Task 3 
        - run below SQL script in your database to create "users" table and predifine user
        - run script 'npm run start' to start application
        - use login / password of any predifined user to login into the app (via http://localhost:3000/ or in Postman)

>         DROP TABLE IF EXISTS <SCHEMA_NAME>."users";
>         
>         CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
>         
>         CREATE TABLE <SCHEMA_NAME>."users"
>         (
>             id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
>             login VARCHAR ( 50 ) UNIQUE NOT NULL,
>             password VARCHAR ( 50 ) NOT NULL,
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


- Module 4 - SECOND ENTITY AND MANY-TO-MANY ENTITY RELATIONSHIPS  
    - Task 4 
        - run below SQL script in your database to create "groups" and "user_group" tables
        - run script 'npm run start' to start application
        - use login / password of any predifined user to login into the app (via http://localhost:3000/ or in Postman)

>        DROP TABLE IF EXISTS <SCHEMA_NAME>."groups";
> 
>        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
> 
>        CREATE TABLE <SCHEMA_NAME>."groups" (
>            id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
>            name VARCHAR ( 50 ) UNIQUE NOT NULL,
>            permissions TEXT[] NOT NULL )
> 
>         TABLESPACE pg_default;
> 
>         ALTER TABLE <SCHEMA_NAME>."groups"
>            OWNER to postgres;
---------------------------------------------------------------------------
>        DROP TABLE IF EXISTS <SCHEMA_NAME>."user_group";
> 
>        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
> 
>        CREATE TABLE <SCHEMA_NAME>."user_group" (
>            user_id uuid REFERENCES <SCHEMA_NAME>."users" (id) NOT NULL,
>            group_id uuid REFERENCES <SCHEMA_NAME>."groups" (id) NOT NULL )
> 
>        TABLESPACE pg_default;
> 
>        ALTER TABLE <SCHEMA_NAME>."user_group"
>            OWNER to postgres;
