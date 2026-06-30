'use strict';

// ═══════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════

const BINANCE_BASE  = 'https://api.binance.com/api/v3';
const CHART_REFRESH = 20_000;
const TREND_REFRESH = 5 * 60_000;

// Top-100 non-stablecoin cryptos (BTC first, then by approx. market cap)
const TOP_BASES = [
  { id: 'BTC',    name: 'Bitcoin'            },
  { id: 'ETH',    name: 'Ethereum'           },
  { id: 'BNB',    name: 'BNB'                },
  { id: 'SOL',    name: 'Solana'             },
  { id: 'XRP',    name: 'XRP'                },
  { id: 'ADA',    name: 'Cardano'            },
  { id: 'DOGE',   name: 'Dogecoin'           },
  { id: 'AVAX',   name: 'Avalanche'          },
  { id: 'TRX',    name: 'TRON'               },
  { id: 'TON',    name: 'Toncoin'            },
  { id: 'LINK',   name: 'Chainlink'          },
  { id: 'DOT',    name: 'Polkadot'           },
  { id: 'SHIB',   name: 'Shiba Inu'          },
  { id: 'LTC',    name: 'Litecoin'           },
  { id: 'BCH',    name: 'Bitcoin Cash'       },
  { id: 'UNI',    name: 'Uniswap'            },
  { id: 'NEAR',   name: 'NEAR Protocol'      },
  { id: 'APT',    name: 'Aptos'              },
  { id: 'ICP',    name: 'Internet Computer'  },
  { id: 'ETC',    name: 'Ethereum Classic'   },
  { id: 'ATOM',   name: 'Cosmos'             },
  { id: 'HBAR',   name: 'Hedera'             },
  { id: 'XLM',    name: 'Stellar'            },
  { id: 'ARB',    name: 'Arbitrum'           },
  { id: 'FIL',    name: 'Filecoin'           },
  { id: 'OP',     name: 'Optimism'           },
  { id: 'INJ',    name: 'Injective'          },
  { id: 'MKR',    name: 'Maker'              },
  { id: 'VET',    name: 'VeChain'            },
  { id: 'AAVE',   name: 'Aave'               },
  { id: 'STX',    name: 'Stacks'             },
  { id: 'RNDR',   name: 'Render'             },
  { id: 'GRT',    name: 'The Graph'          },
  { id: 'ALGO',   name: 'Algorand'           },
  { id: 'LDO',    name: 'Lido DAO'           },
  { id: 'SAND',   name: 'The Sandbox'        },
  { id: 'MANA',   name: 'Decentraland'       },
  { id: 'AXS',    name: 'Axie Infinity'      },
  { id: 'CRO',    name: 'Cronos'             },
  { id: 'EGLD',   name: 'MultiversX'         },
  { id: 'XTZ',    name: 'Tezos'              },
  { id: 'CHZ',    name: 'Chiliz'             },
  { id: 'FTM',    name: 'Fantom'             },
  { id: 'THETA',  name: 'Theta'              },
  { id: 'COMP',   name: 'Compound'           },
  { id: 'SNX',    name: 'Synthetix'          },
  { id: 'SUI',    name: 'Sui'                },
  { id: 'IMX',    name: 'ImmutableX'         },
  { id: 'SEI',    name: 'Sei'                },
  { id: 'WLD',    name: 'Worldcoin'          },
  { id: 'POL',    name: 'Polygon'            },
  { id: 'PEPE',   name: 'Pepe'               },
  { id: 'FLOKI',  name: 'Floki'              },
  { id: 'TIA',    name: 'Celestia'           },
  { id: 'JUP',    name: 'Jupiter'            },
  { id: 'WIF',    name: 'Dogwifhat'          },
  { id: 'BONK',   name: 'Bonk'               },
  { id: 'PYTH',   name: 'Pyth Network'       },
  { id: 'STRK',   name: 'Starknet'           },
  { id: 'ORDI',   name: 'ORDI'               },
  { id: 'ENA',    name: 'Ethena'             },
  { id: 'AR',     name: 'Arweave'            },
  { id: 'ONDO',   name: 'Ondo'               },
  { id: 'PENDLE', name: 'Pendle'             },
  { id: 'BLUR',   name: 'Blur'               },
  { id: 'NOT',    name: 'Notcoin'            },
  { id: 'OM',     name: 'MANTRA'             },
  { id: 'APE',    name: 'ApeCoin'            },
  { id: 'DYDX',   name: 'dYdX'               },
  { id: '1INCH',  name: '1inch'              },
  { id: 'ZEC',    name: 'Zcash'              },
  { id: 'EOS',    name: 'EOS'                },
  { id: 'NEO',    name: 'Neo'                },
  { id: 'KAVA',   name: 'Kava'               },
  { id: 'BAT',    name: 'Basic Attention'    },
  { id: 'ENJ',    name: 'Enjin Coin'         },
  { id: 'ZIL',    name: 'Zilliqa'            },
  { id: 'GALA',   name: 'Gala'               },
  { id: 'GMT',    name: 'STEPN'              },
  { id: 'OCEAN',  name: 'Ocean Protocol'     },
  { id: 'ANKR',   name: 'Ankr'               },
  { id: 'ROSE',   name: 'Oasis Network'      },
  { id: 'CFX',    name: 'Conflux'            },
  { id: 'MASK',   name: 'Mask Network'       },
  { id: 'FLOW',   name: 'Flow'               },
  { id: 'IOTA',   name: 'IOTA'               },
  { id: 'FET',    name: 'Fetch.ai'           },
  { id: 'JASMY',  name: 'JasmyCoin'          },
  { id: 'AUDIO',  name: 'Audius'             },
  { id: 'LUNC',   name: 'Terra Luna Classic' },
  { id: 'PEOPLE', name: 'ConstitutionDAO'    },
  { id: 'MOVE',   name: 'Movement'           },
  { id: 'IP',     name: 'Story'              },
  { id: 'ACT',    name: 'Act I'              },
  { id: 'PNUT',   name: 'Peanut'             },
  { id: 'VIRTUAL',name: 'Virtuals Protocol'  },
  { id: 'BEAM',   name: 'Beam'               },
  { id: 'MANTA',  name: 'Manta Network'      },
  { id: 'PORTAL', name: 'Portal'             },
  { id: 'ETHFI',  name: 'ether.fi'           },
  { id: 'BANANA', name: 'Banana Gun'         },
];

const QUOTES = [
  { id: 'USD',  cur: '$' },
  { id: 'USDC', cur: '$' },
  { id: 'EUR',  cur: '€' },
];

function buildSym(base, quote) {
  const q = QUOTES.find(x => x.id === quote) || QUOTES[0];
  return { label: `${base}/${q.id}`, symbol: `${base}${q.id}`, cur: q.cur };
}

const TIMEFRAMES = [
  { label: '1M',  interval: '1M',  limit: 1000, view: 36  },
  { label: '1W',  interval: '1w',  limit:  600, view: 52  },
  { label: '1D',  interval: '1d',  limit:  600, view: 90  },
  { label: '4H',  interval: '4h',  limit:  600, view: 120 },
  { label: '1H',  interval: '1h',  limit:  600, view: 120 },
  { label: '15m', interval: '15m', limit:  600, view: 120 },
  { label: '5m',  interval: '5m',  limit:  600, view: 120 },
  { label: '3m',  interval: '3m',  limit:  600, view: 120 },
  { label: '1m',  interval: '1m',  limit:  600, view: 120 },
];

const TREND_TFS = [
  { label: '1M',  interval: '1M'  },
  { label: '1W',  interval: '1w'  },
  { label: '1D',  interval: '1d'  },
  { label: '4H',  interval: '4h'  },
  { label: '1H',  interval: '1h'  },
  { label: '15m', interval: '15m' },
  { label: '5m',  interval: '5m'  },
  { label: '3m',  interval: '3m'  },
  { label: '1m',  interval: '1m'  },
];

// Overlay indicators on the main chart
const OVERLAY_INDS = [
  { id: 'ema9',     label: 'EMA9',      color: '#d0d7de',              defaultOn: false },
  { id: 'sma20',    label: 'SMA20',     color: '#f5e642',              defaultOn: true  },
  { id: 'sma50',    label: 'SMA50',     color: '#fd7e14',              defaultOn: true  },
  { id: 'sma200',   label: 'SMA200',    color: '#f85149',              defaultOn: true  },
  { id: 'bb',       label: 'Bollinger', color: '#79c0ff',              defaultOn: false },
  { id: 'psar',     label: 'PSAR',      color: '#f0b429',              defaultOn: false },
  { id: 'ichimoku', label: 'Ichimoku',  color: '#bc8cff',              defaultOn: false },
  { id: 'volume',   label: 'Volume',    color: '#26a641',              defaultOn: true  },
  { id: 'swing',    label: 'Swing',     color: '#bc8cff',              defaultOn: false },
  { id: 'sr',       label: 'S/R',       color: '#58a6ff',              defaultOn: false },
  { id: 'liq',      label: 'LIQ',       color: '#ffc107',              defaultOn: false },
  { id: 'phases',   label: 'Fases',     color: '#bc8cff',              defaultOn: false },
  { id: 'bambam',   label: 'BamBam',    color: '#f0b429',              defaultOn: false },
];

// Oscillator indicators (independent toggles)
const OSC_INDS = [
  { id: 'rsi',   label: 'RSI',   color: '#e3b341', defaultOn: true  },
  { id: 'stoch', label: 'Stoch', color: '#58a6ff', defaultOn: true  },
  { id: 'macd',  label: 'MACD',  color: '#bc8cff', defaultOn: false },
];

// ═══════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════

let currentBase   = 'BTC';
let currentQuote  = 'USD';
let currentSymbol = buildSym(currentBase, currentQuote);
let currentTF     = TIMEFRAMES[0];
let chartType     = 'candles';
let indVisible    = Object.fromEntries(
  [...OVERLAY_INDS, ...OSC_INDS].map(i => [i.id, i.defaultOn])
);
let chartTimer    = null;
let trendTimer    = null;
let syncing       = false;

// Measure tool state
let measureMode   = false;
let measureP1     = null;
let measureLine   = null;
let phasesCanvas  = null;
let bambamSignals = [];

// ── Bitcoin halving dates ────────────────────────────────────
const HALVINGS = [
  { date: '2012-11-28', label: 'H1' },
  { date: '2016-07-09', label: 'H2' },
  { date: '2020-05-11', label: 'H3' },
  { date: '2024-04-19', label: 'H4' },
  { date: '2028-04-20', label: 'H5' },  // estimated
];

// ── Historical Bitcoin market cycle phases ───────────────────
const CYCLE_PHASES = [
  // Cyclus 1 (2010–2015)
  { type: 'accum', from: '2010-01-01', to: '2012-11-28' },
  { type: 'bull',  from: '2012-11-28', to: '2013-11-30' },
  { type: 'dist',  from: '2013-11-30', to: '2014-01-15' },
  { type: 'bear',  from: '2014-01-15', to: '2015-01-15' },
  // Cyclus 2 (2015–2018)
  { type: 'accum', from: '2015-01-15', to: '2016-07-09' },
  { type: 'bull',  from: '2016-07-09', to: '2017-12-17' },
  { type: 'dist',  from: '2017-12-17', to: '2018-01-20' },
  { type: 'bear',  from: '2018-01-20', to: '2018-12-15' },
  // Cyclus 3 (2018–2022)
  { type: 'accum', from: '2018-12-15', to: '2020-05-11' },
  { type: 'bull',  from: '2020-05-11', to: '2021-11-10' },
  { type: 'dist',  from: '2021-11-10', to: '2022-01-22' },
  { type: 'bear',  from: '2022-01-22', to: '2022-11-21' },
  // Cyclus 4 (2022–2027, lopend/geschat)
  { type: 'accum', from: '2022-11-21', to: '2024-04-19' },
  { type: 'bull',  from: '2024-04-19', to: '2025-10-01' },
  { type: 'dist',  from: '2025-10-01', to: '2026-01-15' },
  { type: 'bear',  from: '2026-01-15', to: '2027-06-01' },
];

