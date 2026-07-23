(function() {
    chrome.storage.local.get(['userDetails'], (result) => {
        if (!result.userDetails) {
            console.log('No autofill details found in storage.');
            return;
        }

        const details = result.userDetails;
        
        // Field mappings sorted by specific first to prevent false matches 
        // e.g. company name should map before just name
        const fieldMappings = {
            companyName: ['company name', 'company', 'employer', 'organization', 'firm'],
            collegeName: ['college name', 'university name', 'college', 'university', 'institution', 'school', 'institute'],
            fullName: ['full name', 'fullname', 'name', 'first name', 'last name', 'fname', 'lname'],
            
            email: ['email', 'e-mail', 'emailaddress', 'mail'],
            phone: ['phone', 'telephone', 'mobile', 'cell', 'contact', 'number'],
            gender: ['gender', 'sex'],
            citizenship: ['citizenship', 'nationality', 'citizen'],
            dob: ['dob', 'date of birth', 'birth date'],
            
            address: ['address', 'street', 'address1', 'addr1', 'location'],
            district: ['district', 'county'],
            city: ['city', 'town'],
            state: ['state', 'province', 'region'],
            zipCode: ['zip', 'zipcode', 'postal', 'postcode', 'pincode', 'pin code', 'pin'],
            country: ['country', 'nation'],
            
            github: ['github', 'git', 'github id', 'github profile'],
            linkedin: ['linkedin', 'linkedin id', 'linked in', 'linkedin profile'],
            portfolio: ['portfolio', 'website', 'personal site'],
            leetcode: ['leetcode', 'leet code', 'leetcode id'],
            
            degree: ['degree', 'bachelor', 'major', 'course', 'program', 'graduation'],
            specialization: ['specialization', 'stream', 'branch', 'department'],
            cgpa: ['cgpa', 'gpa', 'grade point', 'grade', 'percentage'],
            graduationYear: ['graduation year', 'grad year', 'passing year', 'year of passing'],
            
            internship: ['internship', 'role', 'position', 'title', 'job title'],
            internshipDuration: ['duration', 'period', 'months', 'tenure'],
            projects: ['projects', 'project details', 'work experience'],
            
            skills: ['skills', 'technologies', 'tools', 'tech stack'],
            achievements: ['achievements', 'awards', 'honors'],
            certifications: ['certifications', 'certificates', 'courses'],
            
            expectedCTC: ['expected ctc', 'expected salary', 'compensation'],
            noticePeriod: ['notice period', 'availability', 'joining time'],
            preferredLocations: ['preferred locations', 'preferred city', 'relocation'],
            commonAnswers: ['why join', 'cover letter', 'additional info', 'about you']
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

            // Strict word boundary matching check function
            const hasKeywordMatch = (keywords, text) => {
                return keywords.some(keyword => {
                    // Escape special characters if any
                    const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    // Create regex with word boundaries
                    const regex = new RegExp(`\\b${safeKeyword}\\b`, 'i');
                    return regex.test(text);
                });
            };

            for (const [detailKey, keywords] of Object.entries(fieldMappings)) {
                if (details[detailKey] && details[detailKey].trim() !== '') {
                    
                    // Normal text inputs
                    if (!isRadioOrCheckbox && hasKeywordMatch(keywords, combinedText)) {
                        
                        input.focus();
                        input.value = details[detailKey];
                        
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
                        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
                        input.blur();
                        
                        input.style.backgroundColor = 'rgba(168, 85, 247, 0.1)'; 
                        input.style.border = '2px solid #a855f7';
                        
                        filledCount++;
                        break;
                    }
                    // Special handling for Radio buttons / Checkboxes
                    else if (isRadioOrCheckbox) {
                        const val = details[detailKey].toLowerCase();
                        let targetValue = '';
                        
                        if (input.tagName === 'INPUT') {
                            targetValue = (input.value || '').toLowerCase();
                            // Fallback to reading adjacent text for radio buttons missing value attributes
                            if (!targetValue || targetValue === 'on') {
                                const nextSibling = input.nextSibling;
                                if (nextSibling && nextSibling.nodeType === 3) { // Text node
                                    targetValue = nextSibling.textContent.toLowerCase();
                                }
                            }
                        } else if (input.tagName === 'DIV') {
                            targetValue = (input.getAttribute('data-value') || input.innerText || '').toLowerCase();
                        }
                        
                        if (hasKeywordMatch(keywords, combinedText) && targetValue.includes(val)) {
                            if (input.tagName === 'INPUT') {
                                input.checked = true;
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                            } else if (input.tagName === 'DIV') {
                                input.click();
                            }
                            
                            if (input.style) {
                                input.style.border = '2px solid #a855f7';
                            }
                            filledCount++;
                            break;
                        }
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
