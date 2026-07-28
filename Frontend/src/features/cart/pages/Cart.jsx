import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { Link, useNavigate } from 'react-router'


const tokens = {
    surface: '#fbf9f6',
    surfaceLow: '#f5f3f0',
    surfaceLowest: '#ffffff',
    surfaceHigh: '#eae8e5',
    surfaceHighest: '#e4e2df',
    onSurface: '#1b1c1a',
    onSurfaceVariant: '#4d463a',
    secondary: '#7A6E63',
    muted: '#B5ADA3',
    primary: '#C9A96E',
    primaryDark: '#745a27',
    outlineVariant: '#d0c5b5',
    outline: '#7f7668',
}


const Cart = () => {
    const { handleGetCart } = useCart();

    useEffect(() => {
        async function fetchCart() {
            try {
                const data = await handleGetCart();
                console.log(data);
                console.log("Items:", data.items || data.cart?.items);
            } catch (err) {
                console.error("Error fetching cart:", err);
            }
        }

        fetchCart();
    }, []);

    return (
    
            <>
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
                <div
                    className="min-h-screen flex flex-col"
                    style={{ backgroundColor: tokens.surface, fontFamily: "'Inter', sans-serif" }}
                >

                    <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-24 px-8">
                        <p
                            className="text-5xl md:text-6xl font-light leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}
                        >
                            Your selection is empty.
                        </p>
                        <p
                            className="text-[10px] uppercase tracking-[0.22em]"
                            style={{ color: tokens.muted }}
                        >
                            Curate your collection
                        </p>
                        <Link
                            to="/"
                            className="mt-4 px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                            style={{
                                backgroundColor: tokens.onSurface,
                                color: tokens.surface,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = tokens.primary
                                e.currentTarget.style.color = tokens.onSurface
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = tokens.onSurface
                                e.currentTarget.style.color = tokens.surface
                            }}
                        >
                            Explore the Archive
                        </Link>
                    </div>
                </div>
            </>
        
    );
};

export default Cart;