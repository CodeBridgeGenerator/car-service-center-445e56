
    module.exports = function (app) {
        const modelName = "customers";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            firstName: { type: Schema.Types.ObjectId, ref: "users" ,  comment: "FirstName, dropdown" },
lastName: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "LastName, p" },
email: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "Email, p" },
phoneNumber: { type: Schema.Types.ObjectId, ref: "userPhones" ,  comment: "PhoneNumber, dropdown" },
address: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true ,  comment: "Address, p" },
joinDate: { type: Number, min: 0, max: 10000000 ,  comment: "JoinDate, p_number" },
loyaltyPoints: { type: Number, min: 0, max: 10000000 ,  comment: "LoyaltyPoints, p_number" },

            
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