import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema(
  {
    hero: {
      image: {
        type: String,
        required: true,
      },
      eyebrow: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      primaryButton: {
        label: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
      },
      secondaryButton: {
        label: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
      },
    },

    categories: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
      },
    ],

    campaign: {
      image: {
        type: String,
        required: true,
      },
      eyebrow: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const homepageModel = mongoose.model("homepage", homepageSchema);

export default homepageModel;