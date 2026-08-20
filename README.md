# Price Watch Armenia

Create a high-fidelity, clickable, mobile-only UI/UX prototype for a B2B competitor price-monitoring application for Armenian electronics retailers.

Use the temporary product name “Price Monitor.” The final app name, branding, and logo will be created later. Keep the name, logo mark, colors, and design tokens easy to replace.

PRODUCT PURPOSE

The application is used by employees of multiple electronics retailers in Armenia.

Each client company must have its own completely private workspace. Users from one client company must never see another client company’s users, private settings, configuration, or internal information.

Within its private workspace, each client company monitors the public product prices of competing electronics retailers.

Example:

Client company:

- RedStore

Competitors visible to RedStore employees:

- Zigzag

- Vega

- Mobile Centre

- Yerevan Mobile

Do not present RedStore as its own competitor unless a platform administrator explicitly enables it.

Use real Armenian electronics retailer names, including:

- Zigzag

- RedStore

- Vega

- Mobile Centre

- Yerevan Mobile

Do not copy or invent their official logos. Represent retailers using clean text, initials, or neutral colored icons.

PLATFORM

Design only for mobile phones in the first production version:

- iOS and Android

- Use 390×844 as the main reference size

- Respect device safe areas

- Do not create desktop pages or desktop sidebars

- Make screens scrollable where necessary

- Use comfortable mobile touch targets

- Design all forms and admin tools so they are usable on a phone

LANGUAGES

Support three languages:

- Armenian — default

- Russian

- English

Include a language selector:

- On the login screen

- In application settings

Write the initial prototype interface in natural Armenian.

The layout must support longer Russian and English translations without overflowing, clipping, or breaking.

Keep international product and model names unchanged, such as:

- Apple iPhone 16 Pro 256GB

- Samsung Galaxy S25 Ultra

- Sony PlayStation 5 Slim

- LG OLED C4 55”

- ASUS ROG Zephyrus G16

VISUAL DIRECTION

Combine these styles:

- Clean and professional business application

- Premium analytics dashboard

- Friendly and readable cards

- Minimal visual design

- Modern fintech-quality interface

- Subtle Armenian character without decorative clichés

- Light and dark modes

Use:

- Light neutral backgrounds

- White or dark elevated cards

- Deep navy as the primary dark color

- Modern blue or indigo as the primary accent

- Green for price decreases and positive opportunities

- Orange or red for increases and warnings

- Clear typography

- Generous spacing

- Rounded corners between 16px and 24px

- Subtle shadows and borders

- Armenian dram price formatting, such as “559,900 ֏”

Avoid:

- Excessive gradients

- Excessive glassmorphism

- Crowded charts

- Tiny text

- Generic cryptocurrency-dashboard styling

- Desktop-style sidebars

- Excessive animations

- Decorative elements that reduce data readability

AUTHENTICATION

Nobody can use the application without authentication.

Create these authentication states:

1. Splash and session-loading screen

2. Login screen

3. Invalid-credentials state

4. Login-loading state

5. Rate-limit error state

6. Offline state

7. Server-error state

8. Expired-session state

Login fields:

- Email

- Password

- Show or hide password

- Language selector

- Login button

There is no public registration in the first version.

If a valid session exists, do not show the login screen when the user opens the app again. Restore the session and open the correct workspace.

ROLES

Support three main roles.

1. Platform Super Admin

The platform super administrator can:

- Access the administration area

- Create and manage client companies

- Activate or suspend client companies

- Create company administrators

- Control which competitors each company can monitor

- Control which features each company can use

- Configure company-level access limitations

- View audit history

- Switch into a company workspace for support purposes

The super administrator must explicitly select a client company before viewing that company’s workspace.

2. Company Admin

A company administrator can:

- Manage users belonging only to their own company

- Assign permissions to users

- Create and manage alert rules

- Manage company settings

- Manage available competitors within company-level limits

- Manage monitored brands and categories

- View all data that the platform administrator assigned to the company

A company administrator must never:

- Access another client company

- Grant competitors that were not assigned to the company

- Enable features that were not assigned to the company

- Exceed platform-level permission limits

3. Viewer

A viewer can:

- View permitted dashboards

