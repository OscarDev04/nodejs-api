const express = require('express');
const router = express.Router();
//Importing Jobs Controller

const { getJobs, newJob, updateJob, getJob, deletejob, jobStats } = require('../controllers/jobController');
//router.get('/jobs', getJobs);
router.route('/jobs').get(getJobs);
router.route('/jobs/new').post(newJob);
router.route('/job/:id').put(updateJob).delete(deletejob);
router.route('/job/:id/:slug').get(getJob);

router.route('/stats/:topic').get(jobStats);


module.exports = router;