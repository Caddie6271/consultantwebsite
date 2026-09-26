// Jason Martin Consulting - Main JS + Work Integration

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('shadow-lg', 'shadow-black/20');
      } else {
        navbar.classList.remove('shadow-lg', 'shadow-black/20');
      }
    });
  }
});

/* ============================================================
   WORK BACKEND INTEGRATION
   ============================================================
   1. Set apiBase to your Work API URL
   2. Adjust endpoints to match your Work routes
   3. Set useRealApi: true when ready
   4. Ensure CORS is enabled on your Work API for jascmartin.com
   ============================================================ */

const WORK_CONFIG = {
  // >>> UPDATE THESE VALUES TO MATCH YOUR WORK APP <<<
  apiBase: 'https://api.work.jascmartin.com',   // e.g. https://work.yourdomain.com/api
  useRealApi: false,                            // flip to true when Work is ready

  endpoints: {
    login: '/auth/login',           // POST { email, password } → { token, user }
    me: '/auth/me',                 // GET (Bearer) → current user
    tickets: '/tickets',            // GET (Bearer) → list of tickets
    createTicket: '/tickets',       // POST (Bearer) { subject, description, category, priority }
    ticketById: (id) => `/tickets/${id}`,  // GET / PATCH
  },

  // Optional: map your Work status values if they differ
  statusMap: {
    open: 'open',
    'in-progress': 'in-progress',
    resolved: 'resolved',
    closed: 'resolved',
  },
};

/* ---------- Local demo store (used when useRealApi = false) ---------- */
const PortalStore = {
  getUser() {
    const u = localStorage.getItem('jmc_user');
    return u ? JSON.parse(u) : null;
  },
  setUser(user) {
    localStorage.setItem('jmc_user', JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem('jmc_user');
    localStorage.removeItem('jmc_token');
  },
  getToken() {
    return localStorage.getItem('jmc_token');
  },
  setToken(token) {
    localStorage.setItem('jmc_token', token);
  },
  getTickets() {
    const t = localStorage.getItem('jmc_tickets');
    return t ? JSON.parse(t) : [];
  },
  saveTickets(tickets) {
    localStorage.setItem('jmc_tickets', JSON.stringify(tickets));
  },
  addTicket(ticket) {
    const tickets = this.getTickets();
    tickets.unshift(ticket);
    this.saveTickets(tickets);
    return ticket;
  },
};

/* ---------- Helper: authenticated fetch ---------- */
async function workFetch(path, options = {}) {
  const url = `${WORK_CONFIG.apiBase}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = PortalStore.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || errBody.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ---------- Public API used by support.html ---------- */

async function portalLogin(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password required' };
  }

  if (WORK_CONFIG.useRealApi) {
    try {
      const data = await workFetch(WORK_CONFIG.endpoints.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // Expect: { token, user: { name, email, ... } }
      PortalStore.setToken(data.token);
      PortalStore.setUser(data.user || { email, name: email.split('@')[0] });
      return { success: true, user: PortalStore.getUser() };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }

  // Demo mode
  const user = { email, name: email.split('@')[0], token: 'demo-token-' + Date.now() };
  PortalStore.setUser(user);
  PortalStore.setToken(user.token);
  return { success: true, user };
}

function portalLogout() {
  PortalStore.clearUser();
  window.location.href = 'support.html';
}

async function createRequest(data) {
  if (WORK_CONFIG.useRealApi) {
    try {
      const ticket = await workFetch(WORK_CONFIG.endpoints.createTicket, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return { success: true, ticket };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Demo mode
  const ticket = {
    id: 'REQ-' + Date.now().toString(36).toUpperCase(),
    ...data,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  PortalStore.addTicket(ticket);
  return { success: true, ticket };
}

async function listRequests() {
  if (WORK_CONFIG.useRealApi) {
    try {
      const tickets = await workFetch(WORK_CONFIG.endpoints.tickets);
      return Array.isArray(tickets) ? tickets : (tickets.data || []);
    } catch (err) {
      console.error('Failed to load tickets from Work:', err);
      return [];
    }
  }
  return PortalStore.getTickets();
}

// Expose for support.html
window.JMCPortal = {
  config: WORK_CONFIG,
  login: portalLogin,
  logout: portalLogout,
  createRequest,
  listRequests,
  getUser: () => PortalStore.getUser(),
};
