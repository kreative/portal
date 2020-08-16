const Warrant = require("./warrant.model");
const Permit = require("../permits/permit.model");
const generate = require("../../utils/Generate");

exports.createWarrant = (req, res) => {
    const ksn = req.body.ksn;
    const issuing_app = res.locals.calling_aidn;
    const permit_token = req.body.permit_token;
    const active = true;
    const createdat = Date.now();

    Permit.findOne({where:{permit_token}})
    .catch(err => {
        res.json({status:500, data:{errorCode:"ISE"}});
    })
    .then(permit => {
        if (permit === null) {
            res.json({status:404, data:{errorCode:"permit_not_found"}});
        }
        else {
            const permit_id = permit.permit_id;
            generate.warrantID(warrant_id => {
                Warrant.create({
                    warrant_id,
                    active,
                    permit_id,
                    ksn,
                    issuing_app,
                    createdat
                })
                .catch(err => {
                    res.json({status:500, data:{errorCode:"ISE"}});
                })
                .then(warrant => {
                    res.json({status:202, data:{warrant}});
                });
            });
        }
    })
};


// returns a boolean to represent whether or not
// a warrant exists for a given KSN
exports.checkForWarrant = (req, res) => {
    const ksn = req.body.ksn;
    const permit_token = req.body.permit_token;
    const active = true;

    Permit.findOne({where: {permit_token}})
    .catch(err => {
        res.json({status:500, data:{errorCode:"ISE"}});
    })
    .then(permit => {
        if (permit === null) {
            res.json({status:404, data:{errorCode:"permit_not_found"}});
        }
        else {
            const permit_id = permit.permit_id;

            Warrant.findOne({where: {ksn, permit_id, active}})
            .catch(err => {
                res.json({status:500, data:{errorCode:"ISE"}});
            })
            .then(warrant => {
                if (warrant === null) {
                    res.json({status:202, data:{has_warrant: false}});
                }
                else {
                    const warrant_id = warrant.warrant_id;
                    res.json({status:202, data:{has_warrant: true, warrant}});
                }
            });
        }
    });
};


exports.getWarrants = (req, res) => {
    Warrant.findAll()
      .catch((error) => res.json({ status:500, data: { errorCode:"ISE" }}))
      .then((warrants) => res.json({ status:202, data: warrants }))
}


// returns only the warrants for the app calling this request
// for a given KSN
exports.getWarrantsForAccount = (req, res) => {
    const ksn = req.body.ksn;
    const issuing_app = res.locals.calling_aidn;

    Warrant.findAll({where:{ksn,issuing_app}})
      .catch(err => res.json({status:500, data:{errorCode:"ISE"}}))
      .then(warrants => res.json({status:202, data:{warrants}}));
};


// can only be called by the admin of the appchain
// this method is used in the Portal DevHub to view warrants
exports.getWarrantsForApp = (req, res) => {
    const issuing_app = req.body.issuing_app;

    Warrant.findAll({where:{issuing_app}})
      .catch(err => res.json({status:500, data:{errorCode:"ISE"}}))
      .then(warrants => res.json({status:202, data:{warrants}}));
};


// we want to keep a track of all the warrants,
// therefore they do not get removed from the DB
// but instead deactivated
exports.deactivateWarrant = (req, res) => {
    const warrant_id = req.body.warrant_id;
    const active = false;

    Warrant.update({active},{where:{warrant_id}})
    .catch((err) => {
        res.json({status:500, data:{errorCode:"ISE"}});
    })
    .then((update) => {
        res.json({status:202, data:{deactivated:true}});
    });
};