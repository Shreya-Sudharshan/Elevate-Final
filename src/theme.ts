export const theme = {
  colors: {
    // Primary colors
    primaryNavy: '#0B2447',
    sapBlue: '#0A6ED1',
    sapBlueHover: '#0859ab',
    tealAccent: '#00A0AF',
    sunshineYellow: '#FFD23F',
    softLilac: '#E8EAF6',
    
    // Grays
    gray100: '#F5F7FA',
    gray300: '#D6D9E0',
    gray700: '#4A5568',
    
    // Status colors
    success: '#2BA84A',
    warning: '#F59E0B',
    danger: '#E11D48',
    
    // Backgrounds
    background: '#FFFFFF',
    backgroundAlt: '#F8FAFC',
  },
  
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    heading: {
      h1: 'text-[28px] leading-[36px] font-bold',
      h2: 'text-[22px] leading-[30px] font-bold',
      h3: 'text-[18px] leading-[26px] font-semibold',
    },
    body: {
      large: 'text-[15px] leading-[22px]',
      regular: 'text-[14px] leading-[20px]',
      caption: 'text-[13px] leading-[18px]',
    }
  },
  
  components: {
    card: 'bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-5 md:p-6',
    button: {
      primary: 'bg-[#0A6ED1] hover:bg-[#0859ab] text-white font-semibold rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A6ED1] transition-colors',
      secondary: 'bg-white border border-[#D6D9E0] hover:border-[#0A6ED1] text-[#4A5568] font-semibold rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A6ED1] transition-colors',
    },
    xpBadge: 'inline-flex items-center gap-2 bg-[#0A6ED1]/10 text-[#0A6ED1] rounded-full px-3 py-1 font-medium',
    dueSoon: 'px-2 py-0.5 rounded-full text-rose-700 bg-rose-50 text-xs font-medium',
  }
} as const;