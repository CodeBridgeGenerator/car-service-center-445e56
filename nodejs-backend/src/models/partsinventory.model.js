
    module.exports = function (app) {
        const modelName = "partsinventory";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            partName: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "PartName, p" },
description: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "Description, p" },
quantityInStock: { type: Number, min: 0, max: 10000000 ,  comment: "QuantityInStock, p_number" },
price: { type: Number, min: 0, max: 10000000 ,  comment: "Price, p_number" },
supplierId: { type: Number, min: 0, max: 10000000 ,  comment: "SupplierID, p_number" },

            
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