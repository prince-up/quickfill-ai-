(function() {
    chrome.storage.local.get(['userDetails'], (result) => {
        if (!result.userDetails) {
            console.log('No autofill details found in storage.');
            return;
        }

        const details = result.userDetails;
        
        // A mapping of potential field names/ids to our stored detail keys
        const fieldMappings = {
            fullName: ['full name', 'fullname', 'name', 'first name', 'last name', 'fname', 'lname'],
            email: ['email', 'e-mail', 'emailaddress', 'mail'],
            phone: ['phone', 'telephone', 'mobile', 'cell', 'contact', 'number'],
            citizenship: ['citizenship', 'nationality', 'citizen'],
            
            address: ['address', 'street', 'address1', 'addr1', 'location'],
            district: ['district', 'county'],
            city: ['city', 'town'],
            state: ['state', 'province', 'region'],
            zipCode: ['zip', 'zipcode', 'postal', 'postcode', 'pincode', 'pin code', 'pin'],
            country: ['country', 'nation'],
            
            github: ['github', 'git', 'github id', 'github profile'],
            linkedin: ['linkedin', 'linkedin id', 'linked in', 'linkedin profile'],
            leetcode: ['leetcode', 'leet code', 'leetcode id'],
            
            collegeName: ['college', 'university', 'institution', 'school', 'institute'],
            degree: ['degree', 'bachelor', 'major', 'course', 'program', 'graduation'],
            cgpa: ['cgpa', 'gpa', 'grade point', 'grade', 'percentage'],
            
            companyName: ['company', 'employer', 'organization', 'firm'],
            internship: ['internship', 'role', 'position', 'title', 'job title'],
            internshipDuration: ['duration', 'period', 'months', 'tenure'],
            projects: ['projects', 'portfolio', 'project details', 'work experience']
        };

        const inputs = document.querySelectorAll('input, select, textarea');
        let filledCount = 0;

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
                        
                        // Focus the element to simulate user interaction
                        input.focus();
                        
                        // Set the value
                        input.value = details[detailKey];
                        
                        // Dispatch multiple events for React/Angular/Google Forms compatibility
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
                        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
                        
                        // Blur to trigger validation
                        input.blur();
                        
                        // Add a visual cue
                        input.style.backgroundColor = '#e8f0fe'; 
                        input.style.border = '2px solid #4f46e5';
                        
                        filledCount++;
                        break;
                    }
                }
            }
        });
        
        console.log(`AutoFill completed: Filled ${filledCount} fields.`);
    });

    function getLabelText(input) {
        let text = '';
        
        // 1. Standard label by ID
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) text += ' ' + label.innerText;
        }
        
        // 2. Wrapping label
        if (input.closest('label')) {
            text += ' ' + input.closest('label').innerText;
        }
        
        // 3. ARIA attributes (Highly used by Google Forms and modern UI)
        if (input.hasAttribute('aria-label')) {
            text += ' ' + input.getAttribute('aria-label');
        }
        if (input.hasAttribute('aria-labelledby')) {
            const ids = input.getAttribute('aria-labelledby').split(' ');
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) text += ' ' + el.innerText;
            });
        }
        
        // 4. Fallback for Google Forms (they use role="listitem" for the whole question container)
        const gContainer = input.closest('div[role="listitem"]');
        if (gContainer) {
            text += ' ' + gContainer.innerText;
        }

        // 5. General parent text fallback if still empty
        if (!text.trim() && input.parentElement) {
            text += ' ' + input.parentElement.innerText;
        }
        
        return text;
    }
})();
