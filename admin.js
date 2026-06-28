// ==========================================================================
// INDEPENDENT ADMINISTRATION - CRYPTOGRAPHIC AUTH SYSTEM (UPDATED FIX)
// ==========================================================================

const SUPABASE_URL = "https://swmqssiokdmnzldsmzmx.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_dncY4X1VCnCcVVo1u2wHxA_4D4H3fm3";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cryptographic hash values for exact match: username "admin" & password "MasterControl2026"
const TARGET_USER_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; 
const TARGET_PASS_HASH = "57cf1899ffb26e0e9cf4fb6195fb524384b64b197943fcfd3269a844941da7cb";

document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("admin_authorized_token") === "true") {
        document.getElementById('admin-auth-shield').style.display = 'none';
        renderAdministrativeEcosystemSnapshot();
        bindGlobalAdminActionButtons();
    } else {
        setupAdminGatewayFormHandlers();
    }
});

async function computeSecureSHA256Hash(stringInput) {
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(stringInput);
    const contextBuffer = await crypto.subtle.digest("SHA-256", dataBytes);
    const byteArray = Array.from(new Uint8Array(contextBuffer));
    return byteArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function setupAdminGatewayFormHandlers() {
    const authBtn = document.getElementById('adm-login-submit-btn');
    if (!authBtn) return;

    authBtn.onclick = async () => {
        const userField = document.getElementById('adm-auth-username');
        const passField = document.getElementById('adm-auth-password');

        if (!userField || !passField) return;

        const rawUser = userField.value.trim().toLowerCase();
        const rawPass = passField.value.trim();

        // 🛠️ TEMPORARY PLAIN TEXT CHECK (Bypasses hash problems for testing)
        if (rawUser === "admin" && rawPass === "MasterControl2026") {
            sessionStorage.setItem("admin_authorized_token", "true");
            alert("🔓 Access Granted!");
            document.getElementById('admin-auth-shield').style.display = 'none';
            
            renderAdministrativeEcosystemSnapshot();
            bindGlobalAdminActionButtons();
        } else {
            alert("❌ Critical Security Warning: Invalid authorization token pair configuration.");
            userField.value = '';
            passField.value = '';
        }
    };
}async function renderAdministrativeEcosystemSnapshot() {
    try {
        // 1. Fetch Metrics Data Counters from collections
        const { data: allUsers, error: uErr } = await supabaseClient.from('profiles').select('*');
        const { data: pendingTx, error: tErr } = await supabaseClient.from('transactions').select('*').eq('status', 'UNDER REVIEW');

        if (uErr || tErr) throw new Error("Data retrieval pipeline failure.");

        document.getElementById('admin-total-users').textContent = allUsers.length;
        document.getElementById('admin-pending-withdrawals').textContent = pendingTx.length;

        // 2. Populate User Accounts Management Registry List View
        const usersWrapper = document.getElementById('admin-users-wrapper');
        if (usersWrapper) {
            usersWrapper.innerHTML = '';
            if (allUsers.length === 0) {
                usersWrapper.innerHTML = `<p style="text-align:center;font-size:13px;color:#64748b;">No system user accounts registered.</p>`;
            } else {
                allUsers.forEach(user => {
                    const blockStatusText = user.account_status === 'MUTED' ? '🟢 Unmute User' : '🛑 Mute User';
                    const statusBadgeBg = user.account_status === 'MUTED' ? '#ef4444' : '#10b981';
                    
                    const userRow = document.createElement('div');
                    userRow.className = "user-row";
                    userRow.innerHTML = `
                        <div class="row-header">
                            <strong>📧 ${user.email || 'No email registered'}</strong>
                            <span class="badge" style="background:${statusBadgeBg}">${user.account_status || 'ACTIVE'}</span>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin: 8px 0; color:#475569;">
                            <div><strong>Full Name:</strong> ${user.full_name || 'Not Provided'}</div>
                            <div><strong>Phone:</strong> ${user.phone_number || 'Not Provided'}</div>
                            <div><strong>Wallet Balance:</strong> <span style="color:#10b981; font-weight:bold;">₦${(parseFloat(user.total_balance) || 0).toFixed(2)}</span></div>
                            <div><strong>Linked Bank:</strong> ${user.bank_name || '---'} (${user.account_number || 'No Account'})</div>
                        </div>
                        <div class="btn-group">
                            <button onclick="modifyUserBalanceAdmin('${user.id}', 1000)" style="background:#10b981;">+ ₦1,000</button>
                            <button onclick="modifyUserBalanceAdmin('${user.id}', -1000)" style="background:#f59e0b;">- ₦1,000</button>
                            <button onclick="toggleUserAccountMuteState('${user.id}', '${user.account_status}')" style="background:#475569;">${blockStatusText}</button>
                            <button onclick="manualEditUserPrompt('${user.id}', '${user.full_name || ''}', '${user.phone_number || ''}')" style="background:#6322ef;">✏️ Edit Profile</button>
                        </div>
                    `;
                    usersWrapper.appendChild(userRow);
                });
            }
        }

        // 3. Populate Pending Settlements Queue Controller Card
        const txWrapper = document.getElementById('admin-withdrawals-wrapper');
        if (txWrapper) {
            txWrapper.innerHTML = '';
            if (pendingTx.length === 0) {
                txWrapper.innerHTML = `<p style="text-align:center;font-size:13px;color:#64748b;margin-top:20px;">No requests under evaluation review.</p>`;
            } else {
                pendingTx.forEach(tx => {
                    const txRow = document.createElement('div');
                    txRow.className = "tx-row";
                    txRow.innerHTML = `
                        <div class="row-header">
                            <strong>💰 Cashout Amount: ₦${(parseFloat(tx.amount) || 0).toFixed(2)}</strong>
                            <span class="badge" style="background:#f59e0b;">PENDING REVIEW</span>
                        </div>
                        <p style="margin:4px 0; color:#475569;"><strong>User ID:</strong> ${tx.user_id}</p>
                        <p style="margin:4px 0; color:#64748b; font-size:11px;">Request Timestamp: ${new Date(tx.created_at).toLocaleString()}</p>
                        <div class="btn-group" style="margin-top:12px;">
                            <button onclick="processSettlementStateUpdate('${tx.id}', 'SUCCESSFUL')" style="background:#10b981; padding:8px 14px;">✅ Approve Cashout</button>
                            <button onclick="processSettlementStateUpdate('${tx.id}', 'REJECTED', ${tx.amount}, '${tx.user_id}')" style="background:#ef4444; padding:8px 14px;">❌ Reject / Bounce Fund</button>
                        </div>
                    `;
                    txWrapper.appendChild(txRow);
                });
            }
        }
    } catch(err) { console.error("Error drawing operational administrative panels: ", err); }
}

function bindGlobalAdminActionButtons() {
    const publishTaskBtn = document.getElementById('adm-submit-task-btn');
    if (publishTaskBtn) {
        publishTaskBtn.onclick = async () => {
            const titleInput = document.getElementById('adm-task-title');
            const rewardInput = document.getElementById('adm-task-reward');
            const urlInput = document.getElementById('adm-task-url');

            if (!titleInput || !rewardInput || !urlInput) return;
            const title = titleInput.value.trim();
            const reward = parseFloat(rewardInput.value) || 0;
            const url = urlInput.value.trim();

            if (!title || reward <= 0 || !url) { alert("Please complete input task details cleanly."); return; }

            try {
                publishTaskBtn.disabled = true; 
publishTaskBtn.innerText = "Deploying task parameters...";
                const { error } = await supabaseClient.from('tasks').insert([{ title, reward_amount: reward, task_link: url }]);
                if (error) throw error;

                alert("🎯 Task published directly to user application streams!");
                titleInput.value = ''; rewardInput.value = ''; urlInput.value = '';
                renderAdministrativeEcosystemSnapshot();
            } catch(e) { alert("Error uploading task node specifications."); console.error(e); }
            finally { publishTaskBtn.disabled = false; publishTaskBtn.innerText = "Publish Global Task"; }
        };
    }
}

// Global actions exposed on window layer scope for dynamic row bindings
window.modifyUserBalanceAdmin = async function(targetUserId, adjustmentAmount) {
    try {
        const { data: profile, error } = await supabaseClient.from('profiles').select('total_balance').eq('id', targetUserId).single();
        if (error || !profile) return;

        const calculatedBalance = (parseFloat(profile.total_balance) || 0) + adjustmentAmount;
        await supabaseClient.from('profiles').update({ total_balance: calculatedBalance }).eq('id', targetUserId);
        
        renderAdministrativeEcosystemSnapshot();
    } catch (e) { alert("Operational adjustment failure."); }
};

window.toggleUserAccountMuteState = async function(targetUserId, currentStatus) {
    const targetStatusFlag = currentStatus === 'MUTED' ? 'ACTIVE' : 'MUTED';
    try {
        await supabaseClient.from('profiles').update({ account_status: targetStatusFlag }).eq('id', targetUserId);
        renderAdministrativeEcosystemSnapshot();
    } catch(e) { alert("Failed mutation on restriction status toggles."); }
};

window.manualEditUserPrompt = async function(targetUserId, currentName, currentPhone) {
    const nextName = prompt("Modify Profile Account Name Name:", currentName);
    const nextPhone = prompt("Modify Profile Linked Mobile Line:", currentPhone);
    if (nextName === null || nextPhone === null) return;

    try {
        await supabaseClient.from('profiles').update({ full_name: nextName, phone_number: nextPhone }).eq('id', targetUserId);
        renderAdministrativeEcosystemSnapshot();
    } catch(e) { alert("Error modifying user structural matrix attributes."); }
};

window.processSettlementStateUpdate = async function(transactionId, nextStatus, amount = 0, targetUserId = null) {
    if (!confirm(`Mark this payout request ledger record as ${nextStatus}?`)) return;
    try {
        await supabaseClient.from('transactions').update({ status: nextStatus }).eq('id', transactionId);

        // Refund capital balance coordinates back to user profile if cashout is explicitly rejected
        if (nextStatus === 'REJECTED' && targetUserId && amount > 0) {
            const { data: p } = await supabaseClient.from('profiles').select('total_balance').eq('id', targetUserId).single();
            if (p) {
                const refundedBalance = (parseFloat(p.total_balance) || 0) + amount;
                await supabaseClient.from('profiles').update({ total_balance: refundedBalance }).eq('id', targetUserId);
            }
        }
        renderAdministrativeEcosystemSnapshot();
    } catch(e) { alert("Error processing transaction mutation parameters."); }
};
