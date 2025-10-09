import getAllUsersService from "../services/admin.service.js";
const getAllUsersController = async (req, res) => {

  try {
    const users = await getAllUsersService();
  
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default getAllUsersController;
