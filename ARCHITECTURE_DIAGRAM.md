# 🏗️ Top Earners Feature - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER DASHBOARD                                │
│  src/app/user/dashboard/page.jsx                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ AFFILIATE TAB                                              ││
│  │                                                            ││
│  │ ┌──────────────────────────────────────────────────────┐ ││
│  │ │ 🏆 TOP EARNERS SECTION                               │ ││
│  │ │                                                       │ ││
│  │ │ TIME FILTERS:                                        │ ││
│  │ │ [Today] [Yesterday] [7 Days] [Month] [Last Month]   │ ││
│  │ │                                                       │ ││
│  │ │ TOP 3 CARDS:                                         │ ││
│  │ │ ┌─────────┐  ┌─────────┐  ┌─────────┐              │ ││
│  │ │ │ 🥇 1st  │  │ 🥈 2nd  │  │ 🥉 3rd  │              │ ││
│  │ │ │ [Image] │  │ [Image] │  │ [Image] │              │ ││
│  │ │ │ Name    │  │ Name    │  │ Name    │              │ ││
│  │ │ │ Earnings│  │ Earnings│  │ Earnings│              │ ││
│  │ │ └─────────┘  └─────────┘  └─────────┘              │ ││
│  │ │                                                       │ ││
│  │ │ TOP 5 TABLE:                                         │ ││
│  │ │ ┌─────────────────────────────────────────────┐    │ ││
│  │ │ │ Rank │ Name │ Referrals │ Earnings         │    │ ││
│  │ │ │ 1    │ John │ 15        │ ₹5,000.50        │    │ ││
│  │ │ │ 2    │ Jane │ 12        │ ₹4,200.00        │    │ ││
│  │ │ │ 3    │ Bob  │ 8         │ ₹3,500.75        │    │ ││
│  │ │ │ 4    │ Alce │ 6         │ ₹2,800.25        │    │ ││
│  │ │ │ 5    │ Char │ 5         │ ₹2,100.00        │    │ ││
│  │ │ └─────────────────────────────────────────────┘    │ ││
│  │ └──────────────────────────────────────────────────────┘ ││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
          │
          │ onClick filter
          │ (state: topEarnersFilter)
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│             REACT STATE MANAGEMENT                               │
│                                                                  │
│  topEarners: []           ← Earner data                        │
│  loadingTopEarners: bool  ← Loading state                      │
│  topEarnersFilter: string ← Active filter                      │
└─────────────────────────────────────────────────────────────────┘
          │
          │ useEffect triggered
          │ loadTopEarners(filter)
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│             API CALL                                             │
│                                                                  │
│  GET /api/users/top-earners                                    │
│  ?filter=today&limit=5                                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ src/app/api/users/top-earners/route.js                 │ │
│  │                                                          │ │
│  │ 1. Parse filter parameter                              │ │
│  │ 2. Calculate date range                                │ │
│  │    - today: 00:00-23:59                                │ │
│  │    - yesterday: prev day                               │ │
│  │    - 7days: last 7 days                                │ │
│  │    - thisMonth: 1st-today                              │ │
│  │    - lastMonth: full prev month                        │ │
│  │ 3. Execute SQL query                                  │ │
│  │ 4. Format response                                     │ │
│  │ 5. Return JSON                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          │
          │ Database query
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│             DATABASE                                             │
│                                                                  │
│  TABLES:                                                        │
│  ┌──────────────────┐        ┌──────────────────┐             │
│  │ commissions      │        │ users            │             │
│  ├──────────────────┤        ├──────────────────┤             │
│  │ id               │        │ id               │             │
│  │ commission_amount├──┐     │ name             │             │
│  │ referrer_user_id ├──┼────▶│ email            │             │
│  │ status           │  │     │ image            │             │
│  │ created_at       │  │     │ referral_code    │             │
│  │ ...              │  │     │ ...              │             │
│  └──────────────────┘  │     └──────────────────┘             │
│                        │                                      │
│  QUERY:               │                                      │
│  SELECT              │                                      │
│    u.id,             │                                      │
│    u.name,           │                                      │
│    u.image,          │                                      │
│    SUM(commission_amount) as total_earnings,               │
│    COUNT(*) as referral_count                              │
│  FROM commissions c                                         │
│  INNER JOIN users u ON c.referrer_user_id = u.id           │
│  WHERE c.created_at BETWEEN ? AND ?                         │
│    AND c.status = 'credited'                                │
│  GROUP BY c.referrer_user_id                                │
│  ORDER BY total_earnings DESC                               │
│  LIMIT 5                                                    │
└─────────────────────────────────────────────────────────────────┘
          │
          │ Return results
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│             API RESPONSE                                         │
│                                                                  │
│  {                                                              │
│    "success": true,                                            │
│    "data": [                                                   │
│      {                                                         │
│        "rank": 1,                                              │
│        "id": 123,                                              │
│        "name": "John Doe",                                     │
│        "image": "path/to/image.jpg",                           │
│        "totalEarnings": 5000.50,                               │
│        "referralCount": 15                                     │
│      },                                                        │
│      ... (4 more records)                                      │
│    ],                                                          │
│    "filter": "today"                                           │
│  }                                                             │
└─────────────────────────────────────────────────────────────────┘
          │
          │ Update state
          │ setTopEarners(data)
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│             COMPONENT RENDERS                                    │
│                                                                  │
│  1. Top 3 Cards rendered with:                                 │
│     - Medal badges (🥇🥈🥉)                                     │
│     - User images                                              │
│     - Names and referral counts                                │
│     - Formatted earnings                                       │
│                                                                │
│  2. Top 5 Table rendered with:                                 │
│     - Rank numbers                                             │
│     - User info                                                │
│     - Referral counts                                          │
│     - Formatted earnings                                       │
│                                                                │
│  3. Filter buttons marked:                                     │
│     - Active filter: Purple gradient                           │
│     - Inactive filters: Gray                                   │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│             USER SEES                                            │
│                                                                  │
│  Beautiful Top Earners section with:                           │
│  ✨ Professional design                                        │
│  ✨ Medal rankings                                             │
│  ✨ User profiles                                              │
│  ✨ Earning amounts                                            │
│  ✨ Time period filters                                        │
│  ✨ Smooth interactions                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
USER ACTION                STATE CHANGE            API CALL                DB QUERY
─────────────────────────────────────────────────────────────────────────────────

Click Filter              topEarnersFilter     GET /api/users/       SELECT TOP 5
"7 Days"                  = '7days'            top-earners?filter    WHERE date BETWEEN
                                               &limit=5              (7 days ago)
     │                         │                      │                    │
     ▼                         ▼                      ▼                    ▼
[Button]              [useEffect]              [fetch API]           [MySQL Query]
                           │
                           ▼
                    loadTopEarners()
                           │
                           ▼
                    setLoading(true)
                           │
                           ▼
                    Spinner shows
                           │
                           ◀─────── [API Response] ◀──── [Data Rows]
                           │
                           ▼
                    setTopEarners(data)
                           │
                           ▼
                    setLoading(false)
                           │
                           ▼
                    Component re-renders
                           │
                           ▼
                    Top 3 cards show
                    Top 5 table shows
                    New filter active
```

---

## Component Structure

```
UserDashboard
├── State
│   ├── user
│   ├── activeTab
│   ├── topEarners ← NEW
│   ├── loadingTopEarners ← NEW
│   └── topEarnersFilter ← NEW
│
├── Functions
│   ├── loadWalletData()
│   ├── loadWithdrawalHistory()
│   ├── loadReferredUsers()
│   └── loadTopEarners() ← NEW
│
├── useEffect Hooks
│   ├── useEffect (on mount) - Initialize user
│   ├── useEffect (activeTab change) - Load withdrawal/referred users
│   └── useEffect (affiliate tab) - Load top earners ← NEW
│
├── Render
│   └── {activeTab === 'affiliate' && (
│       <div>
│           ├── Stats cards (earnings, pending, withdrawn)
│           ├── Referral code input
│           ├── Top Earners Section ← NEW
│           │   ├── Filter buttons
│           │   ├── Top 3 cards
│           │   └── Top 5 table
│           └── Recent referrals
│       </div>
│   )}
```

---

## State Dependencies & Data Flow

```
topEarnersFilter (user choice)
    │
    ├─► useEffect triggered
    │
    ├─► loadTopEarners(topEarnersFilter)
    │
    ├─► setLoadingTopEarners(true)
    │
    ├─► fetch('/api/users/top-earners?filter=' + topEarnersFilter)
    │
    ├─► API processes filter
    │
    ├─► Database query
    │
    ├─► API returns data
    │
    ├─► setTopEarners(data)
    │   setLoadingTopEarners(false)
    │
    └─► Component re-renders
        with new topEarners data
