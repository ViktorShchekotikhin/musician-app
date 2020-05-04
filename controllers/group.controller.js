const express = require("express");
const router = express.Router();
const db = require("../models");

/**
 * @swagger
 * /groups:
 *      post:
 *          summary: Use to create new group in DB
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: body
 *              name: group
 *              schema:
 *                  type: object
 *                  required: name
 *                  properties:
 *                      name:
 *                          type: string
 *          responses:
 *              '200':
 *                  description: Group created successfully.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "id": 1,
 *                          "name": "Group",
 *                          "updatedAt": "2020-04-30T10:09:06.495Z",
 *                          "createdAt": "2020-04-30T10:09:06.495Z"
 *                          }
 *              '403':
 *                  description: Group with this name already created, incorrect data.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "error1": "Group with this name already exist",
 *                          "error2": "Invalid group name. All data length must be more than 2 symbols"
 *                          }
 *
 */
router.post('/', (req, res) => {
    const name = req.body.name;
    if(name.length > 2){
        db.group.findOne({where: {name: name}}).then((group) => {
            if (group == null) {
                db.group.create({
                    name: name
                }).then((group) => {
                    // res.status(200).send(group);
                    res.redirect('/groups')
                })
            } else {
                // res.status(403).json({error: 'Group with this name already exist'});
                res.render('error', {
                    title: 'Error',
                    error: 'Group with this name already exist'
                });
                return
            }
        })
    } else {
        // res.status(403).json({error: 'Invalid group name. All data length must be more than 2 symbols'});
        res.render('error', {
            title: 'Error',
            error: 'Invalid group name. All data length must be more than 2 symbols'
        });
    }

});

/**
 * @swagger
 * /groups/create:
 *      get:
 *          summary: Get view page with form of creation new group.
 */
router.get('/create', (req, res) => {
    res.render('addGroup', {
        title: 'Add group',
        isAddGroup: true
    })
});

/**
 * @swagger
 * /groups/{userId}/edit:
 *      get:
 *          summary: Get view page with update group form.
 *          parameters:
 *            - in: path
 *              name: groupId
 *              schema:
 *                  type: integer
 *                  required: true
 *                  description: Numeric ID of the group to get
 */
router.get("/:id/edit", (req, res) => {
    const id = req.params.id;
    db.group.findOne({where: {id: id}}).then((group) => {
        res.render('editGroup', {
            title: group.name,
            isGroups: true,
            group
        });
    });
});

/**
 * @swagger
 * /groups:
 *      get:
 *          summary: Use to get all groups in DB
 *          consumes:
 *            - application/json
 *          responses:
 *              '200':
 *                  description: Groups.
 *                  examples:
 *                      application/json:
 *                          [
 {
                                    "id": 1,
                                    "name": "Group1",
                                    "createdAt": "2020-04-28T17:36:15.000Z",
                                    "updatedAt": "2020-04-29T09:02:18.000Z"
                                },
 {
                                    "id": 2,
                                    "name": "Group2",
                                    "createdAt": "2020-04-28T18:53:50.000Z",
                                    "updatedAt": "2020-04-28T18:53:50.000Z"
                                }
 ]
 *
 */
router.get("/", (req, res) => {
    db.group
        .findAll({
            raw: true,
        })
        .then((groups) => {
            // res.status(200).send(groups);
            res.render('groups', {
                title: 'Groups',
                isGroups: true,
                groups
            });
        });
});

/**
 * @swagger
 * /groups/edit:
 *      post:
 *          summary: Use to update current group in DB
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: body
 *              name: group
 *              schema:
 *                  type: object
 *                  required: login
 *                  properties:
 *                      id:
 *                          type: string
 *                      name:
 *                          type: string
 *          responses:
 *              '200':
 *                  description: User created successfully.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "id": 1,
 *                          "name": "upd name",
 *                          "updatedAt": "2020-04-30T10:09:06.495Z",
 *                          "createdAt": "2020-04-30T10:09:06.495Z"
 *                          }
 *              '403':
 *                  description: Incorrect data provided.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "error": "Invalid group name. All data length must be more than 2 symbols",
 *                          }
 *
 */
router.post("/edit", (req, res) => {
    const id = req.body.id;
    let toUpdate = {};
    const name = req.body.name;
    if (name) {
        if (name.length > 2) {
            toUpdate.name = name;
        } else {
            // res.status(403).json({error: 'Invalid group name. All data length must be more than 2 symbols'});
            res.render('error', {
                title: 'Error',
                error: 'Invalid group name. All data length must be more than 2 symbols'
            });
            return;
        }
    }
    db.group.findOne({where: {id: id}}).then((group) => {
        return group.update(toUpdate).then((updateGroup) => {
            // res.status(200).send(updateGroup);
            res.redirect('/groups')
        });
    });
});

/**
 * @swagger
 * /groups/{groupId}/users:
 *      get:
 *          summary: Use to show info about users that exist in this group.
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: path
 *              name: groupId
 *              schema:
 *                  type: integer
 *                  required: true
 *                  description: Numeric ID of the group to get
 *          responses:
 *              '200':
 *                  description: Group successfully find.
 *                  examples:
 *                       {
 *                           "id": 1,
 *                          "name": "Group",
 *                          "createdAt": "2020-04-30T13:15:05.000Z",
 *                           "updatedAt": "2020-04-30T14:11:16.000Z",
 *                          "artists": [
 *                          {
 *                              "id": 2,
 *                              "login": "admin",
 *                              "firstName": "admin",
 *                              "lastName": "admin",
 *                              "createdAt": "2020-04-30T13:14:56.000Z",
 *                              "updatedAt": "2020-04-30T13:14:56.000Z",
 *                              "UsersInGroup": {
 *                                  "id": 1,
 *                                  "userId": 2,
 *                                  "groupId": 1,
 *                                  "createdAt": "2020-04-30T13:17:51.000Z",
 *                                  "updatedAt": "2020-04-30T13:17:51.000Z"
 *                              }
 *                          }
 *                      ]
 *                  }
 */
router.get("/:id/users", (req, res) => {
    const id = req.params.id;
    db.group.findOne({
        where: {id: id},
        include: [{model: db.user, as: 'artists'}]
    }).then((group) => {
        // res.status(200).send(group);
        res.render('usersInGroup', {
            title: `${group.name} users`,
            isGroups: true,
            group: group
        });
    })
});

/**
 * @swagger
 * /groups/{groupId}/delete:
 *      post:
 *          summary: Use to delete group from DB
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: path
 *              name: groupId
 *              schema:
 *                  type: integer
 *                  required: true
 *                  description: Numeric ID of the group to get
 *          responses:
 *              '200':
 *                  description: Group successfully deleted.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "message": "Deleted successfully a group with id = 1"
 *                          }
 *              '403':
 *                  description: Group not found.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "error": "Group not found!"
 *                          }
 */
router.post("/:id/delete", (req, res) => {
    const id = req.params.id;
    db.group.findOne({where: {id: id}}).then((group) => {
        if (group == null) {
            // res.status(403).json({error: 'Group not found!'});
            res.render('error', {
                title: 'Error',
                error: 'Group not found!'
            });
            return;
        } else {
            db.group.destroy({where: {id: id}}).then(() => {
                // res.status(200).json({message: 'Deleted successfully a group with id = ' + id});
                res.redirect('/groups')
            });
        }
    });
});
module.exports = router;
