export const Button = ({
  text,
  onClick,
  loading,
}: {
  text: string;
  onClick: () => void;
  loading?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className="px-8 py-4 bg-[#54C5F1] text-white text-xl font-bold rounded-[31px] shadow-lg hover:bg-[#3BA9D4] transition-all duration-300"
    >
      {/* i need loading state */}
      {loading ? <div className="w-4 h-4 bg-white rounded-full"></div> : text}
    </button>
  );
};
