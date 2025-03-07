import User from "../modules/user/user.model";
import { USER_ROLE, USER_STATUS } from "../constants/constants.global";

const adminUser = {
    name: "Rakib Hasan",
    email: "hasanbappi@gmail.com",
    phoneNumber: "01751398320",
    password: "abc123$",
    needsPasswordChange: false,
    role: USER_ROLE.admin,
    status: USER_STATUS.active,
    isDeleted: false,
};

const seedAdmin = async () => {
    try {
        const isAdminExist = await User.findOne({ role: USER_ROLE.admin });

        if (!isAdminExist) {
            await User.create(adminUser);

            console.log("Admin user created successfully.");
        } else {
            console.log("Admin user already exists.");
        }
    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
};

export default seedAdmin;
