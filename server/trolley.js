var db = require('./pghelper'),
    Q = require('q'),
    wallet = require('./wallet');

/**
 * Add activity
 * @param req
 * @param res
 * @param next
 */
function addItem(req, res, next) {
    var userId = req.externalUserId,
        trolley = req.body;

    console.log('Adding Trolley: ' + JSON.stringify(trolley));

    db.query('INSERT INTO salesforce.Trolley__c (Found_By__c, Address__c, Condition__c) VALUES ($1, $2, $3)',[userId, trolley.Address__c, trolley.Condition__c], true)
                  .then(function() {
                      return res.send('ok');
                    //res.send({originalBalance: balance, points: activity.points, newBalance: balance + activity.points, originalStatus: getStatus(balance), newStatus: getStatus(balance + activity.points)});
                })
                .catch(next);
}

/**
 * Get user's recent activity
 * @param req
 * @param res
 * @param next
 */
function getItems(req, res, next) {

    var externalUserId = req.externalUserId;
    console.log('external user id:' + externalUserId);

    db.query("SELECT Contact_LoyaltyId__c AS userId, campaign__c AS campaign, type__c AS type, name__c as name, picture__c as picture, points__c as points, createdDate FROM salesforce.interaction__c WHERE Contact_LoyaltyId__c=$1 ORDER BY id DESC LIMIT 20", [externalUserId])
        .then(function (activities) {
            console.log(JSON.stringify(activities));
            return res.send(JSON.stringify(activities));
        })
        .catch(next);
};

/**
 * Delete all activities for logged in user. Used for demo purpose to reset activities and start demo with empty list.
 * Also deletes user's wallet for consistency.
 * @param req
 * @param res
 * @param next
 */
function deleteAll(req, res, next) {
    var externalUserId = req.externalUserId,
        userId = req.userId;

    Q.all([deleteItems(externalUserId), wallet.deleteItems(userId)])
        .then(function () {
            return res.send('ok');
        })
        .catch(next);
}

/**
 * Delete all activities for the given user
 * @param userId
 * @returns {*}
 */
function deleteItems(userId) {
    console.log('deleting activity items for user ' + userId);
    db.query("DELETE FROM salesforce.interaction__c WHERE Contact_LoyaltyId__c=$1", [userId]);
    db.query("update salesforce.contact set size__c ='',emailpref__c =false,smspref__c =false,offerpref__c =false,marketingpref__c =false, preference__c=false WHERE loyaltyid__c=$1", [userId]);
    db.query("DELETE FROM wishlist WHERE userid in (Select id from salesforce.contact WHERE loyaltyid__c=$1)", [userId]);
    //tempId = db.query("Select id from salesforce.contact WHERE loyaltyid__c=$1", [userId]);
    return 0;
}

exports.getItems = getItems;
exports.addItem = addItem;
exports.deleteAll = deleteAll;
