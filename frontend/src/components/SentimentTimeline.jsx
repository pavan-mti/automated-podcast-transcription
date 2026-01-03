import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

/**
 * Rolling average smoothing
 */
const smoothSentiment = (values, windowSize = 5) => {
  return values.map((_, index) => {
    const start = Math.max(0, index - Math.floor(windowSize / 2));
    const end = Math.min(values.length, index + Math.floor(windowSize / 2) + 1);

    const slice = values.slice(start, end);
    const avg = slice.reduce((sum, v) => sum + v, 0) / slice.length;

    return Number(avg.toFixed(3));
  });
};

// ✅ Safe seconds → mm:ss
const formatTime = (seconds) => {
  if (seconds == null || isNaN(seconds)) return '--:--';

  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const SentimentTimeline = ({ segments }) => {
  const rawSentiments = segments.map(
    (seg) => seg.sentiment?.score ?? 0
  );

  const smoothed = smoothSentiment(rawSentiments, 5);

  // ✅ FIX: force numeric X-axis values (THIS IS THE KEY)
  const data = segments.map((seg, index) => {
    const rawTime = seg.start_time ?? seg.startTime ?? index * 5;
    const x = Number.parseFloat(rawTime);

    return {
      x: Number.isFinite(x) ? x : index * 5,
      sentiment: smoothed[index],
      segmentId: seg.segment_id ?? seg.segmentId ?? index + 1
    };
  });

  const handleChartClick = (state) => {
    if (!state?.activePayload?.length) return;

    const segmentId = state.activePayload[0].payload.segmentId;
    const el = document.getElementById(`segment-${segmentId}`);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      el.classList.add('ring-2', 'ring-lime-400');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-lime-400');
      }, 1500);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4">
      <h3 className="text-gray-800 text-sm mb-3">
        Sentiment Over Time (Audio Timeline)
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} onClick={handleChartClick}>
          <defs>
            <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="x"
            tickFormatter={formatTime}
            tick={{ fill: '#333', fontSize: 12 }}
          />

          <YAxis
            domain={[-1, 1]}
            ticks={[-1, 0, 1]}
            tick={{ fill: '#333', fontSize: 12 }}
          />

          <ReferenceLine
            y={0}
            stroke="#aaa"
            strokeDasharray="4 4"
          />

          <Tooltip
            labelFormatter={(value) => `Time: ${formatTime(value)}`}
            formatter={(value) => value.toFixed(3)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              color: '#000'
            }}
          />

          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="url(#sentimentGradient)"
            strokeWidth={3}
            dot={false}
            activeDot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentTimeline;
