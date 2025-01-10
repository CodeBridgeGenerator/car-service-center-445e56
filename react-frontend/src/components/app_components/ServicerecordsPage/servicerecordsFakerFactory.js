
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
invoiceId: faker.lorem.sentence(1),
serviceId: faker.lorem.sentence(1),
vehicleId: faker.lorem.sentence(1),
technicianId: faker.lorem.sentence(1),
serviceDate: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
