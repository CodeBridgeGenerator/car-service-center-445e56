
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
vehicleId: faker.lorem.sentence(1),
serviceRecordId: faker.lorem.sentence(1),
oilType: faker.lorem.sentence(1),
mileage: faker.lorem.sentence(1),
technicianId: faker.lorem.sentence(1),
dateOfChange: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
