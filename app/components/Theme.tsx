
// ============================================================================
// DESIGN TOKENS & THEME
// ============================================================================

export const tokens = {
    colors: {
        ivory: '#FDFBF7',
        cream: '#F8F6F1',
        warmGray: '#E8E4DD',
        midGray: '#9A9590',
        charcoal: '#3D3A36',
        black: '#1A1917',
        gold: '#C4A962',
    },
    fonts: {
        serif: '"Cormorant Garamond", "Times New Roman", serif',
        sans: '"DM Sans", "Helvetica Neue", sans-serif',
    },
    timing: {
        fast: '0.2s',
        medium: '0.4s',
        slow: '0.6s',
        luxe: '0.8s',
    },
    easing: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
};

// ============================================================================
// ICON COMPONENTS
// ============================================================================

export const Icons = {
    Menu: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    Close: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
    ),
    Search: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10" cy="10" r="7" />
            <line x1="15" y1="15" x2="21" y2="21" />
        </svg>
    ),
    User: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
    ),
    Heart: ({ filled = false }: { filled?: boolean }) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z" />
        </svg>
    ),
    Bag: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6h12l1 15H5L6 6z" />
            <path d="M9 6V5a3 3 0 0 1 6 0v1" />
        </svg>
    ),
    ChevronRight: ({ className }: { className?: string }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`rtl:rotate-180 transition-transform duration-300 ${className || ''}`}>
            <path d="M9 6l6 6-6 6" />
        </svg>
    ),
    ChevronLeft: ({ className }: { className?: string }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`rtl:rotate-180 transition-transform duration-300 ${className || ''}`}>
            <path d="M15 6l-6 6 6 6" />
        </svg>
    ),
    ChevronDown: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
        </svg>
    ),
    Pause: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
        </svg>
    ),
    Play: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
        </svg>
    ),
    Filter: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="8" y1="18" x2="16" y2="18" />
        </svg>
    ),
    Eye: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <ellipse cx="12" cy="12" rx="9" ry="6" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    EyeOff: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3l18 18" />
            <path d="M10.5 10.5a3 3 0 0 0 4 4" />
            <path d="M7.5 7.5C5 9 3 12 3 12s3 6 9 6c1.5 0 2.8-.3 4-.9" />
            <path d="M21 12s-3-6-9-6c-.5 0-1 0-1.5.1" />
        </svg>
    ),
    Truck: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 16V6H2v10h14z" />
            <path d="M16 8h4l2 4v4h-6" />
            <circle cx="6" cy="18" r="2" />
            <circle cx="18" cy="18" r="2" />
        </svg>
    ),
    Globe: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <ellipse cx="12" cy="12" rx="4" ry="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
    ),
    Mail: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 6l10 7 10-7" />
        </svg>
    ),
    Plus: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    Minus: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
};
