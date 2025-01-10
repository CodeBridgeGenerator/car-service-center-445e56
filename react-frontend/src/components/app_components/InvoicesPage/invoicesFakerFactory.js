
import { faker } from "@faker-js/faker";
export default (user,count,customerIdIds,vehicleIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
customerId: customerIdIds[i % customerIdIds.length],
vehicleId: vehicleIdIds[i % vehicleIdIds.length],
serviceDate: faker.lorem.sentence(""),
totalAmount: faker.lorem.sentence(""),
paymentStatus: faker.lorem.sentence(""),
paymentMethod: faker.lorem.sentence(""),
notes: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
