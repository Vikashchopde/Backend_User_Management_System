import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET Single user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all users (Admin / Manager)
export const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const role = req.query.role;
    const status = req.query.status;

    // 🔍 Build query object
    let query = {};

    // Search by name OR email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by active/inactive
    if (status !== undefined) {
      query.isActive = status === "true";
    }

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(query);

    res.json({
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE user (Admin only)
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
   createdBy: req.user._id 
  });

  res.status(201).json(user);
};

// UPDATE user
export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.updatedBy = req.user._id;

  await user.save();

  res.json(user);
};

// DELETE (soft delete)
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.isActive = false;
  await user.save();

  res.json({ message: "User deactivated" });
};

// GET PROFILE
export const getProfile = async (req, res) => {
  res.json(req.user);
};