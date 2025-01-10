
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
supplierName: faker.lorem.sentence(1),
contactPerson: faker.lorem.sentence(1),
phoneNumber: faker.lorem.sentence(1),
email: faker.internet.email(),
address: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
