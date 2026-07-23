document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = `tab-${btn.dataset.tab}`;
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    const fields = [
        'fullName', 'email', 'phone', 'gender', 'citizenship', 'dob',
        'address', 'district', 'city', 'state', 'zipCode', 'country',
        'github', 'linkedin', 'portfolio', 'leetcode',
        'collegeName', 'degree', 'specialization', 'cgpa', 'graduationYear',
        'companyName', 'internship', 'internshipDuration', 'projects',
        'skills', 'achievements', 'certifications',
        'expectedCTC', 'noticePeriod', 'preferredLocations', 'commonAnswers'
    ];

    const defaultData = {
        fullName: "Prince Yadav",
        email: "princeyadav76001@gmail.com",
        phone: "+91-7986614646",
        gender: "",
        citizenship: "Indian Citizen",
        dob: "",
        address: "Phagwara, Punjab, India",
        district: "",
        city: "Phagwara",
        state: "Punjab",
        zipCode: "144411",
        country: "India",
        github: "https://github.com/prince-up",
        linkedin: "https://linkedin.com/in/prince-yadav-4t",
        portfolio: "https://prince-yadav.lovable.app",
        leetcode: "",
        collegeName: "Lovely Professional University",
        degree: "Bachelor of Technology",
        specialization: "Computer Science and Engineering",
        cgpa: "6.62",
        graduationYear: "2027",
        companyName: "WorldWin Coder Pvt. Ltd.",
        internship: "Software Engineering Intern",
        internshipDuration: "3 Months",
        projects: "1. MarketMind AI (Next.js, TypeScript, Supabase, LangGraph, Groq)\n2. HireMind AI (Next.js, FastAPI, Python, Gemini, Qdrant, RAG)\n3. Cold Mail Agent (Node.js, TypeScript, Gmail API, OAuth)\n4. AstraLMS (React, Node.js, Express, MongoDB, Socket.io)",
        skills: "Frontend: React.js, Next.js, TypeScript, JavaScript, HTML, Tailwind CSS\nBackend: Node.js, Express.js, FastAPI, REST API\nDatabase: PostgreSQL, MongoDB, Supabase\nCloud: AWS, Docker, Nginx, GitHub Actions\nAI: LLMs, Agentic AI, RAG, LangChain, LangGraph, CrewAI",
        achievements: "- Won prizes in 3 Hackathons\n- GirlScript Summer of Code 2024 Contributor\n- 28 merged commits to webpack.js.org\n- 300+ LeetCode problems solved\n- 5-Star HackerRank badges in Java, SQL and Problem Solving",
        certifications: "- Oracle AI Foundation Associate\n- Next.js Development\n- Programming Pathshala DSA\n- React Native Development",
        expectedCTC: "8 LPA",
        noticePeriod: "Immediate",
        preferredLocations: "Bengaluru, Hyderabad, Pune, Gurugram, Delhi NCR, Remote",
        commonAnswers: "Why join immediately: No notice period. Available to join immediately.\nRelocate: Yes\nWork Authorization: Yes"
    };

    try {
        chrome.storage.local.get(['userDetails'], (result) => {
            const details = result.userDetails || defaultData;
            fields.forEach(field => {
                const el = document.getElementById(field);
                if (el) {
                    el.value = details[field] || '';
                    if (el.value) {
                        const label = el.nextElementSibling;
                        if (label && label.tagName === 'LABEL') {
                            label.classList.add('active');
                        }
                    }
                }
            });
            if (!result.userDetails) {
                chrome.storage.local.set({ userDetails: defaultData });
            }
        });
    } catch(err) {
        console.error("Storage get error:", err);
    }

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
