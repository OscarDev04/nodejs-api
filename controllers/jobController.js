const Job = require('../models/jobs');
//Get All Jobs => /api/v1/jobs
exports.getJobs =  async (req, res, next) => {
    const jobs = await Job.find();

    return res.status(200).json({
        success: true,
        message: 'Trabajos',
        results: jobs.length,
        data: jobs
    });
}

// Create a New Job => /api/v1/job/new

exports.newJob = async (req, res, next) => {
 
    const job = await Job.create(req.body);
    return res.status(200).json({
        success: true,
        message: 'Trabajo Creado',
        data: job
    });
}

// Update a Job => /api/v1/job/:id

exports.updateJob = async (req, res, next) => {
    
    let job = await Job.findById(req.params.id)
    if(!job) {
       return res.status(404).json({
            success: false,
            message: 'No se encontró el Trabajo solicitado'
        });
    };

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: 'Trabajo actualizado',
        data: job
    });
};

// GET single job with slug and id => /api/v1/job/:id/:slug
exports.getJob = async (req, res, next) => {
 
    let job = await Job.find({$and: [
        {_id: req.params.id},{slug: req.params.slug}
    ]});

    if(!job || job.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No se encontró el Trabajo solicitado'
        });
    };

    res.status(200).json({
        success: true,
        data: job
    });
}

// Delete a Job => /api/v1/job/:id

exports.deletejob = async (req, res, next) => {
 
    let job = await Job.findById(req.params.id)
    if(!job) {
       return res.status(404).json({
            success: false,
            message: 'No se encontró el Trabajo solicitado'
        });
    };

    job = await Job.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        success: true,
        message: 'Eliminado de forma correcta'
    });
}

// GET stats about a topic(job) => /api/v1/statics/jobs

exports.jobStats = async(req, res, next) => {
    const stats = await Job.aggregate([
        {
            $match: {$text: {$search: "\""+ req.params.topic + "\""}}
        },
        {
            $group: {
                _id: {$toUpper: '$experience'},
                totalJobs: {$sum: 1},
                avgPosition: {$avg: '$positions'},
                avgSalary: {$avg: '$salary'},
                minSalary: {$min: '$salary'},
                maxSalary: {$max: '$salary'}
            }
        }
    ]);

    if (stats.length === 0) {
        return res.status(404).json({
            success: false,
            message:  `No se encontraron estadisticas para - ${req.params.topic}`
        });
    }

    return res.status(200).json({
        success: true,
        data: stats
    });
}