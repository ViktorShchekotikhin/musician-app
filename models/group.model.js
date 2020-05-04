module.exports = (sequelize, Sequelize) => {
    const Group = sequelize.define("group", {
      name: {
        type: Sequelize.STRING,
          allowNull: false,
          validate: {
              notEmpty: true,
              len: [3, 100]
          }
      }
    });
  
    return Group;
  };
