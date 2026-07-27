import useAppStore from "../../../app/app.store";
import { addItem } from "../service/cart.api";

export const useCart = () => {

    const addItemToStore = useAppStore((state) => state.addItem);

    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId });

        addItemToStore(data.item);  
        return data;
    }


    return {
        handleAddItem,
    };
};