// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Default bill date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('billDate').value = today;

    document.getElementById('openingKms').addEventListener('input', calculateTotalKms);
    document.getElementById('closingKms').addEventListener('input', calculateTotalKms);
    document.getElementById('journeyDate').addEventListener('change', calculateTotalDays);
    document.getElementById('closingDate').addEventListener('change', calculateTotalDays);

    // Real-time preview on any form change
    const form = document.getElementById('billForm');
    form.addEventListener('input', generateBill);
    form.addEventListener('change', generateBill);

    // Clear invalid highlight when the user starts typing in a field
    form.addEventListener('input', function(e) {
        if (e.target.classList.contains('invalid')) {
            e.target.classList.remove('invalid');
        }
    });

    window.expenseCounter = 3;
    generateBill();
});

function calculateTotalKms() {
    const openingKms = parseInt(document.getElementById('openingKms').value) || 0;
    const closingKms = parseInt(document.getElementById('closingKms').value) || 0;
    return Math.abs(closingKms - openingKms);
}

function calculateTotalDays() {
    const journeyDate = new Date(document.getElementById('journeyDate').value);
    const closingDate = new Date(document.getElementById('closingDate').value);
    if (journeyDate && closingDate && !isNaN(journeyDate) && !isNaN(closingDate)) {
        const daysDiff = Math.ceil((closingDate - journeyDate) / (1000 * 3600 * 24)) + 1;
        document.getElementById('totalDays').value = Math.max(1, daysDiff);
    }
}

// Indian numbering system
function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
}

