/**
 * Seneca CTY Semester 3 Socratic Concept Viva & Technical Oral Defense Repository
 * Deep conceptual questions, progressive hints, model answers, and pitfalls
 * for midterms, lab demos, and oral practical examinations.
 */

export const VIVA_QUESTIONS = [
  // --- OPS345: Linux System Administration ---
  {
    id: "ops345-viva-1",
    courseId: "ops345",
    courseCode: "OPS345",
    courseName: "Linux System Administration",
    category: "DNS & Service Architecture",
    difficulty: "Distinction 4.0",
    question: "Why do we configure BIND9 with both forward and reverse lookup zones? What critical services fail in an enterprise network if reverse DNS (PTR) records are misconfigured or missing?",
    whyProfessorsAsk: "Tests whether you understand DNS as a protocol and security mechanism rather than just copying zone files from a lab manual.",
    hints: [
      "Hint 1: Forward DNS maps hostname -> IP. Reverse DNS maps IP -> hostname using the in-addr.arpa domain.",
      "Hint 2: Consider enterprise authentication systems like Kerberos, SSH host key verification, and SMTP mail servers.",
      "Hint 3: Think about anti-spam verification and how Kerberos generates service tickets using canonical reverse-resolved hostnames."
    ],
    modelAnswer: "Forward DNS maps Fully Qualified Domain Names (FQDNs) to IPv4/IPv6 addresses (A/AAAA records). Reverse DNS maps IP addresses back to FQDNs using PTR records under the special in-addr.arpa domain.\n\nIn an enterprise network, if reverse DNS is missing or misconfigured:\n1. Kerberos Authentication Fails: Kerberos relies on forward and reverse DNS consistency to establish service principal names (SPNs) and issue tickets. A mismatch breaks Active Directory SSO and FreeIPA.\n2. SMTP Mail Transport Fails: Modern mail transfer agents (MTAs) enforce strict Forward-Confirmed Reverse DNS (FCrDNS) to combat spam. If the connecting IP lacks a valid PTR matching its EHLO hostname, emails are immediately dropped.\n3. SSH Connection Latency / Timeouts: The OpenSSH daemon performs a reverse lookup on the connecting client IP for access logging and AllowUsers rules. Without valid PTR or 'UseDNS no', logins experience 10-30 second hangs.",
    pitfalls: "Do not simply say 'it lets you ping by IP'. Ping works directly by IP without DNS! Focus on authentication (Kerberos), email spam filtering (FCrDNS), and audit logging.",
    keyTerms: ["PTR Record", "in-addr.arpa", "FCrDNS", "Kerberos SPN", "SMTP Reject", "OpenSSH UseDNS"]
  },
  {
    id: "ops345-viva-2",
    courseId: "ops345",
    courseCode: "OPS345",
    courseName: "Linux System Administration",
    category: "Kernel Networking & NAT",
    difficulty: "Advanced",
    question: "Explain the exact role of 'net.ipv4.ip_forward = 1' and how iptables MASQUERADE rewrites packets at the Linux kernel network layer.",
    whyProfessorsAsk: "Parul and Linux faculty want to know if you comprehend how the Linux kernel transitions from an endpoint to a router.",
    hints: [
      "Hint 1: By default, a Linux host drops any IP packet whose destination IP does not match one of its local network interfaces.",
      "Hint 2: net.ipv4.ip_forward instructs the IP routing subsystem in the kernel to consult the routing table and forward foreign packets.",
      "Hint 3: MASQUERADE is a specialized form of Source NAT (SNAT) applied in the POSTROUTING netfilter hook."
    ],
    modelAnswer: "By default, the Linux kernel operates as a host endpoint: any incoming packet whose destination IP address does not match one of the host's assigned IP addresses is immediately discarded at Layer 3.\n\nSetting 'net.ipv4.ip_forward = 1' tells the kernel's network stack to function as a Layer 3 router. Instead of dropping non-local packets, the kernel consults its internal routing table (`ip route`) and transmits the packet out the appropriate egress interface.\n\nThe iptables MASQUERADE target is a specialized form of Source NAT (SNAT) evaluated in the POSTROUTING chain of the nat table. When private subnet packets leave via the public/WAN interface, MASQUERADE rewrites the source IP address to the current IP of the outgoing interface and tracks the session in the conntrack (connection tracking) table. When response packets return, conntrack translates the destination IP back to the original internal client.",
    pitfalls: "Forgetting to explain that MASQUERADE dynamically detects the egress interface IP (unlike static SNAT --to-source), or forgetting connection tracking (conntrack).",
    keyTerms: ["net.ipv4.ip_forward", "POSTROUTING", "conntrack", "SNAT vs MASQUERADE", "Layer 3 Routing Table"]
  },
  {
    id: "ops345-viva-3",
    courseId: "ops345",
    courseCode: "OPS345",
    courseName: "Linux System Administration",
    category: "Systemd & Process Architecture",
    difficulty: "Core",
    question: "What is the operational difference between 'systemctl reload <service>' and 'systemctl restart <service>'? When is reload preferred in production?",
    whyProfessorsAsk: "Every junior sysadmin who restarts a service in production causes downtime. Professors test if you know how to safely update configurations.",
    hints: [
      "Hint 1: Restart kills the main process PID and spawns a new one. Reload sends a signal to the running PID.",
      "Hint 2: Which POSIX signal typically triggers a configuration reread without dropping active TCP connections?",
      "Hint 3: Think of Nginx, Apache, or BIND9 with hundreds of active client downloads."
    ],
    modelAnswer: "'systemctl restart' completely terminates the running daemon process (sending SIGTERM, then SIGKILL if needed) and launches a brand new process with a new PID. Any active TCP connections, cached in-memory states, or in-flight user sessions are abruptly severed.\n\n'systemctl reload' keeps the existing process PID alive and sends a SIGHUP (Signal 1) to the daemon. The daemon rereads its configuration files (e.g. named.conf, nginx.conf), parses new rules, and applies updates without terminating running worker threads or dropping client connections.\n\nIn production, 'reload' is always preferred when applying configuration changes (adding DNS zones, virtual hosts, SSL certificates) to achieve zero-downtime operations. 'restart' is only required when upgrading binaries, modifying core listening sockets, or recovering from hung states.",
    pitfalls: "Assuming all services support reload. If a unit file lacks ExecReload=, systemctl reload fails.",
    keyTerms: ["SIGHUP", "PID preservation", "Zero-Downtime", "ExecReload", "Active TCP socket severance"]
  },

  // --- DAT330: Introduction to Databases ---
  {
    id: "dat330-viva-1",
    courseId: "dat330",
    courseCode: "DAT330",
    courseName: "Introduction to Databases",
    category: "Performance Tuning & Indexes",
    difficulty: "Distinction 4.0",
    question: "In Microsoft SQL Server / Azure SQL, what is the architectural difference between an Index Seek and an Index Scan? Why does an Index Scan consume exponentially more I/O on large tables?",
    whyProfessorsAsk: "Parul Kantaria emphasizes execution plan analysis throughout DAT330 Labs 4–6 and Assignments.",
    hints: [
      "Hint 1: Think about the B-Tree structure (Root page -> Intermediate pages -> Leaf pages).",
      "Hint 2: An Index Seek uses search predicates to traverse directly down the tree branches.",
      "Hint 3: An Index Scan reads leaf pages sequentially from beginning to end.",
      "Hint 4: Consider the number of 8 KB physical data page reads required."
    ],
    modelAnswer: "In SQL Server, indexes are structured as balanced B-Trees (8 KB pages):\n\n1. Index Seek: The query engine uses an exact search predicate (e.g. WHERE CustomerID = 502) to traverse the B-Tree directly from the root node, through intermediate index levels, to the precise leaf page containing the target row. It performs O(log N) page reads, typically fetching results in 3-4 physical I/O operations regardless of table size.\n\n2. Index Scan: The query engine traverses all leaf-level pages in the index sequentially from the first page to the last, evaluating every row against the filter. It performs O(N) operations.\n\nOn a table with 10 million rows, an Index Seek reads ~4 pages (32 KB of I/O), whereas an Index Scan reads hundreds of thousands of 8 KB pages (gigabytes of I/O), flooding the buffer cache, causing high disk read queue lengths, and spiking CPU usage.",
    pitfalls: "Calling an Index Scan a 'Table Scan'. An Index Scan reads an index B-tree; a Table Scan reads an unindexed heap. However, both read every page sequentially.",
    keyTerms: ["B-Tree Traversal", "Root to Leaf Node", "O(log N) vs O(N)", "Buffer Pool Cache", "8 KB Page Reads"]
  },
  {
    id: "dat330-viva-2",
    courseId: "dat330",
    courseCode: "DAT330",
    courseName: "Introduction to Databases",
    category: "Relational Schema Normalization",
    difficulty: "Advanced",
    question: "Explain the difference between Second Normal Form (2NF) and Third Normal Form (3NF). Give a concrete example of a Transitive Dependency and how to resolve it.",
    whyProfessorsAsk: "Normalization is 20%+ of DAT330 exam questions and directly impacts database consistency.",
    hints: [
      "Hint 1: 2NF eliminates Partial Key Dependencies (where a column depends on only part of a composite primary key).",
      "Hint 2: 3NF eliminates Transitive Dependencies (where a non-key column depends on another non-key column).",
      "Hint 3: Example: Table OrderItem (OrderID, ProductID, Quantity, UnitPrice, SupplierName, SupplierPhone). SupplierPhone depends on SupplierName, not the primary key!"
    ],
    modelAnswer: "1. Second Normal Form (2NF): Requires the table to be in 1NF (atomic values, primary key defined) AND have NO partial key dependencies. Every non-key attribute must depend on the whole primary key, not just a subset of a composite key.\n\n2. Third Normal Form (3NF): Requires 2NF AND the elimination of all TRANSITIVE DEPENDENCIES. A transitive dependency occurs when non-key attribute A determines non-key attribute B (X -> Y -> Z, where X is PK, but Y -> Z exists).\n\nConcrete Example:\nConsider Orders(OrderID [PK], CustomerID, CustomerName, CustomerEmail, OrderDate).\n- OrderID determines CustomerID (PK -> Non-key).\n- But CustomerID determines CustomerName and CustomerEmail (Non-key -> Non-key).\n- This transitive dependency causes update anomalies (updating a customer's email in 50 order rows) and deletion anomalies (deleting a customer's only order deletes their contact info).\n- Resolution: Decompose into two tables: Orders(OrderID [PK], CustomerID [FK], OrderDate) and Customers(CustomerID [PK], CustomerName, CustomerEmail).",
    pitfalls: "Confusing partial key dependencies with transitive dependencies. 2NF only applies when the primary key is composite!",
    keyTerms: ["Partial Dependency", "Transitive Dependency", "Composite Key", "Update/Deletion Anomaly", "Table Decomposition"]
  },

  // --- MST300: Introduction to Microsoft Cloud Technologies ---
  {
    id: "mst300-viva-1",
    courseId: "mst300",
    courseCode: "MST300",
    courseName: "Microsoft Cloud Technologies",
    category: "Cloud Economics & Architecture",
    difficulty: "Distinction 4.0",
    question: "Why does running 'sudo poweroff' or 'sudo shutdown now' inside an Azure VM continue to drain your $100 student credit, whereas 'az vm deallocate' reduces compute billing to $0?",
    whyProfessorsAsk: "Nooshin Beheshti tests this because students consistently fail the 10% budget allocation grade requirement by leaving stopped VMs allocated.",
    hints: [
      "Hint 1: Look at the Azure VM lifecycle states: Running vs Stopped vs Stopped (Deallocated).",
      "Hint 2: When an OS shuts down from the inside, does Microsoft Azure release the physical CPU cores, RAM, and PCIe hardware reserved on the host server?",
      "Hint 3: Deallocation releases hardware tenancy back to the Azure fabric controller pool."
    ],
    modelAnswer: "Azure virtual machines have distinct lifecycle states:\n\n1. 'Stopped' State (OS-Level Shutdown): When you run `sudo shutdown now` from inside Ubuntu, the guest OS powers off, but the Azure Fabric Controller maintains the VM's hardware reservation on the physical host hypervisor. The physical CPU cores, dedicated RAM, and dynamic IP reservations remain reserved exclusively for you so that restarting is instant. Because Microsoft cannot lease those compute resources to another customer, compute billing continues at 100% of the hourly rate!\n\n2. 'Stopped (Deallocated)' State: When you execute `az vm deallocate` or click 'Stop' in the Azure Portal, Azure tears down the hypervisor tenant, releases the physical CPU and RAM back into the datacenter capacity pool, and releases the dynamic VIP. In this state, compute billing drops to EXACTLY $0.00/hour.\n\nOnly the underlying OS managed disk (e.g. Standard SSD 30 GB storage at ~$1.50/month) incurs charges while deallocated.",
    pitfalls: "Saying 'deallocated deletes your files'. Deallocation preserves your disk, configurations, and data; it only releases the hypervisor CPU/RAM hardware.",
    keyTerms: ["Stopped vs Deallocated", "Fabric Controller", "Hypervisor Hardware Reservation", "Compute Billing vs Storage Billing", "az vm deallocate"]
  },
  {
    id: "mst300-viva-2",
    courseId: "mst300",
    courseCode: "MST300",
    courseName: "Microsoft Cloud Technologies",
    category: "Cloud Security & Governance",
    difficulty: "Advanced",
    question: "How does Azure Role-Based Access Control (RBAC) inheritance work across the management hierarchy? Explain why assigning 'Owner' at the Resource Group level does not grant access to sibling Resource Groups.",
    whyProfessorsAsk: "RBAC and governance constitute a core pillar of MST300 Project 2 and AZ-104 certification.",
    hints: [
      "Hint 1: Recall the Azure hierarchy: Management Group -> Subscription -> Resource Group -> Resource.",
      "Hint 2: Permissions inherit downward from parent to children, never horizontally or upward.",
      "Hint 3: An explicit Deny Assignment overrides any inherited Allow."
    ],
    modelAnswer: "Azure RBAC enforces a strict top-down hierarchical inheritance model across four operational scopes:\n1. Root / Management Groups\n2. Subscriptions\n3. Resource Groups\n4. Individual Resources\n\nWhen a Role Assignment (Security Principal + Role Definition + Scope) is made, the permissions automatically propagate downwards to all child containers. For example, a role assigned at the Subscription level inherits into all Resource Groups and individual VMs within that subscription.\n\nHowever, permissions NEVER propagate horizontally or upward. A Resource Group is a sibling container alongside other Resource Groups under a parent Subscription. Granting 'Owner' at 'RG-Development' provides full control over resources inside RG-Development, but zero visibility or permissions in 'RG-Production'.\n\nFurthermore, if a Deny Assignment is placed at a parent scope, it takes absolute precedence over any child Allow assignment.",
    pitfalls: "Confusing Azure Entra ID (Azure AD) Directory Roles (like Global Administrator) with Azure RBAC Roles (like Owner, Contributor, Reader).",
    keyTerms: ["Scope Hierarchy", "Top-Down Inheritance", "No Horizontal Leakage", "Deny Assignment Precedence", "Least Privilege"]
  },

  // --- SEC320: Computer Forensics & Incident Response ---
  {
    id: "sec320-viva-1",
    courseId: "sec320",
    courseCode: "SEC320",
    courseName: "Computer Forensics & Incident Response",
    category: "Memory Forensics & Rootkits",
    difficulty: "Distinction 4.0",
    question: "In Volatility memory analysis, why can an advanced rootkit or injected malware hide from 'pslist' but be uncovered by 'psscan'? Explain the difference between ActiveProcessLinks traversal and pool tag scanning.",
    whyProfessorsAsk: "This is the signature question on SEC320 Test 1 to separate students who understand operating system internals from script-kiddies.",
    hints: [
      "Hint 1: Windows kernel maintains an EPROCESS executive block for every running process.",
      "Hint 2: How does the Windows scheduler find processes? It follows a doubly-linked circular list called ActiveProcessLinks.",
      "Hint 3: What technique does Direct Kernel Object Manipulation (DKOM) use to hide a process?",
      "Hint 4: How does psscan find EPROCESS blocks without relying on the linked list?"
    ],
    modelAnswer: "1. How `pslist` works: `volatility pslist` traverses the Windows executive process structure by walking the `ActiveProcessLinks` doubly-linked circular list rooted in the kernel's `PsActiveProcessHead`. Standard Windows APIs (like tasklist or Process Explorer) also use this list.\n\n2. How rootkits hide: Sophisticated malware uses Direct Kernel Object Manipulation (DKOM). The rootkit modifies kernel memory to unlink its own `EPROCESS` block from the `ActiveProcessLinks` list (pointing the previous node directly to the next node). The process remains running because the Windows thread dispatcher schedules individual ETHREAD structures, not the process list! Thus, `pslist` completely misses the hidden process.\n\n3. How `psscan` exposes it: `volatility psscan` completely ignores the linked list. Instead, it performs a raw linear scan across physical memory looking for the 4-byte pool tag signature associated with process memory allocations (historically 'Proc' on older Windows, or executive pool headers). Even if an `EPROCESS` block has been unlinked from the chain, its memory pool allocation remains in RAM, allowing `psscan` to locate and extract the hidden PID and malicious binary name.",
    pitfalls: "Failing to mention Direct Kernel Object Manipulation (DKOM) or claiming psscan reads from the hard disk.",
    keyTerms: ["ActiveProcessLinks", "EPROCESS block", "DKOM (Direct Kernel Object Manipulation)", "Pool Tag Scanning", "ETHREAD Dispatcher"]
  },
  {
    id: "sec320-viva-2",
    courseId: "sec320",
    courseCode: "SEC320",
    courseName: "Computer Forensics & Incident Response",
    category: "Digital Chain of Custody & Evidence",
    difficulty: "Core",
    question: "Why must a forensic analyst calculate cryptographic hashes (MD5 / SHA-256) of physical drive evidence BEFORE and AFTER imaging? What is the legal implication in court if hashes do not match?",
    whyProfessorsAsk: "Every digital evidence report in SEC320 must maintain strict chain of custody, which is worth 15% of the project grade.",
    hints: [
      "Hint 1: Digital evidence is fragile and easily altered by the operating system mounting a drive.",
      "Hint 2: What is a hardware write-blocker used for?",
      "Hint 3: In legal proceedings, how do you prove the bit-for-bit duplicate matches the seized physical device?"
    ],
    modelAnswer: "In digital forensics, evidence integrity must be mathematically verifiable under the Daubert standard of legal admissibility.\n\n1. Before Imaging: The analyst connects the evidence media through a certified hardware write-blocker and computes a cryptographic hash (SHA-256 or MD5) of the raw source drive. This establishes the baseline digital fingerprint of the seized device.\n\n2. After Imaging: The forensic imaging software (such as FTK Imager or dd) writes a bit-stream duplicate (e.g. raw .dd or .E01) and computes a verification hash of the output image.\n\n3. Comparison: If the source hash and image hash match identically, it proves beyond doubt that the image is an authentic, bit-for-bit, unaltered replica of the evidence.\n\nLegal Implication:\nIf the verification hashes differ by even a single bit, the integrity of the evidence is considered compromised (spoliation of evidence). The defense can argue that data was planted, modified, or corrupted during handling, leading to the judge ruling the entire forensic report inadmissible in court.",
    pitfalls: "Confusing a logical file copy with a physical bit-stream image. A logical copy does not capture unallocated space or slack space, and will not have matching drive hashes.",
    keyTerms: ["Bit-stream Image", "Hardware Write-Blocker", "SHA-256 Integrity", "Spoliation of Evidence", "Daubert Admissibility"]
  },

  // --- CSN305: Software Defined Networks ---
  {
    id: "csn305-viva-1",
    courseId: "csn305",
    courseCode: "CSN305",
    courseName: "Software Defined Networks",
    category: "SDN Architecture & OpenFlow",
    difficulty: "Advanced",
    question: "In Software Defined Networking, explain what happens when a switch receives a packet whose headers do not match any entry in its OpenFlow flow table. Detail the OFPT_PACKET_IN exchange with the SDN controller.",
    whyProfessorsAsk: "The separation of control plane and data plane is the foundational thesis of CSN305.",
    hints: [
      "Hint 1: Traditional switches make autonomous forwarding decisions via MAC learning. SDN switches rely on the central controller.",
      "Hint 2: What is a Table-Miss Flow Entry?",
      "Hint 3: What protocol message does Open vSwitch generate when a table miss occurs?",
      "Hint 4: How does the controller respond (OFPT_PACKET_OUT vs OFPT_FLOW_MOD)?"
    ],
    modelAnswer: "In an OpenFlow-enabled switch (e.g. Open vSwitch in Mininet), the forwarding plane (data plane) is separated from the decision-making logic (control plane).\n\n1. Table Miss Detection: When a packet arrives on an ingress port, the switch checks its pipeline flow tables. If no flow entries match the packet headers and a default 'table-miss' entry is configured, the switch invokes the table-miss action.\n\n2. OFPT_PACKET_IN Message: The switch buffers the packet (or encapsulates the full payload) and sends an asynchronous `OFPT_PACKET_IN` message over the secure TLS/TCP OpenFlow channel to the centralized SDN controller (e.g. Ryu, POX, or OpenDaylight).\n\n3. Controller Computation: The controller inspects the packet headers, computes the optimal path according to its network application logic (shortest path, firewall policy, or load balancing), and sends two response messages:\n   - `OFPT_FLOW_MOD`: Instructs the switch to install a new flow rule into its flow table with a match condition, priority, timeout, and action set (e.g. output: port 2). Future matching packets will now be forwarded directly in hardware without bothering the controller!\n   - `OFPT_PACKET_OUT`: Forwards the original buffered packet out the designated destination port.",
    pitfalls: "Assuming the controller inspects every single packet in the network forever. The controller only inspects the first packet of a flow; subsequent packets match the installed FLOW_MOD in the switch data plane.",
    keyTerms: ["Table-Miss Entry", "OFPT_PACKET_IN", "OFPT_FLOW_MOD", "OFPT_PACKET_OUT", "Control Plane vs Data Plane"]
  },

  // --- PSY262: Mindfulness for Students ---
  {
    id: "psy262-viva-1",
    courseId: "psy262",
    courseCode: "PSY262",
    courseName: "Mindfulness for Students",
    category: "Neurobiology & Stress Physiology",
    difficulty: "Core",
    question: "Explain the physiological mechanism of the 'Amygdala Hijack' during acute exam stress. How does mindful slow-paced diaphragmatic breathing activate the Parasympathetic Nervous System to restore prefrontal cortex executive control?",
    whyProfessorsAsk: "Glen Choi tests whether you understand mindfulness as evidence-based neurobiology rather than just passive meditation.",
    hints: [
      "Hint 1: Think about the Sympathetic Nervous System (fight-or-flight) releasing adrenaline and cortisol.",
      "Hint 2: The amygdala bypasses the slower prefrontal cortex when threat is perceived.",
      "Hint 3: Which cranial nerve is stimulated by prolonged exhalation to trigger the 'rest-and-digest' brake?"
    ],
    modelAnswer: "1. Amygdala Hijack: Under perceived acute stress (e.g. facing a difficult exam question or imminent deadline), the amygdala triggers the hypothalamic-pituitary-adrenal (HPA) axis, initiating a sympathetic nervous system fight-or-flight surge. Adrenaline and cortisol flood the bloodstream, elevating heart rate and diverting glucose away from the prefrontal cortex—the brain center responsible for executive function, working memory, and logical reasoning. This results in the classic 'mind going blank' sensation.\n\n2. Mindful Physiological Downregulation: Mindful diaphragmatic breathing with an extended exhalation stimulates the VAGUS NERVE (Cranial Nerve X). Vagal stimulation releases acetylcholine, which acts as a physiological brake on the sinoatrial node, slowing heart rate and downregulating sympathetic tone.\n\n3. Prefrontal Cortex Restoration: As the parasympathetic nervous system ('rest-and-digest') reasserts homeostasis, cortisol levels drop, allowing blood flow and neural glucose uptake to return to the prefrontal cortex, immediately restoring focus, working memory retrieval, and cognitive flexibility.",
    pitfalls: "Using vague spiritual terms instead of physiological mechanisms (Vagus nerve, sympathetic vs parasympathetic, prefrontal cortex, cortisol).",
    keyTerms: ["Amygdala Hijack", "HPA Axis", "Vagus Nerve (Cranial Nerve X)", "Parasympathetic Rest-and-Digest", "Prefrontal Cortex"]
  },

  // --- WTP100: Work Term Preparation ---
  {
    id: "wtp100-viva-1",
    courseId: "wtp100",
    courseCode: "WTP100",
    courseName: "Work Term Preparation",
    category: "Co-op Technical Interviewing",
    difficulty: "Core",
    question: "In technical co-op interviews for junior sysadmin or cloud support roles, how do you execute the STAR method when asked: 'Tell me about a time you encountered a catastrophic system outage or failed lab configuration and resolved it'?",
    whyProfessorsAsk: "SenecaWorks co-op coordinators evaluate if you can translate complex technical lab struggles into structured business communication.",
    hints: [
      "Hint 1: STAR stands for Situation, Task, Action, Result.",
      "Hint 2: Spend 70% of your response time on ACTION and RESULT, not rambling about the background situation.",
      "Hint 3: Highlight technical debugging methodology (system logs, packet captures, systematic isolation) rather than guessing."
    ],
    modelAnswer: "The STAR technique structures behavioral and technical interview responses into a compelling narrative:\n\n1. Situation (15% of time): Set the technical context concisely. Example: 'During our OPS345 Linux infrastructure project, our primary BIND9 DNS server failed to start 2 hours before the staging deadline, preventing client VMs from resolving internal domain services.'\n\n2. Task (15% of time): Define your specific objective and accountability. Example: 'As the systems engineer on duty, my responsibility was to isolate the root cause, restore service availability with zero data loss, and verify network connectivity.'\n\n3. Action (50% of time - Key Technical Focus): Detail your systematic troubleshooting methodology. Example: 'Instead of guessing, I inspected `systemctl status named` and queried systemd journal logs via `journalctl -u named -e`. I discovered a syntax error on line 42 of `/etc/bind/named.conf.local` where a missing semicolon invalidating the zone statement prevented daemon parsing. I validated the configuration using `named-checkconf -z`, corrected the delimiter syntax, reloaded the service via `systemctl reload named`, and verified forward and reverse resolution using `dig @localhost`.'\n\n4. Result (20% of time - Quantifiable Impact): State the outcome and lessons learned. Example: 'DNS resolution was fully restored within 15 minutes with zero dropped connections. To prevent recurrence, I created a git pre-commit hook that automatically executes named-checkconf before any zone file change can be pushed to production.'",
    pitfalls: "Spending 80% of your time explaining the problem and only 20% on the action, or saying 'we fixed it' instead of taking personal ownership of your specific technical actions.",
    keyTerms: ["Situation, Task, Action, Result", "Root Cause Analysis", "journalctl / log isolation", "named-checkconf", "Preventative Process Engineering"]
  }
];

export const VIVA_MASTERY_LEVELS = [
  { id: "unattempted", label: "Unattempted", color: "slate" },
  { id: "needs-practice", label: "Needs Practice", color: "rose", points: 1 },
  { id: "good", label: "Good Explanation", color: "amber", points: 2 },
  { id: "mastered", label: "4.0 Flawless Defense", color: "emerald", points: 3 }
];
