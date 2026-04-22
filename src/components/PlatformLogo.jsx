import { PLATFORM_LOGOS } from '@/lib/platformLogos'

/**
 * PlatformLogo — Show platform's real logo with fallback to initials
 * @param {string} platform - key From PLATFORM_LOGOS
 * @param {number} size - Icon size (px)
 * @param {string} fallback - Fallback text (if none logo)
 * @param {string} className - CSS class AddFill
 */
export default function PlatformLogo({ platform, size = 32, fallback, className = '' }) {
  const src = PLATFORM_LOGOS[platform]
  const initials = fallback
    ? fallback.slice(0, 2).toUpperCase()
    : platform.slice(0, 2).toUpperCase()

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded bg-gray-200 text-gray-600 font-bold text-xs ${className}`}
        style={{ width: size, height: size, minWidth: size }}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={fallback || platform}
      width={size}
      height={size}
      className={`rounded object-contain ${className}`}
      style={{ width: size, height: size, minWidth: size }}
      onError={(e) => {
        e.target.replaceWith(
          Object.assign(document.createElement('div'), {
            className: `flex items-center justify-center rounded bg-gray-200 text-gray-600 font-bold text-xs`,
            style: `width:${size}px;height:${size}px;min-width:${size}px;display:flex;align-items:center;justify-content:center`,
            textContent: initials,
          })
        )
      }}
    />
  )
}