```

---

## File Structure

```
PROJECT ROOT
├── src/
│   └── app/
│       ├── api/
│       │   └── users/
│       │       ├── ... (existing routes)
│       │       └── top-earners/
│       │           └── route.js ← NEW
│       └── user/
│           └── dashboard/
│               └── page.jsx ← MODIFIED
│
└── Documentation/
    ├── TOP_EARNERS_README.md
    ├── TOP_EARNERS_SETUP.md
    ├── TOP_EARNERS_IMPLEMENTATION.md
    ├── TOP_EARNERS_VISUAL_GUIDE.md
    ├── TOP_EARNERS_SUMMARY.md
    └── IMPLEMENTATION_COMPLETE.md
```

---

## Time Filter Logic

```
Filter Input: "7days"
│
▼
Calculate date range
│
├─ startDate = today - 7 days
├─ endDate = today
│
▼
Format for MySQL
│
├─ startDateStr = "2024-01-17 00:00:00"
├─ endDateStr = "2024-01-24 23:59:59"
│
▼
SQL WHERE clause
│
├─ WHERE created_at >= '2024-01-17 00:00:00'
├─ AND created_at <= '2024-01-24 23:59:59'
├─ AND status = 'credited'
│
▼
Results: Commissions from last 7 days
```

---

## Performance Optimization

```
OPTIMIZATION STRATEGIES:
│
├─ Database Level
│   ├─ GROUP BY aggregation (SUM, COUNT)
│   ├─ Index on created_at
│   ├─ Index on status
│   ├─ Index on referrer_user_id
│   └─ LIMIT 5 (small result set)
│
├─ API Level
│   ├─ Parameterized queries (SQL injection safe)
│   ├─ Efficient date calculation
│   ├─ Response compression
│   └─ Error handling
│
├─ Frontend Level
│   ├─ useState with initial state
│   ├─ useEffect dependency array
│   ├─ slice() for top 3 display
│   ├─ Conditional rendering
│   └─ Loading state to prevent re-renders
│
└─ Result: API response < 1 second ✅
```

---

## Error Handling Flow

```
API Call
│
├─ Success (200)
│  ├─ setTopEarners(data)
│  ├─ setLoadingTopEarners(false)
│  └─ Render data
│
├─ Error (500)
│  ├─ console.error()
│  ├─ setTopEarners([])
│  ├─ setLoadingTopEarners(false)
│  └─ Render: "No data available"
│
└─ Network Error
   ├─ console.error()
   ├─ setTopEarners([])
   ├─ setLoadingTopEarners(false)
   └─ Render: "No data available"
```

---

## Component Lifecycle (Top Earners)

```
Initial Load
│
▼
User navigates to Affiliate tab
│
▼
activeTab === 'affiliate' (true)
│
▼
useEffect triggered
│
▼
loadTopEarners('today')
│
▼
Loading spinner shows
│
▼
API call to /api/users/top-earners
│
▼
Data received
│
▼
setTopEarners(data)
setLoadingTopEarners(false)
│
▼
Component re-renders
│
▼
Top 3 cards visible
Top 5 table visible
Loading spinner hidden
│
▼
User sees results
│
▼
User clicks filter button
│
▼
setTopEarnersFilter(newFilter)
│
▼
useEffect triggered again (dependency: topEarnersFilter)
│
▼
Repeat from "loadTopEarners()"
```

---

## Responsive Grid Layout

```
Mobile (375px)
├─ Cards: grid-cols-1
│  └─ 1 card per row
│
├─ Filters: flex flex-wrap
│  └─ Wrap to multiple rows
│
└─ Table: overflow-x-auto
   └─ Horizontal scroll

Tablet (768px)
├─ Cards: grid-cols-2 md:
│  └─ 2 cards per row
│
├─ Filters: flex flex-wrap
│  └─ Wrap to 2-3 rows
│
└─ Table: w-full
   └─ Fitted width

Desktop (1024px+)
├─ Cards: lg:grid-cols-3
│  └─ 3 cards per row
│
├─ Filters: flex (no wrap)
│  └─ All filters in 1 row
│
└─ Table: w-full
   └─ Full width display
```

---

## UI Rendering Logic

```
IF loadingTopEarners === true
│
└─► Show spinner
    "Loading top earners..."
│
ELSE IF topEarners.length > 0
│
├─► Show top 3 cards
│   ├─ Card 1: Gold styling + 🥇
│   ├─ Card 2: Silver styling + 🥈
│   └─ Card 3: Bronze styling + 🥉
│
├─► Show top 5 table
│   ├─ Header row
│   └─ Data rows (5 entries)
│
ELSE
│
└─► Show empty state
    Trophy icon
    "No data available for this period"
    "Check back later"
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Efficient data flow
- ✅ Responsive design
- ✅ Error handling
- ✅ Optimized performance
- ✅ Maintainable code structure
