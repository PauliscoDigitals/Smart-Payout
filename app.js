// ==========================================================================
// 1. SYSTEM INFRASTRUCTURE CONNECTIONS & CONFIGURATIONS
// ==========================================================================
const SUPABASE_URL = 'https://swmqssiokdmnzldsmzmx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dncY4X1VCnCcVVo1u2wHxA_4D4H3fm3'; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// GLOBAL RUNTIME AUTHENTICATED STATE ENVIRONMENT VARIABLES
let CURRENT_USER_ID = null; 
let currentAdminRewardAmount = 150.00; 
let inlineTimerInterval = null;

// DECLARE GLOBAL VARIABLE HOLDERS
let authGateway, signinForm, signupForm, authSubtitle;
let taskActionBtn, inlineTimerBox, inlineCountdown, inlineClaimBtn;

// ==========================================================================
// 2. CENTRAL RUNTIME AUTOMATION SYSTEM LIFECYCLE
// ==========================================================================
window.addEventListener('DOMContentLoaded', async () => {
    // 1. Safely assign ALL DOM element nodes first so they are fully initialized
    authGateway = document.getElementById('auth-gateway');
    signinForm = document.getElementById('signin-form');
    signupForm = document.getElementById('signup-form');
    authSubtitle = document.getElementById('auth-subtitle');

    taskActionBtn = document.getElementById('task-action-btn');
    inlineTimerBox = document.getElementById('inline-timer-box');
    inlineCountdown = document.getElementById('inline-countdown');
    inlineClaimBtn = document.getElementById('inline-claim-btn');

    // 2. Initialize UI Component Event Listeners
    setupBottomNavbarNavigationSwitches();
    setupAuthPanelToggleSwitches();
    setupAuthFormSubmissions();

    // 3. Check if user is already authenticated securely
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        handleSessionTransitionRouting(session);
    } catch (e) {
        console.log("Auth session check skipped safely.");
    }

    // Watch real-time platform logins/logouts
    supabaseClient.auth.onAuthStateChange((event, session) => {
        handleSessionTransitionRouting(session);
    });

    // 4. READ REFERRAL PARAMS INSTANTLY & SAFELY
    try {
        const urlSearchParameters = new URLSearchParams(window.location.search);
        const urlReferralCode = urlSearchParameters.get('ref');

        if (urlReferralCode) {
            console.log("Target user arrived via referral tracking node ID:", urlReferralCode);
            
            // Save to browser storage for the registration submission form to read later
            localStorage.setItem('pending_signup_referrer', urlReferralCode);

            // FORCE AUTOMATIC VIEW ROUTING TO SIGN-UP SCREEN 
            if (signupForm && signinForm) {
                signinForm.style.display = 'none';   // Hide sign-in container completely
                signupForm.style.display = 'block';  // Pop open your sign-up form automatically!
            }
            
            // Customize the subtitle securely now that it is initialized
            if (authSubtitle) {
                authSubtitle.innerText = "Create an account to join your referrer's team";
            }

            // Automatically fill the input field if it exists on the screen
            const referralInputField = document.getElementById('reg-ref') || document.getElementById('referral-code-input') || document.querySelector('input[placeholder*="paul123"]');
            if (referralInputField) {
                referralInputField.value = urlReferralCode;
            }
        } else {
            // Fallback: If they loaded the page without a URL parameter, check if a code was previously saved
            const savedReferral = localStorage.getItem('pending_signup_referrer');
            if (savedReferral) {
                const referralInputField = document.getElementById('reg-ref') || document.getElementById('referral-code-input') || document.querySelector('input[placeholder*="paul123"]');
                if (referralInputField) {
                    referralInputField.value = savedReferral;
                }
            }
        }
    } catch (refError) {
        console.error("Referral switch error handled safely:", refError.message);
    }
});

