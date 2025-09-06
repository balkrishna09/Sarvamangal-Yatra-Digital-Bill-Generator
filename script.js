// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Auto-calculate total kms when opening/closing kms change
    document.getElementById('openingKms').addEventListener('input', calculateTotalKms);
    document.getElementById('closingKms').addEventListener('input', calculateTotalKms);
    
    // Auto-calculate total days
    document.getElementById('journeyDate').addEventListener('change', calculateTotalDays);
    document.getElementById('closingDate').addEventListener('change', calculateTotalDays);
    
    // Initialize expense counter
    window.expenseCounter = 3;
    
    // Generate initial bill
    generateBill();
});

// Calculate total kilometers
function calculateTotalKms() {
    const openingKms = parseInt(document.getElementById('openingKms').value) || 0;
    const closingKms = parseInt(document.getElementById('closingKms').value) || 0;
    const totalKms = Math.abs(closingKms - openingKms);
    
    // Update the display in the bill (this will be handled in generateBill)
    return totalKms;
}

// Calculate total days
function calculateTotalDays() {
    const journeyDate = new Date(document.getElementById('journeyDate').value);
    const closingDate = new Date(document.getElementById('closingDate').value);
    
    if (journeyDate && closingDate) {
        const timeDiff = closingDate.getTime() - journeyDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        document.getElementById('totalDays').value = Math.max(1, daysDiff);
    }
}

// Convert number to words (Indian numbering system)
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

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });
}

// Format time for display
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
}

