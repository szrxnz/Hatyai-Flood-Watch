import Logo from '@/components/Logo'

export default function Loader({ text, size = 84 }: { text: string; size?: number }) {
  return (
    <div className="ldr" role="status" aria-live="polite">
      <div className="ldrring" style={{ width: size + 36, height: size + 36 }}>
        <i /><i /><Logo size={size} />
      </div>
      <p>{text}</p>
      <div className="ldrdots" aria-hidden="true"><b /><b /><b /></div>
    </div>
  )
}
