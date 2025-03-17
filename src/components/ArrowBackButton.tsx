export const ArrowBackButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="group fixed top-5 left-5 pointer-events-auto w-[100px] h-[100px] bg-[transparent] text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-md hover:translate-y-[2px] active:shadow-sm active:translate-y-[4px] flex flex-col items-center justify-center gap-2"
    >
      <svg
        width="52"
        height="38"
        viewBox="0 0 52 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.687 6.48701C23.171 5.00301 23.171 2.59699 21.687 1.11299C20.203 -0.370998 17.797 -0.370998 16.313 1.11299L1.11299 16.313C-0.370998 17.797 -0.370998 20.203 1.11299 21.687L16.313 36.887C17.797 38.371 20.203 38.371 21.687 36.887C23.171 35.403 23.171 32.997 21.687 31.513L12.974 22.8L47.7714 22.8C49.8701 22.8 51.5714 21.0987 51.5714 19C51.5714 16.9013 49.8701 15.2 47.7714 15.2L12.974 15.2L21.687 6.48701Z"
          fill="#7F512F"
        />
      </svg>
    </button>
  );
};
