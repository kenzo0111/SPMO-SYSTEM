// Dashboard JavaScript Application

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

// Application State
const AppState = {
    currentPage: 'dashboard',
    expandedMenus: ['inventory'],
    currentModal: null,
    // current logged in user (basic profile)
    currentUser: {
        id: 'SA000',
        name: 'John Doe',
        email: 'john.doe@cnsc.edu.ph',
        role: 'Student Assistant',
        department: 'IT',
        status: 'Active',
        created: new Date().toISOString().split('T')[0]
    },
    currentProductTab: 'expendable',
    productSearchTerm: '',
    productSortBy: 'Sort By',
    productFilterBy: 'Filter By',
    lowStockThreshold: 20,
    purchaseOrderItems: [
        {
            id: '1',
            stockPropertyNumber: '',
            unit: '',
            description: '',
            detailedDescription: '',
            quantity: 0,
            currentStock: 0,
            unitCost: 0,
            amount: 0
        }
    ],

    // ✅ add these for real data
    newRequests: [],
    pendingRequests: [],
    completedRequests: [],
    notifications: [
        { id: 'n1', title: 'New requisition submitted', time: '2h ago', read: false },
        { id: 'n2', title: 'Stock level low: Paper A4', time: '1d ago', read: false },
        { id: 'n3', title: 'PO #1234 approved', time: '3d ago', read: true }
    ]
};


// Mock Data
const MockData = {
    inventory: [
        { stockNumber: 'E001', name: 'Bond Paper A4', currentStock: 45, unit: 'Ream' },
        { stockNumber: 'E002', name: 'Ballpoint Pen', currentStock: 120, unit: 'Pc' },
        { stockNumber: 'E003', name: 'Sticky Notes', currentStock: 25, unit: 'Pack' },
        { stockNumber: 'SE01', name: 'Wireless Mouse', currentStock: 8, unit: 'Pc' },
        { stockNumber: 'SE02', name: 'HDMI Cable 3m', currentStock: 12, unit: 'Pc' },
        { stockNumber: 'N001', name: 'Laptop Computer', currentStock: 2, unit: 'Unit' }
    ],

    categories: [
        {
            id: 'C001',
            name: 'Expendable',
            description: 'Items that are used up quickly, have a short lifespan, and are not intended to be reused or tracked long-term. These are typically low-cost supplies.'
        },
        {
            id: 'C002',
            name: 'Semi-Expendable(Low)',
            description: 'Items that are not consumed immediately and have a longer useful life, but cost ₱5,000 or less per unit. These are not capitalized as fixed assets, but they are still monitored or assigned to users or departments due to their usefulness and potential for loss.'
        },
        {
            id: 'C003',
            name: 'Semi-Expendable(High)',
            description: 'Items with a unit cost more than ₱5,000 but less than ₱50,000. These are not capitalized as PPE, but are considered valuable enough to be tagged, tracked, and documented in the inventory system.'
        },
        {
            id: 'C004',
            name: 'Non-Expendable',
            description: 'Assets that are high-cost (₱50,000 and above) and used in operations over multiple years. These are capitalized and recorded in the organization\'s asset registry.'
        }
    ],

    products: [
        // Expendable products
        { id: 'E001', name: 'Bond Paper A4', description: '500 sheets, 70gsm', quantity: 20, unitCost: 220.00, totalValue: 4400.00, date: '2025-01-10', type: 'expendable' },
        { id: 'E002', name: 'Ballpoint Pen', description: 'Black ink, 12 pcs per box', quantity: 50, unitCost: 60.00, totalValue: 3000.00, date: '2025-02-01', type: 'expendable' },
        { id: 'E003', name: 'Sticky Notes', description: '3x3 inches, assorted color', quantity: 30, unitCost: 35.00, totalValue: 1050.00, date: '2025-03-12', type: 'expendable' },
        { id: 'E004', name: 'Printer Ink (HP)', description: 'For HP 415 Ink Tank', quantity: 10, unitCost: 750.00, totalValue: 7500.00, date: '2025-02-20', type: 'expendable' },
        { id: 'E005', name: 'Envelopes', description: 'White long, 100 pcs per box', quantity: 15, unitCost: 130.00, totalValue: 1950.00, date: '2025-04-05', type: 'expendable' },
        { id: 'E006', name: 'Cleaning Spray', description: 'Description', quantity: 25, unitCost: 100.00, totalValue: 2500.00, date: '2025-01-18', type: 'expendable' },

        // Semi-Expendable products
        { id: 'SE01', name: 'Laminator SEA1', description: 'A3 Laminator', quantity: 2, unitCost: 3500.00, totalValue: 7000.00, date: '2025-01-15', type: 'semi-expendable' },
        { id: 'SE02', name: 'Wireless Mouse', description: 'Optical wireless mouse', quantity: 25, unitCost: 600.00, totalValue: 15000.00, date: '2025-01-11', type: 'semi-expendable' },
        { id: 'SE03', name: 'HDMI Cable 3m', description: 'HDMI Male to HDMI Male Cable connector', quantity: 10, unitCost: 300.00, totalValue: 3000.00, date: '2025-03-10', type: 'semi-expendable' },
        { id: 'SE04', name: 'HP Laser Printer', description: 'HP Laser Printer LaserJet M15w', quantity: 1, unitCost: 6500.00, totalValue: 6500.00, date: '2025-01-15', type: 'semi-expendable' },
        { id: 'SE05', name: 'Smart LED TV 43"', description: 'Samsung Crystal UHD Smart TV', quantity: 2, unitCost: 25000.00, totalValue: 50000.00, date: '2025-02-12', type: 'semi-expendable' },
        { id: 'SH03', name: 'Over Cabinet & Under Cabinet', description: 'Over cabinet and under cabinet', quantity: 5, unitCost: 7500.00, totalValue: 37500.00, date: '2025-01-15', type: 'semi-expendable' },

        // Non-Expendable products
        { id: 'N001', name: 'Toyota Hiace van', description: 'Toyota Hiace van with plate number', quantity: 1, unitCost: 2700000.00, totalValue: 2700000.00, date: '2024-10-10', type: 'non-expendable' },
        { id: 'N002', name: 'Office Building', description: '2-floor building used for office operations', quantity: 1, unitCost: 8500000.00, totalValue: 8500000.00, date: '2025-08-03', type: 'non-expendable' },
        { id: 'N003', name: 'Industrial Machinery', description: 'Heavy diesel engine for construction purposes', quantity: 1, unitCost: 6500000.00, totalValue: 6500000.00, date: '2025-10-15', type: 'non-expendable' },
        { id: 'N004', name: 'Library Furniture Set', description: 'Complete set including study rooms', quantity: 1, unitCost: 855000.00, totalValue: 855000.00, date: '2025-01-10', type: 'non-expendable' },
        { id: 'N005', name: 'Library Database System', description: 'Overhead software and library management system', quantity: 1, unitCost: 700000.00, totalValue: 700000.00, date: '2025-01-05', type: 'non-expendable' },
        { id: 'N006', name: 'Library Database System', description: 'Overhead software and library management system', quantity: 1, unitCost: 800000.00, totalValue: 800000.00, date: '2025-01-05', type: 'non-expendable' }
    ],

    newRequests: [
    ],

    pendingRequests: [
    ],

    completedRequests: [
    ]
};

// In-memory Stock In records (rendered in Stock In page)
let stockInData = [
    { id: generateUniqueId(), transactionId: 'SI-2025-001', date: '2025-01-15', productName: 'Bond Paper A4', sku: 'E001', quantity: 20, unitCost: 250.00, totalCost: 5000.00, supplier: 'ABC Office Supplies', receivedBy: 'John Doe' },
    { id: generateUniqueId(), transactionId: 'SI-2025-002', date: '2025-01-14', productName: 'Ballpoint Pen Blue', sku: 'E015', quantity: 50, unitCost: 25.00, totalCost: 1250.00, supplier: 'ABC Office Supplies', receivedBy: 'Jane Smith' },
    { id: generateUniqueId(), transactionId: 'SI-2025-003', date: '2025-01-13', productName: 'Desktop Computer', sku: 'NE001', quantity: 2, unitCost: 35000.00, totalCost: 70000.00, supplier: 'Tech Solutions Inc.', receivedBy: 'Mike Johnson' }
];

// Utility Functions
function formatCurrency(amount) {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

function getBadgeClass(status, type = 'status') {
    const badgeClasses = {
        status: {
            'active': 'badge green',
            'inactive': 'badge gray',
            'draft': 'badge gray',
            'submitted': 'badge blue',
            'pending': 'badge yellow',
            'under-review': 'badge blue',
            'awaiting-approval': 'badge orange',
            'approved': 'badge blue',
            'delivered': 'badge green',
            'completed': 'badge emerald',
            'cancelled': 'badge red',
            'low-stock': 'badge orange',
            'out-of-stock': 'badge red'
        },
        priority: {
            'urgent': 'badge red',
            'high': 'badge orange',
            'medium': 'badge yellow',
            'low': 'badge green'
        },
        payment: {
            'paid': 'badge green',
            'pending': 'badge yellow',
            'partial': 'badge orange'
        }
    };

    return badgeClasses[type][status] || 'badge gray';
}

// UI Alert / Toast helper
function showAlert(message, type = 'info', duration = 4000) {
    try {
        let container = document.getElementById('ui-alert-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ui-alert-container';
            document.body.appendChild(container);
        }

        const alertEl = document.createElement('div');
        alertEl.className = `ui-alert ui-alert-${type}`;
        alertEl.setAttribute('role', 'status');

        const text = document.createElement('div');
        text.className = 'ui-alert-text';
        text.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'ui-alert-close';
        closeBtn.innerHTML = '✕';
        closeBtn.onclick = () => {
            alertEl.classList.add('ui-alert-hide');
            setTimeout(() => alertEl.remove(), 300);
        };

        alertEl.appendChild(text);
        alertEl.appendChild(closeBtn);
        container.appendChild(alertEl);

        // Auto-remove after duration
        setTimeout(() => {
            if (!alertEl) return;
            alertEl.classList.add('ui-alert-hide');
            setTimeout(() => alertEl.remove(), 300);
        }, duration);
    } catch (e) {
        // Fallback to native alert if something goes wrong
        try { alert(message); } catch (err) { console.log('Alert:', message); }
    }
}

// Confirmation modal helper that returns a Promise<boolean>
function showConfirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
        let modal = document.getElementById('confirm-modal');
        if (!modal) {
            // fallback to native confirm if modal markup isn't present
            try { resolve(confirm(message)); } catch (e) { resolve(false); }
            return;
        }

        const msgEl = modal.querySelector('#confirm-message');
        const titleEl = modal.querySelector('#confirm-title');
        const okBtn = modal.querySelector('#confirm-ok');
        const cancelBtn = modal.querySelector('#confirm-cancel');

        titleEl.textContent = title;
        msgEl.textContent = message;

        function cleanup(result) {
            modal.classList.remove('active');
            okBtn.removeEventListener('click', onOk);
            cancelBtn.removeEventListener('click', onCancel);
            document.removeEventListener('keydown', onKeyDown);
            resolve(result);
        }

        function onOk() { cleanup(true); }
        function onCancel() { cleanup(false); }

        function onKeyDown(e) {
            if (e.key === 'Escape') { cleanup(false); }
            if (e.key === 'Enter') { cleanup(true); }
        }

        okBtn.addEventListener('click', onOk);
        cancelBtn.addEventListener('click', onCancel);
        document.addEventListener('keydown', onKeyDown);

        modal.classList.add('active');
    });
}

// closeConfirm used by close button in markup
function closeConfirm(value = false) {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;
    modal.classList.remove('active');
    // trigger no-op: showConfirm's event listeners will resolve when removed
}

window.showConfirm = showConfirm;
window.closeConfirm = closeConfirm;

// ---- Notifications helpers ----
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"]+/g, function (s) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[s];
    });
}

function renderNotifications() {
    const listEl = document.getElementById('notifications-list');
    const badge = document.getElementById('notifications-badge');
    if (!listEl || !badge) return;
    listEl.innerHTML = '';
    const unread = (AppState.notifications || []).filter(n => !n.read).length;
    badge.style.display = unread > 0 ? 'block' : 'none';

    (AppState.notifications || []).forEach(n => {
        const item = document.createElement('div');
        item.style.padding = '8px';
        item.style.borderRadius = '6px';
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        if (!n.read) {
            item.style.background = '#f8fafc';
        }
        item.innerHTML = `
            <div style="flex:1;">
                <div style="font-size:13px;color:#111827;">${escapeHtml(n.title)}</div>
                <div style="font-size:12px;color:#6b7280;margin-top:4px;">${escapeHtml(n.time)}</div>
            </div>
            <div style="margin-left:8px;">
                <button class="btn-link" style="font-size:12px;color:#6b7280;border:none;background:none;" onclick="event.stopPropagation(); toggleNotificationRead('${n.id}');">${n.read ? 'Unread' : 'Mark read'}</button>
            </div>
        `;
        item.addEventListener('click', function () {
            toggleNotificationRead(n.id);
        });
        listEl.appendChild(item);
    });
}

function toggleNotifications(e) {
    e && e.stopPropagation();
    const menu = document.getElementById('notifications-menu');
    const btn = document.getElementById('notifications-btn');
    if (!menu || !btn) return;
    const isOpen = menu.style.display === 'block';
    if (isOpen) {
        closeNotifications();
    } else {
        renderNotifications();
        menu.style.display = 'block';
        btn.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
            document.addEventListener('click', outsideNotificationsClick);
        }, 0);
    }
}

function closeNotifications() {
    const menu = document.getElementById('notifications-menu');
    const btn = document.getElementById('notifications-btn');
    if (!menu || !btn) return;
    menu.style.display = 'none';
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', outsideNotificationsClick);
}

function outsideNotificationsClick(e) {
    const menu = document.getElementById('notifications-menu');
    const btn = document.getElementById('notifications-btn');
    if (!menu || !btn) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    closeNotifications();
}

function toggleNotificationRead(id) {
    const n = (AppState.notifications || []).find(x => x.id === id);
    if (!n) return;
    n.read = true;
    renderNotifications();
}

function markAllNotificationsRead() {
    (AppState.notifications || []).forEach(n => n.read = true);
    renderNotifications();
}

// Navigation Functions
function initializeNavigation() {
    // Handle nav item clicks
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });

    // Handle nav group toggles
    document.querySelectorAll('.nav-header[data-group]').forEach(header => {
        header.addEventListener('click', () => {
            const groupId = header.getAttribute('data-group');
            toggleNavGroup(groupId);
            // Special-case: when clicking the Status Management header, navigate to the status view
            if (groupId === 'status') navigateToPage('status');
        });
    });

    // Initialize with dashboard page
    navigateToPage('dashboard');

    // Sync DOM with AppState.expandedMenus (honor initial expanded groups)
    document.querySelectorAll('.nav-group').forEach(g => {
        const header = g.querySelector('.nav-header[data-group]');
        if (!header) return;
        const id = header.getAttribute('data-group');
        if (AppState.expandedMenus.includes(id)) {
            g.classList.add('expanded');
        } else {
            g.classList.remove('expanded');
        }
    });
}

function navigateToPage(pageId) {
    AppState.currentPage = pageId;
    updateActiveNavigation(pageId);
    loadPageContent(pageId);
}

function updateActiveNavigation(pageId) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to current page
    const currentNavItem = document.querySelector(`[data-page="${pageId}"]`);
    if (currentNavItem) {
        currentNavItem.classList.add('active');

        // Expand parent group if it's a submenu item
        const parentGroup = currentNavItem.closest('.nav-group');
        if (parentGroup) {
            const groupId = parentGroup.querySelector('.nav-header').getAttribute('data-group');
            if (!AppState.expandedMenus.includes(groupId)) {
                AppState.expandedMenus.push(groupId);
                parentGroup.classList.add('expanded');
            }
        }
    }
}

function toggleNavGroup(groupId) {
    const headerElem = document.querySelector(`[data-group="${groupId}"]`);
    if (!headerElem) return;
    const group = headerElem.closest('.nav-group');

    const isCurrentlyExpanded = group.classList.contains('expanded') || AppState.expandedMenus.includes(groupId);

    if (isCurrentlyExpanded) {
        // Collapse this group
        group.classList.remove('expanded');
        AppState.expandedMenus = AppState.expandedMenus.filter(id => id !== groupId);
    } else {
        // Accordion behavior: collapse all other groups first
        document.querySelectorAll('.nav-group.expanded').forEach(g => {
            g.classList.remove('expanded');
            const hdr = g.querySelector('.nav-header[data-group]');
            if (hdr) {
                const otherId = hdr.getAttribute('data-group');
                AppState.expandedMenus = AppState.expandedMenus.filter(id => id !== otherId);
            }
        });

        // Expand the requested group
        group.classList.add('expanded');
        if (!AppState.expandedMenus.includes(groupId)) AppState.expandedMenus.push(groupId);
    }
}

