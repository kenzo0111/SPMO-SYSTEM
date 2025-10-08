# SPMO System - File Structure Documentation

## Project Organization

This document outlines the reorganized file structure for the Supply and Property Management Office (SPMO) System.

## Directory Structure

```
SPMO-SYSTEM/
├── index.html                          # Root entry point (redirects to public/)
├── README.md                           # Project documentation
├── composer.json                       # PHP dependencies
├── composer.lock                       # PHP dependency lock file
├── LICENSE                            # Project license
│
├── public/                            # Web-accessible files
│   ├── index.html                     # Main homepage
│   ├── assets/                        # Static assets
│   │   ├── css/                       # Stylesheets
│   │   │   ├── index.css              # Homepage styles
│   │   │   ├── AccessSystem.css       # Login/access system styles
│   │   │   ├── ContactSupport.css     # Contact support styles
│   │   │   └── dashboard.css          # Admin dashboard styles
│   │   ├── js/                        # JavaScript files
│   │   │   └── dashboard.js           # Dashboard functionality
│   │   └── images/                    # Images and icons
│   │       ├── cnscrefine.png         # CNSC logo
│   │       ├── cnscbg.jpg             # Background image
│   │       ├── analytics.png          # Analytics icon
│   │       ├── inventory.png          # Inventory icon
│   │       ├── management.png         # Management icon
│   │       ├── procurement.png        # Procurement icon
│   │       └── [other icons...]       # Various UI icons
│   │
│   └── pages/                         # HTML pages
│       ├── AccessSystem.html          # Login/authentication page
│       ├── ContactSupport.html        # Support contact page
│       ├── user/                      # User-specific pages
│       │   └── UserRequest.html       # User purchase request form
│       ├── admin/                     # Admin-specific pages
│       │   └── dashboard.html         # Administrative dashboard
│       └── forms/                     # Form templates
│           ├── ICS-FORM.html          # ICS form
│           └── P.O-Preview.html       # Purchase order preview
│
├── backend/                           # Server-side code (PHP)
├── src/                              # Source code (PHP classes)
├── vendor/                           # Composer dependencies
│   ├── autoload.php                  # Composer autoloader
│   ├── lucide.min.js                 # Icon library
│   └── [vendor packages...]          # Third-party PHP packages
│
└── [deprecated directories]          # These can be removed:
    ├── frontend/                     # ❌ Moved to public/
    ├── User/                         # ❌ Moved to public/pages/user/
    ├── Dashboard/                    # ❌ Moved to public/pages/admin/
    ├── forms/                        # ❌ Moved to public/pages/forms/
    └── icons/                        # ❌ Moved to public/assets/images/
```

## Path Updates Made

### HTML Files
- **public/index.html**: Updated all asset paths to use `assets/` prefix
- **public/pages/AccessSystem.html**: Updated CSS and image paths to use relative `../assets/` paths
- **public/pages/ContactSupport.html**: Updated CSS and image paths, fixed navigation links
- **public/pages/user/UserRequest.html**: Updated CSS and image paths to use `../../assets/` paths
- **public/pages/admin/dashboard.html**: Updated CSS, JS, and image paths

### CSS Files
- **assets/css/index.css**: Updated background image path to `../images/cnscbg.jpg`
- **assets/css/AccessSystem.css**: Updated background image path to `../images/cnscbg.jpg`

### Navigation Updates
- Fixed all internal links to point to correct relative paths
- Updated login redirect to point to `admin/dashboard.html`
- Fixed back navigation from ContactSupport to homepage

## Benefits of This Organization

1. **Clear Separation**: Assets, pages, and backend code are properly separated
2. **Consistent Paths**: All asset references use relative paths from their location
3. **Scalable Structure**: Easy to add new pages, styles, or functionality
4. **Web Standards**: Follows common web application directory conventions
5. **Asset Management**: All static files are centralized in the assets folder

## Recommended Next Steps

1. **Remove deprecated directories** after verifying everything works:
   - `frontend/`
   - `User/`
   - `Dashboard/`
   - `forms/`
   - `icons/`

2. **Set up development server** to test the reorganized structure

3. **Update any build processes** to reflect the new structure

4. **Review backend integration** to ensure proper API endpoints match the new frontend structure

## Development Server

To run the application locally:

```bash
# Option 1: Using PHP built-in server
php -S localhost:8000 -t public/

# Option 2: Using Python (for static files only)
cd public && python -m http.server 8000

# Option 3: Using Node.js live-server
npx live-server public/
```

The application will be available at `http://localhost:8000`