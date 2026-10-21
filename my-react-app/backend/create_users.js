const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config.env") });
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");
const Department = require("./src/models/Department");

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas.");

    // Check departments
    const depts = await Department.find();
    console.log("Found departments count: " + depts.length);
    const itDept = depts.find(d => d.name === "Information Technology") || depts[0];
    const deptName = itDept ? itDept.name : "Information Technology";

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const studentPass = await bcrypt.hash("student123", salt);
    const staffPass = await bcrypt.hash("staff123", salt);
    const adminPass = await bcrypt.hash("admin123", salt);

    // 1. Student
    let student = await User.findOneAndUpdate(
      { email: "student@campus.com" },
      {
        name: "Rahul Sharma (Student)",
        email: "student@campus.com",
        password: studentPass,
        role: "student",
        mobile: "9876543210",
        department: deptName
      },
      { upsert: true, new: true }
    );
    console.log("Student User Ready: " + student.email);

    // 2. Staff
    let staff = await User.findOneAndUpdate(
      { email: "staff@campus.com" },
      {
        name: "Priya Verma (Staff)",
        email: "staff@campus.com",
        password: staffPass,
        role: "staff",
        mobile: "9876543211",
        department: deptName
      },
      { upsert: true, new: true }
    );
    console.log("Staff User Ready: " + staff.email);

    // 3. Admin
    let admin = await User.findOneAndUpdate(
      { email: "admin@campus.com" },
      {
        name: "System Administrator",
        email: "admin@campus.com",
        password: adminPass,
        role: "admin",
        mobile: "9876543212",
        department: "Administration"
      },
      { upsert: true, new: true }
    );
    console.log("Admin User Ready: " + admin.email);

    console.log("\n--- ALL THREE USERS SUCCESSFULLY CREATED / READY ---");
    process.exit(0);
  } catch (error) {
    console.error("Error creating users:", error);
    process.exit(1);
  }
}

seedUsers();
