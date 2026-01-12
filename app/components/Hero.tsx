import { Link } from '@remix-run/react';
import GradientText from './GradientText';

export default function Hero() {
  return (
    <section className="h-[70vh] flex items-center justify-center bg-transparent">
      <div className="text-center px-6">
        <div className="mb-8 drop-shadow-sm">
          <GradientText
            colors={['#E0D8D0', '#C4A484', '#E0D8D0']}
            animationSpeed={6}
            showBorder={false}
            className="font-serif text-7xl md:text-9xl tracking-tight italic"
          >
            Where Essence Meets Elegance
          </GradientText>
        </div>
        <Link to="/collections/new-in" className="inline-block px-12 py-3 border border-[#F0EAE6]/30 text-[#F0EAE6] uppercase tracking-[0.25em] text-[10px] hover:bg-[#F0EAE6] hover:text-[#4A3C31] transition-all duration-500 ease-out">
          Shop The Collection
        </Link>
      </div>
    </section>
  );
}
