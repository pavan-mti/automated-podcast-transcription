import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import TranscriptSegment from '../components/TranscriptSegment';
import SearchFilter from '../components/SearchFilter';
import { fetchSegments } from '../services/api';

const PodcastDetailsPage = () => {
  const { id: podcastId } = useParams();

  const [segments, setSegments] = useState([]);
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');

  /* ===============================
     INITIAL LOAD
     =============================== */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // Fetch podcast metadata
        const podcastRes = await fetch(
          `http://localhost:5000/api/podcasts/${podcastId}`
        );
        const podcastData = await podcastRes.json();
        setPodcast(podcastData);

        // Fetch segments
        const data = await fetchSegments(podcastId);
        setSegments(data || []);
      } catch (err) {
        console.error('Failed to fetch podcast details', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [podcastId]);

  /* ===============================
     SEARCH / FILTER
     =============================== */
  useEffect(() => {
    const params = [];
    if (searchQuery) params.push(`search=${searchQuery}`);
    if (keywordFilter) params.push(`keyword=${keywordFilter}`);

    const query = params.length ? `?${params.join('&')}` : '';

    fetchSegments(podcastId, query)
      .then(data => setSegments(data || []))
      .catch(err => console.error(err));
  }, [searchQuery, keywordFilter, podcastId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        Loading transcript…
      </div>
    );
  }

  /* ===============================
     DERIVED METADATA
     =============================== */
  const title = podcast?.title || 'Podcast';
  const audioUrl = podcast?.audioUrl || '';
  const duration =
    segments.length > 0
      ? Math.ceil(segments[segments.length - 1].endTime)
      : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="container mx-auto max-w-5xl">

        <Link to="/dashboard" className="inline-flex items-center gap-2 mb-6">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">
              {segments.length} segments • {Math.floor(duration / 60)} minutes
            </p>
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary">
              <Share2 size={16} /> Share
            </button>
            <button className="btn-secondary">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Audio */}
          <div className="lg:col-span-1">
            <AudioPlayer title={title} audioUrl={audioUrl} />
          </div>

          {/* Transcript */}
          <div className="lg:col-span-2 space-y-6">
            <SearchFilter
              searchQuery={searchQuery}
              keywordFilter={keywordFilter}
              onSearchChange={setSearchQuery}
              onKeywordChange={setKeywordFilter}
            />

            {segments.length > 0 ? (
              segments.map((seg, index) => (
                <TranscriptSegment
                  key={seg._id}
                  segment={seg}
                  index={index}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No segments available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastDetailsPage;
