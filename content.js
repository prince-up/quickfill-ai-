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
            gender: ['gender', 'sex'],
            
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

        const inputs = document.querySelectorAll('input, select, textarea, div[role="radio"], div[role="checkbox"]');
        let filledCount = 0;

        inputs.forEach(input => {
            if (input.type === 'hidden' || input.type === 'submit' || input.type === 'button') {
                return;
            }

            const isRadioOrCheckbox = input.type === 'radio' || input.type === 'checkbox' || input.getAttribute('role') === 'radio' || input.getAttribute('role') === 'checkbox';

            const name = (input.name || '').toLowerCase();
            const id = (input.id || '').toLowerCase();
            const placeholder = (input.placeholder || '').toLowerCase();
            const label = getLabelText(input).toLowerCase();

            const combinedText = `${name} ${id} ${placeholder} ${label}`;

            for (const [detailKey, keywords] of Object.entries(fieldMappings)) {
                if (details[detailKey] && details[detailKey].trim() !== '') {
                    
                    // Special handling for Radio buttons / Checkboxes
                    if (isRadioOrCheckbox) {
                        const val = details[detailKey].toLowerCase();
                        let targetValue = '';
                        
                        if (input.tagName === 'INPUT') {
                            targetValue = (input.value || '').toLowerCase();
                        } else if (input.tagName === 'DIV') {
                            targetValue = (input.getAttribute('data-value') || input.innerText || '').toLowerCase();
                        }
                        
                        // If the text surrounding the radio group matches the detail key (e.g., "Gender")
                        // AND the specific radio button matches our stored value (e.g. "Male")
                        if (keywords.some(keyword => combinedText.includes(keyword)) && targetValue.includes(val)) {
                            if (input.tagName === 'INPUT') {
                                input.checked = true;
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                            } else if (input.tagName === 'DIV') {
                                input.click();
                            }
                            
                            if (input.style) {
                                input.style.border = '2px solid #4f46e5';
                            }
                            filledCount++;
                            break;
                        }
                    } 
                    // Normal text inputs
                    else if (!isRadioOrCheckbox && keywords.some(keyword => combinedText.includes(keyword))) {
                        
                        input.focus();
                        input.value = details[detailKey];
                        
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
                        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
                        input.blur();
                        
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
        
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) text += ' ' + label.innerText;
        }
        
        if (input.closest('label')) {
            text += ' ' + input.closest('label').innerText;
        }
        
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
        
        const gContainer = input.closest('div[role="listitem"]');
        if (gContainer) {
            text += ' ' + gContainer.innerText;
        }

        if (!text.trim() && input.parentElement) {
            text += ' ' + input.parentElement.innerText;
        }
        
        return text;
    }
})();
