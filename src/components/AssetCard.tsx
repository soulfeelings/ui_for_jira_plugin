import { Asset } from '@/store_types';
import { pb } from '@/store';

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  isBought: boolean;
  onClick: (asset: Asset) => void;
  isDisabled: boolean;
  isEquipped: boolean;
}

export const AssetCard = ({
  asset,
  isSelected,
  onClick,
  isDisabled,
  isBought = true,
  isEquipped,
}: AssetCardProps) => {
  return (
    <div
      className={`${isDisabled && !isBought ? 'opacity-[0.5] pointer-events-none' : ''} 
            cursor-pointer 
            w-[137px] h-[174px] min-w-[137px] min-h-[174px] border p-[16px] rounded-[25px] 
            ${isSelected ? 'border-4 border-[#B1ABA0]' : ''} // Приоритет для выбранного
            ${!isBought && !isSelected ? 'border-4 border-[#FFBB4E]' : ''} 
            ${isEquipped ? 'border-4 border-[#4CAF50]' : ''}
            flex flex-col items-center justify-center gap-2 bg-[#EBE6DD]`}
      onClick={() => onClick(asset)}
    >
      <img
        src={pb.files.getUrl(asset, asset.image)}
        alt={asset.name}
        className="w-[100px] h-[100px]"
      />

      {!isBought ? (
        <div
          className={`bg-button-color-not-bought text-white font-bold p-2 rounded-[10px] text-center w-full shadow-[inset_-1px_-6px_0px_-1px_rgba(97,97,97,0.34)]`}
        >
          {asset.price} xp
        </div>
      ) : (
        <div
          className={`bg-button-color-bought text-white font-bold p-2 rounded-[10px] text-center w-full shadow-[inset_-1px_-6px_0px_-1px_rgba(97,97,97,0.34)] flex items-center justify-center`}
        >
          {isEquipped ? (
            'Надето'
          ) : (
            <svg
              width="23"
              height="19"
              viewBox="0 0 23 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.6998 3.3501L7.46896 15.6501L3.2998 11.4574"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export const NoAssetCard = ({
  onClick,
  isSelected,
}: {
  onClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`${isSelected ? 'border-[#B1ABA0] border-inside border-4' : 'border-0'} cursor-pointer w-[137px] h-[174px] min-w-[137px] min-h-[174px] border p-[16px] rounded-[25px] flex flex-col items-center justify-center gap-2 bg-[#EBE6DD]`}
    >
      <svg
        width="74"
        height="74"
        viewBox="0 0 74 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M59.6286 15.3143L15.3143 59.6286M70 37C70 55.2254 55.2254 70 37 70C18.7746 70 4 55.2254 4 37C4 18.7746 18.7746 4 37 4C55.2254 4 70 18.7746 70 37Z"
          stroke="#D1CDC3"
          stroke-width="7"
        />
      </svg>
    </div>
  );
};
