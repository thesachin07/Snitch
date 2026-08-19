import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function createProduct(req, res) {

    const { title, description, category, priceAmount, priceCurrency, isFeatured} = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
        
    }))


    const product = await productModel.create({
        title,
        category,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id,
        isFeatured: isFeatured === "true" || isFeatured === true  
    })


    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    })
}

export async function getSellerProducts(req, res) {
    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });


    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getAllProducts(req, res) {
  const { category, featured } = req.body ?? {};  
  const { category: cat, featured: feat } = req.query;

  const filter = {};
  if (cat) filter.category = cat;
  if (feat === "true") filter.isFeatured = true;

  const products = await productModel.find(filter);

  return res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
}

 export async function getProductDetails(req, res){
       const { id } = req.params;
       const product = await productModel.findById(id)

       if(!product) {
        return res.status(400).json({
            message: "Product not found",
            success: false
        })
       }
       return res.status(200).json({
        message: "Product details fetched successfully",
        success: true,
        product
       })
    }

 export async function addProductVariant(req, res){


        const productId = req.params.productId;
        const product = await productModel.findOne({
            _id: productId,
            seller: req.user._id
        });

        if(!product){
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }

        const files = req.files;
        const images = []
        if(files && files.length > 0){
            (await Promise.all(files.map(async (file) => {
                const image = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                })
                
                return image
            }))).map(image => images.push(image))
        }
        const price = req.body.priceAmount
        const stock = req.body.stock
        const attributes = JSON.parse(req.body.attributes || "{}")
   
    // console.log(price)

    product.variants.push({
        images,
        price: {
            amount: Number(price) || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
    })

    await product.save();

    return res.status(200).json({
        message: "Product variant added successfully",
        success: true,
        product
    })

}

export async function updateProduct(req, res) {
  const { productId } = req.params;
  const { title, description, category, priceAmount, priceCurrency, removeImageUrls } = req.body;

  const product = await productModel.findOne({ _id: productId, seller: req.user._id });

  if (!product) {
    return res.status(404).json({ message: "Product not found", success: false });
  }

  if (title !== undefined) product.title = title;
  if (description !== undefined) product.description = description;
  if (category !== undefined) product.category = category;
  if (priceAmount !== undefined) product.price.amount = Number(priceAmount);
  if (priceCurrency !== undefined) product.price.currency = priceCurrency;

  // remove selected existing images
  if (removeImageUrls) {
    const toRemove = JSON.parse(removeImageUrls);
    product.images = product.images.filter((img) => !toRemove.includes(img.url));
  }

  // add newly uploaded images
  if (req.files && req.files.length > 0) {
    const uploaded = await Promise.all(
      req.files.map((file) => uploadFile({ buffer: file.buffer, fileName: file.originalname }))
    );
    product.images.push(...uploaded);
  }

  await product.save();

  return res.status(200).json({
    message: "Product updated successfully",
    success: true,
    product,
  });
}

export async function deleteProduct(req, res) {
  const { productId } = req.params;

  const product = await productModel.findOneAndDelete({ _id: productId, seller: req.user._id });

  if (!product) {
    return res.status(404).json({ message: "Product not found", success: false });
  }

  return res.status(200).json({
    message: "Product deleted successfully",
    success: true,
  });
}

export async function updateProductVariant(req, res) {
  const { productId, variantId } = req.params;
  const { stock, priceAmount, priceCurrency, attributes, removeImageUrls } = req.body;

  const product = await productModel.findOne({ _id: productId, seller: req.user._id });

  if (!product) {
    return res.status(404).json({ message: "Product not found", success: false });
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    return res.status(404).json({ message: "Variant not found", success: false });
  }

  if (stock !== undefined) variant.stock = Number(stock);

  if (priceAmount !== undefined) {
    variant.price = {
      amount: Number(priceAmount),
      currency: priceCurrency || variant.price?.currency || product.price.currency,
    };
  }

  if (attributes !== undefined) {
    variant.attributes = JSON.parse(attributes);
  }

  if (removeImageUrls) {
    const toRemove = JSON.parse(removeImageUrls);
    variant.images = variant.images.filter((img) => !toRemove.includes(img.url));
  }

  if (req.files && req.files.length > 0) {
    const uploaded = await Promise.all(
      req.files.map((file) => uploadFile({ buffer: file.buffer, fileName: file.originalname }))
    );
    variant.images.push(...uploaded);
  }

  await product.save();

  return res.status(200).json({
    message: "Variant updated successfully",
    success: true,
    product,
  });
}

export async function deleteProductVariant(req, res) {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({ _id: productId, seller: req.user._id });

  if (!product) {
    return res.status(404).json({ message: "Product not found", success: false });
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    return res.status(404).json({ message: "Variant not found", success: false });
  }

  product.variants.pull({ _id: variantId });
  await product.save();

  return res.status(200).json({
    message: "Variant deleted successfully",
    success: true,
    product,
  });
}