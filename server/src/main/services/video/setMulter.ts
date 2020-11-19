const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const setMulter = async (req, res, next) => {
  upload.single('video')(req, res, next);
};

export default setMulter;
