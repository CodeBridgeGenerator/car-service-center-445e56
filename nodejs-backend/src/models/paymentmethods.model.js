
    module.exports = function (app) {
        const modelName = "paymentmethods";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            methodName: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "MethodName, p" },
description: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "Description, p" },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };