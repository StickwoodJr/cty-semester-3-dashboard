/**
 * Seneca CTY Semester 3 Lab Pre-Flight & Submission Protocol Data
 * Contains exact terminal verification commands, rubric rules,
 * and evidence requirements for all major technical labs.
 */

export const LAB_PREFLIGHT_PRESETS = [
  // --- OPS345: Linux System Administration ---
  {
    id: "ops345-lab1",
    courseId: "ops345",
    courseCode: "OPS345",
    labName: "Lab 1: Environment & Physical Network",
    category: "Virtualization & Networking",
    terminalType: "bash",
    verificationCmd: 'echo "=== OPS345 LAB 1 AUDIT ===" && whoami && hostname && ip -brief addr show && lsb_release -d && date',
    keyEvidence: "Terminal screenshot showing clean dual-NIC configuration (NAT + Host-only) with IP addresses and host status.",
    requiredItems: [
      { id: "id-check", label: "Student identity (whoami) visible in terminal prompt", penalty: "-10% deduction" },
      { id: "time-check", label: "System timestamp (date) matches EDT submission time", penalty: "-10% deduction" },
      { id: "host-check", label: "Hostname configured as assigned (e.g. matrix / ubuntu-vm)", penalty: "Required by syllabus" },
      { id: "nic-check", label: "Dual network interfaces configured with valid subnets", penalty: "Fails rubric test" },
      { id: "pdf-check", label: "Submission compiled as clean PDF with syntax highlighting", penalty: "No Word docs" }
    ],
    proTip: "Make sure terminal window is sufficiently wide (>80 columns) so line wraps don't obscure IP routing tables."
  },
  {
    id: "ops345-lab2",
    courseId: "ops345",
    courseCode: "OPS345",
    labName: "Lab 2: Addressing, NAT & FRR",
    category: "Routing & Packet Forwarding",
    terminalType: "bash",
    verificationCmd: 'echo "=== OPS345 LAB 2 FRR AUDIT ===" && whoami && hostname && ip route show && vtysh -c "show ip route" && date',
    keyEvidence: "Routing table showing default gateway, internal subnets, and FRRouting daemon route exchange.",
    requiredItems: [
      { id: "frr-check", label: "FRRouting daemon active and routing daemon zebra running", penalty: "0 mark if inactive" },
      { id: "ip-forward", label: "sysctl net.ipv4.ip_forward set to 1 permanently in sysctl.conf", penalty: "Reboot test failure" },
      { id: "nat-iptables", label: "iptables / nftables MASQUERADE rule confirmed active", penalty: "NAT routing failure" },
      { id: "whoami-host", label: "whoami, hostname, and date executed together in final screenshot", penalty: "-15% rubric deduction" }
    ],
    proTip: "Test ping from client VM to external 8.8.8.8 to verify masquerading before capturing your submission screenshot."
  },
  {
    id: "ops345-lab3",
    courseId: "ops345",
    courseCode: "OPS345",
    labName: "Lab 3: BIND9 DNS & Samba Server",
    category: "Network Services",
    terminalType: "bash",
    verificationCmd: 'echo "=== OPS345 LAB 3 DNS AUDIT ===" && whoami && hostname && named-checkconf -z /etc/bind/named.conf && dig @localhost mydomain.ops +short && testparm -s && date',
    keyEvidence: "named-checkconf returning OK status, dig response returning local forward/reverse records, and Samba testparm output.",
    requiredItems: [
      { id: "dns-zones", label: "Forward and reverse master zones loaded with 0 syntax errors", penalty: "DNS service fail" },
      { id: "samba-share", label: "Samba network share permissions verified with valid user authentication", penalty: "Access denied fail" },
      { id: "firewall-ports", label: "UFW / firewalld open on UDP 53, TCP 53, and TCP 445/139", penalty: "Timeout on test" },
      { id: "timestamp", label: "Timestamp and hostname visible in dig and testparm output", penalty: "-10% deduction" }
    ],
    proTip: "Always increment the serial number in your zone file (YYYYMMDDNN format) before testing with named-checkconf!"
  },
  {
    id: "ops345-lab4",
    courseId: "ops345",
    courseCode: "OPS345",
    labName: "Lab 4: Containers (LXD & Docker)",
    category: "Containerization",
    terminalType: "bash",
    verificationCmd: 'echo "=== OPS345 LAB 4 CONTAINER AUDIT ===" && whoami && hostname && docker ps --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}" && lxc list && date',
    keyEvidence: "Docker ps table showing container port mapping and LXC container running status with bridged IP.",
    requiredItems: [
      { id: "docker-status", label: "Docker container running and ports mapped correctly to host", penalty: "0 on web demo" },
      { id: "lxc-status", label: "LXC container initialized and responsive on internal bridge", penalty: "Rubric deduction" },
      { id: "persist-check", label: "Container volume mount verified so data survives restart", penalty: "Data loss fail" },
      { id: "whoami-host", label: "Prompt showing root or sudoer username and date", penalty: "-10% deduction" }
    ],
    proTip: "Confirm curl localhost:<port> returns the application welcome page directly from inside the terminal before screenshotting."
  },

  // --- DAT330: Introduction to Databases (Azure SQL & MSSQL) ---
  {
    id: "dat330-lab1",
    courseId: "dat330",
    courseCode: "DAT330",
    labName: "Lab 1: Database Objects & Azure SQL Connection",
    category: "Cloud Database Architecture",
    terminalType: "sql",
    verificationCmd: 'SELECT @@SERVERNAME AS [Azure_Server], DB_NAME() AS [Database_Name], SUSER_SNAME() AS [Seneca_User], GETDATE() AS [Audit_Timestamp];',
    keyEvidence: "SSMS query results grid showing Azure SQL database connection, firewall rule acceptance, and table creation.",
    requiredItems: [
      { id: "whoami-db", label: "SUSER_SNAME() matches assigned Seneca student account ID", penalty: "Mandatory by Parul Kantaria" },
      { id: "ts-check", label: "GETDATE() timestamp visible in bottom status bar and result grid", penalty: "-10% deduction" },
      { id: "azure-tier", label: "Azure SQL Database tier set to Basic/General Purpose 2 vCores max", penalty: "Prevents credit exhaust" },
      { id: "budget-check", label: "Azure Portal cost analysis reviewed to ensure $0 unexpected burn", penalty: "10% grade component" }
    ],
    proTip: "Never use sa or administrator for routine operations; verify connection string is using your designated student login."
  },
  {
    id: "dat330-lab4",
    courseId: "dat330",
    courseCode: "DAT330",
    labName: "Lab 4: Monitor & Optimize Operational Resources",
    category: "Query Performance & DMV Analysis",
    terminalType: "sql",
    verificationCmd: 'SELECT SUSER_SNAME() AS [Seneca_User], GETDATE() AS [Audit_Timestamp]; SELECT TOP 5 query_stats.total_worker_time/1000 AS [Total_CPU_ms], query_stats.execution_count, text FROM sys.dm_exec_query_stats AS query_stats CROSS APPLY sys.dm_exec_sql_text(query_stats.sql_handle) ORDER BY [Total_CPU_ms] DESC;',
    keyEvidence: "Dynamic Management View (DMV) query results showing top resource-consuming queries and index suggestions.",
    requiredItems: [
      { id: "dmv-output", label: "DMV query execution results displayed with legible column widths", penalty: "Unreadable results 0" },
      { id: "exec-plan", label: "Actual Execution Plan graphical tree captured with index seek/scan highlighted", penalty: "Key rubric deliverable" },
      { id: "recommend", label: "Written analysis identifying missing index impact percentage", penalty: "-20% if missing" },
      { id: "azure-clean", label: "Azure SQL Database paused or scaled down after lab completion", penalty: "Budget burn risk" }
    ],
    proTip: "In SSMS, press Ctrl+M to turn on 'Include Actual Execution Plan' before executing your query."
  },
  {
    id: "dat330-assg2",
    courseId: "dat330",
    courseCode: "DAT330",
    labName: "Assignment 2: Performance Monitoring & Metrics Analysis",
    category: "Performance Tuning",
    terminalType: "sql",
    verificationCmd: 'SELECT @@SERVERNAME, DB_NAME(), SUSER_SNAME(), GETDATE(); -- Include execution plan XML export',
    keyEvidence: "Full execution plan XML and comparison before/after adding covering non-clustered index.",
    requiredItems: [
      { id: "before-after", label: "Before vs after metrics table (logical reads, CPU time, elapsed time)", penalty: "Required by rubric" },
      { id: "index-script", label: "Clean CREATE INDEX script with INCLUDE columns documented", penalty: "Syntax error penalty" },
      { id: "budget-check", label: "Confirmed Azure credit balance remaining (minimum $70 recommended)", penalty: "Grade compliance" },
      { id: "pdf-clean", label: "Combined single PDF submission with student name in cover header", penalty: "Format rule" }
    ],
    proTip: "Use 'SET STATISTICS IO, TIME ON;' in SSMS to get exact numeric logical reads and CPU time in milliseconds."
  },

  // --- MST300: Introduction to Microsoft Cloud Technologies (Azure) ---
  {
    id: "mst300-labs1-6",
    courseId: "mst300",
    courseCode: "MST300",
    labName: "Labs 1 - 6: Core Solutions & Management Tools",
    category: "Azure Management & CLI",
    terminalType: "bash",
    verificationCmd: 'echo "=== AZURE CLI AUDIT ===" && az account show --query "{Subscription:name, User:user.name}" -o table && az resource list --query "[].{Name:name, Type:type, Location:location}" -o table && date',
    keyEvidence: "Azure Cloud Shell or local CLI showing active subscription, student Seneca email, and provisioned resources.",
    requiredItems: [
      { id: "az-sub", label: "Azure for Students subscription name and Seneca email clearly visible", penalty: "Proof of original work" },
      { id: "rg-tag", label: "Resource group tags applied per Seneca naming conventions", penalty: "Rubric standard" },
      { id: "deallocate-vm", label: "CRITICAL: az vm deallocate executed on all lab VMs after verification", penalty: "Burns $100 credit!" },
      { id: "zero-spend", label: "Azure Cost Analysis tab verified with 0 unneeded running resources", penalty: "10% grade component" }
    ],
    proTip: "Stopping a VM from inside the OS does NOT stop Azure billing! You must run 'az vm deallocate' or click Stop in the Azure Portal."
  },
  {
    id: "mst300-labs7-11",
    courseId: "mst300",
    courseCode: "MST300",
    labName: "Labs 7 - 11: ARM Templates & Azure Monitor",
    category: "Infrastructure as Code",
    terminalType: "powershell",
    verificationCmd: 'Get-AzContext | Select-Object Account, Subscription; Test-AzResourceGroupDeployment -ResourceGroupName "CTY-Lab-RG" -TemplateFile "./azuredeploy.json"; Get-Date',
    keyEvidence: "ARM template JSON validation passing with 0 syntax errors, and Azure Monitor metric alert rule screenshot.",
    requiredItems: [
      { id: "arm-valid", label: "ARM template validated with Test-AzResourceGroupDeployment", penalty: "Deployment failure" },
      { id: "monitor-rule", label: "Metric alert rule condition (e.g. CPU > 80%) active and enabled", penalty: "Missing alert marks" },
      { id: "cloud-stop", label: "Lab resources cleaned up or stopped to preserve student credits", penalty: "Credit protection" },
      { id: "student-name", label: "Student Seneca username visible in Azure Portal top-right profile", penalty: "No generic screenshots" }
    ],
    proTip: "Use VS Code with the Azure Resource Manager (ARM) Tools extension for auto-completion and schema validation."
  },

  // --- SEC320: Computer Forensics & Incident Response ---
  {
    id: "sec320-lab5",
    courseId: "sec320",
    courseCode: "SEC320",
    labName: "Lab 5: Memory Forensics & GRR",
    category: "Digital Forensics",
    terminalType: "bash",
    verificationCmd: 'echo "=== SEC320 MEMORY AUDIT ===" && whoami && hostname && volatility -f /tmp/evidence.raw imageinfo && sha256sum /tmp/evidence.raw && date',
    keyEvidence: "Volatility imageinfo profile identification alongside SHA-256 evidence integrity hash.",
    requiredItems: [
      { id: "hash-custody", label: "Cryptographic hash (MD5 / SHA-256) matches original evidence chain", penalty: "Tampering / Chain break" },
      { id: "volatility-prof", label: "Suggested memory profile (e.g. Win7SP1x64) correctly identified", penalty: "Plugin failure" },
      { id: "pid-triage", label: "pslist / pstree output showing rogue parent-child process injection", penalty: "Missed malicious artifact" },
      { id: "notes-log", label: "Timestamped forensic notes detailing investigator name and tool version", penalty: "Court admissibility fail" }
    ],
    proTip: "Never analyze original evidence directly. Always work on a verified read-only forensic copy!"
  },
  {
    id: "sec320-lab6",
    courseId: "sec320",
    courseCode: "SEC320",
    labName: "Lab 6: Malware Basic Static Analysis",
    category: "Malware Analysis",
    terminalType: "bash",
    verificationCmd: 'echo "=== STATIC ANALYSIS AUDIT ===" && whoami && sha256sum sample.exe && file sample.exe && strings -n 8 sample.exe | grep -iE "http|https|cmd|powershell|registry" | head -n 10 && date',
    keyEvidence: "PE header architecture, import table (kernel32/ws2_32), and extracted ASCII/Unicode network strings.",
    requiredItems: [
      { id: "sample-hash", label: "SHA-256 hash verified before and after analysis", penalty: "Integrity requirement" },
      { id: "strings-ioc", label: "Extracted potential Indicators of Compromise (IPs, URLs, registry keys)", penalty: "Key rubric component" },
      { id: "isolated-net", label: "Remnux / FlareVM network adapter set to Host-Only or Isolated", penalty: "Campus safety rule" },
      { id: "analyst-id", label: "Analyst Seneca ID and date clearly printed in analysis terminal", penalty: "-10% deduction" }
    ],
    proTip: "Check PE sections with 'pestudio' or 'readpe' to detect UPX packed binaries before looking for plain strings."
  },

  // --- CSN305: Software Defined Networks ---
  {
    id: "csn305-lab1",
    courseId: "csn305",
    courseCode: "CSN305",
    labName: "Lab 1: Virtualization & Hypervisors",
    category: "Virtualization & Hypervisors",
    terminalType: "bash",
    verificationCmd: 'echo "=== CSN305 VIRTUALIZATION AUDIT ===" && whoami && hostname && (kvm-ok 2>/dev/null || virsh list --all 2>/dev/null || uname -a) && date',
    keyEvidence: "Hypervisor configuration, virtual machine execution proof, student identity in shell prompt, and system timestamp.",
    requiredItems: [
      { id: "hypervisor-config", label: "Hypervisor / VM platform configuration showing assigned SSD storage (>=500GB requirement)", penalty: "Storage setup rubric" },
      { id: "vm-status", label: "Virtual environment running with active guest network interfaces", penalty: "VM instance failure" },
      { id: "whoami-header", label: "Terminal output clearly showing student full name / login account", penalty: "Syllabus boilerplate deduction" },
      { id: "timestamp-proof", label: "System date and time visible in the active terminal window", penalty: "Syllabus verification deduction" }
    ],
    proTip: "Seneca CSN305 syllabus strictly requires: 'All inserted screenshots in lab reports must be identified by including either the student\\'s full name or login account name and the date/time when it was taken. Minimum 50% required to pass every lab!'"
  },
  {
    id: "csn305-lab4",
    courseId: "csn305",
    courseCode: "CSN305",
    labName: "Lab 4: SDN Architecture & OpenFlow",
    category: "SDN Architecture & OpenFlow",
    terminalType: "bash",
    verificationCmd: 'echo "=== CSN305 SDN AUDIT ===" && whoami && hostname && sudo mn --version && sudo ovs-vsctl show && date',
    keyEvidence: "Mininet topology launch, Open vSwitch bridge configuration, and successful pingall between virtual hosts.",
    requiredItems: [
      { id: "mn-topology", label: "Mininet custom Python topology running with assigned switches and hosts", penalty: "Topology failure" },
      { id: "ovs-bridge", label: "Open vSwitch bridge (s1) listening on OpenFlow port 6633 / 6653", penalty: "Controller disconnect" },
      { id: "ping-all", label: "Mininet pingall output showing 0% dropped packets", penalty: "Connectivity rubric" },
      { id: "wireshark-cap", label: "Wireshark OpenFlow HELLO and FEATURE_REPLY handshake packets captured", penalty: "Protocol evidence" }
    ],
    proTip: "Run 'sudo mn -c' to clean up orphaned Open vSwitch ports before launching a new Mininet topology."
  },

  // --- WTP100: Work Term Preparation ---
  {
    id: "wtp100-m5",
    courseId: "wtp100",
    courseCode: "WTP100",
    labName: "Module 5: InStage AI Mock Interview Simulation",
    category: "Co-op Career Readiness",
    terminalType: "none",
    verificationCmd: '# InStage AI web simulation completion certificate\n# Verification URL: https://instage.co/seneca/dashboard',
    keyEvidence: "InStage AI completion report showing score >= 80%, eye contact analysis, and STAR answer structure.",
    requiredItems: [
      { id: "instage-score", label: "InStage AI simulated interview score >= 80%", penalty: "Mandatory threshold" },
      { id: "star-method", label: "Responses demonstrate Situation, Task, Action, Result framework", penalty: "WIL coordinator review" },
      { id: "pdf-export", label: "Completion certificate downloaded as PDF with full student name", penalty: "Required by Oct 23" },
      { id: "senecaworks-sync", label: "Seneca Works profile status verified for Semester 4 co-op eligibility", penalty: "Co-op prerequisite" }
    ],
    proTip: "Structure your technical responses around your Semester 2 & 3 lab projects (e.g. BIND DNS setup or Azure cloud deployment)."
  }
];