// Generate the bill preview
function generateBill() {
    const formData = new FormData(document.getElementById('billForm'));
    const data = Object.fromEntries(formData.entries());
    
    // Calculate derived values
    const totalKms = calculateTotalKms();
    const rate = parseInt(data.rate) || 0;
    const advance = parseInt(data.advance) || 0;
    
    // Calculate expenses dynamically
    const expenses = [];
    let totalExpenses = 0;
    
    // Get all expense fields dynamically
    for (let i = 1; i <= window.expenseCounter; i++) {
        const expenseDesc = data[`expense${i}`];
        const expenseAmount = parseInt(data[`amount${i}`]) || 0;
        
        if (expenseDesc && expenseAmount > 0) {
            expenses.push({ desc: expenseDesc, amount: expenseAmount });
            totalExpenses += expenseAmount;
        }
    }
    
    const grandTotal = rate + totalExpenses;
    const totalBalance = grandTotal - advance;
    
    // Generate bill HTML
    const billHTML = `
        <div class="bill-template">
            <!-- Watermark -->
            <div class="watermark"></div>
            
            <!-- Header -->
            <div class="bill-header">
                <div class="logo">
                    <img src="${window.LOGO_BASE64 || 'Logo.jpg'}" alt="Sarvamangal Yatra Logo" />
                </div>
                <div class="company-info">
                    <h1>SARVAMANGAL YATRA</h1>
                    <p class="address">Lane No.6, Subhash Nagar, Seepz, MIDC Road, Andheri (E), Mumbai - 400093.</p>
                    <div class="contact-strip">
                        <span class="email">
                            <span class="email-label">Email id :</span> sarvamangalyatra24@gmail.com
                        </span>
                        <span class="separator">|</span>
                        <span class="phone">
                            <span class="phone-label">Contact No :</span> 9998281604 / 9004286325
                        </span>
                        <span class="separator">|</span>
                        <span class="whatsapp">
                            <div class="whatsapp-icon"></div>
                            7039992590
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Bill Details -->
            <div class="bill-details">
                <div class="detail-group">
                    <div class="detail-item">
                        <strong>Bill No:</strong>
                        <span>${data.billNo || ''}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Date:</strong>
                        <span>${formatDate(data.billDate) || ''}</span>
                    </div>
                </div>
                <div class="detail-group">
                    <div class="detail-item">
                        <strong>Name:</strong>
                        <span>${data.customerName || ''}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Booked by:</strong>
                        <span>${data.bookedBy || ''}</span>
                    </div>
                </div>
                <div class="detail-group">
                    <div class="detail-item">
                        <strong>Vehicle Type:</strong>
                        <span>${data.vehicleType || ''}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Vehicle No:</strong>
                        <span>${data.vehicleNo || ''}</span>
                    </div>
                </div>
                <div class="detail-group">
                    <div class="detail-item">
                        <strong>Payment Mode:</strong>
                        <span>${data.paymentMode || ''}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Advance Paid:</strong>
                        <span>₹${advance || 0}</span>
                    </div>
                </div>
            </div>
            
            <!-- Journey Particulars -->
            <div class="journey-particulars">
                <h2>PARTICULARS</h2>
                <div class="journey-grid">
                    <div class="journey-item">
                        <strong>Date of Journey</strong>
                        <span>${formatDate(data.journeyDate) || ''}</span>
                    </div>
                    <div class="journey-item">
                        <strong>Closing Date</strong>
                        <span>${formatDate(data.closingDate) || ''}</span>
                    </div>
                    <div class="journey-item">
                        <strong>Closing Kms</strong>
                        <span>${data.closingKms || ''}</span>
                    </div>
                    <div class="journey-item">
                        <strong>Closing Time</strong>
                        <span>${formatTime(data.closingTime) || ''}</span>
                    </div>
                    <div class="journey-item">
                        <strong>Opening Kms</strong>
                        <span>${data.openingKms || ''}</span>
                    </div>
                    <div class="journey-item">
                        <strong>Opening Time</strong>
                        <span>${formatTime(data.openingTime) || ''}</span>
                    </div>
                    <div class="journey-item">
                        <strong>Total Kms</strong>
                        <span>${totalKms || ''}</span>
                    </div>
                    <div class="journey-item">
                        <strong>Total No of Day's</strong>
                        <span>${data.totalDays || ''}</span>
                    </div>
                </div>
            </div>
            
            <!-- Service Table -->
            <table class="service-table">
                <thead>
                    <tr>
                        <th>Sr. no.</th>
                        <th>Particulars</th>
                        <th>Rates</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>${data.serviceType || ''}</td>
                        <td>₹${rate || ''}</td>
                        <td>₹${rate || ''}</td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Financial Summary -->
            <div class="financial-summary">
                <div class="rupees-in-words">
                    <h3>Rupees In Words:</h3>
                    <p>${grandTotal > 0 ? numberToWords(grandTotal) + ' Rupees Only' : ''}</p>
                </div>
                <div class="expenses-breakdown">
                    <h3>Additional Expenses:</h3>
                    <div class="expenses-list">
                        ${expenses.length > 0 ? expenses.map(expense => 
                            `<div class="expense-item">
                                <span class="expense-bullet">•</span>
                                <span class="expense-desc">${expense.desc}</span>
                                <span class="expense-amount">₹${expense.amount}</span>
                            </div>`
                        ).join('') : '<div class="no-expenses">No additional expenses</div>'}
                    </div>
                </div>
                <div class="financial-boxes">
                    <div class="financial-box service-box">
                        <h4>Service Charge</h4>
                        <div class="amount">₹${rate || 0}</div>
                    </div>
                    <div class="financial-box expenses-box">
                        <h4>Expenses</h4>
                        <div class="amount">₹${totalExpenses || 0}</div>
                    </div>
                    <div class="financial-box total-box">
                        <h4>Grand Total</h4>
                        <div class="amount">₹${grandTotal || 0}</div>
                    </div>
                    <div class="financial-box advance-box">
                        <h4>Advance</h4>
                        <div class="amount">₹${advance || 0}</div>
                    </div>
                    <div class="financial-box balance-box">
                        <h4>Total Balance</h4>
                        <div class="amount">₹${totalBalance || 0}</div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="bill-footer">
                <div class="services-list">
                    <h4>Our Services</h4>
                    <ul>
                        <li>Mumbai local & outstation services</li>
                        <li>All pickup & drop services</li>
                        <li>Tourist place visit</li>
                    </ul>
                </div>
                <div class="slogan">
                    <span class="line1">Aapki Seva,</span>
                    <span class="line2">Hamara Sankalp</span>
                </div>
                <div class="footer-signature">
                    <div class="signature-text">
                        <div class="company-name">For SARVAMANGAL YATRA</div>
                        <div class="proprietor">Proprietor</div>
                    </div>
                    <div class="signature-line">
                        <img src="${window.SIGNATURE_BASE64 || 'signature.jpg'}" alt="Signature" />
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update the bill preview
    document.getElementById('billContainer').innerHTML = billHTML;
}

// Wait for images to load
function waitForImages() {
    return new Promise((resolve) => {
        const images = document.querySelectorAll('img');
        let loadedCount = 0;
        
        if (images.length === 0) {
            resolve();
            return;
        }
        
        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        resolve();
                    }
                };
                img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        resolve();
                    }
                };
            }
        });
        
        if (loadedCount === images.length) {
            resolve();
        }
    });
}

// Download PDF - HIGH QUALITY METHOD
function downloadPDF(event) {
    // Show loading message
    const button = event ? event.target : document.querySelector('button[onclick="downloadPDF()"]');
    const originalText = button.textContent;
    button.textContent = 'Generating PDF...';
    button.disabled = true;
    
    console.log('Starting PDF generation using high-quality method...');
    
    try {
        // Use html2canvas for high quality, but remove images to avoid CORS
        const billElement = document.getElementById('billContainer');
        
        // Get images for logging but don't hide them
        const images = billElement.querySelectorAll('img');
        console.log('Found images:', images.length);
        images.forEach((img, index) => {
            console.log(`Image ${index}:`, img.src, img.alt);
            // Don't hide images - let them render normally
        });
        
        // Wait for images to load completely
        const waitForImages = () => {
            return new Promise((resolve) => {
                const images = billElement.querySelectorAll('img');
                let loadedCount = 0;
                
                if (images.length === 0) {
                    resolve();
                    return;
                }
                
                images.forEach(img => {
                    if (img.complete && img.naturalHeight !== 0) {
                        loadedCount++;
                    } else {
                        img.onload = () => {
                            loadedCount++;
                            if (loadedCount === images.length) {
                                resolve();
                            }
                        };
                        img.onerror = () => {
                            loadedCount++;
                            if (loadedCount === images.length) {
                                resolve();
                            }
                        };
                    }
                });
                
                if (loadedCount === images.length) {
                    resolve();
                }
            });
        };
        
        waitForImages().then(() => {
            console.log('All images loaded, starting html2canvas...');
            html2canvas(billElement, {
                scale: 2, // High quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: true,
                width: billElement.offsetWidth,
                height: billElement.offsetHeight,
                onclone: function(clonedDoc) {
                    // In the cloned document, replace images with actual images
                    const clonedImages = clonedDoc.querySelectorAll('img');
                    console.log('Found cloned images:', clonedImages.length);
                    console.log('LOGO_BASE64 available:', !!window.LOGO_BASE64);
                    console.log('SIGNATURE_BASE64 available:', !!window.SIGNATURE_BASE64);
                    
                    clonedImages.forEach((img, index) => {
                        console.log(`Cloned Image ${index}:`, img.src, img.alt);
                        
                        if (img.alt && img.alt.includes('Logo') && window.LOGO_BASE64) {
                            // Replace with actual logo
                            console.log('Setting logo URL:', window.LOGO_BASE64);
                            img.src = window.LOGO_BASE64;
                            img.style.width = '100px';
                            img.style.height = '100px';
                            img.style.objectFit = 'contain';
                            img.style.display = 'block';
                        } else if (img.alt && img.alt.includes('Signature') && window.SIGNATURE_BASE64) {
                            // Replace with actual signature
                            console.log('Setting signature URL:', window.SIGNATURE_BASE64);
                            img.src = window.SIGNATURE_BASE64;
                            img.style.width = '200px';
                            img.style.height = '80px';
                            img.style.objectFit = 'contain';
                            img.style.display = 'block';
                        } else {
                            // Create styled placeholder
                            const placeholder = clonedDoc.createElement('div');
                            placeholder.style.width = (img.offsetWidth || 60) + 'px';
                            placeholder.style.height = (img.offsetHeight || 60) + 'px';
                            placeholder.style.border = '2px solid #ff6b35';
                            placeholder.style.background = '#fff';
                            placeholder.style.color = '#ff6b35';
                            placeholder.style.display = 'flex';
                            placeholder.style.alignItems = 'center';
                            placeholder.style.justifyContent = 'center';
                            placeholder.style.fontWeight = 'bold';
                            placeholder.style.fontSize = '10px';
                            placeholder.textContent = img.alt || 'Image';
                            
                            if (img.parentNode) {
                                img.parentNode.replaceChild(placeholder, img);
                            }
                        }
                    });
                }
            }).then(canvas => {
                console.log('High-quality canvas created:', canvas.width, 'x', canvas.height);
                
                // Create PDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                // Calculate dimensions to fit A4
                const imgWidth = 210; // A4 width
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // If image is too tall, scale it down
                let finalWidth = imgWidth;
                let finalHeight = imgHeight;
                if (imgHeight > 297) { // A4 height
                    finalHeight = 297;
                    finalWidth = (canvas.width * finalHeight) / canvas.height;
                }
                
                // Center the image
                const x = (210 - finalWidth) / 2;
                const y = 0;
                
                pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', x, y, finalWidth, finalHeight);
                
                // Save the PDF
                const billNo = document.getElementById('billNo').value || 'Bill';
                const customerName = document.getElementById('customerName').value || 'Customer';
                const fileName = `Sarvamangal_Bill_${billNo}_${customerName.replace(/\s+/g, '_')}.pdf`;
                
                pdf.save(fileName);
                console.log('High-quality PDF saved successfully!');
                
                // Reset button
                button.textContent = originalText;
                button.disabled = false;
                
            }).catch(error => {
                console.error('html2canvas failed:', error);
                alert('PDF generation failed. Please try again or check your browser settings.');
                button.textContent = originalText;
                button.disabled = false;
            });
        });
        
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('PDF generation failed: ' + error.message);
button.textContent = originalText;
button.disabled = false;
    }
}

// Test if html2canvas is working
function testHtml2Canvas(billElement) {
    return new Promise((resolve, reject) => {
        console.log('Testing html2canvas...');
        html2canvas(billElement, {
            scale: 0.5,
            logging: true
        }).then(canvas => {
            console.log('Test canvas generated:', canvas.width, 'x', canvas.height);
            if (canvas.width > 0 && canvas.height > 0) {
                resolve(true);
            } else {
                reject(new Error('Canvas has zero dimensions'));
            }
        }).catch(error => {
            console.error('html2canvas test failed:', error);
            reject(error);
        });
    });
}

// Method 1: Standard html2canvas approach
function tryMethod1(billElement, originalText) {
    try {
        console.log('Starting Method 1...');
        console.log('Bill element dimensions:', billElement.offsetWidth, 'x', billElement.offsetHeight);
        
        // Wait a bit for any pending renders
        setTimeout(() => {
            console.log('Attempting html2canvas...');
            
            html2canvas(billElement, {
                scale: 1.5,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: true, // Enable logging to see what's happening
                width: billElement.offsetWidth,
                height: billElement.offsetHeight,
                scrollX: 0,
                scrollY: 0,
                windowWidth: billElement.offsetWidth,
                windowHeight: billElement.offsetHeight,
                onclone: function(clonedDoc) {
                    // In the cloned document, replace images with actual base64 images
                    const clonedImages = clonedDoc.querySelectorAll('img');
                    console.log('Found cloned images:', clonedImages.length);
                    clonedImages.forEach((img, index) => {
                        console.log(`Cloned Image ${index}:`, img.src, img.alt);
                        
                        if (img.alt && img.alt.includes('Logo') && window.LOGO_BASE64) {
                            // Replace with actual logo
                            img.src = window.LOGO_BASE64;
                            img.style.width = '100px';
                            img.style.height = '100px';
                            img.style.objectFit = 'contain';
                        } else if (img.alt && img.alt.includes('Signature') && window.SIGNATURE_BASE64) {
                            // Replace with actual signature
                            img.src = window.SIGNATURE_BASE64;
                            img.style.width = '200px';
                            img.style.height = '80px';
                            img.style.objectFit = 'contain';
                        }
                    });
                    console.log('Canvas cloning completed');
                }
            }).then(canvas => {
                console.log('Canvas generated successfully:', canvas.width, 'x', canvas.height);
                
                if (canvas.width === 0 || canvas.height === 0) {
                    throw new Error('Canvas has zero dimensions');
                }
                
                const imgData = canvas.toDataURL('image/png', 1.0);
                console.log('Image data length:', imgData.length);
                
                // Create PDF using jsPDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const imgWidth = 210; // A4 width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                console.log('Adding image to PDF:', imgWidth, 'x', imgHeight);
                
                // Add image to PDF
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                
                // Download the PDF
                const billNo = document.getElementById('billNo').value || 'Bill';
                const customerName = document.getElementById('customerName').value || 'Customer';
                const fileName = `Sarvamangal_Bill_${billNo}_${customerName.replace(/\s+/g, '_')}.pdf`;
                pdf.save(fileName);
                
                console.log('Method 1 PDF saved successfully');
                
                // Reset button
button.textContent = originalText;
button.disabled = false;
                
            }).catch(error => {
                console.error('Method 1 canvas generation failed:', error);
                console.log('Falling back to Method 2...');
                tryMethod2(billElement, originalText);
            });
        }, 1000); // Increased wait time
    } catch (error) {
        console.error('Method 1 error:', error);
        tryMethod2(billElement, originalText);
    }
}

// Method 2: Alternative approach with different settings
function tryMethod2(billElement, originalText) {
    try {
        console.log('Trying Method 2...');
        html2canvas(billElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: true, // Enable logging to debug
            width: billElement.offsetWidth,
            height: billElement.offsetHeight,
            scrollX: 0,
            scrollY: 0
        }).then(canvas => {
            console.log('Method 2 canvas generated:', canvas.width, 'x', canvas.height);
            
            const imgData = canvas.toDataURL('image/png', 1.0); // Use PNG for better quality
            
            // Create PDF using jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            console.log('Method 2 adding image to PDF:', imgWidth, 'x', imgHeight);
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            const billNo = document.getElementById('billNo').value || 'Bill';
            const customerName = document.getElementById('customerName').value || 'Customer';
            const fileName = `Sarvamangal_Bill_${billNo}_${customerName.replace(/\s+/g, '_')}.pdf`;
            pdf.save(fileName);
            
            console.log('Method 2 PDF saved successfully');
            
button.textContent = originalText;
button.disabled = false;
            
        }).catch(error => {
            console.error('Method 2 failed:', error);
            tryMethod3(billElement, originalText);
        });
    } catch (error) {
        console.error('Method 2 error:', error);
        tryMethod3(billElement, originalText);
    }
}

// Method 3: Fallback with text-based PDF
function tryMethod3(billElement, originalText) {
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Get form data
        const formData = new FormData(document.getElementById('billForm'));
        const data = Object.fromEntries(formData.entries());
        
        // Add content to PDF
        pdf.setFontSize(20);
        pdf.setTextColor(255, 107, 53);
        pdf.text('SARVAMANGAL YATRA', 20, 30);
        
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Lane No.6, Subhash Nagar, Seepz, MIDC Road, Andheri (E), Mumbai - 400093.', 20, 40);
        
        // Bill details
        let yPos = 60;
        pdf.setFontSize(14);
        pdf.text('Bill Details:', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(10);
        pdf.text(`Bill No: ${data.billNo || ''}`, 20, yPos);
        pdf.text(`Date: ${data.billDate || ''}`, 100, yPos);
        yPos += 8;
        
        pdf.text(`Name: ${data.customerName || ''}`, 20, yPos);
        pdf.text(`Booked by: ${data.bookedBy || ''}`, 100, yPos);
        yPos += 8;
        
        pdf.text(`Vehicle Type: ${data.vehicleType || ''}`, 20, yPos);
        pdf.text(`Vehicle No: ${data.vehicleNo || ''}`, 100, yPos);
        yPos += 15;
        
        // Journey details
        pdf.setFontSize(14);
        pdf.text('Journey Details:', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(10);
        pdf.text(`Date of Journey: ${data.journeyDate || ''}`, 20, yPos);
        pdf.text(`Closing Date: ${data.closingDate || ''}`, 100, yPos);
        yPos += 8;
        
        pdf.text(`Opening Kms: ${data.openingKms || ''}`, 20, yPos);
        pdf.text(`Closing Kms: ${data.closingKms || ''}`, 100, yPos);
        yPos += 8;
        
        pdf.text(`Opening Time: ${data.openingTime || ''}`, 20, yPos);
        pdf.text(`Closing Time: ${data.closingTime || ''}`, 100, yPos);
        yPos += 15;
        
        // Service details
        pdf.setFontSize(14);
        pdf.text('Service Details:', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(10);
        pdf.text(`Service Type: ${data.serviceType || ''}`, 20, yPos);
        yPos += 8;
        pdf.text(`Rate: ₹${data.rate || 0}`, 20, yPos);
        yPos += 8;
        pdf.text(`Advance: ₹${data.advance || 0}`, 20, yPos);
        yPos += 8;
        pdf.text(`Balance: ₹${(parseInt(data.rate) || 0) - (parseInt(data.advance) || 0)}`, 20, yPos);
        
        // Footer
        yPos = 250;
        pdf.setFontSize(12);
        pdf.text('Aapki Seva, Hamara Sankalp', 20, yPos);
        yPos += 10;
        pdf.text('For SARVAMANGAL YATRA', 150, yPos);
        yPos += 10;
        pdf.text('Proprietor', 150, yPos);
        
        // Download
        const billNo = document.getElementById('billNo').value || 'Bill';
        const customerName = document.getElementById('customerName').value || 'Customer';
        const fileName = `Sarvamangal_Bill_${billNo}_${customerName.replace(/\s+/g, '_')}.pdf`;
        pdf.save(fileName);
        
button.textContent = originalText;
button.disabled = false;
        
    } catch (error) {
        console.error('Method 3 failed:', error);
        alert('PDF generation failed. Please try using a different browser or check your browser settings.');
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
            <label for="amount${window.expenseCounter}">Amount (₹):</label>
            <input type="number" id="amount${window.expenseCounter}" name="amount${window.expenseCounter}" placeholder="0">
        </div>
        <button type="button" class="remove-expense-btn" onclick="removeExpenseField(this)" title="Remove this expense">×</button>
    `;
    
    container.appendChild(expenseRow);
    
    // Add event listeners for auto-calculation
    const amountInput = document.getElementById(`amount${window.expenseCounter}`);
    amountInput.addEventListener('input', generateBill);
    
    // Generate updated bill
    generateBill();
}

