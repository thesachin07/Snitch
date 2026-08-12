import homepageModel from "../models/homepage.model.js";

export const getHomepage = async (req, res) => {
  try {
    const homepage = await homepageModel.findOne();

    if (!homepage) {
      return res.status(404).json({
        message: "Homepage content not found",
      });
    }

    res.status(200).json(homepage);
  } catch (error) {
    console.error("Get homepage error:", error);

    res.status(500).json({
      message: "Failed to fetch homepage",
    });
  }
};