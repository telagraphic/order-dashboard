const mongoose = require('mongoose');

let jobSchema = new mongoose.Schema({
    account: String,
    job_number: String,
    title: String,
    location: String,
    wanted_date: String,
    proof_date: String,
    taken_by: String,
    sales_rep: String
});

let Job = mongoose.model('Job', jobSchema);

module.exports = Job;
