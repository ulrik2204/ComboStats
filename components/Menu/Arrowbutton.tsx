import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';

type ArrowbuttonProps = {
  text: string;
  onClick: () => void;
  clicked: boolean;
  className?: string;
};
const Arrowbutton: FC<ArrowbuttonProps> = (props) => {
  const router = useRouter();

  const svgNotClicked = (
    <svg
      width="153"
      height="75"
      viewBox="0 0 96 39"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
      className={props?.className}
    >
      <g filter="url(#filter0_d)">
        <path d="M4 0H77.6364L94 20L77.6364 40H4L19.8182 20L4 0Z" fill="#FF5C5F" />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0"
          width="98"
          height="48"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
      <text textAnchor="middle" fontFamily="Roboto" fontSize="12" fontWeight="bold" x="54%" y="59%">
        {props.text}
      </text>
    </svg>
  );
  const svgClicked = (
    <svg
      width="153"
      height="75"
      viewBox="0 0 96 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
      className={props?.className}
    >
      <g filter="url(#filter1_i)">
        <path d="M4 0H77.6364L94 20L77.6364 40H4L19.8182 20L4 0Z" fill="#D1D2F9" />
      </g>
      <defs>
        <filter
          id="filter1_i"
          x="4"
          y="0"
          width="90"
          height="44"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>
      <text
        textAnchor="middle"
        style={{ fill: 'black' }}
        fontFamily="Roboto"
        fontSize="12"
        fontWeight="bold"
        x="54%"
        y="59%"
      >
        {props.text}
      </text>
    </svg>
  );
  return <span onClick={props.onClick}>{props.clicked ? svgClicked : svgNotClicked}</span>;
};
export default Arrowbutton;