function handleSessionTransitionRouting(session) {
    if (session) {
        CURRENT_USER_ID = session.user.id;
        
        // Re-locate node safely in case DOM loading order shifted
        const liveAuthGateway = document.getElementById('auth-gateway');
        if (liveAuthGateway) {
            liveAuthGateway.style.opacity = '0';
            setTimeout(() => liveAuthGateway.style.display = 'none', 400);
        }

        // Load data ecosystems safely
        if (typeof loadDashboardData === 'function') loadDashboardData();
        if (typeof loadAdminConfiguredTask === 'function') loadAdminConfiguredTask();
        if (typeof setupLiveReferralTab === 'function') setupLiveReferralTab();
        
        // Brief timeout ensures the layout tree is fully ready
        setTimeout(() => {
            setupProfileManagementSystem();
            initializeWithdrawalFormSetup();
        }, 300);

    } else {
        CURRENT_USER_ID = null;
        const liveAuthGateway = document.getElementById('auth-gateway');
        if (liveAuthGateway) {
            liveAuthGateway.style.display = 'flex';
            liveAuthGateway.style.opacity = '1';
        }
    }
}

// ==========================================================================
// 3. SECURE AUTHENTICATION PROCESSING ENGINE
// ==========================================================================
function setupAuthPanelToggleSwitches() {
    const goToSignup = document.getElementById('go-to-signup');
    const goToSignin = document.getElementById('go-to-signin');

    if (goToSignup) {
        goToSignup.onclick = () => {
            if (signinForm) signinForm.style.display = 'none';
            if (signupForm) signupForm.style.display = 'flex';
            if (authSubtitle) authSubtitle.textContent = 'Create a secure new platform membership portfolio';
        };
    }
    if (goToSignin) {
        goToSignin.onclick = () => {
            if (signupForm) signupForm.style.display = 'none';
            if (signinForm) signinForm.style.display = 'flex';
            if (authSubtitle) authSubtitle.textContent = 'Welcome back! Log in to your workspace';
        };
    }
}

function setupAuthFormSubmissions() {
    // SIGN IN FORM CONTROLLER
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const submitBtn = signinForm.querySelector('button');

            try {
                if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "Authenticating profile..."; }
                const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } catch (err) {
                alert("❌ Authentication Issue: " + err.message);
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = "Sign In to Dashboard"; }
            }
        });
    }

    // SIGN UP / ACCOUNT REGISTRATION CONTROLLER
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            
            // Checks the local input input node or falls back safely to browser cache storage values
            const refField = document.getElementById('reg-ref');
            const referralCodeApplied = (refField ? refField.value.trim() : '') || localStorage.getItem('pending_signup_referrer');
            const submitBtn = signupForm.querySelector('button');

            try {
                if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "Please wait..."; }

                const { data: authData, error: authError } = await supabaseClient.auth.signUp({ email, password });
                if (authError) throw authError;

                if (authData && authData.user) {
                    const updatePayload = { full_name: fullName };
                    if (referralCodeApplied) {
                        updatePayload.referred_by = referralCodeApplied;
                    }

                    const { error: profileError } = await supabaseClient
                        .from('profiles')
                        .update(updatePayload)
                        .eq('id', authData.user.id);

                    if (profileError) throw profileError;

                    if (referralCodeApplied) {
                        await processReferralBonusPayout(referralCodeApplied);
                    }

                    // Clear token store now that subscription context lifecycle is complete
                    localStorage.removeItem('pending_signup_referrer');

                    alert("🎉 Account registered successfully! Access granted.");
                }
            } catch (err) {
                alert("❌ Registration Interrupted: " + err.message);
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = "Register Account"; }
            }
        });
    }
}