// Generate the bill preview — layout matches the reference Word document
function generateBill() {
    const formData = new FormData(document.getElementById('billForm'));
    const data = Object.fromEntries(formData.entries());

    const totalKms = calculateTotalKms();
    const rate = parseInt(data.rate) || 0;
    const advance = parseInt(data.advance) || 0;

    const expenses = [];
    let totalExpenses = 0;
    for (let i = 1; i <= window.expenseCounter; i++) {
        const desc = data[`expense${i}`];
        const amount = parseInt(data[`amount${i}`]) || 0;
        if (desc && amount > 0) {
            expenses.push({ desc, amount });
            totalExpenses += amount;
        }
    }

    const grandTotal = rate + totalExpenses;
    const totalBalance = grandTotal - advance;

    // Expense rows in the service table
    const expenseRows = expenses.map((exp, i) => `
        <tr>
            <td class="td-center">${i + 2}</td>
            <td>${exp.desc}</td>
            <td class="td-right">&#8377;${exp.amount}</td>
            <td class="td-right">&#8377;${exp.amount}</td>
        </tr>`).join('');

    // Filler rows to create height for the watermark area
    const contentRows = 1 + expenses.length;
    const topFillerCount = Math.max(1, 4 - contentRows);
    const topFillers = Array(topFillerCount).fill(
        `<tr class="filler-row"><td></td><td></td><td></td><td></td></tr>`
    ).join('');

    const billHTML = `
        <div class="bill-template">

            <!-- Header -->
            <div class="bill-header">
                <div class="logo">
                    <img src="${window.LOGO_BASE64 || 'Logo.jpg'}" alt="Sarvamangal Yatra Logo" />
                </div>
                <div class="company-info">
                    <h1>SARVAMANGAL YATRA</h1>
                    <p class="address">Lane No.6, Subhash Nagar, Seepz, MIDC Road, Andheri (E), Mumbai - 400093.</p>
                </div>
            </div>

            <!-- Contact Strip -->
            <div class="contact-strip">
                <span><span class="c-label">Email id :</span> sarvamangalyatra24@gmail.com</span>
                <span class="c-sep">|</span>
                <span><span class="c-label">Contact No :</span> 9998281604 / 9004286325</span>
                <span class="c-sep">|</span>
                <span>&#128241; 7039992590</span>
            </div>

            <!-- Bill Details -->
            <div class="bill-details">
                <div class="bill-row">
                    <div class="bill-field">
                        <span class="f-label">Bill no</span>
                        <span class="f-sep"> : </span>
                        <span class="f-value">${data.billNo || ''}</span>
                    </div>
                    <div class="bill-field">
                        <span class="f-label">Date</span>
                        <span class="f-sep"> : </span>
                        <span class="f-value">${formatDate(data.billDate) || ''}</span>
                    </div>
                </div>
                <div class="bill-row">
                    <div class="bill-field full">
                        <span class="f-label">Name</span>
                        <span class="f-sep"> : </span>
                        <span class="f-value">${data.customerName || ''}</span>
                    </div>
                </div>
                <div class="bill-row">
                    <div class="bill-field full">
                        <span class="f-label">Booked by</span>
                        <span class="f-sep"> : </span>
                        <span class="f-value">${data.bookedBy || ''}</span>
                    </div>
                </div>
                <div class="bill-row">
                    <div class="bill-field">
                        <span class="f-label">Vehicle Type</span>
                        <span class="f-sep"> : </span>
                        <span class="f-value">${data.vehicleType || ''}</span>
                    </div>
                    <div class="bill-field">
                        <span class="f-label">Vehicle No</span>
                        <span class="f-sep"> : </span>
                        <span class="f-value">${data.vehicleNo || ''}</span>
                    </div>
                </div>
            </div>

            <!-- Particulars -->
            <div class="particulars-section">
                <h2 class="particulars-heading">PARTICULARS</h2>
                <div class="particulars-grid">
                    <div class="p-item">
                        <span class="p-label">Date of Journey :</span>
                        <span class="p-value">${formatDate(data.journeyDate) || ''}</span>
                    </div>
                    <div class="p-item">
                        <span class="p-label">Closing Date :</span>
                        <span class="p-value">${formatDate(data.closingDate) || ''}</span>
                    </div>
                    <div class="p-item">
                        <span class="p-label">Closing Kms :</span>
                        <span class="p-value">${data.closingKms || ''}</span>
                    </div>
                    <div class="p-item">
                        <span class="p-label">Closing Time :</span>
                        <span class="p-value">${formatTime(data.closingTime) || ''}</span>
                    </div>
                    <div class="p-item">
                        <span class="p-label">Opening Kms :</span>
                        <span class="p-value">${data.openingKms || ''}</span>
                    </div>
                    <div class="p-item">
                        <span class="p-label">Opening Time :</span>
                        <span class="p-value">${formatTime(data.openingTime) || ''}</span>
                    </div>
                    <div class="p-item">
                        <span class="p-label">Total Kms :</span>
                        <span class="p-value">${totalKms || ''}</span>
                    </div>
                    <div class="p-item">
                        <span class="p-label">Total No of Day's :</span>
                        <span class="p-value">${data.totalDays || ''}</span>
                    </div>
                </div>
            </div>

            <!-- Service Table with summary -->
            <div class="table-wrapper">
                <table class="service-table">
                    <thead>
                        <tr>
                            <th class="th-srno">Sr. no.</th>
                            <th class="th-particulars">Particulars</th>
                            <th class="th-rates">Rates</th>
                            <th class="th-amount">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="td-center">1</td>
                            <td>${data.serviceType || ''}</td>
                            <td class="td-right">&#8377;${rate || 0}</td>
                            <td class="td-right">&#8377;${rate || 0}</td>
                        </tr>
                        ${expenseRows}
                        ${topFillers}
                        <tr class="watermark-row">
                            <td colspan="4">
                                <div class="wm-inner">&#128663;&nbsp;&nbsp;&nbsp;&#127981;</div>
                            </td>
                        </tr>
                        <tr class="filler-row"><td></td><td></td><td></td><td></td></tr>
                        <tr class="filler-row"><td></td><td></td><td></td><td></td></tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" rowspan="3" class="rupees-cell">
                                <div class="rupees-label">Rupees In Words :</div>
                                <div class="rupees-text">${grandTotal > 0 ? numberToWords(grandTotal) + ' Rupees Only' : ''}</div>
                            </td>
                            <td class="summary-label">Total</td>
                            <td class="summary-value">&#8377;${grandTotal}</td>
                        </tr>
                        <tr>
                            <td class="summary-label">Advance</td>
                            <td class="summary-value">&#8377;${advance}</td>
                        </tr>
                        <tr>
                            <td class="summary-label">Total Balance</td>
                            <td class="summary-value">&#8377;${totalBalance}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Footer -->
            <div class="bill-footer">
                <div class="footer-services">
                    <h4>Our Services</h4>
                    <ul>
                        <li>Mumbai local &amp; outstation services</li>
                        <li>All pickup &amp; drop services</li>
                        <li>Tourist place visit</li>
                    </ul>
                </div>
                <div class="footer-slogan">
                    <span>Aapki Seva,</span>
                    <span>Hamara Sankalp</span>
                </div>
                <div class="footer-sig">
                    <div class="sig-for">For SARVAMANGAL YATRA</div>
                    <div class="sig-img-box">
                        <img src="${window.SIGNATURE_BASE64 || 'signature.jpg'}" alt="Signature" />
                    </div>
                    <div class="sig-proprietor">Proprietor</div>
                </div>
            </div>

        </div>`;

    document.getElementById('billContainer').innerHTML = billHTML;
}

// Auto-fill bill number: YYMMDD + 001 (e.g. 250530001)
function autoFillBillNo() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    document.getElementById('billNo').value = `${yy}${mm}${dd}001`;
    generateBill();
}

// Mobile tab switcher
function switchTab(tab) {
    const formPanel = document.getElementById('formPanel');
    const previewPanel = document.getElementById('previewPanel');
    document.getElementById('tabForm').classList.toggle('active', tab === 'form');
    document.getElementById('tabPreview').classList.toggle('active', tab === 'preview');
    formPanel.classList.toggle('hidden', tab !== 'form');
    previewPanel.classList.toggle('hidden', tab !== 'preview');
}