// Remove expense field
function removeExpenseField(button) {
    const expenseRow = button.parentElement;
    expenseRow.remove();
    
    // Generate updated bill
    generateBill();
}

// Alternative visual PDF creation - EXACTLY MATCHING YOUR IMAGE
function createVisualPDF() {
    console.log('Creating visual PDF exactly matching your design...');
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Get form data
    const formData = new FormData(document.getElementById('billForm'));
    const data = Object.fromEntries(formData.entries());
    
    // Calculate values
    const totalKms = calculateTotalKms();
    const totalDays = calculateTotalDays();
    const rate = parseInt(data.rate) || 0;
    const advance = parseInt(data.advance) || 0;
    
    // Calculate expenses
    const expenses = [];
    let totalExpenses = 0;
    
    for (let i = 1; i <= window.expenseCounter; i++) {
        const expenseDesc = data[`expense${i}`];
        const expenseAmount = parseInt(data[`amount${i}`]) || 0;
        
        if (expenseDesc && expenseAmount > 0) {
            expenses.push({ desc: expenseDesc, amount: expenseAmount });
            totalExpenses += expenseAmount;
        }
    }
    
    const grandTotal = rate + totalExpenses;
    const totalBalance = grandTotal - advance;
    
    // Background - light cream color like in your image
    pdf.setFillColor(252, 248, 240);
    pdf.rect(0, 0, 210, 297, 'F');
    
    // Header Section - orange rounded rectangle
    pdf.setFillColor(255, 107, 53);
    pdf.roundedRect(5, 5, 200, 22, 3, 3, 'F');
    
    // Enhanced Logo design with actual logo image placeholder
    // Create a proper logo placeholder
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(10, 10, 16, 16, 2, 2, 'F');
    pdf.setDrawColor(255, 107, 53);
    pdf.setLineWidth(1);
    pdf.roundedRect(10, 10, 16, 16, 2, 2, 'S');
    
    // Logo text placeholder
    pdf.setTextColor(255, 107, 53);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SARVAMANGAL', 18, 16, { align: 'center' });
    pdf.text('YATRA', 18, 20, { align: 'center' });
    pdf.setFontSize(6);
    pdf.text('LOGO', 18, 24, { align: 'center' });
    
    // Company name - white text on orange  
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SARVAMANGAL YATRA', 35, 13);
    
    // Address - smaller white text
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Lane No.6, Subhash Nagar, Seepz, MIDC Road, Andheri (E), Mumbai - 400093.', 35, 20);
    
    // Contact strip - brown/dark orange
    pdf.setFillColor(139, 69, 19);
    pdf.rect(5, 27, 200, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7);
    pdf.text('Email Id: sarvamangalyatra24@gmail.com', 8, 31);
    pdf.text('Contact No: 9998281604 / 9004286325', 120, 31);
    
    // Bill Details Section - light yellow/beige box
    let yPos = 38;
    pdf.setFillColor(245, 245, 220);
    pdf.roundedRect(5, yPos, 200, 28, 2, 2, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(5, yPos, 200, 28, 2, 2, 'S');
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bill Details:', 8, yPos + 6);
    
    // Bill details in grid - 3 rows, 2 columns
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    
    // Row 1
    pdf.text(`Bill No:`, 8, yPos + 12);
    pdf.text(`${data.billNo || ''}`, 25, yPos + 12);
    pdf.text(`Date:`, 110, yPos + 12);
    pdf.text(`${data.billDate || ''}`, 125, yPos + 12);
    
    // Row 2  
    pdf.text(`Name:`, 8, yPos + 16);
    pdf.text(`${data.customerName || ''}`, 25, yPos + 16);
    pdf.text(`Booked by:`, 110, yPos + 16);
    pdf.text(`${data.bookedBy || ''}`, 135, yPos + 16);
    
    // Row 3
    pdf.text(`Vehicle Type:`, 8, yPos + 20);
    pdf.text(`${data.vehicleType || ''}`, 35, yPos + 20);
    pdf.text(`Vehicle No:`, 110, yPos + 20);
    pdf.text(`${data.vehicleNo || ''}`, 135, yPos + 20);
    
    // Row 4 (Payment details)
    pdf.text(`Payment Mode:`, 8, yPos + 24);
    pdf.text(`${data.paymentMode || ''}`, 40, yPos + 24);
    pdf.text(`Advance Paid:`, 110, yPos + 24);
    pdf.text(`₹${advance}`, 145, yPos + 24);
    
    yPos += 33;
    
    // Particulars Section
    pdf.setFillColor(245, 245, 220);
    pdf.roundedRect(5, yPos, 200, 28, 2, 2, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.roundedRect(5, yPos, 200, 28, 2, 2, 'S');
    
    // PARTICULARS header - orange text, centered
    pdf.setTextColor(255, 107, 53);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PARTICULARS', 105, yPos + 6, { align: 'center' });
    
    // Journey details grid - 2 rows, 4 columns
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    
    // Column headers
    pdf.text('Date of Journey:', 8, yPos + 12);
    pdf.text('Closing Date:', 58, yPos + 12);
    pdf.text('Closing Kms:', 108, yPos + 12);
    pdf.text('Closing Time:', 158, yPos + 12);
    
    // Values
    pdf.text(`${data.journeyDate || ''}`, 8, yPos + 16);
    pdf.text(`${data.closingDate || ''}`, 58, yPos + 16);
    pdf.text(`${data.closingKms || ''}`, 108, yPos + 16);
    pdf.text(`${data.closingTime || ''}`, 158, yPos + 16);
    
    // Second row
    pdf.text('Opening Kms:', 8, yPos + 20);
    pdf.text('Opening Time:', 58, yPos + 20);
    pdf.text('Total Kms:', 108, yPos + 20);
    pdf.text("Total No of Day's:", 158, yPos + 20);
    
    pdf.text(`${data.openingKms || ''}`, 8, yPos + 24);
    pdf.text(`${data.openingTime || ''}`, 58, yPos + 24);
    pdf.text(`${totalKms}`, 108, yPos + 24);
    pdf.text(`${totalDays}`, 158, yPos + 24);
    
    yPos += 33;
    
    // Service Table Header - orange background
    pdf.setFillColor(255, 107, 53);
    pdf.rect(5, yPos, 200, 7, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Sr. no.', 8, yPos + 4);
    pdf.text('Particulars', 30, yPos + 4);
    pdf.text('Rates', 120, yPos + 4);
    pdf.text('Amount', 160, yPos + 4);
    
    // Service Table Row - white background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(5, yPos + 7, 200, 7, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(5, yPos, 200, 14, 'S');
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('1', 8, yPos + 11);
    pdf.text(`${data.serviceType || ''}`, 30, yPos + 11);
    pdf.text(`₹${rate}`, 120, yPos + 11);
    pdf.text(`₹${rate}`, 160, yPos + 11);
    
    yPos += 18;
    
    // Bottom section with two boxes side by side
    const boxHeight = 20;
    
    // Left box - Rupees in Words
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(5, yPos, 95, boxHeight, 2, 2, 'F');
    pdf.setDrawColor(255, 107, 53);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(5, yPos, 95, boxHeight, 2, 2, 'S');
    
    pdf.setTextColor(255, 107, 53);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RUPEES IN WORDS:', 8, yPos + 5);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    const words = numberToWords(grandTotal);
    pdf.text(words.substring(0, 50), 8, yPos + 10); // Truncate if too long
    
    // Right box - Additional Expenses
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(110, yPos, 95, boxHeight, 2, 2, 'F');
    pdf.setDrawColor(255, 107, 53);
    pdf.roundedRect(110, yPos, 95, boxHeight, 2, 2, 'S');
    
    pdf.setTextColor(255, 107, 53);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ADDITIONAL EXPENSES:', 113, yPos + 5);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    if (expenses.length > 0) {
        expenses.forEach((expense, index) => {
            if (index < 3) { // Limit to 3 expenses to fit
                pdf.text(`• ${expense.desc}: ₹${expense.amount}`, 113, yPos + 10 + (index * 3));
            }
        });
    } else {
        pdf.text('No additional expenses', 113, yPos + 10);
    }
    
    yPos += 25;
    
    // Financial Summary Boxes - exactly like your image
    const boxWidth = 37;
    const smallBoxHeight = 10;
    
    // SERVICE box - dark gray
    pdf.setFillColor(64, 64, 64);
    pdf.roundedRect(5, yPos, boxWidth, smallBoxHeight, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SERVICE', 7, yPos + 3);
    pdf.text(`₹${rate}`, 7, yPos + 7);
    
    // EXPENSES box - orange
    pdf.setFillColor(255, 107, 53);
    pdf.roundedRect(47, yPos, boxWidth, smallBoxHeight, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text('EXPENSES', 49, yPos + 3);
    pdf.text(`₹${totalExpenses}`, 49, yPos + 7);
    
    // GRAND box - green  
    pdf.setFillColor(34, 139, 34);
    pdf.roundedRect(89, yPos, boxWidth, smallBoxHeight, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text('GRAND', 91, yPos + 3);
    pdf.text(`₹${grandTotal}`, 91, yPos + 7);
    
    // ADVANCE box - blue
    pdf.setFillColor(30, 144, 255);
    pdf.roundedRect(131, yPos, boxWidth, smallBoxHeight, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text('ADVANCE', 133, yPos + 3);
    pdf.text(`₹${advance}`, 133, yPos + 7);
    
    // TOTAL BALANCE box - red, full width
    pdf.setFillColor(220, 20, 60);
    pdf.roundedRect(5, yPos + 12, 200, smallBoxHeight, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAL BALANCE', 7, yPos + 16);
    pdf.text(`₹${totalBalance}`, 7, yPos + 20);
    
    // Footer section - light beige like in your image
    yPos = 250;
    pdf.setFillColor(245, 245, 220);
    pdf.roundedRect(5, yPos, 200, 18, 2, 2, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.roundedRect(5, yPos, 200, 18, 2, 2, 'S');
    
    // Our Services
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Our Services', 8, yPos + 5);
    
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('• Mumbai local & outstation services', 8, yPos + 9);
    pdf.text('• All pickup & drop services', 8, yPos + 12);
    pdf.text('• Tourist place visit', 8, yPos + 15);
    
    // Slogan - orange text, centered
    pdf.setTextColor(255, 107, 53);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Aapki Seva,', 105, yPos + 7, { align: 'center' });
    pdf.text('Hamara Sankalp', 105, yPos + 11, { align: 'center' });
    
    // Signature area - right side with enhanced signature box
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FOR SARVAMANGAL YATRA', 150, yPos + 5);
    
    // Enhanced signature box with signature placeholder
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(150, yPos + 7, 50, 10, 1, 1, 'FD');
    
    // Signature placeholder design
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Signature', 175, yPos + 12, { align: 'center' });
    
    // Decorative line under signature
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.2);
    pdf.line(155, yPos + 14, 195, yPos + 14);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Proprietor', 175, yPos + 17, { align: 'center' });
    
    // Save PDF
    const billNo = data.billNo || 'Bill';
    const customerName = data.customerName || 'Customer';
    const fileName = `Sarvamangal_Bill_${billNo}_${customerName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);
    
    console.log('Visual PDF created successfully - exactly matching your design!');
}

// Test PDF generation (debug function)
function testPDF() {
    const billElement = document.getElementById('billContainer');
    console.log('Testing PDF generation...');
    console.log('Bill element:', billElement);
    console.log('Bill element dimensions:', billElement.offsetWidth, 'x', billElement.offsetHeight);
    
    // Test html2canvas
    testHtml2Canvas(billElement).then(() => {
        console.log('✅ html2canvas is working!');
        alert('html2canvas is working! Check console for details.');
    }).catch(error => {
        console.log('❌ html2canvas failed:', error);
        alert('html2canvas failed: ' + error.message);
    });
}

// Reset form
function resetForm() {
    document.getElementById('billForm').reset();
    
    // Reset expenses to original 3
    const container = document.getElementById('expenses-container');
    const expenseRows = container.querySelectorAll('.expense-row');
    
    // Remove all expense rows except the first 3
    for (let i = 3; i < expenseRows.length; i++) {
        expenseRows[i].remove();
    }
    
    // Reset counter
    window.expenseCounter = 3;
    
    // Regenerate bill with blank values
    generateBill();
}

// Auto-generate bill number (optional enhancement)
function generateBillNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${year}${month}${day}${random}`;
}

// Add some additional service types dynamically
function addServiceType() {
    const serviceTypeSelect = document.getElementById('serviceType');
    const newService = prompt('Enter new service type:');
    if (newService) {
        const option = document.createElement('option');
        option.value = newService;
        option.textContent = newService;
        serviceTypeSelect.appendChild(option);
        serviceTypeSelect.value = newService;
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + G to generate bill
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        generateBill();
    }
    
    // Ctrl + D to download PDF
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        downloadPDF();
    }
    
    // Ctrl + R to reset form
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        resetForm();
    }
});
