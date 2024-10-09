export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
      <path
        d="M30,50 A20,20 0 0,1 50,30 A20,20 0 0,1 70,50 A20,20 0 0,1 50,70 A20,20 0 0,1 30,50"
        fill="none"
        stroke="#3498db"
        strokeWidth="6"
      />
      <path
        d="M50,30 A20,20 0 0,1 70,50 A20,20 0 0,1 50,70 A20,20 0 0,1 30,50 A20,20 0 0,1 50,30"
        fill="none"
        stroke="#2980b9"
        strokeWidth="6"
      />

      <path
        d="M40,40 L60,40 L60,60 L40,60 Z"
        fill="#ecf0f1"
        stroke="#34495e"
        strokeWidth="2"
      />
      <path
        d="M40,40 L50,30 L70,30 L60,40"
        fill="#bdc3c7"
        stroke="#34495e"
        strokeWidth="2"
      />
      <path
        d="M60,40 L70,30 L70,50 L60,60"
        fill="#95a5a6"
        stroke="#34495e"
        strokeWidth="2"
      />
    </svg>
  )
}
