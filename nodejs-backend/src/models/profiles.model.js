module.exports = function (app) {
    const modelName = 'profiles';
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const schema = new Schema(
        {
            name: {
                type: String,
                required: true
            },
            userId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'users'
            },
            image: {
                type: String
            },
            bio: {
                type: String,
                index: true,
                trim: true
            },
            department: { type: Schema.Types.ObjectId, ref: 'departments' },
            hod: { type: Boolean, default: false },
            section: { type: Schema.Types.ObjectId, ref: 'sections' },
            hos: { type: Boolean, default: false },
            role: { type: Schema.Types.ObjectId, ref: 'roles' },
            position: {
                type: Schema.Types.ObjectId,
                ref: 'positions'
            },
            manager: { type: Schema.Types.ObjectId, ref: 'users' },
            company: { type: Schema.Types.ObjectId, ref: 'companies' },
            branch: { type: Schema.Types.ObjectId, ref: 'branches' },
            skills: {
                type: [String]
            },
            address: { type: Schema.Types.ObjectId, ref: 'user_addresses' },
            phone: { type: Schema.Types.ObjectId, ref: 'user_phones' }
        },
        {
            timestamps: true
        }
    );

    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);
};