async function processReferralBonusPayout(code) {
    try {
        const { data: referrer, error } = await supabaseClient
            .from('profiles')
            .select('id, total_balance, affiliate_earnings')
            .eq('referral_code', code)
            .single();

        if (error || !referrer) return; 

        const freshTotal = referrer.total_balance + 150.00;
        const freshAff = referrer.affiliate_earnings + 150.00;

        await supabaseClient.from('profiles').update({ total_balance: freshTotal, affiliate_earnings: freshAff }).eq('id', referrer.id);
        await supabaseClient.from('transactions').insert([{ user_id: referrer.id, type: 'Referral Bonus', amount: 150.00, status: 'APPROVED' }]);
    } catch (e) { console.error("Affiliate growth trace exception error: ", e.message); }
}

// ==========================================================================
// 4. HOME TAB DASHBOARD DISPLAY & METRICS SYNCHRONIZER
// ==========================================================================
async function loadDashboardData() {
    if (!CURRENT_USER_ID) return;
    try {
        const { data: profile, error: pErr } = await supabaseClient.from('profiles').select('*').eq('id', CURRENT_USER_ID).single();
        if (pErr) throw pErr;

        if (profile) {
            const profDashName = document.getElementById('prof-dash-name');
            const username = document.querySelector('.username');
            const balanceDisplay = document.querySelector('.balance-display');
            const statAmounts = document.querySelectorAll('.stat-amount');
            const totalEarnedDisplay = document.getElementById('total-earned-display');
            const profWalletBal = document.getElementById('prof-wallet-bal');

            if (profDashName) profDashName.textContent = profile.full_name || 'User Profile';
            if (username) username.textContent = profile.full_name || 'Verified Member';
            if (balanceDisplay) balanceDisplay.innerHTML = `<span class="currency">₦</span>${(profile.total_balance || 0).toFixed(2)}`;
            if (statAmounts && statAmounts.length >= 2) {
                statAmounts[0].textContent = `₦${(profile.affiliate_earnings || 0).toFixed(2)}`;
                statAmounts[1].textContent = `₦${(profile.task_earnings || 0).toFixed(2)}`;
            }
            if (totalEarnedDisplay) totalEarnedDisplay.textContent = `₦${((profile.affiliate_earnings || 0) + (profile.task_earnings || 0)).toFixed(2)}`;
            if (profWalletBal) profWalletBal.textContent = `₦${(profile.total_balance || 0).toFixed(2)}`;
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const { data: existingTasks } = await supabaseClient
            .from('transactions')
            .select('*')
            .eq('user_id', CURRENT_USER_ID)
            .eq('type', 'Daily Task')
            .gte('created_at', `${todayStr}T00:00:00.000Z`);

        if (taskActionBtn) {
            if (existingTasks && existingTasks.length > 0) {
                taskActionBtn.textContent = "Completed ✓";
                taskActionBtn.className = "task-btn-disabled";
                taskActionBtn.disabled = true;
                taskActionBtn.onclick = null;
            } else {
                taskActionBtn.disabled = false;
                taskActionBtn.className = "task-btn-start";
                taskActionBtn.textContent = "Start Task";
                taskActionBtn.onclick = startInlineTaskTimer;
            }
        }

        const { data: transactions } = await supabaseClient.from('transactions').select('*').eq('user_id', CURRENT_USER_ID).order('created_at', { ascending: false }).limit(5);
        renderRecentTransactionsList(transactions);

    } catch (err) { console.error("Dashboard engine sync data failure logs: ", err.message); }
}

function renderRecentTransactionsList(transactions) {
    const listContainer = document.querySelector('.transaction-list');
    if (!listContainer) return;
    
    if (!transactions || transactions.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; font-size:12px; color:#9ca3af; padding:15px;">No account operations recorded yet.</p>`;
        return;
    }

    listContainer.innerHTML = '';
    transactions.forEach(tx => {
        const formattedDate = new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        listContainer.insertAdjacentHTML('beforeend', `
            <div class="transaction-item">
                <div class="item-left">
                    <div class="icon-circle">↓</div>
                    <div class="item-info"><p class="item-title">${tx.type}</p><p class="item-date">${formattedDate}</p></div>
                </div>
                <div class="item-right">
                    <span class="amount-plus">+₦ ${(tx.amount).toFixed(2)}</span>
                    <span class="status-badge" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981;">${tx.status}</span>
                </div>
            </div>
        `);
    });
}

// ==========================================================================
// 5. INLINE ADMIN DEDICATED TASKS ENGINE
// ==========================================================================
async function loadAdminConfiguredTask() {
    try {
        let { data: taskConfig, error } = await supabaseClient.from('admin_settings').select('*').eq('setting_key', 'active_daily_task').single();
        
        const adminTaskTitle = document.getElementById('admin-task-title');
        const adminTaskReward = document.getElementById('admin-task-reward');

        if (error || !taskConfig) {
            if (adminTaskTitle) adminTaskTitle.textContent = "Join Our WhatsApp Group Chat";
            if (adminTaskReward) adminTaskReward.textContent = "₦150.00";
            return;
        }
        if (adminTaskTitle) adminTaskTitle.textContent = taskConfig.task_title;
        if (adminTaskReward) adminTaskReward.textContent = `₦${taskConfig.reward_amount.toFixed(2)}`;
        currentAdminRewardAmount = taskConfig.reward_amount;
    } catch (err) { console.error(err.message); }
}

function startInlineTaskTimer() {
    window.open("https://chat.whatsapp.com/H0d5myUs5El0Y2csraRLw8?s=cl&p=a&mlu=4", "_blank"); 

    if (taskActionBtn) taskActionBtn.style.display = "none";
    if (inlineTimerBox) inlineTimerBox.style.display = "block";
    
    let timerCountdownValue = 10;
    if (inlineCountdown) inlineCountdown.textContent = timerCountdownValue;

    clearInterval(inlineTimerInterval);
    inlineTimerInterval = setInterval(() => {
        timerCountdownValue--;
        if (inlineCountdown) inlineCountdown.textContent = timerCountdownValue;

        if (timerCountdownValue <= 0) {
            clearInterval(inlineTimerInterval);
            if (inlineTimerBox) inlineTimerBox.style.display = "none";
            
            if (inlineClaimBtn) {
                inlineClaimBtn.style.display = "block";
                inlineClaimBtn.className = "profile-action-btn";
                inlineClaimBtn.style.backgroundColor = "#10b981";
                inlineClaimBtn.textContent = `🎁 Claim ₦${currentAdminRewardAmount.toFixed(2)} Payout`;
                inlineClaimBtn.onclick = commitTaskPayoutToSupabase;
            }
        }
    }, 1000);
}

async function commitTaskPayoutToSupabase() {
    try {
        if (inlineClaimBtn) { inlineClaimBtn.disabled = true; inlineClaimBtn.textContent = "Securing ledger arrays..."; }
        const { data: profile } = await supabaseClient.from('profiles').select('total_balance, task_earnings').eq('id', CURRENT_USER_ID).single();

        const updatedTotalAmount = profile.total_balance + currentAdminRewardAmount;
        const updatedTaskAmount = profile.task_earnings + currentAdminRewardAmount;

        await supabaseClient.from('profiles').update({ total_balance: updatedTotalAmount, task_earnings: updatedTaskAmount }).eq('id', CURRENT_USER_ID);
        await supabaseClient.from('transactions').insert([{ user_id: CURRENT_USER_ID, type: 'Daily Task', amount: currentAdminRewardAmount, status: 'APPROVED' }]);

        alert(`🎉 Success: Appended +₦${currentAdminRewardAmount.toFixed(2)} directly to your balance!`);
        if (inlineClaimBtn) inlineClaimBtn.style.display = "none";
        if (taskActionBtn) taskActionBtn.style.display = "block";
        loadDashboardData();
    } catch (err) { alert("Database adjustment transaction error."); console.error(err.message); }
}

// ==========================================================================
// 6. LIVE REFERRAL MANAGEMENT MODULE
// ==========================================================================
async function setupLiveReferralTab() {
    if (!CURRENT_USER_ID) return;
    try {
        const { data: profile, error } = await supabaseClient.from('profiles').select('referral_code').eq('id', CURRENT_USER_ID).single();
        if (error || !profile || !profile.referral_code) return;

        const userCode = profile.referral_code;
        
        // Handles URL string splicing dynamically
        let currentBaseUrl = window.location.href.split('?')[0].split('#')[0];
        if (!currentBaseUrl.endsWith('/')) {
            currentBaseUrl += '/';
        }
        const realInvitationLink = `${currentBaseUrl}?ref=${userCode}`;

        const refLinkInput = document.getElementById('ref-link-input') || document.getElementById('referral-link-input');
        const refCodeDisplay = document.getElementById('ref-code-display');
        const copyRefBtn = document.getElementById('copy-ref-btn');

        if (refLinkInput) refLinkInput.value = realInvitationLink;
        if (refCodeDisplay) refCodeDisplay.textContent = userCode;

        if (copyRefBtn) {
            copyRefBtn.onclick = () => {
                navigator.clipboard.writeText(realInvitationLink);
                alert("📋 Unique tracking invitation link copied successfully!");
            };
        }

        const { data: teamMembers, error: teamError } = await supabaseClient.from('profiles').select('username, created_at').eq('referred_by', userCode);
        if (teamError) throw teamError;

        renderTeamListHTML(teamMembers);
    } catch (err) { console.error(err.message); }
}

function renderTeamListHTML(members) {
    const teamContainer = document.getElementById('real-team-list');
    const teamCountBadge = document.getElementById('team-count');
    if (!teamContainer) return;

    if (!members || members.length === 0) {
        if (teamCountBadge) teamCountBadge.textContent = "0";
        teamContainer.innerHTML = `<p style="text-align:center; font-size:12px; color:#9ca3af; padding:30px; background:#fff; border-radius:16px;">No downlines registered under your network yet.</p>`;
        return;
    }

    if (teamCountBadge) teamCountBadge.textContent = members.length;
    teamContainer.innerHTML = '';
    members.forEach(member => {
        const displayIdent = member.username || 'Anonymous Earner';
        const initialLetter = displayIdent.charAt(0).toUpperCase();
        
        teamContainer.insertAdjacentHTML('beforeend', `
            <div class="team-member-card">
                <div class="member-info-left">
                    <div class="member-avatar-circle">${initialLetter}</div>
                    <div><p class="member-name">${displayIdent}</p><span class="member-status">Active Partner</span></div>
                </div>
                <div class="bonus-tag">+₦150</div>
            </div>
        `);
    });
}

function generateUserReferralLink(userUniqueId) {
    let currentBaseUrl = window.location.href.split('?')[0].split('#')[0];
    if (!currentBaseUrl.endsWith('/')) {
        currentBaseUrl += '/';
    }
    const finalReferralLink = `${currentBaseUrl}?ref=${userUniqueId}`;
    
    const refInput = document.getElementById('referral-link-input') || document.getElementById('ref-link-input');
    if (refInput) {
        refInput.value = finalReferralLink;
    }
}

// ==========================================================================
// 7. PROFILE SETTINGS & SECURE BANK BINDING MANAGEMENT
// ==========================================================================
async function setupProfileManagementSystem() {
    if (!CURRENT_USER_ID) return;
    try {
        const { data: profile, error } = await supabaseClient.from('profiles').select('*').eq('id', CURRENT_USER_ID).single();
        if (error || !profile) return;

        const editFullname = document.getElementById('edit-fullname');
        const editPhone = document.getElementById('edit-phone');
        const editEmail = document.getElementById('edit-email');
        const bankName = document.getElementById('bank-name');
        const bankAccountNum = document.getElementById('bank-account-num');
        const bankAccountName = document.getElementById('bank-account-name');

        // Dynamic inputs configuration
        if (editFullname) editFullname.value = profile.full_name || '';
        if (editPhone) editPhone.value = profile.phone_number || '';
        if (editEmail) editEmail.value = profile.email || '';
        
        // This targets your newly updated snake_case database columns!
        if (bankName) bankName.value = profile.bank_name || '';
        if (bankAccountNum) bankAccountNum.value = profile.account_number || '';
        if (bankAccountName) bankAccountName.value = profile.account_name || '';

        // Safe Click Action Handlers
        const saveDetailsBtn = document.getElementById('save-details-btn');
        if (saveDetailsBtn) saveDetailsBtn.onclick = savePersonalProfileDetails;

        const savePasswordBtn = document.getElementById('save-password-btn');
        if (savePasswordBtn) savePasswordBtn.onclick = executePasswordVerificationSequence;

        const saveBankBtn = document.getElementById('save-bank-btn');
        if (saveBankBtn) saveBankBtn.onclick = saveSettlementBankRouteDetails;

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = async () => {
                if (confirm("Are you sure you want to log out safely?")) {
                    await supabaseClient.auth.signOut();
                    window.location.reload();
                }
            };
        }
    } catch (err) { console.error("Profile UI setup halted safely: ", err.message); }
}

