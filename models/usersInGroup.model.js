module.exports = function (sequelize, DataTypes) {
    var UsersInGroup = sequelize.define("UsersInGroup", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    return UsersInGroup;
};