- View assigned competitors

- View assigned brands and categories

- View price changes

- View product history

- View permitted analytics

- View permitted alerts

A viewer cannot manage company-wide configuration unless an individual permission explicitly allows a specific action.

PERMISSION MODEL

Permissions must work as an intersection:

Effective user access =

permissions assigned to the company by the platform

AND

permissions assigned to the individual user

A company administrator cannot grant access beyond the company’s platform-level permissions.

Support company-level and user-level visibility for:

- Competitor stores

- Product categories

- Brands

- Individual products when necessary

- Dashboard access

- Alerts access

- Analytics access

- Product-history access

- Report access

- Export access

- User-management access

- Alert-rule management

- Watchlist management

- Company-settings access

RESTRICTED ACCESS

If a user tries to access restricted content:

- Do not display protected data

- Show “Դուք չունեք հասանելիություն”

- Explain that the user does not have permission

- Provide a back action

- Do not reveal names, prices, products, or counts from inaccessible competitors

MAIN MOBILE NAVIGATION

Use a five-item bottom navigation:

1. Գլխավոր — Dashboard

2. Շուկաներ — Competitors

3. Ծանուցումներ — Alerts

4. Վերլուծություն — Analytics

5. Կարգավորումներ — Settings

Display clear active and inactive states.

Preserve each tab’s state when switching between tabs.

Display administration tools only to users with the required permissions.

CORE USER FLOW

Login

→ Restore the user’s client-company workspace

→ Open dashboard

→ Open competitor list

→ Select a competitor such as RedStore or Zigzag

→ View that competitor’s latest price changes

→ Search or filter changes

→ View complete change history

→ Select a product

→ View that individual product’s full price and stock history

Do not make cross-market product comparison a primary feature in the first version.

It may appear as a subtle “Coming later” feature, but it should not distract from the main competitor-by-competitor workflow.

DASHBOARD

Create an Armenian dashboard containing:

- Greeting

- Authenticated employee name

- Client company name

- User role

- Last successful data update

- Monitoring status

- Total monitored products

- Number of visible competitors

- Price decreases in the last 24 hours

- Price increases in the last 24 hours

- New products

- Out-of-stock products

- Products where competitors became cheaper

- Average price difference

- Important alerts requiring action

- Latest detected changes

- Biggest price drops

- A simple trend chart

- Day, week, and month period selectors

Prioritize these dashboard sections:

1. Products where competitors are cheaper

2. Important price changes

3. Alerts requiring action

Only show metrics calculated from competitors, categories, brands, and products that the current user is allowed to access.

COMPETITOR LIST

Create a dedicated competitors screen.

Each competitor must have a separate card showing:

- Competitor name

- Initial or neutral icon

- Number of monitored products

- Number of changes in the last 24 hours

- Number of price decreases

- Number of price increases

- Out-of-stock changes

- Last update time

- Monitoring status

- Whether the current user has full or limited access

Include:

- Search

- Sorting

- Filtering

- Pull to refresh

- Loading skeleton

- Empty state

- Error state

- No-permission state

Do not mix every competitor’s information into one unstructured feed.

Only display competitors assigned to the current user.

COMPETITOR DETAILS

Create a dedicated page for every competitor.

Example:

- RedStore competitor page

- Zigzag competitor page

- Vega competitor page

The page header should show:

- Back button

- Competitor name

- Monitoring status

- Last update time

- Number of monitored products

Show summary metrics:

- Total changes

- Price decreases

- Price increases

- New products

- Out-of-stock products

- Average price-change percentage

Use tabs or segmented controls:

- Վերջին փոփոխություններ

- Ամբողջ պատմություն

- Ապրանքներ

- Վերլուծություն

Provide all these filters:

- Product-name search

- Category

- Brand

- Price increased

- Price decreased

- In stock

- Out of stock

- Date range

- Minimum price

- Maximum price

- Discounted products

- New products

Make these filters most accessible:

- Product search

- Price direction

- Date range

Place secondary filters inside a mobile bottom sheet.

PRICE-CHANGE ITEMS

Each price-change row or card should show:

- Product name

- Optional product thumbnail placeholder

- Category

- Brand

- Old price

