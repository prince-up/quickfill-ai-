document.addEventListener('DOMContentLoaded', () => {
    // Load saved details when popup opens
    chrome.storage.local.get(['userDetails'], (result) => {
        if (result.userDetails) {
            const details = result.userDetails;
            document.getElementById('firstName').value = details.firstName || '';
            document.getElementById('lastName').value = details.lastName || '';
            document.getElementById('email').value = details.email || '';
            document.getElementById('phone').value = details.phone || '';
            document.getElementById('address').value = details.address || '';
            document.getElementById('city').value = details.city || '';
            document.getElementById('zipCode').value = details.zipCode || '';
        }
    });

    // Save details
    document.getElementById('detailsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userDetails = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zipCode: document.getElementById('zipCode').value
        };

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
