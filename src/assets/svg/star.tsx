import * as React from 'react';
import Svg, { Defs, G, Path, Polygon } from 'react-native-svg';
import { colors } from '../styles/global';

interface Props {
    opacity?: number;
    fill?: string;
    size?: number;
}

export default function SvgStar({ fill = 'gold', size = 100, opacity = 1 }: Props) {
    return (
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* <Defs>
                <filter stroke="null" id="svg_4_blur">
                    <feGaussianBlur stroke="null" stdDeviation="1" in="SourceGraphic" />
                </filter>
            </Defs>
            <G stroke="null">
                <title>Layer 1</title>
                <Path
                    stroke="null"
                    id="svg_1"
                    fill="#ED8A19"
                    d="m109.36979,6.55483l22.4809,45.55219c1.56331,3.1682 4.58599,5.36348 8.08265,5.87073l50.27123,7.30515c8.80609,1.28058 12.31938,12.09902 5.94973,18.30653l-36.37606,35.4572c-2.52791,2.46554 -3.68376,6.02041 -3.08504,9.50043l8.58573,50.0675c1.5051,8.76867 -7.70013,15.45432 -15.57489,11.31737l-44.9618,-23.63675c-3.12662,-1.64231 -6.86443,-1.64231 -9.99105,0l-44.9618,23.63675c-7.87476,4.14111 -17.07999,-2.54869 -15.57489,-11.31737l8.58573,-50.0675c0.59871,-3.48003 -0.55714,-7.0349 -3.08504,-9.50043l-36.37606,-35.4572c-6.36966,-6.21166 -2.85637,-17.0301 5.94973,-18.30653l50.27123,-7.30515c3.49666,-0.50724 6.51934,-2.70253 8.08265,-5.87073l22.4809,-45.55219c3.93322,-7.9787 15.3088,-7.9787 19.24618,0z"
                />
                <Path
                    transform="rotate(-56.1918 163.533 182.994)"
                    stroke="#ffffff"
                    opacity="0.3"
                    id="svg_4"
                    d="m353.87166,296.33684l-82.40047,-151.75037c-29.16803,-57.1767 -122.71892,-90.55225 -181.48143,-67.63926l-116.79473,45.27042"
                    fill="#ffffff"
                />
            </G> */}
            {/* <Polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={fill}
                stroke={colors.red}
                stroke-width="1.3"
                opacity={opacity}
            /> */}
            <Path
                fill={fill}
                stroke="black"
                strokeWidth="1.3"
                opacity={opacity}
                d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
	c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
	c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
	c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
	c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
	C22.602,0.567,25.338,0.567,26.285,2.486z"
            />
            <animateTransform
                additive="sum"
                origin="center"
                attributeName="transform"
                attributeType="XML"
                type="scale"
                from="2 2"
                to="1 1"
                begin="0s"
                dur="0.5s"
                fill="freeze"
                accumulate="none"
                transform-origin="50% 50%"
            />
        </Svg>
    );
}
