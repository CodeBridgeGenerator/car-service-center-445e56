
    module.exports = function (app) {
        const modelName = "invoices";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            customerId: { type: Schema.Types.ObjectId, ref: "customers" ,  comment: "CustomerID, dropdown" },
vehicleId: { type: Schema.Types.ObjectId, ref: "vehicles" ,  comment: "VehicleID, dropdown" },
serviceDate: { type: Number, min: 0, max: 10000000 ,  comment: "ServiceDate, p_number" },
totalAmount: { type: Number, min: 0, max: 10000000 ,  comment: "TotalAmount, p_number" },
paymentStatus: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "PaymentStatus, p" },
paymentMethod: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "PaymentMethod, p" },
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