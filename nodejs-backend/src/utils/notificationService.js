const { forEach } = require('lodash');

module.exports = {
    after: {
        create(context) {
            createNotification(context, 'created', context.result);
            return context;
        },
        update(context) {
            createNotification(context, 'updated', context.result);
            return context;
        },
        patch(context) {
            createNotification(context, 'updated', context.result);
            return context;
        },
        remove(context) {
            createNotification(context, 'removed', context.result);
            return context;
        }
    }
};

function createNotification(context, action, result = null) {
    const { app, method, path, data } = context;
    const { user } = result;

    if (
        context.path === 'notifications' ||
        context.path === 'authentication' ||
        context.path === 'audits' ||
        context.path === 'loginHistory'
    ) {
        return context;
    }

    const userId = user ? user._id : 'unknown';
    if (Array.isArray(data)) {
        data.forEach((data) => {
            const notificationData = {
                toUser: userId,
                content: `${context.path} with id ${data._id} was ${action}`,
                read: false,
                sent: new Date(),
                method,
                createdBy:
                    user && typeof user._id !== 'undefined' ? user._id : null,
                updatedBy:
                    user && typeof user._id !== 'undefined' ? user._id : null,
                path,
                data: data || result || {},
                recordId: result._id
            };

            if (userId != 'unknown')
                app.service('notifications').create(notificationData);
        });
    } else {
        const notificationData = {
            toUser: userId,
            content: `${context.path} with id ${data._id} was ${action}`,
            read: false,
            sent: new Date(),
            method,
            createdBy:
                user && typeof user._id !== 'undefined' ? user._id : null,
            updatedBy:
                user && typeof user._id !== 'undefined' ? user._id : null,
            path,
            data: data || result || {},
            recordId: result._id
        };

        if (userId != 'unknown')
            app.service('notifications').create(notificationData);
    }

    return context;
}
