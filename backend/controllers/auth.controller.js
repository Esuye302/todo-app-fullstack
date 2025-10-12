import {
  registerUserService,
  loginUserService,
} from "../services/auth.service.js";

const registerController = async (req, res) => {
  try {
    const userData = req.body;

    const user = await registerUserService(userData);
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const credentials = req.body;

    const user = await loginUserService(credentials);

    res.status(200).json({
      message: user.message,
      token: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export { registerController, loginController };
