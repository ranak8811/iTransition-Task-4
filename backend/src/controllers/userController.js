import prisma from "../config/db.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        lastLoginTime: "desc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        lastLoginTime: true,
        createdAt: true,
      },
    });

    return res.json({ status: "success", users });
  } catch (error) {
    console.error("Get Users Error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to fetch users." });
  }
};

export const blockUsers = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "No user IDs provided" });
  }

  try {
    await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { status: "blocked" },
    });

    return res.json({
      status: "success",
      message: "Selected users blocked successfully",
    });
  } catch (error) {
    console.error("Block Users Error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to block users." });
  }
};

export const unblockUsers = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "No user IDs provided" });
  }

  try {
    await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { status: "active" },
    });

    return res.json({
      status: "success",
      message: "Selected users unblocked successfully.",
    });
  } catch (error) {
    console.error("Unblock Users Error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to unblock users." });
  }
};


export const deleteUsers = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "No user IDs provided." });
  }

  try {
    await prisma.user.deleteMany({
      where: { id: { in: ids } },
    });

    return res.json({
      status: "success",
      message: "Selected users deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Users Error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to delete users." });
  }
};

export const deleteUnverifiedUsers = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "No user IDs provided." });
  }

  try {
    await prisma.user.deleteMany({
      where: {
        id: { in: ids },
        status: "unverified",
      },
    });

    return res.json({
      status: "success",
      message: "Selected unverified users deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Unverified Error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to delete unverified users." });
  }
};