async function saveSettlementBankRouteDetails() {
    const btn = document.getElementById('save-bank-btn');
    const bankName = document.getElementById('bank-name');
    const bankAccountNum = document.getElementById('bank-account-num');
    const bankAccountName = document.getElementById('bank-account-name');

    if (!bankName || !bankAccountNum || !bankAccountName) return;
    const bName = bankName.value.trim();
    const bAccNum = bankAccountNum.value.trim();
    const bAccName = bankAccountName.value.trim();

    if (bAccNum.length !== 10 || isNaN(bAccNum)) { 
        alert("⚠️ Account number must consist of exactly 10 digits."); 
        return; 
    }

    try {
        if (btn) { btn.disabled = true; btn.innerText = "Binding routes..."; }
        
        // Writes cleanly into your renamed database columns
        const { error } = await supabaseClient.from('profiles').update({ 
            bank_name: bName, 
            account_number: bAccNum, 
            account_name: bAccName 
        }).eq('id', CURRENT_USER_ID);
        
        if (error) throw error;

        alert("🏦 Settlement bank details linked successfully!");
        
        // Hard-set HTML value attributes so values survive page lifecycle changes
        bankName.setAttribute('value', bName);
        bankAccountNum.setAttribute('value', bAccNum);
        bankAccountName.setAttribute('value', bAccName);
        
        await setupProfileManagementSystem();
        await initializeWithdrawalFormSetup();

    } catch(e) { 
        alert("Error saving bank information to database.");
        console.error(e); 
    } finally { 
        if (btn) { btn.disabled = false; btn.innerText = "Save Settlement Bank"; } 
    }
}