// Page Content Generation
function loadPageContent(pageId) {
    const mainContent = document.getElementById('main-content');

    switch (pageId) {
        case 'dashboard':
            mainContent.innerHTML = generateDashboardPage();
            // ensure notifications badge/menu is in sync
            try { renderNotifications(); } catch (e) { /* ignore if not ready */ }
            break;
        case 'categories':
            mainContent.innerHTML = generateCategoriesPage();
            break;
        case 'products':
            mainContent.innerHTML = generateProductsPage();
            break;
        case 'stock-in':
            mainContent.innerHTML = generateStockInPage();
            break;
        case 'stock-out':
            mainContent.innerHTML = generateStockOutPage();
            break;
        case 'status':
            // Show all statuses
            initStatusManagement('all');
            break;
        case 'received':
            initStatusManagement('received');
            break;
        case 'finished':
            initStatusManagement('finished');
            break;
        case 'cancelled':
            initStatusManagement('cancelled');
            break;
        case 'rejected':
            initStatusManagement('rejected');
            break;
        case 'new-request':
            mainContent.innerHTML = generateNewRequestPage();
            break;
        case 'pending-approval':
            mainContent.innerHTML = generatePendingApprovalPage();
            break;
        case 'completed-request':
            mainContent.innerHTML = generateCompletedRequestPage();
            break;
        case 'inventory-reports':
            mainContent.innerHTML = generateInventoryReportsPage();
            break;
        case 'requisition-reports':
            mainContent.innerHTML = generateRequisitionReportsPage();
            break;
        case 'status-report':
            mainContent.innerHTML = generateStatusReportsPage();
            break;
        case 'roles': // Roles & Management
            mainContent.innerHTML = generateRolesManagementPage();
            break;
        case 'users': // ✅ Users Management
            mainContent.innerHTML = generateUsersManagementPage();
            break;
        case 'about':
            mainContent.innerHTML = generateAboutPage();
            break;
        default:
            mainContent.innerHTML = generateDashboardPage();
    }

    // Reinitialize icons after content update
    lucide.createIcons();

    // Initialize page-specific event listeners
    initializePageEvents(pageId);
}

