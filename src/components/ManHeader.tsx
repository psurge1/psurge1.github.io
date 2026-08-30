type ManHeaderProps = {
  name: string
}

export function ManHeader({ name }: ManHeaderProps) {
  const pageLabel = `${name.toUpperCase()}(1)`

  return (
    <header className="man-header">
      <span>{pageLabel}</span>
      <span>portfolio</span>
      <span>{pageLabel}</span>
    </header>
  )
}