const PHASE_COLORS = {
  accum: 'rgba(255,235,59,0.13)',
  bull:  'rgba(38,166,65,0.13)',
  dist:  'rgba(253,126,20,0.13)',
  bear:  'rgba(218,54,51,0.13)',
};

function dateToTs(str) {
  return Math.floor(new Date(str + 'T00:00:00Z').getTime() / 1000) + TZ_OFFSET_SEC;
}

function drawPhases() {
  if (!phasesCanvas || !chart) return;
  const container = document.getElementById('chart-container');
  const W = container.offsetWidth, H = container.offsetHeight;
  phasesCanvas.width  = W;
  phasesCanvas.height = H;
  const ctx = phasesCanvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  if (!indVisible.phases) return;

  const vr = chart.timeScale().getVisibleRange();
  const lr = chart.timeScale().getVisibleLogicalRange();
  if (!vr || !lr) return;

  // Convert timestamp → canvas X using bar-index interpolation.
  // This is accurate regardless of gaps (weekends, exchange downtime) because
  // LWC maps bar indices linearly to pixels, not raw timestamps.
  const tsToX = ts => {
    const x = chart.timeScale().timeToCoordinate(ts);
    if (x !== null) return x;

    // Fallback: find fractional bar index via binary search, then map to pixels
    const cands = currentCandles;
    if (!cands.length) return (ts - vr.from) / (vr.to - vr.from) * W;

    let logical;
    if (ts <= cands[0].time) {
      const dt = cands.length > 1 ? cands[1].time - cands[0].time : 1;
      logical = (ts - cands[0].time) / dt;
    } else if (ts >= cands.at(-1).time) {
      const n = cands.length;
      const dt = n > 1 ? cands[n - 1].time - cands[n - 2].time : 1;
      logical = n - 1 + (ts - cands[n - 1].time) / dt;
    } else {
      let lo = 0, hi = cands.length - 1;
      while (lo < hi - 1) {
        const mid = (lo + hi) >> 1;
        if (cands[mid].time <= ts) lo = mid; else hi = mid;
      }
      const t0 = cands[lo].time, t1 = cands[hi].time;
      logical = lo + (ts - t0) / (t1 - t0);
    }
    return (logical - lr.from) / (lr.to - lr.from) * W;
  };

  // Phase bands
  CYCLE_PHASES.forEach(p => {
    const x1 = tsToX(dateToTs(p.from));
    const x2 = tsToX(dateToTs(p.to));
    const left  = Math.max(0, Math.min(x1, x2));
    const right = Math.min(W, Math.max(x1, x2));
    if (right <= left) return;
    ctx.fillStyle = PHASE_COLORS[p.type];
    ctx.fillRect(left, 0, right - left, H);
  });

  // Halving markers
  HALVINGS.forEach(h => {
    const x = tsToX(dateToTs(h.date));
    if (x < -1 || x > W + 1) return;
    ctx.strokeStyle = 'rgba(188,140,255,0.70)';
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(188,140,255,0.90)';
    ctx.font      = 'bold 10px ui-monospace,monospace';
    ctx.textAlign = 'center';
    ctx.fillText(h.label, x, 13);
  });
}

// Chart series
let chart        = null;
let oscChart     = null;
let macdChart    = null;
let candleSeries = null;
let lineSeries   = null;
let ser          = {};   // all named series handles

// Swing / S&R / Liquidity state
let currentCandles  = [];
let currentSwingPts = { highs: [], lows: [] };
let srPriceLines    = [];
let liqSeries       = [];
let liqPriceLines   = [];

// Shared price formatter — used by all three chart instances and fmtP.
// Adapts decimal precision to the coin's price magnitude automatically.
const smartPriceFmt = p => {
  if (p >= 1000)   return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 1)      return p.toFixed(2);
  if (p >= 0.01)   return p.toFixed(4);
  if (p >= 0.0001) return p.toFixed(6);
  return p.toFixed(8);
};

// ═══════════════════════════════════════════════════════════
//  CHART INIT — MAIN
// ═══════════════════════════════════════════════════════════

function initChart() {
  const el = document.getElementById('chart-container');

  chart = LightweightCharts.createChart(el, {
    layout: { background: { color: '#0d1117' }, textColor: '#8b949e' },
    grid:   { vertLines: { color: '#161b22' }, horzLines: { color: '#161b22' } },
    crosshair: {
      mode:     LightweightCharts.CrosshairMode.Normal,
      vertLine: { color: '#444c56', labelBackgroundColor: '#1f6feb' },
      horzLine: { color: '#444c56', labelBackgroundColor: '#1f6feb' },
    },
    localization:    { priceFormatter: smartPriceFmt },
    rightPriceScale: { borderColor: '#30363d', scaleMargins: { top: 0.08, bottom: 0.06 } },
    timeScale: { borderColor: '#30363d', timeVisible: true, secondsVisible: false, rightOffset: 10 },
    handleScroll: true,
    handleScale:  true,
  });

  candleSeries = chart.addCandlestickSeries({
    upColor: '#26a641', downColor: '#da3633',
    borderUpColor: '#26a641', borderDownColor: '#da3633',
    wickUpColor: '#26a641', wickDownColor: '#da3633',
    priceLineVisible: false,
  });

  lineSeries = chart.addLineSeries({
    color: '#58a6ff', lineWidth: 2,
    priceLineVisible: false, visible: false,
    lastValueVisible: true, crosshairMarkerVisible: true,
  });

  // Moving average overlays
  ser.sma200 = mkLine(chart, '#f85149', 2, false);
  ser.sma50  = mkLine(chart, '#fd7e14', 2, false);
  ser.sma20  = mkLine(chart, '#f5e642', 2, false);
  ser.ema9   = mkLine(chart, '#d0d7de', 2, false);

  // BamBam stepping line — EMA(21) as dynamic support/resistance guide
  ser.bbStep = chart.addLineSeries({
    color: '#f0b429', lineWidth: 1.5,
    lineStyle: LightweightCharts.LineStyle.Dashed,
    lastValueVisible: false, priceLineVisible: false,
    crosshairMarkerVisible: false, visible: false,
  });

  // Bollinger Bands (3 lines, default hidden)
  ser.bb_upper  = mkLine(chart, 'rgba(121,192,255,0.8)', 1, false, true);
  ser.bb_mid    = mkLine(chart, 'rgba(121,192,255,0.4)', 1, false, true);
  ser.bb_lower  = mkLine(chart, 'rgba(121,192,255,0.8)', 1, false, true);

  // PSAR — two dot-only series (bull = green dots below price, bear = red dots above)
  const mkDots = (color) => chart.addLineSeries({
    color, lineVisible: false, pointMarkersVisible: true, pointMarkersRadius: 2,
    priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
    visible: false,
  });
  ser.psar_bull = mkDots('#26a641');
  ser.psar_bear = mkDots('#e5534b');

  // Ichimoku (5 lines, default hidden)
  ser.ichi_tenkan = mkLine(chart, '#58a6ff', 1, false, true);
  ser.ichi_kijun  = mkLine(chart, '#f85149', 1, false, true);
  ser.ichi_spanA  = mkLine(chart, 'rgba(38,166,65,0.75)', 1, false, true);
  ser.ichi_spanB  = mkLine(chart, 'rgba(218,54,51,0.75)', 1, false, true);
  ser.ichi_chikou = mkLine(chart, '#bc8cff', 1, false, true);

  // Volume histogram — own scale, bottom 15% of chart height
  ser.volume = chart.addHistogramSeries({
    priceScaleId:    'vol',
    lastValueVisible: false,
    priceLineVisible: false,
  });
  chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });

  // Responsive resize
  new ResizeObserver(() => {
    chart.applyOptions({ width: el.clientWidth, height: el.clientHeight });
    drawPhases();
  }).observe(el);

  // Phases canvas overlay
  phasesCanvas = document.createElement('canvas');
  phasesCanvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2;';
  el.appendChild(phasesCanvas);
  chart.timeScale().subscribeVisibleTimeRangeChange(() => requestAnimationFrame(() => drawPhases()));

  // OHLC crosshair tooltip
  chart.subscribeCrosshairMove(param => {
    const tt = document.getElementById('ohlc-tooltip');
    if (!param.time || !param.seriesData?.size) { tt.classList.add('hidden'); return; }
    const c = param.seriesData.get(candleSeries);
    if (!c) { tt.classList.add('hidden'); return; }
    tt.classList.remove('hidden');
    document.getElementById('tt-time').textContent  = fmtTime(param.time, currentTF.interval);
    document.getElementById('tt-open').textContent  = fmtP(c.open);
    document.getElementById('tt-high').textContent  = fmtP(c.high);
    document.getElementById('tt-low').textContent   = fmtP(c.low);
    document.getElementById('tt-close').textContent = fmtP(c.close);
  });
}

function mkLine(c, color, width, lastVisible, hidden = false) {
  return c.addLineSeries({
    color, lineWidth: width,
    priceLineVisible: false,
    lastValueVisible: !!lastVisible,
    crosshairMarkerVisible: false,
    visible: !hidden,
  });
}

// ═══════════════════════════════════════════════════════════
//  CHART INIT — OSCILLATOR (RSI / Stochastic)
// ═══════════════════════════════════════════════════════════

