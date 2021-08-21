import { FC } from 'react';

type ArrowbuttonProps = {
  text: string;
  onClick?: () => void;
  variant: 'clickable' | 'clicked' | 'unclickable';
  className?: string;
};

/**
 * Component handling the display of a single arrow button intended for use as a menu button.
 */
const Arrowbutton: FC<ArrowbuttonProps> = (props) => {
  const svgClickable = (
    <svg
      width="130"
      height="79"
      viewBox="0 0 157 73"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
      className={props?.className}
    >
      <g filter="url(#filter0_d)">
        <path
          d="M5.26514 4.70934C3.88574 2.71982 5.3096 0 7.73053 0H125.912C126.905 0 127.834 0.491672 128.393 1.31307L151.853 35.8131C152.545 36.8311 152.545 38.1689 151.853 39.1869L128.393 73.6869C127.834 74.5083 126.905 75 125.912 75H7.73053C5.3096 75 3.88574 72.2802 5.26514 70.2907L26.8149 39.2093C27.5277 38.1812 27.5277 36.8188 26.8149 35.7907L5.26514 4.70934Z"
          fill="#1199AA"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="-2"
          y="0"
          width="159"
          height="83"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
      <text
        textAnchor="middle"
        style={{ fill: 'black' }}
        fontFamily="Roboto"
        fontSize="20"
        fontWeight="bold"
        x="52%"
        y="59%"
      >
        {props.text}
      </text>
    </svg>
  );

  const svgClicked = (
    <svg
      width="130"
      height="79"
      viewBox="0 0 157 73"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props?.className}
    >
      <g filter="url(#filter1_i)">
        <path
          d="M5.26514 4.70934C3.88574 2.71982 5.3096 0 7.73053 0H125.912C126.905 0 127.834 0.491672 128.393 1.31307L151.853 35.8131C152.545 36.8311 152.545 38.1689 151.853 39.1869L128.393 73.6869C127.834 74.5083 126.905 75 125.912 75H7.73053C5.3096 75 3.88574 72.2802 5.26514 70.2907L26.8149 39.2093C27.5277 38.1812 27.5277 36.8188 26.8149 35.7907L5.26514 4.70934Z"
          fill="#D1D2F9"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="-2"
          y="0"
          width="159"
          height="83"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <filter
          id="filter1_i"
          x="4.72534"
          y="0"
          width="147.647"
          height="79"
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
        fontSize="20"
        fontWeight="bold"
        x="52%"
        y="59%"
      >
        {props.text}
      </text>
    </svg>
  );
  const svgUnclickable = (
    <svg
      width="130"
      height="79"
      viewBox="0 0 157 73"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props?.className}
      opacity="50%"
    >
      <g filter="url(#filter0_d)">
        <path
          d="M5.26514 4.70934C3.88574 2.71982 5.3096 0 7.73053 0H125.912C126.905 0 127.834 0.491672 128.393 1.31307L151.853 35.8131C152.545 36.8311 152.545 38.1689 151.853 39.1869L128.393 73.6869C127.834 74.5083 126.905 75 125.912 75H7.73053C5.3096 75 3.88574 72.2802 5.26514 70.2907L26.8149 39.2093C27.5277 38.1812 27.5277 36.8188 26.8149 35.7907L5.26514 4.70934Z"
          fill="#1199AA"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="-2"
          y="0"
          width="159"
          height="83"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
      <text
        textAnchor="middle"
        style={{ fill: 'black' }}
        fontFamily="Roboto"
        fontSize="20"
        fontWeight="bold"
        x="52%"
        y="59%"
      >
        {props.text}
      </text>
    </svg>
  );

  return (
    <span onClick={props.variant === 'clickable' ? props.onClick : undefined}>
      {props.variant === 'clickable'
        ? svgClickable
        : props.variant === 'clicked'
        ? svgClicked
        : svgUnclickable}
    </span>
  );
};
export default Arrowbutton;
