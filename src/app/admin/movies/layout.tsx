import Link from 'next/link';
import { pageStyle } from './adminMovieStyles';

export const metadata = { title: 'Admin Movies' };

export default function AdminMoviesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: pageStyle.background, color: pageStyle.color, minHeight: '100vh', padding: pageStyle.padding }}>
      <div style={{ maxWidth: pageStyle.maxWidth, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}
