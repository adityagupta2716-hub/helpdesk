const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const readline = require("readline/promises");
const { stdin, stdout } = require("process");

dotenv.config({ path: "./config.env" });

const User = require("./src/models/User");

async function createAdmin() {
    const rl = readline.createInterface({
        input: stdin,
        output: stdout
    });

    try {
        const name = (await rl.question("Admin name: ")).trim();
        const email = (await rl.question("Admin email: "))
            .trim()
            .toLowerCase();
        const mobile = (await rl.question("10-digit mobile number: "))
            .trim();
        const password = await rl.question("New admin password: ");

        if (!name || !email || !/^[0-9]{10}$/.test(mobile)) {
            throw new Error("Invalid name, email, or mobile number.");
        }

        if (password.length < 6) {
            throw new Error("Password must contain at least 6 characters.");
        }

        await mongoose.connect(process.env.MONGO_URI);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error(
                "An account with this email already exists. No changes made."
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,
            email,
            mobile,
            password: hashedPassword,
            role: "admin",
            status: "active",
            mustChangePassword: false
        });

        console.log("\nAdmin account created successfully.");
        console.log("Name:", admin.name);
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);
        console.log("ID:", admin._id.toString());
    } catch (error) {
        console.error("\nFailed to create admin:", error.message);
        process.exitCode = 1;
    } finally {
        rl.close();
        await mongoose.disconnect().catch(() => {});
    }
}

createAdmin();
