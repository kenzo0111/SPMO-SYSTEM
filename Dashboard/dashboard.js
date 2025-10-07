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
    // Wizard step for multi-step PO creation (1-4)
    purchaseOrderWizardStep: 1,
    // Temp storage for multi-step PO wizard field values so they persist between steps
    purchaseOrderDraft: {},

    // ✅ add these for real data
    newRequests: [],
    pendingRequests: [],
    completedRequests: [],
    notifications: [
        {
            id: 'n1',
            title: 'New requisition submitted',
            message: 'REQ-2025-006 has been submitted for approval',
            time: '2h ago',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: false,
            type: 'info',
            icon: 'file-plus'
        },
        {
            id: 'n2',
            title: 'Stock level low: Paper A4',
            message: 'Current stock: 15 units. Reorder level: 20 units',
            time: '1d ago',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            read: false,
            type: 'warning',
            icon: 'alert-triangle'
        },
        {
            id: 'n3',
            title: 'PO #1234 approved',
            message: 'Purchase order has been approved by admin',
            time: '3d ago',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            read: true,
            type: 'success',
            icon: 'check-circle'
        },
        {
            id: 'n4',
            title: 'Stock In completed',
            message: '50 units of Ballpoint Pen received',
            time: '5d ago',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            read: true,
            type: 'success',
            icon: 'package-check'
        }
    ],
    // Unified status list (replaces hardcoded table rows in status management)
    statusRequests: [
        { id: 'REQ-2025-001', requester: 'John Smith', department: 'IT Department', item: 'Laptop Computer', priority: 'high', updatedAt: '2025-01-15', status: 'received', cost: 1200 },
        { id: 'REQ-2025-005', requester: 'David Brown', department: 'Operations', item: 'Safety Equipment', priority: 'high', updatedAt: '2025-01-16', status: 'received', cost: 400 },
        { id: 'REQ-2025-002', requester: 'Alice Green', department: 'Finance', item: 'Printer', priority: 'medium', updatedAt: '2025-01-10', status: 'finished', cost: 300 },
        { id: 'REQ-2025-003', requester: 'Bob Lee', department: 'HR', item: 'Office Chairs', priority: 'low', updatedAt: '2025-01-12', status: 'cancelled', cost: 500 },
        { id: 'REQ-2025-004', requester: 'Emily Davis', department: 'Marketing', item: 'Projector', priority: 'medium', updatedAt: '2025-01-14', status: 'rejected', cost: 700 }
    ],
    currentStatusFilter: 'all'
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
        { id: 'N001', name: 'Toyota Hiace van', description: 'Toyota Hiace van with plate number', quantity: 1, unitCost: 2700000.00, totalValue: 2700000.00, date: '2025-10-10', type: 'non-expendable' },
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
            'received': 'badge blue',
            'finished': 'badge emerald',
            'cancelled': 'badge red',

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

// Helper function to get status background color
function getStatusColor(status) {
    const statusColors = {
        'active': '#10b981',
        'inactive': '#6b7280',
        'draft': '#6b7280',
        'submitted': '#3b82f6',
        'pending': '#eab308',
        'under-review': '#3b82f6',
        'awaiting-approval': '#f97316',
        'approved': '#3b82f6',
        'delivered': '#10b981',
        'completed': '#059669',
        'received': '#3b82f6',
        'finished': '#059669',
        'cancelled': '#dc2626'
    };
    return statusColors[status] || '#6b7280';
}

