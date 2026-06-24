import { AuthenticatedTopbar } from './AuthenticatedTopbar'

type ConsumerTopbarProps = {
  onMenuClick: () => void
}

export function ConsumerTopbar({ onMenuClick }: ConsumerTopbarProps) {
  return <AuthenticatedTopbar onMenuClick={onMenuClick} />
}
