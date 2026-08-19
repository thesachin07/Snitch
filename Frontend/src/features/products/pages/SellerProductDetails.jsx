import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { useProduct } from '../hooks/useProduct';
import { useParams, useNavigate } from 'react-router';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

const CATEGORIES = ["men", "women", "kids"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

const SellerProductDetails = () => {
  const [ product, setProduct ] = useState(null);
  const [ localVariants, setLocalVariants ] = useState([]);
  const [ isAddingVariant, setIsAddingVariant ] = useState(false);
  const [ loading, setLoading ] = useState(true);

  // ── product-level edit state ──
  const [ isEditingProduct, setIsEditingProduct ] = useState(false);
  const [ productEdit, setProductEdit ] = useState(null);
  const [ productRemoveImageUrls, setProductRemoveImageUrls ] = useState([]);
  const [ productNewImages, setProductNewImages ] = useState([]);
  const [ savingProduct, setSavingProduct ] = useState(false);
  const [ deletingProduct, setDeletingProduct ] = useState(false);
  const [ confirmDeleteProduct, setConfirmDeleteProduct ] = useState(false);

  // ── variant edit state (which variant id is being edited) ──
  const [ editingVariantId, setEditingVariantId ] = useState(null);
  const [ variantEdit, setVariantEdit ] = useState(null);
  const [ variantEditAttrInputs, setVariantEditAttrInputs ] = useState([]);
  const [ variantRemoveImageUrls, setVariantRemoveImageUrls ] = useState([]);
  const [ variantNewImages, setVariantNewImages ] = useState([]);
  const [ savingVariantId, setSavingVariantId ] = useState(null);
  const [ confirmDeleteVariantId, setConfirmDeleteVariantId ] = useState(null);

  const [ attributeInputs, setAttributeInputs ] = useState([ { key: '', value: '' } ]);
  const [ newVariant, setNewVariant ] = useState({
    images: [],
    stock: 0,
    attributes: {},
    price: { amount: '', currency: 'INR' }
  });

  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    handleGetProductById,
    handleAddProductVariant,
    handleUpdateProduct,
    handleDeleteProduct,
    handleUpdateProductVariant,
    handleDeleteProductVariant,
  } = useProduct();

  async function fetchProductDetails() {
    setLoading(true);
    try {
      const data = await handleGetProductById(productId);
      const prod = data?.product || data;
      setProduct(prod);
      if (prod?.variants) setLocalVariants(prod.variants);
    } catch (error) {
      console.error("Failed to fetch product details", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [ productId ]);

  // ============ PRODUCT EDIT ============

  const startEditProduct = () => {
    setProductEdit({
      title: product.title,
      description: product.description,
      category: product.category,
      priceAmount: product.price?.amount ?? '',
      priceCurrency: product.price?.currency || 'INR',
    });
    setProductRemoveImageUrls([]);
    setProductNewImages([]);
    setIsEditingProduct(true);
  };

  const cancelEditProduct = () => {
    setIsEditingProduct(false);
    setProductEdit(null);
    setProductRemoveImageUrls([]);
    productNewImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setProductNewImages([]);
  };

  const toggleRemoveProductImage = (url) => {
    setProductRemoveImageUrls(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [ ...prev, url ]
    );
  };

  const handleProductNewImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newImgs = files.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
    setProductNewImages(prev => [ ...prev, ...newImgs ]);
    e.target.value = '';
  };

  const removeProductNewImage = (index) => {
    setProductNewImages(prev => {
      const updated = [ ...prev ];
      URL.revokeObjectURL(updated[ index ].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const saveProductEdit = async () => {
    if (!productEdit.title.trim() || !productEdit.description.trim()) {
      toast.warning("Title and description can't be empty.");
      return;
    }
    setSavingProduct(true);
    try {
      const result = await handleUpdateProduct(productId, {
        title: productEdit.title,
        description: productEdit.description,
        category: productEdit.category,
        priceAmount: productEdit.priceAmount,
        priceCurrency: productEdit.priceCurrency,
        removeImageUrls: productRemoveImageUrls,
        newImages: productNewImages.map(img => img.file),
      });

      if (result?.success) {
        toast.success("Product updated successfully");
        setProduct(result.product);
        setIsEditingProduct(false);
        productNewImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
        setProductNewImages([]);
        setProductRemoveImageUrls([]);
      } else {
        toast.error("Couldn't update product. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update product. Please try again.");
    } finally {
      setSavingProduct(false);
    }
  };

  const confirmAndDeleteProduct = async () => {
    setDeletingProduct(true);
    try {
      const result = await handleDeleteProduct(productId);
      if (result?.success) {
        toast.success("Product deleted");
        navigate('/seller/dashboard');
      } else {
        toast.error("Couldn't delete product. Please try again.");
        setDeletingProduct(false);
        setConfirmDeleteProduct(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't delete product. Please try again.");
      setDeletingProduct(false);
      setConfirmDeleteProduct(false);
    }
  };

  // ============ VARIANT: STOCK QUICK-EDIT (now actually persists) ============

  const handleStockChange = (idx, newStock) => {
    const updated = [ ...localVariants ];
    updated[ idx ] = { ...updated[ idx ], stock: newStock };
    setLocalVariants(updated);
  };

  const commitStockChange = async (variant) => {
    const result = await handleUpdateProductVariant(productId, variant._id, {
      stock: Number(variant.stock) || 0,
    });
    if (result?.success) {
      toast.success("Stock updated");
      setLocalVariants(result.product.variants);
    } else {
      toast.error("Couldn't update stock. Please try again.");
      fetchProductDetails();
    }
  };

  

  const startEditVariant = (variant) => {
    setEditingVariantId(variant._id);
    setVariantEdit({
      stock: variant.stock ?? 0,
      priceAmount: variant.price?.amount ?? '',
      priceCurrency: variant.price?.currency || product.price?.currency || 'INR',
    });
    const attrs = Object.entries(variant.attributes || {}).map(([ key, value ]) => ({ key, value }));
    setVariantEditAttrInputs(attrs.length ? attrs : [ { key: '', value: '' } ]);
    setVariantRemoveImageUrls([]);
    setVariantNewImages([]);
  };

  const cancelEditVariant = () => {
    setEditingVariantId(null);
    setVariantEdit(null);
    setVariantEditAttrInputs([]);
    setVariantRemoveImageUrls([]);
    variantNewImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setVariantNewImages([]);
  };

  const updateVariantAttrInput = (index, field, value) => {
    const updated = [ ...variantEditAttrInputs ];
    updated[ index ][ field ] = value;
    setVariantEditAttrInputs(updated);
  };

  const addVariantAttrInput = () => {
    setVariantEditAttrInputs(prev => [ ...prev, { key: '', value: '' } ]);
  };

  const removeVariantAttrInput = (index) => {
    setVariantEditAttrInputs(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRemoveVariantImage = (url) => {
    setVariantRemoveImageUrls(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [ ...prev, url ]
    );
  };

  const handleVariantNewImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newImgs = files.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
    setVariantNewImages(prev => [ ...prev, ...newImgs ]);
    e.target.value = '';
  };

  const removeVariantNewImage = (index) => {
    setVariantNewImages(prev => {
      const updated = [ ...prev ];
      URL.revokeObjectURL(updated[ index ].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const saveVariantEdit = async (variantId) => {
    const attrsObj = {};
    variantEditAttrInputs.forEach(a => {
      if (a.key.trim()) attrsObj[ a.key.trim() ] = a.value;
    });

    if (Object.keys(attrsObj).length === 0) {
      toast.warning("Variant needs at least one attribute.");
      return;
    }

    setSavingVariantId(variantId);
    try {
      const result = await handleUpdateProductVariant(productId, variantId, {
        stock: Number(variantEdit.stock) || 0,
        priceAmount: variantEdit.priceAmount,
        priceCurrency: variantEdit.priceCurrency,
        attributes: attrsObj,
        removeImageUrls: variantRemoveImageUrls,
        newImages: variantNewImages.map(img => img.file),
      });

      if (result?.success) {
        toast.success("Variant updated successfully");
        setLocalVariants(result.product.variants);
        cancelEditVariant();
      } else {
        toast.error("Couldn't update variant. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update variant. Please try again.");
    } finally {
      setSavingVariantId(null);
    }
  };

  const deleteVariant = async (variantId) => {
    try {
      const result = await handleDeleteProductVariant(productId, variantId);
      if (result?.success) {
        toast.success("Variant deleted");
        setLocalVariants(result.product.variants);
      } else {
        toast.error("Couldn't delete variant. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't delete variant. Please try again.");
    } finally {
      setConfirmDeleteVariantId(null);
    }
  };


  const handleAddNewVariant = async () => {
    const hasValidAttribute = attributeInputs.some(attr => attr.key.trim() && attr.value.trim());
    if (!hasValidAttribute) {
      toast.warning("Please add at least one valid attribute before saving.");
      return;
    }

    const cleanImages = newVariant.images.map(img => ({ url: img.previewUrl, file: img.file }));
    const cleanAttributes = { ...newVariant.attributes };

    const variantToSave = {
      images: cleanImages,
      stock: Number(newVariant.stock),
      attributes: cleanAttributes,
      price: newVariant.price.amount ? Number(newVariant.price.amount) : 0,
      currency: newVariant.price.currency || 'INR'
    };

    setIsAddingVariant(false);

    const result = await handleAddProductVariant(productId, variantToSave);

    if (result?.success) {
      toast.success("Variant added successfully");
      await fetchProductDetails();
    } else {
      toast.error("Couldn't add variant. Please try again.");
    }

    setAttributeInputs([ { key: '', value: '' } ]);
    setNewVariant({ images: [], stock: 0, attributes: {}, price: { amount: '', currency: 'INR' } });
  };

  const handleAddAttribute = () => setAttributeInputs(prev => [ ...prev, { key: '', value: '' } ]);

  const handleAttributeChange = (index, field, value) => {
    const updatedInputs = [ ...attributeInputs ];
    updatedInputs[ index ][ field ] = value;
    setAttributeInputs(updatedInputs);

    const newAttrsObj = {};
    updatedInputs.forEach(attr => {
      if (attr.key.trim() !== '') newAttrsObj[ attr.key.trim() ] = attr.value;
    });
    setNewVariant(prev => ({ ...prev, attributes: newAttrsObj }));
  };

  const handleRemoveAttribute = (index) => {
    const updatedInputs = attributeInputs.filter((_, i) => i !== index);
    setAttributeInputs(updatedInputs);

    const newAttrsObj = {};
    updatedInputs.forEach(attr => {
      if (attr.key.trim() !== '') newAttrsObj[ attr.key.trim() ] = attr.value;
    });
    setNewVariant(prev => ({ ...prev, attributes: newAttrsObj }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const availableSlots = 7 - newVariant.images.length;
    const filesToAdd = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.warning(`You can only upload up to 7 images. ${filesToAdd.length} added.`);
    }

    const newImageObjects = filesToAdd.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
    setNewVariant(prev => ({ ...prev, images: [ ...prev.images, ...newImageObjects ] }));
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = newVariant.images[ index ];
    if (imageToRemove?.previewUrl) URL.revokeObjectURL(imageToRemove.previewUrl);
    const updatedImages = newVariant.images.filter((_, i) => i !== index);
    setNewVariant(prev => ({ ...prev, images: updatedImages }));
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center text-[#1b1c1a] font-serif">Loading gallery...</div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center text-[#1b1c1a] font-serif">Product Not Found</div>;
  }

  const inputCls = "w-full bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] text-sm";

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-sans pb-24">
      <header className="sticky top-0 z-10 bg-[#fbf9f6]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl tracking-wide uppercase">{product.title?.substring(0, 20)}{product.title?.length > 20 ? '...' : ''}</h1>

        {!isEditingProduct && (
          <div className="flex items-center gap-4">
            <button
              onClick={startEditProduct}
              className="flex items-center gap-2 text-sm uppercase tracking-wider text-[#745a27] hover:text-[#5a4312] cursor-pointer"
            >
              <EditIcon /> Edit
            </button>
            <button
              onClick={() => setConfirmDeleteProduct(true)}
              className="flex items-center gap-2 text-sm uppercase tracking-wider text-[#ba1a1a] hover:text-[#8a1313] cursor-pointer"
            >
              <TrashIcon /> Delete
            </button>
          </div>
        )}
      </header>

      {/* DELETE PRODUCT CONFIRM */}
      {confirmDeleteProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white p-8 max-w-sm w-full shadow-xl">
            <h4 className="font-serif text-xl mb-3">Delete this product?</h4>
            <p className="text-sm text-[#6e6258] mb-6">This will permanently remove "{product.title}" and all its variants. This can't be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteProduct(false)}
                disabled={deletingProduct}
                className="px-5 py-2 text-sm uppercase tracking-wider text-[#6e6258] hover:text-[#1b1c1a]"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndDeleteProduct}
                disabled={deletingProduct}
                className="px-5 py-2 text-sm uppercase tracking-wider bg-[#ba1a1a] text-white hover:bg-[#8a1313] disabled:opacity-60"
              >
                {deletingProduct ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-8">

        <section className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="w-full md:w-1/2">
            <div className="w-full aspect-[4/5] bg-[#f5f3f0] overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[ 0 ].url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#7f7668]">No Image</div>
              )}
            </div>

            {isEditingProduct ? (
              <div className="mt-4">
                <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-2">Existing Images (tap to remove)</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {product.images.map((img, i) => {
                    const marked = productRemoveImageUrls.includes(img.url);
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => toggleRemoveProductImage(img.url)}
                        className="relative aspect-square bg-[#f5f3f0]"
                      >
                        <img src={img.url} alt="" className={`w-full h-full object-cover ${marked ? 'opacity-30' : ''}`} />
                        {marked && (
                          <span className="absolute inset-0 flex items-center justify-center text-[#ba1a1a] bg-white/60 text-xs uppercase tracking-wider">
                            Remove
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {productNewImages.map((img, i) => (
                    <div key={`new-${i}`} className="relative aspect-square bg-[#f5f3f0]">
                      <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeProductNewImage(i)}
                        className="absolute top-0.5 right-0.5 bg-white/80 p-1 text-[#ba1a1a]"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
                <input type="file" accept="image/*" multiple onChange={handleProductNewImages}
                  className="block w-full text-xs text-[#6e6258] file:mr-3 file:py-2 file:px-3 file:border-0 file:bg-[#f5f3f0] file:text-[#1b1c1a] file:uppercase file:text-xs file:cursor-pointer cursor-pointer" />
              </div>
            ) : (
              product.images && product.images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {product.images.slice(1).map((img, i) => (
                    <img key={i} src={img.url} alt={`Thumb ${i}`} className="w-16 h-20 object-cover bg-[#f5f3f0] shrink-0" />
                  ))}
                </div>
              )
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            {isEditingProduct ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-1">Title</label>
                  <input className={inputCls} value={productEdit.title}
                    onChange={(e) => setProductEdit({ ...productEdit, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-1">Description</label>
                  <textarea className={inputCls} rows={4} value={productEdit.description}
                    onChange={(e) => setProductEdit({ ...productEdit, description: e.target.value })} />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-1">Category</label>
                    <select className={inputCls} value={productEdit.category}
                      onChange={(e) => setProductEdit({ ...productEdit, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="w-1/4">
                    <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-1">Price</label>
                    <input type="number" className={inputCls} value={productEdit.priceAmount}
                      onChange={(e) => setProductEdit({ ...productEdit, priceAmount: e.target.value })} />
                  </div>
                  <div className="w-1/4">
                    <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-1">Currency</label>
                    <select className={inputCls} value={productEdit.priceCurrency}
                      onChange={(e) => setProductEdit({ ...productEdit, priceCurrency: e.target.value })}>
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveProductEdit}
                    disabled={savingProduct}
                    className="bg-[#745a27] text-white px-6 py-3 uppercase tracking-wider text-sm hover:bg-[#5a4312] disabled:opacity-60 cursor-pointer"
                  >
                    {savingProduct ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={cancelEditProduct}
                    disabled={savingProduct}
                    className="text-[#6e6258] px-6 py-3 uppercase tracking-wider text-sm hover:text-[#1b1c1a] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-4 uppercase">{product.title}</h2>
                <p className="text-[#6e6258] text-lg mb-2 leading-relaxed max-w-md">{product.description}</p>
                <p className="text-xs uppercase tracking-wider text-[#a8a094] mb-6">{product.category}</p>
                <div className="text-2xl tracking-wide font-light mb-8">
                  {product.price?.amount} {product.price?.currency}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="bg-[#f5f3f0] p-6 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <h3 className="font-serif text-3xl uppercase">Variants & Inventory</h3>
            {!isAddingVariant && (
              <button
                onClick={() => setIsAddingVariant(true)}
                className="bg-[#745a27] text-[#ffffff] px-6 py-3 uppercase tracking-wider text-sm hover:bg-[#5a4312] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlusIcon /> Add New Variant
              </button>
            )}
          </div>

          {isAddingVariant && (
            <div className="bg-[#ffffff] p-6 md:p-8 mb-12 shadow-[0_20px_40px_rgba(27,28,26,0.04)]">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-serif text-xl uppercase">Create Variant</h4>
                <button onClick={() => setIsAddingVariant(false)} className="text-[#7f7668] hover:text-[#1b1c1a] text-sm uppercase tracking-wider cursor-pointer">
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-[#6e6258] mb-3">Attributes (e.g. Size, Color) *</label>
                    <div className="space-y-3">
                      {attributeInputs.map((attr, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input type="text" placeholder="Key (e.g., Size)" value={attr.key}
                            onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                            className="w-1/2 bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5]" />
                          <input type="text" placeholder="Value (e.g., M)" value={attr.value}
                            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                            className="w-1/2 bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5]" />
                          {attributeInputs.length > 1 && (
                            <button onClick={() => handleRemoveAttribute(index)} className="text-[#ba1a1a] p-2 hover:bg-[#ffdad6] transition-colors cursor-pointer">
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button onClick={handleAddAttribute} className="mt-3 text-[#745a27] text-sm uppercase tracking-wider flex items-center gap-1 hover:text-[#5a4312] cursor-pointer">
                      <PlusIcon /> Add Attribute
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm uppercase tracking-wider text-[#6e6258] mb-2">Initial Stock</label>
                      <input type="number" value={newVariant.stock}
                        onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                        className="w-full bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27]" />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm uppercase tracking-wider text-[#6e6258] mb-2">Price Amount (Optional)</label>
                      <input type="number" value={newVariant.price.amount}
                        onChange={(e) => setNewVariant({ ...newVariant, price: { ...newVariant.price, amount: e.target.value } })}
                        placeholder="Default if empty"
                        className="w-full bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5]" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-sm uppercase tracking-wider text-[#6e6258]">Image Upload (Max 7, Optional)</label>
                    <span className="text-xs text-[#7f7668]">{newVariant.images.length}/7</span>
                  </div>

                  {newVariant.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {newVariant.images.map((img, index) => (
                        <div key={index} className="relative aspect-[4/5] bg-[#f5f3f0]">
                          <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-white/80 p-1 text-[#ba1a1a] hover:bg-white transition-colors cursor-pointer">
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {newVariant.images.length < 7 && (
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload}
                      className="block w-full text-sm text-[#6e6258]
                        file:mr-4 file:py-2 file:px-4
                        file:border-0 file:bg-[#f5f3f0] file:text-[#1b1c1a]
                        hover:file:bg-[#e4e2df] file:cursor-pointer file:uppercase file:text-xs file:tracking-wider file:font-serif
                        cursor-pointer" />
                  )}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button onClick={handleAddNewVariant} className="bg-gradient-to-r from-[#745a27] to-[#c9a96e] text-[#ffffff] px-8 py-3 uppercase tracking-wider text-sm hover:opacity-90 transition-opacity cursor-pointer">
                  Save Variant
                </button>
              </div>
            </div>
          )}

          {localVariants.length === 0 ? (
            <div className="py-12 text-center text-[#6e6258]">
              <p>No variants have been created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {localVariants.map((variant) => {
                const isEditingThis = editingVariantId === variant._id;

                return (
                  <div key={variant._id} className="bg-[#ffffff] flex flex-col pt-4 shadow-[0_20px_40px_rgba(27,28,26,0.02)]">

                    {!isEditingThis ? (
                      <>
                        <div className="px-6 flex gap-4 h-24 mb-4">
                          <div className="w-16 h-20 bg-[#f5f3f0] shrink-0">
                            {variant.images && variant.images.length > 0 ? (
                              <img src={variant.images[ 0 ].url} alt="Variant" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-[#7f7668]">N/A</div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {Object.entries(variant.attributes || {}).map(([ key, val ]) => (
                                <span key={key} className="bg-[#f5f3f0] px-2 py-1 text-xs uppercase tracking-wider text-[#4d463a]">
                                  <span className="text-[#a8a094]">{key}:</span> {val}
                                </span>
                              ))}
                            </div>
                            <div className="text-sm font-light">
                              {variant.price?.amount ? `${variant.price.amount} ${variant.price.currency}` : 'Base Price'}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 items-end shrink-0">
                            <button onClick={() => startEditVariant(variant)} className="text-[#745a27] hover:text-[#5a4312] cursor-pointer" aria-label="Edit variant">
                              <EditIcon />
                            </button>
                            <button onClick={() => setConfirmDeleteVariantId(variant._id)} className="text-[#ba1a1a] hover:text-[#8a1313] cursor-pointer" aria-label="Delete variant">
                              <TrashIcon />
                            </button>
                          </div>
                        </div>

                        <div className="mt-auto border-t border-[#f5f3f0] bg-[#fbf9f6] flex items-center px-6 py-3 justify-between">
                          <label className="text-sm text-[#6e6258] uppercase tracking-wider">Current Stock</label>
                          <input
                            type="number"
                            value={variant.stock || 0}
                            onChange={(e) => handleStockChange(localVariants.indexOf(variant), e.target.value)}
                            onBlur={() => commitStockChange(variant)}
                            className="w-20 bg-transparent border-b border-[#d0c5b5] py-1 text-right focus:outline-none focus:border-[#745a27] font-serif text-lg"
                          />
                        </div>

                        {confirmDeleteVariantId === variant._id && (
                          <div className="px-6 pb-4 pt-2 bg-[#fff5f4] border-t border-[#ffdad6]">
                            <p className="text-xs text-[#7a2d2d] mb-3">Delete this variant? This can't be undone.</p>
                            <div className="flex gap-3">
                              <button onClick={() => deleteVariant(variant._id)} className="text-xs uppercase tracking-wider bg-[#ba1a1a] text-white px-4 py-2 cursor-pointer">
                                Yes, Delete
                              </button>
                              <button onClick={() => setConfirmDeleteVariantId(null)} className="text-xs uppercase tracking-wider text-[#6e6258] px-4 py-2 cursor-pointer">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="px-6 pb-6">
                        <h5 className="font-serif text-lg uppercase mb-4">Edit Variant</h5>

                        <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-2">Attributes</label>
                        <div className="space-y-2 mb-4">
                          {variantEditAttrInputs.map((attr, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <input placeholder="Key" value={attr.key} onChange={(e) => updateVariantAttrInput(i, 'key', e.target.value)} className={inputCls} />
                              <input placeholder="Value" value={attr.value} onChange={(e) => updateVariantAttrInput(i, 'value', e.target.value)} className={inputCls} />
                              {variantEditAttrInputs.length > 1 && (
                                <button onClick={() => removeVariantAttrInput(i)} className="text-[#ba1a1a] p-1 cursor-pointer"><TrashIcon /></button>
                              )}
                            </div>
                          ))}
                          <button onClick={addVariantAttrInput} className="text-[#745a27] text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                            <PlusIcon /> Add Attribute
                          </button>
                        </div>

                        <div className="flex gap-3 mb-4">
                          <div className="w-1/3">
                            <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-1">Stock</label>
                            <input type="number" className={inputCls} value={variantEdit.stock}
                              onChange={(e) => setVariantEdit({ ...variantEdit, stock: e.target.value })} />
                          </div>
                          <div className="w-1/3">
                            <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-1">Price</label>
                            <input type="number" className={inputCls} value={variantEdit.priceAmount}
                              onChange={(e) => setVariantEdit({ ...variantEdit, priceAmount: e.target.value })} />
                          </div>
                          <div className="w-1/3">
                            <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-1">Currency</label>
                            <select className={inputCls} value={variantEdit.priceCurrency}
                              onChange={(e) => setVariantEdit({ ...variantEdit, priceCurrency: e.target.value })}>
                              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>

                        <label className="block text-xs uppercase tracking-wider text-[#6e6258] mb-2">Images (tap existing to remove)</label>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          {(variant.images || []).map((img, i) => {
                            const marked = variantRemoveImageUrls.includes(img.url);
                            return (
                              <button type="button" key={i} onClick={() => toggleRemoveVariantImage(img.url)} className="relative aspect-square bg-[#f5f3f0]">
                                <img src={img.url} alt="" className={`w-full h-full object-cover ${marked ? 'opacity-30' : ''}`} />
                                {marked && <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[#ba1a1a] bg-white/60">Remove</span>}
                              </button>
                            );
                          })}
                          {variantNewImages.map((img, i) => (
                            <div key={`new-${i}`} className="relative aspect-square bg-[#f5f3f0]">
                              <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                              <button onClick={() => removeVariantNewImage(i)} className="absolute top-0.5 right-0.5 bg-white/80 p-0.5 text-[#ba1a1a]"><TrashIcon /></button>
                            </div>
                          ))}
                        </div>
                        <input type="file" accept="image/*" multiple onChange={handleVariantNewImages}
                          className="block w-full text-xs text-[#6e6258] mb-5 file:mr-3 file:py-2 file:px-3 file:border-0 file:bg-[#f5f3f0] file:text-[#1b1c1a] file:uppercase file:text-xs file:cursor-pointer cursor-pointer" />

                        <div className="flex gap-3">
                          <button onClick={() => saveVariantEdit(variant._id)} disabled={savingVariantId === variant._id}
                            className="bg-[#745a27] text-white px-5 py-2 text-sm uppercase tracking-wider hover:bg-[#5a4312] disabled:opacity-60 cursor-pointer">
                            {savingVariantId === variant._id ? "Saving..." : "Save"}
                          </button>
                          <button onClick={cancelEditVariant} className="text-[#6e6258] px-5 py-2 text-sm uppercase tracking-wider hover:text-[#1b1c1a] cursor-pointer">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default SellerProductDetails