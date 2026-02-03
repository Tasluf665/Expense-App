import * as React from "react";
import Svg, {
    G,
    Ellipse,
    Defs,
    LinearGradient,
    Stop,
    Filter,
    FeFlood,
    FeBlend,
    FeColorMatrix,
    FeOffset,
    FeGaussianBlur,
    FeComposite
} from "react-native-svg";

/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props) => (
    <Svg
        width={375}
        height={213}
        viewBox="0 0 375 213"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <G filter="url(#filter0_iif_2_6501)">
            <Ellipse
                cx={142.5}
                cy={156.56}
                rx={14.5}
                ry={16}
                fill="url(#paint0_linear_2_6501)"
            />
        </G>
        <G filter="url(#filter1_iif_2_6501)">
            <Ellipse
                cx={365.978}
                cy={85.8968}
                rx={46}
                ry={54}
                transform="rotate(32.9685 365.978 85.8968)"
                fill="url(#paint1_linear_2_6501)"
            />
        </G>
        <G filter="url(#filter2_iif_2_6501)">
            <Ellipse
                cx={75.3914}
                cy={44.706}
                rx={18.9098}
                ry={20.7069}
                transform="rotate(1.34724 75.3914 44.706)"
                fill="url(#paint2_linear_2_6501)"
            />
        </G>
        <G filter="url(#filter3_iif_2_6501)">
            <Ellipse
                cx={277.699}
                cy={152.891}
                rx={15.0805}
                ry={20.7069}
                transform="rotate(32.5495 277.699 152.891)"
                fill="url(#paint3_linear_2_6501)"
            />
        </G>
        <G filter="url(#filter4_iif_2_6501)">
            <Ellipse
                cx={13.4752}
                cy={119.924}
                rx={38.2269}
                ry={44.875}
                transform="rotate(-27.1066 13.4752 119.924)"
                fill="url(#paint4_linear_2_6501)"
            />
        </G>
        <Defs>
            <Filter id="filter0_iif_2_6501" x={88} y={100.56} width={109} height={112} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <FeFlood floodOpacity={0} result="BackgroundImageFix" />
                <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeOffset dy={19} />
                <FeGaussianBlur stdDeviation={12} />
                <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <FeColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
                <FeBlend mode="normal" in2="shape" result="effect1_innerShadow_2_6501" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeOffset dx={3} dy={-2} />
                <FeGaussianBlur stdDeviation={10} />
                <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                <FeBlend mode="normal" in2="effect1_innerShadow_2_6501" result="effect2_innerShadow_2_6501" />
                <FeGaussianBlur stdDeviation={30} result="effect3_foregroundBlur_2_6501" />
            </Filter>
            <Filter id="filter1_iif_2_6501" x={309.469} y={26.1273} width={113.019} height={127.539} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <FeFlood floodOpacity={0} result="BackgroundImageFix" />
                <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeOffset dy={19} />
                <FeGaussianBlur stdDeviation={12} />
                <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <FeColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
                <FeBlend mode="normal" in2="shape" result="effect1_innerShadow_2_6501" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeOffset dx={3} dy={-2} />
                <FeGaussianBlur stdDeviation={10} />
                <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                <FeBlend mode="normal" in2="effect1_innerShadow_2_6501" result="effect2_innerShadow_2_6501" />
                <FeGaussianBlur stdDeviation={8} result="effect3_foregroundBlur_2_6501" />
            </Filter>
            <Filter id="filter2_iif_2_6501" x={32.4805} y={0} width={85.8219} height={89.412} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <FeFlood floodOpacity={0} result="BackgroundImageFix" />
                <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeOffset dy={19} />
                <FeGaussianBlur stdDeviation={12} />
                <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <FeColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
                <FeBlend mode="normal" in2="shape" result="effect1_innerShadow_2_6501" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeOffset dx={3} dy={-2} />
                <FeGaussianBlur stdDeviation={10} />
                <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                <FeBlend mode="normal" in2="effect1_innerShadow_2_6501" result="effect2_innerShadow_2_6501" />
                <FeGaussianBlur stdDeviation={18} result="effect3_foregroundBlur_2_6501" />
            </Filter>
            <Filter id="filter3_iif_2_6501" x={252.796} y={125.638} width={49.8063} height={62.5053} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <FeFlood floodOpacity={0} result="BackgroundImageFix" />
                <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeOffset dy={19} />
                <FeGaussianBlur stdDeviation={12} />
                <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <FeColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
                <FeBlend mode="normal" in2="shape" result="effect1_innerShadow_2_6501" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeOffset dx={3} dy={-2} />
                <FeGaussianBlur stdDeviation={10} />
                <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                <FeBlend mode="normal" in2="effect1_innerShadow_2_6501" result="effect2_innerShadow_2_6501" />
                <FeGaussianBlur stdDeviation={8} result="effect3_foregroundBlur_2_6501" />
            </Filter>
            <Filter id="filter4_iif_2_6501" x={-38.2296} y={64.3349} width={103.41} height={115.179} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <FeFlood floodOpacity={0} result="BackgroundImageFix" />
                <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeOffset dy={19} />
                <FeGaussianBlur stdDeviation={12} />
                <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <FeColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
                <FeBlend mode="normal" in2="shape" result="effect1_innerShadow_2_6501" />
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <FeOffset dx={3} dy={-2} />
                <FeGaussianBlur stdDeviation={10} />
                <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                <FeBlend mode="normal" in2="effect1_innerShadow_2_6501" result="effect2_innerShadow_2_6501" />
                <FeGaussianBlur stdDeviation={10} result="effect3_foregroundBlur_2_6501" />
            </Filter>
            <LinearGradient
                id="paint0_linear_2_6501"
                x1={142.5}
                y1={140.56}
                x2={142.5}
                y2={172.56}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#C6A9FF" />
                <Stop offset={1} stopColor="#7F3DFF" />
            </LinearGradient>
            <LinearGradient
                id="paint1_linear_2_6501"
                x1={365.978}
                y1={31.8968}
                x2={365.978}
                y2={139.897}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#C6A9FF" />
                <Stop offset={1} stopColor="#7F3DFF" />
            </LinearGradient>
            <LinearGradient
                id="paint2_linear_2_6501"
                x1={75.3914}
                y1={23.9991}
                x2={75.3914}
                y2={65.4129}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#C6A9FF" />
                <Stop offset={1} stopColor="#7F3DFF" />
            </LinearGradient>
            <LinearGradient
                id="paint3_linear_2_6501"
                x1={277.699}
                y1={132.184}
                x2={277.699}
                y2={173.598}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#C6A9FF" />
                <Stop offset={1} stopColor="#7F3DFF" />
            </LinearGradient>
            <LinearGradient
                id="paint4_linear_2_6501"
                x1={13.4752}
                y1={75.0492}
                x2={13.4752}
                y2={164.799}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#C6A9FF" />
                <Stop offset={1} stopColor="#7F3DFF" />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default SVGComponent;
