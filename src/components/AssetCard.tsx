import { Asset } from "@/store_types";
import { pb } from "@/store";

interface AssetCardProps {
    asset: Asset;
    isSelected: boolean;
    isBought: boolean;
    onClick: (asset: Asset) => void;
    isDisabled: boolean;
}

export const AssetCard = ({ asset, isSelected, onClick, isDisabled, isBought = true }: AssetCardProps) => {

    return (
        <div
            className={`${isDisabled && 'opacity-[0.5] pointer-events-none'} cursor-pointer w-[137px] h-[174px] min-w-[137px] min-h-[174px] border p-[16px] rounded-[25px] 
          ${isSelected ? "border-[#B1ABA0] border-inside border-4" : "border-0"} 
          flex flex-col items-center justify-center gap-2 bg-[#EBE6DD]`}
            onClick={() => onClick(asset)}
        >
            <img
                src={pb.files.getUrl(asset, asset.image)}
                alt={asset.name}
                className="w-[100px] h-[100px]"
            />
            {!isBought ? <div className={`bg-button-color-not-bought text-white font-bold p-2 rounded-[10px] text-center w-full shadow-[inset_-1px_-6px_0px_-1px_rgba(97,97,97,0.34)]`}>
                {asset.price} xp
            </div> : <div className={`bg-button-color-bought text-white font-bold p-2 rounded-[10px] text-center w-full shadow-[inset_-1px_-6px_0px_-1px_rgba(97,97,97,0.34)]`}>
                <svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.6998 3.3501L7.46896 15.6501L3.2998 11.4574" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>}
        </div>
    );
};