- New price

- Absolute difference in Armenian dram

- Percentage difference

- Date

- Exact time

- Stock-status change

- Discount badge when relevant

Use:

- Green for price decreases

- Orange or red for price increases

- Clear up and down arrows

- Positive and negative signs

- Text labels

Do not communicate changes using color alone.

PRODUCT DETAILS

Create a detailed product-history screen containing:

- Product name

- Brand

- Category

- Competitor name

- Current price

- Previous price

- Lowest recorded price

- Highest recorded price

- Percentage change

- Current stock status

- Last checked time

- Price-history line chart

- Complete chronological timeline

- Price changes

- Stock-status changes

- Add-to-watchlist action

- Create-alert action

Include chart periods:

- 7 days

- 30 days

- 3 months

- 1 year

- All time

The chart must be:

- Clean

- Readable

- Touch-friendly

- Optimized for mobile

- Equipped with tooltip values

- Formatted in Armenian dram

ALERTS

Create an alerts inbox with:

- Unread and read states

- Severity levels

- Competitor name

- Product name

- Event description

- Date and time

- Alert detail screen

- Mark-as-read action

- Filter by competitor

- Filter by alert type

- Filter by date

- Filter by severity

Alert types:

- Price dropped

- Price increased

- Competitor became cheaper

- Product went out of stock

- Product returned to stock

- New product detected

- Discount detected

- Large price change

For authorized users, include an alert-rule creation form:

- Select competitor

- Select product, brand, or category

- Select event type

- Enter percentage threshold

- Enter Armenian dram threshold

- Select notification preference

- Enable or disable the rule

ANALYTICS

Create a mobile analytics screen containing:

- Price-change trend

- Decreases versus increases

- Changes by competitor

- Changes by brand

- Changes by category

- Largest price movements

- Most frequently changed products

- Date-range selector

- Day, week, and month controls

Only calculate and display analytics from data the current user is permitted to access.

Keep charts:

- Simple

- Vertically stacked

- Touch-friendly

- Easy to read on mobile

- Clearly labeled

- Available in light and dark modes

SETTINGS

Create these settings sections:

- User profile

- Client company information

- Language selector

- Light, dark, and system theme

- Notification preferences

- Security

- Logout

- Competitor management for authorized admins

- User management for authorized admins

- Role and permission information

- App version

- Support section

ADMINISTRATION AREA

Create a mobile administration area containing:

- Client companies

- Users

- Roles and permissions

- Competitor visibility

- Category visibility

- Brand visibility

- Feature access

- Audit history

Only show each administration section to authorized users.

PLATFORM COMPANY MANAGEMENT

Create a client-company list for the platform super administrator.

Each company card should show:

- Company name

- Account status

- Number of users

- Number of assigned competitors

- Number of monitored products

- Enabled features

- Last activity

- Subscription or access status

Create a company-details screen with sections for:

- General information

- Company administrators

- Allowed competitors

- Enabled features

- Access limits

- Account status

- Audit history

USER MANAGEMENT

Create a user list showing:

- Full name

- Email

- Role

- Active or inactive status

- Assigned competitors

- Last activity

- Permission summary

Include:

- Search

- Role filter

- Status filter

- Add user

- Edit user

- Activate user

- Suspend user

- Reset permissions

- Delete confirmation

USER ACCESS EDITOR

Create a detailed mobile screen where an authorized administrator can configure what a user is allowed to see.

Fields and controls:

- Full name

- Email

- Assigned company

- Role

- Active or inactive status

- Allowed competitor stores

- Allowed product categories

- Allowed brands

- Allowed features

Feature permissions:

- Dashboard access

- Alerts access

- Analytics access

- Product-history access

- Report access

- Create personal watchlists

- Create alert rules

- Export data

- Manage other users

- Manage company settings

Use:

- Searchable multi-select controls

- Permission groups

- Switches or checkboxes

- “Select all”

- “Clear all”

- Inherited-permission indicators

- Per-user overrides

- Save button

- Cancel action

- Unsaved-changes warning

- Confirmation before removing access

- Permission summary

Clearly distinguish:

- Permission allowed by the platform

- Permission assigned to the company

- Permission assigned to the user

