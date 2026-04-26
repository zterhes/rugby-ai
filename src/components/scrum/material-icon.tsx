import * as React from "react";

type MaterialIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Material Symbols Outlined icon name (snake_case). */
  name: string;
  /** Renders the filled glyph variant. */
  filled?: boolean;
  /** Optional pixel size shortcut (sets font-size). */
  size?: number;
};

/**
 * Renders a Google "Material Symbols Outlined" icon.
 *
 * Requires the Material Symbols stylesheet to be loaded in <head>
 * (see `src/app/layout.tsx`).
 */
export function MaterialIcon({
  name,
  filled = false,
  size,
  className = "",
  style,
  ...rest
}: MaterialIconProps) {
  const sizeStyle = size ? { fontSize: `${size}px`, ...style } : style;
  const classes = [
    "material-symbols-outlined",
    filled ? "filled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      aria-hidden="true"
      className={classes}
      style={sizeStyle}
      data-icon={name}
      {...rest}
    >
      {name}
    </span>
  );
}