// ==========================================================================
// 8. PERSISTENT NAVIGATION BAR DECK CONTROLLER & WITHDRAWAL ENGINE
// ==========================================================================
function setupBottomNavbarNavigationSwitches() {
    const navMapping = [
        { buttonId: 'nav-home', sectionId: 'home-tab-section' },
        { buttonId: 'nav-tasks', sectionId: 'tasks-tab-section' },
        { buttonId: 'nav-team', sectionId: 'team-tab-section' },
        { buttonId: 'nav-profile', sectionId: 'profile-tab-section' }
    ];

    navMapping.forEach(item => {
        const btnElement = document.getElementById(item.buttonId);
        if (btnElement) {
            btnElement.addEventListener('click', () => {
                switchActiveViewTabSection(item.sectionId, item.buttonId);
                if (item.sectionId === 'profile-tab-section') setupProfileManagementSystem();
            });
        }
    });

    const dashboardWithdrawBtn = document.getElementById('withdraw-action-btn');
    if (dashboardWithdrawBtn) {
        dashboardWithdrawBtn.onclick = () => {
            switchActiveViewTabSection('withdraw-tab-section', null);
            initializeWithdrawalFormSetup();
        };
    }
}

function switchActiveViewTabSection(targetSectionId, targetButtonId) {
    const sections = ['home-tab-section', 'tasks-tab-section', 'team-tab-section', 'profile-tab-section', 'withdraw-tab-section'];
    const buttons = ['nav-home', 'nav-tasks', 'nav-team', 'nav-profile'];

    sections.forEach(secId => {
        const element = document.getElementById(secId);
        if (element) element.classList.remove('active-tab');
    });
    buttons.forEach(btnId => {
        const element = document.getElementById(btnId);
        if (element) element.classList.remove('active');
    });

    const destinationSection = document.getElementById(targetSectionId);
    if (destinationSection) destinationSection.classList.add('active-tab');

    if (targetButtonId) {
        const destinationButton = document.getElementById(targetButtonId);
        if (destinationButton) destinationButton.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function initializeWithdrawalFormSetup() {
    if (!CURRENT_USER_ID) return;
    try {
        const { data: profile, error } = await supabaseClient.from('profiles').select('*').eq('id', CURRENT_USER_ID).single();
        if (error || !profile) return;

        const wBank = document.getElementById('w-bank-name');
        const wAccNum = document.getElementById('w-account-num');
        const wAccName = document.getElementById('w-account-name');
        const statusBadge = document.getElementById('withdrawal-route-status');

        // Reads the updated snake_case keys for the withdrawal dashboard overview box
        if (profile.bank_name && profile.account_number) {
            if (wBank) wBank.textContent = profile.bank_name;
            if (wAccNum) wAccNum.textContent = profile.account_number;
            if (wAccName) wAccName.textContent = profile.account_name || 'Not Provided';
            if (statusBadge) {
                statusBadge.textContent = "Active";
                statusBadge.style.backgroundColor = "#10b981";
                statusBadge.style.color = "#ffffff";
            }
        } else {
            if (wBank) wBank.textContent = "No Account Linked!";
            if (wAccNum) wAccNum.textContent = "Go to Profile to bind bank coordinates.";
            if (wAccName) wAccName.textContent = "---";
            if (statusBadge) {
                statusBadge.textContent = "Inactive";
                statusBadge.style.backgroundColor = "#ef4444";
                statusBadge.style.color = "#ffffff";
            }
        }

        const amtInput = document.getElementById('withdraw-amount-input');
        const calcFees = document.getElementById('calc-fees');
        const calcNet = document.getElementById('calc-net');

        if (amtInput) {
            amtInput.oninput = () => {
                const rawVal = parseFloat(amtInput.value) || 0;
                const processCharge = rawVal * 0.10;
                const balanceDisbursedNet = rawVal - processCharge;

                if (calcFees) calcFees.textContent = `₦${processCharge.toFixed(2)}`;
                if (calcNet) calcNet.textContent = `₦${balanceDisbursedNet >= 0 ? balanceDisbursedNet.toFixed(2) : '0.00'}`;
            };
        }

        const executePayoutBtn = document.getElementById('execute-payout-btn');
        if (executePayoutBtn) {
            executePayoutBtn.onclick = () => executeWithdrawalLedgerTransaction(profile.total_balance);
        }
    } catch (err) { console.error("Withdrawal window setup failure: ", err.message); }
}

async function executeWithdrawalLedgerTransaction(currentWalletBalance) {
    const btn = document.getElementById('execute-payout-btn');
    const amtInput = document.getElementById('withdraw-amount-input');
    if (!amtInput) return;

    const withdrawRequestAmount = parseFloat(amtInput.value) || 0;

    if (withdrawRequestAmount < 4000) {
        alert("⚠️ Minimum threshold constraint: You cannot withdraw less than ₦4,000.00.");
        return;
    }
    if (withdrawRequestAmount > currentWalletBalance) {
        alert("❌ Deficit error: Insufficient wallet balance funds available.");
        return;
    }

    try {
        if (btn) { btn.disabled = true; btn.innerText = "Processing transaction..."; }

        const absoluteNewBalance = currentWalletBalance - withdrawRequestAmount;
        const { error: updateErr } = await supabaseClient.from('profiles').update({ total_balance: absoluteNewBalance }).eq('id', CURRENT_USER_ID);
        if (updateErr) throw updateErr;

        const { error: insertErr } = await supabaseClient.from('transactions').insert([{
            user_id: CURRENT_USER_ID,
            type: 'Withdrawal',
            amount: withdrawRequestAmount,
            status: 'UNDER REVIEW'
        }]);
        if (insertErr) throw insertErr;

        alert("🎉 Settlement request issued successfully! Your payout is now UNDER REVIEW.");
        
        if (amtInput) amtInput.value = '';
        switchActiveViewTabSection('home-tab-section', 'nav-home');
        if (typeof loadDashboardData === 'function') loadDashboardData();
    } catch (e) {
        alert("Transaction dropped by server error.");
        console.error(e.message);
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = "Request Disbursal Process"; }
    }
}

// ==========================================================================
// FALLBACK IDENTITY PROFILE ACTIONS (Ensures app.js never breaks on clicks)
// ==========================================================================
async function savePersonalProfileDetails() {
    const btn = document.getElementById('save-details-btn');
    const editFullname = document.getElementById('edit-fullname');
    const editPhone = document.getElementById('edit-phone');

    if (!editFullname || !editPhone) return;
    const fName = editFullname.value.trim();
    const phone = editPhone.value.trim();

    try {
        if (btn) { btn.disabled = true; btn.innerText = "Saving changes..."; }
        
        const { error } = await supabaseClient.from('profiles').update({ 
            full_name: fName, 
            phone_number: phone
        }).eq('id', CURRENT_USER_ID);
        
        if (error) throw error;
        alert("📝 Profile details updated successfully!");
        
    } catch (e) {
        alert("Error saving profile details.");
        console.error(e.message);
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = "Save Details"; }
    }
}

