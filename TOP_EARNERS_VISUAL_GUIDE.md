# Top Earners Feature - Visual Guide & Usage

## Feature Overview

Aapke affiliate marketing section mein ab **Top Earners** ka showcase milega jaha aap dekh sakte ho:

1. **Top 3 Earners** - Card-based display with medals (🥇🥈🥉)
2. **Top 5 Earners** - Detailed table format
3. **Time-based Filters** - Today, Yesterday, 7 Days, This Month, Last Month

---

## UI Layout

### Affiliate Section

```
┌─────────────────────────────────────────────────────┐
│ 🏆 Affiliate Dashboard                              │
├─────────────────────────────────────────────────────┤
│ ┌──────────────┬──────────────┬──────────────┐      │
│ │ Total        │ Pending      │ Withdrawn    │      │
│ │ Earnings     │              │              │      │
│ │ ₹0           │ ₹0           │ ₹0           │      │
│ └──────────────┴──────────────┴──────────────┘      │
├─────────────────────────────────────────────────────┤
│ Your Referral Code: [CODE] [Copy]                   │
├─────────────────────────────────────────────────────┤
│ 🏆 Top Earners                                      │
│ [Today] [Yesterday] [7 Days] [This Month] [Last Mo] │
│                                                     │
│ ┌─────────────┬─────────────┬─────────────┐        │
│ │   🥇       │   🥈       │   🥉       │        │
│ │ [Image]    │ [Image]    │ [Image]    │        │
│ │ Name       │ Name       │ Name       │        │
│ │ 15 Refs    │ 12 Refs    │ 8 Refs     │        │
│ │ ₹5000.50   │ ₹4200.00   │ ₹3500.75   │        │
│ └─────────────┴─────────────┴─────────────┘        │
├─────────────────────────────────────────────────────┤
│ 📊 Top 5 Earners                                    │
│ ┌────┬──────────┬──────────┬──────────┐            │
│ │ #  │ Name     │ Referral │ Earnings │            │
│ ├────┼──────────┼──────────┼──────────┤            │
│ │ 1  │ John Doe │ 15       │ ₹5000.50 │            │
│ │ 2  │ Jane Doe │ 12       │ ₹4200.00 │            │
│ │ 3  │ Bob Smith│ 8        │ ₹3500.75 │            │
│ │ 4  │ Alice J. │ 6        │ ₹2800.25 │            │
│ │ 5  │ Charlie  │ 5        │ ₹2100.00 │            │
│ └────┴──────────┴──────────┴──────────┘            │
└─────────────────────────────────────────────────────┘
```

---

## Feature Details

### 1. Time-Based Filters

| Filter | Description | Date Range |
|--------|-------------|-----------|
| **Today** | Current day earnings | 00:00 - 23:59 (Today) |
| **Yesterday** | Previous day earnings | 00:00 - 23:59 (Yesterday) |
| **7 Days** | Last 7 days | 7 days ago to today |
| **This Month** | Current month | 1st to today |
| **Last Month** | Previous month | 1st to last day |

### 2. Top 3 Earners Cards

**Displaying**:
- Medal rank (🥇 Gold, 🥈 Silver, 🥉 Bronze)
- User profile image (or avatar with first letter)
- User name
- Number of referrals
- Total earnings amount
- Color-coded styling per rank

**Interactions**:
- Hover effects for visual feedback
- Responsive layout (1 col mobile, 2 cols tablet, 3 cols desktop)
- Auto-refresh when filter changes

### 3. Top 5 Earners Table

**Columns**:
1. **Rank** - Position number (1-5)
2. **Name** - User name with profile image
3. **Referrals** - Count of referrals made
4. **Earnings** - Total commission earned

**Features**:
- Alternate row coloring for readability
- Profile images for quick identification
- Sorted by earnings (highest to lowest)
- Responsive table design

---

## How To Use

