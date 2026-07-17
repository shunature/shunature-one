"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut, signIn } from 'next-auth/react';

interface Article {
  id: number;
  title: string;
  content: string;
  published: boolean;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_URL}/articles`);
      const data = await res.json();
      setArticles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content);
    setPublished(article.published);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setPublished(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { article: { title, content, published } };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/articles/${editingId}` : `${API_URL}/articles`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // If creating a new published article, we can trigger Web Push here via Next.js API
        if (!editingId && published) {
           await fetch('/api/push', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ title: 'New Article Published!', body: title }),
           });
        }
        fetchArticles();
        resetForm();
      } else {
        alert('Failed to save article.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`${API_URL}/articles/${id}`, { method: 'DELETE' });
      if (res.ok) fetchArticles();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 md:p-16 font-sans">
      <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-light tracking-wider">CMS Admin</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => signIn('passkey')}
            className="text-xs uppercase tracking-widest px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-lg hover:bg-indigo-600/30 transition-colors"
            title="Register or use a Passkey"
          >
            🔑 Passkey
          </button>
          <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm uppercase tracking-widest">
            ← Back to Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="text-sm uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/15 rounded-lg hover:bg-white/10 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor Form */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-medium mb-6">{editingId ? 'Edit Article' : 'New Article'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-white/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Content</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-white/50 transition-colors min-h-[150px]"
                  required
                />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <input 
                  type="checkbox" 
                  id="published"
                  checked={published}
                  onChange={e => setPublished(e.target.checked)}
                  className="w-4 h-4 accent-white"
                />
                <label htmlFor="published" className="text-sm text-white/80 cursor-pointer">Published</label>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="flex-1 bg-white text-black font-medium py-3 rounded-lg hover:bg-white/80 transition-colors">
                  {editingId ? 'Update' : 'Publish'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-4 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Articles List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-medium mb-6">Articles List</h2>
          <div className="flex flex-col gap-4">
            {articles.map(article => (
              <div key={article.id} className="bg-white/[0.02] border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.05] transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-2 h-2 rounded-full ${article.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <h3 className="font-medium text-lg">{article.title}</h3>
                  </div>
                  <p className="text-sm text-white/50 line-clamp-1 max-w-lg">{article.content}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(article)} className="text-sm px-4 py-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="text-sm px-4 py-2 bg-red-500/20 text-red-300 rounded-md hover:bg-red-500/40 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {articles.length === 0 && (
              <p className="text-white/40">No articles yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