async function executePasswordVerificationSequence() {
    const btn = document.getElementById('save-password-btn');
    const passCurrent = document.getElementById('pass-current');
    const passNew = document.getElementById('pass-new');

    if (!passCurrent || !passNew) return;
    const currentPwd = passCurrent.value;
    const newPwd = passNew.value;

    if (newPwd.length < 6) {
        alert("⚠️ New password must be at least 6 characters long.");
        return;
    }

    try {
        if (btn) { btn.disabled = true; btn.innerText = "Updating security..."; }
        
        // Update user password credentials safely inside Supabase Auth
        const { error } = await supabaseClient.auth.updateUser({ password: newPwd });
        if (error) throw error;

        alert("🔒 Password changed successfully!");
        if (passCurrent) passCurrent.value = '';
        if (passNew) passNew.value = '';

    } catch (e) {
        alert("Error updating credentials: " + e.message);
        console.error(e);
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = "Update Password"; }
    }
}

async function verifyAdministrativePrivileges() {
    if (!CURRENT_USER_ID) return;
    try {
        const { data: profile, error } = await supabaseClient.from('profiles').select('is_admin').eq('id', CURRENT_USER_ID).single();
        if (error || !profile) return;

        const navAdminBtn = document.getElementById('nav-admin');
        if (profile.is_admin === true) {
            if (navAdminBtn) {
                navAdminBtn.style.display = 'inline-block';
                // Clean multi-window navigation redirection trigger
                navAdminBtn.onclick = () => {
                    window.location.href = "admin.html";
                };
            }
        } else {
            if (navAdminBtn) navAdminBtn.style.display = 'none';
        }
    } catch (e) { console.error("Admin layout verification check skipped smoothly.", e.message); }
}
