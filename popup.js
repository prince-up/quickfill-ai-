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
    const defaultData = {
        fullName: "Prince Yadav",
        email: "princeyadav76001@gmail.com",
        phone: "+91-7986614646",
        citizenship: "Indian",
        gender: "Male",
        address: "Phagwara, Punjab, India",
        district: "",
        city: "Phagwara",
        state: "Punjab",
        zipCode: "144411",
        country: "India",
        github: "https://github.com/prince-up",
        linkedin: "https://linkedin.com/in/prince-yadav-4t",
        leetcode: "",
        collegeName: "Lovely Professional University",
        degree: "Bachelor of Technology",
        cgpa: "6.62",
        companyName: "WorldWin Coder Pvt. Ltd.",
        internship: "Software Engineering Intern",
        internshipDuration: "3 Months",
        projects: "MarketMind AI, HireMind AI, Cold Mail Agent, AstraLMS"
    };

    try {
        chrome.storage.local.get(['userDetails'], (result) => {
            const details = result.userDetails || defaultData;
            fields.forEach(field => {
                const el = document.getElementById(field);
                if (el) {
                    el.value = details[field] || '';
                }
            });
            
            // Save defaults to storage if it's empty
            if (!result.userDetails) {
                chrome.storage.local.set({ userDetails: defaultData });
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
