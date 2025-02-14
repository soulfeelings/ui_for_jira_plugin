import { Asset } from "@/store_types";
import { pb } from "@/store";

interface AssetCardProps {
    asset: Asset;
    isSelected: boolean;
    onClick: (asset: Asset) => void;
    isDisabled: boolean;
}

export const AssetCard = ({ asset, isSelected, onClick, isDisabled }: AssetCardProps) => {
    return (
        <div
            className={`${isDisabled && 'opacity-[0.5] pointer-events-none'} cursor-pointer w-[137px] h-[174px] min-w-[137px] min-h-[174px] border p-[16px] rounded-[25px] 
          ${isSelected ? "border-[#B1ABA0] border-4" : "border-0"} 
          flex flex-col items-center justify-center gap-2 bg-[#EBE6DD]`}
            onClick={() => onClick(asset)}
        >
            <img
                src={pb.files.getUrl(asset, asset.image)}
                alt={asset.name}
                className="w-[100px] h-[100px]"
            />
            <div className="bg-[#F2C52E] text-black font-bold p-2 rounded-[10px] text-center w-full">
                {asset.price} xp
            </div>
        </div>
    );
};