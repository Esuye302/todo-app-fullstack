import query from "../config/db.js";
const getAllUsersService = async () => {
  const users = await query("SELECT id, email, role FROM users");
  return users;
};
export default getAllUsersService;
