#Before installing the modules for this project, first, install Sequelize-CLI by type this command.
`npm install -g sequelize-cli`

#To install the Sequelize.js module, type this command.
`npm install --save sequelize`

#Then install the module for PostgreSQL.
`npm install -g pg`

* Run `npm install` or `yarn install`
* Run `sequelize db:migrate` 
* Run `npm run dev` or `npm start`

#To create model
`sequelize model:create --name Model --attributes attr:string`
#To create new migration
`sequelize migration:create --name file_name`
#To rollback migration
`db:migrate:undo`
