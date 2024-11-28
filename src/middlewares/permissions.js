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

        next()
    },

    isStaffOrAdmin: (req,res,next) => {

        if(!(req.user && (req.user.isStaff || req.user.isAdmin))){

            res.errorStatusCode = 403 
            throw new Error("No permission: You must login and to be staff or admin!")
        }

        next()
    },

    isAdmin: (req,res,next) => {

        if(!(req.user && req.user.isAdmin)){
            res.errorStatusCode = 403
            throw new Error("No permission: You must login and to be admin!")
        }

        next()
    }
}
