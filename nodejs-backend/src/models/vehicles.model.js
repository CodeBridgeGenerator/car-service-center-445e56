
    module.exports = function (app) {
        const modelName = "vehicles";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            customerId: { type: Schema.Types.ObjectId, ref: "customers" ,  comment: "CustomerID, dropdown" },
make: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "Make, p" },
model: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "Model, p" },
year: { type: Number, min: 0, max: 10000000 ,  comment: "Year, p_number" },
licensePlate: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "LicensePlate, p" },
vin: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "VIN, p" },

            
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