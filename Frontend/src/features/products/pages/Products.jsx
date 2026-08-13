import { useEffect } from "react";
import { useSearchParams } from "react-router";
import useAppStore from "../../../app/app.store";
import { useProduct } from "../hooks/useProduct";
import ProductCard from "../Components/ProductCard";

const Products = () => {

    const [searchParams] = useSearchParams();

    const category = searchParams.get("category");

    const products = useAppStore((state) => state.products);

    const { handleGetAllProducts } = useProduct();

    useEffect(() => {
        handleGetAllProducts(category);
    }, [category]);

   return (
    <>
  <main className="min-h-screen bg-[#fbf9f6] px-6 md:px-10 lg:px-16 xl:px-24 py-10">
    {products.length > 0 ? (
    
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {products.map((product) => (
               <ProductCard key={product._id} product={product} />
           ))}
       </div>
       ) : (
  <div className="py-20 text-center text-sm text-[#7A6E63]">
    No products available.
    </div>
    )}
   
  </main>
    </>
   )
}
   
 

export default Products;