
import { faker } from "@faker-js/faker";
export default (user,count,firstNameIds,phoneNumberIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
firstName: firstNameIds[i % firstNameIds.length],
lastName: faker.datatype.number(""),
email: faker.datatype.number(""),
phoneNumber: phoneNumberIds[i % phoneNumberIds.length],
address: faker.datatype.number(""),
joinDate: faker.datatype.number(""),
loyaltyPoints: faker.datatype.number(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
