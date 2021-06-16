import Link from 'next/link';
import styles from './Menu.module.css';
const Menu: React.FunctionComponent = () => {
  return (
    <div className={styles.menuRect} style={{ textDecoration: 'none', color: 'black' }}>
      <Link href="/">
        <div className={styles.banner}>
          <b>ComboStats</b>
        </div>
      </Link>
      <div className={styles.menuButtons}>
        {/* Here the logo will be displayed */}
        {/* {<img src={logo} alt="Noe" id="logo" />} */}
        <Link href="/population">
          <div className={styles.menuButton1}>
            <svg width="183" height="66" viewBox="0 0 183 66" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d)">
                <path d="M4 0H147.182L179 29L147.182 58H4L34.7576 29L4 0Z" fill="#FF5C5F" />
                <text x="53" y="35" fontFamily="Roboto" fontWeight="bold" fontSize="19" fill="black">
                  Build Pool
                </text>
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="0"
                  y="0"
                  width="183"
                  height="66"
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
            </svg>
          </div>
        </Link>

        <Link href="/successes">
          <div className={styles.menuButton}>
            <svg width="183" height="66" viewBox="0 0 183 66" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d)">
                <path d="M4 0H147.182L179 29L147.182 58H4L34.7576 29L4 0Z" fill="#FF5C5F" />
                <text x="40" y="35" fontFamily="Roboto" fontWeight="bold" fontSize="19" fill="black">
                  Select Successes
                </text>
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="0"
                  y="0"
                  width="183"
                  height="66"
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
            </svg>
          </div>
        </Link>

        <Link href="/more">
          <div className={styles.menuButton}>
            <svg width="183" height="66" viewBox="0 0 183 66" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d)">
                <path d="M4 0H147.182L179 29L147.182 58H4L34.7576 29L4 0Z" fill="#FF5C5F" />
                <text x="40" y="35" fontFamily="Roboto" fontWeight="bold" fontSize="19" fill="black">
                  Other Features
                </text>
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="0"
                  y="0"
                  width="183"
                  height="66"
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
            </svg>
          </div>
        </Link>

        <Link href="/calculate">
          <div className={styles.menuButton}>
            <svg width="183" height="66" viewBox="0 0 183 66" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d)">
                <path d="M4 0H147.182L179 29L147.182 58H4L34.7576 29L4 0Z" fill="#FF5C5F" />
                <text x="40" y="35" fontFamily="Roboto" fontWeight="bold" fontSize="19" fill="black">
                  Calculate Stats
                </text>
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="0"
                  y="0"
                  width="183"
                  height="66"
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
            </svg>
          </div>{' '}
        </Link>
      </div>
    </div>
  );
};

export default Menu;
