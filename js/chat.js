/* Public site assistant — answers from a fixed knowledge base. No account required. */
(function () {
  const PORTAL = "https://work.jascmartin.com/portal";

  const FAQS = [
    {
      id: "services",
      label: "Services",
      keys: ["service", "offer", "what do you", "what you do", "help with", "consult"],
      answer:
        "Jason Martin Consulting offers six lines of work:\n\n• Virtual CISO (vCISO) — security leadership, risk, policy, and compliance readiness\n• Virtual CIO (vCIO) — IT strategy, roadmaps, budget, and vendor oversight\n• IT infrastructure — architecture, cloud, identity, and operations\n• Cybersecurity — assessments, control design, and practical risk reduction\n• Web development — marketing sites, client portals, and internal web apps\n• AI design and training — practical workflows and hands-on training for your team\n\nEngagements are scoped to what you need. Details are on the Services page.",
    },
    {
      id: "vciso",
      label: "What is vCISO?",
      keys: ["vciso", "v-ciso", "ciso", "security leadership", "soc 2", "iso", "compliance"],
      answer:
        "A vCISO is a fractional Chief Information Security Officer. You get security strategy, risk prioritization, policies, vendor risk, incident-response planning, and board-level reporting — without hiring a full-time CISO. Compliance readiness (such as SOC 2 or ISO 27001) is part of that work. It is advisory and program leadership, not a 24/7 monitoring service.",
    },
    {
      id: "vcio",
      label: "What is vCIO?",
      keys: ["vcio", "v-cio", "cio", "roadmap", "it strategy", "budget"],
      answer:
        "A vCIO is a fractional Chief Information Officer. The work covers IT strategy, multi-year roadmaps, technology budget, vendor selection, project priority, and cloud or infrastructure planning. The goal is to line technology spend up with business outcomes.",
    },
    {
      id: "web",
      label: "Web development",
      keys: ["website", "web dev", "web development", "web app", "frontend", "marketing site"],
      answer:
        "Web development covers marketing sites, client portals, dashboards, and internal web tools. That includes layout for phone and desktop, forms, hosting, and a handoff your team can maintain. It is scoped per project. Use the Contact page and choose Web development.",
    },
    {
      id: "ai",
      label: "AI design and training",
      keys: ["ai ", "artificial", "chatgpt", "training", "machine learning", "llm", "copilot"],
      answer:
        "AI design and training means picking the work AI should actually do, designing the workflow, and teaching your team to run it. That includes guardrails for customer and company data, and a short playbook they keep. It is not a generic tool demo. Use the Contact page and choose AI design and training.",
    },
    {
      id: "pricing",
      label: "Pricing",
      keys: ["price", "pricing", "cost", "rate", "fee", "how much", "quote", "retainer", "hourly"],
      answer:
        "There is no public price list. vCISO, vCIO, infrastructure, security, and web development are scoped to the size of the work. The next step is a no-obligation discovery call — use the Contact page and say which service you are considering. Existing clients manage requests in the support portal, not through this chat.",
    },
    {
      id: "support",
      label: "Get support",
      keys: ["support", "portal", "ticket", "request", "login", "client login", "existing client", "work"],
      answer:
        "Existing clients sign in at the Work customer portal: " +
        PORTAL +
        "\n\nUse the email your consultant set up, or an access code. That is where you open and track requests.\n\nThis chat cannot see your tickets or reset a password. For a password reset, ask your consultant.\n\nNot a client yet? Use the Contact page to request a discovery call.",
    },
    {
      id: "contact",
      label: "Talk to a person",
      keys: ["contact", "call", "email", "discovery", "schedule", "talk", "human", "person", "hire", "start"],
      answer:
        "For a new engagement, use the Contact page and request a discovery call. Tell us whether you need vCISO, vCIO, infrastructure, or cybersecurity help.\n\nIf you are already a client, sign in at " +
        PORTAL +
        " and open a request there.",
    },
    {
      id: "incident",
      label: "Incident",
      keys: ["incident", "breach", "hacked", "ransomware", "outage", "down", "emergency"],
      answer:
        "If this is an active security incident or outage, do not rely on this chat. Existing clients should sign in at " +
        PORTAL +
        " and open a high-priority request. If you are not a client yet, use the Contact page and mark it urgent. This assistant cannot respond to live incidents.",
    },
    {
      id: "about",
      label: "Who",
      keys: ["who", "about", "jason", "company", "where", "location", "alabaster"],
      answer:
        "Jason Martin has 25 years in technology, infrastructure, and security, and holds 30+ industry certifications. Jason Martin Consulting is his practice for fractional vCISO and vCIO work, plus infrastructure, cybersecurity, and web development. The public site is jascmartin.com. Client work is delivered through the Work portal.",
    },
  ];

  function score(q, faq) {
    let n = 0;
    for (const key of faq.keys) {
      if (q.includes(key)) n += key.length > 6 ? 3 : 2;
    }
    return n;
  }

  function reply(raw) {
    const q = raw.toLowerCase().replace(/[^a-z0-9\s$-]/g, " ").replace(/\s+/g, " ").trim();
    if (!q) return "Ask about services, pricing, or how to get support.";
    if (/^(hi|hello|hey|help|thanks|thank you)\b/.test(q) && q.split(" ").length < 4) {
      return "I can answer basic questions about services, pricing, and how to get support. I can’t see client accounts or open a ticket from here.";
    }
    let best = null;
    let bestScore = 0;
    for (const faq of FAQS) {
      const s = score(q, faq);
      if (s > bestScore) {
        best = faq;
        bestScore = s;
      }
    }
    if (!best || bestScore < 2) {
      return "I only cover the public site: services we offer, how pricing works, and how to get support.\n\nTry “What services do you offer?”, “How much does a vCISO cost?”, or “How do clients get support?”\n\nFor anything about your environment, use Contact or the client portal.";
    }
    return best.answer;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function addMessage(log, role, text) {
    const wrap = el("div", "jmc-msg " + role);
    text.split("\n").forEach((line, i) => {
      if (i) wrap.appendChild(document.createElement("br"));
      const url = line.match(/https?:\/\/\S+/);
      if (url) {
        const [before, after] = line.split(url[0]);
        wrap.appendChild(document.createTextNode(before));
        const a = document.createElement("a");
        a.href = url[0];
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = url[0];
        wrap.appendChild(a);
        wrap.appendChild(document.createTextNode(after || ""));
      } else if (line.includes("Contact page")) {
        const parts = line.split("Contact page");
        wrap.appendChild(document.createTextNode(parts[0]));
        const a = document.createElement("a");
        a.href = "contact.html";
        a.textContent = "Contact page";
        wrap.appendChild(a);
        wrap.appendChild(document.createTextNode(parts[1] || ""));
      } else if (line.includes("Services page")) {
        const parts = line.split("Services page");
        wrap.appendChild(document.createTextNode(parts[0]));
        const a = document.createElement("a");
        a.href = "services.html";
        a.textContent = "Services page";
        wrap.appendChild(a);
        wrap.appendChild(document.createTextNode(parts[1] || ""));
      } else {
        wrap.appendChild(document.createTextNode(line));
      }
    });
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }

  function mount() {
    const overlay = el("div", "jmc-overlay");
    overlay.hidden = true;
    const dialog = el("div", "jmc-dialog");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-label", "Ask Jason Martin Consulting");

    const head = el("div", "jmc-dialog-head");
    const brand = el("div", "jmc-brand");
    brand.appendChild(el("div", "jmc-mark", "JM"));
    const titles = el("div");
    titles.appendChild(el("h2", "", "Ask a question"));
    titles.appendChild(el("p", "", "Services, pricing, and how to get support"));
    brand.appendChild(titles);
    const close = el("button", "jmc-x", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    head.appendChild(brand);
    head.appendChild(close);

    const log = el("div", "jmc-log");
    const prompts = el("div", "jmc-prompts");
    ["What services do you offer?", "How does pricing work?", "How do clients get support?"].forEach((label) => {
      const b = el("button", "jmc-chip", label);
      b.type = "button";
      b.addEventListener("click", () => ask(label));
      prompts.appendChild(b);
    });

    const form = el("form", "jmc-composer");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type a question";
    input.setAttribute("aria-label", "Question");
    input.maxLength = 240;
    const send = el("button", "", "Send");
    send.type = "submit";
    form.appendChild(input);
    form.appendChild(send);

    dialog.appendChild(head);
    dialog.appendChild(log);
    dialog.appendChild(prompts);
    dialog.appendChild(form);
    overlay.appendChild(dialog);

    const toggle = el("button", "jmc-launch", "Chat");
    toggle.type = "button";
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h5M6 18l-2 3V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6z"/></svg> Chat';

    document.body.appendChild(overlay);
    document.body.appendChild(toggle);

    function ask(text) {
      const q = text.trim();
      if (!q) return;
      addMessage(log, "user", q);
      addMessage(log, "bot", reply(q));
      input.value = "";
      input.focus();
    }

    function open() {
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      if (!log.childElementCount) {
        addMessage(log, "bot", "I can answer questions about services, pricing, and how to get support. I can’t see client accounts or open a ticket.");
      }
      input.focus();
    }
    function shut() {
      overlay.hidden = true;
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", open);
    close.addEventListener("click", shut);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) shut(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) shut(); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      ask(input.value);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
