
    module.exports = function (app) {
        const modelName = "servicerecords";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            invoiceId: { type: Number, min: 0, max: 10000000 ,  comment: "InvoiceID, p_number" },
serviceId: { type: Number, min: 0, max: 10000000 ,  comment: "ServiceID, p_number" },
vehicleId: { type: Number, min: 0, max: 10000000 ,  comment: "VehicleID, p_number" },
technicianId: { type: Number, min: 0, max: 10000000 ,  comment: "TechnicianID, p_number" },
serviceDate: { type: Number, min: 0, max: 10000000 ,  comment: "ServiceDate, p_number" },

            
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