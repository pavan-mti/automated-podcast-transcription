import { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import PodcastCard from '../components/PodcastCard';
import EmptyState from '../components/EmptyState';
import { fetchPodcasts } from '../services/api';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        const data = await fetchPodcasts();

        const adapted = data.map(p => ({
          id: p._id,
          title: p.title || p.fileName || 'Untitled Podcast',
          duration: p.duration || 0,
          date: p.createdAt,
          segmentCount: 0, // will be computed later
          status: p.status || 'processing'
        }));

        setPodcasts(adapted);
      } catch (error) {
        console.error('Failed to fetch podcasts', error);
      } finally {
        setLoading(false);
      }
    };

    loadPodcasts();
  }, []);

  const filteredPodcasts = podcasts.filter(podcast =>
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Loading podcasts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Podcasts</h1>
            <p className="text-muted-foreground mt-1">
              {podcasts.length} podcast{podcasts.length !== 1 ? 's' : ''} processed
            </p>
          </div>
          <Link to="/" className="btn-primary flex items-center gap-2 self-start">
            <Plus className="h-5 w-5" />
            Upload New
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>

        {/* Podcast List */}
        {filteredPodcasts.length > 0 ? (
          <div className="space-y-4">
            {filteredPodcasts.map(podcast => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        ) : podcasts.length > 0 ? (
          <EmptyState
            title="No matching podcasts"
            description={`No podcasts found matching "${searchQuery}"`}
          />
        ) : (
          <EmptyState
            title="No podcasts yet"
            description="Upload your first podcast to get started with AI-powered transcription and analysis."
            actionLabel="Upload Podcast"
            actionPath="/"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
