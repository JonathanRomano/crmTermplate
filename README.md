# Welcome #

This is a CRM template designed to be simple.

## How to Install ##

After cloning the repository, it will be necessary to set up the database. Start the MySQL server and run the following commands:

```SQL
CREATE DATABASE crm_database;

USE crm_database;

SOURCE path/to/root/directory/crm.sql;
```

Note: Don't forget to replace path/to/root/directory/crm.sql with the correct path to the crm.sql file.

Navigate to the root directory and run the following commands:

```BASH
yarn install

yarn dev
```

There you go! The project is up and running on localhost:3000, and you can start customizing it to your liking.

I haven't managed a public repository before, but if you'd like to make a Pull request, I'd be happy to work together.
