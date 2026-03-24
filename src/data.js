// ─────────────────────────────────────────────────────────────────────────────
// data.js  —  All dashboard data extracted from the UPDATED cleaned dataset
// Source:  Synergy_Group_Data_Set.xlsx  →  "Clean world population" sheet
// Verified against Power BI dashboard · Synergy Team · Women Techsters 5.0
// ─────────────────────────────────────────────────────────────────────────────

export const KPI = {
  totalCountries:    235,
  avgPressureIndex:  4.58,
  avgUrbanPct:       59.23,
  avgDensity:        475.77,
  avgGrowthRate:     0.01,      // raw decimal avg (0.011) — matches Power BI display
  avgGrowthRatePct:  1.1,       // percentage form for display labels
  totalNetMigration: 1263,
}

// ── Risk Level Distribution (verified from Excel) ─────────────────────────────
export const RISK_DIST = {
  "Low Risk":    204,   // 86.81%
  "Medium Risk":  25,   // 10.64%
  "High Risk":     6,   //  2.55%
}

// ── Urbanisation Level Distribution (includes 13 blank/unclassified) ─────────
export const URBAN_DIST = {
  "Moderately Urban": 86,   // 36.6%
  "Highly Urban":     82,   // 34.89%
  "Low Urban":        54,   // 22.98%
  "Not Classified":   13,   //  5.53%  — shown as "Blank" in Power BI
}

// ── Population Category ───────────────────────────────────────────────────────
export const POP_CAT = {
  "Low Population":    175,
  "Medium Population":  46,
  "High Population":    14,
}

// ── Top 10 Population Pressure Index (sorted desc) ───────────────────────────
export const TOP_PRESSURE = [
  ["Macao",               300.87],
  ["Monaco",              186.99],
  ["Bahrain",              82.40],
  ["Singapore",            66.03],
  ["Hong Kong",            58.55],
  ["Maldives",             32.62],
  ["State of Palestine",   20.41],
  ["Mayotte",              18.20],
  ["Sint Maarten",         14.50],
  ["Burundi",              14.45],
]

// ── Top 10 Population Density (per km²) ──────────────────────────────────────
export const TOP_DENSITY = [
  ["Monaco",      26337],
  ["Macao",       21645],
  ["Singapore",    8358],
  ["Hong Kong",    7140],
  ["Gibraltar",    3369],
  ["Bahrain",      2239],
  ["Holy See",     2003],
  ["Maldives",     1802],
  ["Malta",        1380],
  ["Bangladesh",   1265],
]

// ── Top 10 Fastest Growing Countries (growth % per year) ─────────────────────
export const TOP_GROWTH = [
  ["Niger",             3.84],
  ["Bahrain",           3.68],
  ["Equatorial Guinea", 3.47],
  ["Uganda",            3.32],
  ["Angola",            3.27],
  ["DR Congo",          3.19],
  ["Burundi",           3.12],
  ["Falkland Islands",  3.05],
  ["Mali",              3.02],
  ["Chad",              3.00],
]

// ── Top 10 Net Migration Inflows ──────────────────────────────────────────────
export const TOP_MIGRATION_IN = [
  ["United States",  954806],
  ["Germany",        543822],
  ["Turkey",         283922],
  ["United Kingdom", 260650],
  ["Canada",         242032],
  ["Colombia",       204796],
  ["Russia",         182456],
  ["Uganda",         168694],
  ["Australia",      158246],
  ["Italy",          148943],
]

// ── Top 10 Net Migration Outflows (absolute values) ───────────────────────────
export const TOP_MIGRATION_OUT = [
  ["Venezuela",   653249],
  ["India",       532687],
  ["Syria",       427391],
  ["Bangladesh",  369501],
  ["China",       348399],
  ["Pakistan",    233379],
  ["South Sudan", 174200],
  ["Myanmar",     163313],
  ["Zimbabwe",    116858],
  ["Indonesia",    98955],
]

// ── Top 10 Most Populous Countries ───────────────────────────────────────────
export const TOP_POP = [
  ["China",         1439323776],
  ["India",         1380004385],
  ["United States",  331002651],
  ["Indonesia",      273523615],
  ["Pakistan",       220892340],
  ["Brazil",         212559417],
  ["Nigeria",        206139589],
  ["Bangladesh",     164689383],
  ["Russia",         145934462],
  ["Mexico",         128932753],
]

