(function() {
    chrome.storage.local.get(['userDetails'], (result) => {
        if (!result.userDetails) {
            console.log('No autofill details found in storage.');
            return;
        }

        const details = result.userDetails;
        
        // A mapping of potential field names/ids to our stored detail keys
        const fieldMappings = {
            firstName: ['first name', 'firstname', 'fname', 'first_name'],
            lastName: ['last name', 'lastname', 'lname', 'last_name'],
            email: ['email', 'e-mail', 'emailaddress', 'mail'],
            phone: ['phone', 'telephone', 'mobile', 'cell', 'contact'],
            address: ['address', 'street', 'address1', 'addr1', 'location'],
            city: ['city', 'town'],
            zipCode: ['zip', 'zipcode', 'postal', 'postcode']
        };

        const inputs = document.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.type === 'hidden' || input.type === 'submit' || input.type === 'button') {
                return;
            }

            const name = (input.name || '').toLowerCase();
            const id = (input.id || '').toLowerCase();
            const placeholder = (input.placeholder || '').toLowerCase();
            const label = getLabelText(input).toLowerCase();

            const combinedText = `${name} ${id} ${placeholder} ${label}`;

            for (const [detailKey, keywords] of Object.entries(fieldMappings)) {
                if (keywords.some(keyword => combinedText.includes(keyword))) {
                    if (details[detailKey]) {
                        input.value = details[detailKey];
                        // Dispatch event so frameworks like React recognize the change
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        
                        // Add a visual cue
                        input.style.backgroundColor = '#e8f0fe'; 
                        break;
                    }
                }
            }
        });
    });

    function getLabelText(input) {
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) return label.innerText;
        }
        if (input.closest('label')) {
            return input.closest('label').innerText;
        }
        return '';
    }
})();
