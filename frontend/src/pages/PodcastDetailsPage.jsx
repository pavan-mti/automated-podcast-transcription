import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ArrowUp } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import TranscriptSegment from '../components/TranscriptSegment';
import SearchFilter from '../components/SearchFilter';
import KeywordCloud from '../components/KeywordCloud';
import { fetchSegments } from '../services/api';
import SentimentTimeline from '../components/SentimentTimeline';

/* 🔹 mm:ss formatter (for exports only) */
const formatTime = (seconds) => {
  if (seconds == null || isNaN(seconds)) return '--:--';

  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const PodcastDetailsPage = () => {
  const { id: podcastId } = useParams();

  const [segments, setSegments] = useState([]);
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('keywords');

  const exportRef = useRef(null);
  const transcriptRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const podcastRes = await fetch(
          `http://localhost:5000/api/podcasts/${podcastId}`
        );
        const podcastData = await podcastRes.json();
        setPodcast(podcastData);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setShowExportOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const params = [];
    if (searchQuery) params.push(`search=${searchQuery}`);
    if (keywordFilter) params.push(`keyword=${keywordFilter}`);

    const query = params.length ? `?${params.join('&')}` : '';

    fetchSegments(podcastId, query)
      .then(data => setSegments(data || []))
      .catch(err => console.error(err));
  }, [searchQuery, keywordFilter, podcastId]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleKeywordClick = (keyword) => {
    setKeywordFilter(keyword);

    setTimeout(() => {
      transcriptRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* 🔹 TXT export content */
  const buildTextContent = () => {
    return segments.map((s, i) => (
      `Segment ${i + 1}
Time: ${formatTime(s.start_time)} - ${formatTime(s.end_time)}

Text:
${s.text}

Summary:
${s.summary}

Keywords:
${(s.keywords || []).join(', ')}

------------------------------------
`
    )).join('\n');
  };

  const exportTXT = () => {
    const blob = new Blob([buildTextContent()], { type: 'text/plain' });
    downloadBlob(blob, 'txt');
  };

  const exportJSON = () => {
    const blob = new Blob(
      [JSON.stringify(segments, null, 2)],
      { type: 'application/json' }
    );
    downloadBlob(blob, 'json');
  };

  const exportPDF = () => {
    const printWindow = window.open('', '_blank');

    const html = `
      <html>
        <head>
          <title>${podcast?.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { margin-bottom: 16px; }
            h2 { margin-top: 24px; }
            .segment { margin-bottom: 20px; }
            .meta { color: #555; font-size: 14px; }
            .keywords { font-style: italic; color: #444; }
            hr { margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>${podcast?.title}</h1>

          ${segments.map((s, i) => `
            <div class="segment">
              <h2>Segment ${i + 1}</h2>
              <div class="meta">
                Time: ${formatTime(s.start_time)} - ${formatTime(s.end_time)}
              </div>

              <p><strong>Text:</strong><br/>${s.text}</p>
              <p><strong>Summary:</strong><br/>${s.summary}</p>
              <p class="keywords">
                <strong>Keywords:</strong> ${(s.keywords || []).join(', ')}
              </p>
              <hr/>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const downloadBlob = (blob, ext) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${podcast?.title || 'podcast'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportOptions(false);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        Loading transcript…
      </div>
    );
  }

  const title = podcast?.title || 'Podcast';

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
              {segments.length} segments
            </p>
          </div>

          <div className="relative" ref={exportRef}>
            <button
              className="btn-secondary flex items-center gap-2"
              onClick={() => setShowExportOptions(!showExportOptions)}
            >
              <Download size={16} /> Export
            </button>

            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-50">
                <button className="block w-full px-4 py-2 text-left hover:bg-muted" onClick={exportTXT}>TXT</button>
                <button className="block w-full px-4 py-2 text-left hover:bg-muted" onClick={exportPDF}>PDF</button>
                <button className="block w-full px-4 py-2 text-left hover:bg-muted" onClick={exportJSON}>JSON</button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AudioPlayer title={title} audioUrl={podcast?.audioUrl} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6" ref={transcriptRef}>
            <div className="sticky top-24 z-10 bg-background pb-4">
              <SearchFilter
                searchQuery={searchQuery}
                keywordFilter={keywordFilter}
                onSearchChange={setSearchQuery}
                onKeywordChange={setKeywordFilter}
              />
            </div>

            <div className="flex gap-6 border-b border-muted pb-2">
              <button
                onClick={() => setActiveTab('keywords')}
                className={`text-sm pb-2 ${
                  activeTab === 'keywords'
                    ? 'border-b-2 border-lime-400 text-lime-400'
                    : 'text-muted-foreground'
                }`}
              >
                Keywords
              </button>

              <button
                onClick={() => setActiveTab('sentiment')}
                className={`text-sm pb-2 ${
                  activeTab === 'sentiment'
                    ? 'border-b-2 border-lime-400 text-lime-400'
                    : 'text-muted-foreground'
                }`}
              >
                Sentiment Analysis
              </button>
            </div>

            {activeTab === 'keywords' && (
              <KeywordCloud
                segments={segments}
                onKeywordClick={handleKeywordClick}
              />
            )}

            {activeTab === 'sentiment' && (
              <SentimentTimeline segments={segments} />
            )}

            {segments.map((seg, index) => (
              <TranscriptSegment
                key={seg.segment_id}
                segment={seg}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white shadow-lg"
        >
          <ArrowUp />
        </button>
      )}
    </div>
  );
};

export default PodcastDetailsPage;
