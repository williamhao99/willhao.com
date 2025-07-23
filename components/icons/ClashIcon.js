const ClashIcon = ({ className = "", size = 32 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <image
      href="/images/clash-of-clans-icon.png"
      x="0"
      y="0"
      width="32"
      height="32"
      style={{ borderRadius: "4px", objectFit: "cover" }}
    />
  </svg>
);

export default ClashIcon;