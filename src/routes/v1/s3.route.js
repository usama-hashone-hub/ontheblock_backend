const express = require('express');
const can = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { readFile, deleteFile } = require('../../utils/s3');

const router = express.Router();

router.route('/:key').get(readFile).delete(deleteFile);

module.exports = router;
