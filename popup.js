document.addEventListener('DOMContentLoaded', () => {
    // 1. Safe Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = `tab-${btn.dataset.tab}`;
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    const fields = [
        'fullName', 'email', 'phone', 'citizenship', 'gender',
        'address', 'district', 'city', 'state', 'zipCode', 'country',
        'github', 'linkedin', 'leetcode',
        'collegeName', 'degree', 'cgpa',
        'companyName', 'internship', 'internshipDuration', 'projects'
    ];

    // 2. Safe Loading Details
    try {
        chrome.storage.local.get(['userDetails'], (result) => {
            if (result.userDetails) {
                const details = result.userDetails;
                fields.forEach(field => {
                    const el = document.getElementById(field);
                    if (el) {
                        el.value = details[field] || '';
                    }
                });
            }
        });
    } catch(err) {
        console.error("Storage get error:", err);
    }

    // 3. Safe Saving Details
    const form = document.getElementById('detailsForm');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userDetails = {};
            fields.forEach(field => {
                const el = document.getElementById(field);
                if (el) {
                    userDetails[field] = el.value;
                }
            });

            try {
                chrome.storage.local.set({ userDetails }, () => {
                    showStatus('Details saved!');
                });
            } catch(err) {
                console.error("Storage set error:", err);
                showStatus('Error saving');
            }
        });
    }

    // 4. Safe AutoFill Trigger (Notice: it is type="button" now so it doesn't trigger form submit)
    const autofillBtn = document.getElementById('autofillBtn');
    if(autofillBtn) {
        autofillBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                
                if (tab) {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    });
                    showStatus('AutoFilling...');
                }
            } catch(err) {
                console.error("Script injection error:", err);
                showStatus('Cannot autofill this page');
            }
        });
    }

    function showStatus(message) {
        const statusEl = document.getElementById('statusMessage');
        if(!statusEl) return;
        
        const toast = statusEl.querySelector('.toast');
        if(toast) {
            toast.textContent = message;
        }
        statusEl.classList.remove('status-hidden');
        
        setTimeout(() => {
            statusEl.classList.add('status-hidden');
        }, 3000);
    }
});
