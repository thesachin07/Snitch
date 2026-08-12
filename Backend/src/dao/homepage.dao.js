import homepageModel from "../models/homepage.model.js";

export const createHomepage = async () => {
  const existingHomepage = await homepageModel.findOne();

  if (existingHomepage) {
    console.log("Homepage already exists");
    return existingHomepage;
  }

  const homepage = await homepageModel.create({
    hero: {
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=85",
      eyebrow: "THE NEW EDIT / NEW SEASON '26",
      title: "Redefining Elegance",
      primaryButton: {
        label: "SHOP NOW",
        link: "/products",
      },
      secondaryButton: {
        label: "EXPLORE NEW IN",
        link: "/products?sort=new",
      },
    },

    categories: [
      {
        name: "Men",
        description: "Precision tailoring and elevated essentials.",
        image:
          "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85",
        link: "/products?category=men",
      },
      {
        name: "Women",
        description: "Fluid silhouettes and timeless curation.",
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",
        link: "/products?category=women",
      },
      {
        name: "Kids",
        description: "Miniature classics for the next generation.",
        image:
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=85",
        link: "/products?category=kids",
      },
    ],

    campaign: {
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85",
      eyebrow: "SPRING / SUMMER '26",
      title: "The New Season",
      link: "/products?sort=new",
    },
  });

  console.log("Homepage created:", homepage._id);

  return homepage;
};