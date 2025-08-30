const express=require('express')
const productController=require("../controllers/Product")
const router=express.Router()

router
    .post("/", (req, res, next) => {
        const upload = req.app.locals.upload;
        const uploadFields = upload.fields([
            { name: 'thumbnail', maxCount: 1 },
            { name: 'images', maxCount: 10 }
        ]);
        uploadFields(req, res, next);
    }, productController.create)
    .get("/",productController.getAll)
    .get("/:id",productController.getById)
    .patch("/:id", (req, res, next) => {
        const upload = req.app.locals.upload;
        const uploadFields = upload.fields([
            { name: 'thumbnail', maxCount: 1 },
            { name: 'images', maxCount: 10 }
        ]);
        uploadFields(req, res, next);
    }, productController.updateById)
    .patch("/undelete/:id",productController.undeleteById)
    .delete("/:id",productController.deleteById)

module.exports=router