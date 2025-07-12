import { CartType } from "@/types";
export const getParcelsWeight = (items : CartType[]) => {
    return items.reduce((total, parcel) => total + parcel.dimensions.weight, 0);
}