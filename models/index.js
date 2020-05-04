const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.DIALECT,
  operatorsAliases: 0,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.userAtributes = [
    'id',
    'login',
    'firstName',
    'lastName',
    'createdAt',
    'updatedAt'
];
db.user = require("./user.model.js")(sequelize, Sequelize);
db.group = require("./group.model.js")(sequelize, Sequelize);
db.usersInGroup = require("./usersInGroup.model.js")(sequelize, Sequelize);

db.user.belongsToMany(db.group, {
    through: 'UsersInGroup',
    as: 'genres',
    foreignKey: 'userId'
});
db.group.belongsToMany(db.user, {
    through: 'UsersInGroup',
    as: 'artists',
    foreignKey: 'groupId'
});

module.exports = db;
