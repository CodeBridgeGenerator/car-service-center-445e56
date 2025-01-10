
    module.exports = function (app) {
        const modelName = "maintenanceschedules";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            vehicleId: { type: Number, min: 0, max: 10000000 ,  comment: "VehicleID, p_number" },
serviceId: { type: Number, min: 0, max: 10000000 ,  comment: "ServiceID, p_number" },
nextServiceDate: { type: Number, min: 0, max: 10000000 ,  comment: "NextServiceDate, p_number" },
notes: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "Notes, p" },

            
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