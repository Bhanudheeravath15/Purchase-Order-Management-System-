// Automatically dynamically structure API paths for Local VS Vercel Deployment
const API_BASE = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? 'http://127.0.0.1:8000'
    : window.location.origin;

let productsGlobal = [];

// --- Handle OAuth Redirect Token ---
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get('token');
if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    window.location.href = 'index.html'; // Clear URL
}

// Enforce Auth
if (!window.location.pathname.endsWith('login.html')) {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
    }
}

const getAuthHeaders = () => {
    return {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
};

async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders/`, { headers: getAuthHeaders() });
        if(response.status === 401) return logout();
        
        let apiOrders = await response.json();
        
        const tbody = document.getElementById('poTableBody');
        tbody.innerHTML = '';
        
        if (apiOrders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No orders found. Click "Create New PO" to start.</td></tr>';
            return;
        }

        // Reverse the array so the newest orders appear at the top
        apiOrders.reverse().forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="fw-bold">${order.reference_no}</td>
                <td>${order.vendor.name}</td>
                <td class="text-success fw-bold">$${parseFloat(order.total_amount).toFixed(2)}</td>
                <td><span class="badge bg-secondary p-2">${order.status}</span></td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="viewOrder('${order.reference_no}')">View</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteOrder('${order.reference_no}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Save to global for View Modal
        window.currentOrders = apiOrders;
        
    } catch(err) {
        console.error("Error loading orders", err);
        document.getElementById('poTableBody').innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error connecting to server.</td></tr>';
    }
}

// --- NEW MODAL VIEW FUNCTION --- //
function viewOrder(refNo) {
    const order = (window.currentOrders || []).find(o => o.reference_no === refNo);
    if(order) {
        const modalBody = document.getElementById('poModalBody');
        modalBody.innerHTML = `
            <div class="mb-3 border-bottom pb-2">
                <div class="small text-muted text-uppercase mb-1">Reference No</div>
                <div class="fw-bold fs-5 text-primary">${order.reference_no}</div>
            </div>
            <div class="row mb-3">
                <div class="col-6">
                    <div class="small text-muted text-uppercase mb-1">Vendor</div>
                    <div class="fw-bold">${order.vendor.name}</div>
                </div>
                <div class="col-6">
                    <div class="small text-muted text-uppercase mb-1">Status</div>
                    <div><span class="badge bg-secondary p-2">${order.status}</span></div>
                </div>
            </div>
            <div class="mb-3">
                <div class="small text-muted text-uppercase mb-1">Created At</div>
                <div>${new Date(order.created_at).toLocaleString()}</div>
            </div>
            <hr>
            <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="text-muted fw-bold">Total Amount</div>
                <div class="text-success fw-bold fs-4">$${parseFloat(order.total_amount).toFixed(2)}</div>
            </div>
        `;
        const modal = new bootstrap.Modal(document.getElementById('viewPoModal'));
        modal.show();
    } else {
        alert("Order details not found locally.");
    }
}
// ------------------------------- //

async function loadVendors() {
    try {
        const response = await fetch(`${API_BASE}/vendors/`, { headers: getAuthHeaders() });
        const vendors = await response.json();
        const select = document.getElementById('vendorSelect');
        vendors.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.text = v.name;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error("Error loading vendors", err);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products/`, { headers: getAuthHeaders() });
        productsGlobal = await response.json();
    } catch (err) {
        console.error("Error loading products", err);
    }
}

function calculateRowTotal(selectElement) {
    const row = selectElement.closest('.row');
    const productSelect = row.querySelector('.product-select');
    const qtyInput = row.querySelector('.qty-input');
    
    if (productSelect.value) {
        const prod = productsGlobal.find(p => p.id == productSelect.value);
        if (prod) {
            row.querySelector('.price-display').innerText = '$' + parseFloat(prod.unit_price).toFixed(2);
            row.querySelector('.row-total').innerText = '$' + (parseFloat(prod.unit_price) * qtyInput.value).toFixed(2);
        }
    } else {
        row.querySelector('.price-display').innerText = '$0.00';
        row.querySelector('.row-total').innerText = '$0.00';
    }
    calculateGrandTotal();
}

