import { GreenCheck } from "@/svgs/GreenCheck";
import { useState } from "react";
import { Button } from "./Button";
import { motion, AnimatePresence } from 'framer-motion';
import { useConfiguratorStore } from "@/store";

const NAME_ERROR = "The name must be more than 2 characters.";

export const CharacterNameForm = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState(NAME_ERROR);

    const { loadingName, createCharacterLoading, createCharacter } = useConfiguratorStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (value.length <= 2) {
            setError(NAME_ERROR);
        } else {
            setError("");
        }
    };


    return (
        <div className="flex flex-col md:flex-row gap-12 items-center justify-center h-screen">
            <SVGIllustration />
            <div className="flex flex-col items-center p-6 space-y-4 rounded-lg shadow-[0_6px_5.2px_0px_rgba(0,0,0,0.03)] w-[500px]">
                <h2 className="text-[20px] md:text-[30px] font-bold text-gray-900 text-center">What do you want to name your character?</h2>
                <div className="relative flex items-stretch gap-2">
                    <input
                        type="text"
                        placeholder="Enter your character name with > 2 characters"
                        value={name}
                        onChange={handleChange}
                        className="w-[90%] px-[20px] py-[20px] text-[#6C6C6C] bg-[#F0F0F0] font-bold text-[16px] md:text-[28px] border border-gray-300 rounded-[30px] shadow-[0_6px_5.2px_0px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:ring-grey-500"
                    />
                    {!error && <div className="absolute right-[-20px] top-[50%] translate-y-[-50%]"><GreenCheck /></div>}
                </div>
                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.p
                            key="error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="text-[12px] md:text-[22px] text-color-[#C7C7C7]"
                        >
                            {error}
                        </motion.p>
                    ) : (
                        <motion.div
                            key="button"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button text="Continue" onClick={() => createCharacter(name)} loading={loadingName || createCharacterLoading} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function SVGIllustration() {
    return (
        <svg className="w-[200px] md:w-[392px] md:h-[402px]" viewBox="0 0 392 402" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_f_19_886)">
                <ellipse cx="196.211" cy="356.029" rx="193.211" ry="43.5355" fill="#B2B4C0" fillOpacity="0.44" />
            </g>
            <path d="M369.125 351.709C369.125 370.878 291.642 386.418 196.063 386.418C100.483 386.418 23 370.878 23 351.709C23 332.54 100.483 317 196.063 317C291.642 317 369.125 332.54 369.125 351.709Z" fill="#9799A8" />
            <path d="M23 351.369V294.485H369.125V351.369H23Z" fill="#9799A8" />
            <ellipse cx="196.063" cy="294.485" rx="173.063" ry="34.7089" fill="#B2B4C0" />
            <path d="M346.468 294.486C346.468 295.757 345.748 297.213 343.88 298.835C342.022 300.449 339.196 302.074 335.42 303.661C327.881 306.83 316.883 309.716 303.185 312.151C275.811 317.017 237.937 320.036 196.063 320.036C154.188 320.036 116.314 317.017 88.9405 312.151C75.242 309.716 64.2441 306.83 56.7047 303.661C52.9289 302.074 50.1031 300.449 48.2446 298.835C46.3776 297.213 45.6573 295.757 45.6573 294.486C45.6573 293.215 46.3776 291.759 48.2446 290.137C50.1031 288.523 52.9289 286.898 56.7047 285.311C64.2441 282.142 75.242 279.256 88.9405 276.821C116.314 271.955 154.188 268.936 196.063 268.936C237.937 268.936 275.811 271.955 303.185 276.821C316.883 279.256 327.881 282.142 335.42 285.311C339.196 286.898 342.022 288.523 343.88 290.137C345.748 291.759 346.468 293.215 346.468 294.486Z" stroke="#E8E8E8" strokeWidth="2.89241" />
            <ellipse cx="197" cy="294.5" rx="66" ry="12.5" fill="#9799A8" fillOpacity="0.6" />
            <path d="M237.105 278.863C226.607 285.493 200.916 281.902 199.534 278.863C198.98 270.589 212.518 272.601 217.767 272.233L238.623 271.241C239.084 272.162 239.145 275.023 237.105 278.863Z" fill="#1F7999" />
            <path d="M192.904 278.863C182.406 285.493 157.642 280.37 155.333 278.863C150.34 273.328 168.317 272.602 173.566 272.233L193.373 271.894C193.833 272.814 193.112 275.414 192.904 278.863Z" fill="#1F7999" />
            <g filter="url(#filter1_i_19_886)">
                <path d="M247.33 204.598C231.71 189.603 209.842 186.479 196.096 186.479C182.35 186.479 160.903 189.603 145.282 204.598C129.662 219.593 127.225 231.395 132.161 235.838C137.674 240.799 147.077 234.575 153.076 228.321C153.703 227.667 154.827 228.211 154.631 229.095C153.176 235.66 151.057 243.08 154.03 256.457C156.529 267.704 159.653 268.953 159.653 278.325C159.653 282.699 157.154 294.57 165.276 297.07C172.619 299.329 185.577 290.356 189.845 277.996C190.634 275.711 192.658 273.952 195.076 273.952H196.096H197.537C199.954 273.952 201.979 275.711 202.768 277.996C207.035 290.356 219.994 299.329 227.336 297.07C235.459 294.57 232.959 282.699 232.959 278.325C232.959 268.953 236.084 267.704 238.583 256.457C241.556 243.08 239.437 235.66 237.982 229.095C237.786 228.211 238.909 227.667 239.536 228.321C245.536 234.575 254.939 240.799 260.451 235.838C265.388 231.395 262.95 219.593 247.33 204.598Z" fill="#FFD9B9" />
            </g>
            <mask id="mask0_19_886" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="129" y="186" width="134" height="112">
                <path d="M247.33 204.598C231.71 189.603 209.842 186.479 196.096 186.479C182.35 186.479 160.903 189.603 145.282 204.598C129.662 219.593 127.225 231.395 132.161 235.838C137.674 240.799 147.077 234.575 153.076 228.321C153.703 227.667 154.827 228.211 154.631 229.095C153.176 235.66 151.057 243.08 154.03 256.457C156.529 267.704 159.653 268.953 159.653 278.325C159.653 282.699 157.154 294.57 165.276 297.07C172.619 299.329 185.577 290.356 189.845 277.996C190.634 275.711 192.658 273.952 195.076 273.952H196.096H197.537C199.954 273.952 201.979 275.711 202.768 277.996C207.035 290.356 219.994 299.329 227.336 297.07C235.459 294.57 232.959 282.699 232.959 278.325C232.959 268.953 236.084 267.704 238.583 256.457C241.556 243.08 239.437 235.66 237.982 229.095C237.786 228.211 238.909 227.667 239.536 228.321C245.536 234.575 254.939 240.799 260.451 235.838C265.388 231.395 262.95 219.593 247.33 204.598Z" fill="#FFD9B9" />
            </mask>
            <g mask="url(#mask0_19_886)">
                <path d="M153.157 236.335C152.637 238.835 152.377 245.018 152.507 246.465L195.397 244.754H240.058C240.058 243.439 240.058 239.944 239.667 237.336C239.275 234.859 239.09 234.005 238.882 233.058C238.622 231.874 238.362 230.69 238.232 230.164C238.043 229.399 237.711 228.469 238.363 228.208C238.884 227.947 239.147 227.943 239.667 228.469C240.316 229.126 242.014 230.946 244.622 233.033C245.922 231.454 252.584 226.238 254.794 212.82C254.144 212.031 252.964 210.236 250.621 207.865C248.541 205.76 246.308 203.451 243.448 201.214C240.979 199.109 234.954 195.235 229.625 192.999C224.557 190.762 213.202 186.479 196.047 186.479C178.891 186.479 167.713 191.083 162.514 193.187C157.316 195.292 151.374 199.109 148.775 201.214C146.175 203.319 143.812 206.02 141.733 208.256C139.653 210.492 138.21 212.031 137.56 212.82C139.769 226.238 146.301 231.454 147.601 233.033C150.33 230.928 152.302 229.129 152.822 228.603C153.342 228.076 153.732 227.813 154.252 228.208C154.772 228.603 154.642 229.129 154.512 229.655C154.382 230.181 154.066 231.731 153.807 232.915C153.599 233.862 153.287 235.546 153.157 236.335Z" fill="#D3F4FF" />
            </g>
            <path d="M181.698 209.934C184.951 211.328 192.734 211.676 196.219 211.676C199.704 211.676 207.488 211.328 210.74 209.934C214.806 208.191 215.833 197.546 215.833 188.252C220.806 189.357 223.016 190.185 223.519 190.355V212.838C223.519 218.646 233.974 231.297 236.878 236.524C239.027 240.391 241.525 246.98 241.525 257.435C241.525 267.89 240.009 277.121 237.105 278.864C237.105 278.864 231.651 274.28 217.711 274.28C208.69 274.28 202.383 277.151 199.534 278.864C199.506 275.038 198.821 273.98 196.219 273.98C193.618 273.98 192.932 275.038 192.904 278.864C190.055 277.151 183.748 274.28 174.728 274.28C160.788 274.28 155.333 278.864 155.333 278.864C152.429 277.121 150.913 267.89 150.913 257.435C150.913 246.98 153.412 240.391 155.56 236.524C158.464 231.297 168.92 218.646 168.92 212.838V190.4C169.422 190.186 171.909 189.357 176.471 188.252C176.471 197.545 177.632 208.191 181.698 209.934Z" fill="#50C1E9" />
            <path d="M218.827 239.912C220.988 239.912 222.779 241.681 222.359 243.801C220.245 254.458 209.593 262.565 196.772 262.565C183.95 262.565 173.298 254.458 171.185 243.8C170.765 241.681 172.559 239.912 174.72 239.912C183.159 239.912 184.151 239.912 196.772 239.912C208.366 239.912 213.496 239.912 218.827 239.912Z" fill="#30A3CC" />
            <g filter="url(#filter2_i_19_886)">
                <path d="M271.575 106.165C259.133 73.3193 239.911 57.5045 226.592 51.6567C215.628 46.566 205.672 44.6839 196.37 44.5986C187.068 44.6839 176.514 46.566 165.551 51.6567C152.232 57.5045 133.009 73.3193 120.567 106.165C114.884 121.169 113.597 139.086 116.501 151.565L116.569 151.861C119.478 164.369 126.624 184.563 159.167 195.907C169.733 199.777 188.442 202.064 196.37 202.064C204.298 202.064 222.41 199.777 232.976 195.907C265.519 184.563 273.063 164.369 275.972 151.861L276.041 151.565C278.945 139.086 277.259 121.169 271.575 106.165Z" fill="#FFD9B9" />
            </g>
            <circle cx="5.52511" cy="5.52511" r="5.52511" transform="matrix(-1 0 0 1 226.72 128.126)" fill="#75441D" />
            <path d="M237.33 128.717C236.171 122.541 229.555 114.823 221.769 114.177" stroke="#75441D" strokeWidth="2.08647" strokeLinecap="round" />
            <circle cx="171.469" cy="133.651" r="5.52511" fill="#75441D" />
            <path d="M155.333 128.717C156.492 122.541 163.109 114.823 170.895 114.177" stroke="#75441D" strokeWidth="2.08647" strokeLinecap="round" />
            <ellipse cx="196.495" cy="175.364" rx="10.774" ry="12.984" fill="#75441D" />
            <path d="M167.294 110.33H171.362H178.85C182.087 110.33 185.191 111.616 187.48 113.905C192.246 118.671 192.246 126.398 187.48 131.164L174.885 145.254C172.419 148.012 168.143 148.132 165.528 145.516L151.176 131.164C146.41 126.398 146.41 118.671 151.176 113.905C153.464 111.616 156.569 110.33 159.805 110.33H167.294Z" fill="#FFD0CB" fillOpacity="0.6" />
            <path d="M171.362 110.33H159.805C156.569 110.33 153.464 111.616 151.176 113.905C146.41 118.671 146.41 126.398 151.176 131.164L165.528 145.516C168.143 148.132 172.419 148.012 174.885 145.254L187.48 131.164C192.246 126.398 192.246 118.671 187.48 113.905C185.191 111.616 182.087 110.33 178.85 110.33H167.294" stroke="#FF7B6F" strokeWidth="3.05109" />
            <path d="M220.857 110.33H224.925H232.413C235.65 110.33 238.754 111.616 241.043 113.905C245.809 118.671 245.809 126.398 241.043 131.164L228.448 145.254C225.983 148.012 221.707 148.132 219.091 145.516L204.739 131.164C199.973 126.398 199.973 118.671 204.739 113.905C207.028 111.616 210.132 110.33 213.369 110.33H220.857Z" fill="#FFD0CB" fillOpacity="0.6" />
            <path d="M224.925 110.33H213.369C210.132 110.33 207.028 111.616 204.739 113.905C199.973 118.671 199.973 126.398 204.739 131.164L219.091 145.516C221.707 148.132 225.983 148.012 228.448 145.254L241.043 131.164C245.809 126.398 245.809 118.671 241.043 113.905C238.754 111.616 235.65 110.33 232.413 110.33H220.857" stroke="#FF7B6F" strokeWidth="3.05109" />
            <path d="M190.316 119.144C192.193 117.865 197.125 116.074 201.842 119.144" stroke="#FF7B6E" strokeWidth="3.05109" />
            <g filter="url(#filter3_f_19_886)">
                <ellipse cx="241.883" cy="156.355" rx="13.9533" ry="11.606" fill="#FB999A" fillOpacity="0.43" />
            </g>
            <g filter="url(#filter4_f_19_886)">
                <ellipse cx="150.6" cy="156.355" rx="13.9533" ry="11.606" fill="#FB999A" fillOpacity="0.43" />
            </g>
            <path d="M254.737 68.7289C222.437 29.4342 213.179 21.4106 191.166 21.4106C169.153 21.4106 147.757 53.0933 139.939 66.8773C194.252 86.2161 241.982 72.4321 254.737 68.7289Z" fill="#50C1E9" />
            <path d="M136.647 77.3145C160.512 86.5724 205.567 93.9787 257 78.9603" stroke="#30A3CC" strokeWidth="22.6305" strokeLinecap="round" />
            <mask id="mask1_19_886" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="125" y="65" width="144" height="34">
                <path d="M136.647 77.3149C160.512 86.5729 205.567 93.9792 257 78.9608" stroke="#30A3CC" strokeWidth="22.6305" strokeLinecap="round" />
            </mask>
            <g mask="url(#mask1_19_886)">
                <path d="M146.008 67.8098L137.006 91.4753" stroke="#50C1E9" strokeWidth="3.65132" />
                <path d="M155.878 70.4924L146.876 94.158" stroke="#50C1E9" strokeWidth="3.65132" />
            </g>
            <circle cx="182.525" cy="17.2815" r="17.2815" fill="#30A3CC" />
            <circle cx="158.043" cy="59.0605" r="6.58341" fill="#D3F4FF" fillOpacity="0.63" />
            <circle cx="174.502" cy="45.0708" r="2.46878" fill="#D3F4FF" fillOpacity="0.63" />
            <circle cx="180.674" cy="58.2382" r="5.34902" fill="#D3F4FF" fillOpacity="0.63" />
            <circle cx="196.309" cy="67.2901" r="3.70317" fill="#D3F4FF" fillOpacity="0.63" />
            <circle cx="214.002" cy="50.0084" r="4.93756" fill="#D3F4FF" fillOpacity="0.63" />
            <circle cx="200.013" cy="54.1229" r="1.64585" fill="#D3F4FF" fillOpacity="0.63" />
            <circle cx="207.419" cy="34.7845" r="1.64585" fill="#D3F4FF" fillOpacity="0.63" />
            <circle cx="231.695" cy="58.2379" r="6.17195" fill="#D3F4FF" fillOpacity="0.63" />
            <circle cx="214.414" cy="63.9979" r="1.64585" fill="#D3F4FF" fillOpacity="0.63" />
            <circle cx="194.663" cy="42.6024" r="5.34902" fill="#D3F4FF" fillOpacity="0.63" />
            <defs>
                <filter id="filter0_f_19_886" x="0.8" y="310.293" width="390.822" height="91.4708" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="1.1" result="effect1_foregroundBlur_19_886" />
                </filter>
                <filter id="filter1_i_19_886" x="129.866" y="177.611" width="132.88" height="119.808" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="-8.8675" />
                    <feGaussianBlur stdDeviation="16.6918" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.94902 0 0 0 0 0.721569 0 0 0 0 0.541176 0 0 0 0.74 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_19_886" />
                </filter>
                <filter id="filter2_i_19_886" x="115" y="35.7311" width="162.438" height="166.333" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="-8.8675" />
                    <feGaussianBlur stdDeviation="16.6918" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.94902 0 0 0 0 0.721569 0 0 0 0 0.541176 0 0 0 0.74 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_19_886" />
                </filter>
                <filter id="filter3_f_19_886" x="223.027" y="139.846" width="37.7129" height="33.0183" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="2.4516" result="effect1_foregroundBlur_19_886" />
                </filter>
                <filter id="filter4_f_19_886" x="131.744" y="139.846" width="37.7129" height="33.0183" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="2.4516" result="effect1_foregroundBlur_19_886" />
                </filter>
            </defs>
        </svg>
    )
}