const express = require("express");
const router = express.Router();

const { create, subcategoryById, read, update, remove, list} = require("../controllers/subcategory");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/subcategory/:subcategoryId", read)
router.post("/subcategory/create/:userId", requireSignin, isAuth, isAdmin,  create);
router.put("/subcategory/:subcategoryId/:userId", requireSignin, isAuth, isAdmin, update);
router.delete("/subcategory/:subcategoryId/:userId", requireSignin, isAuth, isAdmin, remove);
router.get("/subcategories", list);

router.param("userId", userById);
router.param("subcategoryId", subcategoryById)


module.exports = router;