### Step 1: Navigate to Affiliate Section
- Open User Dashboard
- Click on "Affiliate" menu item
- You'll see the affiliate section loaded

### Step 2: View Top Earners (Default - Today)
- Top 3 earners are shown by default
- Below them is a detailed top 5 table

### Step 3: Change Time Filter
- Click any time filter button at the top
- Options: Today, Yesterday, 7 Days, This Month, Last Month
- Data automatically refreshes
- Loading spinner shows during fetch

### Step 4: View Details
- See user names and profile pictures
- Check how many referrals each top earner has
- View their total earnings in ₹ (Indian Rupees)

---

## Data Source

Data is pulled from the **commissions table**:
- Only counts **credited** commissions (status = 'credited')
- Sums commission_amount for each referrer
- Groups by referrer_user_id
- Sorts by total_earnings in descending order
- Limit: 5 records (top 5 earners)

---

## API Endpoint

```
GET /api/users/top-earners?filter=today&limit=5
```

**Query Parameters**:
- `filter` (optional): 'today' | 'yesterday' | '7days' | 'thisMonth' | 'lastMonth'
- `limit` (optional): Number of results (default: 5)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "image": "path/to/profile.jpg",
      "referralCode": "REF123",
      "totalEarnings": 5000.50,
      "referralCount": 15
    }
  ],
  "filter": "today",
  "dateRange": {
    "start": "2024-01-24 00:00:00",
    "end": "2024-01-24 23:59:59"
  }
}
```

---

## Styling Classes

### Active Filter Button
```
bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg
```

### Inactive Filter Button
```
bg-gray-200 text-gray-700 hover:bg-gray-300
```

### Rank-Based Card Styling
- **Gold (1st)**: Yellow/Amber gradient with yellow border
- **Silver (2nd)**: Gray gradient with gray border
- **Bronze (3rd)**: Orange/Red gradient with orange border

---

## Database Schema Reference

### Commissions Table Used
```sql
CREATE TABLE commissions (
  id INT PRIMARY KEY,
  referrer_user_id INT,           -- Who earned the commission
  commission_amount DECIMAL(10,2), -- Amount earned
  status ENUM('pending', 'credited'), -- Only 'credited' counted
  created_at TIMESTAMP             -- When earned
);
```

### Users Table Used
```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255),     -- Earner name
  email VARCHAR(255),    -- Earner email
  image LONGTEXT,        -- Profile image
  referral_code VARCHAR(50) -- Referral code
);
```

---

## Performance Notes

✅ **Optimized for Performance**:
- Database-level grouping and aggregation
- Indexed queries on frequently used columns
- Efficient date range filtering
- Limited result set (top 5)

---

## Browser Compatibility

Works on:
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers
- ✅ Responsive design (Mobile, Tablet, Desktop)

---

## Error Handling

### Empty State Messages
- **"No data available for this period"** - No earners found for selected timeframe
- **"Check back later"** - Suggestion to check again

### Loading States
- Spinner animation displays while fetching data
- User can change filter while loading (queue next request)

---

## Related Files

1. **API Route**: `src/app/api/users/top-earners/route.js`
2. **Dashboard Component**: `src/app/user/dashboard/page.jsx`
3. **Documentation**: `TOP_EARNERS_IMPLEMENTATION.md`

---

## Future Enhancements

🔄 **Planned Features**:
- [ ] Pagination for viewing more than 5 earners
- [ ] Export data as CSV/PDF
- [ ] Custom date range picker
- [ ] Earnings trend graphs
- [ ] Comparison with previous period
- [ ] Notifications when reaching top positions
- [ ] Mobile-optimized card layout
- [ ] Search/filter by earner name

---

## Support

If you need to:
- **Change number of earners shown**: Update `limit=5` in the API call
- **Add new time filter**: Add case in the switch statement in `route.js`
- **Customize styling**: Modify Tailwind classes in the JSX
- **Add new column in table**: Add th/td elements in the table JSX

