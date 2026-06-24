import { AuthenticatedTopbar } from './AuthenticatedTopbar'

type ProducerTopbarProps = {
  onMenuClick: () => void
}

export function ProducerTopbar({ onMenuClick }: ProducerTopbarProps) {
  return <AuthenticatedTopbar onMenuClick={onMenuClick} />
}
