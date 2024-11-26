"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Flight API
------------------------------------------------------- */
// Middleware: permissions

module.exports = {
    isLogin: (req,res, next) => {
        if(!(req.user && req.user.isActive)){
            res.errorStatusCode= 403
            throw new Error("No permission: You must login!")
        }
    }
}