// ── Scatter Plot: Population vs Fertility Rate (matches Power BI) ─────────────
// Y = population, X = fertility_rate, size = population
// Ordered by population descending, top 30 countries with fertility data
export const SCATTER_DATA = [
  { country: "China",         fertility: 1.7, urban: 61, pop: 1439323776 },
  { country: "India",         fertility: 2.2, urban: 35, pop: 1380004385 },
  { country: "United States", fertility: 1.8, urban: 83, pop: 331002651  },
  { country: "Indonesia",     fertility: 2.3, urban: 56, pop: 273523615  },
  { country: "Pakistan",      fertility: 3.6, urban: 35, pop: 220892340  },
  { country: "Brazil",        fertility: 1.7, urban: 88, pop: 212559417  },
  { country: "Nigeria",       fertility: 5.4, urban: 52, pop: 206139589  },
  { country: "Bangladesh",    fertility: 2.1, urban: 39, pop: 164689383  },
  { country: "Russia",        fertility: 1.8, urban: 74, pop: 145934462  },
  { country: "Mexico",        fertility: 2.1, urban: 84, pop: 128932753  },
  { country: "Japan",         fertility: 1.4, urban: 92, pop: 126476461  },
  { country: "Ethiopia",      fertility: 4.3, urban: 21, pop: 114963588  },
  { country: "Philippines",   fertility: 2.6, urban: 47, pop: 109581078  },
  { country: "Egypt",         fertility: 3.3, urban: 43, pop: 102334404  },
  { country: "Vietnam",       fertility: 2.1, urban: 38, pop:  97338579  },
  { country: "DR Congo",      fertility: 6.0, urban: 46, pop:  89561403  },
  { country: "Turkey",        fertility: 2.1, urban: 76, pop:  84339067  },
  { country: "Iran",          fertility: 2.2, urban: 76, pop:  83992949  },
  { country: "Germany",       fertility: 1.6, urban: 76, pop:  83783942  },
  { country: "Thailand",      fertility: 1.5, urban: 51, pop:  69799978  },
  { country: "United Kingdom",fertility: 1.8, urban: 83, pop:  67886011  },
  { country: "France",        fertility: 1.9, urban: 82, pop:  65273511  },
  { country: "Italy",         fertility: 1.3, urban: 69, pop:  60461826  },
  { country: "Tanzania",      fertility: 4.9, urban: 37, pop:  59734218  },
  { country: "South Africa",  fertility: 2.4, urban: 67, pop:  59308690  },
  { country: "Kenya",         fertility: 3.5, urban: 28, pop:  53771296  },
  { country: "South Korea",   fertility: 1.1, urban: 82, pop:  51269185  },
  { country: "Colombia",      fertility: 1.8, urban: 80, pop:  50882891  },
  { country: "Uganda",        fertility: 5.0, urban: 26, pop:  45741007  },
  { country: "Spain",         fertility: 1.3, urban: 80, pop:  46754778  },
]

