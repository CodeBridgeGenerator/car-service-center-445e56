
    module.exports = function (app) {
        const modelName = "services";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            serviceName: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "ServiceName, p" },
description: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "Description, p" },
price: { type: Number, min: 0, max: 10000000 ,  comment: "Price, p_number" },
duration: { type: Number, min: 0, max: 10000000 ,  comment: "Duration, p_number" },

            
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