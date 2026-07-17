"use client";

import { useState } from 'react';

interface Article {
  id: number;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
}

interface BlogSectionProps {
  initialArticles: Article[];
}

export default function BlogSection({ initialArticles }: BlogSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <section id="blog" className="relative min-h-screen bg-black px-8 md:px-24 py-32 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs tracking-[0.4em] text-white/40 uppercase mb-4 block">
            Journal
          </span>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight">Latest Articles</h2>
        </div>

        {initialArticles.length === 0 ? (
          <div className="p-12 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
            <p className="text-white/50 text-lg">No articles found. Make sure the CMS API is running on port 3001.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialArticles.map((article) => (
              <article 
                key={article.id} 
                onClick={() => setSelectedArticle(article)}
                className="group p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className="text-white/40 font-mono text-xs mb-4">
                  {new Date(article.created_at).toLocaleDateString('ja-JP')}
                </div>
                <h3 className="text-xl font-medium mb-4 line-clamp-2 group-hover:text-white/80 transition-colors">
                  {article.title}
                </h3>
                <p className="text-white/60 text-sm line-clamp-3 leading-relaxed">
                  {article.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/15 rounded-3xl p-8 md:p-12 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedArticle(null)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <span className="font-mono text-xs tracking-wider text-white/40 block mb-6">
              {new Date(selectedArticle.created_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            
            <h3 className="text-2xl md:text-4xl font-medium tracking-tight mb-8 leading-snug">
              {selectedArticle.title}
            </h3>

            <div className="w-12 h-px bg-white/20 mb-8" />

            <div className="text-white/80 font-light leading-relaxed whitespace-pre-wrap text-base md:text-lg">
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
