document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission if inside a form
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = `tab-${btn.dataset.tab}`;
            document.getElementById(targetId).classList.add('active');
        });
    });

    const fields = [
        'fullName', 'email', 'phone', 'citizenship',
        'address', 'district', 'city', 'state', 'zipCode', 'country',
        'github', 'linkedin', 'leetcode',
        'collegeName', 'degree', 'cgpa',
        'companyName', 'internship', 'internshipDuration', 'projects'
    ];

    // Load saved details
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

    // Save details
    document.getElementById('detailsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userDetails = {};
        fields.forEach(field => {
            const el = document.getElementById(field);
            if (el) {
                userDetails[field] = el.value;
            }
        });

        chrome.storage.local.set({ userDetails }, () => {
            showStatus('Details saved!');
        });
    });

    // Trigger autofill on the current page
    document.getElementById('autofillBtn').addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
            showStatus('AutoFilling...');
        }
    });

    function showStatus(message) {
        const statusEl = document.getElementById('statusMessage');
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
