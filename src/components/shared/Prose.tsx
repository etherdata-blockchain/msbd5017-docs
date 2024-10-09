import clsx from 'clsx'

export function Prose<T extends React.ElementType = 'div'>({
  as,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'> & {
  as?: T
  className?: string
}) {
  let Component = as ?? 'div'

  return (
    <div className="flex">
      <Component
        className={clsx(
          className,
          'prose dark:prose-invert lg:!max-w-6xl',
          'mx-auto',
        )}
        {...props}
      />
    </div>
  )
}
