
    module.exports = function (app) {
        const modelName = "oilchangerecords";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            vehicleId: { type: Number, min: 0, max: 10000000 ,  comment: "VehicleID, p_number" },
serviceRecordId: { type: Number, min: 0, max: 10000000 ,  comment: "ServiceRecordID, p_number" },
oilType: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "OilType, p" },
mileage: { type: Number, min: 0, max: 10000000 ,  comment: "Mileage, p_number" },
technicianId: { type: Number, min: 0, max: 10000000 ,  comment: "TechnicianID, p_number" },
dateOfChange: { type: Number, min: 0, max: 10000000 ,  comment: "DateOfChange, p_number" },

            
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