- Permission unavailable because of company restrictions

COMPETITOR VISIBILITY EDITOR

Create an admin screen for selecting which competitors a company or user can see.

Each competitor row should show:

- Competitor name

- Access enabled or disabled

- Number of monitored products

- Available categories

- Available brands

- Company-level permission status

- User-level permission status

Support:

- Select all

- Clear all

- Search

- Enable or disable competitor

- Assign all categories

- Assign selected categories

- Assign all brands

- Assign selected brands

- View effective access

Example:

Client company:

- RedStore

Company-visible competitors:

- Zigzag

- Vega

- Mobile Centre

Individual employee:

- Can see Zigzag

- Can see Vega

- Cannot see Mobile Centre

The employee must only see Zigzag and Vega throughout the application.

AUDIT HISTORY

Record and display:

- Who changed a permission

- Which company was affected

- Which user was affected

- Previous access

- New access

- Date and time

- Action type

- Optional reason for the change

Create a mobile audit-history screen with filters for:

- Company

- Administrator

- Affected user

- Action type

- Date range

REUSABLE COMPONENTS

Create reusable components for:

- Metric cards

- Competitor cards

- Price-change rows

- Product cards

- Status badges

- Permission badges

- Role badges

- Filter chips

- Search bars

- Date selectors

- Charts

- Bottom sheets

- Multi-select controls

- Empty states

- Skeleton loaders

- Error messages

- Confirmation dialogs

- Toast notifications

- Access-denied states

APPLICATION STATES

Create realistic examples of:

- Loading

- Empty

- Network error

- Server error

- No search results

- Filtered results

- Offline

- Stale data

- Unauthorized

- No permission

- Suspended account

- Expired session

- Successful save

- Failed save

- Unsaved changes

PROTOTYPE INTERACTIONS

Make the prototype clickable:

- Login opens the correct company dashboard

- Existing sessions skip login

- Bottom navigation works

- Selecting RedStore opens its dedicated competitor page

- Selecting a price change opens product history

- Filters open a mobile bottom sheet

- Language selector visually switches between Armenian, Russian, and English

- Theme selector switches between light and dark modes

- Avatar opens profile options

- Logout returns to login

- Admin users can open administration screens

- Viewer users cannot access administration screens

- Changing user permissions updates the visual permission summary

- Restricted content displays an access-denied state

- Super administrators can select a company workspace

- Company administrators only see users from their own company

SAMPLE DATA

Use realistic Armenian electronics-market data.

Example competitors:

- Zigzag

- RedStore

- Vega

- Mobile Centre

- Yerevan Mobile

Example products:

- Apple iPhone 16 Pro 256GB

- Samsung Galaxy S25 Ultra

- Sony PlayStation 5 Slim

- LG OLED C4 55”

- ASUS ROG Zephyrus G16

Example prices:

- 559,900 ֏

- 499,900 ֏

- 259,900 ֏

- 749,900 ֏

- 689,000 ֏

Use realistic price histories, percentage changes, stock changes, dates, alerts, user roles, and permissions.

SECURITY DESIGN PRINCIPLES

The prototype is primarily for UI/UX design, but its interface must communicate these security rules:

- No unauthenticated application access

- Strict separation between client companies

- Users only see assigned competitors and features

- Restricted data is never shown behind disabled controls

- Company admins cannot exceed company-level permissions

- Viewers cannot access admin pages

- Sensitive actions require confirmation

- Permission changes appear in audit history

- Logout is always available

- Suspended accounts cannot enter the workspace

Do not rely only on hiding navigation items. Design explicit access-denied and permission states.

DELIVERABLE

Generate a consistent, polished, production-quality mobile design system and all major application screens.

Prioritize:

- Clear visual hierarchy

- Fast scanning of price changes

- Data readability

- Competitor-by-competitor organization

- Secure multi-company separation

- Flexible per-user permissions

- Mobile usability

- Natural Armenian text

- Easy future translation

- Replaceable branding

- Consistent light and dark themes

Use realistic mock data. This task is primarily UI/UX design. Do not invent or implement a new backend.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://price-armenia-insight.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b0aba1a3-630e-4a8b-a7d9-635a00b97bee).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
