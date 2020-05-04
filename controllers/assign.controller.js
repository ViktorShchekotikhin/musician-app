const express = require('express');
const router = express.Router();
const db = require("../models");

/**
 * @swagger
 * /assigns/{assignId}/delete:
 *      post:
 *          summary: Use to delete relationship between user and group.
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: path
 *              name: assignId
 *              schema:
 *                  type: integer
 *                  required: true
 *                  description: Numeric ID of the user to get
 *          responses:
 *              '200':
 *                  description: Assign successfully deleted.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "message": "Deleted successfully an assignee with id = 1"
 *                          }
 *              '403':
 *                  description: Assign not found.
 *                  examples:
 *                      application/json:
 *                          {
 *                          "error": "Assign not found!"
 *                          }
 */
router.post("/:id/delete", (req, res) => {
    const id = req.params.id;
    db.usersInGroup.findOne({where: {id: id}}).then(assignee => {
        if (assignee == null){
            res.status(403).json({error:'Assign not found'});
            return
        } else {
            db.usersInGroup.destroy({where: {id: id}}).then(() => {
                // res.status(200).json({
                //     message: 'Deleted successfully an assignee with id = ' + id
                // });
                res.redirect(`/users`)
            })
        }
    })
});

module.exports = router;
