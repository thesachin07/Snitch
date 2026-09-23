import React from "react";

const tokens = {
    surface: "#fbf9f6",
    onSurface: "#1b1c1a",
    secondary: "#7A6E63",
    muted: "#B5ADA3",
    primary: "#C9A96E",
    outlineVariant: "#d0c5b5",
};

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    hasNext,
    hasPrev
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const delta = 1;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);
        if (currentPage > 3) pages.push("...");

        const start = Math.max(2, currentPage - delta);
        const end = Math.min(totalPages - 1, currentPage + delta);

        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const buttonBase =
        "min-w-[40px] h-10 px-4 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-200 flex items-center justify-center";

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-2 mt-16 flex-wrap"
        >
            {/* PREVIOUS */}
            <button
                type="button"
                onClick={() => hasPrev && onPageChange(currentPage - 1)}
                disabled={!hasPrev}
                aria-label="Previous page"
                className={`${buttonBase} ${
                    !hasPrev
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-[#1b1c1a] hover:text-[#fbf9f6]"
                }`}
                style={{
                    border: `1px solid ${tokens.outlineVariant}`,
                    color: tokens.onSurface,
                    backgroundColor: "transparent",
                }}
            >
                ← Previous
            </button>

            {pageNumbers.map((page, index) => {
                if (page === "...") {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="min-w-[40px] h-10 flex items-center justify-center text-[11px]"
                            style={{ color: tokens.muted }}
                        >
                            ···
                        </span>
                    );
                }

                const isActive = page === currentPage;

                return (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        aria-label={`Go to page ${page}`}
                        aria-current={isActive ? "page" : undefined}
                        className={`${buttonBase} ${
                            !isActive
                                ? "hover:bg-[#1b1c1a] hover:text-[#fbf9f6]"
                                : ""
                        }`}
                        style={{
                            border: `1px solid ${
                                isActive ? tokens.primary : tokens.outlineVariant
                            }`,
                            backgroundColor: isActive ? tokens.primary : "transparent",
                            color: isActive ? "#fff" : tokens.onSurface,
                        }}
                    >
                        {page}
                    </button>
                );
            })}

            \
            <button
                type="button"
                onClick={() => hasNext && onPageChange(currentPage + 1)}
                disabled={!hasNext}
                aria-label="Next page"
                className={`${buttonBase} ${
                    !hasNext
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-[#1b1c1a] hover:text-[#fbf9f6]"
                }`}
                style={{
                    border: `1px solid ${tokens.outlineVariant}`,
                    color: tokens.onSurface,
                    backgroundColor: "transparent",
                }}
            >
                Next →
            </button>
        </nav>
    );
};

export default Pagination;
