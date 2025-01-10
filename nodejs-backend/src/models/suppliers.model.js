
    module.exports = function (app) {
        const modelName = "suppliers";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            supplierName: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "SupplierName, p" },
contactPerson: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "ContactPerson, p" },
phoneNumber: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "PhoneNumber, p" },
email: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "Email, p" },
address: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "Address, p" },

            
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