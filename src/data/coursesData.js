export const INITIAL_COURSES = [
  {
    id: "dat330",
    code: "DAT330",
    name: "Introduction to Databases",
    section: "NBB",
    classNbr: "5201",
    professor: "Parul Kantaria",
    email: "parul.kantaria@senecapolytechnic.ca",
    officeHours: "By appointment / Post-class synchronous",
    credits: 1.0,
    delivery: "In-Person",
    color: "#ef4444", // Crimson / Red
    accentColor: "red",
    badgeBg: "bg-red-500/10 text-red-400 border-red-500/30",
    gradient: "from-red-600 to-rose-700",
    schedule: [
      { day: "Monday", time: "3:20 PM - 5:05 PM", room: "Newnham Bldg A - A1509" },
      { day: "Wednesday", time: "5:10 PM - 6:55 PM", room: "Newnham Bldg A - A3512" }
    ],
    links: [
      { label: "Learn@Seneca", url: "https://learn.senecapolytechnic.ca/ultra/institution-page" },
      { label: "Azure Portal", url: "https://portal.azure.com" }
    ],
    description: "Hands-on database architecture utilizing Microsoft Azure SQL on cloud and on-premises Microsoft SQL Server. Covers T-SQL, query performance optimization, operational monitoring, secure environments, and database task automation.",
    passingRequirements: [
      "Achieve an overall course grade of 50% or higher",
      "Achieve a weighted average of 50% or higher on all labs",
      "Achieve a weighted average of 50% or higher on all tests",
      "Achieve a weighted average of 50% or higher on assignments & final project"
    ],
    latePolicy: "Late submissions penalized 10% per day for max 3 days. After day 3, mark is 0.",
    budgetTracker: {
      enabled: true,
      service: "Microsoft Azure SQL & Data Services",
      creditLimit: 100,
      currentSpend: 0,
      notes: "Budget allotment management accounts for 10% of total course mark."
    },
    assessments: [
      { id: "dat330-lab1", name: "Lab 1", category: "Lab", weight: 2.5, dueDate: "2026-09-14", week: 2, status: "Not Started", score: null, maxScore: 100, topic: "Database Objects & Azure SQL Connection" },
      { id: "dat330-lab2", name: "Lab 2", category: "Lab", weight: 2.5, dueDate: "2026-09-21", week: 3, status: "Not Started", score: null, maxScore: 100, topic: "Database Objects (Cont.) & Schema Design" },
      { id: "dat330-quiz1", name: "Quiz 1", category: "Quiz", weight: 2.0, dueDate: "2026-09-21", week: 3, status: "Not Started", score: null, maxScore: 100, topic: "Relational Concepts & Object Management" },
      { id: "dat330-assg1", name: "Assignment 1", category: "Assignment", weight: 5.0, dueDate: "2026-09-28", week: 4, status: "Not Started", score: null, maxScore: 100, topic: "SQL Server DB Options in Azure & Comparison" },
      { id: "dat330-quiz2", name: "Quiz 2", category: "Quiz", weight: 2.0, dueDate: "2026-09-28", week: 4, status: "Not Started", score: null, maxScore: 100, topic: "Cloud Database Architecture Options" },
      { id: "dat330-lab3", name: "Lab 3", category: "Lab", weight: 2.5, dueDate: "2026-10-05", week: 5, status: "Not Started", score: null, maxScore: 100, topic: "Plan & Implement Data Platform Resources" },
      { id: "dat330-lab4", name: "Lab 4", category: "Lab", weight: 2.5, dueDate: "2026-10-12", week: 6, status: "Not Started", score: null, maxScore: 100, topic: "Monitor & Optimize Operational Resources" },
      { id: "dat330-assg2", name: "Assignment 2", category: "Assignment", weight: 5.0, dueDate: "2026-10-12", week: 6, status: "Not Started", score: null, maxScore: 100, topic: "Performance Monitoring & Metrics Analysis" },
      { id: "dat330-midterm", name: "Midterm Test", category: "Test", weight: 15.0, dueDate: "2026-10-19", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "Midterm Examination (Comprehensive)" },
      { id: "dat330-lab5", name: "Lab 5", category: "Lab", weight: 2.5, dueDate: "2026-11-09", week: 9, status: "Not Started", score: null, maxScore: 100, topic: "Implement a Secure Environment & Normalization" },
      { id: "dat330-quiz3", name: "Quiz 3", category: "Quiz", weight: 2.0, dueDate: "2026-11-09", week: 9, status: "Not Started", score: null, maxScore: 100, topic: "Database Security & Normalization Theory" },
      { id: "dat330-lab6", name: "Lab 6", category: "Lab", weight: 2.5, dueDate: "2026-11-16", week: 10, status: "Not Started", score: null, maxScore: 100, topic: "Optimize Query Performance & Execution Plans" },
      { id: "dat330-assg3", name: "Assignment 3", category: "Assignment", weight: 5.0, dueDate: "2026-11-23", week: 11, status: "Not Started", score: null, maxScore: 100, topic: "Azure and SQL Server PowerShell Automation" },
      { id: "dat330-quiz4", name: "Quiz 4", category: "Quiz", weight: 2.0, dueDate: "2026-11-23", week: 11, status: "Not Started", score: null, maxScore: 100, topic: "PowerShell & Automated Scripting" },
      { id: "dat330-lab7", name: "Lab 7", category: "Lab", weight: 2.5, dueDate: "2026-11-30", week: 12, status: "Not Started", score: null, maxScore: 100, topic: "Automation of Maintenance Tasks & Jobs" },
      { id: "dat330-quiz5", name: "Quiz 5", category: "Quiz", weight: 2.0, dueDate: "2026-11-30", week: 12, status: "Not Started", score: null, maxScore: 100, topic: "High Availability & Disaster Recovery" },
      { id: "dat330-lab8", name: "Lab 8", category: "Lab", weight: 2.5, dueDate: "2026-12-07", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "High Availability & Failover Configurations" },
      { id: "dat330-proj", name: "Final Project", category: "Project", weight: 15.0, dueDate: "2026-12-07", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "End-to-End Enterprise Database Cloud Project" },
      { id: "dat330-budget-eval", name: "Management of Budget Allotment", category: "Milestone", weight: 10.0, dueDate: "2026-12-14", week: 14, status: "Not Started", score: null, maxScore: 100, topic: "Azure Cloud Spend Compliance & Budget Cap" },
      { id: "dat330-final", name: "Final Exam", category: "Exam", weight: 15.0, dueDate: "2026-12-14", week: 14, status: "Not Started", score: null, maxScore: 100, topic: "Comprehensive Course Final Examination" }
    ],
    notes: "Remember: PARUL KANTARIA requires 50% weighted average across 3 individual components (Labs, Tests, and Assignments/Projects)!"
  },
  {
    id: "mst300",
    code: "MST300",
    name: "Introduction to Microsoft Cloud Technologies",
    section: "NBB",
    classNbr: "5219",
    professor: "Nooshin Beheshti",
    email: "nooshin.beheshti@senecapolytechnic.ca",
    officeHours: "Mondays & Tuesdays after class",
    credits: 1.0,
    delivery: "In-Person",
    color: "#a855f7", // Purple / Violet
    accentColor: "purple",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    gradient: "from-purple-600 to-indigo-800",
    schedule: [
      { day: "Monday", time: "9:50 AM - 11:35 AM", room: "Newnham Bldg C - C3036" },
      { day: "Tuesday", time: "9:50 AM - 11:35 AM", room: "Newnham Bldg A - A4515" }
    ],
    links: [
      { label: "Learn@Seneca", url: "https://learn.senecapolytechnic.ca/ultra/institution-page" },
      { label: "Microsoft Learn", url: "https://learn.microsoft.com" },
      { label: "Azure Portal", url: "https://portal.azure.com" }
    ],
    description: "Comprehensive coverage of Microsoft Azure cloud computing: IaaS/PaaS/SaaS, Azure portal & CLI, ARM templates, Azure Monitor, Key Vault, Sentinel, NSGs, Azure Firewall, Azure AD, RBAC, Governance, and Cost Management.",
    passingRequirements: [
      "Achieve an overall course grade of 50% or higher",
      "Achieve a weighted average of 50% or higher on all labs",
      "Achieve a weighted average of 50% or higher on all projects"
    ],
    latePolicy: "Submissions must be on time via Blackboard. Consult professor before deadlines for extensions.",
    budgetTracker: {
      enabled: true,
      service: "Microsoft Azure Education Subscription",
      creditLimit: 100,
      currentSpend: 0,
      notes: "10% of final grade is determined by Azure budget allotment management!"
    },
    assessments: [
      { id: "mst300-quiz1", name: "Quiz 1", category: "Quiz", weight: 2.5, dueDate: "2026-09-29", week: 4, status: "Not Started", score: null, maxScore: 100, topic: "Describe Core Azure Concepts (Module 1)" },
      { id: "mst300-labs1-6", name: "Labs 1 - 6", category: "Lab", weight: 6.0, dueDate: "2026-10-06", week: 5, status: "Not Started", score: null, maxScore: 100, topic: "Core Solutions & Management Tools (Module 3)" },
      { id: "mst300-quiz2", name: "Quiz 2", category: "Quiz", weight: 2.5, dueDate: "2026-10-06", week: 5, status: "Not Started", score: null, maxScore: 100, topic: "IoT, Synapse, Databricks, Serverless (Module 3)" },
      { id: "mst300-labs7-11", name: "Labs 7 - 11", category: "Lab", weight: 5.0, dueDate: "2026-10-13", week: 6, status: "Not Started", score: null, maxScore: 100, topic: "Azure Portal, CLI, Cloud Shell, ARM & Monitor" },
      { id: "mst300-quiz3", name: "Quiz 3", category: "Quiz", weight: 2.5, dueDate: "2026-10-13", week: 6, status: "Not Started", score: null, maxScore: 100, topic: "ARM Templates, Azure Advisor & Service Health" },
      { id: "mst300-proj1", name: "Project 1", category: "Project", weight: 15.0, dueDate: "2026-11-03", week: 8, status: "Not Started", score: null, maxScore: 100, topic: "Azure Cloud Infrastructure & Architecture Project" },
      { id: "mst300-labs12-13", name: "Labs 12 - 13", category: "Lab", weight: 2.0, dueDate: "2026-11-10", week: 9, status: "Not Started", score: null, maxScore: 100, topic: "Azure Security Center, Key Vault & Sentinel" },
      { id: "mst300-quiz4", name: "Quiz 4", category: "Quiz", weight: 2.5, dueDate: "2026-11-10", week: 9, status: "Not Started", score: null, maxScore: 100, topic: "Network Security Groups, Azure Firewall, DDoS" },
      { id: "mst300-labs14-18", name: "Labs 14 - 18", category: "Lab", weight: 5.0, dueDate: "2026-12-01", week: 12, status: "Not Started", score: null, maxScore: 100, topic: "Azure AD, MFA, RBAC, Resource Locks, Policy" },
      { id: "mst300-quiz5", name: "Quiz 5", category: "Quiz", weight: 2.5, dueDate: "2026-12-01", week: 12, status: "Not Started", score: null, maxScore: 100, topic: "Identity, Governance, Privacy & Compliance" },
      { id: "mst300-proj2", name: "Project 2", category: "Project", weight: 15.0, dueDate: "2026-12-08", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Advanced Azure Enterprise Governance Implementation" },
      { id: "mst300-labs19-21", name: "Labs 19 - 21", category: "Lab", weight: 2.0, dueDate: "2026-12-08", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Cost Management, TCO, Pricing Calculator & SLAs" },
      { id: "mst300-quiz6", name: "Quiz 6", category: "Quiz", weight: 2.5, dueDate: "2026-12-08", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Cost Planning & Service Level Agreements" },
      { id: "mst300-budget-eval", name: "Management of Budget Allotment", category: "Milestone", weight: 10.0, dueDate: "2026-12-15", week: 14, status: "Not Started", score: null, maxScore: 100, topic: "Budget Management & Resource Cleanup Evaluation" },
      { id: "mst300-test", name: "Final Test", category: "Test", weight: 25.0, dueDate: "2026-12-15", week: 14, status: "Not Started", score: null, maxScore: 100, topic: "Comprehensive Azure Cloud Technologies Test" }
    ],
    notes: "Requires minimum 20 labs and 6 quizzes. Need >=50% on both labs and projects to pass!"
  },
  {
    id: "ops345",
    code: "OPS345",
    name: "Open System Application Server",
    section: "NBB",
    classNbr: "OPS345v2",
    professor: "Linux Systems Faculty",
    email: "seneca-ictoer@github.io",
    officeHours: "Weekly lab sessions & GitHub Discussions",
    credits: 1.0,
    delivery: "In-Person",
    color: "#f59e0b", // Gold / Amber (high-contrast amber-500)
    accentColor: "amber",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    gradient: "from-amber-600 to-yellow-800",
    schedule: [
      { day: "Wednesday", time: "1:30 PM - 3:15 PM", room: "Newnham Lab" },
      { day: "Thursday", time: "8:55 AM - 10:40 AM", room: "Newnham Lab" }
    ],
    links: [
      { label: "Course Site", url: "https://seneca-ictoer.github.io/OPS345v2/" },
      { label: "Weekly Schedule", url: "https://seneca-ictoer.github.io/OPS345v2/weekly-schedule" },
      { label: "AWS Learner Lab", url: "https://awsacademy.instructure.com" }
    ],
    description: "Advanced Linux server administration in on-premises Ubuntu environments and Amazon Web Services (AWS). Topics include virtual networking, NAT, FRR, DNS, Samba, containerization, Apache, SSL, RDS, ECS, S3, and Elastic Beanstalk.",
    passingRequirements: [
      "Achieve an overall course grade of 50% or higher",
      "HANDWRITTEN reference sheets strictly required for tests (1-sided for Midterm, 2-sided for Final). Digital sheets prohibited!",
      "AWS Learner Lab: $50 credit limit is STRICT. Once depleted, account is disabled with NO REFILLS!"
    ],
    latePolicy: "Late labs and assignments subject to course penalty. Check course outline.",
    budgetTracker: {
      enabled: true,
      service: "AWS Learner Lab Sandbox",
      creditLimit: 50.00,
      currentSpend: 0.00,
      currency: "USD",
      notes: "DO NOT LEAVE INSTANCES RUNNING! Stop all EC2 & RDS instances when finished working."
    },
    assessments: [
      { id: "ops345-lab1", name: "Lab 1: Environment & Physical Network", category: "Lab", weight: 2.0, dueDate: "2026-10-23", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "Building the Ubuntu VM host & physical network" },
      { id: "ops345-lab2", name: "Lab 2: Addressing, NAT & FRR", category: "Lab", weight: 2.0, dueDate: "2026-10-23", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "Logically Addressing the Network, NAT, and FRR" },
      { id: "ops345-lab3", name: "Lab 3: DNS and Samba Server", category: "Lab", weight: 2.0, dueDate: "2026-10-23", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "Configuring BIND9 DNS & Samba network shares" },
      { id: "ops345-lab4", name: "Lab 4: Containers", category: "Lab", weight: 2.0, dueDate: "2026-10-23", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "LXD / Docker containerized service deployment" },
      { id: "ops345-test1", name: "Midterm Test", category: "Test", weight: 25.0, dueDate: "2026-10-23", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "Midterm Hands-on Test (1-sided handwritten cheat sheet)" },
      { id: "ops345-assg1", name: "Assignment 1", category: "Assignment", weight: 20.0, dueDate: "2026-11-06", week: 8, status: "Not Started", score: null, maxScore: 100, topic: "On-Premises Infrastructure Project Deployment" },
      { id: "ops345-lab5", name: "Lab 5: AWS & AWS Networking", category: "Lab", weight: 2.0, dueDate: "2026-12-04", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Intro to AWS VPCs, Subnets, and Gateways" },
      { id: "ops345-lab6", name: "Lab 6: Apache, DNS & SSL in AWS", category: "Lab", weight: 2.0, dueDate: "2026-12-04", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Deploying secure Apache web server with Route53 & SSL" },
      { id: "ops345-lab7", name: "Lab 7: WordPress with RDS & ECS", category: "Lab", weight: 2.0, dueDate: "2026-12-04", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Finalizing WordPress in AWS with RDS & ECS" },
      { id: "ops345-lab8", name: "Lab 8: S3 & Elastic Beanstalk", category: "Lab", weight: 2.0, dueDate: "2026-12-04", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Simple Storage Service (S3) & Elastic Beanstalk" },
      { id: "ops345-assg2", name: "Assignment 2", category: "Assignment", weight: 10.0, dueDate: "2026-12-04", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "AWS Cloud Deployment & Architecture Project" },
      { id: "ops345-quizzes", name: "Quizzes", category: "Quiz", weight: 4.0, dueDate: "2026-12-04", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Cumulative online quizzes and knowledge checks" },
      { id: "ops345-final", name: "Final Test", category: "Test", weight: 25.0, dueDate: "2026-12-18", week: 14, status: "Not Started", score: null, maxScore: 100, topic: "Final Comprehensive Test (2-sided handwritten cheat sheet)" }
    ],
    notes: "Do NOT attempt in Windows! Use a fresh Ubuntu external SSD drive. Be prepared with handwritten reference sheets for tests."
  },
  {
    id: "sec320",
    code: "SEC320",
    name: "Security Incident Response",
    section: "NBB",
    classNbr: "5408",
    professor: "Homayoun Mohamadi",
    email: "homayoun.mohamadi@senecapolytechnic.ca",
    officeHours: "Tuesdays 1:30 PM - 2:30 PM or appointment",
    credits: 1.0,
    delivery: "In-Person",
    color: "#0ea5e9", // Blue / Sky (high-contrast sky-500)
    accentColor: "sky",
    badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    gradient: "from-sky-600 to-blue-800",
    schedule: [
      { day: "Monday", time: "1:30 PM - 3:15 PM", room: "Newnham Bldg K - K1272" },
      { day: "Tuesday", time: "11:40 AM - 1:25 PM", room: "Newnham Bldg K - K1272" }
    ],
    links: [
      { label: "Learn@Seneca", url: "https://learn.senecapolytechnic.ca/ultra/institution-page" }
    ],
    description: "Cyber incident response lifecycle: live & dead box forensics, memory analysis (GRR, Volatility), timeline generation, automated response scripting, malware static & dynamic analysis, SOAR, and threat intelligence.",
    passingRequirements: [
      "Achieve an overall course grade of 50% or higher",
      "Achieve a weighted average of 50% or higher on all tests",
      "Achieve a weighted average of 50% or higher on all labs",
      "Satisfactorily complete all labs and assignments"
    ],
    latePolicy: "Late submissions receive 10% per day penalty (max 3 days). After 3 days, grade is 0.",
    budgetTracker: { enabled: false },
    assessments: [
      { id: "sec320-lab1", name: "Lab 1: Cyber Incident Types & OODA", category: "Lab", weight: 3.0, dueDate: "2026-09-15", week: 1, status: "Not Started", score: null, maxScore: 100, topic: "Incident Response Lifecycle & OODA loop" },
      { id: "sec320-lab2", name: "Lab 2: IR Plan & Playbooks", category: "Lab", weight: 3.0, dueDate: "2026-09-22", week: 2, status: "Not Started", score: null, maxScore: 100, topic: "Incident Response Governance & Playbook Engineering" },
      { id: "sec320-lab3", name: "Lab 3: Host Forensics 1", category: "Lab", weight: 3.0, dueDate: "2026-09-29", week: 3, status: "Not Started", score: null, maxScore: 100, topic: "Disk artifacts, registry analysis, event logs" },
      { id: "sec320-lab4", name: "Lab 4: Host Forensics 2", category: "Lab", weight: 5.0, dueDate: "2026-10-06", week: 4, status: "Not Started", score: null, maxScore: 100, topic: "Filesystem forensics, timeline creation, evidence parsing" },
      { id: "sec320-lab5", name: "Lab 5: Memory Forensics & GRR", category: "Lab", weight: 5.0, dueDate: "2026-10-13", week: 5, status: "Not Started", score: null, maxScore: 100, topic: "Memory acquisition, Volatility analysis, GRR triage" },
      { id: "sec320-prop", name: "Project Proposal", category: "Project", weight: 5.0, dueDate: "2026-10-20", week: 6, status: "Not Started", score: null, maxScore: 100, topic: "Cyber Incident Investigation Scope & Strategy Proposal" },
      { id: "sec320-test1", name: "Practical Test 1", category: "Test", weight: 15.0, dueDate: "2026-10-22", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "Hands-on Live & Memory Forensics Practical Exam" },
      { id: "sec320-lab6", name: "Lab 6: Malware Basic Static Analysis", category: "Lab", weight: 5.0, dueDate: "2026-11-10", week: 8, status: "Not Started", score: null, maxScore: 100, topic: "Hashing, string extraction, PE headers, packed samples" },
      { id: "sec320-lab7", name: "Lab 7: Malware Basic Dynamic Analysis", category: "Lab", weight: 5.0, dueDate: "2026-11-17", week: 9, status: "Not Started", score: null, maxScore: 100, topic: "Sandboxing, process monitoring, network traffic capture" },
      { id: "sec320-lab8", name: "Lab 8: SOAR Automation", category: "Lab", weight: 5.0, dueDate: "2026-11-24", week: 10, status: "Not Started", score: null, maxScore: 100, topic: "Security Orchestration, Automation & Response Scripts" },
      { id: "sec320-lab9", name: "Lab 9: Threat Intelligence", category: "Lab", weight: 6.0, dueDate: "2026-12-01", week: 11, status: "Not Started", score: null, maxScore: 100, topic: "Threat intel correlation, IOC matching, STIX/TAXII" },
      { id: "sec320-pres", name: "Project Presentation", category: "Project", weight: 10.0, dueDate: "2026-12-08", week: 12, status: "Not Started", score: null, maxScore: 100, topic: "Incident Investigation Executive & Technical Briefing" },
      { id: "sec320-rep", name: "Project Report", category: "Project", weight: 15.0, dueDate: "2026-12-15", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Comprehensive Forensic Investigation Final Report" },
      { id: "sec320-test2", name: "Practical Test 2", category: "Test", weight: 15.0, dueDate: "2026-12-17", week: 14, status: "Not Started", score: null, maxScore: 100, topic: "End-of-Term Incident Response Practical Examination" }
    ],
    notes: "Requires minimum 50% weighted on tests AND labs separately. Keep thorough digital chain-of-custody notes!"
  },
  {
    id: "psy262",
    code: "PSY262",
    name: "Mindfulness for Students",
    section: "NBB",
    classNbr: "7086",
    professor: "Glen Choi",
    email: "glen.choi@senecapolytechnic.ca",
    officeHours: "Schedule one-on-one via Zoom / Email",
    credits: 1.0,
    delivery: "Online Flexible (Broadcasting simultaneously from K2241)",
    color: "#ec4899", // Pink / Magenta
    accentColor: "pink",
    badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    gradient: "from-pink-600 to-purple-800",
    schedule: [
      { day: "Friday", time: "1:30 PM - 4:10 PM", room: "ONLINE (Flexible: or Newnham Bldg K - K2241)" }
    ],
    links: [
      { label: "Learn@Seneca", url: "https://learn.senecapolytechnic.ca/ultra/institution-page" }
    ],
    description: "General Education course exploring mindfulness as a foundational tool for managing student life and academic stress. Covers the mind-body connection, stress response biology, meditation, cognitive reframing, and resilience.",
    passingRequirements: [
      "Achieve an overall course grade of 50% or higher"
    ],
    latePolicy: "In-class assignments submitted during or immediately following weekly sessions.",
    budgetTracker: { enabled: false },
    assessments: [
      { id: "psy262-a12", name: "In-Class Assignments #1 & #2", category: "In-class", weight: 4.0, dueDate: "2026-09-18", week: 2, status: "Not Started", score: null, maxScore: 100, topic: "The mind-material connection (2% each)" },
      { id: "psy262-a3", name: "In-Class Assignment #3", category: "In-class", weight: 3.0, dueDate: "2026-09-25", week: 3, status: "Not Started", score: null, maxScore: 100, topic: "Mindfulness via films & observational reflection" },
      { id: "psy262-q1", name: "Quiz #1", category: "Quiz", weight: 20.0, dueDate: "2026-10-02", week: 4, status: "Not Started", score: null, maxScore: 100, topic: "Stress response biology & mindfulness history" },
      { id: "psy262-a4", name: "In-Class Assignment #4", category: "In-class", weight: 3.0, dueDate: "2026-10-02", week: 4, status: "Not Started", score: null, maxScore: 100, topic: "Meditation practice exercises" },
      { id: "psy262-a56", name: "In-Class Assignments #5 & #6", category: "In-class", weight: 4.0, dueDate: "2026-10-09", week: 5, status: "Not Started", score: null, maxScore: 100, topic: "Deepening your practice (2% each)" },
      { id: "psy262-a7", name: "In-Class Assignment #7", category: "In-class", weight: 3.0, dueDate: "2026-10-16", week: 6, status: "Not Started", score: null, maxScore: 100, topic: "Anchoring and reframing cognitive distortions" },
      { id: "psy262-a810", name: "In-Class Assignments #8, #9, #10", category: "In-class", weight: 6.0, dueDate: "2026-10-23", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "Buddhist-style mindfulness exercises (2% each)" },
      { id: "psy262-q2", name: "Quiz #2", category: "Quiz", weight: 20.0, dueDate: "2026-11-06", week: 8, status: "Not Started", score: null, maxScore: 100, topic: "Self-compassion, cognitive habits & mindfulness theory" },
      { id: "psy262-memoir", name: "Writing Assignment (Memoir)", category: "Assignment", weight: 10.0, dueDate: "2026-11-13", week: 9, status: "Not Started", score: null, maxScore: 100, topic: "Personal Mindfulness Reflection & Journey Memoir" },
      { id: "psy262-a11", name: "In-Class Assignment #11", category: "In-class", weight: 1.0, dueDate: "2026-11-20", week: 10, status: "Not Started", score: null, maxScore: 100, topic: "Indigenous ways of being mindful guest lecture reflection" },
      { id: "psy262-a12-sketch", name: "In-Class Assignment #12", category: "In-class", weight: 1.0, dueDate: "2026-11-27", week: 11, status: "Not Started", score: null, maxScore: 100, topic: "5-4-3-2-1 Grounding Campus Sketch" },
      { id: "psy262-final", name: "Final Exam", category: "Exam", weight: 25.0, dueDate: "2026-12-11", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Comprehensive Course Final Examination" }
    ],
    notes: "Flexible delivery: attend online or on-campus at K2241. Quiz 1 & 2 are high value (20% each)!"
  },
  {
    id: "wtp100",
    code: "WTP100",
    name: "Work Term Preparation",
    section: "NBB",
    classNbr: "WTP100",
    professor: "Work-Integrated Learning (WIL) Co-ordinator",
    email: "wil@senecapolytechnic.ca",
    officeHours: "Seneca Works / WIL Hub",
    credits: 0.0,
    delivery: "ONLINE Synchronous",
    color: "#06b6d4", // Cyan / Teal
    accentColor: "cyan",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    gradient: "from-cyan-600 to-teal-700",
    schedule: [
      { day: "Wednesday", time: "11:40 AM - 1:25 PM", room: "ONLINE (Blackboard / MS Teams)" }
    ],
    links: [
      { label: "Seneca Works Portal", url: "https://senecaworks.senecapolytechnic.ca" },
      { label: "InStage AI Practice", url: "https://instage.co" }
    ],
    description: "Prerequisite for CTY Co-op work terms (CTY331). Covers technical resume engineering, LinkedIn personal branding, portfolio creation, InStage AI mock interviews, and labour market networking tactics.",
    passingRequirements: [
      "Graded on a Satisfactory (SAT) / Unsatisfactory (UN) basis",
      "Must complete all 14 weekly modules",
      "Must score 80% or higher on each module Knowledge Check",
      "MANDATORY DEADLINE: All requirements must be completed by Friday, October 23, 2026!"
    ],
    latePolicy: "Strict deadline Oct 23, 2026. Non-completion results in forfeiture of co-op eligibility.",
    budgetTracker: { enabled: false },
    modulesList: [
      { id: 1, title: "Course Introduction & Navigation", completed: false },
      { id: 2, title: "Self-Assessment & Transferable Skills", completed: false },
      { id: 3, title: "Targeted Resume Architecture", completed: false },
      { id: 4, title: "Effective Cover Letters & Correspondence", completed: false },
      { id: 5, title: "LinkedIn & Personal Branding", completed: false },
      { id: 6, title: "Networking & Informational Interviewing", completed: false },
      { id: 7, title: "Job Search Strategies & Seneca Works", completed: false },
      { id: 8, title: "Interview Preparation & STAR Method", completed: false },
      { id: 9, title: "InStage AI Mock Interview Simulation", completed: false },
      { id: 10, title: "Workplace Professionalism & Ethics", completed: false },
      { id: 11, title: "EDI in the Modern Workplace", completed: false },
      { id: 12, title: "Workplace Health & Safety", completed: false },
      { id: 13, title: "Co-op Term Expectations & Learning Goals", completed: false },
      { id: 14, title: "Final Co-op Clearance & Readiness Checklist", completed: false }
    ],
    assessments: [
      { id: "wtp100-m1", name: "Module 1 Knowledge Check", category: "Milestone", weight: 7.1, dueDate: "2026-09-18", week: 2, status: "Not Started", score: null, maxScore: 100, topic: "Orientation & Course Navigation (>=80% needed)" },
      { id: "wtp100-m2", name: "Module 2 Knowledge Check", category: "Milestone", weight: 7.1, dueDate: "2026-09-25", week: 3, status: "Not Started", score: null, maxScore: 100, topic: "Strengths & Skills Inventory (>=80% needed)" },
      { id: "wtp100-m3", name: "Module 3 Knowledge Check & Resume Draft", category: "Milestone", weight: 7.1, dueDate: "2026-10-02", week: 4, status: "Not Started", score: null, maxScore: 100, topic: "Technical Resume Review (>=80% needed)" },
      { id: "wtp100-m4", name: "Module 4 Knowledge Check & Cover Letter", category: "Milestone", weight: 7.1, dueDate: "2026-10-09", week: 5, status: "Not Started", score: null, maxScore: 100, topic: "Cover Letter Review (>=80% needed)" },
      { id: "wtp100-m5", name: "Module 5 Knowledge Check & InStage AI", category: "Milestone", weight: 7.1, dueDate: "2026-10-16", week: 6, status: "Not Started", score: null, maxScore: 100, topic: "Mock Interview Simulation (>=80% needed)" },
      { id: "wtp100-m6-14", name: "Modules 6-14 & Final Co-op Clearance", category: "Milestone", weight: 64.5, dueDate: "2026-10-23", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "Final Completion of all 14 checks by OCT 23 DEADLINE" }
    ],
    notes: "Crucial for CTY331 Co-op. Does not affect GPA, but required for diploma with co-op!"
  },
  {
    id: "csn305",
    code: "CSN305",
    name: "Software Defined Networks",
    section: "NBB",
    classNbr: "5197",
    professor: "Lisa Li",
    email: "lisa.li2@senecapolytechnic.ca",
    officeHours: "Thursdays after class (4:10 PM) or by appointment",
    credits: 1.0,
    delivery: "In-Person",
    color: "#22c55e", // Green
    accentColor: "green",
    badgeBg: "bg-green-500/10 text-green-400 border-green-500/30",
    gradient: "from-green-600 to-emerald-800",
    schedule: [
      { day: "Thursday", time: "12:35 PM - 4:10 PM", room: "Newnham Bldg K - K1270" }
    ],
    links: [
      { label: "Learn@Seneca", url: "https://learn.senecapolytechnic.ca/ultra/institution-page" },
      { label: "Seneca Bookstore", url: "https://www.bkstr.com/senecastore/shop/textbooks-and-course-materials" }
    ],
    description: "In this project-based course students will examine and then use the functions and components of Software Defined Networks (SDN) to create a network. They will identify challenges when converting static networks to software defined ones. And will be able to analyze the performance of an SDN using verification and troubleshooting techniques to guarantee quality of service.",
    textbook: {
      title: "SDN and NFV Simplified: A Visual Guide to Understanding Software Defined Networks and Network Function Virtualization",
      author: "Jim Doherty",
      isbn: "0-13-4307399",
      required: true,
      supplies: "Solid-state drive (SSD) with minimum 500 GB available capacity"
    },
    passingRequirements: [
      "Achieve a grade of 50% or higher in the overall course",
      "Achieve a weighted average of 50% or higher on all tests (4 tests @ 15% each = 60%)",
      "Satisfactorily complete all labs (minimum 50% required for every lab report; if less, must redo and resubmit)",
      "Prerequisite: CSN205"
    ],
    latePolicy: "All late lab report submissions are subject to a minimum 10% deduction (the later the submission, the higher the deduction). Satisfactory minimum grade for every lab report is 50%; if less, you must redo and resubmit as soon as possible with late deductions applied. Missed tests require prior discussion or immediate contact with professor for extension requests.",
    testRules: "No electronic or wireless devices permitted during tests (smartphones, Smart Glasses prohibited; only prescribed non-Smart glasses allowed).",
    labRules: "All lab reports must be submitted individually. All inserted screenshots in lab reports must be identified by including either the student's full name or login account name and the date/time when it was taken.",
    budgetTracker: { enabled: false },
    isCustomizable: true,
    assessments: [
      { id: "csn305-lab1", name: "Lab 1", category: "Lab", weight: 4.0, dueDate: "2026-09-17", week: 2, status: "Not Started", score: null, maxScore: 100, topic: "Virtualization-Hypervisors & Testbed Setup" },
      { id: "csn305-lab2", name: "Lab 2", category: "Lab", weight: 4.0, dueDate: "2026-09-24", week: 3, status: "Not Started", score: null, maxScore: 100, topic: "Cloud Computing Fundamentals" },
      { id: "csn305-lab3", name: "Lab 3", category: "Lab", weight: 4.0, dueDate: "2026-10-01", week: 4, status: "Not Started", score: null, maxScore: 100, topic: "NFV-Core Networking Functionality" },
      { id: "csn305-test1", name: "Test 1", category: "Test", weight: 15.0, dueDate: "2026-10-01", week: 4, status: "Not Started", score: null, maxScore: 100, topic: "Weeks 1–3: Virtualization, Cloud Fundamentals & NFV" },
      { id: "csn305-lab4", name: "Lab 4", category: "Lab", weight: 4.0, dueDate: "2026-10-08", week: 5, status: "Not Started", score: null, maxScore: 100, topic: "SDN Architecture & OpenFlow Switch Specification" },
      { id: "csn305-lab5", name: "Lab 5", category: "Lab", weight: 4.0, dueDate: "2026-10-15", week: 6, status: "Not Started", score: null, maxScore: 100, topic: "OpenFlow-Related Protocols" },
      { id: "csn305-lab6", name: "Lab 6", category: "Lab", weight: 4.0, dueDate: "2026-10-22", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "SDN Control Plane & Network Controllers" },
      { id: "csn305-test2", name: "Test 2", category: "Test", weight: 15.0, dueDate: "2026-10-22", week: 7, status: "Not Started", score: null, maxScore: 100, topic: "Weeks 4–6: SDN Architecture, OpenFlow & Control Plane" },
      { id: "csn305-lab7", name: "Lab 7", category: "Lab", weight: 4.0, dueDate: "2026-11-12", week: 9, status: "Not Started", score: null, maxScore: 100, topic: "SDN Application Plane & Custom Flow Control" },
      { id: "csn305-lab8", name: "Lab 8", category: "Lab", weight: 4.0, dueDate: "2026-11-19", week: 10, status: "Not Started", score: null, maxScore: 100, topic: "Application Use Cases & Policy-Driven Data Flows" },
      { id: "csn305-test3", name: "Test 3", category: "Test", weight: 15.0, dueDate: "2026-11-19", week: 10, status: "Not Started", score: null, maxScore: 100, topic: "Weeks 7–9: Data Plane Hardware, Applications & Use Cases" },
      { id: "csn305-lab9", name: "Lab 9", category: "Lab", weight: 4.0, dueDate: "2026-12-03", week: 12, status: "Not Started", score: null, maxScore: 100, topic: "Traffic Monitoring & Network Visibility" },
      { id: "csn305-lab10", name: "Lab 10", category: "Lab", weight: 4.0, dueDate: "2026-12-10", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "SDN Security & Quality of Experience (QoE)" },
      { id: "csn305-test4", name: "Test 4", category: "Test", weight: 15.0, dueDate: "2026-12-10", week: 13, status: "Not Started", score: null, maxScore: 100, topic: "Comprehensive Final Test: All Chapters & SDN Security" }
    ],
    notes: "Thursday in-person block 12:35 PM – 4:10 PM in K1270. Requires 500GB SSD. Pass condition: >=50% overall, >=50% weighted on tests (60%), and >=50% on every lab report."
  }
];
