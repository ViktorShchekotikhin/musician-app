const express = require("express");
const router = express.Router();
const db = require("../models");

const isValidName = (name) => {
    return name && name.length > 2;
};
/**
 * @swagger
 * /users:
 *      post:
 *          summary: Use to create new user in DB
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: body
 *              name: user
 *              schema:
 *                  type: object
 *                  required: login
 *                  properties:
 *                      login:
 *                          type: string
 *                      firstName:
 *                          type: string
 *                      lastName:
 *                          type: string
 *          responses:
 *              '200':
 *                  description: User created successfully.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "id": 1,
 *                          "login": "Artist1",
 *                          "firstName": "Jon",
 *                          "lastName": "Doe",
 *                          "updatedAt": "2020-04-30T10:09:06.495Z",
 *                          "createdAt": "2020-04-30T10:09:06.495Z"
 *                          }
 *              '403':
 *                  description: User with this login already created, incorrect data.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "error1": "User with this login already created",
 *                          "error2": "Invalid user data. All data length must be more than 2 symbols"
 *                          }
 *
 */
router.post("/", (req, res) => {
    const login = req.body.login;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    if(isValidName(login) && isValidName(firstName) && isValidName(lastName)){
        db.user.findOne({where: {login: login}}).then((user) => {
            if (user == null) {
                db.user
                    .create({
                        login: login,
                        firstName: firstName,
                        lastName: lastName,
                    })
                    .then((user) => {
                        // res.status(200).send(user);
                        res.redirect('/users')
                    });
            } else {
                // res.status(403).json({error: 'User with this login already created'});
                res.render('error', {
                    title: 'Error',
                    error: 'User with this login already exist'
                });
                return;
            }
        });
    } else {
        // res.status(403).json({error: 'Invalid user data. All data length must be more than 2 symbols'});
        res.render('error', {
            title: 'Error',
            error: 'Invalid user data. All data length must be more than 2 symbols'
        });
        return;
    }

});

/**
 * @swagger
 * /users/create:
 *      get:
 *          summary: Get view page with form of creation new user.
 */
router.get('/create', (req, res) => {
    res.render('addUser', {
        title: 'Add user',
        isAddUser: true
    })
});

/**
 * @swagger
 * /users/{userId}:
 *      get:
 *          summary: Use to get user by ID from DB. And show user info view
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: path
 *              name: userId
 *              schema:
 *                  type: integer
 *                  required: true
 *                  description: Numeric ID of the user to get
 *          responses:
 *              '200':
 *                  description: User successfully find.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "id": 1,
 *                          "login": "Artist1",
 *                          "firstName": "Jon",
 *                          "lastName": "Doe",
 *                          "updatedAt": "2020-04-30T10:09:06.495Z",
 *                          "createdAt": "2020-04-30T10:09:06.495Z",
 *                          "genres" : [
 *                                  {
 *                                      "id": 1,
 *                                      "name": "Genre",
 *                                      "createdAt": "2020-04-30T11:50:44.000Z",
 *                                      "updatedAt": "2020-04-30T11:50:44.000Z",
 *                                      "UsersInGroup": {
 *                                          "id": 1,
 *                                          "userId": 1,
 *                                          "groupId": 1,
 *                                          "createdAt": "2020-04-30T11:50:56.000Z",
 *                                          "updatedAt": "2020-04-30T11:50:56.000Z"
 *                                          }
 *                                  }
 *                              ]
 *                          }
 */
router.get("/:id", (req, res) => {
    const id = req.params.id;
    db.user.findOne({
        attributes: db.userAtributes,
        where: {id: id},
        include: [{model: db.group, as: 'genres'}]
    }).then((user) => {
        // res.status(200).send(user);
        res.render('user', {
            title: user.login,
            isUsers: true,
            user
        });
    });
});

/**
 * @swagger
 * /users/{userId}/edit:
 *      get:
 *          summary: Get view page with update user forms.
 *          parameters:
 *            - in: path
 *              name: userId
 *              schema:
 *                  type: integer
 *                  required: true
 *                  description: Numeric ID of the user to get
 */
router.get("/:id/edit", (req, res) => {
    const id = req.params.id;
    db.user.findOne({
        attributes: db.userAtributes,
        where: {id: id},
        include: [{model: db.group, as: 'genres'}]
    }).then((user) => {
        db.group.findAll({raw: true}).then(genres => {
            res.render('editUser', {
                title: user.login,
                isUsers: true,
                genres,
                user
            });
        })
    });
});

/**
 * @swagger
 * /users:
 *      get:
 *          summary: Use to get all users in DB
 *          consumes:
 *            - application/json
 *          responses:
 *              '200':
 *                  description: Users.
 *                  examples:
 *                      application/json:
 *                          [
                             {
                                    "id": 1,
                                    "login": "admin",
                                    "firstName": "Jon",
                                    "lastName": "Doe",
                                    "createdAt": "2020-04-28T17:36:15.000Z",
                                    "updatedAt": "2020-04-29T09:02:18.000Z"
                                },
                             {
                                    "id": 2,
                                    "login": "admin2",
                                    "firstName": "Doe",
                                    "lastName": "Jon",
                                    "createdAt": "2020-04-28T18:53:50.000Z",
                                    "updatedAt": "2020-04-28T18:53:50.000Z"
                                }
                             ]
 *
 */
