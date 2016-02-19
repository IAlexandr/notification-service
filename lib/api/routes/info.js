import express from 'express';
import options from './../../../options';
const router = express.Router();

export default router;

router.get('/', function (req, res) {
  res.json({
    name: 'notification-service',
    version: options.version
  });
});