export const GENERAL_PREFLIGHT_CRITERIA = [
  {
    id: "gen-id",
    title: "1. Student Identification in Output",
    description: "Your terminal prompt or SQL window must clearly show your Seneca username (e.g. whoami, SUSER_SNAME). Anonymous or cropped screenshots risk immediate mark deduction."
  },
  {
    id: "gen-time",
    title: "2. Live System Timestamp",
    description: "Every screenshot must show the local date and time (e.g. `date` command in bash or system tray clock in Windows) proving completion prior to the official 11:59 PM deadline."
  },
  {
    id: "gen-cloud",
    title: "3. Cloud Budget Safeguard Check",
    description: "For Azure and AWS labs, verify that all virtual machines, public IP addresses, and SQL compute pools are deallocated or paused. Budget management accounts for 10% of your course grade in DAT330 & MST300!"
  },
  {
    id: "gen-format",
    title: "4. Professional Submission Document",
    description: "Compile deliverables into a clean, searchable PDF. Never submit raw word processor documents (.docx) or unformatted text files unless explicitly requested."
  },
  {
    id: "gen-academic",
    title: "5. Academic Integrity & Originality",
    description: "Code and configurations must be original and reproducible during synchronous professor lab viva checks. Adheres to Seneca Academic Honesty Policy."
  }
];