router.get("/", (req, res) => {
    db.user
        .findAll({
            attributes: db.userAtributes,
            raw: true,
        })
        .then((users) => {
            // res.status(200).send(users);
            res.render('users', {
                title: 'Users',
                isUsers: true,
                users
            });
        });
});

/**
 * @swagger
 * /users/edit:
 *      post:
 *          summary: Use to update current user in DB
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: body
 *              name: user
 *              schema:
 *                  type: object
 *                  required: login
 *                  properties:
 *                      id:
 *                          type: string
 *                      firstName:
 *                          type: string
 *                      lastName:
 *                          type: string
 *          responses:
 *              '200':
 *                  description: User created successfully.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "id": 1,
 *                          "login": "Artist1",
 *                          "firstName": "upd firstName",
 *                          "lastName": "upd lastName",
 *                          "updatedAt": "2020-04-30T10:09:06.495Z",
 *                          "createdAt": "2020-04-30T10:09:06.495Z"
 *                          }
 *              '403':
 *                  description: Incorrect data provided.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "error1": "Incorrect fist name provided, length must be more than 2 symbols",
 *                          "error2": "Incorrect last name provided, length must be more than 2 symbols"
 *                          }
 *
 */
router.post("/edit", (req, res) => {
    const id = req.body.id;
    let toUpdate = {};
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    if (firstName) {
        if (isValidName(firstName)) {
            toUpdate.firstName = firstName;
        } else {
            // res.status(403).json({error: 'Incorrect fist name provided, length must be more than 2 symbols'});
            res.render('error', {
                title: 'Error',
                error: 'Incorrect fist name provided, length must be more than 2 symbols'
            });
            return;
        }
    }
    if (lastName) {
        if (isValidName(lastName)) {
            toUpdate.lastName = lastName;
        } else {
            // res.status(403).json({error: 'Incorrect last name provided, length must be more than 2 symbols'});
            res.render('error', {
                title: 'Error',
                error: 'Incorrect last name provided, length must be more than 2 symbols'
            });
            return;
        }
    }
    db.user.findOne({attributes: db.userAtributes, where: {id: id}}).then((user) => {
        return user.update(toUpdate).then((user) => {
            // res.status(200).send(user);
            res.redirect('/users')

        });
    });
});

/**
 * @swagger
 * /users/{userId}/delete:
 *      post:
 *          summary: Use to delete user from DB
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: path
 *              name: userId
 *              schema:
 *                  type: integer
 *                  required: true
 *                  description: Numeric ID of the user to get
 *          responses:
 *              '200':
 *                  description: User successfully deleted.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "message": "Deleted successfully a user with id = 1"
 *                          }
 *              '403':
 *                  description: User not found.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "error": "User not found!"
 *                          }
 */
router.post("/:id/delete", (req, res) => {
    const id = req.params.id;
    db.user.findOne({where: {id: id}}).then((user) => {
        if (user == null) {
            // res.status(403).json({error: 'User not found!'});
            res.render('error', {
                title: 'Error',
                error: 'User not found!'
            });
            return;
        } else {
            db.user.destroy({where: {id: id}}).then(() => {
                // res.status(200).json({message: 'Deleted successfully a user with id = ' + id});
                res.redirect('/users')


            });
        }
    });
});

/**
 * @swagger
 * /users/{userId}/assign/create:
 *      post:
 *          summary: Use to create relationship between user and group
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: path
 *              name: userId
 *              schema:
 *                  type: integer
 *                  required: true
 *                  description: Numeric ID of the user to get
 *            - in: body
 *              name: groupId
 *              schema:
 *                  type: integer
 *                  required: true
 *                  description: ID of the group to get
 *                  properties:
 *                      id:
 *                          type: string
 *          responses:
 *              '200':
 *                  description: Assign successfully created.
 *                  examples:
 *                      application/json:
 *                          {
                                "id": 1,
                                "userId": "2",
                                "groupId": "1",
                                "updatedAt": "2020-04-30T13:17:51.208Z",
                                "createdAt": "2020-04-30T13:17:51.208Z"
                            }
 *              '403':
 *                  description: User or group not found, user already add to this group.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "error1": "User not found!",
 *                          "error2": "Group not found!",
 *                          "error3": "User already add to this group!"
 *                          }
 */
router.post("/:id/assign/create", (req, res) => {
    const userId = req.params.id;
    const groupId = req.body.id;

    db.user.findOne({where: {id: userId}}).then(user => {
        if (user == null) {
            // res.status(403).json({error: 'User not found!'});
            res.render('error', {
                title: 'Error',
                error: 'User not found!'
            });
            return
        } else {
            db.group.findOne({where: {id: groupId}}).then(group => {
                if (group == null) {
                    // res.status(403).json({error: 'Group not found'});
                    res.render('error', {
                        title: 'Error',
                        error: 'Group not found'
                    });
                    return
                } else {
                    db.usersInGroup.findOne({where: {userId: userId, groupId: groupId}}).then(assignee => {
                        if (assignee == null) {
                            db.usersInGroup.create({
                                userId: userId,
                                groupId: groupId
                            }).then(assignee => {
                                // res.status(200).send(assignee);
                                res.redirect('/users')
                            })
                        } else {
                            // res.status(403).json({error: 'User already add to this group!'});
                            res.render('error', {
                                title: 'Error',
                                error: 'User already add to this group!'
                            });
                            return
                        }
                    })
                }
            });
        }
    });
});

module.exports = router;
