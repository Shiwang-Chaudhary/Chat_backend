const User = require("../modles/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER API
const register = async (req, res) => {

    console.log("REGISTER API HIT ✅✅");

    try {
        const { name, email, password } = req.body;

        const exisitingUser = await User.findOne({ email });

        if (exisitingUser) {
            return res.status(400).json({ message: "User already exist." });
        }
        //const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,
            email,
            password
            //: hashedPassword 
        });

        res.status(201).json({ message: "User created successfully.✅✅", user: { id: user._id, name: user.name, email: user.email } });

        console.log("User created successfully.✅✅:", user.email);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong.❌❌" });
        console.error("Registration error:", error);
    }

}
const login = async (req, res) => {

    console.log("LOGIN API HIT ✅✅");

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User does not exist.❌❌" });
        }
        //const passMatched = bcrypt.compare(password, user.password);
        const passMatched = password == user.password;

        if (!passMatched) {
            return res.status(400).json({ message: "Invalid credentials.❌❌" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1m" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

        console.log("User logged in:", user.email);

    } catch (error) {
        res.status(500).json({ message: "Something went wrong.❌❌" });
        console.error("Login error:", error);
    }

}

module.exports = { register, login };