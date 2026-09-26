/* Public site assistant — answers from a fixed knowledge base. No account required. */
(function () {
  const PORTAL = "https://work.jascmartin.com/portal";

  const FAQS = [
    {
      id: "services",
      label: "Services",
      keys: ["service", "offer", "what do you", "what you do", "help with", "consult"],
      answer:
        "Jason Martin Consulting offers four lines of work:\n\n• Virtual CISO (vCISO) — security leadership, risk, policy, and compliance readiness\n• Virtual CIO (vCIO) — IT strategy, roadmaps, budget, and vendor oversight\n• IT infrastructure — architecture, cloud, identity, and operations\n• Cybersecurity — assessments, control design, and practical risk reduction\n\nEngagements are fractional: executive-level guidance without a full-time hire. Details are on the Services page.",
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
      id: "pricing",
      label: "Pricing",
      keys: ["price", "pricing", "cost", "rate", "fee", "how much", "quote", "retainer", "hourly"],
      answer:
        "There is no public price list. vCISO, vCIO, infrastructure, and security work are scoped to the size of the organization and what you need done. The next step is a no-obligation discovery call — use the Contact page and say which service you are considering. Existing clients manage requests in the support portal, not through this chat.",
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
        "Jason Martin Consulting is a practitioner-led IT and security practice. The work is fractional vCISO and vCIO leadership plus hands-on infrastructure and cybersecurity. The public site is jascmartin.com. Client work is delivered through the Work portal.",
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
    const root = el("div", "jmc-chat");
    const panel = el("div", "jmc-chat-panel");
    panel.hidden = true;

    const head = el("div", "jmc-chat-head");
    head.appendChild(el("div", "jmc-chat-title", "Support"));
    const close = el("button", "jmc-chat-close", "Close");
    close.type = "button";
    head.appendChild(close);

    const log = el("div", "jmc-chat-log");
    const chips = el("div", "jmc-chat-chips");
    ["Services", "Pricing", "Get support"].forEach((label) => {
      const b = el("button", "jmc-chip", label);
      b.type = "button";
      b.addEventListener("click", () => ask(label));
      chips.appendChild(b);
    });

    const form = el("form", "jmc-chat-form");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Ask about services, pricing, or support";
    input.setAttribute("aria-label", "Question");
    input.maxLength = 240;
    const send = el("button", "jmc-chat-send", "Send");
    send.type = "submit";
    form.appendChild(input);
    form.appendChild(send);

    panel.appendChild(head);
    panel.appendChild(log);
    panel.appendChild(chips);
    panel.appendChild(form);

    const toggle = el("button", "jmc-chat-toggle", "Ask a question");
    toggle.type = "button";

    root.appendChild(panel);
    root.appendChild(toggle);
    document.body.appendChild(root);

    function ask(text) {
      const q = text.trim();
      if (!q) return;
      addMessage(log, "user", q);
      addMessage(log, "bot", reply(q));
      input.value = "";
    }

    function open() {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      if (!log.childElementCount) {
        addMessage(
          log,
          "bot",
          "Ask about services, pricing, or how to get support. I don’t have access to client accounts."
        );
      }
      input.focus();
    }

    toggle.addEventListener("click", () => {
      if (panel.hidden) open();
      else panel.hidden = true;
    });
    close.addEventListener("click", () => {
      panel.hidden = true;
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      ask(input.value);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
