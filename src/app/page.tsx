import Navbar from '@/components/Navbar';
import Image from 'next/image';
import BlogSection from '@/components/BlogSection';

export const dynamic = 'force-dynamic';

interface Article {
  id: number;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
}

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch('http://localhost:3001/articles', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    return data.filter((a: Article) => a.published);
  } catch (error) {
    console.error('API fetch error:', error);
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30 font-sans">
      <Navbar />
      
      {/* Hero / Identity Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-24 py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2629&auto=format&fit=crop"
            alt="Background gradient"
            fill
            className="object-cover opacity-40 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl animate-fade-in-up">
          <span className="font-mono text-xs tracking-[0.6em] text-white/40 uppercase mb-6 block">
            square fractal
          </span>
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tighter mb-8 leading-tight">
            Shun "Sqlio" <br /> Tonegawa
          </h1>
          <p className="text-white/60 font-light max-w-md text-lg leading-relaxed mb-12">
            よく言えば、真面目。<br />それと、広く深い知識。
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="#blog" className="px-8 py-3 bg-white text-black text-sm tracking-widest uppercase rounded-full hover:bg-white/80 transition-colors">
              Read Blog
            </a>
            <a href="mailto:contact@ffnet.work" className="px-8 py-3 bg-white/10 text-white border border-white/20 text-sm tracking-widest uppercase rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection initialArticles={articles} />
      
      {/* Footer */}
      <footer className="py-8 text-center text-white/30 text-sm border-t border-white/10 relative z-10 bg-black">
        <p>&copy; {new Date().getFullYear()} Shun "Sqlio" Tonegawa</p>
      </footer>
    </main>
  );
}
