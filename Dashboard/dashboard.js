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
    currentProductTab: 'expendable',
    productSearchTerm: '',
    productSortBy: 'Sort By',
    productFilterBy: 'Filter By',
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
        });
    });
    
    // Initialize with dashboard page
    navigateToPage('dashboard');
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
    const group = document.querySelector(`[data-group="${groupId}"]`).closest('.nav-group');
    
    if (AppState.expandedMenus.includes(groupId)) {
        AppState.expandedMenus = AppState.expandedMenus.filter(id => id !== groupId);
        group.classList.remove('expanded');
    } else {
        AppState.expandedMenus.push(groupId);
        group.classList.add('expanded');
    }
}

// Page Content Generation
function loadPageContent(pageId) {
    const mainContent = document.getElementById('main-content');
    
    switch(pageId) {
        case 'dashboard':
            mainContent.innerHTML = generateDashboardPage();
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
        case 'new-request':
            mainContent.innerHTML = generateNewRequestPage();
            break;
        case 'pending-approval':
            mainContent.innerHTML = generatePendingApprovalPage();
            break;
        case 'completed-request':
            mainContent.innerHTML = generateCompletedRequestPage();
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
                <div style="display: flex; align-items: center; gap: 16px;">
                    <!-- Search -->
                    <div style="position: relative;">
                        <i data-lucide="search" style="width: 16px; height: 16px; position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af;"></i>
                        <input type="text" placeholder="Search..." style="padding: 8px 12px 8px 36px; border: 1px solid #d1d5db; border-radius: 6px; width: 256px; font-size: 14px;">
                    </div>
                    
                    <!-- Notifications -->
                    <button class="btn-secondary" style="padding: 8px; border-radius: 50%; position: relative;">
                        <i data-lucide="bell" class="icon"></i>
                        <span style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background-color: #dc2626; border-radius: 50%;"></span>
                    </button>
                    
                    <!-- Settings -->
                    <button class="btn-secondary" style="padding: 8px; border-radius: 50%;">
                        <i data-lucide="settings" class="icon"></i>
                    </button>
                    
                    <!-- User Profile -->
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 32px; height: 32px; background-color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 500;">JD</div>
                        <div style="font-size: 14px;">
                            <p style="font-weight: 500; color: #111827; margin: 0;">John Doe</p>
                            <p style="color: #6b7280; margin: 0;">Student Assistant</p>
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
                            <p class="value">18</p>
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
                <button class="add-product-btn" onclick="openModal('category')">
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
                                        <button class="btn-outline-orange" title="Edit" style="width: 32px; height: 32px; padding: 0; border-radius: 4px;">
                                            <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
                                        </button>
                                        <button class="btn-outline-red" title="Delete" style="width: 32px; height: 32px; padding: 0; border-radius: 4px;">
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
                <button class="add-product-btn" onclick="openModal('product')">
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
                        ${filteredProducts.map((product, index) => `
                            <tr style="${index % 2 === 0 ? 'background-color: white;' : 'background-color: #f9fafb;'}">
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
                        `).join('')}
                    </tbody>
                </table>
                
                <!-- Enhanced Pagination -->
                <div class="enhanced-pagination">
                    <div class="pagination-left">
                        Showing 1 to ${filteredProducts.length}
                    </div>
                    <div class="pagination-right">
                        <button class="pagination-btn" disabled>Previous</button>
                        <button class="pagination-btn active">1</button>
                        <button class="pagination-btn">2</button>
                        <button class="pagination-btn">3</button>
                        <button class="pagination-btn">Next</button>
                    </div>
                </div>
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
                <button class="btn btn-primary" onclick="openModal('stock-in')">
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
                    <tbody>
                        <tr style="background-color: white;">
                            <td style="font-weight: 500;">SI-2025-001</td>
                            <td>2025-01-15</td>
                            <td style="font-weight: 500;">Bond Paper A4</td>
                            <td style="color: #6b7280;">E001</td>
                            <td>20</td>
                            <td>₱250.00</td>
                            <td style="font-weight: 500;">₱5,000.00</td>
                            <td style="color: #6b7280;">ABC Office Supplies</td>
                            <td style="color: #6b7280;">John Doe</td>
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
                        <tr style="background-color: #f9fafb;">
                            <td style="font-weight: 500;">SI-2025-002</td>
                            <td>2025-01-14</td>
                            <td style="font-weight: 500;">Ballpoint Pen Blue</td>
                            <td style="color: #6b7280;">E015</td>
                            <td>50</td>
                            <td>₱25.00</td>
                            <td style="font-weight: 500;">₱1,250.00</td>
                            <td style="color: #6b7280;">ABC Office Supplies</td>
                            <td style="color: #6b7280;">Jane Smith</td>
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
                        <tr style="background-color: white;">
                            <td style="font-weight: 500;">SI-2025-003</td>
                            <td>2025-01-13</td>
                            <td style="font-weight: 500;">Desktop Computer</td>
                            <td style="color: #6b7280;">NE001</td>
                            <td>2</td>
                            <td>₱35,000.00</td>
                            <td style="font-weight: 500;">₱70,000.00</td>
                            <td style="color: #6b7280;">Tech Solutions Inc.</td>
                            <td style="color: #6b7280;">Mike Johnson</td>
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
                    </tbody>
                </table>
                
                <!-- Enhanced Pagination (matching Products page style) -->
                <div class="enhanced-pagination">
                    <div class="pagination-left">
                        Showing 1 to 3 of 3 entries
                    </div>
                    <div class="pagination-right">
                        <button class="pagination-btn" disabled>Previous</button>
                        <button class="pagination-btn active">1</button>
                        <button class="pagination-btn">2</button>
                        <button class="pagination-btn">3</button>
                        <button class="pagination-btn">Next</button>
                    </div>
                </div>
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
                <button class="btn btn-primary" onclick="openModal('stock-out')">
                    <i data-lucide="plus" class="icon"></i>
                    Issue Stock
                </button>
            </div>
        </div>
        
        <div class="page-content">
            <div class="table-container">
                <div class="table-header">
                    <div class="search-container">
                        <input type="text" class="form-input search-input" placeholder="Search stock issues...">
                        <i data-lucide="search" class="search-icon"></i>
                    </div>
                    <div class="table-filters">
                        <input type="date" class="form-input" style="width: 160px;">
                        <select class="form-select" style="width: 140px;">
                            <option>All Departments</option>
                            <option>Administration</option>
                            <option>IT Department</option>
                            <option>Academic Affairs</option>
                        </select>
                    </div>
                </div>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Issue ID</th>
                            <th>Date</th>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Quantity</th>
                            <th>Unit Cost</th>
                            <th>Total Cost</th>
                            <th>Department</th>
                            <th>Issued To</th>
                            <th>Issued By</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>SO-2025-001</td>
                            <td>2025-01-16</td>
                            <td>Ballpoint Pen</td>
                            <td>E002</td>
                            <td>50</td>
                            <td>₱15.00</td>
                            <td>₱750.00</td>
                            <td>Administration</td>
                            <td>Jane Smith</td>
                            <td>John Doe</td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn-outline-orange" title="Edit">
                                        <i data-lucide="edit" class="icon"></i>
                                    </button>
                                    <button class="btn-outline-red" title="Delete">
                                        <i data-lucide="trash-2" class="icon"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateNewRequestPage() {
    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">New Request</h1>
                    <p class="page-subtitle">Create and manage new purchase requests</p>
                </div>
                <button class="btn btn-primary" onclick="openPurchaseOrderModal('create')">
                    <i data-lucide="plus" class="icon"></i>
                    Create New Request
                </button>
            </div>
        </div>
        
        <div class="page-content">
            <div class="table-container">
                <div class="table-header">
                    <div class="search-container">
                        <input type="text" class="form-input search-input" placeholder="Search requests...">
                        <i data-lucide="search" class="search-icon"></i>
                    </div>
                    <div class="table-filters">
                        <select class="form-select" style="width: 120px;">
                            <option>All Status</option>
                            <option>Draft</option>
                            <option>Submitted</option>
                            <option>Pending</option>
                        </select>
                        <select class="form-select" style="width: 140px;">
                            <option>All Departments</option>
                            <option>Administration</option>
                            <option>IT Department</option>
                            <option>Maintenance</option>
                        </select>
                    </div>
                </div>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>P.O. Number</th>
                            <th>Supplier</th>
                            <th>Request Date</th>
                            <th>Delivery Date</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Requested By</th>
                            <th>Department</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MockData.newRequests.map(request => `
                            <tr>
                                <td>${request.id}</td>
                                <td>
                                    <button class="link" onclick="openPurchaseOrderModal('view', '${request.id}')" style="background: none; border: none; color: #dc2626; text-decoration: underline; cursor: pointer;">
                                        ${request.poNumber}
                                    </button>
                                </td>
                                <td>${request.supplier}</td>
                                <td>${request.requestDate}</td>
                                <td>${request.deliveryDate}</td>
                                <td>${formatCurrency(request.totalAmount)}</td>
                                <td><span class="${getBadgeClass(request.status)}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span></td>
                                <td>${request.requestedBy}</td>
                                <td>${request.department}</td>
                                <td>
                                    <div class="table-actions">
                                        <button class="btn-outline-orange" onclick="openPurchaseOrderModal('edit', '${request.id}')" title="Edit">
                                            <i data-lucide="edit" class="icon"></i>
                                        </button>
                                        <button class="btn-outline-red" title="Delete">
                                            <i data-lucide="trash-2" class="icon"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="pagination">
                    <div class="pagination-info">Showing 1 to ${MockData.newRequests.length} of ${MockData.newRequests.length} requests</div>
                    <div class="pagination-controls">
                        <button class="btn-secondary" disabled>Previous</button>
                        <button class="btn-primary">1</button>
                        <button class="btn-secondary">Next</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generatePendingApprovalPage() {
    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Pending Approval</h1>
                    <p class="page-subtitle">Review and approve purchase requests</p>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge yellow">${MockData.pendingRequests.length} Pending Requests</span>
                </div>
            </div>
        </div>
        
        <div class="page-content">
            <div class="table-container">
                <div class="table-header">
                    <div class="search-container">
                        <input type="text" class="form-input search-input" placeholder="Search requests...">
                        <i data-lucide="search" class="search-icon"></i>
                    </div>
                    <div class="table-filters">
                        <select class="form-select" style="width: 140px;">
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Under Review</option>
                            <option>Awaiting Approval</option>
                        </select>
                        <select class="form-select" style="width: 120px;">
                            <option>All Priority</option>
                            <option>Urgent</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>P.O. Number</th>
                            <th>Supplier</th>
                            <th>Total Amount</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Requested By</th>
                            <th>Department</th>
                            <th>Submitted Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MockData.pendingRequests.map(request => `
                            <tr>
                                <td>${request.id}</td>
                                <td>
                                    <button class="link" onclick="openPurchaseOrderModal('view', '${request.id}')" style="background: none; border: none; color: #dc2626; text-decoration: underline; cursor: pointer;">
                                        ${request.poNumber}
                                    </button>
                                </td>
                                <td>${request.supplier}</td>
                                <td>${formatCurrency(request.totalAmount)}</td>
                                <td><span class="${getBadgeClass(request.priority, 'priority')}">${request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}</span></td>
                                <td><span class="${getBadgeClass(request.status)}">${request.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></td>
                                <td>${request.requestedBy}</td>
                                <td>${request.department}</td>
                                <td>${request.submittedDate}</td>
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
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateCompletedRequestPage() {
    return `
        <div class="page-header">
            <div class="page-header-content">
                <div>
                    <h1 class="page-title">Completed Request</h1>
                    <p class="page-subtitle">View completed and archived purchase requests</p>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge green">${MockData.completedRequests.filter(r => r.status === 'completed').length} Completed</span>
                    <span class="badge blue">${MockData.completedRequests.filter(r => r.status === 'delivered').length} Delivered</span>
                </div>
            </div>
        </div>
        
        <div class="page-content">
            <div class="table-container">
                <div class="table-header">
                    <div class="search-container">
                        <input type="text" class="form-input search-input" placeholder="Search requests...">
                        <i data-lucide="search" class="search-icon"></i>
                    </div>
                    <div class="table-filters">
                        <select class="form-select" style="width: 120px;">
                            <option>All Status</option>
                            <option>Approved</option>
                            <option>Delivered</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>
                        <select class="form-select" style="width: 120px;">
                            <option>All Payment</option>
                            <option>Paid</option>
                            <option>Pending</option>
                            <option>Partial</option>
                        </select>
                    </div>
                </div>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>P.O. Number</th>
                            <th>Supplier</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Payment Status</th>
                            <th>Requested By</th>
                            <th>Approved By</th>
                            <th>Delivered Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MockData.completedRequests.map(request => `
                            <tr>
                                <td>${request.id}</td>
                                <td>
                                    <button class="link" onclick="openPurchaseOrderModal('view', '${request.id}')" style="background: none; border: none; color: #dc2626; text-decoration: underline; cursor: pointer;">
                                        ${request.poNumber}
                                    </button>
                                </td>
                                <td>${request.supplier}</td>
                                <td>${formatCurrency(request.totalAmount)}</td>
                                <td><span class="${getBadgeClass(request.status)}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span></td>
                                <td><span class="${getBadgeClass(request.paymentStatus, 'payment')}">${request.paymentStatus.charAt(0).toUpperCase() + request.paymentStatus.slice(1)}</span></td>
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
                        `).join('')}
                    </tbody>
                </table>
                
                <!-- Summary Stats -->
                <div class="grid-4 mt-6" style="background-color: #f9fafb; padding: 16px; border-radius: 8px;">
                    <div class="text-center">
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Total Requests</p>
                        <p style="font-size: 18px; font-weight: 600; color: #111827; margin: 0;">${MockData.completedRequests.length}</p>
                    </div>
                    <div class="text-center">
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Total Value</p>
                        <p style="font-size: 18px; font-weight: 600; color: #111827; margin: 0;">
                            ${formatCurrency(MockData.completedRequests.reduce((sum, req) => sum + req.totalAmount, 0))}
                        </p>
                    </div>
                    <div class="text-center">
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Completed</p>
                        <p style="font-size: 18px; font-weight: 600; color: #16a34a; margin: 0;">
                            ${MockData.completedRequests.filter(r => r.status === 'completed').length}
                        </p>
                    </div>
                    <div class="text-center">
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Paid Orders</p>
                        <p style="font-size: 18px; font-weight: 600; color: #2563eb; margin: 0;">
                            ${MockData.completedRequests.filter(r => r.paymentStatus === 'paid').length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Purchase Order Modal Functions
function openPurchaseOrderModal(mode = 'create', requestId = null) {
    const modal = document.getElementById('purchase-order-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    AppState.currentModal = { mode, requestId };
    
    modalContent.innerHTML = generatePurchaseOrderModal(mode, requestId);
    modal.classList.add('active');
    
    // Reinitialize icons
    lucide.createIcons();
    
    // Initialize modal functionality
    initializePurchaseOrderModal();
}

function closePurchaseOrderModal() {
    const modal = document.getElementById('purchase-order-modal');
    modal.classList.remove('active');
    AppState.currentModal = null;
}



function generatePurchaseOrderModal(mode, requestId) {
    const title = mode === 'create' ? 'PURCHASE ORDER' : 'PURCHASE ORDER';
    const isReadOnly = mode === 'view';
    
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
                        <input type="text" class="form-input" placeholder="Enter supplier name" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Address of the Supplier</label>
                        <textarea class="form-textarea" placeholder="Enter supplier address" ${isReadOnly ? 'readonly' : ''}></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">TIN Number of the Supplier</label>
                        <input type="text" class="form-input" placeholder="Enter TIN number" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="form-group">
                        <label class="form-label">P.O. Number</label>
                        <input type="text" class="form-input" placeholder="Enter P.O. number" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Date of Purchase</label>
                        <input type="date" class="form-input" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Mode of Procurement</label>
                        <select class="form-select" ${isReadOnly ? 'disabled' : ''}>
                            <option>Select payment mode</option>
                            <option>Small Value Procurement</option>
                            <option>Medium Value Procurement</option>
                            <option>High Value Procurement</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Gentlemen Section -->
            <div class="form-group">
                <label class="form-label">Gentlemen:</label>
                <textarea class="form-textarea" placeholder="Please furnish this Office the following articles subject to the terms and conditions contained herein" ${isReadOnly ? 'readonly' : ''}></textarea>
            </div>

            <!-- Delivery Information -->
            <div class="grid-2">
                <div class="space-y-4">
                    <div class="form-group">
                        <label class="form-label">Place of Delivery</label>
                        <input type="text" class="form-input" placeholder="Enter delivery place" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Date of Delivery</label>
                        <input type="text" class="form-input" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="form-group">
                        <label class="form-label">Delivery Term</label>
                        <input type="text" class="form-input" placeholder="Enter delivery term" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Payment Term</label>
                        <input type="text" class="form-input" placeholder="Enter payment term" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                </div>
            </div>

            <!-- Items Section -->
            <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                    <label class="text-lg font-semibold">Items</label>
                    <div style="display: flex; gap: 8px;">
                        ${!isReadOnly ? `
                            <button class="btn-secondary" onclick="showStockLookup()">Stock Lookup</button>
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
                                <th>Stock Property No.</th>
                                <th>Unit</th>
                                <th>Description</th>
                                <th>Detailed Description</th>
                                <th>Current Stock</th>
                                <th>Quantity</th>
                                <th>Unit Cost</th>
                                <th>Amount</th>
                                ${!isReadOnly ? '<th>Action</th>' : ''}
                            </tr>
                        </thead>
                        <tbody id="po-items-tbody">
                            <!-- Items will be added here dynamically -->
                        </tbody>
                        <tfoot>
                            <tr style="border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
                                <td colspan="${isReadOnly ? '7' : '8'}" style="text-align: right; font-weight: 600;">Grand Total:</td>
                                <td style="font-weight: 700; color: #dc2626;" id="grand-total">₱0.00</td>
                                ${!isReadOnly ? '<td></td>' : ''}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- Stock Information Summary -->
            <div class="stock-info">
                <label style="color: #1e40af; font-weight: 600;">Stock Information Summary</label>
                <div class="grid-2 mt-3" id="stock-summary">
                    <!-- Will be updated dynamically -->
                </div>
            </div>

            <!-- ORS/BURS Information -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                <label style="font-size: 18px; font-weight: 600; color: #dc2626;">ORS/BURS Information</label>
                <div class="grid-3 mt-4">
                    <div class="form-group">
                        <label class="form-label">ORS/BURS No:</label>
                        <input type="text" class="form-input" placeholder="Part ORS/BURS number" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date of the ORS/BURS:</label>
                        <input type="date" class="form-input" ${isReadOnly ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Amount:</label>
                        <input type="text" class="form-input" placeholder="₱0.00" ${isReadOnly ? 'readonly' : ''}>
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
                <button class="btn btn-primary" onclick="savePurchaseOrder()">
                    ${mode === 'create' ? 'Create Purchase Order' : 'Update Purchase Order'}
                </button>
            ` : ''}
        </div>

        <!-- Stock Lookup Popup -->
        <div id="stock-lookup-popup" class="hidden" style="position: absolute; top: 16px; right: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); padding: 16px; width: 320px; z-index: 10;">
            <div class="space-y-2">
                <label class="font-semibold">Available Stock Items</label>
                <div style="max-height: 192px; overflow-y: auto; padding: 8px 0;">
                    ${MockData.inventory.map(stock => `
                        <div style="padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <p style="font-weight: 500; margin: 0; font-size: 14px;">${stock.stockNumber}</p>
                                    <p style="color: #6b7280; margin: 0; font-size: 12px;">${stock.name}</p>
                                </div>
                                <div style="text-align: right;">
                                    <p style="font-weight: 500; margin: 0; font-size: 14px;">${stock.currentStock}</p>
                                    <p style="color: #6b7280; margin: 0; font-size: 10px;">${stock.unit}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-secondary" onclick="hideStockLookup()" style="width: 100%;">Close</button>
            </div>
        </div>
    `;
}

// Purchase Order Modal item management
function initializePurchaseOrderModal() {
    renderPOItems();
    updateStockSummary();
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
        updateStockSummary();
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
    updateStockSummary();
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
                       placeholder="e.g., E001"
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
                <div style="display: flex; align-items: center; gap: 4px;">
                    <span style="font-size: 14px; font-weight: 500;">${item.currentStock}</span>
                    <span style="font-size: 12px; color: #6b7280;">${item.unit}</span>
                </div>
                ${item.quantity > item.currentStock && item.currentStock > 0 ? 
                    '<div class="stock-warning">Exceeds stock</div>' : ''}
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

function showStockLookup() {
    document.getElementById('stock-lookup-popup').classList.remove('hidden');
}

function hideStockLookup() {
    document.getElementById('stock-lookup-popup').classList.add('hidden');
}

function savePurchaseOrder() {
    console.log('Saving purchase order...', AppState.currentModal);
    alert('Purchase order saved successfully!');
    closePurchaseOrderModal();
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
    switch(pageId) {
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
        searchInput.addEventListener('input', function(e) {
            AppState.productSearchTerm = e.target.value;
            updateProductsTable();
        });
    }

    // Initialize sort and filter dropdowns
    const sortBy = document.getElementById('sort-by');
    const filterBy = document.getElementById('filter-by');
    
    if (sortBy) {
        sortBy.addEventListener('change', function(e) {
            AppState.productSortBy = e.target.value;
            updateProductsTable();
        });
    }

    if (filterBy) {
        filterBy.addEventListener('change', function(e) {
            AppState.productFilterBy = e.target.value;
            updateProductsTable();
        });
    }
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
        tbody.innerHTML = filteredProducts.map((product, index) => `
            <tr style="${index % 2 === 0 ? 'background-color: white;' : 'background-color: #f9fafb;'}">
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
        `).join('');
        
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
    alert(`Request ${requestId} approved successfully!`);
    loadPageContent(AppState.currentPage);
}

function rejectRequest(requestId) {
    console.log('Rejecting request:', requestId);
    if (confirm(`Are you sure you want to reject request ${requestId}?`)) {
        alert(`Request ${requestId} rejected.`);
        loadPageContent(AppState.currentPage);
    }
}

function downloadPO(requestId) {
    console.log('Downloading PO for request:', requestId);
    alert(`Downloading PO for request ${requestId}...`);
}

function archiveRequest(requestId) {
    console.log('Archiving request:', requestId);
    if (confirm(`Are you sure you want to archive request ${requestId}?`)) {
        alert(`Request ${requestId} archived.`);
        loadPageContent(AppState.currentPage);
    }
}

function openModal(type) {
    console.log('Opening modal for:', type);
    alert(`${type} modal not yet implemented`);
}

// Modal close on outside click
document.addEventListener('click', function(e) {
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
window.showStockLookup = showStockLookup;
window.hideStockLookup = hideStockLookup;
window.savePurchaseOrder = savePurchaseOrder;
window.approveRequest = approveRequest;
window.rejectRequest = rejectRequest;
window.downloadPO = downloadPO;
window.archiveRequest = archiveRequest;
window.openModal = openModal;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    
    // Initialize icons
    lucide.createIcons();
});

