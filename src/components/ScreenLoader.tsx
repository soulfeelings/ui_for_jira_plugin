import { Space } from "./Space";

export const ScreenLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Illusttration />
            <h1 className="text-2xl font-bold pt-14">Loader...</h1>
            <Space height={30} width={1} />
            <ProgressBar />
        </div>
    );
};

export default function ProgressBar() {
    return (
        <div className="w-[300px] md:w-[546px] h-[34px] bg-[#E2DFDF] border border-[#D1D1D1] rounded-full flex items-center overflow-hidden">
            <div className="h-[34px] bg-[#F9C128] rounded-full motion-safe:animate-[progress_4s_ease-in-out_forwards]" />
        </div>
    );
}


function Illusttration() {
    return (
        <svg width="178" height="290" viewBox="0 0 178 290" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="88.5412" cy="275.627" rx="72.1447" ry="13.6638" fill="#E2DFDF" />
            <g filter="url(#filter0_i_19_829)">
                <path d="M144.65 174.895C127.576 158.504 103.671 155.089 88.6458 155.089C73.6203 155.089 50.1762 158.504 33.1016 174.895C16.0271 191.287 13.3626 204.187 18.759 209.044C24.7846 214.467 35.063 207.663 41.6211 200.827C42.3066 200.112 43.5346 200.707 43.3203 201.673C41.7302 208.849 39.4139 216.96 42.6634 231.582C45.3953 243.876 48.8102 245.242 48.8102 255.487C48.8102 260.268 46.0783 273.244 54.957 275.976C62.983 278.446 77.148 268.637 81.8128 255.127C82.6753 252.629 84.8884 250.706 87.5311 250.706H88.6458H90.2208C92.8635 250.706 95.0765 252.629 95.939 255.127C100.604 268.637 114.769 278.446 122.795 275.976C131.674 273.244 128.942 260.268 128.942 255.487C128.942 245.242 132.357 243.876 135.088 231.582C138.338 216.96 136.022 208.849 134.432 201.673C134.217 200.707 135.445 200.112 136.131 200.827C142.689 207.663 152.967 214.467 158.993 209.044C164.389 204.187 161.725 191.287 144.65 174.895Z" fill="#FFD9B9" />
            </g>
            <g filter="url(#filter1_i_19_829)">
                <path d="M171.153 67.2983C157.552 31.3941 136.54 14.1069 121.982 7.71471C109.997 2.15007 99.1134 0.0927055 88.9454 -0.000488281C78.7773 0.0927055 67.2415 2.15007 55.2569 7.71471C40.6984 14.1069 19.6862 31.3941 6.08582 67.2983C-0.12669 83.699 -1.53403 103.284 1.64024 116.924L1.71552 117.248C4.8952 130.921 12.7064 152.995 48.2785 165.395C59.8289 169.626 80.2793 172.126 88.9454 172.126C97.6115 172.126 117.41 169.626 128.96 165.395C164.532 152.995 172.779 130.921 175.959 117.248L176.034 116.924C179.209 103.284 177.365 83.699 171.153 67.2983Z" fill="#FFD9B9" />
            </g>
            <path d="M79 142.312C82.1884 145.613 90.6522 150.236 99 142.312" stroke="#75441D" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="62.4025" cy="97.2412" r="5.93751" fill="#75441D" />
            <path d="M51 82.1888C56.0862 77.7462 63.7655 76.0584 72.3749 80.2652" stroke="#75441D" strokeWidth="1.78125" strokeLinecap="round" />
            <circle cx="5.93751" cy="5.93751" r="5.93751" transform="matrix(-1 0 0 1 121.535 91.3037)" fill="#75441D" />
            <path d="M127 82.1888C121.914 77.7462 114.235 76.0584 105.625 80.2652" stroke="#75441D" strokeWidth="1.78125" strokeLinecap="round" />
            <g filter="url(#filter2_f_19_829)">
                <ellipse cx="138.697" cy="122.16" rx="15.2523" ry="12.6865" fill="#FB999A" fillOpacity="0.43" />
            </g>
            <g filter="url(#filter3_f_19_829)">
                <ellipse cx="38.9149" cy="122.16" rx="15.2523" ry="12.6865" fill="#FB999A" fillOpacity="0.43" />
            </g>
            <defs>
                <filter id="filter0_i_19_829" x="16.2501" y="145.396" width="145.252" height="130.962" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="-9.69308" />
                    <feGaussianBlur stdDeviation="18.2458" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.94902 0 0 0 0 0.721569 0 0 0 0 0.541176 0 0 0 0.74 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_19_829" />
                </filter>
                <filter id="filter1_i_19_829" x="0" y="-9.69357" width="177.562" height="181.819" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="-9.69308" />
                    <feGaussianBlur stdDeviation="18.2458" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.94902 0 0 0 0 0.721569 0 0 0 0 0.541176 0 0 0 0.74 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_19_829" />
                </filter>
                <filter id="filter2_f_19_829" x="118.085" y="104.114" width="41.2241" height="36.0925" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="2.67985" result="effect1_foregroundBlur_19_829" />
                </filter>
                <filter id="filter3_f_19_829" x="18.3028" y="104.114" width="41.2241" height="36.0925" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="2.67985" result="effect1_foregroundBlur_19_829" />
                </filter>
            </defs>
        </svg>

    )
}