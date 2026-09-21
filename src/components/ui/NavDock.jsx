import { soundManager } from '../../utils/audio'
import { LayoutGrid, User, FolderGit2, Cpu, Radio } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'bridge', label: 'BRIDGE', index: '01', icon: LayoutGrid, key: '1' },
  { id: 'dossier', label: 'DOSSIER', index: '02', icon: User, key: '2' },
  { id: 'missions', label: 'MISSIONS', index: '03', icon: FolderGit2, key: '3' },
  { id: 'subsystems', label: 'SUBSYSTEMS', index: '04', icon: Cpu, key: '4' },
  { id: 'comms', label: 'TRANSMISSION', index: '05', icon: Radio, key: '5' }
]

export default function NavDock({ activeSection, setActiveSection, mobileMenuOpen, setMobileMenuOpen }) {
  const handleNavClick = (id) => {
    if (activeSection !== id) {
      soundManager.playWarp()
      setActiveSection(id)
      if (mobileMenuOpen) setMobileMenuOpen(false)
    }
  }

  return (
    <nav className={`nav-dock ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="dock-container">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              className={`dock-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              onMouseEnter={() => soundManager.playHover()}
            >
              <div className="dock-btn-glow"></div>
              <span className="dock-index">[{item.index}]</span>
              <Icon size={16} className="dock-icon" />
              <span className="dock-label">{item.label}</span>
              <span className="dock-shortcut">{item.key}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