// UI Alert / Toast helper
function showAlert(message, type = 'info', duration = 4000) {
    try {
        let container = document.getElementById('ui-alert-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ui-alert-container';
            container.className = 'ui-alert-container';
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

        // Auto remove
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
            // Fallback quickly
            try { resolve(window.confirm(message)); } catch (e) { resolve(false); }
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

// Safe capitalization helper (handles undefined/null)
function capitalize(s) {
    if (!s) return '-';
    return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

function renderNotifications() {
    const listEl = document.getElementById('notifications-list');
    const badge = document.getElementById('notifications-badge');
    if (!listEl || !badge) return;

    listEl.innerHTML = '';
    const unread = (AppState.notifications || []).filter(n => !n.read).length;
    badge.style.display = unread > 0 ? 'flex' : 'none';
    badge.textContent = unread > 9 ? '9+' : unread;

    // Sort notifications by timestamp (newest first)
    const sortedNotifications = [...(AppState.notifications || [])].sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp) : new Date();
        const timeB = b.timestamp ? new Date(b.timestamp) : new Date();
        return timeB - timeA;
    });

    if (sortedNotifications.length === 0) {
        listEl.innerHTML = `
            <div style="padding: 40px 20px; text-align: center; color: #9ca3af;">
                <i data-lucide="bell-off" style="width: 48px; height: 48px; margin: 0 auto 12px; opacity: 0.5;"></i>
                <p style="margin: 0; font-size: 14px;">No notifications</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    sortedNotifications.forEach(n => {
        const typeConfig = {
            'success': { bg: '#ecfdf5', iconColor: '#10b981', borderColor: '#6ee7b7' },
            'warning': { bg: '#fef3c7', iconColor: '#f59e0b', borderColor: '#fcd34d' },
            'error': { bg: '#fee2e2', iconColor: '#ef4444', borderColor: '#fca5a5' },
            'info': { bg: '#dbeafe', iconColor: '#3b82f6', borderColor: '#93c5fd' }
        };

        const config = typeConfig[n.type] || typeConfig.info;
        const isUnread = !n.read;

        const item = document.createElement('div');
        item.className = 'notification-item';
        item.style.cssText = `
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            gap: 12px;
            align-items: flex-start;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            background: ${isUnread ? config.bg : '#ffffff'};
            border-left: 3px solid ${isUnread ? config.borderColor : 'transparent'};
            position: relative;
        `;

        item.innerHTML = `
            <div style="flex-shrink: 0; width: 36px; height: 36px; background: ${config.bg}; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid ${config.borderColor};">
                <i data-lucide="${n.icon || 'bell'}" style="width: 18px; height: 18px; color: ${config.iconColor};"></i>
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
                    <div style="font-size: 13px; font-weight: 600; color: #111827; line-height: 1.4;">${escapeHtml(n.title)}</div>
                    ${isUnread ? '<div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; flex-shrink: 0; margin-top: 3px;"></div>' : ''}
                </div>
                ${n.message ? `<div style="font-size: 12px; color: #6b7280; line-height: 1.4; margin-bottom: 6px;">${escapeHtml(n.message)}</div>` : ''}
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <div style="font-size: 11px; color: #9ca3af; display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
                        ${escapeHtml(n.time)}
                    </div>
                    <button class="notification-action-btn" onclick="event.stopPropagation(); toggleNotificationRead('${n.id}');" style="font-size: 11px; color: ${config.iconColor}; border: none; background: none; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-weight: 500; transition: all 0.2s;">
                        ${isUnread ? '<i data-lucide="check" style="width: 12px; height: 12px;"></i>' : '<i data-lucide="rotate-ccw" style="width: 12px; height: 12px;"></i>'}
                    </button>
                </div>
            </div>
        `;

        // Hover effects
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateX(4px)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });

        item.addEventListener('click', function (e) {
            if (!e.target.closest('.notification-action-btn')) {
                toggleNotificationRead(n.id);
            }
        });

        listEl.appendChild(item);
    });

    // Reinitialize Lucide icons
    lucide.createIcons();
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

        // Add animation class
        menu.style.animation = 'notificationSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

        setTimeout(() => {
            document.addEventListener('click', outsideNotificationsClick);
        }, 0);
    }
}

function closeNotifications() {
    const menu = document.getElementById('notifications-menu');
    const btn = document.getElementById('notifications-btn');
    if (!menu || !btn) return;

    // Add closing animation
    menu.style.animation = 'notificationSlideOut 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

    setTimeout(() => {
        menu.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
    }, 200);

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
    n.read = !n.read; // Toggle instead of always setting to true
    renderNotifications();
}

function markAllNotificationsRead() {
    (AppState.notifications || []).forEach(n => n.read = true);
    renderNotifications();
}

function deleteNotification(id) {
    AppState.notifications = (AppState.notifications || []).filter(n => n.id !== id);
    renderNotifications();
}

function clearAllNotifications() {
    if ((AppState.notifications || []).length === 0) return;
    if (confirm('Are you sure you want to clear all notifications?')) {
        AppState.notifications = [];
        renderNotifications();
    }
}

// Add new notification (for demo/testing purposes)
function addNotification(title, message, type = 'info', icon = 'bell') {
    const newNotification = {
        id: 'n' + Date.now(),
        title: title,
        message: message,
        time: 'Just now',
        timestamp: new Date(),
        read: false,
        type: type, // 'success', 'warning', 'error', 'info'
        icon: icon
    };

    AppState.notifications.unshift(newNotification);
    renderNotifications();

    // Show animation on badge
    const badge = document.getElementById('notifications-badge');
    if (badge) {
        badge.style.animation = 'none';
        setTimeout(() => {
            badge.style.animation = 'badgePulse 2s ease-in-out infinite';
        }, 10);
    }
}

// Sidebar Toggle Function
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const isCollapsed = sidebar.classList.toggle('collapsed');

    // Store the collapsed state in localStorage
    localStorage.setItem('sidebarCollapsed', isCollapsed);

    // Add/remove tooltips for navigation items
    updateNavTooltips(isCollapsed);

    // Reinitialize Lucide icons for the toggle button
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

// Update navigation tooltips based on collapsed state
function updateNavTooltips(isCollapsed) {
    if (isCollapsed) {
        // Add tooltips to all nav buttons
        document.querySelectorAll('.nav-button').forEach(button => {
            const textElement = button.querySelector('.nav-content span');
            if (textElement) {
                button.setAttribute('data-tooltip', textElement.textContent);
            }
        });
    } else {
        // Remove tooltips when expanded
        document.querySelectorAll('.nav-button').forEach(button => {
            button.removeAttribute('data-tooltip');
        });
    }
}

// Initialize sidebar state from localStorage
function initializeSidebarState() {
    const sidebar = document.getElementById('sidebar');
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        updateNavTooltips(true);
    }
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
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="bell" style="width: 18px; height: 18px; color: #111827;"></i>
                                <strong style="font-size: 15px; color: #111827;">Notifications</strong>
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <button class="notification-header-btn" onclick="markAllNotificationsRead();" title="Mark all as read">
                                    <i data-lucide="check-check" style="width: 16px; height: 16px;"></i>
                                </button>
                                <button class="notification-header-btn" onclick="clearAllNotifications();" title="Clear all">
                                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                                </button>
                            </div>
                        </div>
                        <div id="notifications-list" style="max-height: 360px; overflow-y: auto; overflow-x: hidden;">
                            <!-- notifications injected here -->
                        </div>
                        <div style="padding: 10px 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: center;">
                            <button class="btn-secondary" style="padding: 8px 20px; border-radius: 6px; font-size: 13px; font-weight: 500;" onclick="closeNotifications()">
                                <i data-lucide="x" style="width: 14px; height: 14px; margin-right: 4px;"></i>
                                Close
                            </button>
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
                        
                        <div class="action-item" onclick="navigateToPage('inventory-reports')">
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
                                        <button class="icon-action-btn icon-action-warning" title="Edit" onclick="openCategoryModal('edit','${category.id}')">
                                            <i data-lucide="edit"></i>
                                        </button>
                                        <button class="icon-action-btn icon-action-danger" title="Delete" onclick="deleteCategory('${category.id}')">
                                            <i data-lucide="trash-2"></i>
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
        const rowBg = (index % 2 === 0) ? 'background-color: white;' : 'background-color: #f9fafb;';
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
                                        <button class="icon-action-btn icon-action-danger" title="Delete" onclick="deleteProduct('${product.id}')">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                        <button class="icon-action-btn icon-action-warning" title="Edit" onclick="openProductModal('edit','${product.id}')">
                                            <i data-lucide="edit"></i>
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
                                    ${capitalize(request.status)}
                                </span>
                            </td>
                            <td>${request.requestedBy}</td>
                            <td>${request.department}</td>
                            <td>
                                <div class="table-actions">
                                    <button class="icon-action-btn" title="View" onclick="openPurchaseOrderModal('view', '${request.id}')">
                                        <i data-lucide="eye"></i>
                                    </button>
                                    <button class="icon-action-btn icon-action-warning" title="Edit" onclick="openPurchaseOrderModal('edit', '${request.id}')">
                                        <i data-lucide="edit"></i>
                                    </button>
                                    <button class="icon-action-btn icon-action-danger" title="Delete" onclick="deleteRequest('${request.id}')">
                                        <i data-lucide="trash-2"></i>
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
                            <th scope="col">Delivery Date</th>
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
                                    <td>${request.deliveryDate || '-'}</td>
                                    <td>${formatCurrency(request.totalAmount || 0)}</td>
                                    <td>
                                        <span class="${getBadgeClass(request.priority || 'low', 'priority')}">
                                            ${request.priority ? capitalize(request.priority) : 'Low'}
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
                                            <button class="icon-action-btn" title="View" onclick="openPurchaseOrderModal('view', '${request.id}')">
                                                <i data-lucide="eye"></i>
                                            </button>
                                            <button class="icon-action-btn icon-action-warning" title="Edit" onclick="openPurchaseOrderModal('edit', '${request.id}')">
                                                <i data-lucide="edit"></i>
                                            </button>
                                            <button class="icon-action-btn icon-action-success" title="Approve" onclick="approveRequest('${request.id}')">
                                                <i data-lucide="check-circle"></i>
                                            </button>
                                            <button class="icon-action-btn icon-action-danger" title="Reject" onclick="rejectRequest('${request.id}')">
                                                <i data-lucide="x-circle"></i>
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
    // Prepare lists (mirror the approach used in generatePendingApprovalPage)
    const allCompleted = (AppState.completedRequests || []);
    // Visible in this page: treat only actually fulfilled / approved flows as "completed" view entries
    const visibleStatuses = ['approved', 'delivered', 'completed'];
    const visibleCompleted = allCompleted.filter(r => visibleStatuses.includes(r.status));
    const completedList = visibleCompleted.filter(r => r.status === 'completed');
    const deliveredList = visibleCompleted.filter(r => r.status === 'delivered');
    const totalRequests = visibleCompleted.length;
    const totalValue = visibleCompleted.reduce((sum, req) => sum + (req.totalAmount || 0), 0);

    return `
        <section class="page-header">
            <div class="page-header-content">
                <header>
                    <h1 class="page-title">Completed Request</h1>
                    <p class="page-subtitle">View completed and archived purchase requests</p>
                </header>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge green">${completedList.length} Completed</span>
                    <span class="badge blue">${deliveredList.length} Delivered</span>
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

                    <!-- payment filter removed -->
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
                            <!-- Payment Status column removed -->
                            <th scope="col">Requested By</th>
                            <th scope="col">Approved By</th>
                            <th scope="col">Delivered Date</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${visibleCompleted.length > 0
            ? visibleCompleted.map(request => `
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
                                            ${capitalize(request.status)}
                                        </span>
                                    </td>
                                    <!-- Payment Status cell removed -->
                                    <td>${request.requestedBy}</td>
                                    <td>${request.approvedBy}</td>
                                    <td>${request.deliveredDate || '-'}</td>
                                    <td>
                                        <div class="table-actions">
                                            <button class="icon-action-btn" title="View" onclick="openPurchaseOrderModal('view', '${request.id}')">
                                                <i data-lucide="eye"></i>
                                            </button>
                                            <button class="icon-action-btn icon-action-success" title="Download PO" onclick="downloadPO('${request.id}')">
                                                <i data-lucide="download"></i>
                                            </button>
                                            <button class="icon-action-btn icon-action-warning" title="Archive" onclick="archiveRequest('${request.id}')">
                                                <i data-lucide="archive"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')
            : `
                                <tr>
                                    <td colspan="9" class="px-6 py-12 text-center text-gray-500">
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
                            ${totalRequests}
                        </p>
                    </div>
                    <div class="text-center">
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Total Value</p>
                        <p style="font-size: 18px; font-weight: 600; color: #111827; margin: 0;">
                            ${formatCurrency(totalValue)}
                        </p>
                    </div>
                    <div class="text-center">
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Completed</p>
                        <p style="font-size: 18px; font-weight: 600; color: #16a34a; margin: 0;">
                            ${completedList.length}
                        </p>
                    </div>
                    <!-- Paid Orders summary removed -->
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

            <div class="card" style="margin-top:12px;">
                <canvas id="requisition-chart" width="800" height="240"></canvas>
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
    // Dynamically get departments and statuses from statusRequests
    const uniqueDepartments = ['All', ...[...new Set((AppState.statusRequests || []).map(r => r.department).filter(Boolean))]];
    const uniqueStatuses = ['All', ...[...new Set((AppState.statusRequests || []).map(r => r.status).filter(Boolean))]];

    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Status Report</h1>
                    <p class="page-subtitle">Breakdown of request statuses from Status Management</p>
                </div>
                <div>
                    <button class="btn btn-secondary" id="export-status-btn">Export CSV</button>
                </div>
            </div>
        </div>

        <div class="page-content">
            <div class="card">
                <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                    <div>
                        <label class="form-label">Department</label>
                        <select id="status-department-filter" class="form-select">
                            ${uniqueDepartments.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="form-label">Status</label>
                        <select id="status-status-filter" class="form-select">
                            ${uniqueStatuses.map(s => `<option value="${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
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
                            <th>Department</th>
                            <th>Details</th>
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
    const rows = [['Status', 'Count', 'Total Cost']];
    const rowsToExport = (window.__statusSummary && Object.keys(window.__statusSummary).length) ? window.__statusSummary : (function () {
        const all = [...(AppState.statusRequests || [])];
        return all.reduce((acc, r) => {
            acc[r.status || 'unknown'] = (acc[r.status || 'unknown'] || 0) + 1;
            return acc;
        }, {});
    })();

    // Calculate total cost per status from statusRequests
    const costByStatus = (AppState.statusRequests || []).reduce((acc, r) => {
        const status = r.status || 'unknown';
        acc[status] = (acc[status] || 0) + (r.cost || 0);
        return acc;
    }, {});

    Object.keys(rowsToExport).forEach(k => rows.push([
        k,
        rowsToExport[k],
        formatCurrency(costByStatus[k] || 0)
    ]));
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

    // render requisition totals by supplier (bar chart)
    const totalsBySupplier = all.reduce((acc, r) => {
        const s = r.supplier || 'Unknown';
        acc[s] = (acc[s] || 0) + (r.totalAmount || 0);
        return acc;
    }, {});

    const reqLabels = Object.keys(totalsBySupplier);
    const reqData = reqLabels.map(l => totalsBySupplier[l]);
    renderRequisitionChart(reqLabels, reqData);
}

let __requisitionChartInstance = null;
function renderRequisitionChart(labels, data) {
    const ctx = document.getElementById('requisition-chart');
    if (!ctx) return;
    if (__requisitionChartInstance) __requisitionChartInstance.destroy();
    __requisitionChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{ label: 'Total Amount (₱)', data, backgroundColor: '#6366f1' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderStatusReport() {
    const tbody = document.querySelector('#status-report-table tbody');
    if (!tbody) return;

    const dept = document.getElementById('status-department-filter')?.value || 'All';
    const statusFilter = document.getElementById('status-status-filter')?.value || 'All';
    const from = document.getElementById('status-date-from')?.value;
    const to = document.getElementById('status-date-to')?.value;

    // Use statusRequests from Status Management instead of request arrays
    let all = [...(AppState.statusRequests || [])];

    // Apply date filters based on updatedAt field
    if (from) all = all.filter(r => r.updatedAt ? new Date(r.updatedAt) >= new Date(from) : true);
    if (to) all = all.filter(r => r.updatedAt ? new Date(r.updatedAt) <= new Date(to) : true);

    // Apply department filter
    if (dept && dept !== 'All') all = all.filter(r => (r.department || '').toLowerCase().includes(dept.toLowerCase()));

    // Apply status filter
    if (statusFilter && statusFilter !== 'All') all = all.filter(r => (r.status || 'unknown').toLowerCase() === statusFilter.toLowerCase());

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

    // Replace tbody HTML with separate rows for each status-department combination
    const rowsHtml = [];

    Object.keys(summary).forEach(k => {
        const matches = all.filter(r => (r.status || 'unknown') === k);

        // Group by department
        const byDepartment = {};
        matches.forEach(r => {
            const dept = r.department || 'Unassigned';
            if (!byDepartment[dept]) byDepartment[dept] = [];
            byDepartment[dept].push(r);
        });

        // Create a row for each department
        const departments = Object.keys(byDepartment);

        if (departments.length === 0) {
            // No departments, show one row with no department
            rowsHtml.push(`
                <tr>
                    <td style="text-transform: capitalize; font-weight: 500;">${k}</td>
                    <td style="font-weight: 600;">${summary[k]}</td>
                    <td>—</td>
                    <td style="max-width:420px;"><span style="color:#6b7280;">—</span></td>
                </tr>
            `);
        } else {
            departments.forEach((dept, index) => {
                const deptRequests = byDepartment[dept];
                const detailHtml = deptRequests.map(r => `
                    <div style="margin-bottom:6px;">
                        <a href="#" onclick="viewStatusRequestDetails('${r.id}'); return false;" style="color:#dc2626; text-decoration:underline;">${r.id}</a>
                        ${r.requester ? ` - ${r.requester}` : ''}
                        ${r.item ? ` (${r.item})` : ''}
                        <span style="margin-left:8px; color:#6b7280;">${r.cost ? formatCurrency(r.cost) : ''}</span>
                    </div>
                `).join('');

                rowsHtml.push(`
                    <tr>
                        <td style="text-transform: capitalize; font-weight: 500;">${k}</td>
                        <td style="font-weight: 600;">${deptRequests.length}</td>
                        <td>${dept}</td>
                        <td style="max-width:420px;">${detailHtml}</td>
                    </tr>
                `);
            });
        }
    });

    tbody.innerHTML = rowsHtml.join('');
}

function showStatusDetails(status) {
    // Find matching requests from Status Management
    const all = [...(AppState.statusRequests || [])];
    const matches = all.filter(r => (r.status || 'unknown') === status);

    const modal = document.getElementById('purchase-order-modal');
    const modalContent = modal.querySelector('.modal-content');

    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">Requests: ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            <button class="modal-close" onclick="closePurchaseOrderModal()">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>
        <div class="modal-body">
            <table class="table">
                <thead><tr><th>Request ID</th><th>Requester</th><th>Department</th><th>Item</th><th>Priority</th><th>Cost</th><th>Updated</th></tr></thead>
                <tbody>
                    ${matches.length ? matches.map(r => `
                        <tr>
                            <td><a href="#" onclick="viewStatusRequestDetails('${r.id}'); return false;" style="color:#dc2626; text-decoration:underline;">${r.id}</a></td>
                            <td>${r.requester || '-'}</td>
                            <td>${r.department || '-'}</td>
                            <td>${r.item || '-'}</td>
                            <td><span class="${getBadgeClass(r.priority || 'low', 'priority')}">${capitalize(r.priority || 'low')}</span></td>
                            <td>${r.cost ? formatCurrency(r.cost) : '-'}</td>
                            <td>${r.updatedAt || '-'}</td>
                        </tr>
                    `).join('') : `<tr><td colspan="7">No requests with status ${status}</td></tr>`}
                </tbody>
            </table>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" onclick="closePurchaseOrderModal()">Close</button>
        </div>
    `;

    modal.classList.add('active');
    lucide.createIcons();
}

window.showStatusDetails = showStatusDetails;

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

    // Generate colors based on actual status labels
    const backgroundColors = labels.map(label => getStatusColor(label.toLowerCase()));

    __statusChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: backgroundColors }] },
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
        document.getElementById('status-status-filter')?.addEventListener('change', renderStatusReport);
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
    // Reset wizard step if creating new
    if (mode === 'create') {
        AppState.purchaseOrderWizardStep = 1;
        AppState.purchaseOrderDraft = {}; // reset draft on fresh create
    }

    // Load existing request if not create mode
    let requestData = null;
    if (requestId) {
        requestData = AppState.newRequests.find(r => r.id === requestId) ||
            AppState.pendingRequests.find(r => r.id === requestId) ||
            AppState.completedRequests.find(r => r.id === requestId);
    }

    // Use wizard wrapper if create mode, otherwise legacy single view for view mode
    if (mode === 'create') {
        modalContent.innerHTML = generatePurchaseOrderWizardShell(requestData);
        renderPurchaseOrderWizardStep(requestData);
    } else {
        modalContent.innerHTML = generatePurchaseOrderModal(mode, requestData);
    }
    modal.classList.add('active');

    lucide.createIcons();
    if (mode === 'view') {
        initializePurchaseOrderModal(requestData);
    }
}


function closePurchaseOrderModal() {
    const modal = document.getElementById('purchase-order-modal');
    modal.classList.remove('active');
    AppState.currentModal = null;
}

// ---------------------- //
// Purchase Order Wizard  //
// ---------------------- //

function generatePurchaseOrderWizardShell(requestData) {
    return `
        <div class="modal-header" style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border-bottom: none; padding: 32px 24px;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                    <i data-lucide="file-plus" style="width: 32px; height: 32px; color: white;"></i>
                </div>
                <div style="flex: 1;">
                    <h2 class="modal-title" style="color: white; font-size: 24px; margin-bottom: 4px;">New Purchase Order</h2>
                    <p class="modal-subtitle" style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">Step-by-step purchase order creation</p>
                    <p style="font-size: 12px; color: rgba(255,255,255,0.8); margin: 4px 0 0 0;">Camarines Norte State College</p>
                </div>
            </div>
            <button class="modal-close" onclick="closePurchaseOrderModal()" style="color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>
        <div class="modal-body" id="po-wizard-body" style="padding: 32px 24px; background: #f9fafb;"></div>
        <div class="modal-footer" id="po-wizard-footer" style="padding: 20px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; display: flex; gap: 12px; justify-content: flex-end;"></div>
    `;
}

function renderPurchaseOrderWizardStep(requestData) {
    const body = document.getElementById('po-wizard-body');
    const footer = document.getElementById('po-wizard-footer');
    if (!body || !footer) return;
    const step = AppState.purchaseOrderWizardStep;

    const totalSteps = 4;
    const stepLabels = ['Supplier', 'Details', 'Items', 'Review'];
    const stepIcons = ['truck', 'file-text', 'package', 'check-circle'];

    const progress = (() => {
        const parts = [];
        for (let i = 1; i <= totalSteps; i++) {
            const isCompleted = i < step;
            const isActive = i === step;
            const cls = isCompleted ? 'po-step completed' : (isActive ? 'po-step active' : 'po-step');
            const stepColor = isCompleted ? '#16a34a' : (isActive ? '#2563eb' : '#9ca3af');
            parts.push(`
                <div class="po-step-wrap">
                    <div class="${cls}" style="background: ${isCompleted ? '#16a34a' : (isActive ? '#2563eb' : '#e5e7eb')}; color: ${isCompleted || isActive ? 'white' : '#6b7280'}; box-shadow: ${isActive ? '0 4px 6px rgba(37, 99, 235, 0.3)' : 'none'};">
                        ${isCompleted ? '<i data-lucide="check" style="width: 16px; height: 16px;"></i>' : i}
                    </div>
                    <div class="po-step-label" style="color: ${stepColor}; font-weight: ${isActive ? '600' : '500'};">${stepLabels[i - 1]}</div>
                </div>
            `);
        }
        const fillPct = ((step - 1) / (totalSteps - 1)) * 100;
        return `<div class="po-progress" style="margin-bottom: 32px;"><div class="po-progress-bar-fill" style="width:${fillPct}%; background: linear-gradient(90deg, #16a34a 0%, #2563eb 100%);"></div>${parts.join('')}</div>`;
    })();

    function footerButtons(extraNextCondition = true, nextLabel = 'Next') {
        return `
            <button class="btn-secondary" onclick="closePurchaseOrderModal()" style="padding: 10px 24px; font-weight: 500; border-radius: 8px; transition: all 0.2s;">
                <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                Cancel
            </button>
            ${step > 1 ? `
                <button class="btn-secondary" onclick="prevPurchaseOrderStep()" style="padding: 10px 24px; font-weight: 500; border-radius: 8px; transition: all 0.2s;">
                    <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
                    Back
                </button>
            ` : ''}
            ${step < totalSteps ? `
                <button class="btn btn-primary" ${!extraNextCondition ? 'disabled' : ''} onclick="nextPurchaseOrderStep()" style="padding: 10px 24px; font-weight: 500; border-radius: 8px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); box-shadow: 0 4px 6px rgba(37, 99, 235, 0.25); transition: all 0.2s;">
                    ${nextLabel}
                    <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
                </button>
            ` : `
                <button class="btn btn-primary" onclick="finalizePurchaseOrderCreation()" style="padding: 10px 24px; font-weight: 500; border-radius: 8px; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); box-shadow: 0 4px 6px rgba(22, 163, 74, 0.25); transition: all 0.2s;">
                    <i data-lucide="check" style="width: 16px; height: 16px;"></i>
                    Create Purchase Order
                </button>
            `}
        `;
    }

    if (step === 1) {
        body.innerHTML = `
            <div class="po-wizard">
                ${progress}
                <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div class="po-step-head" style="margin-bottom: 24px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="truck" style="width: 20px; height: 20px; color: #2563eb;"></i>
                            Supplier Information
                        </h3>
                        <p style="margin: 0; font-size: 13px; color: #6b7280;">Provide accurate supplier identity and tax details. These fields are used for validation and downstream financial references.</p>
                    </div>
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">Primary Information</h4>
                        <div class="grid-2">
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="building" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Supplier<span style="color:#dc2626"> *</span>
                                </label>
                                <input type="text" class="form-input" id="po-supplier" placeholder="e.g. ABC Office Supplies" value="${AppState.purchaseOrderDraft.supplier || ''}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="file-text" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    P.O. Number
                                </label>
                                <input type="text" class="form-input" id="po-number" placeholder="Auto generated" value="${AppState.purchaseOrderDraft.poNumber || ''}" readonly style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; background: #f9fafb; color: #6b7280;">
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">Additional Details</h4>
                        <div class="grid-2">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="map-pin" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Supplier Address
                                </label>
                                <textarea class="form-textarea" id="po-supplier-address" placeholder="Street, City, Province" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; min-height: 80px; transition: all 0.2s;">${AppState.purchaseOrderDraft.supplierAddress || ''}</textarea>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="hash" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    TIN Number
                                </label>
                                <input type="text" class="form-input" id="po-supplier-tin" placeholder="000-000-000-000" value="${AppState.purchaseOrderDraft.supplierTIN || ''}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        footer.innerHTML = footerButtons(true, 'Next');
        // Pre-fill PO number
        const poInput = document.getElementById('po-number');
        if (poInput && !poInput.value) {
            // generate once and persist in draft
            const gen = generateNewPONumber();
            poInput.value = gen;
            AppState.purchaseOrderDraft.poNumber = gen;
        }
    }
    else if (step === 2) {
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
        body.innerHTML = `
            <div class="po-wizard">
                ${progress}
                <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div class="po-step-head" style="margin-bottom: 24px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="file-text" style="width: 20px; height: 20px; color: #2563eb;"></i>
                            Procurement & Delivery Details
                        </h3>
                        <p style="margin: 0; font-size: 13px; color: #6b7280;">Specify contextual information that defines how and when the goods will be procured and delivered.</p>
                    </div>
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">Core Details</h4>
                        <div class="grid-2">
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="briefcase" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Department<span style="color:#dc2626"> *</span>
                                </label>
                                <select class="form-select" id="po-department" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                                    <option value="">Select Department</option>
                                    ${departments.map(d => `<option value="${d.value}" ${AppState.purchaseOrderDraft.department === d.value ? 'selected' : ''}>${d.label}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="calendar" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Date of Purchase
                                </label>
                                <input type="date" class="form-input" id="po-date" value="${AppState.purchaseOrderDraft.purchaseDate || ''}" min="${new Date().toISOString().split('T')[0]}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">Procurement Context</h4>
                        <div class="grid-2">
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="shopping-cart" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Mode of Procurement
                                </label>
                                <select class="form-select" id="po-mode" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                                    <option value="">Select procurement mode</option>
                                    <option ${AppState.purchaseOrderDraft.procurementMode === 'Small Value Procurement' ? 'selected' : ''}>Small Value Procurement</option>
                                    <option ${AppState.purchaseOrderDraft.procurementMode === 'Medium Value Procurement' ? 'selected' : ''}>Medium Value Procurement</option>
                                    <option ${AppState.purchaseOrderDraft.procurementMode === 'High Value Procurement' ? 'selected' : ''}>High Value Procurement</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="message-square" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Gentlemen Clause
                                </label>
                                <textarea class="form-textarea" id="po-gentlemen" placeholder="Please furnish this office ..." style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; min-height: 80px; transition: all 0.2s;">${AppState.purchaseOrderDraft.gentlemen || ''}</textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">Logistics</h4>
                        <div class="grid-2">
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="map-pin" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Place of Delivery
                                </label>
                                <input type="text" class="form-input" id="po-place" placeholder="Campus / Building / Room" value="${AppState.purchaseOrderDraft.placeOfDelivery || ''}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="calendar-check" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Date of Delivery
                                </label>
                                <input type="text" class="form-input" id="po-delivery-date" placeholder="e.g. Within 30 days" value="${AppState.purchaseOrderDraft.deliveryDate || ''}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="clock" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Delivery Term
                                </label>
                                <input type="text" class="form-input" id="po-delivery-term" placeholder="e.g. Partial / Complete" value="${AppState.purchaseOrderDraft.deliveryTerm || ''}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="credit-card" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Payment Term
                                </label>
                                <input type="text" class="form-input" id="po-payment-term" placeholder="e.g. Net 30" value="${AppState.purchaseOrderDraft.paymentTerm || ''}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        footer.innerHTML = footerButtons(true, 'Next');
    }
    else if (step === 3) {
        body.innerHTML = `
            <div class="po-wizard">
                ${progress}
                <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div class="po-step-head" style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="package" style="width: 20px; height: 20px; color: #2563eb;"></i>
                            Order Items
                        </h3>
                        <p style="margin: 0; font-size: 13px; color: #6b7280;">List each item clearly. Descriptions will auto-fill if the stock property number matches existing inventory.</p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 12px 16px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
                        <p style="margin: 0; font-size: 13px; color: #1e40af; font-weight: 500;">
                            <i data-lucide="info" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i>
                            Add the materials or assets to be procured
                        </p>
                        <button class="btn btn-primary" type="button" onclick="addPOItem()" style="padding: 8px 16px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); box-shadow: 0 4px 6px rgba(37, 99, 235, 0.25);">
                            <i data-lucide="plus" class="icon" style="width: 16px; height: 16px;"></i>
                            Add Item
                        </button>
                    </div>
                    <div class="table-container" style="max-height: 350px; overflow: auto; border: 2px solid #e5e7eb; border-radius: 8px;">
                        <table class="table" id="po-items-table">
                            <thead style="background: #f9fafb;">
                                <tr>
                                    <th style="padding: 12px;">Stock #</th>
                                    <th style="padding: 12px;">Unit</th>
                                    <th style="padding: 12px;">Description</th>
                                    <th style="padding: 12px;">Detailed Description</th>
                                    <th style="padding: 12px;">Qty</th>
                                    <th style="padding: 12px;">Unit Cost</th>
                                    <th style="padding: 12px;">Amount</th>
                                    <th style="padding: 12px;">Action</th>
                                </tr>
                            </thead>
                            <tbody id="po-items-tbody"></tbody>
                            <tfoot>
                                <tr style="border-top: 2px solid #e5e7eb; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);">
                                    <td colspan="6" style="text-align: right; font-weight: 600; padding: 16px; color: #1e40af;">Grand Total:</td>
                                    <td style="font-weight: 700; color: #2563eb; padding: 16px; font-size: 16px;" id="grand-total">₱0.00</td>
                                    <td style="padding: 16px;"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        `;
        // Initialize after table exists
        initializePurchaseOrderModal(null, { skipRender: true });
        renderPOItems();
        footer.innerHTML = footerButtons(AppState.purchaseOrderItems.length > 0, 'Next');
        lucide.createIcons();
    }
    else if (step === 4) {
        const totalAmount = AppState.purchaseOrderItems.reduce((s, i) => s + i.amount, 0);
        body.innerHTML = `
            <div class="po-wizard">
                ${progress}
                <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div class="po-step-head" style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="check-circle" style="width: 20px; height: 20px; color: #16a34a;"></i>
                            Review & Finalize
                        </h3>
                        <p style="margin: 0; font-size: 13px; color: #6b7280;">Confirm all details. Once created, edits will require opening the order in edit mode.</p>
                    </div>
                    
                    <!-- Summary Box -->
                    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px solid #93c5fd; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <i data-lucide="clipboard-check" style="width: 20px; height: 20px; color: #1e40af;"></i>
                            <p style="margin: 0; font-weight: 600; color: #1e40af; font-size: 15px;">Order Summary</p>
                        </div>
                        <div style="display: flex; gap: 24px; margin-top: 12px;">
                            <div style="flex: 1;">
                                <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Items</p>
                                <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 700; color: #2563eb;">${AppState.purchaseOrderItems.length}</p>
                            </div>
                            <div style="flex: 2;">
                                <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Total Amount</p>
                                <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 700; color: #16a34a;">${formatCurrency(totalAmount)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Funding Section -->
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; display: flex; align-items: center; gap: 6px;">
                            <i data-lucide="dollar-sign" style="width: 16px; height: 16px; color: #2563eb;"></i>
                            Funding Information
                        </h4>
                        <div class="grid-3">
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="layers" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Fund Cluster
                                </label>
                                <input type="text" class="form-input" id="po-fund-cluster" placeholder="e.g. 01" value="${AppState.purchaseOrderDraft.fundCluster || ''}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="banknote" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Funds Available (Optional)
                                </label>
                                <input type="text" class="form-input" id="po-funds-available" placeholder="e.g. ₱0.00" value="${AppState.purchaseOrderDraft.fundsAvailable || ''}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="sticky-note" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Notes (Optional)
                                </label>
                                <input type="text" class="form-input" id="po-notes" placeholder="Short note" value="${AppState.purchaseOrderDraft.notes || ''}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                        </div>
                    </div>
                    
                    <!-- ORS/BURS Section -->
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; display: flex; align-items: center; gap: 6px;">
                            <i data-lucide="receipt" style="width: 16px; height: 16px; color: #2563eb;"></i>
                            ORS / BURS Information
                        </h4>
                        <div class="grid-3">
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="hash" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    ORS/BURS No.
                                </label>
                                <input type="text" class="form-input" id="po-ors-no" placeholder="Enter ORS/BURS number" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="calendar" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Date of ORS/BURS
                                </label>
                                <input type="date" class="form-input" id="po-ors-date" min="${new Date().toISOString().split('T')[0]}" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                    <i data-lucide="banknote" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                    Amount
                                </label>
                                <input type="text" class="form-input" id="po-ors-amount" placeholder="₱0.00" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Forms Required -->
                    <div>
                        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #374151; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; display: flex; align-items: center; gap: 6px;">
                            <i data-lucide="file-check" style="width: 16px; height: 16px; color: #2563eb;"></i>
                            Forms Required
                        </h4>
                        <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">Select supporting documents to prepare with this Purchase Order</p>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                            <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                                   onmouseover="this.style.background='#eff6ff'; this.style.borderColor='#2563eb';"
                                   onmouseout="this.style.background='#f9fafb'; this.style.borderColor='#e5e7eb';">
                                <input type="checkbox" id="po-gen-ics" ${AppState.purchaseOrderDraft.generateICS ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer;">
                                <span style="font-size: 14px; font-weight: 500; color: #374151;">ICS</span>
                            </label>
                            
                            <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                                   onmouseover="this.style.background='#eff6ff'; this.style.borderColor='#2563eb';"
                                   onmouseout="this.style.background='#f9fafb'; this.style.borderColor='#e5e7eb';">
                                <input type="checkbox" id="po-gen-ris" ${AppState.purchaseOrderDraft.generateRIS ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer;">
                                <span style="font-size: 14px; font-weight: 500; color: #374151;">RIS</span>
                            </label>
                            
                            <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                                   onmouseover="this.style.background='#eff6ff'; this.style.borderColor='#2563eb';"
                                   onmouseout="this.style.background='#f9fafb'; this.style.borderColor='#e5e7eb';">
                                <input type="checkbox" id="po-gen-par" ${AppState.purchaseOrderDraft.generatePAR ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer;">
                                <span style="font-size: 14px; font-weight: 500; color: #374151;">PAR</span>
                            </label>
                            
                            <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                                   onmouseover="this.style.background='#eff6ff'; this.style.borderColor='#2563eb';"
                                   onmouseout="this.style.background='#f9fafb'; this.style.borderColor='#e5e7eb';">
                                <input type="checkbox" id="po-gen-iar" ${AppState.purchaseOrderDraft.generateIAR ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer;">
                                <span style="font-size: 14px; font-weight: 500; color: #374151;">IAR</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
        footer.innerHTML = footerButtons(true, 'Create');
    }
}

function nextPurchaseOrderStep() {
    // persist current step form values into draft
    persistCurrentWizardStep();
    if (AppState.purchaseOrderWizardStep < 4) {
        AppState.purchaseOrderWizardStep++;
        renderPurchaseOrderWizardStep();
        lucide.createIcons();
    }
}

function prevPurchaseOrderStep() {
    persistCurrentWizardStep();
    if (AppState.purchaseOrderWizardStep > 1) {
        AppState.purchaseOrderWizardStep--;
        renderPurchaseOrderWizardStep();
        lucide.createIcons();
    }
}

function persistCurrentWizardStep() {
    const step = AppState.purchaseOrderWizardStep;
    const modal = document.getElementById('purchase-order-modal');
    if (!modal) return;
    if (step === 1) {
        AppState.purchaseOrderDraft.supplier = modal.querySelector('#po-supplier')?.value || '';
        AppState.purchaseOrderDraft.supplierAddress = modal.querySelector('#po-supplier-address')?.value || '';
        AppState.purchaseOrderDraft.supplierTIN = modal.querySelector('#po-supplier-tin')?.value || '';
        AppState.purchaseOrderDraft.poNumber = modal.querySelector('#po-number')?.value || AppState.purchaseOrderDraft.poNumber;
    } else if (step === 2) {
        AppState.purchaseOrderDraft.department = modal.querySelector('#po-department')?.value || '';
        AppState.purchaseOrderDraft.purchaseDate = modal.querySelector('#po-date')?.value || '';
        AppState.purchaseOrderDraft.procurementMode = modal.querySelector('#po-mode')?.value || '';
        AppState.purchaseOrderDraft.gentlemen = modal.querySelector('#po-gentlemen')?.value || '';
        AppState.purchaseOrderDraft.placeOfDelivery = modal.querySelector('#po-place')?.value || '';
        AppState.purchaseOrderDraft.deliveryDate = modal.querySelector('#po-delivery-date')?.value || '';
        AppState.purchaseOrderDraft.deliveryTerm = modal.querySelector('#po-delivery-term')?.value || '';
        AppState.purchaseOrderDraft.paymentTerm = modal.querySelector('#po-payment-term')?.value || '';
    } else if (step === 4) {
        AppState.purchaseOrderDraft.orsNo = modal.querySelector('#po-ors-no')?.value || '';
        AppState.purchaseOrderDraft.orsDate = modal.querySelector('#po-ors-date')?.value || '';
        AppState.purchaseOrderDraft.orsAmount = modal.querySelector('#po-ors-amount')?.value || '';
        AppState.purchaseOrderDraft.fundCluster = modal.querySelector('#po-fund-cluster')?.value || '';
        AppState.purchaseOrderDraft.fundsAvailable = modal.querySelector('#po-funds-available')?.value || '';
        AppState.purchaseOrderDraft.notes = modal.querySelector('#po-notes')?.value || '';
        AppState.purchaseOrderDraft.generateICS = modal.querySelector('#po-gen-ics')?.checked || false;
        AppState.purchaseOrderDraft.generateRIS = modal.querySelector('#po-gen-ris')?.checked || false;
        AppState.purchaseOrderDraft.generatePAR = modal.querySelector('#po-gen-par')?.checked || false;
        AppState.purchaseOrderDraft.generateIAR = modal.querySelector('#po-gen-iar')?.checked || false;
    }
}

function finalizePurchaseOrderCreation() {
    // Gather data from wizard fields
    const modal = document.getElementById('purchase-order-modal');
    if (!modal) return;
    // ensure latest review inputs saved
    persistCurrentWizardStep();
    const draft = AppState.purchaseOrderDraft || {};
    const supplier = draft.supplier || '';
    const supplierAddress = draft.supplierAddress || '';
    const supplierTIN = draft.supplierTIN || '';
    const poNumber = draft.poNumber || generateNewPONumber();
    const department = draft.department || '';
    const purchaseDate = draft.purchaseDate || '';
    const procurementMode = draft.procurementMode || '';
    const gentlemen = draft.gentlemen || '';
    const placeOfDelivery = draft.placeOfDelivery || '';
    const deliveryDate = draft.deliveryDate || '';
    const deliveryTerm = draft.deliveryTerm || '';
    const paymentTerm = draft.paymentTerm || '';
    const orsNo = draft.orsNo || '';
    const orsDate = draft.orsDate || '';
    const orsAmount = draft.orsAmount || '';
    const fundCluster = draft.fundCluster || '';
    const fundsAvailable = draft.fundsAvailable || '';
    const notes = draft.notes || '';
    const totalAmount = AppState.purchaseOrderItems.reduce((s, i) => s + i.amount, 0);

    const newRequestId = generateNextRequestId();
    const newRequest = {
        id: newRequestId,
        poNumber,
        supplier,
        supplierAddress,
        supplierTIN,
        requestDate: new Date().toISOString().split('T')[0],
        deliveryDate,
        deliveredDate: '', // will be set when actually delivered; keep separate from planned deliveryDate
        purchaseDate,
        procurementMode,
        gentlemen,
        placeOfDelivery,
        deliveryTerm,
        paymentTerm,
        orsNo,
        orsDate,
        orsAmount,
        fundCluster,
        fundsAvailable,
        notes,
        totalAmount,
        status: 'submitted',
        requestedBy: 'Current User',
        department,
        generateICS: !!draft.generateICS,
        generateRIS: !!draft.generateRIS,
        generatePAR: !!draft.generatePAR,
        generateIAR: !!draft.generateIAR,
        items: [...AppState.purchaseOrderItems]
    };
    AppState.newRequests.push(newRequest);
    showAlert(`New purchase order ${poNumber} created successfully!`, 'success');
    loadPageContent('new-request');
    closePurchaseOrderModal();
}

// Expose wizard functions
window.nextPurchaseOrderStep = nextPurchaseOrderStep;
window.prevPurchaseOrderStep = prevPurchaseOrderStep;
window.finalizePurchaseOrderCreation = finalizePurchaseOrderCreation;

// Enhanced Purchase Order Modal with modern design
function generatePurchaseOrderModal(mode, requestData = null) {
    const title = mode === 'create' ? 'New Purchase Order' :
        mode === 'edit' ? 'Edit Purchase Order' : 'Purchase Order Details';
    const subtitle = mode === 'create' ? 'Create a new purchase order request' :
        mode === 'edit' ? 'Update purchase order information' :
            'View purchase order details';
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
        <div class="modal-header" style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border-bottom: none; padding: 32px 24px;">
            <div style="display: flex; align-items: center; gap: 16px;">
                ${mode !== 'create' && requestData ? `
                    <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                        <i data-lucide="file-text" style="width: 32px; height: 32px; color: white;"></i>
                    </div>
                ` : ''}
                <div style="flex: 1;">
                    <h2 class="modal-title" style="color: white; font-size: 24px; margin-bottom: 4px;">${title}</h2>
                    <p class="modal-subtitle" style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">${subtitle}</p>
                    <p style="font-size: 12px; color: rgba(255,255,255,0.8); margin: 4px 0 0 0;">Camarines Norte State College</p>
                </div>
            </div>
            <button class="modal-close" onclick="closePurchaseOrderModal()" style="color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body" style="padding: 32px 24px; background: #f9fafb;">
            <!-- Supplier Information -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="truck" style="width: 18px; height: 18px; color: #2563eb;"></i>
                    Supplier Information
                </h3>
                
                <div class="grid-2">
                    <div class="space-y-4">
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i data-lucide="building" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                Supplier Name
                            </label>
                            <input type="text" class="form-input" id="supplierName"
                                   value="${requestData?.supplier || ''}"
                                   placeholder="Enter supplier name" 
                                   style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                                   ${isReadOnly ? 'readonly' : ''}>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i data-lucide="map-pin" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                Supplier Address
                            </label>
                            <textarea class="form-textarea" id="supplierAddress"
                                      placeholder="Enter supplier address" 
                                      style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; min-height: 80px; transition: all 0.2s;"
                                      ${isReadOnly ? 'readonly' : ''}>${requestData?.supplierAddress || ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i data-lucide="hash" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                TIN Number
                            </label>
                            <input type="text" class="form-input" id="supplierTIN"
                                   value="${requestData?.supplierTIN || ''}"
                                   placeholder="Enter TIN number" 
                                   style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                                   ${isReadOnly ? 'readonly' : ''}>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i data-lucide="file-text" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                P.O. Number
                            </label>
                            <input type="text" class="form-input" id="poNumber"
                                   value="${requestData?.poNumber || ''}"
                                   placeholder="Enter P.O. number" 
                                   style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                                   ${isReadOnly ? 'readonly' : ''}>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i data-lucide="calendar" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                Date of Purchase
                            </label>
                            <input type="date" class="form-input" id="purchaseDate"
                                   value="${requestData?.purchaseDate || ''}"
                                   min="${new Date().toISOString().split('T')[0]}"
                                   style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                                   ${isReadOnly ? 'readonly' : ''}>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i data-lucide="shopping-cart" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                Mode of Procurement
                            </label>
                            <select class="form-select" id="procurementMode" ${isReadOnly ? 'disabled' : ''} style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s; ${isReadOnly ? 'background: #f9fafb;' : ''}">
                                <option ${!requestData?.procurementMode ? 'selected' : ''}>Select procurement mode</option>
                                <option ${requestData?.procurementMode === 'Small Value Procurement' ? 'selected' : ''}>Small Value Procurement</option>
                                <option ${requestData?.procurementMode === 'Medium Value Procurement' ? 'selected' : ''}>Medium Value Procurement</option>
                                <option ${requestData?.procurementMode === 'High Value Procurement' ? 'selected' : ''}>High Value Procurement</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Department & Gentlemen -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="briefcase" style="width: 18px; height: 18px; color: #2563eb;"></i>
                    Department & Request Details
                </h3>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="building-2" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Department
                    </label>
                    <select class="form-select" name="department" id="departmentSelect" ${isReadOnly ? 'disabled' : ''} style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s; ${isReadOnly ? 'background: #f9fafb;' : ''}">
                        <option value="">Select Department</option>
                        ${departments.map(dept => `
                            <option value="${dept.value}" ${dept.value === selectedDepartment ? 'selected' : ''}>
                                ${dept.label}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="message-square" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Gentlemen
                    </label>
                    <textarea class="form-textarea" id="gentlemen"
                              placeholder="Please furnish this Office the following articles subject to the terms and conditions contained herein"
                              style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; min-height: 80px; transition: all 0.2s;"
                              ${isReadOnly ? 'readonly' : ''}>${requestData?.gentlemen || ''}</textarea>
                </div>
            </div>

            <!-- Delivery Information -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="package" style="width: 18px; height: 18px; color: #2563eb;"></i>
                    Delivery & Payment Terms
                </h3>
                
                <div class="grid-2">
                    <div class="space-y-4">
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i data-lucide="map-pin" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                Place of Delivery
                            </label>
                            <input type="text" class="form-input" id="placeOfDelivery"
                                   value="${requestData?.placeOfDelivery || ''}"
                                   placeholder="Enter delivery location" 
                                   style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                                   ${isReadOnly ? 'readonly' : ''}>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i data-lucide="calendar-check" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                Date of Delivery
                            </label>
                            <input type="text" class="form-input" id="deliveryDate"
                                   value="${requestData?.deliveryDate || ''}"
                                   style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                                   ${isReadOnly ? 'readonly' : ''}>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i data-lucide="clock" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                Delivery Term
                            </label>
                            <input type="text" class="form-input" id="deliveryTerm"
                                   value="${requestData?.deliveryTerm || ''}"
                                   placeholder="Enter delivery term" 
                                   style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                                   ${isReadOnly ? 'readonly' : ''}>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                                <i data-lucide="credit-card" style="width: 14px; height: 14px; color: #6b7280;"></i>
                                Payment Term
                            </label>
                            <input type="text" class="form-input" id="paymentTerm"
                                   value="${requestData?.paymentTerm || ''}"
                                   placeholder="Enter payment term" 
                                   style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                                   ${isReadOnly ? 'readonly' : ''}>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Items Section -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="list" style="width: 18px; height: 18px; color: #2563eb;"></i>
                        Order Items
                    </h3>
                    <div style="display: flex; gap: 8px;">
                        ${!isReadOnly ? `
                            <button class="btn btn-primary" onclick="addPOItem()" style="padding: 8px 16px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); box-shadow: 0 4px 6px rgba(37, 99, 235, 0.25);">
                                <i data-lucide="plus" class="icon" style="width: 16px; height: 16px;"></i>
                                Add Item
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="table-container" style="border: 2px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <table class="table" id="po-items-table">
                        <thead style="background: #f9fafb;">
                            <tr>
                                <th style="padding: 12px;">Stock Property Number</th>
                                <th style="padding: 12px;">Unit</th>
                                <th style="padding: 12px;">Description</th>
                                <th style="padding: 12px;">Detailed Description</th>
                                <th style="padding: 12px;">Quantity</th>
                                <th style="padding: 12px;">Unit Cost</th>
                                <th style="padding: 12px;">Amount</th>
                                ${!isReadOnly ? '<th style="padding: 12px;">Action</th>' : ''}
                            </tr>
                        </thead>
                        <tbody id="po-items-tbody"></tbody>
                        <tfoot>
                            <tr style="border-top: 2px solid #e5e7eb; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);">
                                <td colspan="${isReadOnly ? '6' : '7'}" style="text-align: right; font-weight: 600; padding: 16px; color: #1e40af;">Grand Total:</td>
                                <td style="font-weight: 700; color: #2563eb; padding: 16px; font-size: 16px;" id="grand-total">
                                    ${requestData ? formatCurrency(requestData.totalAmount || 0) : '₱0.00'}
                                </td>
                                ${!isReadOnly ? '<td></td>' : ''}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- Funding Information -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="dollar-sign" style="width: 18px; height: 18px; color: #2563eb;"></i>
                    Funding Information
                </h3>
                
                <div class="grid-3">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="layers" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Fund Cluster
                        </label>
                        <input type="text" class="form-input" id="fundCluster"
                               value="${requestData?.fundCluster || ''}" 
                               placeholder="e.g. 01" 
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="banknote" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Funds Available (Optional)
                        </label>
                        <input type="text" class="form-input" id="fundsAvailable"
                               value="${requestData?.fundsAvailable || ''}" 
                               placeholder="e.g. ₱0.00" 
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="sticky-note" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Notes (Optional)
                        </label>
                        <input type="text" class="form-input" id="fundNotes"
                               value="${requestData?.notes || ''}" 
                               placeholder="Short note" 
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>
            </div>

            <!-- ORS/BURS Information -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="receipt" style="width: 18px; height: 18px; color: #2563eb;"></i>
                    ORS/BURS Information
                </h3>
                
                <div class="grid-3">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="hash" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            ORS/BURS No.
                        </label>
                        <input type="text" class="form-input" id="orsNo"
                               value="${requestData?.orsNo || ''}"
                               placeholder="Enter ORS/BURS number" 
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="calendar" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Date of ORS/BURS
                        </label>
                        <input type="date" class="form-input" id="orsDate"
                               value="${requestData?.orsDate || ''}"
                               min="${new Date().toISOString().split('T')[0]}"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="banknote" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Amount
                        </label>
                        <input type="text" class="form-input" id="orsAmount"
                               value="${requestData?.orsAmount || ''}"
                               placeholder="₱0.00" 
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>
            </div>

            <!-- Forms Required -->
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="file-check" style="width: 18px; height: 18px; color: #2563eb;"></i>
                    Forms Required
                </h3>
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">Select supporting documents for this Purchase Order</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; ${isReadOnly ? 'opacity: 0.6; cursor: not-allowed;' : 'hover: {background: #eff6ff; border-color: #2563eb;}'}"
                           onmouseover="if(!${isReadOnly}) this.style.background='#eff6ff'; if(!${isReadOnly}) this.style.borderColor='#2563eb';"
                           onmouseout="if(!${isReadOnly}) this.style.background='#f9fafb'; if(!${isReadOnly}) this.style.borderColor='#e5e7eb';">
                        <input type="checkbox" id="generateICS" ${requestData?.generateICS ? 'checked' : ''} ${isReadOnly ? 'disabled' : ''} 
                               style="width: 16px; height: 16px; cursor: ${isReadOnly ? 'not-allowed' : 'pointer'};">
                        <span style="font-size: 14px; font-weight: 500; color: #374151;">ICS</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; ${isReadOnly ? 'opacity: 0.6; cursor: not-allowed;' : ''}"
                           onmouseover="if(!${isReadOnly}) this.style.background='#eff6ff'; if(!${isReadOnly}) this.style.borderColor='#2563eb';"
                           onmouseout="if(!${isReadOnly}) this.style.background='#f9fafb'; if(!${isReadOnly}) this.style.borderColor='#e5e7eb';">
                        <input type="checkbox" id="generateRIS" ${requestData?.generateRIS ? 'checked' : ''} ${isReadOnly ? 'disabled' : ''} 
                               style="width: 16px; height: 16px; cursor: ${isReadOnly ? 'not-allowed' : 'pointer'};">
                        <span style="font-size: 14px; font-weight: 500; color: #374151;">RIS</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; ${isReadOnly ? 'opacity: 0.6; cursor: not-allowed;' : ''}"
                           onmouseover="if(!${isReadOnly}) this.style.background='#eff6ff'; if(!${isReadOnly}) this.style.borderColor='#2563eb';"
                           onmouseout="if(!${isReadOnly}) this.style.background='#f9fafb'; if(!${isReadOnly}) this.style.borderColor='#e5e7eb';">
                        <input type="checkbox" id="generatePAR" ${requestData?.generatePAR ? 'checked' : ''} ${isReadOnly ? 'disabled' : ''} 
                               style="width: 16px; height: 16px; cursor: ${isReadOnly ? 'not-allowed' : 'pointer'};">
                        <span style="font-size: 14px; font-weight: 500; color: #374151;">PAR</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; ${isReadOnly ? 'opacity: 0.6; cursor: not-allowed;' : ''}"
                           onmouseover="if(!${isReadOnly}) this.style.background='#eff6ff'; if(!${isReadOnly}) this.style.borderColor='#2563eb';"
                           onmouseout="if(!${isReadOnly}) this.style.background='#f9fafb'; if(!${isReadOnly}) this.style.borderColor='#e5e7eb';">
                        <input type="checkbox" id="generateIAR" ${requestData?.generateIAR ? 'checked' : ''} ${isReadOnly ? 'disabled' : ''} 
                               style="width: 16px; height: 16px; cursor: ${isReadOnly ? 'not-allowed' : 'pointer'};">
                        <span style="font-size: 14px; font-weight: 500; color: #374151;">IAR</span>
                    </label>
                </div>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer" style="padding: 20px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn-secondary" onclick="closePurchaseOrderModal()" style="padding: 10px 24px; font-weight: 500; border-radius: 8px; transition: all 0.2s;">
                <i data-lucide="${isReadOnly ? 'x' : 'x'}" style="width: 16px; height: 16px;"></i>
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="savePurchaseOrder('${requestData?.id || ''}')" style="padding: 10px 24px; font-weight: 500; border-radius: 8px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); box-shadow: 0 4px 6px rgba(37, 99, 235, 0.25); transition: all 0.2s;">
                    <i data-lucide="${mode === 'create' ? 'plus' : 'save'}" style="width: 16px; height: 16px;"></i>
                    ${mode === 'create' ? 'Create Purchase Order' : 'Update Purchase Order'}
                </button>
            ` : ''}
        </div>

    `;
}

// Purchase Order Modal item management
function initializePurchaseOrderModal(requestData = null, options = {}) {
    const { skipRender = false } = options;
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

    if (!skipRender) {
        renderPOItems();
    }
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
    showAlert('New item added to purchase order!', 'info');
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

    if (field === 'stockPropertyNumber') {
        const stockItem = MockData.inventory.find(inv => inv.stockNumber === value);
        if (stockItem) {
            item.description = stockItem.name;
            item.unit = stockItem.unit;
            item.currentStock = stockItem.currentStock;
        }
    }

    if (field === 'quantity' || field === 'unitCost') {
        item.amount = (item.quantity || 0) * (item.unitCost || 0);
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
              class="form-input" 
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
    const newItems = AppState.purchaseOrderItems.filter(item => item.currentStock === 0 && item.stockPropertyNumber).length;
    const totalQuantity = AppState.purchaseOrderItems.reduce((sum, item) => sum + item.quantity, 0);

    summary.innerHTML = `
        <div>
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

    // Retrieve input values using new IDs from enhanced modal
    const supplier = document.getElementById('supplierName')?.value || '';
    const supplierAddress = document.getElementById('supplierAddress')?.value || '';
    const supplierTIN = document.getElementById('supplierTIN')?.value || '';
    const poNumber = document.getElementById('poNumber')?.value || '';
    const purchaseDate = document.getElementById('purchaseDate')?.value || '';
    const procurementMode = document.getElementById('procurementMode')?.value || '';
    const department = document.getElementById('departmentSelect')?.value || '';
    const gentlemen = document.getElementById('gentlemen')?.value || '';
    const placeOfDelivery = document.getElementById('placeOfDelivery')?.value || '';
    const deliveryDate = document.getElementById('deliveryDate')?.value || '';
    const deliveryTerm = document.getElementById('deliveryTerm')?.value || '';
    const paymentTerm = document.getElementById('paymentTerm')?.value || '';
    const fundCluster = document.getElementById('fundCluster')?.value || '';
    const fundsAvailable = document.getElementById('fundsAvailable')?.value || '';
    const fundNotes = document.getElementById('fundNotes')?.value || '';
    const orsNo = document.getElementById('orsNo')?.value || '';
    const orsDate = document.getElementById('orsDate')?.value || '';
    const orsAmount = document.getElementById('orsAmount')?.value || '';
    const generateICS = document.getElementById('generateICS')?.checked || false;
    const generateRIS = document.getElementById('generateRIS')?.checked || false;
    const generatePAR = document.getElementById('generatePAR')?.checked || false;
    const generateIAR = document.getElementById('generateIAR')?.checked || false;

    const totalAmount = AppState.purchaseOrderItems.reduce((sum, item) => sum + item.amount, 0);

    let finalPoNumber = poNumber;
    if (!existingId && !poNumber) {
        finalPoNumber = generateNewPONumber();
        const poInput = document.getElementById('poNumber');
        if (poInput) poInput.value = finalPoNumber;
    }

    if (existingId) {
        // Update existing request
        console.log(`[UPDATE] Updating Request ID: ${existingId}`);
        const idx = AppState.newRequests.findIndex(r => r.id === existingId);
        if (idx !== -1) {
            AppState.newRequests[idx] = {
                ...AppState.newRequests[idx],
                supplier,
                supplierAddress,
                supplierTIN,
                poNumber: finalPoNumber,
                purchaseDate,
                procurementMode,
                department,
                gentlemen,
                placeOfDelivery,
                deliveryDate,
                deliveryTerm,
                paymentTerm,
                fundCluster,
                fundsAvailable,
                notes: fundNotes,
                orsNo,
                orsDate,
                orsAmount,
                generateICS,
                generateRIS,
                generatePAR,
                generateIAR,
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
            poNumber: finalPoNumber,
            supplier,
            supplierAddress,
            supplierTIN,
            purchaseDate,
            procurementMode,
            requestDate: new Date().toISOString().split('T')[0],
            department,
            gentlemen,
            placeOfDelivery,
            deliveryDate,
            deliveryTerm,
            paymentTerm,
            fundCluster,
            fundsAvailable,
            notes: fundNotes,
            orsNo,
            orsDate,
            orsAmount,
            generateICS,
            generateRIS,
            generatePAR,
            generateIAR,
            totalAmount,
            status: "submitted",
            requestedBy: "Current User",
            items: [...AppState.purchaseOrderItems]
        };
        AppState.newRequests.push(newRequest);
    }

    // Show success alert
    if (existingId) {
        showAlert('Purchase order updated successfully!', 'success');
    } else {
        showAlert(`New purchase order ${finalPoNumber} created successfully!`, 'success');
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
            const rowBg = (index % 2 === 0) ? 'background-color: white;' : 'background-color: #f9fafb;';
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
                        <button class="icon-action-btn icon-action-danger" title="Delete">
                            <i data-lucide="trash-2"></i>
                        </button>
                        <button class="icon-action-btn icon-action-warning" title="Edit">
                            <i data-lucide="edit"></i>
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
        AppState.rejectedRequests = AppState.rejectedRequests || [];
        AppState.rejectedRequests.push(request);
        AppState.newRequests.splice(idx, 1);
    } else {
        const pidx = AppState.pendingRequests.findIndex(r => r.id === requestId);
        if (pidx !== -1) {
            request = AppState.pendingRequests[pidx];
            request.status = 'rejected';
            request.rejectedBy = 'Approver User';
            request.rejectedDate = new Date().toISOString().split('T')[0];
            AppState.rejectedRequests = AppState.rejectedRequests || [];
            AppState.rejectedRequests.push(request);
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

// Enhanced: added optional second parameter for clean print (removes toolbar & page title)
// Usage: downloadPO('PO-123'); // clean by default
//        downloadPO('PO-123', { clean: false }); // old behaviour with toolbar
function downloadPO(requestId, opts = {}) {
    const clean = opts.clean !== undefined ? !!opts.clean : true; // default to clean output
    // Locate request in any collection
    const request = (AppState.newRequests || []).concat(AppState.pendingRequests || [], AppState.completedRequests || [])
        .find(r => r.id === requestId);
    if (!request) {
        showAlert(`Purchase Order ${requestId} not found.`, 'error');
        return;
    }

    const currentUser = AppState.currentUser || {};
    const poNumber = request.poNumber || 'PO-UNKNOWN';

    const poData = {
        supplier: request.supplier || '',
        poNumber: request.poNumber || '',
        address: request.supplierAddress || '',
        dateOfPurchase: request.purchaseDate || request.requestDate || '',
        tinNumber: request.supplierTIN || '',
        modeOfPayment: request.procurementMode || '',
        placeOfDelivery: request.placeOfDelivery || '',
        deliveryTerm: request.deliveryTerm || '',
        dateOfDelivery: request.deliveryDate || '',
        paymentTerm: request.paymentTerm || '',
        fundCluster: request.fundCluster || '',
        orsBursNo: request.orsNo || '',
        fundsAvailable: request.fundsAvailable || '',
        orsBursDate: request.orsDate || '',
        orsBursAmount: request.orsAmount || '',
        notes: request.notes || '',
        items: (request.items || []).map(it => ({
            stockPropertyNumber: it.stockPropertyNumber || '',
            unit: it.unit || '',
            description: it.description || it.detailedDescription || '',
            quantity: it.quantity || 0,
            unitCost: it.unitCost || 0,
            amount: it.amount || ((it.quantity || 0) * (it.unitCost || 0))
        }))
    };

    const signatures = {
        authorization: currentUser.role && /president/i.test(currentUser.role) ? currentUser.name : '________________________',
        accountant: currentUser.role && /accountant/i.test(currentUser.role) ? currentUser.name : '________________________',
        supplier: '________________________'
    };

    function esc(str) { return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function fmtMoney(v) { if (v === undefined || v === null || v === '') return ''; return '₱' + Number(v).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function fmtDate(d) { if (!d) return ''; const dt = new Date(d); if (isNaN(dt)) return esc(d); return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }

    function buildItems(poData) {
        const rows = poData.items.map(it => `
            <tr>
                <td class=\"table-cell-border text-center h-8\">${esc(it.stockPropertyNumber)}</td>
                <td class=\"table-cell-border text-center h-8\">${esc(it.unit)}</td>
                <td class=\"table-cell-border h-8\">${esc(it.description)}</td>
                <td class=\"table-cell-border text-center h-8\">${esc(it.quantity)}</td>
                <td class=\"table-cell-border text-right h-8\">${it.unitCost ? fmtMoney(it.unitCost) : ''}</td>
                <td class=\"table-cell-border-top text-right h-8\">${it.amount ? fmtMoney(it.amount) : ''}</td>
            </tr>`).join('');
        const min = 8 - poData.items.length;
        const fillers = min > 0 ? Array.from({ length: min }).map(() => '<tr><td class=\"table-cell-border h-8\">&nbsp;</td><td class=\"table-cell-border h-8\">&nbsp;</td><td class=\"table-cell-border h-8\">&nbsp;</td><td class=\"table-cell-border h-8\">&nbsp;</td><td class=\"table-cell-border h-8\">&nbsp;</td><td class=\"table-cell-border-top h-8\">&nbsp;</td></tr>').join('') : '';
        return rows + fillers;
    }

    const grandTotal = poData.items.reduce((s, it) => s + (it.amount || 0), 0);

    function buildHTML(filename) {
        const titleText = clean ? '' : esc(filename);
        const toolbarHTML = clean ? '' : `
                <div class=\"toolbar\">
                    <span style=\"font-weight:600;\">Purchase Order Export</span>
                    <label>Filename: <input id=\"po-filename-input\" value='${esc(filename)}' style='width:180px'></label>
                    <button class=\"secondary\" onclick=\"window.print()\">Print / PDF</button>
                </div>`;
        return `<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>${titleText}</title><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><style>
                @page { size: A4 portrait; margin: 16mm 14mm 18mm 14mm; }
                html, body { height:100%; }
                body{margin:0;font-family:'Times New Roman',Times,serif;font-size:10px;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
                .page-wrapper{max-width:210mm;margin:0 auto;}
                .purchase-order-doc{background:#fff;padding:14px 16px;box-sizing:border-box;}
                table{border-collapse:collapse;width:100%;}
                td{vertical-align:top;}
                .table-cell-border{border-right:1px solid #000;border-top:1px solid #000;padding:4px;}
                .table-cell-border-right{border-right:1px solid #000;padding:4px;}
                .table-cell-border-top{border-top:1px solid #000;padding:4px;}
                .table-border-2{border:2px solid #000;}
                .text-center{text-align:center;}
                .font-semibold{font-weight:600;}
                .font-bold{font-weight:700;}
                .h-8{height:1.5rem;}
                .toolbar{position:sticky;top:0;background:#f3f4f6;border-bottom:1px solid #d1d5db;padding:8px 12px;display:flex;gap:8px;align-items:center;font-family:system-ui,Arial,sans-serif;font-size:12px;}
                .toolbar button{background:#dc2626;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:4px;}
                .toolbar button.secondary{background:#374151;}
                .toolbar input{padding:4px 6px;font-size:12px;border:1px solid #d1d5db;border-radius:4px;}
                @media print{.toolbar{display:none!important}.purchase-order-doc{border:none;padding:0;}.purchase-order-container{padding:0;margin:0;} body{margin:0;} }
                /* Attempt to neutralize default print headers (user must still disable in dialog for full removal) */
                </style></head><body>
                ${toolbarHTML}
                <div class=\"purchase-order-container page-wrapper\" style=\"padding:0 2mm;\">
                    <div class=\"purchase-order-doc table-border-2\" style=\"border:1px solid #ccc;font-size:12px;\">
                        <div style=\"text-align:center;margin-bottom:16px;\"><h1 style=\"font-size:14px;font-weight:700;margin:0 0 6px;\">PURCHASE ORDER</h1><p style=\"font-size:12px;text-decoration:underline;margin:0 0 3px;\">Camarines Norte State College</p><p style=\"font-size:10px;font-style:italic;margin:0;color:#444\">Entity Name</p></div>
                        <div class=\"table-border-2\" style=\"border:2px solid #000;\"><table style=\"font-size:11px;\"><tbody>
              <tr><td class=\"table-cell-border-right\" style=\"width:15%;font-weight:700;\">Supplier:</td><td colspan=\"3\" class=\"table-cell-border-right\" style=\"width:45%;\">${esc(poData.supplier)}</td><td class=\"table-cell-border-right\" style=\"width:15%;font-weight:700;\">P.O. No.:</td><td style=\"width:25%;padding:4px;\">${esc(poData.poNumber)}</td></tr>
              <tr><td class=\"table-cell-border\" style=\"font-weight:700;\">Address:</td><td colspan=\"3\" class=\"table-cell-border-right table-cell-border-top\">${esc(poData.address)}</td><td class=\"table-cell-border-right table-cell-border-top\" style=\"font-weight:700;\">Date:</td><td class=\"table-cell-border-top\">${fmtDate(poData.dateOfPurchase)}</td></tr>
              <tr><td class=\"table-cell-border\" style=\"font-weight:700;\">TIN:</td><td colspan=\"3\" class=\"table-cell-border-right table-cell-border-top\">${esc(poData.tinNumber)}</td><td class=\"table-cell-border-right table-cell-border-top\" style=\"font-weight:700;\">Mode of Procurement:</td><td class=\"table-cell-border-top\">${esc(poData.modeOfPayment)}</td></tr>
              <tr><td colspan=\"6\" class=\"table-cell-border-top\" style=\"padding:12px;\"><strong style=\"font-size:12px;\">Gentlemen:</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please furnish this Office the following articles subject to the terms and conditions contained herein:</td></tr>
              <tr><td class=\"table-cell-border\" style=\"font-weight:700;\">Place of Delivery:</td><td colspan=\"2\" class=\"table-cell-border-right table-cell-border-top\">${esc(poData.placeOfDelivery)}</td><td class=\"table-cell-border-right table-cell-border-top\" style=\"font-weight:700;\">Delivery Term:</td><td colspan=\"2\" class=\"table-cell-border-top\">${esc(poData.deliveryTerm)}</td></tr>
              <tr><td class=\"table-cell-border\" style=\"font-weight:700;\">Date of Delivery:</td><td colspan=\"2\" class=\"table-cell-border-right table-cell-border-top\">${fmtDate(poData.dateOfDelivery)}</td><td class=\"table-cell-border-right table-cell-border-top\" style=\"font-weight:700;\">Payment Term:</td><td colspan=\"2\" class=\"table-cell-border-top\">${esc(poData.paymentTerm)}</td></tr>
              <tr><td class=\"table-cell-border text-center font-semibold\" style=\"width:13%;\">Stock/Property Number</td><td class=\"table-cell-border text-center font-semibold\" style=\"width:8%;\">Unit</td><td class=\"table-cell-border text-center font-semibold\" style=\"width:39%;\">Description</td><td class=\"table-cell-border text-center font-semibold\" style=\"width:10%;\">Quantity</td><td class=\"table-cell-border text-center font-semibold\" style=\"width:15%;\">Unit Cost</td><td class=\"table-cell-border-top text-center font-semibold\" style=\"width:15%;\">Amount</td></tr>
              ${buildItems(poData)}
              <tr><td colspan=\"5\" class=\"table-cell-border text-right font-semibold\">Grand Total:</td><td class=\"table-cell-border-top text-right font-bold\">${grandTotal ? fmtMoney(grandTotal) : ''}</td></tr>
              ${poData.notes ? `<tr><td class='table-cell-border font-semibold'>Note:</td><td colspan='5' class='table-cell-border-top'>${esc(poData.notes)}</td></tr>` : ''}
                            <tr>
                                <td colspan=\"3\" class=\"table-cell-border text-center\" style=\"padding:16px;height:160px;vertical-align:top;\">
                                    <p style=\"margin-bottom:8px;font-style:italic;font-size:10px;\">In case of failure to make the total delivery within the time specified above, a penalty of one percent (1%) of the total contract price shall be imposed for each day of delay, until the obligation is fully complied with.</p>
                                    <p style=\"margin-bottom:8px;font-style:italic;font-size:10px;\">Conforme:</p>
                                    <div style=\"width:192px;margin:0 auto 8px;height:48px;border-bottom:2px solid #dc2626;\"></div>
                                    <p style=\"font-size:10px;font-style:italic;\">signature over printed name of supplier</p>
                                    <div style=\"margin-top:12px;display:flex;align-items:center;justify-content:center;\"><span style=\"font-size:10px;margin-right:8px;\">Date:</span><span style=\"border-bottom:1px solid black;display:inline-block;width:80px;padding-bottom:2px;\"></span></div>
                                </td>
                                <td colspan=\"3\" class=\"table-cell-border-top text-center\" style=\"padding:16px;height:160px;vertical-align:top;\">
                                    <div style=\"text-align:center;margin-top:48px;\">
                                        <p style=\"margin-bottom:8px;font-style:italic;font-size:10px;\">Very truly yours,</p>
                                        <div style=\"width:192px;margin:0 auto 8px;height:48px;border-bottom:2px solid #dc2626;\"></div>
                                        <p style=\"font-size:10px;font-style:italic;\">signature over printed name of authorization</p>
                                        <p style=\"font-size:10px;font-style:italic;\">College President</p>
                                    </div>
                                </td>
                            </tr>
              <tr><td class=\"table-cell-border font-semibold\" style=\"width:15%;\">Fund Cluster:</td><td class=\"table-cell-border-right table-cell-border-top\" style=\"width:35%;\">${esc(poData.fundCluster)}</td><td class=\"table-cell-border font-semibold\" style=\"width:15%;\">ORS/BURS No.:</td><td colspan=\"3\" class=\"table-cell-border-top\">${esc(poData.orsBursNo)}</td></tr>
              <tr><td class=\"table-cell-border font-semibold\">Funds Available:</td><td class=\"table-cell-border-right table-cell-border-top\">${esc(poData.fundsAvailable)}</td><td class=\"table-cell-border font-semibold text-center\">Date of ORS/BURS:</td><td class=\"table-cell-border\">${fmtDate(poData.orsBursDate)}</td><td class=\"table-cell-border font-semibold text-center\">Amount:</td><td class=\"table-cell-border-top\">${esc(poData.orsBursAmount)}</td></tr>
              <tr><td colspan=\"6\" class=\"table-cell-border-top text-center\" style=\"padding:16px;height:80px;vertical-align:bottom;\"><div style=\"height:48px;border-bottom:2px solid #dc2626;margin:0 auto 4px;width:192px;display:flex;align-items:flex-end;justify-content:center;font-size:10px;\">${esc(signatures.accountant)}</div><p style=\"font-size:10px;font-weight:700;margin:4px 0 0;\">Accountant's Signature</p></td></tr>
            </tbody></table></div>
          </div>
        </div>
        </body></html>`;
    }

    try {
        const filenameBase = poNumber || 'purchase-order';
        const html = buildHTML(filenameBase);
        const w = window.open('', '_blank');
        if (!w) {
            showAlert('Popup blocked. Please allow popups for preview.', 'warning');
            return;
        }
        w.document.open();
        w.document.write(html);
        w.document.close();
        if (clean) {
            try { w.document.title = ''; } catch (e) { /* ignore */ }
            // Optionally auto-trigger print for clean mode
            setTimeout(() => { w.print(); }, 300);
        }
        showAlert('PO preview opened. Use Print / PDF.', 'success');
    } catch (e) {
        console.error('PO preview failed', e);
        showAlert('Failed to open PO preview.', 'error');
    }
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
    initializeSidebarState();
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
        { id: "SA001", group: "Group Juan", name: "Cherry Ann Quila", role: "Leader", email: "cherry@cnsc.edu.ph", department: "IT", status: "Active", created: "2025-01-15" },
        { id: "SA002", group: "Group Juan", name: "Vince Balce", role: "Member", email: "vince@cnsc.edu.ph", department: "Finance", status: "Inactive", created: "2025-02-01" },
        { id: "SA003", group: "Group Juan", name: "Marinel Ledesma", role: "Member", email: "marinel@cnsc.edu.ph", department: "HR", status: "Active", created: "2025-03-10" }
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
                                    <button class="icon-action-btn" title="View" onclick="openUserModal('view', '${member.id}')">
                                        <i data-lucide="eye"></i>
                                    </button>
                                    <button class="icon-action-btn icon-action-warning" title="Edit" onclick="openUserModal('edit', '${member.id}')">
                                        <i data-lucide="edit"></i>
                                    </button>
                                    <button class="icon-action-btn icon-action-danger" title="Delete" onclick="deleteMember('${member.id}')">
                                        <i data-lucide="trash-2"></i>
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
        showAlert(`New user ${userData.name} added successfully!`, 'success');
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
        showAlert('Profile updated successfully!', 'success');
    } else {
        // --- UPDATE EXISTING USER (EDIT) ---
        const existing = window.MockData.users.find(u => u.id === userId);
        if (existing) {
            Object.assign(existing, userData);
            showAlert(`User ${userData.name} updated successfully!`, 'success');
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

// Enhanced User Modal with better design
function generateUserModal(mode = 'view', userData = null) {
    const title = mode === 'create' ? 'Add New User' :
        mode === 'edit' ? 'Edit User Profile' :
            'User Profile';

    const subtitle = mode === 'create' ? 'Create a new user account' :
        mode === 'edit' ? 'Update user information' :
            'View user details';

    const isReadOnly = mode === 'view';

    // Generate initials for avatar
    const initials = userData?.name ?
        userData.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() :
        'NU';

    return `
        <div class="modal-header" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; border-bottom: none; padding: 32px 24px;">
            <div style="display: flex; align-items: center; gap: 16px;">
                ${mode !== 'create' ? `
                    <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600; backdrop-filter: blur(10px);">
                        ${initials}
                    </div>
                ` : ''}
                <div style="flex: 1;">
                    <h2 class="modal-title" style="color: white; font-size: 24px; margin-bottom: 4px;">${title}</h2>
                    <p class="modal-subtitle" style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">${subtitle}</p>
                </div>
            </div>
            <button class="modal-close" onclick="closeUserModal()" style="color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body" style="padding: 32px 24px; background: #f9fafb;">
            <!-- Personal Information Section -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="user" style="width: 18px; height: 18px; color: #dc2626;"></i>
                    Personal Information
                </h3>
                
                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="user-circle" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Full Name
                        </label>
                        <input type="text" class="form-input" id="userName"
                               value="${userData?.name || ''}"
                               placeholder="Enter full name"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>

                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="mail" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Email Address
                        </label>
                        <input type="email" class="form-input" id="userEmail"
                               value="${userData?.email || ''}"
                               placeholder="user@cnsc.edu.ph"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>
            </div>

            <!-- Role & Department Section -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="briefcase" style="width: 18px; height: 18px; color: #dc2626;"></i>
                    Role & Department
                </h3>
                
                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="shield" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Role
                        </label>
                        ${isReadOnly ? `
                            <input type="text" class="form-input" value="${userData?.role || ''}" readonly style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; background: #f9fafb;">
                        ` : `
                            <select class="form-select" id="userRole" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                                <option value="">Select role</option>
                                <option ${userData?.role === 'Admin' ? 'selected' : ''}>Admin</option>
                                <option ${userData?.role === 'Manager' ? 'selected' : ''}>Manager</option>
                                <option ${userData?.role === 'User' ? 'selected' : ''}>User</option>
                                <option ${userData?.role === 'Student Assistant' ? 'selected' : ''}>Student Assistant</option>
                                <option ${userData?.role === 'Viewer' ? 'selected' : ''}>Viewer</option>
                            </select>
                        `}
                    </div>

                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="building" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Department
                        </label>
                        ${isReadOnly ? `
                            <input type="text" class="form-input" value="${userData?.department || ''}" readonly style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; background: #f9fafb;">
                        ` : `
                            <select class="form-select" id="userDepartment" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                                <option value="">Select department</option>
                                <option ${userData?.department === 'IT' ? 'selected' : ''}>IT</option>
                                <option ${userData?.department === 'Procurement' ? 'selected' : ''}>Procurement</option>
                                <option ${userData?.department === 'Finance' ? 'selected' : ''}>Finance</option>
                                <option ${userData?.department === 'HR' ? 'selected' : ''}>HR</option>
                                <option ${userData?.department === 'Admin' ? 'selected' : ''}>Admin</option>
                                <option ${userData?.department === 'Operations' ? 'selected' : ''}>Operations</option>
                            </select>
                        `}
                    </div>
                </div>
            </div>

            <!-- Account Status Section -->
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="settings" style="width: 18px; height: 18px; color: #dc2626;"></i>
                    Account Status
                </h3>
                
                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="activity" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Status
                        </label>
                        ${isReadOnly ? `
                            <span class="badge ${userData?.status === 'Active' ? 'green' : 'red'}" style="display: inline-flex; padding: 8px 16px; font-size: 14px;">
                                <i data-lucide="${userData?.status === 'Active' ? 'check-circle' : 'x-circle'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                                ${userData?.status || 'Inactive'}
                            </span>
                        ` : `
                            <select class="form-select" id="userStatus" style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;">
                                <option value="Active" ${userData?.status === 'Active' ? 'selected' : ''}>Active</option>
                                <option value="Inactive" ${userData?.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                            </select>
                        `}
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="calendar" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            ${mode === 'create' ? 'Join Date' : 'Created Date'}
                        </label>
                        <input type="date" class="form-input" id="userCreated"
                               value="${userData?.created || new Date().toISOString().split('T')[0]}"
                               min="${new Date().toISOString().split('T')[0]}"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s; ${isReadOnly ? 'background: #f9fafb;' : ''}"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-footer" style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 24px; display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn-secondary" onclick="closeUserModal()" style="padding: 10px 24px; font-weight: 500; border: 2px solid #d1d5db; transition: all 0.2s;">
                <i data-lucide="${isReadOnly ? 'x' : 'arrow-left'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="saveUser('${userData?.id || ''}')" style="padding: 10px 24px; font-weight: 500; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); box-shadow: 0 4px 6px rgba(220, 38, 38, 0.25); transition: all 0.2s;">
                    <i data-lucide="${mode === 'create' ? 'user-plus' : 'save'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                    ${mode === 'create' ? 'Add User' : 'Save Changes'}
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
        { name: "John Doe", email: "john@cnsc.edu.ph", role: "Admin", department: "IT", status: "Active", created: "2025-01-15" },
        { name: "Jane Smith", email: "jane@cnsc.edu.ph", role: "Manager", department: "Procurement", status: "Active", created: "2025-01-10" },
        { name: "Bob Johnson", email: "bob@cnsc.edu.ph", role: "User", department: "Finance", status: "Inactive", created: "2025-01-05" },
        { name: "Alice Brown", email: "alice@cnsc.edu.ph", role: "User", department: "HR", status: "Active", created: "2025-01-12" }
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
            <!-- Hero Section -->
            <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 48px 32px; text-align: center; border: none;">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h2 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 700; color: white;">SPMO System</h2>
                    <p style="font-size: 18px; line-height: 1.8; margin: 0; opacity: 0.95;">
                        Revolutionizing Inventory & Procurement Management for Camarines Norte State College
                    </p>
                </div>
            </div>

            <!-- Mission & Vision Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 24px;">
                <div class="card" style="border-left: 4px solid #667eea;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; background: #ede9fe; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="target" style="width: 24px; height: 24px; color: #667eea;"></i>
                        </div>
                        <h3 style="margin: 0; font-size: 20px; color: #111827;">Our Mission</h3>
                    </div>
                    <p style="color: #4b5563; line-height: 1.7; margin: 0;">
                        To provide a comprehensive, user-friendly platform that streamlines inventory management, 
                        automates procurement processes, and ensures transparency in resource allocation across 
                        all departments of CNSC.
                    </p>
                </div>

                <div class="card" style="border-left: 4px solid #10b981;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; background: #d1fae5; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="eye" style="width: 24px; height: 24px; color: #10b981;"></i>
                        </div>
                        <h3 style="margin: 0; font-size: 20px; color: #111827;">Our Vision</h3>
                    </div>
                    <p style="color: #4b5563; line-height: 1.7; margin: 0;">
                        To be the leading digital solution for educational institutions, setting the standard 
                        for efficient resource management, data-driven decision making, and operational excellence.
                    </p>
                </div>
            </div>

            <!-- Key Features -->
            <div class="card" style="margin-top: 24px;">
                <h3 style="margin: 0 0 24px 0; font-size: 24px; color: #111827; text-align: center;">What We Offer</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
                    <div style="text-align: center; padding: 20px;">
                        <div style="width: 64px; height: 64px; background: #fef3c7; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                            <i data-lucide="package" style="width: 32px; height: 32px; color: #f59e0b;"></i>
                        </div>
                        <h4 style="margin: 0 0 8px 0; color: #111827;">Inventory Management</h4>
                        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                            Real-time tracking of stock levels, automated alerts, and comprehensive inventory reports
                        </p>
                    </div>

                    <div style="text-align: center; padding: 20px;">
                        <div style="width: 64px; height: 64px; background: #dbeafe; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                            <i data-lucide="shopping-cart" style="width: 32px; height: 32px; color: #3b82f6;"></i>
                        </div>
                        <h4 style="margin: 0 0 8px 0; color: #111827;">Procurement Automation</h4>
                        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                            Streamlined purchase order creation, approval workflows, and vendor management
                        </p>
                    </div>

                    <div style="text-align: center; padding: 20px;">
                        <div style="width: 64px; height: 64px; background: #fce7f3; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                            <i data-lucide="bar-chart-3" style="width: 32px; height: 32px; color: #ec4899;"></i>
                        </div>
                        <h4 style="margin: 0 0 8px 0; color: #111827;">Analytics & Reporting</h4>
                        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                            Powerful dashboards and customizable reports for data-driven decisions
                        </p>
                    </div>

                    <div style="text-align: center; padding: 20px;">
                        <div style="width: 64px; height: 64px; background: #d1fae5; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                            <i data-lucide="users" style="width: 32px; height: 32px; color: #10b981;"></i>
                        </div>
                        <h4 style="margin: 0 0 8px 0; color: #111827;">Multi-User Access</h4>
                        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                            Role-based permissions ensuring secure and organized collaboration
                        </p>
                    </div>
                </div>
            </div>

            <!-- Team Section -->
            <div class="card" style="margin-top: 24px;">
                <h3 style="margin: 0 0 8px 0; font-size: 24px; color: #111827; text-align: center;">Meet the Team</h3>
                <p style="text-align: center; color: #6b7280; margin: 0 0 32px 0;">The dedicated professionals behind SPMO System</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
                    <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 12px; border: 2px solid #e5e7eb; transition: all 0.3s;">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; font-weight: 700; color: white;">
                            CQ
                        </div>
                        <h4 style="margin: 0 0 4px 0; color: #111827; font-size: 18px;">Cherry Ann Quila</h4>
                        <p style="margin: 0 0 12px 0; color: #667eea; font-weight: 600; font-size: 14px;">QA & Papers</p>
                        <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                            Leading QA initiatives to maintain excellence and alignment in all project and paper outputs.
                        </p>
                    </div>

                    <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 12px; border: 2px solid #e5e7eb; transition: all 0.3s;">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; font-weight: 700; color: white;">
                            VB
                        </div>
                        <h4 style="margin: 0 0 4px 0; color: #111827; font-size: 18px;">Vince Balce</h4>
                        <p style="margin: 0 0 12px 0; color: #3b82f6; font-weight: 600; font-size: 14px;">Project Lead/Lead Developer</p>
                        <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                            Leading the Strategic direction and ensuring project success & Architecting and developing robust system features
                        </p>
                    </div>

                    <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 12px; border: 2px solid #e5e7eb; transition: all 0.3s;">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; font-weight: 700; color: white;">
                            ML
                        </div>
                        <h4 style="margin: 0 0 4px 0; color: #111827; font-size: 18px;">Marinel Ledesma</h4>
                        <p style="margin: 0 0 12px 0; color: #ec4899; font-weight: 600; font-size: 14px;">Co Developer & Documentation</p>
                        <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                            Ensuring quality standards and comprehensive support for development and prepared clear project documentation.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Contact Section -->
            <div class="card" style="margin-top: 24px; background: #f9fafb; border: 2px solid #e5e7eb;">
                <div style="text-align: center; max-width: 600px; margin: 0 auto;">
                    <div style="width: 64px; height: 64px; background: #667eea; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <i data-lucide="mail" style="width: 32px; height: 32px; color: white;"></i>
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">Get in Touch</h3>
                    <p style="margin: 0 0 24px 0; color: #6b7280; line-height: 1.6;">
                        Have questions or need support? We're here to help!
                    </p>
                    
                    <div style="display: grid; gap: 16px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: white; border-radius: 8px;">
                            <div style="width: 40px; height: 40px; background: #ede9fe; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="building-2" style="width: 20px; height: 20px; color: #667eea;"></i>
                            </div>
                            <div>
                                <p style="margin: 0; font-weight: 600; color: #111827; font-size: 14px;">Institution</p>
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">Camarines Norte State College - Supply and Property Management Office</p>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: white; border-radius: 8px;">
                            <div style="width: 40px; height: 40px; background: #dbeafe; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="mail" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                            </div>
                            <div>
                                <p style="margin: 0; font-weight: 600; color: #111827; font-size: 14px;">Email</p>
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">cnsc.spmo@.edu.ph</p>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: white; border-radius: 8px;">
                            <div style="width: 40px; height: 40px; background: #d1fae5; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="phone" style="width: 20px; height: 20px; color: #10b981;"></i>
                            </div>
                            <div>
                                <p style="margin: 0; font-weight: 600; color: #111827; font-size: 14px;">Phone</p>
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">(054) 123-4567</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Note -->
            <div style="margin-top: 32px; padding: 24px; text-align: center; background: linear-gradient(to right, #f9fafb, #f3f4f6, #f9fafb); border-radius: 12px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    © ${currentYear} SPMO System - Camarines Norte State College. All rights reserved.
                </p>
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
        showAlert(`Product "${name}" (${newId}) added successfully!`, 'success');
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
            showAlert(`Product "${name}" updated successfully!`, 'success');
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

// Enhanced Product Modal with modern design
function generateProductModal(mode = 'create', productData = null) {
    const title = mode === 'create' ? 'Add New Product' :
        mode === 'edit' ? 'Edit Product' : 'Product Details';
    const subtitle = mode === 'create' ? 'Add a new product to inventory' :
        mode === 'edit' ? 'Update product information' :
            'View product details';
    const isReadOnly = mode === 'view';

    // Product icon based on type
    const getProductIcon = (type) => {
        if (type === 'expendable') return 'package';
        if (type === 'semi-expendable') return 'box';
        if (type === 'non-expendable') return 'archive';
        return 'package-plus';
    };

    const productIcon = getProductIcon(productData?.type);

    return `
        <div class="modal-header" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; border-bottom: none; padding: 32px 24px;">
            <div style="display: flex; align-items: center; gap: 16px;">
                ${mode !== 'create' && productData ? `
                    <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                        <i data-lucide="${productIcon}" style="width: 32px; height: 32px; color: white;"></i>
                    </div>
                ` : ''}
                <div style="flex: 1;">
                    <h2 class="modal-title" style="color: white; font-size: 24px; margin-bottom: 4px;">${title}</h2>
                    <p class="modal-subtitle" style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">${subtitle}</p>
                </div>
            </div>
            <button class="modal-close" onclick="closeProductModal()" style="color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body" style="padding: 32px 24px; background: #f9fafb;">
            <!-- Basic Product Information -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="info" style="width: 18px; height: 18px; color: #dc2626;"></i>
                    Basic Information
                </h3>
                
                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="package" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Product Name
                        </label>
                        <input type="text" class="form-input" id="productName"
                               value="${productData?.name || ''}"
                               placeholder="e.g., Bond Paper A4"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>

                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="layers" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Category
                        </label>
                        <select class="form-select" id="productCategory" ${isReadOnly ? 'disabled' : ''} style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s; ${isReadOnly ? 'background: #f9fafb;' : ''}">
                            <option value="">Select category</option>
                            <option value="expendable" ${productData?.type === 'expendable' ? 'selected' : ''}>Expendable</option>
                            <option value="semi-expendable" ${productData?.type === 'semi-expendable' ? 'selected' : ''}>Semi-Expendable</option>
                            <option value="non-expendable" ${productData?.type === 'non-expendable' ? 'selected' : ''}>Non-Expendable</option>
                        </select>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="file-text" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Description
                    </label>
                    <textarea class="form-textarea" id="productDescription"
                              placeholder="Provide detailed product description..."
                              style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; min-height: 100px; transition: all 0.2s; ${isReadOnly ? 'background: #f9fafb;' : ''}"
                              ${isReadOnly ? 'readonly' : ''}>${productData?.description || ''}</textarea>
                </div>
            </div>

            <!-- Pricing & Inventory -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="dollar-sign" style="width: 18px; height: 18px; color: #dc2626;"></i>
                    Pricing & Inventory
                </h3>
                
                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="tag" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Unit Cost
                        </label>
                        <input type="number" class="form-input" id="productUnitCost"
                               step="0.01" min="0"
                               value="${productData?.unitCost || ''}"
                               placeholder="0.00"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>

                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="hash" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Quantity
                        </label>
                        <input type="number" class="form-input" id="productQuantity"
                               min="1"
                               value="${productData?.quantity || ''}"
                               placeholder="1"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="calendar" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Date Added
                        </label>
                        <input type="date" class="form-input" id="productDate"
                               value="${productData?.date || new Date().toISOString().split('T')[0]}"
                               min="${new Date().toISOString().split('T')[0]}"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s; ${isReadOnly ? 'background: #f9fafb;' : ''}"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="calculator" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Total Value
                        </label>
                        <input type="text" class="form-input" id="productTotalValue"
                               value="${productData ? formatCurrency(productData.totalValue || 0) : '₱0.00'}"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; background: #f9fafb; font-weight: 600; color: #059669;"
                               readonly>
                    </div>
                </div>
            </div>

            <!-- Product Info Box -->
            ${productData?.id ? `
                <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #2563eb;">
                    <div style="display: flex; align-items: start; gap: 12px;">
                        <i data-lucide="info" style="width: 20px; height: 20px; color: #1e40af; flex-shrink: 0; margin-top: 2px;"></i>
                        <div>
                            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1e3a8a;">Product ID: ${productData.id}</h4>
                            <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.5;">
                                This product is categorized as <strong>${productData.type ? productData.type.charAt(0).toUpperCase() + productData.type.slice(1) : 'N/A'}</strong> and is currently ${productData.quantity > 0 ? 'in stock' : 'out of stock'}.
                            </p>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>

        <div class="modal-footer" style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 24px; display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn-secondary" onclick="closeProductModal()" style="padding: 10px 24px; font-weight: 500; border: 2px solid #d1d5db; transition: all 0.2s;">
                <i data-lucide="${isReadOnly ? 'x' : 'arrow-left'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="saveProduct('${productData?.id || ''}')" style="padding: 10px 24px; font-weight: 500; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); box-shadow: 0 4px 6px rgba(220, 38, 38, 0.25); transition: all 0.2s;">
                    <i data-lucide="${mode === 'create' ? 'plus-circle' : 'save'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                    ${mode === 'create' ? 'Add Product' : 'Save Changes'}
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
// Enhanced Category Modal with modern design
function generateCategoryModal(mode = 'create', categoryData = null) {
    const title = mode === 'create' ? 'Add New Category' :
        mode === 'edit' ? 'Edit Category' : 'Category Details';
    const subtitle = mode === 'create' ? 'Create a new inventory category' :
        mode === 'edit' ? 'Update category information' :
            'View category details';
    const isReadOnly = mode === 'view';

    // Category icon based on category name
    const getCategoryIcon = (name) => {
        if (!name) return 'folder-plus';
        const lowerName = name.toLowerCase();
        if (lowerName.includes('expendable')) return 'package';
        if (lowerName.includes('semi')) return 'box';
        if (lowerName.includes('non')) return 'archive';
        return 'folder';
    };

    const categoryIcon = getCategoryIcon(categoryData?.name);

    return `
        <div class="modal-header" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; border-bottom: none; padding: 32px 24px;">
            <div style="display: flex; align-items: center; gap: 16px;">
                ${mode !== 'create' ? `
                    <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                        <i data-lucide="${categoryIcon}" style="width: 32px; height: 32px; color: white;"></i>
                    </div>
                ` : ''}
                <div style="flex: 1;">
                    <h2 class="modal-title" style="color: white; font-size: 24px; margin-bottom: 4px;">${title}</h2>
                    <p class="modal-subtitle" style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">${subtitle}</p>
                </div>
            </div>
            <button class="modal-close" onclick="closeCategoryModal()" style="color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body" style="padding: 32px 24px; background: #f9fafb;">
            <!-- Category Information Section -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="tag" style="width: 18px; height: 18px; color: #dc2626;"></i>
                    Category Information
                </h3>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="bookmark" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Category Name
                    </label>
                    <input type="text" class="form-input" id="categoryName"
                           value="${categoryData?.name || ''}"
                           placeholder="e.g., Expendable, Semi-Expendable, Non-Expendable"
                           style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="file-text" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Description
                    </label>
                    <textarea class="form-textarea" id="categoryDescription"
                              placeholder="Describe the purpose and criteria for this category..."
                              style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; min-height: 120px; transition: all 0.2s; ${isReadOnly ? 'background: #f9fafb;' : ''}"
                              ${isReadOnly ? 'readonly' : ''}>${categoryData?.description || ''}</textarea>
                    <p style="margin: 6px 0 0 0; font-size: 12px; color: #6b7280; display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="info" style="width: 12px; height: 12px;"></i>
                        Provide clear guidelines for items that belong to this category
                    </p>
                </div>
            </div>

            <!-- Category Guidelines (shown in view/edit mode) -->
            ${categoryData?.id ? `
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
                    <div style="display: flex; align-items: start; gap: 12px;">
                        <i data-lucide="lightbulb" style="width: 20px; height: 20px; color: #d97706; flex-shrink: 0; margin-top: 2px;"></i>
                        <div>
                            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #92400e;">Category ID: ${categoryData.id}</h4>
                            <p style="margin: 0; font-size: 13px; color: #78350f; line-height: 1.5;">
                                This category helps organize inventory items based on their type, value, and lifecycle management requirements.
                            </p>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>

        <div class="modal-footer" style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 24px; display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn-secondary" onclick="closeCategoryModal()" style="padding: 10px 24px; font-weight: 500; border: 2px solid #d1d5db; transition: all 0.2s;">
                <i data-lucide="${isReadOnly ? 'x' : 'arrow-left'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="saveCategory('${categoryData?.id || ''}')" style="padding: 10px 24px; font-weight: 500; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); box-shadow: 0 4px 6px rgba(220, 38, 38, 0.25); transition: all 0.2s;">
                    <i data-lucide="${mode === 'create' ? 'plus-circle' : 'save'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                    ${mode === 'create' ? 'Add Category' : 'Save Changes'}
                </button>
            ` : ''}
        </div>
    `;
}

function saveCategory(categoryId) {
    // Grab input values using the IDs
    const modal = document.getElementById('category-modal');
    const nameInput = modal.querySelector('#categoryName');
    const descriptionInput = modal.querySelector('#categoryDescription');

    const name = nameInput ? nameInput.value : '';
    const description = descriptionInput ? descriptionInput.value : '';

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
        showAlert(`Category "${name.trim()}" added successfully!`, 'success');
    } else {
        // Update existing
        const existing = MockData.categories.find(c => c.id === categoryId);
        if (existing) {
            existing.name = name.trim();
            existing.description = description.trim();
            showAlert(`Category "${name.trim()}" updated successfully!`, 'success');
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

// Enhanced Stock In Modal with modern design
function generateStockInModal(mode = 'create', stockData = null) {
    const title = mode === 'create' ? 'Stock In Entry' :
        mode === 'edit' ? 'Edit Stock In' : 'Stock In Details';
    const subtitle = mode === 'create' ? 'Record incoming inventory' :
        mode === 'edit' ? 'Update stock in transaction' :
            'View stock in details';
    const isReadOnly = mode === 'view';
    const dateValue = stockData?.date || (mode === 'create' ? new Date().toISOString().split('T')[0] : '');
    const unitCostValue = (stockData?.unitCost || 0).toFixed(2);
    const totalValue = stockData ? formatCurrency(stockData.totalCost || 0) : formatCurrency(0);

    return `
        <div class="modal-header" style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; border-bottom: none; padding: 32px 24px;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                    <i data-lucide="arrow-down-circle" style="width: 32px; height: 32px; color: white;"></i>
                </div>
                <div style="flex: 1;">
                    <h2 class="modal-title" style="color: white; font-size: 24px; margin-bottom: 4px;">${title}</h2>
                    <p class="modal-subtitle" style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">${subtitle}</p>
                </div>
            </div>
            <button class="modal-close" onclick="closeStockInModal()" style="color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body" style="padding: 32px 24px; background: #f9fafb;">
            <!-- Transaction Information -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="clipboard-list" style="width: 18px; height: 18px; color: #16a34a;"></i>
                    Transaction Details
                </h3>
                
                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="calendar" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Date
                        </label>
                        <input type="date" class="form-input" id="date-input"
                               value="${dateValue}"
                               min="${new Date().toISOString().split('T')[0]}"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="barcode" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            SKU
                        </label>
                        <input type="text" class="form-input" id="sku-input"
                               value="${stockData?.sku || ''}"
                               placeholder="e.g., E001, SE01, N001"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="package" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Product Name
                    </label>
                    <input type="text" class="form-input" id="product-input"
                           value="${stockData?.productName || ''}"
                           placeholder="Enter product name"
                           style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
            </div>

            <!-- Quantity & Pricing -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="calculator" style="width: 18px; height: 18px; color: #16a34a;"></i>
                    Quantity & Pricing
                </h3>
                
                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="hash" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Quantity
                        </label>
                        <input type="number" class="form-input" id="qty-input"
                               min="1"
                               value="${stockData?.quantity || ''}"
                               placeholder="1"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="tag" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Unit Cost
                        </label>
                        <input type="number" class="form-input" id="uc-input"
                               step="0.01" min="0"
                               value="${unitCostValue}"
                               placeholder="0.00"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="dollar-sign" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Total Cost
                    </label>
                    <input type="text" class="form-input" id="total-input"
                           value="${totalValue}"
                           style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; background: #f0fdf4; font-weight: 600; color: #16a34a;"
                           readonly>
                </div>
            </div>

            <!-- Supplier & Receiver -->
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="users" style="width: 18px; height: 18px; color: #16a34a;"></i>
                    Supplier & Receiver
                </h3>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="truck" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Supplier
                    </label>
                    <input type="text" class="form-input" id="supplier-input"
                           value="${stockData?.supplier || ''}"
                           placeholder="Enter supplier name"
                           style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="user-check" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Received By
                    </label>
                    <input type="text" class="form-input" id="receivedby-input"
                           value="${stockData?.receivedBy || ''}"
                           placeholder="Enter receiver name"
                           style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
            </div>
        </div>

        <div class="modal-footer" style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 24px; display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn-secondary" onclick="closeStockInModal()" style="padding: 10px 24px; font-weight: 500; border: 2px solid #d1d5db; transition: all 0.2s;">
                <i data-lucide="${isReadOnly ? 'x' : 'arrow-left'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="saveStockIn('${stockData?.id || ''}')" style="padding: 10px 24px; font-weight: 500; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); box-shadow: 0 4px 6px rgba(22, 163, 74, 0.25); transition: all 0.2s;">
                    <i data-lucide="${mode === 'create' ? 'plus-circle' : 'save'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                    ${mode === 'create' ? 'Add Stock In' : 'Save Changes'}
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
            showAlert(`Stock In record ${newRecord.transactionId} updated successfully!`, 'success');
        }
    } else {
        newRecord.transactionId = generateTransactionId();
        stockInData.push(newRecord);
        showAlert(`New Stock In record ${newRecord.transactionId} added successfully!`, 'success');
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
                    <button class="icon-action-btn icon-action-danger" title="Delete" onclick="deleteStockIn('${r.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                    <button class="icon-action-btn icon-action-warning" title="Edit" onclick="openStockInModal('edit','${r.id}')">
                        <i data-lucide="edit"></i>
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

// Enhanced Stock Out Modal with modern design
function generateStockOutModal(mode = 'create', stockData = null) {
    const title = mode === 'create' ? 'Stock Out Entry' :
        mode === 'edit' ? 'Edit Stock Out' : 'Stock Out Details';
    const subtitle = mode === 'create' ? 'Record outgoing inventory' :
        mode === 'edit' ? 'Update stock out transaction' :
            'View stock out details';
    const isReadOnly = mode === 'view';

    return `
        <div class="modal-header" style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: white; border-bottom: none; padding: 32px 24px;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                    <i data-lucide="arrow-up-circle" style="width: 32px; height: 32px; color: white;"></i>
                </div>
                <div style="flex: 1;">
                    <h2 class="modal-title" style="color: white; font-size: 24px; margin-bottom: 4px;">${title}</h2>
                    <p class="modal-subtitle" style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">${subtitle}</p>
                </div>
            </div>
            <button class="modal-close" onclick="closeStockOutModal()" style="color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <div class="modal-body" style="padding: 32px 24px; background: #f9fafb;">
            <!-- Transaction Information -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="clipboard-list" style="width: 18px; height: 18px; color: #ea580c;"></i>
                    Transaction Details
                </h3>
                
                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="calendar" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Date
                        </label>
                        <input id="so-date" type="date" class="form-input"
                               value="${stockData?.date || new Date().toISOString().split('T')[0]}"
                               min="${new Date().toISOString().split('T')[0]}"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="barcode" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            SKU
                        </label>
                        <input id="so-sku" type="text" class="form-input"
                               value="${stockData?.sku || ''}"
                               placeholder="e.g., E001, SE01, N001"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="package" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Product Name
                    </label>
                    <input id="so-product" type="text" class="form-input"
                           value="${stockData?.productName || ''}"
                           placeholder="Enter product name"
                           style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>
            </div>

            <!-- Quantity & Pricing -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="calculator" style="width: 18px; height: 18px; color: #ea580c;"></i>
                    Quantity & Pricing
                </h3>
                
                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="hash" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Quantity
                        </label>
                        <input id="so-qty" type="number" class="form-input"
                               min="1"
                               value="${stockData?.quantity || ''}"
                               placeholder="1"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="tag" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Unit Cost
                        </label>
                        <input id="so-uc" type="number" class="form-input"
                               step="0.01" min="0"
                               value="${stockData?.unitCost || ''}"
                               placeholder="0.00"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="dollar-sign" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Total Cost
                    </label>
                    <input id="so-total" type="text" class="form-input"
                           value="${stockData ? formatCurrency(stockData.totalCost || 0) : '₱0.00'}"
                           style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; background: #fff7ed; font-weight: 600; color: #ea580c;"
                           readonly>
                </div>
            </div>

            <!-- Department & Personnel -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="building" style="width: 18px; height: 18px; color: #ea580c;"></i>
                    Department & Personnel
                </h3>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="building-2" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Department
                    </label>
                    <input id="so-dept" type="text" class="form-input"
                           value="${stockData?.department || ''}"
                           placeholder="Enter department name"
                           style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                           ${isReadOnly ? 'readonly' : ''}>
                </div>

                <div class="grid-2">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="user" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Issued To
                        </label>
                        <input id="so-issued-to" type="text" class="form-input"
                               value="${stockData?.issuedTo || ''}"
                               placeholder="Employee / Person"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                            <i data-lucide="user-check" style="width: 14px; height: 14px; color: #6b7280;"></i>
                            Issued By
                        </label>
                        <input id="so-issued-by" type="text" class="form-input"
                               value="${stockData?.issuedBy || ''}"
                               placeholder="Staff / Officer"
                               style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s;"
                               ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 500; color: #374151;">
                        <i data-lucide="activity" style="width: 14px; height: 14px; color: #6b7280;"></i>
                        Status
                    </label>
                    <select id="so-status" class="form-select" ${isReadOnly ? 'disabled' : ''} style="border: 2px solid #e5e7eb; padding: 10px 14px; font-size: 14px; transition: all 0.2s; ${isReadOnly ? 'background: #f9fafb;' : ''}">
                        <option value="">Select status</option>
                        <option value="Completed" ${stockData?.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Pending" ${stockData?.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Cancelled" ${stockData?.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="modal-footer" style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 24px; display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn-secondary" onclick="closeStockOutModal()" style="padding: 10px 24px; font-weight: 500; border: 2px solid #d1d5db; transition: all 0.2s;">
                <i data-lucide="${isReadOnly ? 'x' : 'arrow-left'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                ${isReadOnly ? 'Close' : 'Cancel'}
            </button>
            ${!isReadOnly ? `
                <button class="btn btn-primary" onclick="saveStockOut('${stockData?.id || ''}')" style="padding: 10px 24px; font-weight: 500; background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); box-shadow: 0 4px 6px rgba(234, 88, 12, 0.25); transition: all 0.2s;">
                    <i data-lucide="${mode === 'create' ? 'plus-circle' : 'save'}" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                    ${mode === 'create' ? 'Add Stock Out' : 'Save Changes'}
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
            showAlert(`Stock Out record ${record.issueId} updated successfully!`, 'success');
        } else {
            stockOutData.push(record);
            showAlert(`New Stock Out record ${record.issueId} added successfully!`, 'success');
        }
    } else {
        stockOutData.push(record);
        showAlert(`New Stock Out record ${record.issueId} added successfully!`, 'success');
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
                    <button class="icon-action-btn" title="View" onclick="viewStockOutDetails('${s.id}')">
                        <i data-lucide="eye"></i>
                    </button>
                    <button class="icon-action-btn icon-action-warning" title="Edit" onclick="editStockOut('${s.id}')">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="icon-action-btn icon-action-danger" title="Delete" onclick="deleteStockOut('${s.id}')">
                        <i data-lucide="trash-2"></i>
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
    AppState.currentStatusFilter = filter;

    // ✅ Render UI
    mainContent.innerHTML = `
        <div class="status-container">
            <!-- Cards -->
            <div class="status-cards">
                <div class="status-card received" data-status="received">
                    <h3>Received</h3>
                    <div class="count" data-count="received">0</div>
                    <p>Awaiting processing</p>
                </div>
                <div class="status-card finished" data-status="finished">
                    <h3>Finished</h3>
                    <div class="count" data-count="finished">0</div>
                    <p>Successfully completed</p>
                </div>
                <div class="status-card cancelled" data-status="cancelled">
                    <h3>Cancelled</h3>
                    <div class="count" data-count="cancelled">0</div>
                    <p>Request withdrawn</p>
                </div>
                <div class="status-card rejected" data-status="rejected">
                    <h3>Rejected</h3>
                    <div class="count" data-count="rejected">0</div>
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
                    <button class="btn btn-secondary" id="export-status-btn">Export CSV</button>
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
    // Export handler (same behavior as Reports export)
    document.getElementById('export-status-btn')?.addEventListener('click', exportStatusCSV);
    // Card click events to switch filters

    refreshStatusCards();
}

function refreshStatusCards() {
    const counts = (AppState.statusRequests || []).reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});
    ['received', 'finished', 'cancelled', 'rejected'].forEach(s => {
        const el = document.querySelector(`.status-card .count[data-count="${s}"]`);
        if (el) el.textContent = counts[s] || 0;
    });
}

// ===== Dummy Rows =====
function renderStatusRows(status) {
    const list = (AppState.statusRequests || []).filter(r => status === 'all' ? true : r.status === status);
    if (!list.length) return `<tr><td colspan="8" style="text-align:center;padding:16px;color:#6b7280;">No records</td></tr>`;
    const html = list.map(r => {
        const priorityColor = r.priority === 'high' ? 'red' : r.priority === 'medium' ? 'orange' : 'green';
        const showActions = r.status === 'received';
        const actionsHtml = showActions ? `
            <div class="table-actions" style="flex-wrap:wrap;">
                <button class="icon-action-btn" title="View Details" onclick="viewStatusRequest('${r.id}')">
                    <i data-lucide="eye"></i>
                </button>
                <button class="icon-action-btn icon-action-danger" title="Reject" onclick="updateStatusRow('${r.id}','rejected')">
                    <i data-lucide="x-circle"></i>
                </button>
                <button class="icon-action-btn icon-action-warning" title="Cancel" onclick="updateStatusRow('${r.id}','cancelled')">
                    <i data-lucide="ban"></i>
                </button>
                <button class="icon-action-btn icon-action-success" title="Complete" onclick="updateStatusRow('${r.id}','finished')">
                    <i data-lucide="check-circle"></i>
                </button>
            </div>` : `<span class="${getBadgeClass(r.status)}"><i data-lucide="badge-check" style="width:14px;height:14px;"></i>${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>`;
        return `
            <tr data-request-id="${r.id}">
                <td>${r.id}</td>
                <td>${r.requester}</td>
                <td>${r.department}</td>
                <td>${r.item}</td>
                <td><span style="color:${priorityColor};font-weight:bold;">${r.priority.charAt(0).toUpperCase() + r.priority.slice(1)}</span></td>
                <td>${r.updatedAt}</td>
                <td>${actionsHtml}</td>
                <td>${formatCurrency(r.cost || 0)}</td>
        </tr>`;
    }).join('');
    // Defer icon init until injected into DOM (caller will set innerHTML, then we init here with a microtask)
    queueMicrotask(() => { try { lucide.createIcons(); } catch (e) { } });
    return html;
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

// ===== Update Row Status (for Received actions) =====
function updateStatusRow(requestId, newStatus) {
    try {
        const rec = (AppState.statusRequests || []).find(r => r.id === requestId);
        if (!rec) { showAlert('Row not found', 'error'); return; }
        rec.status = newStatus;
        rec.updatedAt = new Date().toISOString().split('T')[0];
        // Re-render current filter view
        const body = document.getElementById('status-table-body');
        if (body) body.innerHTML = renderStatusRows(AppState.currentStatusFilter || 'all');
        // icons already re-init inside renderStatusRows; safeguard:
        try { lucide.createIcons(); } catch (e) { }
        // Update counts on cards
        refreshStatusCards();
        const statusLabel = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        showAlert(`Request ${requestId} marked as ${statusLabel}`, 'success');
    } catch (e) {
        console.error(e);
    }
}

// Lightweight viewer for status management entries
function viewStatusRequest(id) {
    const rec = (AppState.statusRequests || []).find(r => r.id === id);
    if (!rec) { showAlert('Request not found', 'error'); return; }
    let overlay = document.getElementById('status-view-modal');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'status-view-modal';
        overlay.className = 'modal-overlay active';
        overlay.innerHTML = `
            <div class="modal-content compact" role="dialog" aria-modal="true" aria-labelledby="status-view-title">
                <div class="modal-header" style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border-bottom: none; padding: 32px 24px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                            <i data-lucide="eye" style="width: 32px; height: 32px; color: white;"></i>
                        </div>
                        <div style="flex: 1;">
                            <h2 id="status-view-title" class="modal-title" style="color: white; font-size: 24px; margin-bottom: 4px;">Request ${rec.id}</h2>
                            <p class="modal-subtitle" style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">Quick status overview</p>
                        </div>
                    </div>
                    <button class="modal-close" id="status-view-close" aria-label="Close" style="color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: 32px 24px; background: #f9fafb;">
                    <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #111827; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="info" style="width: 18px; height: 18px; color: #2563eb;"></i>
                            Request Details
                        </h3>
                        <dl class="detail-grid" id="status-view-body" style="display: grid; grid-template-columns: 140px 1fr; gap: 16px 24px; margin: 0;"></dl>
                    </div>
                </div>
                <div class="modal-footer" style="padding: 20px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="btn btn-secondary" id="status-view-dismiss" style="padding: 10px 24px; font-weight: 500; border-radius: 8px; transition: all 0.2s;">
                        <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                        Close
                    </button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        // Close on backdrop click
        overlay.addEventListener('click', e => { if (e.target === overlay) closeStatusView(); });
        // Esc key handler
        document.addEventListener('keydown', escHandler);
    } else {
        overlay.classList.add('active');
    }
    const grid = overlay.querySelector('#status-view-body');
    if (grid) {
        grid.innerHTML = `
            <dt style="font-weight: 600; color: #374151; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="package" style="width: 14px; height: 14px; color: #6b7280;"></i>
                Item
            </dt>
            <dd style="margin: 0; color: #111827;">${rec.item}</dd>
            
            <dt style="font-weight: 600; color: #374151; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="user" style="width: 14px; height: 14px; color: #6b7280;"></i>
                Requester
            </dt>
            <dd style="margin: 0; color: #111827;">${rec.requester}</dd>
            
            <dt style="font-weight: 600; color: #374151; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="briefcase" style="width: 14px; height: 14px; color: #6b7280;"></i>
                Department
            </dt>
            <dd style="margin: 0; color: #111827;">${rec.department}</dd>
            
            <dt style="font-weight: 600; color: #374151; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="flag" style="width: 14px; height: 14px; color: #6b7280;"></i>
                Priority
            </dt>
            <dd style="margin: 0;"><span class="badge ${getBadgeClass(rec.priority, 'priority').split(' ').slice(-1)} inline" style="padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;">${rec.priority}</span></dd>
            
            <dt style="font-weight: 600; color: #374151; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="activity" style="width: 14px; height: 14px; color: #6b7280;"></i>
                Status
            </dt>
            <dd style="margin: 0;"><span class="${getBadgeClass(rec.status)} inline" style="padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;">${rec.status}</span></dd>
            
            <dt style="font-weight: 600; color: #374151; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="calendar" style="width: 14px; height: 14px; color: #6b7280;"></i>
                Updated
            </dt>
            <dd style="margin: 0; color: #111827;">${rec.updatedAt}</dd>
            
            <dt style="font-weight: 600; color: #374151; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="dollar-sign" style="width: 14px; height: 14px; color: #6b7280;"></i>
                Est. Cost
            </dt>
            <dd style="margin: 0; color: #16a34a; font-weight: 600; font-size: 15px;">${formatCurrency(rec.cost || 0)}</dd>
        `;
    }
    // Icon refresh
    try { lucide.createIcons(); } catch (e) { }
    overlay.querySelector('#status-view-close').onclick = closeStatusView;
    overlay.querySelector('#status-view-dismiss').onclick = closeStatusView;
    function escHandler(ev) { if (ev.key === 'Escape') { closeStatusView(); } }
    function closeStatusView() {
        overlay.classList.remove('active');
        setTimeout(() => { if (overlay) overlay.remove(); }, 150);
        document.removeEventListener('keydown', escHandler);
    }
}
window.viewStatusRequest = viewStatusRequest;

// View status request details (for status reports)
function viewStatusRequestDetails(requestId) {
    const rec = (AppState.statusRequests || []).find(r => r.id === requestId);
    if (!rec) {
        showAlert('Request not found', 'error');
        return;
    }

    const modal = document.getElementById('purchase-order-modal');
    const modalContent = modal.querySelector('.modal-content');

    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">Request Details: ${rec.id}</h2>
            <button class="modal-close" onclick="closePurchaseOrderModal()">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="grid-2" style="gap: 20px;">
                <div class="form-group">
                    <label class="form-label">Request ID</label>
                    <input type="text" class="form-input" value="${rec.id}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <span class="${getBadgeClass(rec.status)}" style="display: inline-block; margin-top: 8px;">${capitalize(rec.status)}</span>
                </div>
                <div class="form-group">
                    <label class="form-label">Requester</label>
                    <input type="text" class="form-input" value="${rec.requester || ''}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Department</label>
                    <input type="text" class="form-input" value="${rec.department || ''}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Item</label>
                    <input type="text" class="form-input" value="${rec.item || ''}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Priority</label>
                    <span class="${getBadgeClass(rec.priority || 'low', 'priority')}" style="display: inline-block; margin-top: 8px;">${capitalize(rec.priority || 'low')}</span>
                </div>
                <div class="form-group">
                    <label class="form-label">Cost</label>
                    <input type="text" class="form-input" value="${rec.cost ? formatCurrency(rec.cost) : 'N/A'}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Updated At</label>
                    <input type="text" class="form-input" value="${rec.updatedAt || 'N/A'}" readonly>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closePurchaseOrderModal()">Close</button>
        </div>
    `;

    modal.classList.add('active');
    setTimeout(() => lucide.createIcons(), 100);
}

// Make functions globally accessible
window.viewStatusRequestDetails = viewStatusRequestDetails;

// Sidebar and status behavior is handled centrally by the navigation initialization
// (initializeNavigation, toggleNavGroup, navigateToPage and loadPageContent).
// The earlier status-only DOMContentLoaded handler was removed to avoid duplicate listeners.
