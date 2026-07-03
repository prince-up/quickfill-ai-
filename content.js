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
