import * as React from "react"
import Svg, {
    Path,
    Ellipse,
    G,
    Mask,
    Rect,
    Defs,
    LinearGradient,
    Stop
} from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgComponent(props) {
    return (
        <Svg
            width={312}
            height={312}
            viewBox="0 0 312 312"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M86.376 180.875c-4.32 13.444-33.227 37.316-51.136 50.581-2.39 1.771-2.146 5.45.482 6.846L74.674 259l34.663 19.516c6.47 3.642 14.655 1.607 19.124-4.322 14.439-19.154 41.305-48.715 73.985-67.452 39.795-22.816-25.425-66.546-63.009-85.56 13.265 1.327 21.224 12.602 31.173 13.265 9.949.664 15.255-5.305 13.265-17.244-1.99-11.939-37.806-38.469-55.714-32.5-25.203 9.286-44.438 33.826-47.09 44.439-2.653 10.612 11.275 33.162 5.305 51.733z"
                fill="url(#paint0_linear_3406_4550)"
            />
            <Path
                d="M272.793 198.055c-33.14 11.626-59.011 40.302-66.42 49.382-23.895-89.178-90.505-132.763-120.824-143.407 15.753-10.401 48.322-34.92 71.579-58.319 23.217 50.771 101.374 134.887 115.665 152.344z"
                fill="#FDA2A9"
            />
            <Path
                d="M273.702 198.055c-33.14 11.626-59.011 40.302-66.419 49.382-23.896-89.178-90.506-132.763-120.824-143.407 15.752-10.401 48.321-34.92 71.578-58.319 23.217 50.771 101.374 134.887 115.665 152.344z"
                fill="url(#paint1_linear_3406_4550)"
                fillOpacity={0.24}
                style={{
                    mixBlendMode: "multiply"
                }}
            />
            <Path
                d="M272.793 198.055c-33.14 11.626-59.011 40.302-66.42 49.382-23.895-89.178-90.505-132.763-120.824-143.407 15.753-10.401 48.322-34.92 71.579-58.319 23.217 50.771 101.374 134.887 115.665 152.344z"
                fill="url(#paint2_linear_3406_4550)"
                fillOpacity={0.08}
            />
            <Path
                d="M239.588 204.752c-35.02 2.653-67.431 23.656-76.938 30.51 0-92.325-53.06-151.664-79.59-169.793 17.908-5.97 55.713-21.224 84.233-37.805 9.286 55.05 63.009 156.527 72.295 177.088z"
                fill="#FD5662"
            />
            <Ellipse
                cx={168.35}
                cy={130.371}
                rx={13.9353}
                ry={30.5097}
                transform="rotate(-26.98 168.35 130.371)"
                fill="#FD3C4A"
            />
            <Path
                d="M239.588 204.752c-35.02 2.653-67.431 23.656-76.938 30.51 0-92.325-53.06-151.664-79.59-169.793 17.908-5.97 55.713-21.224 84.233-37.805 9.286 55.05 63.009 156.527 72.295 177.088z"
                fill="url(#paint3_linear_3406_4550)"
                fillOpacity={0.64}
            />
            <Path
                d="M239.588 204.752c-35.02 2.653-67.431 23.656-76.938 30.51 0-92.325-53.06-151.664-79.59-169.793 17.908-5.97 55.713-21.224 84.233-37.805 9.286 55.05 63.009 156.527 72.295 177.088z"
                fill="url(#paint4_linear_3406_4550)"
                fillOpacity={0.64}
            />
            <Path
                d="M184.658 74.006c-10.516.482-22.814 12.753-30.05 21.798-1.187 1.483-1.78 2.225-2.349 3.362-.434.869-.892 2.237-1.068 3.192-.23 1.25-.201 2.245-.144 4.233.445 15.407 4.873 49.679 44.961 64.61 2.108.785 3.162 1.178 4.709 1.331 1.165.116 2.958-.016 4.094-.3 1.509-.377 2.572-.961 4.698-2.131 10.017-5.508 28.03-16.605 27.489-24.922-.747-11.503-36.638-71.892-52.34-71.173z"
                fill="#FEE3C8"
            />
            <Path
                d="M184.658 74.006c-10.517.482-22.814 12.753-30.05 21.798-1.188 1.484-1.781 2.226-2.35 3.364-.434.868-.892 2.237-1.068 3.193-.23 1.25-.201 2.243-.144 4.23.44 15.124 4.778 48.318 43.649 64.675 2.204.927 3.306 1.39 4.924 1.599 1.225.157 3.095.059 4.297-.225 1.588-.376 2.721-1 4.989-2.247 10.345-5.69 28.63-16.952 28.093-25.214-.747-11.503-36.638-71.892-52.34-71.173z"
                fill="url(#paint5_linear_3406_4550)"
                fillOpacity={0.64}
                style={{
                    mixBlendMode: "multiply"
                }}
            />
            <G
                style={{
                    mixBlendMode: "overlay"
                }}
                filter="url(#filter0_i_3406_4550)"
            >
                <Path
                    d="M184.657 74.006c-10.516.482-22.813 12.753-30.049 21.798-1.163 1.454-1.745 2.18-2.319 3.338-.431.87-.898 2.293-1.067 3.25-.224 1.272-.184 2.25-.105 4.205.711 17.656 5.988 48.766 43.56 64.644 2.215.936 3.323 1.404 4.944 1.614 1.229.16 3.099.063 4.305-.222 1.591-.376 2.729-1.002 5.005-2.254 10.351-5.695 28.604-16.945 28.067-25.2-.747-11.503-36.638-71.892-52.341-71.173z"
                    fill="url(#paint6_linear_3406_4550)"
                    fillOpacity={0.4}
                />
            </G>
            <Path
                d="M228.01 131c-7.923 9.018-27.015 27.844-40 31M214.01 113c-8.517 9.018-29.041 27.844-43 31M200.01 92c-8.121 9.018-27.69 27.844-41 31"
                stroke="#FFCF99"
                strokeWidth={2}
                strokeLinecap="round"
            />
            <G filter="url(#filter1_i_3406_4550)">
                <Path
                    d="M82.376 181.035c-4.775 14.857-30.9 39.026-47.703 50.965l50.356-23.772 28.191-21.634c15.883-12.19 18.763-35.001 6.406-50.756-2.089-2.664-1.154-6.579 1.914-8.011l13.897-6.485c13.265 1.326 21.224 12.602 31.173 13.265 9.948.663 15.254-5.306 13.265-17.245-1.99-11.938-37.806-38.468-55.714-32.499-25.203 9.285-44.438 33.826-47.09 44.438-2.654 10.612 11.275 33.163 5.305 51.734z"
                    fill="#FEE3C8"
                />
            </G>
            <Mask
                style={{
                    maskType: "alpha"
                }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={312}
                height={312}
            >
                <Rect width={312} height={312} rx={40} fill="#C4C4C4" />
            </Mask>
            <Defs>
                <LinearGradient
                    id="paint0_linear_3406_4550"
                    x1={200.456}
                    y1={115.876}
                    x2={129.488}
                    y2={202.762}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#F9CC9F" />
                    <Stop offset={1} stopColor="#FEE3C8" />
                </LinearGradient>
                <LinearGradient
                    id="paint1_linear_3406_4550"
                    x1={94.1738}
                    y1={68}
                    x2={271.674}
                    y2={238}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#6F20FF" stopOpacity={0} />
                    <Stop offset={0.0001} stopColor="#6F20FF" stopOpacity={0} />
                    <Stop offset={0.385417} stopColor="#5B18D3" stopOpacity={0.64} />
                    <Stop offset={0.65625} stopColor="#421396" stopOpacity={0.64} />
                    <Stop offset={1} stopColor="#6E20FF" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint2_linear_3406_4550"
                    x1={102.295}
                    y1={91.9991}
                    x2={260.812}
                    y2={214.701}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopOpacity={0.66} />
                    <Stop offset={0.651042} stopOpacity={0.67} />
                    <Stop offset={1} stopOpacity={0.04} />
                </LinearGradient>
                <LinearGradient
                    id="paint3_linear_3406_4550"
                    x1={96.6731}
                    y1={56}
                    x2={239.673}
                    y2={201}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#fff" />
                </LinearGradient>
                <LinearGradient
                    id="paint4_linear_3406_4550"
                    x1={116.223}
                    y1={131.794}
                    x2={201.119}
                    y2={125.162}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#fff" />
                    <Stop offset={0.348958} stopColor="#E3E3E3" stopOpacity={0.64} />
                    <Stop offset={0.583333} stopColor="#636363" stopOpacity={0.32} />
                    <Stop offset={0.979167} stopColor="#fff" stopOpacity={0.32} />
                </LinearGradient>
                <LinearGradient
                    id="paint5_linear_3406_4550"
                    x1={221.691}
                    y1={108.195}
                    x2={167.167}
                    y2={155.83}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#F9DB9F" />
                    <Stop offset={0.53125} stopColor="#FEE3C8" />
                    <Stop offset={1} stopColor="#F9DB9F" />
                </LinearGradient>
                <LinearGradient
                    id="paint6_linear_3406_4550"
                    x1={221.296}
                    y1={96.2926}
                    x2={166.672}
                    y2={152.358}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#fff" stopOpacity={0.963542} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
            </Defs>
        </Svg>
    )
}

export default SvgComponent