function calculateGrandTotal() {
    let subtotal = 0;
    document.querySelectorAll('.row-total').forEach(el => {
        subtotal += parseFloat(el.innerText.replace('$', ''));
    });
    // Add 5% Tax
    const total = subtotal * 1.05;
    document.getElementById('grandTotal').innerText = total.toFixed(2);
}

function addProductRow() {
    const container = document.getElementById('productRows');
    const row = document.createElement('div');
    row.className = 'row mb-3 align-items-end p-3 border rounded bg-light bg-opacity-50';
    
    let productOptions = '<option value="">Select a product...</option>';
    productsGlobal.forEach(p => {
        productOptions += `<option value="${p.id}">${p.name} (${p.sku})</option>`;
    });
    
    row.innerHTML = `
        <div class="col-md-4 mb-2 mb-md-0">
            <select class="form-select product-select" required onchange="calculateRowTotal(this)">
                ${productOptions}
            </select>
            <div class="small text-muted ai-desc mt-1 fw-bold text-info" style="font-size: 11px;"></div>
        </div>
        <div class="col-md-2 mb-2 mb-md-0">
            <label class="form-label small text-muted mb-1">Qty</label>
            <input type="number" class="form-control qty-input" value="1" min="1" required onchange="calculateRowTotal(this)">
        </div>
        <div class="col-md-2 mb-2 mb-md-0">
            <label class="form-label small text-muted mb-1">Price</label>
            <div class="p-2 border rounded bg-white price-display">$0.00</div>
        </div>
        <div class="col-md-2 mb-2 mb-md-0">
            <label class="form-label small text-muted mb-1">Subtotal</label>
            <div class="d-flex align-items-center">
                <div class="p-2 font-weight-bold text-primary row-total fw-bold bg-white me-2" style="width:100px;">$0.00</div>
                <button type="button" class="btn btn-sm btn-outline-info" onclick="generateAIDescription(this)" title="Generate Auto-Description">✨ AI</button>
            </div>
        </div>
        <div class="col-md-2 text-md-end text-start">
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.closest('.row').remove(); calculateGrandTotal();">✕ Remove</button>
        </div>
    `;
    container.appendChild(row);
}

async function generateAIDescription(btn) {
    const row = btn.closest('.row');
    const select = row.querySelector('.product-select');
    if (!select.value) return alert("Select a product first.");
    
    const productName = select.options[select.selectedIndex].text.split('(')[0].trim();
    const descDiv = row.querySelector('.ai-desc');
    descDiv.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
    
    try {
        const response = await fetch(`${API_BASE}/ai/generate-description`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ product_name: productName })
        });
        const data = await response.json();
        descDiv.innerText = data.description;
    } catch(e) {
        descDiv.innerText = "Failed to generate.";
    }
}

async function submitOrder() {
    const vendorId = document.getElementById('vendorSelect').value;
    const items = [];
    
    document.querySelectorAll('#productRows .row').forEach(row => {
        const pId = row.querySelector('.product-select').value;
        const qty = row.querySelector('.qty-input').value;
        if(pId && qty > 0) {
            items.push({
                product_id: parseInt(pId),
                quantity: parseInt(qty)
            });
        }
    });

    if (items.length === 0) {
        alert("Please add at least one product.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/orders/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...getAuthHeaders() 
            },
            body: JSON.stringify({
                vendor_id: parseInt(vendorId),
                items: items
            })
        });

        if(response.ok) {
            alert('Purchase Order Created Successfully!');
            window.location.href = 'index.html';
        } else {
            const err = await response.json();
            alert('Failed to create Purchase Order: ' + (err.detail || 'Internal Error'));
        }
    } catch(err) {
        console.error(err);
        alert('API Connection Error');
    }
}

async function performOAuthLogin() {
    window.location.href = `${API_BASE}/auth/login/google`;
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

async function deleteOrder(refNo) {
    if(confirm("Are you sure you want to completely delete this Purchase Order?")) {
        try {
            const response = await fetch(`${API_BASE}/orders/${refNo}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if(response.ok) {
                loadOrders(); // Refresh table
            } else {
                const err = await response.json();
                alert(`Failed to delete the order: ${err.detail}`);
            }
        } catch(err) {
            console.error("Deletion API Error", err);
        }
    }
}
