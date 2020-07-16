var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const jobsModel = require('../models/jobsModel');

async function findJob(jobName) {

  let jobLastRunTime = await jobsModel.findOne({ name: jobName }, function(error, data) {
		if (error) console.log(error);
		return data;
	}).lean();

  const jobTime = dayjs(jobLastRunTime.lastRunAt);
  return jobTime.fromNow();

}


module.exports = {
  findJob: findJob
}