function initOscChart() {
  const el = document.getElementById('osc-container');

  oscChart = LightweightCharts.createChart(el, {
    layout: { background: { color: '#0d1117' }, textColor: '#8b949e' },
    grid:   { vertLines: { color: '#161b22' }, horzLines: { color: '#161b22' } },
    crosshair: {
      mode:     LightweightCharts.CrosshairMode.Normal,
      vertLine: { color: '#444c56', labelBackgroundColor: '#1f6feb' },
      horzLine: { color: '#444c56', labelBackgroundColor: '#1f6feb' },
    },
    localization:    { priceFormatter: p => p.toFixed(2) }, // RSI/Stoch always 0-100
    rightPriceScale: { borderColor: '#30363d', scaleMargins: { top: 0.05, bottom: 0.05 } },
    timeScale: { visible: false, borderColor: '#30363d' },  // hidden — synced with main
    handleScroll: true,
    handleScale:  true,
  });

  // Background bands — added first so they render behind the indicator lines
  const mkBand = (base, top, fillColor) => {
    const s = oscChart.addBaselineSeries({
      baseValue:       { type: 'price', price: base },
      topLineColor:    'transparent',
      topFillColor1:   fillColor,
      topFillColor2:   fillColor,
      bottomLineColor: 'transparent',
      bottomFillColor1: 'transparent',
      bottomFillColor2: 'transparent',
      lineWidth: 1,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
      visible: false,
    });
    s._topValue = top; // remember flat value for setData
    return s;
  };
  // Stoch band: 20–80, light purple. RSI band: 30–70, light blue.
  ser.stochBand = mkBand(20, 80, 'rgba(188,140,255,0.10)');
  ser.rsiBand   = mkBand(30, 70, 'rgba(88,166,255,0.12)');

  ser.rsi    = mkLine(oscChart, '#e3b341', 1.5, true);
  ser.stochK = mkLine(oscChart, '#58a6ff', 1,   false);
  ser.stochD = mkLine(oscChart, '#f85149', 1,   false);

  const LS = LightweightCharts.LineStyle;

  // BamBam oscillator components
  ser.bbRsiEma = oscChart.addLineSeries({
    color: '#f5e642', lineWidth: 2,
    lastValueVisible: false, priceLineVisible: false,
    crosshairMarkerVisible: false, visible: false,
  });
  ser.bbUpper = oscChart.addLineSeries({
    color: 'rgba(218,54,51,0.80)', lineWidth: 1,
    lineStyle: LS.Dashed,
    lastValueVisible: false, priceLineVisible: false,
    crosshairMarkerVisible: false, visible: false,
  });
  ser.bbLower = oscChart.addLineSeries({
    color: 'rgba(38,166,65,0.80)', lineWidth: 1,
    lineStyle: LS.Dashed,
    lastValueVisible: false, priceLineVisible: false,
    crosshairMarkerVisible: false, visible: false,
  });

  // RSI reference lines
  [{ p: 70, c: 'rgba(218,54,51,0.45)', s: LS.Dashed },
   { p: 50, c: 'rgba(139,148,158,0.3)', s: LS.Dotted },
   { p: 30, c: 'rgba(38,166,65,0.45)',  s: LS.Dashed }].forEach(({ p, c, s }) => {
    ser.rsi.createPriceLine({ price: p, color: c, lineWidth: 1, lineStyle: s, axisLabelVisible: p !== 50 });
  });

  // Stochastic reference lines
  [{ p: 80, c: 'rgba(218,54,51,0.25)', s: LS.Dashed },
   { p: 20, c: 'rgba(38,166,65,0.25)', s: LS.Dashed }].forEach(({ p, c, s }) => {
    ser.stochK.createPriceLine({ price: p, color: c, lineWidth: 1, lineStyle: s, axisLabelVisible: false });
  });

  // Resize
  new ResizeObserver(() => {
    oscChart.applyOptions({ width: el.clientWidth, height: el.clientHeight });
  }).observe(el);

  // Sync time scales using time-based range so all panes align correctly
  chart.timeScale().subscribeVisibleTimeRangeChange(r => {
    if (syncing || !r) return;
    syncing = true;
    oscChart.timeScale().setVisibleRange(r);
    macdChart?.timeScale().setVisibleRange(r);
    setTimeout(() => { syncing = false; }, 0);
  });
  oscChart.timeScale().subscribeVisibleTimeRangeChange(r => {
    if (syncing || !r) return;
    syncing = true;
    chart.timeScale().setVisibleRange(r);
    macdChart?.timeScale().setVisibleRange(r);
    setTimeout(() => { syncing = false; }, 0);
  });

  // Measure tool — click handler
  chart.subscribeClick(param => {
    if (!measureMode || !param.point || !param.time) return;
    const price = candleSeries.coordinateToPrice(param.point.y);
    if (price == null) return;
    if (!measureP1) {
      measureP1 = { time: param.time, price };
      if (measureLine) { try { candleSeries.removePriceLine(measureLine); } catch (_) {} }
      measureLine = candleSeries.createPriceLine({
        price, color: 'rgba(255,193,7,0.80)', lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: false, title: '📐 P1',
      });
      const hint = document.getElementById('measure-hint');
      if (hint) hint.classList.remove('hidden');
    } else {
      const p2 = { time: param.time, price };
      if (measureLine) { try { candleSeries.removePriceLine(measureLine); } catch (_) {} measureLine = null; }
      showMeasureResult(measureP1, p2);
      measureP1 = null;
      const hint = document.getElementById('measure-hint');
      if (hint) hint.classList.add('hidden');
    }
  });
}

// ═══════════════════════════════════════════════════════════
//  CHART INIT — MACD PANE
// ═══════════════════════════════════════════════════════════

function initMacdChart() {
  const el = document.getElementById('macd-container');
  macdChart = LightweightCharts.createChart(el, {
    layout: { background: { color: '#0d1117' }, textColor: '#8b949e' },
    grid:   { vertLines: { color: '#161b22' }, horzLines: { color: '#161b22' } },
    crosshair: {
      mode:     LightweightCharts.CrosshairMode.Normal,
      vertLine: { color: '#444c56', labelBackgroundColor: '#1f6feb' },
      horzLine: { color: '#444c56', labelBackgroundColor: '#1f6feb' },
    },
    localization:    { priceFormatter: smartPriceFmt },
    rightPriceScale: { borderColor: '#30363d', scaleMargins: { top: 0.1, bottom: 0.1 } },
    timeScale: { visible: false, borderColor: '#30363d' },
    handleScroll: true, handleScale: true,
  });

  ser.macdLine   = mkLine(macdChart, '#58a6ff', 1.5, false);
  ser.macdSignal = mkLine(macdChart, '#f85149', 1.5, false);
  ser.macdHist   = macdChart.addHistogramSeries({ lastValueVisible: false, priceLineVisible: false });

  ser.macdLine.createPriceLine({
    price: 0, color: 'rgba(139,148,158,0.35)', lineWidth: 1,
    lineStyle: LightweightCharts.LineStyle.Dotted, axisLabelVisible: false,
  });

  new ResizeObserver(() => {
    macdChart.applyOptions({ width: el.clientWidth, height: el.clientHeight });
  }).observe(el);

  macdChart.timeScale().subscribeVisibleTimeRangeChange(r => {
    if (syncing || !r) return;
    syncing = true;
    chart.timeScale().setVisibleRange(r);
    oscChart.timeScale().setVisibleRange(r);
    setTimeout(() => { syncing = false; }, 0);
  });
}

// ═══════════════════════════════════════════════════════════
//  DATA FETCHING
// ═══════════════════════════════════════════════════════════

