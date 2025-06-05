const express = require('express');
const router = express.Router();
const upload= require('../../config/multer');
const PictureController = require('../../controllers/pictureController');
const authenticateToken = require('../../middleware/auth');

router.post("/",upload.single('image'),authenticateToken, PictureController.create);
router.get("/:id", authenticateToken,PictureController.getImage);
router.delete("/:id", PictureController.remove);
router.put('/', upload.single('image'),authenticateToken,PictureController.updateImage);

module.exports = router;