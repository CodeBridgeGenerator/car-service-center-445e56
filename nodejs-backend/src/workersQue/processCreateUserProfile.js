const { Queue, Worker } = require('bullmq');
const connection = require('../services/redis/config');
const jobQueue = new Queue('createUserProfile', { connection });

const createUserProfileInDB = async (superAdmin, data) => {
    const _profile = {
        name: data.name,
        userId: data._id
    };

    if (superAdmin === data.email) {
        const userAdminRole = await app.service('roles').find({
            query: {
                name: 'Super'
            }
        });
        _profile['role'] = userAdminRole.data[0]._id;
        const userAdminPosition = await app.service('positions').find({
            query: {
                name: 'Admin'
            }
        });
        _profile['position'] = userAdminPosition.data[0]._id;
    } else {
        const userInvite = await app.service('userInvites').find({
            query: {
                emailToInvite: data.email
            }
        });
        console.debug(userInvite);

        const userRole = await app.service('roles').find({
            query: {
                status: true
            }
        });
        console.debug(userRole);
        const userPosition = await app.service('positions').find({
            query: {
                status: true
            }
        });
        console.debug(userPosition);
        if (userInvite.data.length > 0) {
            // custom role and position
            _profile['role'] = userInvite.data[0].role ?? userRole[0]._id;
            _profile['position'] =
                userInvite.data[0].position ?? userPosition[0]._id;
        } else {
            _profile['role'] = userRole[0]._id;
            _profile['position'] = userPosition[0]._id;
        }
    }

    await app.service('profiles').create(_profile);
};

// Create and export the worker
const createUserProfile = (app) => {
    const superAdmin = 'kana@cloudbasha.com';
    const worker = new Worker(
        'createUserProfile',
        async (job) => {
            const { data } = job;
            if (Array.isArray(data)) {
                data.forEach(
                    async (data) =>
                        await createUserProfileInDB(superAdmin, data)
                );
            } else await createUserProfileInDB(superAdmin, data);
        },
        { connection }
    );

    // Event listeners for worker
    worker.on('completed', (job) => {
        console.debug(`Job createUserProfile ${job.id} completed successfully`);
        if (job.data) {
            if (Array.isArray(job.data)) {
                job.data.forEach((data) => {
                    const _mail = {
                        name: 'on_new_user_welcome_email',
                        type: 'firstimelogin',
                        from: 'admin@cloudbasha.com',
                        recipients: [data.email],
                        data: {
                            name: data.name,
                            projectLabel:
                                process.env.PROJECT_LABEL ??
                                process.env.PROJECT_NAME
                        },
                        status: true,
                        subject: 'First Time Login',
                        templateId: 'onWelcomeEmail'
                    };
                    app.service('mailQues').create(_mail);
                });
            } else {
                const _mail = {
                    name: 'on_new_user_welcome_email',
                    type: 'firstimelogin',
                    from: 'admin@cloudbasha.com',
                    recipients: [job.data.email],
                    data: {
                        name: job.data.name,
                        projectLabel:
                            process.env.PROJECT_LABEL ??
                            process.env.PROJECT_NAME
                    },
                    status: true,
                    subject: 'First Time Login',
                    templateId: 'onWelcomeEmail'
                };
                app.service('mailQues').create(_mail);
            }
        } else {
            console.debug(`Job error and ${job.data} data not found`);
        }
    });

    worker.on('failed', async (job, err) => {
        console.error(
            `Job createUserProfile ${job.id} failed with error ${err.message}`
        );
        if (job.data) {
            if (Array.isArray(job.data)) {
                job.data.forEach((data) => {
                    const _mail = {
                        name: 'on_send_welcome_email',
                        type: 'userInvitationOnCreateOnLoginQues',
                        from: 'info@cloudbasha.com',
                        recipients: [superAdmin],
                        status: false,
                        data: {
                            ...data,
                            projectLabel:
                                process.env.PROJECT_LABEL ??
                                process.env.PROJECT_NAME
                        },
                        subject: 'login processing failed',
                        templateId: 'onError',
                        errorMessage: err.message
                    };
                    app.service('mailQues').create(_mail);
                });
            } else {
                const _mail = {
                    name: 'on_send_welcome_email',
                    type: 'userInvitationOnCreateOnLoginQues',
                    from: 'info@cloudbasha.com',
                    recipients: [superAdmin],
                    status: false,
                    data: {
                        ...job.data,
                        projectLabel:
                            process.env.PROJECT_LABEL ??
                            process.env.PROJECT_NAME
                    },
                    subject: 'login processing failed',
                    templateId: 'onError',
                    errorMessage: err.message
                };
                app.service('mailQues').create(_mail);
            }
        } else {
            console.error(`Job error and ${job.data} data not found`);
        }
        if (err.message === 'job stalled more than allowable limit') {
            await job.remove().catch((err) => {
                console.error(
                    `jobId: ${job.id} ,  remove error : ${err.message} , ${err.stack}`
                );
            });
        }
    });

    const userService = app.service('users');
    userService.hooks({
        after: {
            create: async (context) => {
                const { result } = context;
                if (typeof result.hook === 'undefined')
                    await jobQueue.add('createUserProfile', result);
                return context;
            }
        }
    });
};

module.exports = { createUserProfile };
