1. CORE BUILD PRINCIPLES (NON-NEGOTIABLE)
Your frontend MUST:
1. Look like a real SaaS product
Not a demo UI
Not a static template
2. Be fully interactive
Every screen must respond to data
No dead UI elements
3. Be backend-driven
All critical data comes from API
4. Handle real states
Loading
Error
Empty
Success
5. Be modular
Component-based architecture (React best practice)
2. TECH STACK ALIGNMENT
Framework:
React (primary)
Styling options:
Tailwind CSS (recommended)
OR Material UI (for enterprise feel)
OR Bootstrap (only if speed is priority)
Data Handling:
Axios (API calls)
React Query (recommended for caching + async state)
OR basic useEffect + useState (MVP fallback)
Tooling:
Git + GitHub (mandatory)
Optional CI/CD (Vercel / Netlify / Render)
Bonus (HIGH IMPACT):
IBM Watson / OpenAI integration for AI compliance assistant
3. FRONTEND ARCHITECTURE (REAL PRODUCT STRUCTURE)
Required folder structure:
src/
├── components/
├── pages/
├── services/
├── hooks/
├── utils/
├── store/
├── types/
├── assets/
└── App.jsx
4. CORE PRODUCT PAGES (MUST BUILD)
1. Authentication Pages
Login Page (Required)
Email/password form
Validation
Error handling
Loading state
Optional:
Register page
2. Main Dashboard (CORE PRODUCT)
Must include:
Metrics (transactions, violations, compliance score)
Alerts feed
Activity stream
AI insights widget
Must be dynamic:
Pull data from backend API
Update in real-time or refresh
3. Transactions Page
Features:
Table of transactions
Filters (risk, amount, country)
Search
Click → detail view
4. Case Management Page
Features:
Open cases
Case status (Open / Reviewing / Resolved)
Assignments
Timeline view
5. AI Compliance Assistant Page
Features:
Chat interface
Ask compliance questions
Explain flagged transactions
Generate summaries
5. COMPONENT DESIGN STRATEGY
Reusable components (VERY IMPORTANT):
UI Components:
Button
Card
Badge
Input
Modal
Table
Feature Components:
MetricsCard
AlertItem
TransactionRow
CaseCard
ActivityFeed
AIChatBox
Layout Components:
Sidebar
Header
PageContainer
6. DATA & API INTEGRATION (CRITICAL)
Backend connection is REQUIRED
API integration using:
Axios (preferred)
React Query (bonus)
Required API endpoints:
GET /metrics
GET /alerts
GET /transactions
GET /cases
POST /upload
POST /login
POST /ai/query
Frontend must handle:
Loading states:
Skeleton loaders
Error states:
API failure messages
Empty states:
No data fallback UI
7. AI + BACKEND INTEGRATION (KEY DIFFERENTIATOR)
AI Assistant must:
Explain flagged transactions
Summarize compliance risks
Suggest actions
Generate reports
AI UX rules:
Must feel like a “compliance expert”
Not a chatbot gimmick
Must use backend or API model
8. SECURITY REQUIREMENTS (BASIC BUT IMPORTANT)
Must implement:
Frontend validation:
Input validation (forms)
Required fields
Format checks
Authentication handling:
Store token securely (localStorage or cookies for hackathon)
Protect routes
Protected routes:
Dashboard
Cases
Transactions
9. UX / UI REQUIREMENTS
Design must be:
Clean
Responsive
Professional (FinTech-grade)
Consistent spacing
UX rules:
Must include:
Loading indicators
Feedback on actions
Clear navigation
Visual hierarchy
UI style:
Dark enterprise theme (recommended)
Or clean light enterprise theme
10. STATE MANAGEMENT
Options:
Simple:
useState + props
Better:
React Context
Best:
Zustand OR React Query (recommended)
Store must manage:
User session
Metrics
Alerts
Transactions
AI chat history
11. PERFORMANCE EXPECTATIONS
Must:
Avoid unnecessary re-renders
Lazy load pages (optional)
Optimize API calls
12. WHAT MAKES IT “WIN-READY”
Judges expect:
1. Real product feel:
Not UI-only
Fully interactive system
2. Backend integration:
Live or mocked API calls
Real data flow
3. Clean UI/UX:
Professional layout
Clear hierarchy
4. AI integration:
Practical use (not decorative)
5. Functional features:
Login
Dashboard
Cases
Transactions
AI assistant
13. WHAT TO AVOID (CRITICAL)
DO NOT:
Build static pages only
Skip API integration
Leave broken UI states
Over-design without functionality
Ignore backend connection
Build unfinished features
14. BUILD ORDER (IDE EXECUTION PLAN)
PHASE 1:
Setup project
Install dependencies
Configure routing
PHASE 2:
Authentication (login)
Layout (sidebar + header)
PHASE 3:
Dashboard (metrics + alerts + activity)
PHASE 4:
Transactions + cases pages
PHASE 5:
API integration
PHASE 6:
AI assistant integration
PHASE 7:
UI polish + loading states + responsiveness
PHASE 8:
Testing + demo preparation
15. FINAL SUCCESS METRIC
Your frontend is successful if:
It behaves like a real SaaS product
Users can navigate, interact, and trigger backend logic
AI component provides real value
UI feels production-grade