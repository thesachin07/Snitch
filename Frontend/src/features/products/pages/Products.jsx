import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useProduct } from "../hooks/useProduct";
import ProductCard from "../Components/ProductCard";
import Pagination from "../Components/Pagination";

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page")) || 1;
    const category = searchParams.get("category") || undefined;
    const sort = searchParams.get("sort") || undefined;

    const {
        products,
        pagination,
        productsLoading,
        productsError,
        handleGetAllProducts
    } = useProduct();

    useEffect(() => {
        window.scrollTo(0, 0);
        handleGetAllProducts({ page, limit: 9, category, sort });
    }, [page, category, sort]);

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        setSearchParams(params);
    };

    const handleSortChange = (newSort) => {
        const params = new URLSearchParams(searchParams);
        if (newSort && newSort !== "newest") params.set("sort", newSort);
        else params.delete("sort");
        params.set("page", "1");
        setSearchParams(params);
    };

    return (
        <main className="min-h-screen bg-[#fbf9f6] px-6 md:px-10 lg:px-16 xl:px-24 py-10">

            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#7A6E63] mb-2">
                        {category ? `Collection · ${category}` : "All Products"}
                    </p>
                    <h1
                        className="text-3xl md:text-4xl font-light text-[#1b1c1a]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        The Archive
                    </h1>
                    {!productsLoading && pagination.total > 0 && (
                        <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#B5ADA3]">
                            {pagination.total} {pagination.total === 1 ? "piece" : "pieces"}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <label
                        htmlFor="sort-select"
                        className="text-[10px] uppercase tracking-[0.18em] text-[#B5ADA3]"
                    >
                        Sort
                    </label>
                    <select
                        id="sort-select"
                        value={sort || "newest"}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="bg-transparent outline-none text-[11px] uppercase tracking-[0.15em] py-2 px-3 cursor-pointer border border-[#d0c5b5] text-[#1b1c1a]"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="price_asc">Price: Low → High</option>
                        <option value="price_desc">Price: High → Low</option>
                    </select>
                </div>
            </div>

          
            {productsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="w-full aspect-[4/5] bg-[#f5f3f0]" />
                            <div className="mt-4 h-4 w-3/4 bg-[#f5f3f0]" />
                            <div className="mt-2 h-3 w-1/3 bg-[#f5f3f0]" />
                        </div>
                    ))}
                </div>
            )}

           
            {!productsLoading && productsError && (
                <div className="py-20 text-center bg-[#f5f3f0]">
                    <p className="text-2xl mb-2 text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Something went wrong.
                    </p>
                    <p className="text-sm text-[#7A6E63] mb-6">{productsError}</p>
                    <button
                        onClick={() => handleGetAllProducts({ page, limit: 9, category, sort })}
                        className="px-8 py-3 text-[10px] uppercase tracking-[0.2em] bg-[#1b1c1a] text-[#fbf9f6]"
                    >
                        Retry
                    </button>
                </div>
            )}

           
            {!productsLoading && !productsError && products.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        hasNext={pagination.hasNext}
                        hasPrev={pagination.hasPrev}
                    />
                </>
            )}

       
            {!productsLoading && !productsError && products.length === 0 && (
                <div className="py-20 text-center text-sm text-[#7A6E63]">
                    No products available.
                </div>
            )}

        </main>
    );
};

export default Products;