import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

/**
 * Register only the Chart.js components actually used by the Dashboard.
 * Importing from `chart.js` (rather than the CDN global) keeps the bundle
 * tree-shakeable and type-safe.
 */
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

export { Chart };
