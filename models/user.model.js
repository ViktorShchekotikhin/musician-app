module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      login: {
        type: Sequelize.STRING,
          allowNull: false,
          validate: {
              notEmpty: true,
              len: [3, 100]
          }
      },
      firstName: {
        type: Sequelize.STRING,
          allowNull: false,
          validate: {
              notEmpty: true,
              len: [3, 100]
          }
      },
      lastName: {
        type: Sequelize.STRING,
          allowNull: false,
          validate: {
              notEmpty: true,
              len: [3, 100]
          }
      }
    });
  
    return User;
  };