async function fetchKlines(symbol, interval, limit) {
  const r = await fetch(`${BINANCE_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`API ${r.status} — ${symbol} ${interval}`);
  return r.json();
}

async function fetch24h(symbol) {
  const r = await fetch(`${BINANCE_BASE}/ticker/24hr?symbol=${symbol}`);
  return r.ok ? r.json() : null;
}

// Binance returns UTC milliseconds. LightweightCharts renders Unix timestamps
// as UTC on the time axis, so we pre-shift all timestamps to local time once
// here. Everything downstream (trend panel, swing points, visible-range checks)
// uses these shifted values consistently.
const TZ_OFFSET_SEC = -new Date().getTimezoneOffset() * 60;

function parseKlines(raw) {
  return raw.map(k => ({
    time:   Math.floor(k[0] / 1000) + TZ_OFFSET_SEC,
    open:   parseFloat(k[1]),
    high:   parseFloat(k[2]),
    low:    parseFloat(k[3]),
    close:  parseFloat(k[4]),
    volume: parseFloat(k[5]),
  }));
}

// ═══════════════════════════════════════════════════════════
//  INDICATOR CALCULATIONS
// ═══════════════════════════════════════════════════════════

// SMA with expanding window — always produces N data points (no gap on short timeframes)
// The first points use whatever data is available; the line becomes accurate at candle #period
function calcSMAExp(candles, period) {
  const closes = candles.map(c => c.close);
  const result = [];
  let sum = 0;
  for (let i = 0; i < closes.length; i++) {
    sum += closes[i];
    if (i >= period) sum -= closes[i - period];
    result.push({ time: candles[i].time, value: sum / Math.min(i + 1, period) });
  }
  return result;
}

// Accurate SMA (starts at candle #period) — used internally for BB and trend analysis
function calcSMA(candles, period) {
  if (candles.length < period) return [];
  const closes = candles.map(c => c.close);
  const result = [];
  let sum = closes.slice(0, period).reduce((a, b) => a + b, 0);
  result.push({ time: candles[period - 1].time, value: sum / period });
  for (let i = period; i < closes.length; i++) {
    sum += closes[i] - closes[i - period];
    result.push({ time: candles[i].time, value: sum / period });
  }
  return result;
}

// Raw SMA values (no timestamps) — for trend/cross analysis
function smaVals(closes, period) {
  if (closes.length < period) return [];
  let sum = closes.slice(0, period).reduce((a, b) => a + b, 0);
  const out = [sum / period];
  for (let i = period; i < closes.length; i++) {
    sum += closes[i] - closes[i - period];
    out.push(sum / period);
  }
  return out;
}

// Expanding-window SMA — mirrors calcSMAExp; works even when closes.length < period
function smaLastExp(closes, period) {
  if (closes.length === 0) return null;
  if (closes.length >= period) return smaVals(closes, period).at(-1) ?? null;
  return closes.reduce((a, b) => a + b, 0) / closes.length;
}

function calcEMA(candles, period) {
  if (candles.length < period) return [];
  const closes = candles.map(c => c.close);
  const k = 2 / (period + 1);
  let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const result = [{ time: candles[period - 1].time, value: ema }];
  for (let i = period; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
    result.push({ time: candles[i].time, value: ema });
  }
  return result;
}

function calcBB(candles, period = 20, mult = 2) {
  if (candles.length < period) return { upper: [], mid: [], lower: [] };
  const closes = candles.map(c => c.close);
  const upper = [], mid = [], lower = [];
  for (let i = period - 1; i < closes.length; i++) {
    const sl   = closes.slice(i - period + 1, i + 1);
    const mean = sl.reduce((a, b) => a + b, 0) / period;
    const std  = Math.sqrt(sl.reduce((s, v) => s + (v - mean) ** 2, 0) / period);
    const t    = candles[i].time;
    upper.push({ time: t, value: mean + mult * std });
    mid.push(  { time: t, value: mean });
    lower.push({ time: t, value: mean - mult * std });
  }
  return { upper, mid, lower };
}

function calcBBWidth(candles) {
  const bb = calcBB(candles);
  if (!bb.upper.length) return null;
  const upper = bb.upper.at(-1).value;
  const mid   = bb.mid.at(-1).value;
  const lower = bb.lower.at(-1).value;
  return ((upper - lower) / mid) * 100;
}

// ── Didi BAM BAM indicator ───────────────────────────────────────────────
// Stepping line  : EMA(21) on close → main chart overlay
// Oscillator     : EMA(14) of RSI(14) with normalised ATR bands
// Signals        : fast RSI(7) crosses RSI-EMA, filtered by RSI>50 and close vs step
function calcBamBam(candles) {
  const empty = { step: [], rsiEma: [], upper: [], lower: [], signals: [] };
  if (candles.length < 28) return empty;

  const mult = 4.0;

  // Stepping line on main chart
  const step = calcEMA(candles, 21);

  // RSI(14) and fast RSI(7)
  const rsiData  = calcRSI(candles, 14);
  const fastRsi  = calcRSI(candles, 7);

  // EMA(14) of RSI
  const rsiEma = [];
  if (rsiData.length >= 14) {
    const k = 2 / 15;
    let ema = rsiData.slice(0, 14).reduce((s, d) => s + d.value, 0) / 14;
    rsiEma.push({ time: rsiData[13].time, value: ema });
    for (let i = 14; i < rsiData.length; i++) {
      ema = rsiData[i].value * k + ema * (1 - k);
      rsiEma.push({ time: rsiData[i].time, value: ema });
    }
  }

  // Wilder ATR(10) indexed by candle time
  const atrByTime = new Map();
  if (candles.length > 10) {
    const trs = candles.slice(1).map((c, i) =>
      Math.max(c.high - c.low, Math.abs(c.high - candles[i].close), Math.abs(c.low - candles[i].close))
    );
    let atr = trs.slice(0, 10).reduce((a, b) => a + b) / 10;
    atrByTime.set(candles[10].time, atr);
    for (let i = 10; i < trs.length; i++) {
      atr = (atr * 9 + trs[i]) / 10;
      atrByTime.set(candles[i + 1].time, atr);
    }
  }

  // Upper/lower bands: rsiEma ± normalised ATR * mult
  // Normalising by (atr/close)*100 keeps the band in RSI 0-100 space regardless of coin price
  const candleIdx = new Map(candles.map((c, i) => [c.time, i]));
  const upper = [], lower = [];
  rsiEma.forEach(re => {
    const ci  = candleIdx.get(re.time);
    const atr = atrByTime.get(re.time);
    if (ci == null || !atr) return;
    const normAtr = (atr / candles[ci].close) * 100;
    upper.push({ time: re.time, value: Math.min(100, re.value + normAtr * mult) });
    lower.push({ time: re.time, value: Math.max(0,   re.value - normAtr * mult) });
  });

  // Signal generation
  const signals = [];
  const rsiEmaMap  = new Map(rsiEma.map(d   => [d.time, d.value]));
  const stepMap    = new Map(step.map(d     => [d.time, d.value]));
  const rsiDataMap = new Map(rsiData.map(d  => [d.time, d.value]));

  for (let i = 1; i < fastRsi.length; i++) {
    const t   = fastRsi[i].time;
    const tp  = fastRsi[i - 1].time;
    const fk  = fastRsi[i].value;
    const fkp = fastRsi[i - 1].value;
    const ek  = rsiEmaMap.get(t);
    const ekp = rsiEmaMap.get(tp);
    if (ek == null || ekp == null) continue;
    const ci     = candleIdx.get(t);
    if (ci == null) continue;
    const close  = candles[ci].close;
    const sLine  = stepMap.get(t) ?? 0;
    const rsiNow = rsiDataMap.get(t) ?? 50;

    if (fkp <= ekp && fk > ek && rsiNow > 50 && close > sLine) {
      signals.push({ time: t, position: 'belowBar', color: '#26a641', shape: 'arrowUp',   size: 1, text: '↑' });
    } else if (fkp >= ekp && fk < ek && rsiNow < 50 && close < sLine) {
      signals.push({ time: t, position: 'aboveBar', color: '#e5534b', shape: 'arrowDown', size: 1, text: '↓' });
    }
  }

  return { step, rsiEma, upper, lower, signals };
}

function calcRSI(candles, period = 14) {
  if (candles.length <= period) return [];
  const closes = candles.map(c => c.close);
  const result = [];
  let ag = 0, al = 0;
  for (let i = 1; i <= period; i++) {
    const d = closes[i] - closes[i - 1];
    if (d > 0) ag += d; else al -= d;
  }
  ag /= period; al /= period;
  result.push({ time: candles[period].time, value: al === 0 ? 100 : 100 - 100 / (1 + ag / al) });
  for (let i = period + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    ag = (ag * (period - 1) + Math.max(0,  d)) / period;
    al = (al * (period - 1) + Math.max(0, -d)) / period;
    result.push({ time: candles[i].time, value: al === 0 ? 100 : 100 - 100 / (1 + ag / al) });
  }
  return result;
}

function calcStoch(candles, kP = 14, sK = 3, dP = 3) {
  if (candles.length < kP) return { k: [], d: [] };
  const rawK = [];
  for (let i = kP - 1; i < candles.length; i++) {
    const sl = candles.slice(i - kP + 1, i + 1);
    const hi = Math.max(...sl.map(c => c.high));
    const lo = Math.min(...sl.map(c => c.low));
    rawK.push({ time: candles[i].time, value: hi === lo ? 50 : (candles[i].close - lo) / (hi - lo) * 100 });
  }
  // Smooth %K
  const k = [];
  for (let i = sK - 1; i < rawK.length; i++) {
    const avg = rawK.slice(i - sK + 1, i + 1).reduce((s, v) => s + v.value, 0) / sK;
    k.push({ time: rawK[i].time, value: avg });
  }
  // %D
  const d = [];
  for (let i = dP - 1; i < k.length; i++) {
    const avg = k.slice(i - dP + 1, i + 1).reduce((s, v) => s + v.value, 0) / dP;
    d.push({ time: k[i].time, value: avg });
  }
  return { k, d };
}

function calcIchimoku(candles) {
  const N = candles.length;
  const hl = arr => (Math.max(...arr.map(c => c.high)) + Math.min(...arr.map(c => c.low))) / 2;
  const tenkan = [], kijun = [], spanA = [], spanB = [], chikou = [];

  for (let i = 8;  i < N; i++) tenkan.push({ time: candles[i].time, value: hl(candles.slice(i-8,  i+1)) });
  for (let i = 25; i < N; i++) kijun.push( { time: candles[i].time, value: hl(candles.slice(i-25, i+1)) });

  // Displaced 26 candles forward (cloud spans into future on live chart)
  for (let i = 25; i + 26 < N; i++) {
    const tk = hl(candles.slice(i-8,  i+1));
    const kj = hl(candles.slice(i-25, i+1));
    spanA.push({ time: candles[i+26].time, value: (tk + kj) / 2 });
  }
  for (let i = 51; i + 26 < N; i++)
    spanB.push({ time: candles[i+26].time, value: hl(candles.slice(i-51, i+1)) });

  // Chikou: close plotted 26 candles back
  for (let i = 26; i < N; i++)
    chikou.push({ time: candles[i-26].time, value: candles[i].close });

  return { tenkan, kijun, spanA, spanB, chikou };
}

function calcMACD(candles, fast = 12, slow = 26, signal = 9) {
  if (candles.length < slow + signal) return { macd: [], signal: [], hist: [] };
  const closes = candles.map(c => c.close);
  const ema = (arr, period, startIdx) => {
    const k = 2 / (period + 1);
    let e = arr.slice(startIdx, startIdx + period).reduce((a, b) => a + b, 0) / period;
    const out = [{ idx: startIdx + period - 1, v: e }];
    for (let i = startIdx + period; i < arr.length; i++) {
      e = arr[i] * k + e * (1 - k);
      out.push({ idx: i, v: e });
    }
    return out;
  };
  const eFast = ema(closes, fast, 0);
  const eSlow = ema(closes, slow, 0);
  // MACD line: align fast (starts at fast-1) and slow (starts at slow-1)
  const offset = slow - fast;
  const macdArr = eSlow.map((s, i) => ({
    time: candles[s.idx].time, value: eFast[offset + i].v - s.v,
  }));
  // Signal line: EMA(9) of MACD
  const mVals = macdArr.map(d => d.value);
  const eSig  = ema(mVals, signal, 0);
  const sigArr = eSig.map(s => ({ time: macdArr[s.idx].time, value: s.v }));
  // Histogram with 4-tone coloring
  const histArr = sigArr.map((s, i) => {
    const mVal   = macdArr[eSig[i].idx].value;
    const val    = mVal - s.value;
    const prev   = i > 0 ? macdArr[eSig[i - 1].idx].value - sigArr[i - 1].value : val;
    const color  = val >= 0
      ? (val >= prev ? '#26a641' : '#57ab5a')
      : (val <= prev ? '#da3633' : '#e5534b');
    return { time: s.time, value: val, color };
  });
  return { macd: macdArr, signal: sigArr, hist: histArr };
}

function calcPSAR(candles, step = 0.02, maxAF = 0.20) {
  if (candles.length < 3) return { bull: [], bear: [] };
  const bull = [], bear = [];

  // Seed direction from first two closes
  let uptrend = candles[1].close >= candles[0].close;
  let psar = uptrend
    ? Math.min(candles[0].low,  candles[1].low)
    : Math.max(candles[0].high, candles[1].high);
  let ep = uptrend ? candles[1].high : candles[1].low;
  let af = step;

  for (let i = 2; i < candles.length; i++) {
    const c  = candles[i];
    const p1 = candles[i - 1];
    const p2 = candles[i - 2];

    // Advance PSAR
    let next = psar + af * (ep - psar);

    // Constrain to the two prior bars so it never enters the current candle range
    if (uptrend) {
      next = Math.min(next, p1.low, p2.low);
      if (c.low < next) {
        // Reversal → downtrend
        uptrend = false;
        next = ep;
        ep   = c.low;
        af   = step;
      } else {
        if (c.high > ep) { ep = c.high; af = Math.min(af + step, maxAF); }
      }
    } else {
      next = Math.max(next, p1.high, p2.high);
      if (c.high > next) {
        // Reversal → uptrend
        uptrend = true;
        next = ep;
        ep   = c.high;
        af   = step;
      } else {
        if (c.low < ep) { ep = c.low; af = Math.min(af + step, maxAF); }
      }
    }

    psar = next;
    (uptrend ? bull : bear).push({ time: c.time, value: psar });
  }
  return { bull, bear };
}

function calcATR(candles, period = 14) {
  if (candles.length < period + 1) return null;
  const trs = [];
  for (let i = 1; i < candles.length; i++) {
    const h = candles[i].high, l = candles[i].low, pc = candles[i - 1].close;
    trs.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
  }
  let atr = trs.slice(0, period).reduce((a, b) => a + b) / period;
  for (let i = period; i < trs.length; i++) atr = (atr * (period - 1) + trs[i]) / period;
  return atr;
}

function calcTradeSetup(candles) {
  if (candles.length < 55) return null;

  const closes = candles.map(c => c.close);
  const price  = closes.at(-1);
  const ma20   = smaLastExp(closes, 20);
  const ma50   = smaLastExp(closes, 50);

  // Score: +bullish / −bearish. Threshold ±3 for a setup, ±5 for strong.
  let score = 0;

  // MA alignment (max ±2)
  if (ma20 != null && ma50 != null) {
    score += price > ma20 ? 1 : -1;
    score += ma20  > ma50  ? 1 : -1;
  }

  // PSAR (±1)
  const psarRes = calcPSAR(candles);
  const bullT   = psarRes.bull.at(-1)?.time ?? 0;
  const bearT   = psarRes.bear.at(-1)?.time ?? 0;
  score += bullT >= bearT ? 1 : -1;

  // RSI (±1)
  const rsiArr = calcRSI(candles);
  const rsi    = rsiArr.at(-1)?.value ?? 50;
  score += rsi > 50 ? 1 : -1;

  // Stoch (fresh cross = ±2, otherwise ±1)
  const stochRes = calcStoch(candles);
  const k  = stochRes.k.at(-1)?.value ?? 50;
  const d  = stochRes.d.at(-1)?.value ?? 50;
  const pk = stochRes.k.at(-2)?.value ?? 50;
  const pd = stochRes.d.at(-2)?.value ?? 50;
  if      (pk <= pd && k > d) score += 2;
  else if (pk >= pd && k < d) score -= 2;
  else                        score += k > d ? 1 : -1;

  if (score > -3 && score < 3) return null;
  const direction = score >= 3 ? 'long' : 'short';
  const strong    = Math.abs(score) >= 5;

  const atr    = calcATR(candles);
  if (!atr) return null;

  const swings = calcSwingPoints(candles);
  let sl, tp;

  if (direction === 'long') {
    const nearLow = swings.lows
      .map(l => l.price)
      .filter(p => p < price && (price - p) / price <= 0.08)
      .sort((a, b) => b - a)[0];
    sl = nearLow != null ? nearLow * 0.997 : price - 2 * atr;
    const nearRes = swings.highs
      .map(h => h.price)
      .filter(p => p > price && (p - price) / price <= 0.20)
      .sort((a, b) => a - b)[0];
    tp = nearRes ?? (price + 2.5 * (price - sl));
  } else {
    const nearHigh = swings.highs
      .map(h => h.price)
      .filter(p => p > price && (p - price) / price <= 0.08)
      .sort((a, b) => a - b)[0];
    sl = nearHigh != null ? nearHigh * 1.003 : price + 2 * atr;
    const nearSup = swings.lows
      .map(l => l.price)
      .filter(p => p < price && (price - p) / price <= 0.20)
      .sort((a, b) => b - a)[0];
    tp = nearSup ?? (price - 2.5 * (sl - price));
  }

  return {
    label:     direction === 'long'
      ? (strong ? '↑↑ LONG' : '↑ LONG')
      : (strong ? '↓↓ SHORT' : '↓ SHORT'),
    direction,
    entry:    fmtP(price),
    sl:       fmtP(sl),
    tp:       fmtP(tp),
    entryRaw: price,
    tpRaw:    tp,
  };
}

// ═══════════════════════════════════════════════════════════
//  TREND PANEL HELPERS
// ═══════════════════════════════════════════════════════════

// Cloud at candle N-1 was computed at index j=N-27 then displaced +26 into the future.
function ichimokuCloudNow(candles) {
  const N = candles.length;
  if (N < 78) return null;
  const hl = sl => (Math.max(...sl.map(c => c.high)) + Math.min(...sl.map(c => c.low))) / 2;

  const j    = N - 27;
  const tkJ  = hl(candles.slice(j - 8,  j + 1));
  const kjJ  = hl(candles.slice(j - 25, j + 1));
  const spanA = (tkJ + kjJ) / 2;
  const spanB = hl(candles.slice(j - 51, j + 1));

  const cloudTop   = Math.max(spanA, spanB);
  const cloudBot   = Math.min(spanA, spanB);
  const cloudGreen = spanA >= spanB;
  const price      = candles[N - 1].close;

  const curTK = hl(candles.slice(N - 9,  N));
  const curKJ = hl(candles.slice(N - 26, N));
  const preTK = hl(candles.slice(N - 10, N - 1));
  const preKJ = hl(candles.slice(N - 27, N - 1));
  let tkKjCross = null;
  if (preTK <= preKJ && curTK > curKJ) tkKjCross = 'bullish';
  else if (preTK >= preKJ && curTK < curKJ) tkKjCross = 'bearish';

  return { aboveCloud: price > cloudTop, belowCloud: price < cloudBot, cloudGreen, tkKjCross };
}

function ichimokuTrendAnalysis(candles) {
  const c = ichimokuCloudNow(candles);
  if (!c) return { label: '—', cls: 'neutral' };
  let label, cls;
  if      (c.aboveCloud) { cls = 'bullish'; label = c.cloudGreen ? '▲ Bullish ↑cloud' : '▲ Bullish ↓cloud'; }
  else if (c.belowCloud) { cls = 'bearish'; label = c.cloudGreen ? '▼ Bearish ↑cloud' : '▼ Bearish ↓cloud'; }
  else                   { cls = 'consol';  label = '◆ In cloud'; }
  if (c.tkKjCross === 'bullish') label += ' TK↑';
  if (c.tkKjCross === 'bearish') label += ' TK↓';
  return { label, cls };
}

function maTrendAnalysis(candles) {
  if (candles.length < 5) return { label: '—', cls: 'neutral' };
  const closes = candles.map(c => c.close);
  const m20  = smaLastExp(closes, 20);
  const m50  = smaLastExp(closes, 50);
  const m200 = smaLastExp(closes, 200);
  if (m20 != null && m50 != null && m200 != null) {
    if (m20 > m50 && m50 > m200) return { label: '▲▲ Sterk up',    cls: 'strong-bull' };
    if (m20 < m50 && m50 < m200) return { label: '▼▼ Sterk down',  cls: 'strong-bear' };
    if (m20 > m50 && m50 < m200) return { label: '▲ Mat. Bullish', cls: 'weak-bull'   };
    if (m20 < m50 && m50 > m200) return { label: '▼ Mat. Bearish', cls: 'weak-bear'   };
    return { label: '◆ Gemengd', cls: 'consol' };
  }
  if (m20 != null && m50 != null) {
    if (m20 > m50) return { label: '▲ Bullish', cls: 'bullish' };
    if (m20 < m50) return { label: '▼ Bearish', cls: 'bearish' };
  }
  return { label: '— Data', cls: 'neutral' };
}

function rsiMomentumAnalysis(candles) {
  const rsiData = calcRSI(candles);
  if (!rsiData.length) return { label: '—', cls: 'neutral' };
  const val = rsiData.at(-1).value;
  const v   = val.toFixed(0);
  if (val > 80) return { label: `⚡ OB ${v}`,   cls: 'rsi-ext-bear' };
  if (val > 70) return { label: `▼ OB ${v}`,    cls: 'rsi-bear'     };
  if (val > 50) return { label: `▲ Up ${v}`,    cls: 'rsi-neutral'  };
  if (val > 30) return { label: `▼ Down ${v}`,  cls: 'rsi-neutral'  };
  if (val > 20) return { label: `▲ OS ${v}`,    cls: 'rsi-bull'     };
               return  { label: `⚡ OS ${v}`,   cls: 'rsi-ext-bull' };
}

function entryAnalysis(candles) {
  if (candles.length < 30) return { label: '—', cls: 'neutral' };
  const cloud   = ichimokuCloudNow(candles);
  const rsiData = calcRSI(candles);
  if (!rsiData.length) return { label: '—', cls: 'neutral' };
  const stoch = calcStoch(candles);
  if (!stoch.k.length) return { label: '—', cls: 'neutral' };

  const rsiVal = rsiData.at(-1).value;
  const currK  = stoch.k.at(-1).value;
  const prevK  = stoch.k.length > 1 ? stoch.k.at(-2).value : currK;
  const currD  = stoch.d.length ? stoch.d.at(-1).value : null;
  const closes = candles.map(c => c.close);
  const ma20   = smaVals(closes, 20).at(-1) ?? null;
  const ma50   = smaVals(closes, 50).at(-1) ?? null;

  // Bullish entry: stoch oversold+turning up, above cloud, RSI>50, MA20>MA50
  const bScore = [
    prevK < 20 && currK > prevK,
    cloud?.aboveCloud ?? false,
    rsiVal > 50,
    ma20 != null && ma50 != null && ma20 > ma50,
  ].filter(Boolean).length;

  // Bearish entry: stoch overbought+turning down, below cloud, RSI<50, MA20<MA50
  const sScore = [
    prevK > 80 && currK < prevK,
    cloud?.belowCloud ?? false,
    rsiVal < 50,
    ma20 != null && ma50 != null && ma20 < ma50,
  ].filter(Boolean).length;

  // Color class based on Stoch K value
  let stochCls;
  if (currK <= 15)      stochCls = 'stoch-ext-bull';
  else if (currK <= 20) stochCls = 'stoch-bull';
  else if (currK <= 80) stochCls = 'stoch-neutral';
  else if (currK <= 85) stochCls = 'stoch-bear';
  else                   stochCls = 'stoch-ext-bear';

  const suffix = ` K:${currK.toFixed(0)} D:${currD != null ? currD.toFixed(0) : '—'}`;

  if (bScore === 4) return { label: `▲ Long entry!${suffix}`,       cls: stochCls };
  if (sScore === 4) return { label: `▼ Short entry!${suffix}`,      cls: stochCls };
  if (bScore === 3) return { label: `▲ Setup ${bScore}/4${suffix}`, cls: stochCls };
  if (sScore === 3) return { label: `▼ Setup ${sScore}/4${suffix}`, cls: stochCls };
  return { label: `— Geen setup${suffix}`, cls: stochCls };
}

function exitAnalysis(candles) {
  if (candles.length < 30) return { label: '—', cls: 'neutral' };
  const cloud = ichimokuCloudNow(candles);
  const stoch = calcStoch(candles);
  if (!stoch.k.length) return { label: '—', cls: 'neutral' };

  const currK  = stoch.k.at(-1).value;
  const prevK  = stoch.k.length > 1 ? stoch.k.at(-2).value : currK;
  const closes = candles.map(c => c.close);
  const ma20   = smaVals(closes, 20).at(-1) ?? null;
  const last   = closes.at(-1);

  // Exit long (bearish): stoch OB+turning down, price<MA20, TK/KJ bearish cross
  const elScore = [
    currK > 80 && currK < prevK,
    ma20 != null && last < ma20,
    cloud?.tkKjCross === 'bearish',
  ].filter(Boolean).length;

  // Exit short (bullish): stoch OS+turning up, price>MA20, TK/KJ bullish cross
  const esScore = [
    currK < 20 && currK > prevK,
    ma20 != null && last > ma20,
    cloud?.tkKjCross === 'bullish',
  ].filter(Boolean).length;

  if (elScore >= 2) return { label: `⚠ Exit Long ${elScore}/3`,  cls: 'exit-bear' };
  if (esScore >= 2) return { label: `⚠ Exit Short ${esScore}/3`, cls: 'exit-bull' };
  return { label: '— Geen exit', cls: 'neutral' };
}

// ═══════════════════════════════════════════════════════════
//  SWING POINTS & SUPPORT / RESISTANCE
// ═══════════════════════════════════════════════════════════

// Dominant high/low detection: a bar is dominant if its high/low is strictly
// the highest/lowest in a ±n bar window. n=5 works well across all timeframes.
function calcSwingPoints(candles, n = 5) {
  const highs = [], lows = [];
  const end = candles.length - n;
  for (let i = n; i < end; i++) {
    const c = candles[i];
    let isH = true, isL = true;
    for (let j = i - n; j <= i + n; j++) {
      if (j === i) continue;
      if (candles[j].high >= c.high) isH = false;
      if (candles[j].low  <= c.low)  isL = false;
      if (!isH && !isL) break;
    }
    if (isH) highs.push({ time: c.time, price: c.high });
    if (isL) lows.push( { time: c.time, price: c.low  });
  }
  return { highs, lows };
}

// Merge price levels that are within `pct`% of each other into one cluster.
function clusterLevels(prices, pct = 0.8) {
  if (!prices.length) return [];
  const sorted = [...prices].sort((a, b) => a - b);
  const out = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if ((sorted[i] - out.at(-1)) / out.at(-1) * 100 >= pct) out.push(sorted[i]);
  }
  return out;
}

// Apply (or clear) swing markers and S/R price lines based on current toggle state.
function applySwingAndSR() {
  if (!candleSeries) return;

  // ── Swing point markers ──────────────────────────────
  const markers = [];
  if (indVisible.swing) {
    currentSwingPts.highs.forEach(h => markers.push({
      time: h.time, position: 'aboveBar',
      color: '#f85149', shape: 'arrowDown', text: 'H', size: 1,
    }));
    currentSwingPts.lows.forEach(l => markers.push({
      time: l.time, position: 'belowBar',
      color: '#26a641', shape: 'arrowUp', text: 'L', size: 1,
    }));
  }
  if (indVisible.bambam) {
    bambamSignals.forEach(s => markers.push(s));
  }
  markers.sort((a, b) => a.time - b.time);
  candleSeries.setMarkers(markers);

  // ── S/R price lines ──────────────────────────────────
  srPriceLines.forEach(pl => candleSeries.removePriceLine(pl));
  srPriceLines = [];

  if (indVisible.sr && currentCandles.length) {
    const price  = currentCandles.at(-1).close;
    const margin = price * 0.40;
    const LS     = LightweightCharts.LineStyle;

    // Compact price label: no decimals above 100, 2 decimals below
    const fmtSR = p => p >= 100
      ? Math.round(p).toLocaleString('en-US')
      : p.toFixed(p >= 1 ? 2 : 4);

    const resRaw = currentSwingPts.highs
      .map(h => h.price)
      .filter(p => p > price && p - price <= margin);
    const supRaw = currentSwingPts.lows
      .map(l => l.price)
      .filter(p => p < price && price - p <= margin);

    // Cluster at 3% and cap at 2 per side to keep the axis uncluttered.
    // Empty title: the axis label box already shows the price; color alone
    // identifies R (red = above price) vs S (green = below price).
    clusterLevels(resRaw, 3.0).slice(0, 2).forEach(level => {
      srPriceLines.push(candleSeries.createPriceLine({
        price: level,
        color: 'rgba(218,54,51,0.85)',
        lineWidth: 1,
        lineStyle: LS.Dashed,
        axisLabelVisible: true,
        title: '',
      }));
    });

    clusterLevels(supRaw, 3.0).slice(-2).forEach(level => {
      srPriceLines.push(candleSeries.createPriceLine({
        price: level,
        color: 'rgba(38,166,65,0.85)',
        lineWidth: 1,
        lineStyle: LS.Dashed,
        axisLabelVisible: true,
        title: '',
      }));
    });
  }
}

function applyLiqZones() {
  // Remove previous zones
  liqSeries.forEach(s => { try { chart.removeSeries(s); } catch (_) {} });
  liqSeries = [];
  liqPriceLines.forEach(pl => { try { candleSeries.removePriceLine(pl); } catch (_) {} });
  liqPriceLines = [];

  if (!indVisible.liq || !currentCandles.length) return;

  const price    = currentCandles.at(-1).close;
  const margin   = price * 0.25;     // ±25% of current price
  const boxH     = price * 0.003;    // zone height = 0.3% of price
  const lastTime = currentCandles.at(-1).time;
  const LS       = LightweightCharts.LineStyle;

  // BSL — Buy-Side Liquidity: zones sitting just above swing highs (amber)
  const bslPoints = currentSwingPts.highs
    .filter(h => h.price > price && h.price - price <= margin)
    .sort((a, b) => a.price - b.price)
    .slice(0, 5);

  // SSL — Sell-Side Liquidity: zones sitting just below swing lows (cyan)
  const sslPoints = currentSwingPts.lows
    .filter(l => l.price < price && price - l.price <= margin)
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  // BSL: baseline = swingHigh, zone extends upward by boxH
  // We use addBaselineSeries: baseValue = swingHigh, data value = swingHigh + boxH
  // topFillColor fills the area between baseValue and the data value (above)
  bslPoints.forEach(h => {
    const s = chart.addBaselineSeries({
      baseValue:        { type: 'price', price: h.price },
      topLineColor:     'rgba(255,193,7,0.85)',
      topFillColor1:    'rgba(255,193,7,0.25)',
      topFillColor2:    'rgba(255,193,7,0.10)',
      bottomLineColor:  'transparent',
      bottomFillColor1: 'transparent',
      bottomFillColor2: 'transparent',
      lineWidth:        1,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    s.setData([
      { time: h.time,   value: h.price + boxH },
      { time: lastTime, value: h.price + boxH },
    ]);
    liqSeries.push(s);
    liqPriceLines.push(candleSeries.createPriceLine({
      price:            h.price,
      color:            'rgba(255,193,7,0.70)',
      lineWidth:        1,
      lineStyle:        LS.Dotted,
      axisLabelVisible: true,
      title:            '',
    }));
  });

  // SSL: baseline = swingLow, zone extends downward by boxH
  // data value = swingLow - boxH; bottomFillColor fills the area below baseValue
  sslPoints.forEach(l => {
    const s = chart.addBaselineSeries({
      baseValue:        { type: 'price', price: l.price },
      topLineColor:     'transparent',
      topFillColor1:    'transparent',
      topFillColor2:    'transparent',
      bottomLineColor:  'rgba(0,188,212,0.85)',
      bottomFillColor1: 'rgba(0,188,212,0.25)',
      bottomFillColor2: 'rgba(0,188,212,0.10)',
      lineWidth:        1,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    s.setData([
      { time: l.time,   value: l.price - boxH },
      { time: lastTime, value: l.price - boxH },
    ]);
    liqSeries.push(s);
    liqPriceLines.push(candleSeries.createPriceLine({
      price:            l.price,
      color:            'rgba(0,188,212,0.70)',
      lineWidth:        1,
      lineStyle:        LS.Dotted,
      axisLabelVisible: true,
      title:            '',
    }));
  });
}

// ═══════════════════════════════════════════════════════════
//  CHART LOAD & RENDER
// ═══════════════════════════════════════════════════════════

async function loadChart(tf, sym, resetView = true) {
  showLoading(true);
  hideError();
  try {
    // Before fetching: check if the chart is already showing the live end.
    // With rightOffset the visible `to` extends beyond the last candle, so
    // `vr.to >= lastCandleTime` is true when the user is at the live edge.
    // If they've scrolled back into history, vr.to < lastCandleTime.
    let atLiveEnd = resetView;
    let savedRange = null;
    if (!resetView && currentCandles.length > 0) {
      const vr = chart.timeScale().getVisibleRange();
      atLiveEnd = vr != null && vr.to >= currentCandles.at(-1).time;
      if (!atLiveEnd) savedRange = vr;
    }

    const [raw, ticker] = await Promise.all([
      fetchKlines(sym.symbol, tf.interval, tf.limit),
      fetch24h(sym.symbol),
    ]);
    const candles = parseKlines(raw);

    // Price chart
    candleSeries.setData(candles);
    lineSeries.setData(candles.map(c => ({ time: c.time, value: c.close })));

    // Moving averages (expanding window → always visible, even on 1M)
    ser.sma200.setData(calcSMAExp(candles, 200));
    ser.sma50.setData( calcSMAExp(candles, 50));
    ser.sma20.setData( calcSMAExp(candles, 20));
    ser.ema9.setData(  calcEMA(candles, 9));

    // Bollinger Bands
    const bb = calcBB(candles);
    ser.bb_upper.setData(bb.upper);
    ser.bb_mid.setData(  bb.mid);
    ser.bb_lower.setData(bb.lower);

    // PSAR
    const psar = calcPSAR(candles);
    ser.psar_bull.setData(psar.bull);
    ser.psar_bear.setData(psar.bear);

    // Ichimoku
    const ichi = calcIchimoku(candles);
    ser.ichi_tenkan.setData(ichi.tenkan);
    ser.ichi_kijun.setData( ichi.kijun);
    ser.ichi_spanA.setData( ichi.spanA);
    ser.ichi_spanB.setData( ichi.spanB);
    ser.ichi_chikou.setData(ichi.chikou);

    // Volume
    ser.volume.setData(candles.map(c => ({
      time: c.time, value: c.volume,
      color: c.close >= c.open ? 'rgba(38,166,65,0.45)' : 'rgba(218,54,51,0.45)',
    })));

    // Oscillator
    ser.rsi.setData(   calcRSI(candles));
    const stoch = calcStoch(candles);
    ser.stochK.setData(stoch.k);
    ser.stochD.setData(stoch.d);

    // Oscillator background bands — flat lines spanning all candle times
    ser.stochBand.setData(candles.map(c => ({ time: c.time, value: 80 })));
    ser.rsiBand.setData(  candles.map(c => ({ time: c.time, value: 70 })));

    // MACD
    const macdData = calcMACD(candles);
    ser.macdLine.setData(  macdData.macd);
    ser.macdSignal.setData(macdData.signal);
    ser.macdHist.setData(  macdData.hist);

    // BamBam
    const bbData = calcBamBam(candles);
    bambamSignals = bbData.signals;
    ser.bbStep.setData(   bbData.step);
    ser.bbRsiEma.setData( bbData.rsiEma);
    ser.bbUpper.setData(  bbData.upper);
    ser.bbLower.setData(  bbData.lower);

    // Store for swing/SR so toggle callbacks can re-apply without re-fetching
    currentCandles  = candles;
    currentSwingPts = calcSwingPoints(candles);

    applyChartType();
    applyAllVisibility();

    // Advance the visible range when:
    //   a) initial/manual load (resetView=true), OR
    //   b) background refresh and the user was already at the live end.
    // If the user has scrolled back to look at history, leave the view alone.
    if (atLiveEnd) {
      syncing = true;
      if (resetView) {
        chart.timeScale().fitContent();
        oscChart.timeScale().fitContent();
        macdChart?.timeScale().fitContent();
      }
      const total = candles.length;
      if (total > tf.view) {
        const fromTime = candles[total - tf.view].time;
        const toTime   = candles[total - 1].time;
        chart.timeScale().setVisibleRange({ from: fromTime, to: toTime });
        oscChart.timeScale().setVisibleRange({ from: fromTime, to: toTime });
        macdChart?.timeScale().setVisibleRange({ from: fromTime, to: toTime });
      }
      setTimeout(() => { syncing = false; }, 0);
    } else if (savedRange) {
      // User was scrolled back in history — restore their exact view position
      syncing = true;
      chart.timeScale().setVisibleRange(savedRange);
      oscChart.timeScale().setVisibleRange(savedRange);
      macdChart?.timeScale().setVisibleRange(savedRange);
      setTimeout(() => { syncing = false; }, 0);
    }

    if (ticker) updateHeader(ticker, sym);
    updateTimestamp();
  } catch (err) {
    console.error(err);
    showError(err.message || 'Fout bij laden chartdata.');
  } finally {
    showLoading(false);
  }
}

function toggleMeasure() {
  measureMode = !measureMode;
  measureP1   = null;
  if (measureLine) { try { candleSeries.removePriceLine(measureLine); } catch (_) {} measureLine = null; }
  document.getElementById('measure-overlay').classList.add('hidden');
  document.getElementById('measure-hint')?.classList.add('hidden');
  document.getElementById('chart-container').style.cursor = measureMode ? 'crosshair' : '';
  const btn = document.getElementById('measure-btn');
  if (btn) {
    if (measureMode) {
      btn.style.color = '#ffc107'; btn.style.borderColor = 'rgba(255,193,7,0.5)';
      btn.style.background = 'rgba(255,193,7,0.10)';
    } else {
      btn.style.color = ''; btn.style.borderColor = ''; btn.style.background = '';
    }
  }
}

function showMeasureResult(p1, p2) {
  const diff    = p2.price - p1.price;
  const pct     = (diff / p1.price) * 100;
  const sign    = pct >= 0 ? '+' : '';
  const color   = pct >= 0 ? '#26a641' : '#da3633';
  const i1 = currentCandles.findIndex(c => c.time >= p1.time);
  const i2 = currentCandles.findIndex(c => c.time >= p2.time);
  const bars = (i1 >= 0 && i2 >= 0) ? Math.abs(i2 - i1) : '—';

  const ov = document.getElementById('measure-overlay');
  ov.innerHTML = `
    <div class="meas-row"><span class="meas-lbl">Van</span><span>${fmtP(p1.price)}</span></div>
    <div class="meas-row"><span class="meas-lbl">Naar</span><span>${fmtP(p2.price)}</span></div>
    <div class="meas-row"><span class="meas-lbl">Verschil</span><span style="color:${color}">${sign}${fmtP(Math.abs(diff))}</span></div>
    <div class="meas-row meas-pct"><span class="meas-lbl">%</span><span style="color:${color}">${sign}${pct.toFixed(2)}%</span></div>
    <div class="meas-row"><span class="meas-lbl">Candles</span><span>${bars}</span></div>
    <button class="meas-close" onclick="document.getElementById('measure-overlay').classList.add('hidden')">×</button>`;
  ov.classList.remove('hidden');
}

function applyChartType() {
  candleSeries.applyOptions({ visible: chartType === 'candles' });
  lineSeries.applyOptions(   { visible: chartType === 'line'    });
}

function applyAllVisibility() {
  ser.sma200.applyOptions({ visible: indVisible.sma200 });
  ser.sma50.applyOptions(  { visible: indVisible.sma50  });
  ser.sma20.applyOptions(  { visible: indVisible.sma20  });
  ser.ema9.applyOptions(   { visible: indVisible.ema9   });


  const bb = indVisible.bb;
  ser.bb_upper.applyOptions({ visible: bb });
  ser.bb_mid.applyOptions(  { visible: bb });
  ser.bb_lower.applyOptions({ visible: bb });

  const ps = indVisible.psar;
  ser.psar_bull.applyOptions({ visible: ps });
  ser.psar_bear.applyOptions({ visible: ps });

  const ic = indVisible.ichimoku;
  ser.ichi_tenkan.applyOptions({ visible: ic });
  ser.ichi_kijun.applyOptions( { visible: ic });
  ser.ichi_spanA.applyOptions( { visible: ic });
  ser.ichi_spanB.applyOptions( { visible: ic });
  ser.ichi_chikou.applyOptions({ visible: ic });

  ser.volume.applyOptions({ visible: indVisible.volume });

  ser.rsi.applyOptions(      { visible: indVisible.rsi   });
  ser.rsiBand.applyOptions(  { visible: indVisible.rsi   });
  ser.stochK.applyOptions(   { visible: indVisible.stoch });
  ser.stochD.applyOptions(   { visible: indVisible.stoch });
  ser.stochBand.applyOptions({ visible: indVisible.stoch });

  const bb2 = indVisible.bambam;
  ser.bbStep.applyOptions(   { visible: bb2 });
  ser.bbRsiEma.applyOptions( { visible: bb2 });
  ser.bbUpper.applyOptions(  { visible: bb2 });
  ser.bbLower.applyOptions(  { visible: bb2 });
  toggleOscPane(indVisible.rsi || indVisible.stoch || bb2);
  updateOscLegend();

  [ser.macdLine, ser.macdSignal, ser.macdHist].forEach(s => s.applyOptions({ visible: indVisible.macd }));
  toggleMacdPane(indVisible.macd);

  applySwingAndSR();
  applyLiqZones();
  document.getElementById('phases-legend-hd').classList.toggle('hidden', !indVisible.phases);
  drawPhases();
}

function toggleIndicator(id, visible) {
  indVisible[id] = visible;
  savePrefs({ inds: { ...indVisible } });
  if (id === 'swing' || id === 'sr') {
    applySwingAndSR();
    return;
  }
  if (id === 'liq') {
    applyLiqZones();
    return;
  }
  if (id === 'phases') {
    document.getElementById('phases-legend-hd').classList.toggle('hidden', !visible);
    drawPhases();
    return;
  }
  if (id === 'bambam') {
    ser.bbStep.applyOptions(   { visible });
    ser.bbRsiEma.applyOptions( { visible });
    ser.bbUpper.applyOptions(  { visible });
    ser.bbLower.applyOptions(  { visible });
    toggleOscPane(indVisible.rsi || indVisible.stoch || visible);
    applySwingAndSR();
    return;
  }
  if (id === 'rsi' || id === 'stoch') {
    if (id === 'rsi') {
      ser.rsi.applyOptions(    { visible });
      ser.rsiBand.applyOptions({ visible });
    } else {
      ser.stochK.applyOptions(   { visible });
      ser.stochD.applyOptions(   { visible });
      ser.stochBand.applyOptions({ visible });
    }
    toggleOscPane(indVisible.rsi || indVisible.stoch);
    updateOscLegend();
    return;
  }
  if (id === 'macd') {
    [ser.macdLine, ser.macdSignal, ser.macdHist].forEach(s => s.applyOptions({ visible }));
    toggleMacdPane(visible);
    return;
  }
  if (id === 'bb') {
    [ser.bb_upper, ser.bb_mid, ser.bb_lower].forEach(s => s.applyOptions({ visible }));
    return;
  }
  if (id === 'psar') {
    ser.psar_bull.applyOptions({ visible });
    ser.psar_bear.applyOptions({ visible });
    return;
  }
  if (id === 'ichimoku') {
    [ser.ichi_tenkan, ser.ichi_kijun, ser.ichi_spanA, ser.ichi_spanB, ser.ichi_chikou]
      .forEach(s => s.applyOptions({ visible }));
    return;
  }
  if (ser[id]) ser[id].applyOptions({ visible });
}

function updateOscLegend() {
  document.querySelector('.osc-li.rsi').style.display = indVisible.rsi   ? '' : 'none';
  document.querySelector('.osc-li.stk').style.display = indVisible.stoch ? '' : 'none';
  document.querySelector('.osc-li.std').style.display = indVisible.stoch ? '' : 'none';
}

function toggleOscPane(visible) {
  document.getElementById('osc-wrapper').classList.toggle('hidden', !visible);
  requestAnimationFrame(() => {
    const mc = document.getElementById('main-chart-area');
    chart?.applyOptions({ width: mc.clientWidth, height: mc.clientHeight });
    if (visible) {
      const oc = document.getElementById('osc-container');
      oscChart?.applyOptions({ width: oc.clientWidth, height: oc.clientHeight });
    }
  });
}

function toggleMacdPane(visible) {
  document.getElementById('macd-wrapper').classList.toggle('hidden', !visible);
  requestAnimationFrame(() => {
    const mc = document.getElementById('main-chart-area');
    chart?.applyOptions({ width: mc.clientWidth, height: mc.clientHeight });
    if (visible) {
      const mc2 = document.getElementById('macd-container');
      macdChart?.applyOptions({ width: mc2.clientWidth, height: mc2.clientHeight });
    }
  });
}

// ═══════════════════════════════════════════════════════════
//  PERSISTENCE — localStorage
// ═══════════════════════════════════════════════════════════

const LS_KEY = 'cdash_v1';

function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
}
function savePrefs(patch) {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ ...loadPrefs(), ...patch })); } catch {}
}
function applyPrefs() {
  const p = loadPrefs();
  if (p.base  && TOP_BASES.some(x => x.id === p.base))  currentBase  = p.base;
  if (p.quote && QUOTES.some(x =>    x.id === p.quote)) currentQuote = p.quote;
  currentSymbol = buildSym(currentBase, currentQuote);
  if (p.tf)   { const t = TIMEFRAMES.find(x => x.interval === p.tf); if (t) currentTF = t; }
  if (p.inds) { Object.keys(p.inds).forEach(k => { if (k in indVisible) indVisible[k] = p.inds[k]; }); }
}

// ═══════════════════════════════════════════════════════════
//  REALTIME — WebSocket + helpers
// ═══════════════════════════════════════════════════════════

let wsConn        = null;
let wsReconnTimer = null;

function connectWS(sym) {
  if (wsConn) {
    // Null out handlers BEFORE close so the onclose doesn't re-trigger
    // reconnection to the old symbol when the connection finally drops.
    wsConn.onmessage = null;
    wsConn.onclose   = null;
    wsConn.onerror   = null;
    try { wsConn.close(); } catch {}
    wsConn = null;
  }
  clearTimeout(wsReconnTimer);
  const conn = new WebSocket(`wss://stream.binance.com:9443/ws/${sym.symbol.toLowerCase()}@ticker`);
  wsConn = conn;
  conn.onmessage = e => {
    if (conn !== wsConn) return; // guard against late messages from a replaced connection
    const d  = JSON.parse(e.data);
    const ch = parseFloat(d.P);
    document.getElementById('current-price').textContent = sym.cur + fmtP(parseFloat(d.c));
    document.getElementById('price-high').textContent    = sym.cur + fmtP(parseFloat(d.h));
    document.getElementById('price-low').textContent     = sym.cur + fmtP(parseFloat(d.l));
    const el = document.getElementById('price-change');
    el.textContent = (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%';
    el.className   = 'price-change ' + (ch >= 0 ? 'positive' : 'negative');
  };
  conn.onclose = () => {
    if (conn !== wsConn) return; // already replaced, don't reconnect to old sym
    wsConn = null;
    wsReconnTimer = setTimeout(() => connectWS(sym), 5000);
  };
  conn.onerror = () => { try { conn?.close(); } catch {} };
}

function updateTimestamp() {
  const el = document.getElementById('last-update');
  if (el) el.textContent = new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

async function fetchFearGreed() {
  try {
    const r    = await fetch('https://api.alternative.me/fng/?limit=1');
    const d    = await r.json();
    const item = d.data?.[0];
    if (!item) return;
    const val  = parseInt(item.value, 10);
    const color = val <= 25 ? '#da3633' : val <= 45 ? '#fd7e14' : val <= 55 ? '#8b949e' : val <= 75 ? '#57ab5a' : '#26a641';
    const el   = document.getElementById('fg-value');
    if (el) { el.textContent = `${val} — ${item.value_classification}`; el.style.color = color; }
  } catch {}
}

// ═══════════════════════════════════════════════════════════
//  TREND ANALYSIS
// ═══════════════════════════════════════════════════════════

function analyzeTrend(candles) {
  if (candles.length < 10) return 'unknown';
  const closes = candles.map(c => c.close);
  const last   = closes.at(-1);
  const s20    = smaVals(closes, 20);
  const s50    = smaVals(closes, 50);
  const s200   = smaVals(closes, 200);
  const l20    = s20.at(-1)  ?? null;
  const l50    = s50.at(-1)  ?? null;
  const l200   = s200.at(-1) ?? null;
  let score = 0, total = 0;
  if (l20  != null) { total++; if (last > l20)  score++; }
  if (l50  != null) { total++; if (last > l50)  score++; }
  if (l200 != null) { total++; if (last > l200) score++; }
  if (l50  != null && l200 != null) { total++; if (l50 > l200) score++; }
  if (!total) return 'unknown';
  const r = score / total;
  return r >= 0.65 ? 'bullish' : r <= 0.35 ? 'bearish' : 'consolidation';
}

function analyzeVolume(candles) {
  if (candles.length < 10) return { label: '—', cls: 'neutral' };
  const vols  = candles.map(c => c.volume);
  const n     = vols.length;
  const rec   = vols.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const avg   = vols.slice(Math.max(0, n - 20)).reduce((a, b) => a + b, 0) / Math.min(20, n);
  const r     = rec / avg;
  if (r > 1.5)  return { label: '↑↑ Sterk toenemend',  cls: 'vol-sup'   };
  if (r > 1.15) return { label: '↑ Licht toenemend',   cls: 'vol-up'    };
  if (r < 0.67) return { label: '↓↓ Sterk afnemend',   cls: 'vol-sdown' };
  if (r < 0.85) return { label: '↓ Licht afnemend',    cls: 'vol-down'  };
  return         { label: '→ Stabiel',                  cls: 'vol-flat'  };
}

function detectCross(candles) {
  if (candles.length < 205) return null;
  const closes = candles.map(c => c.close);
  const s50    = smaVals(closes, 50);
  const s200   = smaVals(closes, 200);
  if (s50.length < 5 || s200.length < 2) return null;

  // Both arrays end at the same candle → direct last-N comparison
  const lb = Math.min(5, s200.length - 1);
  for (let i = 0; i < lb; i++) {
    const c50 = s50.at(-1-i), p50 = s50.at(-2-i);
    const c200 = s200.at(-1-i), p200 = s200.at(-2-i);
    if (p50 == null || p200 == null) break;
    if (p50 <= p200 && c50 > c200) return { type: 'recent', dir: 'golden' };
    if (p50 >= p200 && c50 < c200) return { type: 'recent', dir: 'death'  };
  }
  const d = Math.abs(s50.at(-1) - s200.at(-1)) / s200.at(-1);
  if (d < 0.015) return { type: 'near', dir: s50.at(-1) > s200.at(-1) ? 'golden' : 'death' };
  return null;
}

const LOW_ICHI_TFS = new Set(['1H', '15m', '5m', '3m', '1m']);

function maTrendOrderHtml(candles) {
  const closes = candles.map(c => c.close);
  const price  = closes.at(-1);
  const m9     = calcEMA(candles, 9).at(-1)?.value ?? null;
  const m20    = smaLastExp(closes, 20);
  const m50    = smaLastExp(closes, 50);
  const m200   = smaLastExp(closes, 200);

  const items = [{ val: price, tag: 'PRIJS', color: '#79c0ff' }];
  if (m9   != null) items.push({ val: m9,   tag: 'EMA9',  color: '#d0d7de' });
  if (m20  != null) items.push({ val: m20,  tag: 'MA20',  color: '#f5e642' });
  if (m50  != null) items.push({ val: m50,  tag: 'MA50',  color: '#fd7e14' });
  if (m200 != null) items.push({ val: m200, tag: 'MA200', color: '#f85149' });

  items.sort((a, b) => b.val - a.val);
  return '[ ' + items.map(i => `<span style="color:${i.color}">${i.tag}</span>`).join(' &gt; ') + ' ]';
}

async function updateTrendPanel(symbol) {
  const rows = await Promise.all(
    TREND_TFS.map(tf =>
      fetchKlines(symbol, tf.interval, 1000)
        .then(raw => ({ label: tf.label, candles: parseKlines(raw) }))
        .catch(() => ({ label: tf.label, candles: [] }))
    )
  );

  rows.forEach(({ label, candles }) => {
    const row = document.querySelector(`.trend-row[data-tf="${label}"]`);
    if (!row) return;

    const setCell = (cls, text, status) => {
      const el = row.querySelector(`.${cls}`);
      if (el) { el.textContent = text; el.className = `${cls} ${status}`; }
    };

    if (!candles.length) {
      ['td-vol','td-ichi','td-trend-sig','td-ma','td-bb','td-mom','td-entry','td-exit','td-signals','td-setup']
        .forEach(c => setCell(c, '—', 'neutral'));
      ['td-ep','td-sl','td-tp'].forEach(c => {
        const el = row.querySelector(`.${c}`); if (el) el.textContent = '—';
      });
      return;
    }

    const vol = analyzeVolume(candles);
    setCell('td-vol', vol.label, vol.cls);

    const ichi = LOW_ICHI_TFS.has(label)
      ? { label: '— Onbetrouwbaar', cls: 'neutral' }
      : ichimokuTrendAnalysis(candles);
    setCell('td-ichi', ichi.label, ichi.cls);

    const ma       = maTrendAnalysis(candles);
    setCell('td-trend-sig', ma.label, 'neutral');
    const maEl = row.querySelector('.td-ma');
    if (maEl) {
      maEl.className = 'td-ma neutral';
      maEl.innerHTML = maTrendOrderHtml(candles);
    }

    const bbw = calcBBWidth(candles);
    if (bbw == null) {
      setCell('td-bb', '—', 'neutral');
    } else {
      const cls = bbw < 2 ? 'bb-squeeze' : bbw > 8 ? 'bb-wide' : 'neutral';
      setCell('td-bb', bbw.toFixed(1) + '%', cls);
    }

    const mom = rsiMomentumAnalysis(candles);
    setCell('td-mom', mom.label, mom.cls);

    const entry = entryAnalysis(candles);
    setCell('td-entry', entry.label, entry.cls);

    const exit = exitAnalysis(candles);
    setCell('td-exit', exit.label, exit.cls);

    const cross = detectCross(candles);
    if (!cross) {
      setCell('td-signals', '—', 'neutral');
    } else {
      const isG = cross.dir === 'golden', isR = cross.type === 'recent';
      if (isR &&  isG) setCell('td-signals', '⚡ Golden Cross', 'golden');
      else if (isR)    setCell('td-signals', '💀 Death Cross',  'death' );
      else if (isG)    setCell('td-signals', '⚠ Near Golden',  'near-g');
      else             setCell('td-signals', '⚠ Near Death',   'near-d');
    }

    const setup = calcTradeSetup(candles);
    const setPx = (cls, val) => { const el = row.querySelector(`.${cls}`); if (el) el.textContent = val; };
    if (!setup) {
      setCell('td-setup', '—', 'neutral');
      ['td-ep','td-sl','td-tp','td-pct'].forEach(c => setPx(c, '—'));
    } else {
      setCell('td-setup', setup.label, setup.direction);
      setPx('td-ep', setup.entry);
      setPx('td-sl', setup.sl);
      setPx('td-tp', setup.tp);
      const pct = ((setup.tpRaw - setup.entryRaw) / setup.entryRaw) * 100;
      const pctEl = row.querySelector('.td-pct');
      if (pctEl) {
        pctEl.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
        pctEl.className = 'td-pct ' + (pct >= 0 ? 'positive' : 'negative');
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════
//  HEADER
// ═══════════════════════════════════════════════════════════

function updateHeader(t, sym) {
  const ch = parseFloat(t.priceChangePercent);
  document.getElementById('hd-pair').textContent     = sym.label;
  document.getElementById('current-price').textContent = sym.cur + fmtP(parseFloat(t.lastPrice));
  document.getElementById('price-high').textContent  = sym.cur + fmtP(parseFloat(t.highPrice));
  document.getElementById('price-low').textContent   = sym.cur + fmtP(parseFloat(t.lowPrice));
  const el = document.getElementById('price-change');
  el.textContent = (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%';
  el.className   = 'price-change ' + (ch >= 0 ? 'positive' : 'negative');
}

// ═══════════════════════════════════════════════════════════
//  UI BUILDERS
// ═══════════════════════════════════════════════════════════

async function switchPair() {
  savePrefs({ base: currentBase, quote: currentQuote });
  connectWS(currentSymbol);
  resetTimers();
  updateTrendPanel(currentSymbol.symbol);
  await loadChart(currentTF, currentSymbol);
  scheduleTimers();
}

function buildPairSelector() {
  // ── Base coin dropdown ────────────────────────────────
  const baseGrp = document.getElementById('base-selector');
  const sel = document.createElement('select');
  sel.className = 'pair-select';
  sel.title = 'Selecteer munt';
  TOP_BASES.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = b.id;
    opt.title = b.name;
    if (b.id === currentBase) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', async () => {
    currentBase   = sel.value;
    currentSymbol = buildSym(currentBase, currentQuote);
    await switchPair();
  });
  baseGrp.appendChild(sel);

  // ── Quote currency buttons ────────────────────────────
  const quoteGrp = document.getElementById('quote-buttons');
  QUOTES.forEach(q => {
    const btn = mkBtn('pair-btn' + (q.id === currentQuote ? ' active' : ''), q.id);
    btn.addEventListener('click', async () => {
      if (q.id === currentQuote) return;
      currentQuote  = q.id;
      currentSymbol = buildSym(currentBase, currentQuote);
      quoteGrp.querySelectorAll('.pair-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      await switchPair();
    });
    quoteGrp.appendChild(btn);
  });
}

function buildTFButtons() {
  const grp = document.getElementById('timeframe-buttons');
  TIMEFRAMES.forEach(tf => {
    const btn = mkBtn('tf-btn' + (tf === currentTF ? ' active' : ''), tf.label);
    btn.addEventListener('click', async () => {
      if (currentTF === tf) return;
      currentTF = tf;
      grp.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      savePrefs({ tf: tf.interval });
      resetTimers();
      await loadChart(tf, currentSymbol);
      scheduleTimers();
    });
    grp.appendChild(btn);
  });
}

function buildChartTypeButtons() {
  document.querySelectorAll('.ct-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (chartType === btn.dataset.type) return;
      chartType = btn.dataset.type;
      document.querySelectorAll('.ct-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyChartType();
    });
  });
}

function buildIndicatorButtons() {
  const grp = document.getElementById('indicator-buttons');
  const allInds = [...OVERLAY_INDS, ...OSC_INDS];

  allInds.forEach(ind => {
    const on  = ind.defaultOn;
    const btn = mkBtn('ind-btn', ind.label);
    btn.dataset.ind = ind.id;
    if (on) { setIndBtnOn(btn, ind.color); btn.classList.add('active'); }

    btn.addEventListener('click', () => {
      const nowOn = !indVisible[ind.id];
      toggleIndicator(ind.id, nowOn);
      btn.classList.toggle('active', nowOn);
      if (nowOn) setIndBtnOn(btn, ind.color);
      else       setIndBtnOff(btn);
    });
    grp.appendChild(btn);
  });
}

function buildTrendRows() {
  const tbody = document.getElementById('trend-body');
  TREND_TFS.forEach(tf => {
    const tr = document.createElement('tr');
    tr.className  = 'trend-row';
    tr.dataset.tf = tf.label;
    tr.innerHTML  = `
      <td class="td-tf">${tf.label}</td>
      <td class="td-vol neutral">—</td>
      <td class="td-ichi neutral">—</td>
      <td class="td-trend-sig neutral">—</td>
      <td class="td-ma neutral">—</td>
      <td class="td-bb neutral">—</td>
      <td class="td-mom neutral">—</td>
      <td class="td-entry neutral">—</td>
      <td class="td-exit neutral">—</td>
      <td class="td-signals neutral">—</td>
      <td class="td-setup neutral">—</td>
      <td class="td-ep">—</td>
      <td class="td-sl">—</td>
      <td class="td-tp">—</td>
      <td class="td-pct">—</td>`;
    tbody.appendChild(tr);
  });
}

function setIndBtnOn(btn, color) {
  btn.style.color       = color;
  btn.style.borderColor = color + '55';
  btn.style.background  = color + '18';
}
function setIndBtnOff(btn) {
  btn.style.color = btn.style.borderColor = btn.style.background = '';
}
function mkBtn(cls, label) {
  const b = document.createElement('button');
  b.className = cls; b.textContent = label;
  return b;
}

// ═══════════════════════════════════════════════════════════
//  TIMERS
// ═══════════════════════════════════════════════════════════

function scheduleTimers() {
  chartTimer = setInterval(() => loadChart(currentTF, currentSymbol, false), CHART_REFRESH);
  trendTimer = setInterval(() => updateTrendPanel(currentSymbol.symbol), TREND_REFRESH);
}
function resetTimers() {
  clearInterval(chartTimer); clearInterval(trendTimer);
}

// ═══════════════════════════════════════════════════════════
//  UI HELPERS
// ═══════════════════════════════════════════════════════════

function showLoading(on) {
  document.getElementById('loading').style.display = on ? 'flex' : 'none';
}
function showError(msg) {
  document.getElementById('error-msg').textContent = msg;
  document.getElementById('error-banner').classList.remove('hidden');
}
function hideError() {
  document.getElementById('error-banner').classList.add('hidden');
}
function fmtP(n) { return n == null ? '—' : smartPriceFmt(n); }
function fmtTime(t, iv) {
  // t is pre-shifted to local time (see TZ_OFFSET_SEC in parseKlines).
  // Use timeZone:'UTC' so toLocaleString treats the shifted value as-is
  // and doesn't apply the browser's local offset a second time.
  const d = new Date(t * 1000);
  if (['1m','5m'].includes(iv))
    return d.toLocaleString('nl-NL', { timeZone: 'UTC', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  if (['1h','4h'].includes(iv))
    return d.toLocaleString('nl-NL', { timeZone: 'UTC', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  return d.toLocaleString('nl-NL', { timeZone: 'UTC', year: 'numeric', month: 'short', day: '2-digit' });
}

// ═══════════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  applyPrefs();   // restore saved pair/TF/indicators before building UI

  initChart();
  initOscChart();
  initMacdChart();
  buildPairSelector();
  buildTFButtons();
  buildChartTypeButtons();
  buildIndicatorButtons();
  buildTrendRows();

  if (!indVisible.rsi && !indVisible.stoch && !indVisible.bambam) toggleOscPane(false);
  if (!indVisible.macd) toggleMacdPane(false);

  document.getElementById('retry-btn').addEventListener('click', async () => {
    hideError();
    await loadChart(currentTF, currentSymbol);
  });

  await Promise.all([
    loadChart(currentTF, currentSymbol),
    updateTrendPanel(currentSymbol.symbol),
  ]);

  connectWS(currentSymbol);
  fetchFearGreed();
  scheduleTimers();

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
});
