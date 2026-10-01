// Le logo devlab. — un mot, un point. Le « v » est légèrement ouvert pour ne pas toucher le « l ».
export function Dot({ className = 'bg-encre' }) {
  return <span aria-hidden="true" className={`ml-[0.06em] inline-block size-[0.17em] rounded-full ${className}`} />
}

export default function Logo({ className = '', dotClassName = 'bg-encre' }) {
  return (
    <span role="img" aria-label="devlab." className={`inline-flex items-baseline font-extrabold leading-none tracking-[-0.035em] ${className}`}>
      <span aria-hidden="true">
        de<span className="mr-[0.035em]">v</span>lab
      </span>
      <Dot className={dotClassName} />
    </span>
  )
}
