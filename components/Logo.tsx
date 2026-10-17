import { Ic } from '@/components/Icons'

export default function Logo({ size = 84 }: { size?: number }) {
  return <span className="logo" style={{ width: size, height: size }}><Ic n="wave" /></span>
}