// ── Data Table: Top 15 countries by population ────────────────────────────────
export const TABLE_DATA = [
  { country:"China",         population:1439323776, growth:0.39,  density:153,  urban:61, pressure:0.60,  risk:"Low Risk",    level:"Moderately Urban" },
  { country:"India",         population:1380004385, growth:0.99,  density:464,  urban:35, pressure:4.59,  risk:"Low Risk",    level:"Low Urban"        },
  { country:"United States", population:331002651,  growth:0.59,  density:36,   urban:83, pressure:0.21,  risk:"Low Risk",    level:"Highly Urban"     },
  { country:"Indonesia",     population:273523615,  growth:1.07,  density:151,  urban:56, pressure:1.62,  risk:"Medium Risk", level:"Moderately Urban" },
  { country:"Pakistan",      population:220892340,  growth:2.00,  density:287,  urban:35, pressure:5.74,  risk:"Medium Risk", level:"Low Urban"        },
  { country:"Brazil",        population:212559417,  growth:0.72,  density:25,   urban:88, pressure:0.18,  risk:"Low Risk",    level:"Highly Urban"     },
  { country:"Nigeria",       population:206139589,  growth:2.58,  density:226,  urban:52, pressure:5.83,  risk:"Medium Risk", level:"Moderately Urban" },
  { country:"Bangladesh",    population:164689383,  growth:1.01,  density:1265, urban:39, pressure:12.78, risk:"Medium Risk", level:"Low Urban"        },
  { country:"Russia",        population:145934462,  growth:0.04,  density:9,    urban:74, pressure:0.00,  risk:"Low Risk",    level:"Highly Urban"     },
  { country:"Mexico",        population:128932753,  growth:1.06,  density:66,   urban:84, pressure:0.70,  risk:"Low Risk",    level:"Highly Urban"     },
  { country:"Japan",         population:126476461,  growth:-0.30, density:347,  urban:92, pressure:-1.04, risk:"Low Risk",    level:"Highly Urban"     },
  { country:"Ethiopia",      population:114963588,  growth:2.57,  density:115,  urban:21, pressure:2.96,  risk:"Low Risk",    level:"Low Urban"        },
  { country:"Philippines",   population:109581078,  growth:1.35,  density:368,  urban:47, pressure:4.97,  risk:"Medium Risk", level:"Moderately Urban" },
  { country:"Egypt",         population:102334404,  growth:1.94,  density:103,  urban:43, pressure:2.00,  risk:"Low Risk",    level:"Moderately Urban" },
  { country:"Vietnam",       population:97338579,   growth:0.91,  density:314,  urban:38, pressure:2.86,  risk:"Low Risk",    level:"Low Urban"        },
]

// ── Insights from Excel "Insights" sheet ─────────────────────────────────────
export const INSIGHTS = [
  {
    title: "High Population Concentration",
    text: "A small number of countries account for a large share of global population, increasing pressure on urban systems.",
  },
  {
    title: "Rapid Urban Population Growth",
    text: "Growing urban populations increase demand for housing, transport, and services.",
  },
  {
    title: "Uneven Urbanisation",
    text: "Not all highly populated countries are equally urbanised, showing significant development gaps.",
  },
  {
    title: "Migration Pressure",
    text: "Migration contributes significantly to urban population growth — USA (+955K) and Germany (+544K) absorb the most.",
  },
  {
    title: "Fertility Impact",
    text: "High fertility rates indicate future population expansion. Niger (7.0) and DR Congo (6.0) lead globally.",
  },
  {
    title: "High Density Stress",
    text: "Dense populations strain land and infrastructure. Monaco (26,337/km²) and Macao (21,645/km²) are at extremes.",
  },
  {
    title: "Risk Distribution",
    text: "Medium/high-risk countries (31 total) face greater urban challenges and require urgent SDG 11 interventions.",
  },
  {
    title: "Age Structure Impact",
    text: "Younger populations drive faster urban expansion. Niger's median age of 15 signals decades of rapid growth ahead.",
  },
]

// ── Recommendations from Excel "Recommendations" sheet ───────────────────────
export const RECOMMENDATIONS = [
  { text: "Invest in smart urban planning to manage growth.", icon: "Building2" },
  { text: "Expand infrastructure — housing, transport, and services.", icon: "Map" },
  { text: "Implement balanced migration policies.", icon: "Users" },
  { text: "Promote sustainable and eco-friendly development.", icon: "Globe" },
  { text: "Prioritize high-risk regions for targeted intervention.", icon: "AlertTriangle" },
  { text: "Support family planning and education programs.", icon: "TrendingUp" },
  { text: "Improve data monitoring and tracking systems.", icon: "Activity" },
]

// ── Data Quality Issues from Excel "Data quality issues" sheet ────────────────
export const DATA_QUALITY = [
  "No time-series data — limits trend analysis across years.",
  "Column naming inconsistencies in the raw dataset.",
  "Derived fields (Pressure Index, Risk Level) lack clear formula documentation.",
  "No original data source or metadata provided.",
  "Some columns lack explicit unit clarity.",
  "Potential redundancy between Urban Population (%) and Urbanisation Level columns.",
]