function generateDashboardPage() {
    const currentTime = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Dashboard Overview</h1>
                    <p class="page-subtitle">Last updated: ${currentTime}</p>
                </div>
                <div id="header-actions" class="header-actions">
                    <!-- Search -->
                    <div style="position: relative;">
                        <i data-lucide="search" style="width: 16px; height: 16px; position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af;"></i>
                        <input type="text" placeholder="Search..." style="padding: 8px 12px 8px 36px; border: 1px solid #d1d5db; border-radius: 6px; width: 256px; font-size: 14px;">
                    </div>
                    
                    <!-- Notifications -->
                    <button id="notifications-btn" class="btn-secondary notifications-btn" onclick="toggleNotifications(event)" aria-haspopup="true" aria-expanded="false" title="Notifications">
                        <i data-lucide="bell" class="icon"></i>
                        <span id="notifications-badge"></span>
                    </button>

                    <!-- Notifications popup (absolute inside header-actions) -->
                    <div id="notifications-menu">
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 8px 8px 8px;">
                            <strong>Notifications</strong>
                            <button class="btn-link" style="border:none;background:none;color:#6b7280;cursor:pointer;" onclick="markAllNotificationsRead();">Mark all read</button>
                        </div>
                        <div id="notifications-list" style="max-height:260px;overflow:auto;display:flex;flex-direction:column;gap:6px;padding:4px 8px;">
                            <!-- notifications injected here -->
                        </div>
                        <div style="text-align:center;padding-top:8px;">
                            <button class="btn-secondary" style="padding:6px 12px;border-radius:6px;" onclick="closeNotifications()">Close</button>
                        </div>
                    </div>
                    
                    <!-- Compact User Menu Button (avatar only) -->
                    <div id="header-user-block" class="header-user-block" onclick="toggleUserMenu(event)" title="Profile menu">
                        <div id="header-user-avatar">${AppState.currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                        <i data-lucide="chevron-down" style="width: 16px; height: 16px; color: #6b7280;"></i>

                        <!-- Popup menu (hidden by default) - absolute inside header block -->
                        <div id="user-menu">
                            <button class="btn-menu" style="display:block;width:100%;text-align:left;padding:8px;border:none;background:none;cursor:pointer;border-radius:6px;" onclick="openUserModal('edit','current'); closeUserMenu();">Settings</button>
                            <button class="btn-menu" style="display:block;width:100%;text-align:left;padding:8px;border:none;background:none;cursor:pointer;border-radius:6px;" onclick="logout()">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="page-content">
            <!-- Metrics Cards -->
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-content">
                        <div class="metric-info">
                            <h3>Total Items</h3>
                            <p class="value">1,247</p>
                            <p class="change">Items in inventory</p>
                        </div>
                        <div class="metric-icon blue">
                            <i data-lucide="package" class="icon"></i>
                        </div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-content">
                        <div class="metric-info">
                            <h3>Low Stock Items</h3>
                            <p class="value">23</p>
                            <p class="change">Items with low stock</p>
                        </div>
                        <div class="metric-icon orange">
                            <i data-lucide="alert-triangle" class="icon"></i>
                        </div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-content">
                        <div class="metric-info">
                            <h3>Pending Requests</h3>
                            <p class="value">${(AppState.newRequests || []).filter(r => ['submitted', 'pending', 'under-review', 'awaiting-approval'].includes(r.status)).length}</p>
                            <p class="change">Awaiting approval</p>
                        </div>
                        <div class="metric-icon yellow">
                            <i data-lucide="clock" class="icon"></i>
                        </div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-content">
                        <div class="metric-info">
                            <h3>Delivered Today</h3>
                            <p class="value">45</p>
                            <p class="change">Successfully delivered</p>
                            <p class="change negative">-18% from last month</p>
                        </div>
                        <div class="metric-icon green">
                            <i data-lucide="check-circle" class="icon"></i>
                        </div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-content">
                        <div class="metric-info">
                            <h3>Active Items</h3>
                            <p class="value">126</p>
                            <p class="change">Currently in use</p>
                            <p class="change positive">+9% from last month</p>
                        </div>
                        <div class="metric-icon purple">
                            <i data-lucide="trending-up" class="icon"></i>
                        </div>
                    </div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-content">
                        <div class="metric-info">
                            <h3>Monthly Growth</h3>
                            <p class="value">8.2%</p>
                            <p class="change">Inventory expansion</p>
                            <p class="change positive">+2.1% from last month</p>
                        </div>
                        <div class="metric-icon indigo">
                            <i data-lucide="bar-chart-3" class="icon"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions & Recent Activity -->
            <div class="dashboard-grid">
                <div class="card quick-actions">
                    <div class="card-header">
                        <h3 class="card-title">Quick Actions</h3>
                    </div>
                    <div class="action-list">
                        <div class="action-item" onclick="navigateToPage('new-request')">
                            <div class="action-icon red">
                                <i data-lucide="plus" class="icon"></i>
                            </div>
                            <div class="action-content">
                                <h4>Create New Request</h4>
                                <p>Start a new purchase order</p>
                            </div>
                        </div>
                        
                        <div class="action-item" onclick="navigateToPage('products')">
                            <div class="action-icon blue">
                                <i data-lucide="package-plus" class="icon"></i>
                            </div>
                            <div class="action-content">
                                <h4>Add New Product</h4>
                                <p>Register new inventory item</p>
                            </div>
                        </div>
                        
                        <div class="action-item" onclick="navigateToPage('stock-in')">
                            <div class="action-icon green">
                                <i data-lucide="truck" class="icon"></i>
                            </div>
                            <div class="action-content">
                                <h4>Stock In</h4>
                                <p>Record incoming inventory</p>
                            </div>
                        </div>
                        
                        <div class="action-item" onclick="navigateToPage('reports')">
                            <div class="action-icon purple">
                                <i data-lucide="bar-chart-3" class="icon"></i>
                            </div>
                            <div class="action-content">
                                <h4>View Reports</h4>
                                <p>Generate inventory reports</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Recent Activity</h3>
                    </div>
                    <div class="activity-list">
                        <div class="activity-item">
                            <div class="activity-icon green">
                                <i data-lucide="check" class="icon"></i>
                            </div>
                            <div class="activity-content">
                                <p>Purchase Order PO-2025-008 approved</p>
                                <span class="time">2 hours ago</span>
                            </div>
                        </div>
                        
                        <div class="activity-item">
                            <div class="activity-icon blue">
                                <i data-lucide="package" class="icon"></i>
                            </div>
                            <div class="activity-content">
                                <p>Stock updated for Bond Paper A4</p>
                                <span class="time">4 hours ago</span>
                            </div>
                        </div>
                        
                        <div class="activity-item">
                            <div class="activity-icon orange">
                                <i data-lucide="alert-triangle" class="icon"></i>
                            </div>
                            <div class="activity-content">
                                <p>Low stock alert: Printer Ink Cartridge</p>
                                <span class="time">1 day ago</span>
                            </div>
                        </div>
                        
                        <div class="activity-item">
                            <div class="activity-icon purple">
                                <i data-lucide="user-plus" class="icon"></i>
                            </div>
                            <div class="activity-content">
                                <p>New user Sarah Wilson added</p>
                                <span class="time">2 days ago</span>
                            </div>
                        </div>
                        
                        <div class="activity-item">
                            <div class="activity-icon red">
                                <i data-lucide="file-text" class="icon"></i>
                            </div>
                            <div class="activity-content">
                                <p>New request submitted: Office Supplies</p>
                                <span class="time">3 days ago</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="activity-footer">
                        <a href="#" class="link">View all activity →</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateCategoriesPage() {
    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Categories</h1>
                    <p class="page-subtitle">Manage inventory categories</p>
                </div>
                <button class="add-product-btn" onclick="openCategoryModal('create')">
                    <i data-lucide="plus" class="icon"></i>
                    Add Category
                </button>
            </div>
        </div>
        
        <div class="page-content">
            <div class="table-container">
                <table class="table">
                            <thead>
                        <tr>
                            <th style="padding: 16px 24px;">Category ID</th>
                            <th style="padding: 16px 24px;">Category Name</th>
                            <th style="padding: 16px 24px;">Description</th>
                            <th style="padding: 16px 24px;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MockData.categories.map((category, index) => `
                            <tr style="${index % 2 === 0 ? 'background-color: white;' : 'background-color: #f9fafb;'}">
                                <td style="padding: 16px 24px; font-weight: 500;">${category.id}</td>
                                <td style="padding: 16px 24px; font-weight: 500;">${category.name}</td>
                                <td style="padding: 16px 24px; color: #6b7280; max-width: 600px; line-height: 1.5;">${category.description}</td>
                                <td style="padding: 16px 24px;">
                                    <div class="table-actions">
                                        <button class="btn-outline-orange" title="Edit" style="width: 32px; height: 32px; padding: 0; border-radius: 4px;" onclick="openCategoryModal('edit','${category.id}')">
                                            <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                                        </button>
                                        <button class="btn-outline-red" title="Delete" style="width: 32px; height: 32px; padding: 0; border-radius: 4px;" onclick="deleteCategory('${category.id}')">
                                            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateProductsPage() {
    const currentTab = AppState.currentProductTab || 'expendable';
    const filteredProducts = MockData.products.filter(product => product.type === currentTab.toLowerCase());

    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">List of Products</h1>
                    <p class="page-subtitle">Manage product inventory</p>
                </div>
                <button class="add-product-btn" onclick="openProductModal()">
                    <i data-lucide="plus" class="icon"></i>
                    Add Product
                </button>
            </div>
        </div>
        
        <div class="page-content">
            <!-- Product Tabs -->
            <div class="product-tabs">
                <button class="product-tab ${currentTab === 'expendable' ? 'active' : ''}" onclick="switchProductTab('expendable')">
                    Expendable
                </button>
                <button class="product-tab ${currentTab === 'semi-expendable' ? 'active' : ''}" onclick="switchProductTab('semi-expendable')">
                    Semi-Expendable
                </button>
                <button class="product-tab ${currentTab === 'non-expendable' ? 'active' : ''}" onclick="switchProductTab('non-expendable')">
                    Non-Expendable
                </button>
            </div>

            <!-- Enhanced Filter Bar -->
            <div class="enhanced-filter-bar">
                <div class="filter-left">
                    <div class="enhanced-search">
                        <input type="text" class="form-input" placeholder="Search a Product" id="product-search">
                        <i data-lucide="search" class="search-icon"></i>
                    </div>
                </div>
                <div class="filter-right">
                    <select class="filter-dropdown" id="sort-by">
                        <option>Sort By</option>
                        <option>Product Name (A-Z)</option>
                        <option>Product Name (Z-A)</option>
                        <option>Date (Newest)</option>
                        <option>Date (Oldest)</option>
                        <option>Total Value (High to Low)</option>
                        <option>Total Value (Low to High)</option>
                    </select>
                    <select class="filter-dropdown" id="filter-by">
                        <option>Filter By</option>
                        <option>High Value (>₱5,000)</option>
                        <option>Medium Value (₱1,000-₱5,000)</option>
                        <option>Low Value (<₱1,000)</option>
                        <option>Recent (Last 30 days)</option>
                        <option>Low Quantity (<20)</option>
                    </select>
                </div>
            </div>
            
            <!-- Products Table -->
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Cost</th>
                            <th>Total Value</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredProducts.map((product, index) => {
        const isLow = (product.quantity || 0) <= (AppState.lowStockThreshold || 20);
        const rowBg = isLow ? 'background-color: #fff7f0;' : (index % 2 === 0 ? 'background-color: white;' : 'background-color: #f9fafb;');
        return `
                            <tr style="${rowBg}">
                                <td style="font-weight: 500;">${product.id}</td>
                                <td style="font-weight: 500;">${product.name}</td>
                                <td style="color: #6b7280; max-width: 300px;">${product.description}</td>
                                <td>${product.quantity}</td>
                                <td>${formatCurrency(product.unitCost)}</td>
                                <td style="font-weight: 500;">${formatCurrency(product.totalValue)}</td>
                                <td>${product.date}</td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn-outline-red" title="Delete" style="width: 32px; height: 32px; padding: 0; border-radius: 4px;" onclick="deleteProduct('${product.id}')">
                                            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                                        </button>
                                        <button class="btn-outline-orange" title="Edit" style="width: 32px; height: 32px; padding: 0; border-radius: 4px;" onclick="openProductModal('edit','${product.id}')">
                                            <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
                
                <!-- Enhanced Pagination -->
                <nav class="enhanced-pagination" aria-label="Pagination">
                    <div class="pagination-left" style="margin-left: 16px">
                        Showing 1 to ${filteredProducts.length} of ${filteredProducts.length} entries
                    </div>
                    <div class="pagination-right" style="margin-right: 16px">
                        <button class="pagination-btn" disabled>Previous</button>
                        <button class="pagination-btn active">1</button>
                        <button class="pagination-btn">2</button>
                        <button class="pagination-btn">3</button>
                        <button class="pagination-btn">Next</button>
                    </div>
                </nav>
            </div>
        </div>
    `;
}

function generateStockInPage() {
    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Stock In</h1>
                    <p class="page-subtitle">Record incoming inventory and stock receipts</p>
                </div>
                <button class="btn btn-primary" onclick="openStockInModal('create')">
                    <i data-lucide="plus" class="icon"></i>
                    Add Stock In
                </button>
            </div>
        </div>
        
        <div class="page-content">
            <!-- Enhanced Filter Bar (matching Products page style) -->
            <div class="enhanced-filter-bar">
                <div class="filter-left">
                    <div class="enhanced-search">
                        <input type="text" class="form-input" placeholder="Search stock transactions..." id="stock-search">
                        <i data-lucide="search" class="search-icon"></i>
                    </div>
                </div>
                <div class="filter-right">
                    <input type="date" class="form-input" style="width: 160px;" id="date-filter">
                    <select class="filter-dropdown" id="supplier-filter">
                        <option>All Suppliers</option>
                        <option>ABC Office Supplies</option>
                        <option>Tech Solutions Inc.</option>
                        <option>Global Hardware Corp</option>
                    </select>
                    <select class="filter-dropdown" id="sort-stock">
                        <option>Sort By</option>
                        <option>Date (Newest)</option>
                        <option>Date (Oldest)</option>
                        <option>Amount (High to Low)</option>
                        <option>Amount (Low to High)</option>
                        <option>Product Name (A-Z)</option>
                    </select>
                </div>
            </div>
            
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Quantity</th>
                            <th>Unit Cost</th>
                            <th>Total Cost</th>
                            <th>Supplier</th>
                            <th>Received By</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="stock-in-table-body">
                        ${renderStockInRows()}
                    </tbody>
                </table>
                
                <!-- 🔹 Pagination -->
                <nav class="enhanced-pagination" aria-label="Pagination">
                    <div class="pagination-left" style="margin-left: 16px">
                        Showing 1 to ${stockInData.length} of ${stockInData.length} entries
                    </div>
                    <div class="pagination-right" style="margin-right: 16px">
                        <button class="pagination-btn" disabled>Previous</button>
                        <button class="pagination-btn active">1</button>
                        <button class="pagination-btn">2</button>
                        <button class="pagination-btn">3</button>
                        <button class="pagination-btn">Next</button>
                    </div>
                </nav>
            </div>
        </div>
    `;
}



function generateStockOutPage() {
    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Stock Out</h1>
                    <p class="page-subtitle">Record outgoing inventory and issued items</p>
                </div>
                <button class="btn btn-primary" onclick="openStockOutModal('create')">
                    <i data-lucide="plus" class="icon"></i>
                    Issue Stock
                </button>
            </div>
        </div>
        
        <div class="page-content">
            <!-- Enhanced Filter Bar -->
            <div class="enhanced-filter-bar">
                <div class="filter-left">
                    <div class="enhanced-search">
                        <input type="text" class="form-input" placeholder="Search stock issues..." id="stockOutSearch">
                        <i data-lucide="search" class="search-icon"></i>
                    </div>
                    <select class="filter-dropdown" id="departmentFilter">
                        <option value="">All Departments</option>
                        <option value="COENG">College of Engineering</option>
                        <option value="CBPA">College of Business and Public Administration</option>
                        <option value="CAS">College of Arts and Sciences</option>
                        <option value="CCMS">College of Computing and Multimedia Studies</option>
                        <option value="OP">Office of the President</option>
                        <option value="VPAA">Office of the Vice President for Academic Affairs</option>
                        <option value="VPRE">Office of the Vice President for Research and Extension</option>
                        <option value="VPFA">Office of the Vice President for Finance Affairs</option>
                    </select>
                    <select class="filter-dropdown" id="statusFilter">
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div class="filter-right">
                    <input type="date" class="filter-dropdown" id="dateFrom" title="From Date" style="width: 150px;">
                    <button class="btn btn-secondary" onclick="clearStockOutFilters()" title="Clear Filters">
                        <i data-lucide="x" class="icon"></i>
                        Clear
                    </button>
                    <button class="btn btn-secondary" onclick="exportStockOut()" title="Export Data">
                        <i data-lucide="download" class="icon"></i>
                        Export
                    </button>
                </div>
            </div>

            <div class="table-responsive">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="sortable" data-sort="issue_id">Issue ID</th>
                                <th class="sortable" data-sort="date">Date</th>
                                <th class="sortable" data-sort="product_name">Product Name</th>
                                <th>SKU</th>
                                <th class="sortable" data-sort="quantity">Quantity</th>
                                <th class="sortable" data-sort="unit_cost">Unit Cost</th>
                                <th class="sortable" data-sort="total_cost">Total Cost</th>
                                <th class="sortable" data-sort="department">Department</th>
                                <th>Issued To</th>
                                <th>Issued By</th>
                                <th>Status</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="stock-out-table-body">
                            ${renderStockOutRows()}
                        </tbody>
                    </table>
                    
                    <!-- 🔹 Pagination -->
                    <nav class="enhanced-pagination" aria-label="Pagination">
                        <div class="pagination-left" style="margin-left: 16px">
                            Showing 1 to ${stockOutData.length} of ${stockOutData.length} entries
                        </div>
                        <div class="pagination-right" style="margin-right: 16px">
                            <button class="pagination-btn" disabled>Previous</button>
                            <button class="pagination-btn active">1</button>
                            <button class="pagination-btn">2</button>
                            <button class="pagination-btn">3</button>
                            <button class="pagination-btn">Next</button>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    `;
}

function generateNewRequestPage() {
    return `
        <section class="page-header">
            <div class="page-header-content">
                <header>
                    <h1 class="page-title">New Request</h1>
                    <p class="page-subtitle">Create and manage new purchase requests</p>
                </header>
                <button class="btn btn-primary" onclick="openPurchaseOrderModal('create')">
                    <i data-lucide="plus" class="icon"></i>
                    Create New Request
                </button>
            </div>
        </section>

        <main class="page-content">
            <!-- 🔹 Enhanced Filter Bar -->
            <section class="enhanced-filter-bar" aria-label="Filters">
                <div class="filter-left">
                    <div class="enhanced-search">
                        <input type="search" class="form-input" placeholder="Search requests..." id="requestSearch" aria-label="Search requests">
                        <i data-lucide="search" class="search-icon"></i>
                    </div>

                    <label for="statusFilter" class="visually-hidden">Filter by Status</label>
                    <select class="filter-dropdown" id="statusFilter">
                        <option value="">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="pending">Pending</option>
                    </select>

                    <label for="departmentFilter" class="visually-hidden">Filter by Department</label>
                    <select class="filter-dropdown" id="departmentFilter">
                        <option value="">All Departments</option>
                        <option value="coeng">College of Engineering</option>
                        <option value="cbpa">College of Business and Public Administration</option>
                        <option value="cas">College of Arts and Sciences</option>
                        <option value="ccms">College of Computing and Multimedia Studies</option>
                        <option value="op">Office of the President</option>
                        <option value="vpaa">Office of the Vice President for Academic Affairs</option>
                        <option value="vpre">Office of the Vice President for Research and Extension</option>
                        <option value="vpfa">Office of the Vice President for Finance Affairs</option>
                    </select>
                </div>
            </section>

            <!-- 🔹 Requests Table -->
            <section class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Request ID</th>
                            <th scope="col">P.O. Number</th>
                            <th scope="col">Supplier</th>
                            <th scope="col">Request Date</th>
                            <th scope="col">Delivery Date</th>
                            <th scope="col">Total Amount</th>
                            <th scope="col">Status</th>
                            <th scope="col">Requested By</th>
                            <th scope="col">Department</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${AppState.newRequests && AppState.newRequests.length > 0
            ? AppState.newRequests.map(request => `
                        <tr>
                            <td>${request.id}</td>
                            <td>
                                <button class="link" onclick="openPurchaseOrderModal('view', '${request.id}')"
                                    style="background: none; border: none; color: #dc2626; text-decoration: underline; cursor: pointer;">
                                    ${request.poNumber}
                                </button>
                            </td>
                            <td>${request.supplier}</td>
                            <td>${request.requestDate}</td>
                            <td>${request.deliveryDate}</td>
                            <td>${formatCurrency(request.totalAmount)}</td>
                            <td>
                                <span class="${getBadgeClass(request.status)}">
                                    ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                            </td>
                            <td>${request.requestedBy}</td>
                            <td>${request.department}</td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn-outline-blue" onclick="openPurchaseOrderModal('view', '${request.id}')" title="View">
                                        <i data-lucide="eye" class="icon"></i>
                                    </button>
                                    <button class="btn-outline-orange" onclick="openPurchaseOrderModal('edit', '${request.id}')" title="Edit">
                                        <i data-lucide="edit" class="icon"></i>
                                    </button>
                                    <button class="btn-outline-red" onclick="deleteRequest('${request.id}')" title="Delete">
                                        <i data-lucide="trash-2" class="icon"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')
            : `
                        <tr>
                            <td colspan="10" class="px-6 py-12 text-center text-gray-500">
                                <div class="flex flex-col items-center gap-2">
                                    <p>No requests found</p>
                                </div>
                            </td>
                        </tr>
                    `}
                    </tbody>
                </table>

                <!-- 🔹 Pagination -->
                <nav class="enhanced-pagination" aria-label="Pagination">
                    <div class="pagination-left" style="margin-left: 16px">
                        ${AppState.newRequests && AppState.newRequests.length > 0 ? `Showing 1 to ${AppState.newRequests.length} of ${AppState.newRequests.length} entries` : 'Showing 0 entries'}
                    </div>
                    <div class="pagination-right" style="margin-right: 16px">
                        <button class="pagination-btn" disabled>Previous</button>
                        <button class="pagination-btn active">1</button>
                        <button class="pagination-btn">2</button>
                        <button class="pagination-btn">3</button>
                        <button class="pagination-btn">Next</button>
                    </div>
                </nav>
            </section>
        </main>
    `;
}


function generatePendingApprovalPage() {
    // Build the pending list from newRequests (prefer newRequests as source of truth)
    const pendingStatuses = ['submitted', 'pending', 'under-review', 'awaiting-approval'];
    const pendingList = (AppState.newRequests || []).filter(r => pendingStatuses.includes(r.status));

    return `
        <section class="page-header">
            <div class="page-header-content">
                <header>
                    <h1 class="page-title">Pending Approval</h1>
                    <p class="page-subtitle">Review and approve purchase requests</p>
                </header>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge yellow">${pendingList.length} Pending Requests</span>
                </div>
            </div>
        </section>

        <main class="page-content">
            <!-- 🔹 Enhanced Filter Bar -->
            <section class="enhanced-filter-bar" aria-label="Filters">
                <div class="filter-left">
                    <!-- Search -->
                    <div class="enhanced-search">
                        <input type="search" class="form-input" placeholder="Search requests..." id="pendingSearch" aria-label="Search pending requests">
                        <i data-lucide="search" class="search-icon"></i>
                    </div>

                    <!-- Status Filter -->
                    <label for="statusFilter" class="visually-hidden">Filter by Status</label>
                    <select class="filter-dropdown" id="statusFilter">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="under-review">Under Review</option>
                        <option value="awaiting-approval">Awaiting Approval</option>
                    </select>

                    <!-- Priority Filter -->
                    <label for="priorityFilter" class="visually-hidden">Filter by Priority</label>
                    <select class="filter-dropdown" id="priorityFilter">
                        <option value="">All Priority</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </section>

            <!-- 🔹 Requests Table -->
            <section class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Request ID</th>
                            <th scope="col">P.O. Number</th>
                            <th scope="col">Supplier</th>
                            <th scope="col">Total Amount</th>
                            <th scope="col">Priority</th>
                            <th scope="col">Status</th>
                            <th scope="col">Requested By</th>
                            <th scope="col">Department</th>
                            <th scope="col">Submitted Date</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pendingList.length > 0
            ? pendingList.map(request => `
                                <tr>
                                    <td>${request.id}</td>
                                    <td>
                                        <button class="link" onclick="openPurchaseOrderModal('view', '${request.id}')"
                                            style="background: none; border: none; color: #dc2626; text-decoration: underline; cursor: pointer;">
                                            ${request.poNumber || '-'}
                                        </button>
                                    </td>
                                    <td>${request.supplier || '-'}</td>
                                    <td>${formatCurrency(request.totalAmount || 0)}</td>
                                    <td>
                                        <span class="${getBadgeClass(request.priority || 'low', 'priority')}">
                                            ${request.priority ? (request.priority.charAt(0).toUpperCase() + request.priority.slice(1)) : 'Low'}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="${getBadgeClass(request.status || 'pending')}">
                                            ${(request.status || 'pending').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    </td>
                                    <td>${request.requestedBy || '-'}</td>
                                    <td>${request.department || '-'}</td>
                                    <td>${request.submittedDate || request.requestDate || '-'}</td>
                                    <td>
                                        <div class="table-actions">
                                            <button class="btn-outline-blue" onclick="openPurchaseOrderModal('view', '${request.id}')" title="View Details">
                                                <i data-lucide="eye" class="icon"></i>
                                            </button>
                                            <button class="btn-outline-orange" onclick="openPurchaseOrderModal('edit', '${request.id}')" title="Edit Request">
                                                <i data-lucide="edit" class="icon"></i>
                                            </button>
                                            <button class="btn-outline-green" onclick="approveRequest('${request.id}')" title="Approve Request">
                                                <i data-lucide="check" class="icon"></i>
                                            </button>
                                            <button class="btn-outline-red" onclick="rejectRequest('${request.id}')" title="Reject Request">
                                                <i data-lucide="x" class="icon"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')
            : `
                                <tr>
                                    <td colspan="10" class="px-6 py-12 text-center text-gray-500">
                                        <div class="flex flex-col items-center gap-2">
                                            <p>No pending requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            `
        }
                    </tbody>
                </table>
            </section>
        </main>
    `;
}


function generateCompletedRequestPage() {
    return `
        <section class="page-header">
            <div class="page-header-content">
                <header>
                    <h1 class="page-title">Completed Request</h1>
                    <p class="page-subtitle">View completed and archived purchase requests</p>
                </header>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge green">${(AppState.completedRequests || []).filter(r => r.status === 'completed').length} Completed</span>
                    <span class="badge blue">${(AppState.completedRequests || []).filter(r => r.status === 'delivered').length} Delivered</span>
                </div>
            </div>
        </section>
        
        <main class="page-content">
            <!-- 🔹 Enhanced Filter Bar -->
            <section class="enhanced-filter-bar" aria-label="Filters">
                <div class="filter-left">
                    <!-- Search -->
                    <div class="enhanced-search">
                        <input type="search" class="form-input" placeholder="Search requests..." id="completedSearch" aria-label="Search completed requests">
                        <i data-lucide="search" class="search-icon"></i>
                    </div>

                    <!-- Status Filter -->
                    <label for="statusFilter" class="visually-hidden">Filter by Status</label>
                    <select class="filter-dropdown" id="statusFilter">
                        <option value="">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <!-- Payment Filter -->
                    <label for="paymentFilter" class="visually-hidden">Filter by Payment Status</label>
                    <select class="filter-dropdown" id="paymentFilter">
                        <option value="">All Payment</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="partial">Partial</option>
                    </select>
                </div>
            </section>

            <!-- 🔹 Completed Requests Table -->
            <section class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Request ID</th>
                            <th scope="col">P.O. Number</th>
                            <th scope="col">Supplier</th>
                            <th scope="col">Total Amount</th>
                            <th scope="col">Status</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Requested By</th>
                            <th scope="col">Approved By</th>
                            <th scope="col">Delivered Date</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(AppState.completedRequests || []).length > 0
            ? (AppState.completedRequests || []).map(request => `
                                <tr>
                                    <td>${request.id}</td>
                                    <td>
                                        <button class="link" onclick="openPurchaseOrderModal('view', '${request.id}')"
                                            style="background: none; border: none; color: #dc2626; text-decoration: underline; cursor: pointer;">
                                            ${request.poNumber}
                                        </button>
                                    </td>
                                    <td>${request.supplier}</td>
                                    <td>${formatCurrency(request.totalAmount)}</td>
                                    <td>
                                        <span class="${getBadgeClass(request.status)}">
                                            ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="${getBadgeClass(request.paymentStatus, 'payment')}">
                                            ${request.paymentStatus.charAt(0).toUpperCase() + request.paymentStatus.slice(1)}
                                        </span>
                                    </td>
                                    <td>${request.requestedBy}</td>
                                    <td>${request.approvedBy}</td>
                                    <td>${request.deliveredDate || '-'}</td>
                                    <td>
                                        <div class="table-actions">
                                            <button class="btn-outline-blue" onclick="openPurchaseOrderModal('view', '${request.id}')" title="View Details">
                                                <i data-lucide="eye" class="icon"></i>
                                            </button>
                                            <button class="btn-outline-green" onclick="downloadPO('${request.id}')" title="Download PO">
                                                <i data-lucide="download" class="icon"></i>
                                            </button>
                                            <button class="btn-outline-orange" onclick="archiveRequest('${request.id}')" title="Archive Request">
                                                <i data-lucide="archive" class="icon"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')
            : `
                                <tr>
                                    <td colspan="10" class="px-6 py-12 text-center text-gray-500">
                                        <div class="flex flex-col items-center gap-2">
                                            <p>No completed requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            `
        }
                    </tbody>
                </table>

                <!-- 🔹 Summary Stats -->
                <aside class="grid-4 mt-6" style="background-color: #f9fafb; padding: 16px; border-radius: 8px;">
                    <div class="text-center">
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Total Requests</p>
                        <p style="font-size: 18px; font-weight: 600; color: #111827; margin: 0;">
                            ${(AppState.completedRequests || []).length}
                        </p>
                    </div>
                    <div class="text-center">
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Total Value</p>
                        <p style="font-size: 18px; font-weight: 600; color: #111827; margin: 0;">
                            ${formatCurrency((AppState.completedRequests || []).reduce((sum, req) => sum + (req.totalAmount || 0), 0))}
                        </p>
                    </div>
                    <div class="text-center">
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Completed</p>
                        <p style="font-size: 18px; font-weight: 600; color: #16a34a; margin: 0;">
                            ${(AppState.completedRequests || []).filter(r => r.status === 'completed').length}
                        </p>
                    </div>
                    <div class="text-center">
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Paid Orders</p>
                        <p style="font-size: 18px; font-weight: 600; color: #2563eb; margin: 0;">
                            ${(AppState.completedRequests || []).filter(r => r.paymentStatus === 'paid').length}
                        </p>
                    </div>
                </aside>
            </section>
        </main>
    `;
}

// -----------------------------
// Reports Pages
// -----------------------------

function generateInventoryReportsPage() {
    // Filters: date range (not used for inventory mock) and department
    const departments = ['All', 'IT', 'Procurement', 'Finance', 'HR', 'Admin'];

    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Inventory Reports</h1>
                    <p class="page-subtitle">Generate and export inventory summary</p>
                </div>
                <div>
                    <button class="btn btn-secondary" id="export-inventory-btn">Export CSV</button>
                </div>
            </div>
        </div>

        <div class="page-content">
            <div class="card">
                <div style="display:flex;gap:12px;align-items:center;">
                    <div>
                        <label class="form-label">Department</label>
                        <select id="inventory-department-filter" class="form-select">
                            ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="form-label">From</label>
                        <input type="date" id="inventory-date-from" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">To</label>
                        <input type="date" id="inventory-date-to" class="form-input">
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top:12px;">
                <canvas id="inventory-chart" width="600" height="200"></canvas>
            </div>

            <div class="card" style="margin-top:12px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
                <div style="flex:1;">
                    <h3 style="margin:0 0 8px 0;">Low Stocks</h3>
                    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                        <label class="form-label" style="margin:0;">Threshold</label>
                        <input type="number" id="low-stock-threshold" class="form-input" value="20" style="width:100px;">
                        <button class="btn btn-secondary" id="export-lowstock-btn">Export Low Stocks</button>
                    </div>
                    <div class="table-container" style="max-height:240px;overflow:auto;">
                        <table class="table" id="low-stock-table">
                            <thead>
                                <tr>
                                    <th>Stock Number</th>
                                    <th>Name</th>
                                    <th>Current Stock</th>
                                    <th>Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- low stock rows injected by renderInventoryReport() -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style="width:320px;">
                    <!-- small summary card for low stocks -->
                    <div style="padding:12px;border-radius:8px;background:#fff;border:1px solid #eef2f7;">
                        <p style="margin:0;color:#6b7280;">Items below threshold</p>
                        <h2 id="low-stock-count" style="margin:8px 0 0 0;">0</h2>
                        <p id="lowest-item" style="margin:8px 0 0 0;color:#6b7280;">-</p>
                    </div>
                </div>
            </div>

            <div class="table-container" style="margin-top:16px;">
                <table class="table" id="inventory-report-table">
                    <thead>
                        <tr>
                            <th>Stock Number</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- rows injected by renderInventoryReport() -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateRequisitionReportsPage() {
    const departments = ['All', 'IT', 'Procurement', 'Finance', 'HR', 'Admin'];

    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Requisition Reports</h1>
                    <p class="page-subtitle">Overview of requisitions and requests</p>
                </div>
                <div>
                    <button class="btn btn-secondary" id="export-requisition-btn">Export CSV</button>
                </div>
            </div>
        </div>

        <div class="page-content">
            <div class="card">
                <div style="display:flex;gap:12px;align-items:center;">
                    <div>
                        <label class="form-label">Department</label>
                        <select id="requisition-department-filter" class="form-select">
                            ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="form-label">From</label>
                        <input type="date" id="requisition-date-from" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">To</label>
                        <input type="date" id="requisition-date-to" class="form-input">
                    </div>
                </div>
            </div>

            <div class="table-container" style="margin-top:16px;">
                <table class="table" id="requisition-report-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>PO Number</th>
                            <th>Supplier</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- rows injected by renderRequisitionReport() -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateStatusReportsPage() {
    const departments = ['All', 'IT', 'Procurement', 'Finance', 'HR', 'Admin'];

    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Status Report</h1>
                    <p class="page-subtitle">Breakdown of request statuses</p>
                </div>
                <div>
                    <button class="btn btn-secondary" id="export-status-btn">Export CSV</button>
                </div>
            </div>
        </div>

        <div class="page-content">
            <div class="card">
                <div style="display:flex;gap:12px;align-items:center;">
                    <div>
                        <label class="form-label">Department</label>
                        <select id="status-department-filter" class="form-select">
                            ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="form-label">From</label>
                        <input type="date" id="status-date-from" class="form-input">
                    </div>
                    <div>
                        <label class="form-label">To</label>
                        <input type="date" id="status-date-to" class="form-input">
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top:12px;">
                <canvas id="status-chart" width="600" height="200"></canvas>
            </div>

            <div class="table-container" style="margin-top:16px;">
                <table class="table" id="status-report-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- rows injected by renderStatusReport() -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// CSV export helpers
function downloadCSV(filename, rows) {
    // Add UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const csvContent = rows.map(r => r.map(c => `"${(c + '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function exportInventoryCSV() {
    // export only currently filtered rows if filters applied
    const rows = [['Stock Number', 'Name', 'Current Stock', 'Unit']];
    const rowsToExport = (window.__inventoryFilteredRows && window.__inventoryFilteredRows.length) ? window.__inventoryFilteredRows : MockData.inventory;
    rowsToExport.forEach(i => rows.push([i.stockNumber, i.name, i.currentStock, i.unit]));
    downloadCSV('inventory-report.csv', rows);
}

function exportRequisitionCSV() {
    const rows = [['Request ID', 'PO Number', 'Supplier', 'Total Amount', 'Status']];
    const rowsToExport = (window.__requisitionFilteredRows && window.__requisitionFilteredRows.length) ? window.__requisitionFilteredRows : [...(AppState.newRequests || []), ...(AppState.pendingRequests || []), ...(AppState.completedRequests || [])];
    rowsToExport.forEach(r => rows.push([r.id || '', r.poNumber || '', r.supplier || '', r.totalAmount || 0, r.status || '']));
    downloadCSV('requisition-report.csv', rows);
}

function exportStatusCSV() {
    const rows = [['Status', 'Count']];
    const rowsToExport = (window.__statusSummary && Object.keys(window.__statusSummary).length) ? window.__statusSummary : (function () { const all = [...(AppState.newRequests || []), ...(AppState.pendingRequests || []), ...(AppState.completedRequests || [])]; return all.reduce((acc, r) => { acc[r.status || 'unknown'] = (acc[r.status || 'unknown'] || 0) + 1; return acc; }, {}); })();
    Object.keys(rowsToExport).forEach(k => rows.push([k, rowsToExport[k]]));
    downloadCSV('status-report.csv', rows);
}

// Render helpers + Chart wiring
function renderInventoryReport() {
    const tbody = document.querySelector('#inventory-report-table tbody');
    if (!tbody) return;

    // apply filters
    const dept = document.getElementById('inventory-department-filter')?.value || 'All';
    // MockData has no department per item; we'll just allow dept filter to demonstrate
    const from = document.getElementById('inventory-date-from')?.value;
    const to = document.getElementById('inventory-date-to')?.value;

    let rows = MockData.inventory.slice();
    // date filters ignored for inventory mock but kept for future real data

    // save filtered rows globally for export
    window.__inventoryFilteredRows = rows;

    tbody.innerHTML = rows.map(i => `
        <tr>
            <td style="font-weight:500;">${i.stockNumber}</td>
            <td>${i.name}</td>
            <td>${i.currentStock}</td>
            <td>${i.unit}</td>
        </tr>
    `).join('');

    // render chart (simple bar)
    const labels = rows.map(r => r.name);
    const data = rows.map(r => r.currentStock);
    renderInventoryChart(labels, data);

    // Low-stock computation
    const thresholdInput = document.getElementById('low-stock-threshold');
    const threshold = thresholdInput ? parseInt(thresholdInput.value, 10) || 0 : 20;
    const lowStockItems = rows.filter(r => typeof r.currentStock === 'number' ? r.currentStock <= threshold : false);

    // populate low-stock table
    const lowTbody = document.querySelector('#low-stock-table tbody');
    if (lowTbody) {
        lowTbody.innerHTML = lowStockItems.map(i => `
            <tr>
                <td style="font-weight:500;">${i.stockNumber}</td>
                <td>${i.name}</td>
                <td>${i.currentStock}</td>
                <td>${i.unit}</td>
            </tr>
        `).join('');
    }

    // update summary
    const lowCountEl = document.getElementById('low-stock-count');
    const lowestItemEl = document.getElementById('lowest-item');
    if (lowCountEl) lowCountEl.textContent = lowStockItems.length;
    if (lowestItemEl) {
        if (lowStockItems.length > 0) {
            const sorted = lowStockItems.slice().sort((a, b) => a.currentStock - b.currentStock);
            lowestItemEl.textContent = `${sorted[0].name} (${sorted[0].currentStock} ${sorted[0].unit})`;
        } else {
            lowestItemEl.textContent = '-';
        }
    }

    // store low-stock rows for export
    window.__lowStockRows = lowStockItems;
}

function exportLowStockCSV() {
    const rows = [['Stock Number', 'Name', 'Current Stock', 'Unit']];
    const toExport = (window.__lowStockRows && window.__lowStockRows.length) ? window.__lowStockRows : [];
    toExport.forEach(i => rows.push([i.stockNumber, i.name, i.currentStock, i.unit]));
    downloadCSV('low-stock-report.csv', rows);
}

function renderRequisitionReport() {
    const tbody = document.querySelector('#requisition-report-table tbody');
    if (!tbody) return;

    const dept = document.getElementById('requisition-department-filter')?.value || 'All';
    const from = document.getElementById('requisition-date-from')?.value;
    const to = document.getElementById('requisition-date-to')?.value;

    let all = [...(AppState.newRequests || []), ...(AppState.pendingRequests || []), ...(AppState.completedRequests || [])];

    // simple date filtering by requestDate if available
    if (from) all = all.filter(r => r.requestDate ? new Date(r.requestDate) >= new Date(from) : true);
    if (to) all = all.filter(r => r.requestDate ? new Date(r.requestDate) <= new Date(to) : true);

    // dept filter: assume r.department stores dept code or name
    if (dept && dept !== 'All') all = all.filter(r => (r.department || '').toLowerCase().includes(dept.toLowerCase()));

    window.__requisitionFilteredRows = all;

    tbody.innerHTML = all.map(r => `
        <tr>
            <td style="font-weight:500;">${r.id || '-'}</td>
            <td>${r.poNumber || '-'}</td>
            <td>${r.supplier || '-'}</td>
            <td>${formatCurrency(r.totalAmount || 0)}</td>
            <td><span class="${getBadgeClass(r.status || 'draft')}">${(r.status || 'Draft')}</span></td>
        </tr>
    `).join('');
}

function renderStatusReport() {
    const tbody = document.querySelector('#status-report-table tbody');
    if (!tbody) return;

    const dept = document.getElementById('status-department-filter')?.value || 'All';
    const from = document.getElementById('status-date-from')?.value;
    const to = document.getElementById('status-date-to')?.value;

    let all = [...(AppState.newRequests || []), ...(AppState.pendingRequests || []), ...(AppState.completedRequests || [])];
    if (from) all = all.filter(r => r.requestDate ? new Date(r.requestDate) >= new Date(from) : true);
    if (to) all = all.filter(r => r.requestDate ? new Date(r.requestDate) <= new Date(to) : true);
    if (dept && dept !== 'All') all = all.filter(r => (r.department || '').toLowerCase().includes(dept.toLowerCase()));

    const summary = all.reduce((acc, r) => { const s = r.status || 'unknown'; acc[s] = (acc[s] || 0) + 1; return acc; }, {});
    window.__statusSummary = summary;

    tbody.innerHTML = Object.keys(summary).map(k => `
        <tr>
            <td>${k}</td>
            <td>${summary[k]}</td>
        </tr>
    `).join('');

    // render status chart
    renderStatusChart(Object.keys(summary), Object.values(summary));
}

// Chart renderers
let __inventoryChartInstance = null;
function renderInventoryChart(labels, data) {
    const ctx = document.getElementById('inventory-chart');
    if (!ctx) return;
    if (__inventoryChartInstance) __inventoryChartInstance.destroy();
    __inventoryChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{ label: 'Current Stock', data, backgroundColor: '#3b82f6' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

let __statusChartInstance = null;
function renderStatusChart(labels, data) {
    const ctx = document.getElementById('status-chart');
    if (!ctx) return;
    if (__statusChartInstance) __statusChartInstance.destroy();
    __statusChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#6b7280'] }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Hook filters and export buttons after page load
function initializeReportPageEvents(pageId) {
    if (pageId === 'inventory-reports') {
        document.getElementById('inventory-department-filter')?.addEventListener('change', renderInventoryReport);
        document.getElementById('inventory-date-from')?.addEventListener('change', renderInventoryReport);
        document.getElementById('inventory-date-to')?.addEventListener('change', renderInventoryReport);
        document.getElementById('export-inventory-btn')?.addEventListener('click', exportInventoryCSV);
        document.getElementById('low-stock-threshold')?.addEventListener('change', renderInventoryReport);
        document.getElementById('low-stock-threshold')?.addEventListener('change', function (e) {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) AppState.lowStockThreshold = v;
        });
        document.getElementById('export-lowstock-btn')?.addEventListener('click', exportLowStockCSV);
        // initial render
        renderInventoryReport();
    }
    if (pageId === 'requisition-reports') {
        document.getElementById('requisition-department-filter')?.addEventListener('change', renderRequisitionReport);
        document.getElementById('requisition-date-from')?.addEventListener('change', renderRequisitionReport);
        document.getElementById('requisition-date-to')?.addEventListener('change', renderRequisitionReport);
        document.getElementById('export-requisition-btn')?.addEventListener('click', exportRequisitionCSV);
        renderRequisitionReport();
    }
    if (pageId === 'status-report') {
        document.getElementById('status-department-filter')?.addEventListener('change', renderStatusReport);
        document.getElementById('status-date-from')?.addEventListener('change', renderStatusReport);
        document.getElementById('status-date-to')?.addEventListener('change', renderStatusReport);
        document.getElementById('export-status-btn')?.addEventListener('click', exportStatusCSV);
        renderStatusReport();
    }
}

// Ensure initializePageEvents calls the report page events too
const _origInitializePageEvents = initializePageEvents;
initializePageEvents = function (pageId) {
    _origInitializePageEvents(pageId);
    initializeReportPageEvents(pageId);
}

// ----------------------------- //
// Purchase Order Modal Functions //
// ----------------------------- //

function openPurchaseOrderModal(mode = 'create', requestId = null) {
    const modal = document.getElementById('purchase-order-modal');
    const modalContent = modal.querySelector('.modal-content');

    AppState.currentModal = { mode, requestId };

    // Load existing request if not create mode
    let requestData = null;
    if (requestId) {
        requestData = AppState.newRequests.find(r => r.id === requestId) ||
            AppState.pendingRequests.find(r => r.id === requestId) ||
            AppState.completedRequests.find(r => r.id === requestId);
    }

    modalContent.innerHTML = generatePurchaseOrderModal(mode, requestData);
    modal.classList.add('active');

    lucide.createIcons();
    initializePurchaseOrderModal(requestData);
}


function closePurchaseOrderModal() {
    const modal = document.getElementById('purchase-order-modal');
    modal.classList.remove('active');
    AppState.currentModal = null;
}

function generatePurchaseOrderModal(mode, requestData = null) {
    const title = mode === 'create' ? 'NEW PURCHASE ORDER' : 'PURCHASE ORDER';
    const isReadOnly = mode === 'view';

    // Department List using user's suggested values
    const departments = [
        { value: 'COENG', label: 'College of Engineering' },
        { value: 'CBPA', label: 'College of Business and Public Administration' },
        { value: 'CAS', label: 'College of Arts and Sciences' },
        { value: 'CCMS', label: 'College of Computing and Multimedia Studies' },
        { value: 'OP', label: 'Office of the President' },
        { value: 'OVPAA', label: 'Office of the Vice President for Academic Affairs' },
        { value: 'OVPRE', label: 'Office of the Vice President for Research and Extension' },
        { value: 'OVPFA', label: 'Office of the Vice President for Finance Affairs' }
    ];
    const selectedDepartment = requestData?.department || ''; // Default to empty value

    return `
        <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <p class="modal-subtitle">Camarines Norte State College</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">Entity Name</p>
            <button class="modal-close" onclick="closePurchaseOrderModal()">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body space-y-6">
            <!-- Basic Information -->
            <div class="grid-2">
                <div class="space-y-4">
                    <div class="form-group">
                        <label class="form-label">Supplier</label>
                        <input type="text" class="form-input" 
                               value="${requestData?.supplier || ''}"
                               placeholder="Enter supplier name" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Address of the Supplier</label>
                        <textarea class="form-textarea" 
                                     placeholder="Enter supplier address" 
                                     ${isReadOnly ? 'readonly' : ''}>${requestData?.supplierAddress || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">TIN Number of the Supplier</label>
                        <input type="text" class="form-input" 
                               value="${requestData?.supplierTIN || ''}"
                               placeholder="Enter TIN number" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <!-- Department Dropdown (REVISED FIELD) -->
                    <div class="form-group">
                        <label class="form-label">Department</label>
                        <select class="form-select" name="department" ${isReadOnly ? 'disabled' : ''}>
                            <option value="">Select Department</option>
                            ${departments.map(dept => `
                                <option value="${dept.value}" ${dept.value === selectedDepartment ? 'selected' : ''}>
                                    ${dept.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <!-- END REVISED FIELD -->
                    
                </div>

                <div class="space-y-4">
                    <div class="form-group">
                        <label class="form-label">P.O. Number</label>
                        <input type="text" class="form-input" 
                               value="${requestData?.poNumber || ''}"
                               placeholder="Enter P.O. number" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Date of Purchase</label>
                        <input type="date" class="form-input" 
                               value="${requestData?.purchaseDate || ''}"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Mode of Procurement</label>
                        <select class="form-select" ${isReadOnly ? 'disabled' : ''}>
                            <option ${!requestData?.procurementMode ? 'selected' : ''}>Select payment mode</option>
                            <option ${requestData?.procurementMode === 'Small Value Procurement' ? 'selected' : ''}>Small Value Procurement</option>
                            <option ${requestData?.procurementMode === 'Medium Value Procurement' ? 'selected' : ''}>Medium Value Procurement</option>
                            <option ${requestData?.procurementMode === 'High Value Procurement' ? 'selected' : ''}>High Value Procurement</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Gentlemen Section -->
            <div class="form-group">
                <label class="form-label">Gentlemen:</label>
                <textarea class="form-textarea" 
                          placeholder="Please furnish this Office the following articles subject to the terms and conditions contained herein"
                          ${isReadOnly ? 'readonly' : ''}>${requestData?.gentlemen || ''}</textarea>
            </div>

            <!-- Delivery Information -->
            <div class="grid-2">
                <div class="space-y-4">
                    <div class="form-group">
                        <label class="form-label">Place of Delivery</label>
                        <input type="text" class="form-input" 
                               value="${requestData?.placeOfDelivery || ''}"
                               placeholder="Enter delivery place" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Date of Delivery</label>
                        <input type="text" class="form-input" 
                               value="${requestData?.deliveryDate || ''}"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="form-group">
                        <label class="form-label">Delivery Term</label>
                        <input type="text" class="form-input" 
                               value="${requestData?.deliveryTerm || ''}"
                               placeholder="Enter delivery term" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Payment Term</label>
                        <input type="text" class="form-input" 
                               value="${requestData?.paymentTerm || ''}"
                               placeholder="Enter payment term" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>
            </div>

            <!-- Items Section -->
            <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                    <label class="text-lg font-semibold">Items</label>
                    <div style="display: flex; gap: 8px;">
                        ${!isReadOnly ? `
                            <button class="btn btn-primary" onclick="addPOItem()">
                                <i data-lucide="plus" class="icon"></i>
                                Add Item
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="table-container">
                    <table class="table" id="po-items-table">
                        <thead>
                            <tr>
                                <th>Stock Property Number</th>
                                <th>Unit</th>
                                <th>Description</th>
                                <th>Detailed Description</th>
                                <th>Quantity</th>
                                <th>Unit Cost</th>
                                <th>Amount</th>
                                ${!isReadOnly ? '<th>Action</th>' : ''}
                            </tr>
                        </thead>
                        <tbody id="po-items-tbody"></tbody>
                        <tfoot>
                            <tr style="border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
                                <td colspan="${isReadOnly ? '6' : '7'}" style="text-align: right; font-weight: 600;">Grand Total:</td>
                                <td style="font-weight: 700; color: #dc2626;" id="grand-total">
                                    ${requestData ? formatCurrency(requestData.totalAmount || 0) : '₱0.00'}
                                </td>
                                ${!isReadOnly ? '<td></td>' : ''}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- ORS/BURS Information -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                <label style="font-size: 18px; font-weight: 600; color: #dc2626;">ORS/BURS Information</label>
                <div class="grid-3 mt-4">
                    <div class="form-group">
                        <label class="form-label">ORS/BURS No:</label>
                        <input type="text" class="form-input" 
                               value="${requestData?.orsNo || ''}"
                               placeholder="Part ORS/BURS number" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date of the ORS/BURS:</label>
                        <input type="date" class="form-input" 
                               value="${requestData?.orsDate || ''}"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Amount:</label>
                        <input type="text" class="form-input" 
                               value="${requestData?.orsAmount || ''}"
                               placeholder="₱0.00" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
            <button class="btn-secondary" onclick="closePurchaseOrderModal()">
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="savePurchaseOrder('${requestData?.id || ''}')">
                    ${mode === 'create' ? 'Create Purchase Order' : 'Update Purchase Order'}
                </button>
            ` : ''}
        </div>

    `;
}

// Purchase Order Modal item management
function initializePurchaseOrderModal(requestData = null) {
    if (requestData && requestData.items) {
        // load items from request
        AppState.purchaseOrderItems = requestData.items.map(item => ({ ...item }));
    } else {
        // reset for new order
        AppState.purchaseOrderItems = [{
            id: Date.now().toString(),
            stockPropertyNumber: '',
            unit: '',
            description: '',
            detailedDescription: '',
            quantity: 0,
            currentStock: 0,
            unitCost: 0,
            amount: 0
        }];
    }

    renderPOItems();
}


function addPOItem() {
    const newItem = {
        id: Date.now().toString(),
        stockPropertyNumber: '',
        unit: '',
        description: '',
        detailedDescription: '',
        quantity: 0,
        currentStock: 0,
        unitCost: 0,
        amount: 0
    };
    AppState.purchaseOrderItems.push(newItem);
    renderPOItems();
}

function removePOItem(id) {
    if (AppState.purchaseOrderItems.length > 1) {
        AppState.purchaseOrderItems = AppState.purchaseOrderItems.filter(item => item.id !== id);
        renderPOItems();
    }
}

function updatePOItem(id, field, value) {
    const itemIndex = AppState.purchaseOrderItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    const item = AppState.purchaseOrderItems[itemIndex];
    item[field] = value;

    // Auto-populate stock info when stock property number is entered
    if (field === 'stockPropertyNumber') {
        const stockItem = MockData.inventory.find(inv => inv.stockNumber === value);
        if (stockItem) {
            item.description = stockItem.name;
            item.unit = stockItem.unit;
            item.currentStock = stockItem.currentStock;
        }
    }

    // Calculate amount when quantity or unit cost changes
    if (field === 'quantity' || field === 'unitCost') {
        item.amount = item.quantity * item.unitCost;
    }

    AppState.purchaseOrderItems[itemIndex] = item;
    renderPOItems();
}

function renderPOItems() {
    const tbody = document.getElementById('po-items-tbody');
    const isReadOnly = AppState.currentModal?.mode === 'view';

    tbody.innerHTML = AppState.purchaseOrderItems.map(item => `
        <tr>
            <td style="padding: 12px;">
                <input type="text" 
                       value="${item.stockPropertyNumber}" 
                       onchange="updatePOItem('${item.id}', 'stockPropertyNumber', this.value)"
                       class="form-input" 
                       style="height: 32px;" 
                       placeholder="e.g., 1"
                       ${isReadOnly ? 'readonly' : ''}>
            </td>
            <td style="padding: 12px;">
                <input type="text" 
                       value="${item.unit}" 
                       onchange="updatePOItem('${item.id}', 'unit', this.value)"
                       class="form-input" 
                       style="height: 32px;" 
                       placeholder="Unit"
                       ${isReadOnly ? 'readonly' : ''}>
            </td>
            <td style="padding: 12px;">
                <input type="text" 
                       value="${item.description}" 
                       onchange="updatePOItem('${item.id}', 'description', this.value)"
                       class="form-input" 
                       style="height: 32px;" 
                       placeholder="Item name"
                       ${isReadOnly ? 'readonly' : ''}>
            </td>
            <td style="padding: 12px;">
                <textarea value="${item.detailedDescription}" 
                          onchange="updatePOItem('${item.id}', 'detailedDescription', this.value)"
                          class="form-textarea" 
                          style="height: 32px; min-height: 32px; resize: none;" 
                          placeholder="Detailed specifications..."
                          ${isReadOnly ? 'readonly' : ''}>${item.detailedDescription}</textarea>
            </td>
                <td style="padding: 12px;">
                <input type="number" 
                       value="${item.quantity || ''}" 
                       onchange="updatePOItem('${item.id}', 'quantity', parseFloat(this.value) || 0)"
                       class="form-input ${item.quantity > item.currentStock && item.currentStock > 0 ? 'border-red-300' : ''}" 
                       style="height: 32px;" 
                       placeholder="Qty"
                       ${isReadOnly ? 'readonly' : ''}>
            </td>
            <td style="padding: 12px;">
                <input type="number" 
                       step="0.01"
                       value="${item.unitCost || ''}" 
                       onchange="updatePOItem('${item.id}', 'unitCost', parseFloat(this.value) || 0)"
                       class="form-input" 
                       style="height: 32px;" 
                       placeholder="0.00"
                       ${isReadOnly ? 'readonly' : ''}>
            </td>
            <td style="padding: 12px; font-weight: 500;">${formatCurrency(item.amount)}</td>
            ${!isReadOnly ? `
                <td style="padding: 12px;">
                    <button onclick="removePOItem('${item.id}')" 
                            class="btn-outline-red" 
                            style="width: 32px; height: 32px; padding: 0;"
                            ${AppState.purchaseOrderItems.length === 1 ? 'disabled' : ''}>
                        <i data-lucide="trash-2" class="icon"></i>
                    </button>
                </td>
            ` : ''}
        </tr>
    `).join('');

    // Update grand total
    const grandTotal = AppState.purchaseOrderItems.reduce((total, item) => total + item.amount, 0);
    document.getElementById('grand-total').textContent = formatCurrency(grandTotal);

    // Reinitialize icons
    lucide.createIcons();
}

function updateStockSummary() {
    const summary = document.getElementById('stock-summary');
    const exceedingStock = AppState.purchaseOrderItems.filter(item => item.quantity > item.currentStock && item.currentStock > 0).length;
    const newItems = AppState.purchaseOrderItems.filter(item => item.currentStock === 0 && item.stockPropertyNumber).length;
    const totalQuantity = AppState.purchaseOrderItems.reduce((sum, item) => sum + item.quantity, 0);

    summary.innerHTML = `
        <div>
            <p style="font-size: 14px; color: #1e40af;">
                <span style="font-weight: 500;">Items Exceeding Stock:</span> ${exceedingStock}
            </p>
            <p style="font-size: 14px; color: #1e40af;">
                <span style="font-weight: 500;">New Items (No Current Stock):</span> ${newItems}
            </p>
        </div>
        <div>
            <p style="font-size: 14px; color: #1e40af;">
                <span style="font-weight: 500;">Total Items:</span> ${AppState.purchaseOrderItems.length}
            </p>
            <p style="font-size: 14px; color: #1e40af;">
                <span style="font-weight: 500;">Total Quantity Requested:</span> ${totalQuantity}
            </p>
        </div>
    `;
}

async function deleteRequest(requestId) {
    const ok = await showConfirm("Are you sure you want to delete this request?", 'Delete Request');
    if (!ok) return;

    // Remove from newRequests
    AppState.newRequests = AppState.newRequests.filter(r => r.id !== requestId);

    // If you want to handle other tables later:
    AppState.pendingRequests = AppState.pendingRequests.filter(r => r.id !== requestId);
    AppState.completedRequests = AppState.completedRequests.filter(r => r.id !== requestId);

    // Refresh table
    loadPageContent('new-request');
}



function generateNextRequestId() {
    const prefix = 'REQ-';
    // 1. Map all existing IDs
    const highestNum = AppState.newRequests
        .map(r => r.id)
        // 2. Filter for valid REQ-### format and parse the number
        .filter(id => id.startsWith(prefix) && id.length > prefix.length)
        .map(id => parseInt(id.substring(prefix.length)))
        .filter(num => !isNaN(num))
        // 3. Find the maximum number, defaulting to 0 if none exist
        .reduce((max, num) => Math.max(max, num), 0);

    const nextNum = highestNum + 1;
    // 4. Pad with leading zeros to ensure a length of 3 (e.g., 1 -> '001')
    return `${prefix}${String(nextNum).padStart(3, '0')}`;
}

/**
 * Generates a new P.O. Number in the format YYYY-MM-XXX.
 * The XXX part is a sequential count for the current month and year.
 * @returns {string} The new P.O. Number.
 */
function generateNewPONumber() {
    const now = new Date();
    const year = now.getFullYear();
    // Months are 0-indexed, so add 1 and pad (e.g., 9 -> '10')
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const datePrefix = `${year}-${month}`;

    // Count how many requests already exist for the current year/month
    const count = AppState.newRequests
        .filter(r => r.poNumber && r.poNumber.startsWith(datePrefix))
        .length;

    const nextCount = count + 1;
    const paddedCount = String(nextCount).padStart(3, '0');

    return `${datePrefix}-${paddedCount}`;
}

/**
 * Saves or updates a Purchase Order, implementing new structured ID and P.O. numbering.
 * @param {string | null} existingId - The ID of the request being updated, or null for a new request.
 */

function savePurchaseOrder(existingId = null) {
    const modal = document.getElementById('purchase-order-modal');

    // Retrieve input values
    const supplier = modal.querySelector('input[placeholder="Enter supplier name"]').value;
    const deliveryDate = modal.querySelector('input[type="date"]').value;
    // ✅ Use name="department" to select the value from the dropdown
    const department = modal.querySelector('select[name="department"]').value;
    const totalAmount = AppState.purchaseOrderItems.reduce((sum, item) => sum + item.amount, 0);

    let poNumber;
    if (existingId) {
        poNumber = modal.querySelector('input[placeholder="Enter P.O. number"]').value;
    } else {
        poNumber = generateNewPONumber();
        const poInput = modal.querySelector('input[placeholder="Enter P.O. number"]');
        if (poInput) poInput.value = poNumber;
    }


    if (existingId) {
        // Update existing request
        console.log(`[UPDATE] Updating Request ID: ${existingId}`);
        const idx = AppState.newRequests.findIndex(r => r.id === existingId);
        if (idx !== -1) {
            AppState.newRequests[idx] = {
                ...AppState.newRequests[idx],
                supplier,
                poNumber,
                deliveryDate,
                department, // Update department
                totalAmount,
                items: [...AppState.purchaseOrderItems]
            };
        }
    } else {
        // Create new request
        const newRequestId = generateNextRequestId();
        console.log(`[CREATE] Creating new Request ID: ${newRequestId}`);

        const newRequest = {
            id: newRequestId,
            poNumber,
            supplier,
            requestDate: new Date().toISOString().split('T')[0],
            deliveryDate,
            totalAmount,
            status: "submitted",
            requestedBy: "Current User",
            department, // Store department
            items: [...AppState.purchaseOrderItems]
        };
        AppState.newRequests.push(newRequest);
    }

    // Refresh UI and close modal
    loadPageContent('new-request');
    closePurchaseOrderModal();
    console.log("--- Current New Requests State ---", AppState.newRequests);
}


// Product Tab Functions
function switchProductTab(tabName) {
    AppState.currentProductTab = tabName;
    // Reset search and filters when switching tabs
    AppState.productSearchTerm = '';
    AppState.productSortBy = 'Sort By';
    AppState.productFilterBy = 'Filter By';
    loadPageContent('products');
}

// Page-specific event initialization
function initializePageEvents(pageId) {
    // Add page-specific event listeners here
    switch (pageId) {
        case 'products':
            initializeProductsPageEvents();
            break;
        case 'new-request':
        case 'pending-approval':
        case 'completed-request':
            // Initialize PO modal triggers
            break;
        default:
            break;
    }
}

function initializeProductsPageEvents() {
    // Initialize search functionality
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            AppState.productSearchTerm = e.target.value;
            updateProductsTable();
        });
    }

    // Initialize sort and filter dropdowns
    const sortBy = document.getElementById('sort-by');
    const filterBy = document.getElementById('filter-by');

    if (sortBy) {
        sortBy.addEventListener('change', function (e) {
            AppState.productSortBy = e.target.value;
            updateProductsTable();
        });
    }

    if (filterBy) {
        filterBy.addEventListener('change', function (e) {
            AppState.productFilterBy = e.target.value;
            updateProductsTable();
        });
    }

    // ...existing code...
}

function updateProductsTable() {
    const currentTab = AppState.currentProductTab || 'expendable';
    let filteredProducts = MockData.products.filter(product => product.type === currentTab.toLowerCase());

    // Apply search filter
    if (AppState.productSearchTerm) {
        const searchTerm = AppState.productSearchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.id.toLowerCase().includes(searchTerm)
        );
    }

    // Apply filter
    if (AppState.productFilterBy && AppState.productFilterBy !== 'Filter By') {
        switch (AppState.productFilterBy) {
            case 'High Value (>₱5,000)':
                filteredProducts = filteredProducts.filter(product => product.totalValue > 5000);
                break;
            case 'Medium Value (₱1,000-₱5,000)':
                filteredProducts = filteredProducts.filter(product => product.totalValue >= 1000 && product.totalValue <= 5000);
                break;
            case 'Low Value (<₱1,000)':
                filteredProducts = filteredProducts.filter(product => product.totalValue < 1000);
                break;
            case 'Low Quantity (<20)':
                filteredProducts = filteredProducts.filter(product => product.quantity < 20);
                break;
            case 'Recent (Last 30 days)':
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                filteredProducts = filteredProducts.filter(product => new Date(product.date) >= thirtyDaysAgo);
                break;
        }
    }

    // Apply sorting
    if (AppState.productSortBy && AppState.productSortBy !== 'Sort By') {
        switch (AppState.productSortBy) {
            case 'Product Name (A-Z)':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'Product Name (Z-A)':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'Date (Newest)':
                filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'Date (Oldest)':
                filteredProducts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'Total Value (High to Low)':
                filteredProducts.sort((a, b) => b.totalValue - a.totalValue);
                break;
            case 'Total Value (Low to High)':
                filteredProducts.sort((a, b) => a.totalValue - b.totalValue);
                break;
        }
    }

    // Update table body
    const tbody = document.querySelector('.table tbody');
    if (tbody) {
        tbody.innerHTML = filteredProducts.map((product, index) => {
            const isLow = (product.quantity || 0) <= (AppState.lowStockThreshold || 20);
            const rowBg = isLow ? 'background-color: #fff7f0;' : (index % 2 === 0 ? 'background-color: white;' : 'background-color: #f9fafb;');
            return `
            <tr style="${rowBg}">
                <td style="font-weight: 500;">${product.id}</td>
                <td style="font-weight: 500;">${product.name}</td>
                <td style="color: #6b7280; max-width: 300px;">${product.description}</td>
                <td>${product.quantity}</td>
                <td>${formatCurrency(product.unitCost)}</td>
                <td style="font-weight: 500;">${formatCurrency(product.totalValue)}</td>
                <td>${product.date}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-outline-red" title="Delete" style="width: 32px; height: 32px; padding: 0; border-radius: 4px;">
                            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                        </button>
                        <button class="btn-outline-orange" title="Edit" style="width: 32px; height: 32px; padding: 0; border-radius: 4px;">
                            <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `}).join('');

        // Update pagination count
        const paginationLeft = document.querySelector('.pagination-left');
        if (paginationLeft) {
            paginationLeft.textContent = `Showing 1 to ${filteredProducts.length}`;
        }

        // Reinitialize icons
        lucide.createIcons();
    }
}

// Action functions
function approveRequest(requestId) {
    console.log('Approving request:', requestId);

    // Find in newRequests first
    const idx = AppState.newRequests.findIndex(r => r.id === requestId);
    let request = null;
    if (idx !== -1) {
        request = AppState.newRequests[idx];
        // mark approved
        request.status = 'approved';
        request.approvedBy = 'Approver User';
        request.approvedDate = new Date().toISOString().split('T')[0];

        // Move to completedRequests
        AppState.completedRequests.push(request);
        AppState.newRequests.splice(idx, 1);
    } else {
        // try pendingRequests fallback
        const pidx = AppState.pendingRequests.findIndex(r => r.id === requestId);
        if (pidx !== -1) {
            request = AppState.pendingRequests[pidx];
            request.status = 'approved';
            request.approvedBy = 'Approver User';
            request.approvedDate = new Date().toISOString().split('T')[0];
            AppState.completedRequests.push(request);
            AppState.pendingRequests.splice(pidx, 1);
        }
    }

    if (request) {
        showAlert(`Request ${requestId} approved successfully!`, 'success');
    } else {
        showAlert(`Request ${requestId} not found.`, 'error');
    }

    // Refresh Pending Approval view
    loadPageContent('pending-approval');
}

async function rejectRequest(requestId) {
    console.log('Rejecting request:', requestId);
    const ok = await showConfirm(`Are you sure you want to reject request ${requestId}?`, 'Reject Request');
    if (!ok) return;

    // Try to find and mark rejected
    const idx = AppState.newRequests.findIndex(r => r.id === requestId);
    let request = null;
    if (idx !== -1) {
        request = AppState.newRequests[idx];
        request.status = 'rejected';
        request.rejectedBy = 'Approver User';
        request.rejectedDate = new Date().toISOString().split('T')[0];

        // Move to completedRequests for record keeping
        AppState.completedRequests.push(request);
        AppState.newRequests.splice(idx, 1);
    } else {
        const pidx = AppState.pendingRequests.findIndex(r => r.id === requestId);
        if (pidx !== -1) {
            request = AppState.pendingRequests[pidx];
            request.status = 'rejected';
            request.rejectedBy = 'Approver User';
            request.rejectedDate = new Date().toISOString().split('T')[0];
            AppState.completedRequests.push(request);
            AppState.pendingRequests.splice(pidx, 1);
        }
    }

    if (request) {
        showAlert(`Request ${requestId} rejected.`, 'warning');
    } else {
        showAlert(`Request ${requestId} not found.`, 'error');
    }

    loadPageContent('pending-approval');
}

function downloadPO(requestId) {
    console.log('Downloading PO for request:', requestId);
    showAlert(`Downloading PO for request ${requestId}...`, 'info');
}

async function archiveRequest(requestId) {
    console.log('Archiving request:', requestId);
    const ok = await showConfirm(`Are you sure you want to archive request ${requestId}?`, 'Archive Request');
    if (!ok) return;

    showAlert(`Request ${requestId} archived.`, 'success');
    loadPageContent(AppState.currentPage);
}

function openModal(type) {
    console.log('Opening modal for:', type);
    showAlert(`${type} modal not yet implemented`, 'info');
}

// Modal close on outside click
document.addEventListener('click', function (e) {
    const modal = document.getElementById('purchase-order-modal');
    if (e.target === modal) {
        closePurchaseOrderModal();
    }
});

// Make functions globally available
window.navigateToPage = navigateToPage;
window.switchProductTab = switchProductTab;
window.updateProductsTable = updateProductsTable;
window.openPurchaseOrderModal = openPurchaseOrderModal;
window.closePurchaseOrderModal = closePurchaseOrderModal;
window.addPOItem = addPOItem;
window.removePOItem = removePOItem;
window.updatePOItem = updatePOItem;
window.savePurchaseOrder = savePurchaseOrder;
window.approveRequest = approveRequest;
window.rejectRequest = rejectRequest;
window.downloadPO = downloadPO;
window.archiveRequest = archiveRequest;
window.openModal = openModal;

// -----------------------------
// User profile menu helpers
// -----------------------------
function toggleUserMenu(event) {
    const menu = document.getElementById('user-menu');
    if (!menu) return;
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function closeUserMenu() {
    const menu = document.getElementById('user-menu');
    if (menu) menu.style.display = 'none';
}

function logout() {
    // Basic logout behaviour: clear AppState.currentUser and navigate to a light landing page
    AppState.currentUser = {
        id: null,
        name: 'Guest',
        email: '',
        role: '',
        department: '',
        status: 'Inactive',
        created: ''
    };

    // Update avatar only (header no longer shows name/role)
    const avatarEl = document.getElementById('header-user-avatar');
    if (avatarEl) avatarEl.textContent = AppState.currentUser.name ? AppState.currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('') : '';

    closeUserMenu();
    showAlert('Logged out', 'info');

    // Optionally navigate to a non-protected landing or login page
    // For now, go to dashboard
    navigateToPage('dashboard');
}

// Close user menu on outside click
document.addEventListener('click', function (e) {
    const menu = document.getElementById('user-menu');
    const block = document.getElementById('header-user-block');
    if (!menu || !block) return;
    const menuDisplay = window.getComputedStyle(menu).display;
    if (menuDisplay === 'none') return;

    if (!menu.contains(e.target) && !block.contains(e.target)) {
        menu.style.display = 'none';
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();

    // Initialize icons
    lucide.createIcons();
});

// ------------------------ //
// Roles & Management Page  //
// ------------------------//

function generateRolesManagementPage() {
    // Sample data for initial load only
    const initialMembers = [
        { id: "SA001", group: "Group Juan", name: "Cherry Ann Quila", role: "Leader", email: "cherry@cnsc.edu.ph", department: "IT", status: "Active", created: "2024-01-15" },
        { id: "SA002", group: "Group Juan", name: "Vince Balce", role: "Member", email: "vince@cnsc.edu.ph", department: "Finance", status: "Inactive", created: "2024-02-01" },
        { id: "SA003", group: "Group Juan", name: "Marinel Ledesma", role: "Member", email: "marinel@cnsc.edu.ph", department: "HR", status: "Active", created: "2024-03-10" }
    ];

    // FIX: Only initialize MockData.users if it doesn't already exist.
    if (!window.MockData) window.MockData = {};
    if (!window.MockData.users) {
        window.MockData.users = initialMembers;
    }

    const membersToRender = window.MockData.users;

    const html = `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Roles & Management</h1>
                    <p class="page-subtitle">Manage groups, members, and their assigned roles</p>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="openUserModal('create')">
                        <i data-lucide="user-plus" class="icon"></i>
                        Add Member
                    </button>
                </div>
            </div>
        </div>

        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Member ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${membersToRender.map(member => `
                        <tr>
                            <td>${member.id}</td>
                            <td>${member.name}</td>
                            <td>${member.email}</td>
                            <td>
                                <span class="status-badge ${member.role.toLowerCase()}">${member.role}</span>
                            </td>
                            <td>${member.department}</td>
                            <td>
                                <span class="status-badge ${member.status === "Active" ? "green" : "red"}">
                                    ${member.status}
                                </span>
                            </td>
                            <td>${member.created}</td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn-outline-blue" title="View" onclick="openUserModal('view', '${member.id}')">
                                        <i data-lucide="eye" class="icon"></i>
                                    </button>
                                    <button class="btn-outline-orange" title="Edit" onclick="openUserModal('edit', '${member.id}')">
                                        <i data-lucide="edit" class="icon"></i>
                                    </button>
                                    <button class="btn-outline-red" title="Delete" onclick="deleteMember('${member.id}')">
                                        <i data-lucide="trash-2" class="icon"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;

    // Ensure icons render
    setTimeout(() => {
        if (window.lucide) lucide.createIcons();
    }, 0);

    return html;
}

function saveUser(userId) {
    // 1. Get elements by their IDs
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const roleInput = document.getElementById('userRole');
    const departmentInput = document.getElementById('userDepartment');
    const statusInput = document.getElementById('userStatus');
    const createdInput = document.getElementById('userCreated');

    // 2. Gather form data
    const userData = {
        name: nameInput ? nameInput.value : '',
        email: emailInput ? emailInput.value : '',
        role: roleInput ? roleInput.value : '',
        department: departmentInput ? departmentInput.value : '',
        status: statusInput ? statusInput.value : 'Active',
        created: createdInput ? (createdInput.value || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]
    };

    if (!userId) {
        // --- CREATE NEW USER ---
        if (!window.MockData) window.MockData = {};
        if (!window.MockData.users) window.MockData.users = [];

        // Robust ID generation
        const maxIdNum = window.MockData.users
            .map(u => parseInt(String(u.id).replace(/\D/g, ''), 10))
            .filter(n => !isNaN(n))
            .reduce((max, current) => Math.max(max, current), 0);

        const newIdNumber = maxIdNum + 1;

        const newUser = {
            id: `SA${String(newIdNumber).padStart(3, '0')}`,
            group: "New Group",
            ...userData
        };

        window.MockData.users.push(newUser);
    } else if (userId === 'current') {
        // Update AppState.currentUser
        AppState.currentUser = {
            ...AppState.currentUser,
            ...userData
        };

        // Also update MockData user if exists
        if (window.MockData && Array.isArray(window.MockData.users)) {
            const idx = window.MockData.users.findIndex(u => u.id === AppState.currentUser.id);
            if (idx !== -1) {
                window.MockData.users[idx] = { ...window.MockData.users[idx], ...AppState.currentUser };
            }
        }

        // Update avatar only (header no longer shows name/role)
        const avatarEl = document.getElementById('header-user-avatar');
        if (avatarEl) avatarEl.textContent = AppState.currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('');
    } else {
        // --- UPDATE EXISTING USER (EDIT) ---
        const existing = window.MockData.users.find(u => u.id === userId);
        if (existing) {
            Object.assign(existing, userData);
        }
    }

    closeUserModal();
    refreshRolesTable(); // Refresh the table to reflect changes
}

/**
 * REVISED: Delete member using the new table refresh function.
 */
async function deleteMember(memberId) {
    const ok = await showConfirm("Are you sure you want to delete this member?", 'Delete Member');
    if (!ok) return;
    window.MockData.users = window.MockData.users.filter(u => u.id !== memberId);
    refreshRolesTable(); // Refresh the table to reflect deletion
}



function refreshRolesTable() {
    // Assuming your main content container has the ID 'main-content'
    const mainContentArea = document.getElementById('main-content');

    if (mainContentArea) {
        // Regenerate the entire page HTML using the updated MockData.users
        const newPageHTML = generateRolesManagementPage();

        mainContentArea.innerHTML = newPageHTML;

        // Ensure icons are re-rendered
        setTimeout(() => {
            if (window.lucide) lucide.createIcons();
        }, 0);
    }
}

function openUserModal(mode = 'view', userId = null) {
    const modal = document.getElementById('user-modal');
    const modalContent = modal.querySelector('.modal-content');

    let userData = null;
    if (userId === 'current') {
        userData = AppState.currentUser;
    } else if (userId && window.MockData && window.MockData.users) {
        // Find user data for 'edit' or 'view' mode
        userData = window.MockData.users.find(u => u.id === userId);
    }

    modalContent.innerHTML = generateUserModal(mode, userData);
    modal.classList.add('active');

    if (window.lucide) lucide.createIcons();
}


function closeUserModal() {
    const modal = document.getElementById('user-modal');
    modal.classList.remove('active');
}

// Your existing generateUserModal (included for context)
function generateUserModal(mode = 'view', userData = null) {
    const title = mode === 'create' ? 'ADD NEW USER' :
        mode === 'edit' ? 'EDIT USER' :
            'USER DETAILS';

    const isReadOnly = mode === 'view';

    return `
        <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="modal-close" onclick="closeUserModal()">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body space-y-6">
            <div class="form-group">
                <label class="form-label">Name</label>
                <input type="text" class="form-input" id="userName"
                       value="${userData?.name || ''}"
                       placeholder="Enter full name"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>

            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="userEmail"
                       value="${userData?.email || ''}"
                       placeholder="Enter email"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>

            <div class="form-group">
                <label class="form-label">Role</label>
                <input type="text" class="form-input" id="userRole"
                       value="${userData?.role || ''}"
                       placeholder="Enter role"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>

            <div class="form-group">
                <label class="form-label">Department</label>
                <input type="text" class="form-input" id="userDepartment"
                       value="${userData?.department || ''}"
                       placeholder="Enter department"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>

            <div class="form-group">
                <label class="form-label">Status</label>
                ${isReadOnly
            ? `<span class="status-badge ${userData?.status === 'Active' ? 'green' : 'red'}">${userData?.status || 'Inactive'}</span>`
            : `
                        <select class="form-select" id="userStatus">
                            <option ${userData?.status === 'Active' ? 'selected' : ''}>Active</option>
                            <option ${userData?.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    `
        }
            </div>

            <div class="form-group">
                <label class="form-label">Created</label>
                <input type="date" class="form-input" id="userCreated"
                       value="${userData?.created || ''}"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn-secondary" onclick="closeUserModal()">
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="saveUser('${userData?.id || ''}')">
                    ${mode === 'create' ? 'Add User' : 'Update User'}
                </button>
            ` : ''}
        </div>
    `;
}


// ------------------------- //
//   Users Management Page  //
// ------------------------- //

function generateUsersManagementPage() {
    // sample user data
    const users = [
        { name: "John Doe", email: "john@cnsc.edu.ph", role: "Admin", department: "IT", status: "Active", created: "2024-01-15" },
        { name: "Jane Smith", email: "jane@cnsc.edu.ph", role: "Manager", department: "Procurement", status: "Active", created: "2024-01-10" },
        { name: "Bob Johnson", email: "bob@cnsc.edu.ph", role: "User", department: "Finance", status: "Inactive", created: "2024-01-05" },
        { name: "Alice Brown", email: "alice@cnsc.edu.ph", role: "User", department: "HR", status: "Active", created: "2024-01-12" }
    ];

    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">User Management</h1>
                    <p class="page-subtitle">Monitor and manage system users</p>
                </div>
            </div>
        </div>

        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>${user.department}</td>
                            <td>
                                <span class="status-badge ${user.status.toLowerCase()}">${user.status}</span>
                            </td>
                            <td>${user.created}</td>
                        </tr>
                    `).join("")}

                </tbody>
            </table>
        </div>
    `;
}

// ----------------------------- //
// About Us Page               //
// ----------------------------- //
function generateAboutPage() {
    const currentYear = new Date().getFullYear();
    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">About Us</h1>
                    <p class="page-subtitle">Learn more about the SPMO System and the team behind it</p>
                </div>
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="text-align:right;color:#6b7280;font-size:14px;">Updated: ${currentYear}</div>
                </div>
            </div>
        </div>

        <div class="page-content">
            <div class="card">
                <h2 style="margin-top:0;">Our Mission</h2>
                <p style="color:#374151;line-height:1.6;">The SPMO (Stock & Procurement Management Office) System is designed to streamline inventory, requisition, and procurement workflows for educational institutions. Our mission is to provide a reliable, easy-to-use platform that improves transparency, reduces manual work, and helps departments manage resources effectively.</p>
            </div>

            <div class="card" style="margin-top:16px;">
                <h2 style="margin-top:0;">What We Do</h2>
                <ul style="color:#374151;line-height:1.6;">
                    <li>Centralize inventory and stock management</li>
                    <li>Automate purchase order creation and tracking</li>
                    <li>Generate reports for audits and planning</li>
                </ul>
            </div>

            <div class="card" style="margin-top:16px;">
                <h2 style="margin-top:0;">Contact & Support</h2>
                <p style="color:#374151;line-height:1.6;">For questions, feature requests or to report issues, please contact the System Administrator:</p>
                <p style="margin:0;font-weight:600;color:#111827;">Camarines Norte State College - SPMO</p>
                <p style="margin:0;color:#6b7280;">Email: it-support@cnsc.edu.ph</p>
                <p style="margin:0;color:#6b7280;">Phone: (054) 123-4567</p>
            </div>

            <div class="card" style="margin-top:16px;">
                <h2 style="margin-top:0;">The Team</h2>
                <div class="grid-3" style="gap:12px;">
                    <div style="padding:12px;border-radius:6px;background:#fff;border:1px solid #eef2f7;">
                        <p style="margin:0;font-weight:600;">Project Lead</p>
                        <p style="margin:0;color:#6b7280;">Cherry Ann Quila</p>
                    </div>
                    <div style="padding:12px;border-radius:6px;background:#fff;border:1px solid #eef2f7;">
                        <p style="margin:0;font-weight:600;">Developer</p>
                        <p style="margin:0;color:#6b7280;">Vince Balce</p>
                    </div>
                    <div style="padding:12px;border-radius:6px;background:#fff;border:1px solid #eef2f7;">
                        <p style="margin:0;font-weight:600;">QA / Documentation</p>
                        <p style="margin:0;color:#6b7280;">Marinel Ledesma</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// -----------------------------//
// Add Product Modal and Functions //
// -----------------------------//

function openProductModal(mode = 'create', productId = null) {
    const modal = document.getElementById('product-modal');
    const modalContent = modal.querySelector('.modal-content');

    AppState.currentModal = { mode, productId };

    // Load product data if editing or viewing
    let productData = null;
    if (productId) {
        productData = MockData.products.find(p => p.id === productId);
    }

    modalContent.innerHTML = generateProductModal(mode, productData);
    modal.classList.add('active');

    lucide.createIcons();
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    AppState.currentModal = null;
}

function saveProduct(productId) {
    const modal = document.getElementById('product-modal');
    const name = modal.querySelector('input[type="text"]').value.trim();
    const category = modal.querySelector('select.form-select').value;
    const description = modal.querySelector('textarea').value.trim();
    const unitCost = parseFloat(modal.querySelector('input[type="number"]').value) || 0;
    const quantity = parseInt(modal.querySelectorAll('input[type="number"]')[1].value) || 0;
    const date = modal.querySelector('input[type="date"]').value || new Date().toISOString().slice(0, 10);

    if (!name) { showAlert('Product name is required', 'error'); return; }

    const totalValue = unitCost * quantity;

    if (!productId) {
        // generate id based on category prefix
        const prefix = category === 'expendable' ? 'E' : (category === 'semi-expendable' ? 'SE' : 'N');
        const nextIndex = MockData.products.length + 1;
        const padded = String(nextIndex).padStart(3, '0');
        const newId = `${prefix}${padded}`;

        const newProduct = { id: newId, name, description, quantity, unitCost, totalValue, date, type: category };
        MockData.products.push(newProduct);
    } else {
        const existing = MockData.products.find(p => p.id === productId);
        if (existing) {
            existing.name = name;
            existing.description = description;
            existing.unitCost = unitCost;
            existing.quantity = quantity;
            existing.totalValue = totalValue;
            existing.date = date;
            existing.type = category;
        }
    }

    closeProductModal();
    loadPageContent('products'); // refresh list
}

async function deleteProduct(productId) {
    const ok = await showConfirm('Delete this product?', 'Delete Product');
    if (!ok) return;
    MockData.products = MockData.products.filter(p => p.id !== productId);
    loadPageContent('products');
}

function generateProductModal(mode = 'create', productData = null) {
    const title = mode === 'create' ? 'ADD NEW PRODUCT' : 'PRODUCT DETAILS';
    const isReadOnly = mode === 'view';

    return `
        <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <p class="modal-subtitle">Manage Inventory</p>
            <button class="modal-close" onclick="closeProductModal()">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body space-y-6">
            <!-- Basic Product Info -->
            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Product Name</label>
                    <input type="text" class="form-input"
                           value="${productData?.name || ''}"
                           placeholder="Enter product name"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>

                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" ${isReadOnly ? 'disabled' : ''}>
                        <option value="">Select category</option>
                        <option value="expendable" ${productData?.type === 'expendable' ? 'selected' : ''}>Expendable</option>
                        <option value="semi-expendable" ${productData?.type === 'semi-expendable' ? 'selected' : ''}>Semi-Expendable</option>
                        <option value="non-expendable" ${productData?.type === 'non-expendable' ? 'selected' : ''}>Non-Expendable</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea"
                          placeholder="Enter description"
                          ${isReadOnly ? 'readonly' : ''}>${productData?.description || ''}</textarea>
            </div>

            <!-- Pricing & Quantity -->
            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Unit Cost</label>
                    <input type="number" class="form-input"
                           step="0.01" min="0"
                           value="${productData?.unitCost || ''}"
                           placeholder="Enter unit cost"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>

                <div class="form-group">
                    <label class="form-label">Quantity</label>
                    <input type="number" class="form-input"
                           min="1"
                           value="${productData?.quantity || ''}"
                           placeholder="Enter quantity"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-input"
                           value="${productData?.date || ''}"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>

                <div class="form-group">
                    <label class="form-label">Total Value</label>
                    <input type="text" class="form-input"
                           value="${productData ? formatCurrency(productData.totalValue || 0) : '₱0.00'}"
                           readonly>
                </div>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
            <button class="btn-secondary" onclick="closeProductModal()">
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="saveProduct('${productData?.id || ''}')">
                    ${mode === 'create' ? 'Add Product' : 'Update Product'}
                </button>
            ` : ''}
        </div>
    `;
}

// -----------------------------//
// Category Modal and Functions //
// -----------------------------//

function openCategoryModal(mode = 'create', categoryId = null) {
    const modal = document.getElementById('category-modal');
    const modalContent = modal.querySelector('.modal-content');

    let categoryData = null;
    if (categoryId) {
        categoryData = MockData.categories.find(c => c.id === categoryId);
    }

    modalContent.innerHTML = generateCategoryModal(mode, categoryData);
    modal.classList.add('active');

    lucide.createIcons();
}

function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    modal.classList.remove('active');
}


// Open the Category Modal
function generateCategoryModal(mode = 'create', categoryData = null) {
    const title = mode === 'create' ? 'ADD NEW CATEGORY' : 'CATEGORY DETAILS';
    const isReadOnly = mode === 'view';

    return `
        <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="modal-close" onclick="closeCategoryModal()">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body space-y-6">
            <div class="form-group">
                <label class="form-label">Category Name</label>
                <input type="text" class="form-input"
                       value="${categoryData?.name || ''}"
                       placeholder="Enter category name"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>

            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea"
                          placeholder="Enter description"
                          ${isReadOnly ? 'readonly' : ''}>${categoryData?.description || ''}</textarea>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn-secondary" onclick="closeCategoryModal()">
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="saveCategory('${categoryData?.id || ''}')">
                    ${mode === 'create' ? 'Add Category' : 'Update Category'}
                </button>
            ` : ''}
        </div>
    `;
}

function saveCategory(categoryId) {
    // Grab input values
    const modal = document.getElementById('category-modal');
    const name = modal.querySelector('input').value;
    const description = modal.querySelector('textarea').value;

    // Basic validation
    if (!name || name.trim().length < 2) {
        showAlert('Please enter a valid category name (at least 2 characters).', 'error');
        return;
    }

    if (!categoryId) {
        // Create new: generate padded ID like C001
        const nextIndex = MockData.categories.length + 1;
        const padded = String(nextIndex).padStart(3, '0');
        const newCategory = {
            id: `C${padded}`,
            name: name.trim(),
            description: description.trim()
        };
        MockData.categories.push(newCategory);
    } else {
        // Update existing
        const existing = MockData.categories.find(c => c.id === categoryId);
        if (existing) {
            existing.name = name.trim();
            existing.description = description.trim();
        }
    }

    closeCategoryModal();
    loadPageContent('categories'); // refresh table/page
}

async function deleteCategory(categoryId) {
    const ok = await showConfirm('Delete this category? This action cannot be undone.', 'Delete Category');
    if (!ok) return;
    MockData.categories = MockData.categories.filter(c => c.id !== categoryId);
    loadPageContent('categories');
}



// -----------------------------//
// Stock In Modal and Functions //
// -----------------------------//

function openStockInModal(mode = 'create', stockId = null) {
    const modal = document.getElementById('stockin-modal');
    const modalContent = modal.querySelector('.modal-content');

    let stockData = null;
    if (stockId && mode === 'edit') {
        stockData = stockInData.find(r => r.id === stockId);
    }

    modalContent.innerHTML = generateStockInModal(mode, stockData);
    modal.classList.add('active');
    lucide.createIcons();

    const isReadOnly = mode === 'view';
    if (!isReadOnly) {
        const qtyInput = document.getElementById('qty-input');
        const ucInput = document.getElementById('uc-input');
        const totalInput = document.getElementById('total-input');

        function updateTotal() {
            const q = parseFloat(qtyInput.value) || 0;
            const u = parseFloat(ucInput.value) || 0;
            totalInput.value = formatCurrency(q * u);
        }

        qtyInput.addEventListener('input', updateTotal);
        ucInput.addEventListener('input', updateTotal);
        updateTotal();
    }
}

function closeStockInModal() {
    const modal = document.getElementById('stockin-modal');
    modal.classList.remove('active');
}

function generateStockInModal(mode = 'create', stockData = null) {
    const title = mode === 'create' ? 'STOCK IN' : 'STOCK IN DETAILS';
    const isReadOnly = mode === 'view';
    const dateValue = stockData?.date || (mode === 'create' ? new Date().toISOString().split('T')[0] : '');
    const unitCostValue = (stockData?.unitCost || 0).toFixed(2);
    const totalValue = stockData ? formatCurrency(stockData.totalCost || 0) : formatCurrency(0);

    return `
        <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="modal-close" onclick="closeStockInModal()">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body space-y-6">
            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-input" id="date-input"
                           value="${dateValue}"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
                <div class="form-group">
                    <label class="form-label">SKU</label>
                    <input type="text" class="form-input" id="sku-input"
                           value="${stockData?.sku || ''}"
                           placeholder="E001"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Product Name</label>
                <input type="text" class="form-input" id="product-input"
                       value="${stockData?.productName || ''}"
                       placeholder="Enter product name"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Quantity</label>
                    <input type="number" class="form-input" id="qty-input"
                           min="1"
                           value="${stockData?.quantity || ''}"
                           placeholder="Enter quantity"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
                <div class="form-group">
                    <label class="form-label">Unit Cost</label>
                    <input type="number" class="form-input" id="uc-input"
                           step="0.01" min="0"
                           value="${unitCostValue}"
                           placeholder="0.00"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Total Cost</label>
                <input type="text" class="form-input" id="total-input"
                       value="${totalValue}"
                       readonly>
            </div>

            <div class="form-group">
                <label class="form-label">Supplier</label>
                <input type="text" class="form-input" id="supplier-input"
                       value="${stockData?.supplier || ''}"
                       placeholder="Enter supplier name"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>

            <div class="form-group">
                <label class="form-label">Received By</label>
                <input type="text" class="form-input" id="receivedby-input"
                       value="${stockData?.receivedBy || ''}"
                       placeholder="Enter receiver name"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn-secondary" onclick="closeStockInModal()">
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="saveStockIn('${stockData?.id || ''}')">
                    ${mode === 'create' ? 'Add Stock In' : 'Update Stock In'}
                </button>
            ` : ''}
        </div>
    `;
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function saveStockIn(stockId) {
    const date = document.getElementById('date-input').value;
    const sku = document.getElementById('sku-input').value;
    const productName = document.getElementById('product-input').value;
    const quantity = parseInt(document.getElementById('qty-input').value) || 0;
    const unitCost = parseFloat(document.getElementById('uc-input').value) || 0;
    const totalCost = quantity * unitCost;
    const supplier = document.getElementById('supplier-input').value;
    const receivedBy = document.getElementById('receivedby-input').value;

    const newRecord = {
        id: stockId || generateUniqueId(),
        date,
        productName,
        sku,
        quantity,
        unitCost,
        totalCost,
        supplier,
        receivedBy
    };

    if (stockId) {
        const index = stockInData.findIndex(r => r.id === stockId);
        if (index !== -1) {
            newRecord.transactionId = stockInData[index].transactionId;
            stockInData[index] = newRecord;
        }
    } else {
        newRecord.transactionId = generateTransactionId();
        stockInData.push(newRecord);
    }

    console.log("Saving stock-in record:", newRecord);

    closeStockInModal();
    loadPageContent('stock-in'); // refresh stock-in page
}

async function deleteStockIn(id) {
    const ok = await showConfirm('Are you sure you want to delete this stock in record?', 'Delete Stock In');
    if (!ok) return;
    stockInData = stockInData.filter(r => r.id !== id);
    loadPageContent('stock-in');
}

function renderStockInRows() {
    if (!stockInData || stockInData.length === 0) return '<tr><td colspan="10">No records found</td></tr>';
    return stockInData.map((r, i) => renderStockInRow(r, i)).join('');
}

function renderStockInRow(r, index) {
    return `
        <tr data-id="${r.id}" style="${index % 2 === 0 ? 'background-color: white;' : 'background-color: #f9fafb;'}">
            <td style="font-weight: 500;">${r.transactionId}</td>
            <td>${r.date}</td>
            <td style="font-weight: 500;">${r.productName}</td>
            <td style="color: #6b7280;">${r.sku}</td>
            <td>${r.quantity}</td>
            <td>${formatCurrency(Number(r.unitCost) || 0)}</td>
            <td style="font-weight: 500;">${formatCurrency(Number(r.totalCost) || 0)}</td>
            <td style="color: #6b7280;">${r.supplier}</td>
            <td style="color: #6b7280;">${r.receivedBy}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-outline-red" title="Delete" style="width: 32px; height: 32px; padding: 0; border-radius: 4px;" onclick="deleteStockIn('${r.id}')">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                    <button class="btn-outline-orange" title="Edit" style="width: 32px; height: 32px; padding: 0; border-radius: 4px;" onclick="openStockInModal('edit','${r.id}')">
                        <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function generateTransactionId() {
    const year = new Date().getFullYear();
    const existingNums = stockInData
        .filter(r => r.transactionId.startsWith(`SI-${year}-`))
        .map(r => parseInt(r.transactionId.split('-')[2]) || 0);
    const nextNum = Math.max(...existingNums, 0) + 1;
    return `SI-${year}-${nextNum.toString().padStart(3, '0')}`;
}

// -----------------------------//
// Stock Out Modal and Functions //
// -----------------------------//

function openStockOutModal(mode = 'create', stockId = null) {
    const modal = document.getElementById('stockout-modal');
    const modalContent = modal.querySelector('.modal-content');

    let stockData = null;
    if (stockId) {
        // support passing either an id or the full record
        stockData = stockOutData.find(r => r.id === stockId) || (typeof stockId === 'object' ? stockId : null);
    }

    modalContent.innerHTML = generateStockOutModal(mode, stockData);
    modal.classList.add('active');
    lucide.createIcons();

    const isReadOnly = mode === 'view';
    if (!isReadOnly) {
        const qty = modal.querySelector('#so-qty');
        const uc = modal.querySelector('#so-uc');
        const total = modal.querySelector('#so-total');

        function updateTotal() {
            const q = parseFloat(qty.value) || 0;
            const u = parseFloat(uc.value) || 0;
            total.value = formatCurrency(q * u);
        }

        if (qty && uc && total) {
            qty.addEventListener('input', updateTotal);
            uc.addEventListener('input', updateTotal);
            updateTotal();
        }
    }
}

function closeStockOutModal() {
    const modal = document.getElementById('stockout-modal');
    modal.classList.remove('active');
}

function generateStockOutModal(mode = 'create', stockData = null) {
    const title = mode === 'create' ? 'STOCK OUT' : 'STOCK OUT DETAILS';
    const isReadOnly = mode === 'view';

    return `
        <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="modal-close" onclick="closeStockOutModal()">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body space-y-6">
            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input id="so-date" type="date" class="form-input"
                           value="${stockData?.date || ''}"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
                <div class="form-group">
                    <label class="form-label">SKU</label>
                    <input id="so-sku" type="text" class="form-input"
                           value="${stockData?.sku || ''}"
                           placeholder="E002"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Product Name</label>
                <input id="so-product" type="text" class="form-input"
                       value="${stockData?.productName || ''}"
                       placeholder="Enter product name"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Quantity</label>
                    <input id="so-qty" type="number" class="form-input"
                           min="1"
                           value="${stockData?.quantity || ''}"
                           placeholder="Enter quantity"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
                <div class="form-group">
                    <label class="form-label">Unit Cost</label>
                    <input id="so-uc" type="number" class="form-input"
                           step="0.01" min="0"
                           value="${stockData?.unitCost || ''}"
                           placeholder="₱0.00"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Total Cost</label>
                <input id="so-total" type="text" class="form-input"
                       value="${stockData ? formatCurrency(stockData.totalCost || 0) : '₱0.00'}"
                       readonly>
            </div>

            <div class="form-group">
                <label class="form-label">Department</label>
                <input id="so-dept" type="text" class="form-input"
                       value="${stockData?.department || ''}"
                       placeholder="Enter department"
                       ${isReadOnly ? 'readonly' : ''}>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Issued To</label>
                    <input id="so-issued-to" type="text" class="form-input"
                           value="${stockData?.issuedTo || ''}"
                           placeholder="Employee / Person"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
                <div class="form-group">
                    <label class="form-label">Issued By</label>
                    <input id="so-issued-by" type="text" class="form-input"
                           value="${stockData?.issuedBy || ''}"
                           placeholder="Staff / Officer"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Status</label>
                <select id="so-status" class="form-select" ${isReadOnly ? 'disabled' : ''}>
                    <option value="">Select status</option>
                    <option value="Completed" ${stockData?.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Pending" ${stockData?.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Cancelled" ${stockData?.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn-secondary" onclick="closeStockOutModal()">
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="saveStockOut('${stockData?.id || ''}')">
                    ${mode === 'create' ? 'Add Stock Out' : 'Update Stock Out'}
                </button>
            ` : ''}
        </div>
    `;
}

function saveStockOut(stockId) {
    // Read inputs by ID
    const date = document.getElementById('so-date') ? document.getElementById('so-date').value : (document.querySelector('#stockout-modal input[type="date"]')?.value || '');
    const sku = document.getElementById('so-sku') ? document.getElementById('so-sku').value : (document.querySelector('#stockout-modal input[placeholder="E002"]')?.value || '');
    const productName = document.getElementById('so-product') ? document.getElementById('so-product').value : (document.querySelector('#stockout-modal input[placeholder="Enter product name"]')?.value || '');
    const quantity = parseInt(document.getElementById('so-qty').value) || 0;
    const unitCost = parseFloat(document.getElementById('so-uc').value) || 0;
    const totalCost = quantity * unitCost;
    const department = document.getElementById('so-dept').value || '';
    const issuedTo = document.getElementById('so-issued-to').value || '';
    const issuedBy = document.getElementById('so-issued-by').value || '';
    const status = document.getElementById('so-status').value || '';

    const record = {
        id: stockId || generateUniqueId(),
        issueId: stockId ? (stockOutData.find(s => s.id === stockId)?.issueId || generateStockOutIssueId()) : generateStockOutIssueId(),
        date,
        productName,
        sku,
        quantity,
        unitCost,
        totalCost,
        department,
        issuedTo,
        issuedBy,
        status
    };

    if (stockId) {
        const idx = stockOutData.findIndex(s => s.id === stockId);
        if (idx !== -1) {
            stockOutData[idx] = record;
        } else {
            stockOutData.push(record);
        }
    } else {
        stockOutData.push(record);
    }

    // Update DOM if Stock Out table is present to avoid full page reload
    const tbody = document.getElementById('stock-out-table-body');
    if (tbody) {
        const existingRow = tbody.querySelector(`tr[data-id="${record.id}"]`);
        if (existingRow) {
            // replace existing row
            existingRow.outerHTML = renderStockOutRow(record);
        } else {
            // append new row
            tbody.insertAdjacentHTML('beforeend', renderStockOutRow(record));
        }
        // re-render icons in new content
        if (window.lucide) lucide.createIcons();
    } else {
        // If tbody not present (different view), reload the Stock Out page to reflect changes
        loadPageContent('stock-out');
    }
    closeStockOutModal();
}

// In-memory stock-out records (initialize from MockData if available)
var stockOutData = (window.MockData && Array.isArray(window.MockData.stockOut)) ? window.MockData.stockOut.slice() : [
    // sample entry kept minimal
    { id: generateUniqueId(), issueId: 'SO-2025-001', date: '2025-01-16', productName: 'Ballpoint Pen', sku: 'E002', quantity: 50, unitCost: 15.0, totalCost: 750.0, department: 'Administration', issuedTo: 'Jane Smith', issuedBy: 'John Doe', status: 'Completed' }
];

function renderStockOutRows() {
    if (!stockOutData || stockOutData.length === 0) return '<tr><td colspan="12">No records found</td></tr>';
    return stockOutData.map(s => renderStockOutRow(s)).join('');
}

function renderStockOutRow(s) {
    return `
        <tr data-id="${s.id}">
            <td class="font-semibold">${s.issueId}</td>
            <td>${s.date}</td>
            <td>${s.productName}</td>
            <td class="text-sm text-gray-600">${s.sku}</td>
            <td>${s.quantity}</td>
            <td>${formatCurrency(Number(s.unitCost) || 0)}</td>
            <td class="font-semibold">${formatCurrency(Number(s.totalCost) || 0)}</td>
            <td><span class="badge">${s.department}</span></td>
            <td>${s.issuedTo}</td>
            <td>${s.issuedBy}</td>
            <td><span class="badge ${s.status === 'Completed' ? 'green' : s.status === 'Pending' ? 'yellow' : s.status === 'Cancelled' ? 'red' : ''}">${s.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-outline-blue" title="View Details" onclick="viewStockOutDetails('${s.id}')">
                        <i data-lucide="eye" class="icon"></i>
                    </button>
                    <button class="btn-outline-orange" title="Edit" onclick="editStockOut('${s.id}')">
                        <i data-lucide="edit" class="icon"></i>
                    </button>
                    <button class="btn-outline-red" title="Delete" onclick="deleteStockOut('${s.id}')">
                        <i data-lucide="trash-2" class="icon"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

async function deleteStockOut(id) {
    const ok = await showConfirm('Delete this stock-out record?', 'Delete Stock Out');
    if (!ok) return;
    stockOutData = stockOutData.filter(s => s.id !== id);
    loadPageContent('stock-out');
}

function viewStockOutDetails(id) {
    const rec = stockOutData.find(s => s.id === id);
    if (!rec) { showAlert('Record not found', 'error'); return; }
    openStockOutModal('view', rec);
}

function editStockOut(id) {
    const rec = stockOutData.find(s => s.id === id);
    if (!rec) { showAlert('Record not found', 'error'); return; }
    openStockOutModal('edit', rec);
}

function generateStockOutIssueId() {
    const year = new Date().getFullYear();
    const existing = stockOutData.filter(r => r.issueId && r.issueId.startsWith(`SO-${year}-`)).map(r => parseInt(r.issueId.split('-')[2]) || 0);
    const next = Math.max(...existing, 0) + 1;
    return `SO-${year}-${String(next).padStart(3, '0')}`;
}

// ===== STATUS MANAGEMENT =====
function initStatusManagement(filter = "all") {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // ✅ Render UI
    mainContent.innerHTML = `
        <div class="status-container">
            <!-- Cards -->
            <div class="status-cards">
                <div class="status-card received" data-status="received">
                    <h3>Received</h3>
                    <div class="count">2</div>
                    <p>Awaiting processing</p>
                </div>
                <div class="status-card finished" data-status="finished">
                    <h3>Finished</h3>
                    <div class="count">1</div>
                    <p>Successfully completed</p>
                </div>
                <div class="status-card cancelled" data-status="cancelled">
                    <h3>Cancelled</h3>
                    <div class="count">1</div>
                    <p>Request withdrawn</p>
                </div>
                <div class="status-card rejected" data-status="rejected">
                    <h3>Rejected</h3>
                    <div class="count">1</div>
                    <p>Request denied</p>
                </div>
            </div>

            <!-- Header -->
            <div class="status-header">
                <div>
                    <h2>Status Management</h2>
                    <p>Track and manage request statuses across all departments</p>
                </div>
                <div class="actions">
                    <button class="btn-export">Export</button>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters">
                <input type="text" id="searchInput" placeholder="Search by Requester, ID, or Item">
                <input type="text" id="deptInput" placeholder="Filter by Department">
                <select id="deptSelect">
                    <option>All Department</option>
                    <option>IT Department</option>
                    <option>HR Department</option>
                    <option>Finance Department</option>
                    <option>Marketing Department</option>
                    <option>Operations</option>
                </select>
                <select id="prioritySelect">
                    <option>Filter by Priority</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>
\            </div>

            <!-- Table -->
            <table class="request-table">
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Requester</th>
                        <th>Department</th>
                        <th>Item</th>
                        <th>Priority</th>
                        <th>Date Updated</th>
                        <th>Action</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody id="status-table-body">
                    ${renderStatusRows(filter)}
                </tbody>
            </table>
        </div>
    `;

    // ===== Attach Filter Events =====
    document.getElementById("searchInput").addEventListener("input", applyFilters);
    document.getElementById("deptInput").addEventListener("input", applyFilters);
    document.getElementById("deptSelect").addEventListener("change", applyFilters);
    document.getElementById("prioritySelect").addEventListener("change", applyFilters);
}

// ===== Dummy Rows =====
function renderStatusRows(status) {
    const rows = {
        received: `
            <tr>
                <td>REQ-2024-001</td>
                <td>John Smith</td>
                <td>IT Department</td>
                <td>Laptop Computer</td>
                <td><span style="color:red;font-weight:bold;">High</span></td>
                <td>1/15/2024</td>
                <td>Review Required</td>
                <td>₱1,200</td>
            </tr>
            <tr>
                <td>REQ-2024-005</td>
                <td>David Brown</td>
                <td>Operations</td>
                <td>Safety Equipment</td>
                <td><span style="color:red;font-weight:bold;">High</span></td>
                <td>1/16/2024</td>
                <td>Pending Approval</td>
                <td>₱400</td>
            </tr>`,
        finished: `
            <tr>
                <td>REQ-2024-002</td>
                <td>Alice Green</td>
                <td>Finance</td>
                <td>Printer</td>
                <td>Medium</td>
                <td>1/10/2024</td>
                <td>Completed</td>
                <td>₱300</td>
            </tr>`,
        cancelled: `
            <tr>
                <td>REQ-2024-003</td>
                <td>Bob Lee</td>
                <td>HR</td>
                <td>Office Chairs</td>
                <td>Low</td>
                <td>1/12/2024</td>
                <td>Cancelled</td>
                <td>₱500</td>
            </tr>`,
        rejected: `
            <tr>
                <td>REQ-2024-004</td>
                <td>Emily Davis</td>
                <td>Marketing</td>
                <td>Projector</td>
                <td>Medium</td>
                <td>1/14/2024</td>
                <td>Rejected</td>
                <td>₱700</td>
            </tr>`
    };

    if (status === "all") {
        return rows.received + rows.finished + rows.cancelled + rows.rejected;
    }
    return rows[status] || "";
}

// ===== Apply Filters =====
function applyFilters() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const deptText = document.getElementById("deptInput").value.toLowerCase();
    const deptSelect = document.getElementById("deptSelect").value.toLowerCase();
    const priority = document.getElementById("prioritySelect").value.toLowerCase();

    const rows = document.querySelectorAll("#status-table-body tr");
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        const department = row.cells[2].innerText.toLowerCase();
        const rowPriority = row.cells[4].innerText.toLowerCase();

        let match = true;
        if (search && !text.includes(search)) match = false;
        if (deptText && !department.includes(deptText)) match = false;
        if (deptSelect !== "all department" && !department.includes(deptSelect)) match = false;
        if (priority !== "filter by priority" && !rowPriority.includes(priority)) match = false;

        row.style.display = match ? "" : "none";
    });
}

// Sidebar and status behavior is handled centrally by the navigation initialization
// (initializeNavigation, toggleNavGroup, navigateToPage and loadPageContent).
// The earlier status-only DOMContentLoaded handler was removed to avoid duplicate listeners.
