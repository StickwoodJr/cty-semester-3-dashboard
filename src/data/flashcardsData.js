/**
 * Curated Active Recall Flashcards for Seneca CTY Semester 3 (Fall 2026)
 * Targeted at securing 4.0 GPA (A / A+ grade threshold >= 80%) across all technical courses.
 */

export const INITIAL_FLASHCARDS = [
  // OPS345 — Open System Application Server
  {
    id: 'ops-1',
    courseId: 'ops345',
    courseCode: 'OPS345',
    category: 'DNS / BIND',
    question: 'What is the purpose of `named-checkconf` and `named-checkzone` in BIND DNS?',
    answer: '`named-checkconf` checks the syntax of the main BIND config file (/etc/named.conf).\n`named-checkzone <zone-name> <zone-file-path>` verifies the validity, serial number, and resource records of a specific forward or reverse zone file before restarting named.',
    codeSnippet: 'named-checkconf /etc/named.conf\nnamed-checkzone example.com /var/named/example.com.zone',
    mastery: 'unrated'
  },
  {
    id: 'ops-2',
    courseId: 'ops345',
    courseCode: 'OPS345',
    category: 'DNS / BIND',
    question: 'Explain the difference between forward DNS zones and reverse DNS zones.',
    answer: 'Forward zones translate domain names (FQDNs) into IP addresses using A (IPv4) or AAAA (IPv6) records.\nReverse zones translate IP addresses back to domain names using PTR records under the special in-addr.arpa (IPv4) domain.',
    mastery: 'unrated'
  },
  {
    id: 'ops-3',
    courseId: 'ops345',
    courseCode: 'OPS345',
    category: 'systemd',
    question: 'In a systemd unit file, what is the role of `WantedBy=multi-user.target`?',
    answer: 'It defines a dependency relationship in the [Install] section. When the service is enabled (via `systemctl enable`), systemd creates a symbolic link in `/etc/systemd/system/multi-user.target.wants/` so the service auto-starts when multi-user.target (runlevel 3) is reached.',
    codeSnippet: '[Install]\nWantedBy=multi-user.target',
    mastery: 'unrated'
  },
  {
    id: 'ops-4',
    courseId: 'ops345',
    courseCode: 'OPS345',
    category: 'Firewalld',
    question: 'How do you permanently allow HTTP service in firewalld and reload it without dropping active connections?',
    answer: 'Use `--permanent` to update the persistent XML configuration in `/etc/firewalld/zones/`, followed by `firewall-cmd --reload` to apply changes immediately to the runtime environment without terminating established stateful sessions.',
    codeSnippet: 'sudo firewall-cmd --permanent --add-service=http\nsudo firewall-cmd --reload',
    mastery: 'unrated'
  },
  {
    id: 'ops-5',
    courseId: 'ops345',
    courseCode: 'OPS345',
    category: 'Syllabus Aid',
    question: 'What is the exact exam aid allowance for the OPS345 Midterm vs Final Exam?',
    answer: 'OPS345 Midterm: Exactly ONE 1-sided 8.5"x11" handwritten aid sheet.\nOPS345 Final Exam: Exactly ONE 2-sided 8.5"x11" handwritten aid sheet.\n(No typed or printed sheets permitted; must be handwritten).',
    mastery: 'unrated'
  },

  // MST300 — Intro to Microsoft Cloud Technologies (Azure)
  {
    id: 'mst-1',
    courseId: 'mst300',
    courseCode: 'MST300',
    category: 'Azure Storage',
    question: 'What are the four Azure Blob Storage access tiers and their minimum retention periods?',
    answer: '1. Hot: Frequently accessed data, highest storage price, lowest transaction price (no min retention).\n2. Cool: Infrequently accessed (min 30 days retention).\n3. Cold: Rarely accessed (min 90 days retention).\n4. Archive: Offline data, lowest storage cost, high data retrieval costs & latency (min 180 days retention).',
    mastery: 'unrated'
  },
  {
    id: 'mst-2',
    courseId: 'mst300',
    courseCode: 'MST300',
    category: 'Azure Cost Management',
    question: 'What is the critical difference between `az vm stop` and `az vm deallocate`?',
    answer: '`az vm stop` only shuts down the guest operating system, leaving compute resources and dynamic IPs provisioned, so CPU/RAM compute charges CONTINUE.\n`az vm deallocate` releases the hardware resources back to Microsoft data centers, ensuring ZERO compute charges accrue while preserved on disk.',
    codeSnippet: 'az vm deallocate --resource-group CTY300-RG --name LabVM',
    mastery: 'unrated'
  },
  {
    id: 'mst-3',
    courseId: 'mst300',
    courseCode: 'MST300',
    category: 'Azure Networking',
    question: 'What is Azure Virtual Network (VNet) Peering and does traffic leave the Microsoft network?',
    answer: 'VNet Peering seamlessly connects two or more Virtual Networks in Azure. Traffic between VMs in peered VNets flows entirely across the private Microsoft global backbone infrastructure with low latency and high bandwidth; it NEVER traverses the public Internet.',
    mastery: 'unrated'
  },
  {
    id: 'mst-4',
    courseId: 'mst300',
    courseCode: 'MST300',
    category: 'Azure Security',
    question: 'How do Network Security Groups (NSGs) evaluate inbound and outbound security rules?',
    answer: 'NSG rules are processed in priority order from lowest number (highest priority, e.g. 100) to highest number (e.g. 4096). The moment a packet matches rule criteria (5-tuple: source, source port, destination, dest port, protocol), processing stops and the Allow or Deny action is executed.',
    mastery: 'unrated'
  },

  // DAT330 — Introduction to Databases (Azure SQL & SQL Server)
  {
    id: 'dat-1',
    courseId: 'dat330',
    courseCode: 'DAT330',
    category: 'Normalization',
    question: 'Define 1NF, 2NF, and 3NF database normalization rules.',
    answer: '1NF (First Normal Form): All column values are atomic (indivisible) and no repeating groups exist.\n2NF (Second Normal Form): In 1NF + all non-key attributes are fully functionally dependent on the entire primary key (no partial dependencies on composite keys).\n3NF (Third Normal Form): In 2NF + no transitive dependencies exist (non-key attributes depend only on the primary key, never on other non-key attributes).',
    mastery: 'unrated'
  },
  {
    id: 'dat-2',
    courseId: 'dat330',
    courseCode: 'DAT330',
    category: 'Indexing',
    question: 'What is the structural difference between a Clustered and Non-Clustered Index?',
    answer: 'Clustered Index: Physically sorts and stores the actual data rows of the table at the leaf level based on the index key. A table can have only ONE clustered index (like a telephone directory sorted alphabetically).\nNon-Clustered Index: Has a separate B-tree structure where leaf pages contain row locators (pointers or clustered index keys) to the actual data rows (multiple permitted per table).',
    mastery: 'unrated'
  },
  {
    id: 'dat-3',
    courseId: 'dat330',
    courseCode: 'DAT330',
    category: 'Transactions',
    question: 'What are the ACID properties in database management systems?',
    answer: 'Atomicity: All operations in a transaction succeed completely or none do (rollback).\nConsistency: A transaction takes the database from one valid state to another, enforcing all schema constraints.\nIsolation: Concurrent transactions execute without cross-interference.\nDurability: Once committed, transaction results survive system crashes or power loss.',
    mastery: 'unrated'
  },
  {
    id: 'dat-4',
    courseId: 'dat330',
    courseCode: 'DAT330',
    category: 'SQL Commands',
    question: 'Contrast `DELETE`, `TRUNCATE`, and `DROP` statements.',
    answer: '`DELETE` (DML): Removes specified rows using `WHERE`. Logs each deleted row in transaction log. Triggers fire. Slower.\n`TRUNCATE` (DDL): Empties entire table by deallocating data pages. Minimally logged. Resets identity counter. Triggers do NOT fire. Faster.\n`DROP` (DDL): Completely destroys table schema, indexes, constraints, and data from database.',
    codeSnippet: 'DELETE FROM Orders WHERE OrderDate < \'2025-01-01\';\nTRUNCATE TABLE TempStaging;\nDROP TABLE OldArchive;',
    mastery: 'unrated'
  },

  // SEC320 — Security Incident Response & Forensics
  {
    id: 'sec-1',
    courseId: 'sec320',
    courseCode: 'SEC320',
    category: 'Incident Response',
    question: 'List the 6 sequential phases of the NIST SP 800-61 Incident Handling Lifecycle.',
    answer: '1. Preparation (tools, policies, training)\n2. Detection & Analysis (alerts, triage, scoping)\n3. Containment (short-term & long-term isolation)\n4. Eradication (malware removal, patching vulnerabilities)\n5. Recovery (restoring clean systems to production)\n6. Post-Incident Activity (lessons learned, evidence retention)',
    mastery: 'unrated'
  },
  {
    id: 'sec-2',
    courseId: 'sec320',
    courseCode: 'SEC320',
    category: 'Packet Analysis',
    question: 'In Wireshark, what display filter isolates initial TCP SYN packets without ACK?',
    answer: '`tcp.flags.syn == 1 && tcp.flags.ack == 0`\nThis filter captures initial connection handshakes, revealing port scanning activities (SYN stealth scans) or SYN flood denial-of-service attacks.',
    codeSnippet: 'tcp.flags.syn == 1 && tcp.flags.ack == 0',
    mastery: 'unrated'
  },
  {
    id: 'sec-3',
    courseId: 'sec320',
    courseCode: 'SEC320',
    category: 'Forensics',
    question: 'What is the RFC 3227 Order of Volatility for digital forensic evidence acquisition?',
    answer: 'From most volatile to least volatile:\n1. CPU Registers and CPU Cache\n2. Routing tables, ARP cache, process table, kernel stats, and RAM\n3. Temporary file systems (/tmp, swap)\n4. Disk storage (hard drives, SSDs)\n5. Remote logs and monitoring data\n6. Physical network topology and archival media (backup tapes)',
    mastery: 'unrated'
  },

  // CSN305 — Software Defined Networks
  {
    id: 'csn-1',
    courseId: 'csn305',
    courseCode: 'CSN305',
    category: 'SDN Architecture',
    question: 'Describe the three planes of Software Defined Networking (SDN).',
    answer: '1. Data (Forwarding) Plane: Network hardware/software switches that examine headers and forward packets according to flow table rules.\n2. Control Plane: Centralized software controller (e.g. Ryu, POX, ONOS) that computes routing algorithms, network topology, and generates flow rules.\n3. Application Plane: High-level business apps (load balancing, firewalling, telemetry) communicating with controller via Northbound APIs (REST).',
    mastery: 'unrated'
  },
  {
    id: 'csn-2',
    courseId: 'csn305',
    courseCode: 'CSN305',
    category: 'OpenFlow',
    question: 'What is an OpenFlow `OFPT_PACKET_IN` message and when is it triggered?',
    answer: 'Sent by an OpenFlow switch to the SDN controller over the Southbound interface when a received packet matches no entry in the flow tables (table-miss rule) or matches a flow rule explicitly specifying `OUTPUT:CONTROLLER`.',
    mastery: 'unrated'
  },
  {
    id: 'csn-3',
    courseId: 'csn305',
    courseCode: 'CSN305',
    category: 'Mininet',
    question: 'How does Mininet simulate virtual hosts and switches on a single Linux machine?',
    answer: 'Mininet uses lightweight Linux network namespaces (`ip netns`) to isolate host network stacks, virtual ethernet pairs (`veth`) to act as virtual patch cables, and Open vSwitch (OVS) kernels to simulate software SDN switches.',
    codeSnippet: 'sudo mn --topo single,3 --mac --switch ovsk --controller remote',
    mastery: 'unrated'
  },

  // PSY262 — Mindfulness for Students
  {
    id: 'psy-1',
    courseId: 'psy262',
    courseCode: 'PSY262',
    category: 'Neuroscience',
    question: 'How does mindfulness practice neurologically impact the amygdala and prefrontal cortex?',
    answer: 'Mindfulness meditation down-regulates the hyperactivity of the amygdala (the brain\'s fear and stress response hub) and thickens prefrontal cortex cortical layers, strengthening top-down emotional regulation, working memory, and sustained attention during exam conditions.',
    mastery: 'unrated'
  },
  {
    id: 'psy-2',
    courseId: 'psy262',
    courseCode: 'PSY262',
    category: 'Cognitive Science',
    question: 'What is the Default Mode Network (DMN) and what happens to it during mindful focus?',
    answer: 'The Default Mode Network (DMN) is a network of interacting brain regions active during mind-wandering, past rumination, and anxious future projection. Mindfulness quiets DMN firing, reducing intrusive thoughts and anchoring cognitive resources to current study tasks.',
    mastery: 'unrated'
  },

  // WTP100 — Work Term Preparation
  {
    id: 'wtp-1',
    courseId: 'wtp100',
    courseCode: 'WTP100',
    category: 'Co-op Eligibility',
    question: 'What are the key requirements for Seneca CTY Co-op work term eligibility?',
    answer: '1. Pass WTP100 with a Satisfactory (SAT) grade.\n2. Maintain minimum required GPA (>= 2.5, though 3.5–4.0 unlocks top enterprise networking/cloud roles).\n3. Complete all Semester 1, 2, and 3 academic prerequisite courses.\n4. Submit approved resume and cover letter on SenecaWorks before the deadline.',
    mastery: 'unrated'
  }
];