// Validate required fields and highlight blanks; returns true if all pass
function validateForm() {
    const required = ['customerName', 'vehicleType', 'vehicleNo', 'serviceType', 'rate'];
    let valid = true;
    required.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            el.classList.add('invalid');
            valid = false;
        } else {
            el.classList.remove('invalid');
        }
    });
    return valid;
}

// Download PDF — uses a hidden A4-width container so output is always correct
// regardless of the user's screen or viewport size
async function downloadPDF(event) {
    if (!validateForm()) {
        alert('Please fill in the highlighted fields before downloading.');
        return;
    }
    const button = event
        ? event.target
        : document.querySelector('button[onclick="downloadPDF(event)"]');
    if (!button) { alert('Download button not found.'); return; }

    const originalText = button.textContent;
    button.textContent = 'Generating PDF...';
    button.disabled = true;

    let hidden = null;
    try {
        generateBill();

        // Create a fixed 794px-wide off-screen container (A4 at 96 dpi).
        // This guarantees the capture always looks like an A4 page, even on mobile.
        hidden = document.createElement('div');
        hidden.style.cssText = [
            'position:fixed',
            'left:-9999px',
            'top:0',
            'width:794px',
            'background:white',
            'z-index:-9999',
            'pointer-events:none'
        ].join(';');
        hidden.innerHTML = document.getElementById('billContainer').innerHTML;
        document.body.appendChild(hidden);

        // Wait for images inside the hidden clone to finish loading
        const imgs = [...hidden.querySelectorAll('img')];
        await Promise.all(imgs.map(img => new Promise(resolve => {
            if (img.complete) { resolve(); return; }
            img.onload = resolve;
            img.onerror = resolve;
        })));

        const canvas = await html2canvas(hidden, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#FFF8EE',
            width: 794,
            onclone: (clonedDoc) => {
                clonedDoc.querySelectorAll('img').forEach(img => {
                    if (img.alt && img.alt.includes('Logo') && window.LOGO_BASE64) {
                        img.src = window.LOGO_BASE64;
                    } else if (img.alt && img.alt.includes('Signature') && window.SIGNATURE_BASE64) {
                        img.src = window.SIGNATURE_BASE64;
                    }
                });
            }
        });

        document.body.removeChild(hidden);
        hidden = null;

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = Math.min((canvas.height * imgWidth) / canvas.width, 297);
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, imgWidth, imgHeight);

        const billNo = document.getElementById('billNo').value || 'Bill';
        const customerName = document.getElementById('customerName').value || 'Customer';
        pdf.save(`Sarvamangal_Bill_${billNo}_${customerName.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('PDF generation failed: ' + error.message);
    } finally {
        if (hidden && hidden.parentNode) document.body.removeChild(hidden);
        button.textContent = originalText;
        button.disabled = false;
    }
}

// Add dynamic expense field
function addExpenseField() {
    window.expenseCounter++;
    const container = document.getElementById('expenses-container');

    const expenseRow = document.createElement('div');
    expenseRow.className = 'form-row expense-row';
    expenseRow.innerHTML = `
        <div class="form-group">
            <label for="expense${window.expenseCounter}">Expense ${window.expenseCounter}:</label>
            <input type="text" id="expense${window.expenseCounter}" name="expense${window.expenseCounter}" placeholder="e.g., Additional charges">
        </div>
        <div class="form-group">
            <label for="amount${window.expenseCounter}">Amount (&#8377;):</label>
            <input type="number" id="amount${window.expenseCounter}" name="amount${window.expenseCounter}" placeholder="0">
        </div>
        <button type="button" class="remove-expense-btn" onclick="removeExpenseField(this)" title="Remove this expense">&times;</button>
    `;
    container.appendChild(expenseRow);

    document.getElementById(`amount${window.expenseCounter}`).addEventListener('input', generateBill);
    generateBill();
}

// Remove expense field
function removeExpenseField(button) {
    button.parentElement.remove();
    generateBill();
}

// Test html2canvas is working
function testPDF() {
    const billElement = document.getElementById('billContainer');
    console.log('Testing html2canvas...', billElement.offsetWidth, 'x', billElement.offsetHeight);
    html2canvas(billElement, { scale: 0.5 }).then(canvas => {
        console.log('Canvas OK:', canvas.width, 'x', canvas.height);
        alert('html2canvas working! Canvas: ' + canvas.width + 'x' + canvas.height);
    }).catch(err => {
        console.error('html2canvas failed:', err);
        alert('html2canvas failed: ' + err.message);
    });
}

// Reset form
function resetForm() {
    document.getElementById('billForm').reset();

    // Restore default bill date to today after reset
    document.getElementById('billDate').value = new Date().toISOString().split('T')[0];

    const container = document.getElementById('expenses-container');
    const rows = container.querySelectorAll('.expense-row');
    for (let i = 3; i < rows.length; i++) rows[i].remove();

    window.expenseCounter = 3;
    generateBill();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'g') { e.preventDefault(); generateBill(); }
    if (e.ctrlKey && e.key === 'd') { e.preventDefault(); downloadPDF(); }
    if (e.ctrlKey && e.key === 'r') { e.preventDefault(); resetForm(); }
});
