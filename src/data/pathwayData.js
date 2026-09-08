/**
 * Seneca Polytechnic Computer Systems Technology (CTY)
 * Degree Progression, Prerequisite Graph & Industry Certification Data
 */

export const CTY_PROGRAM_CONFIG = {
  programCode: "CTY",
  programName: "Computer Systems Technology",
  credential: "Ontario College Advanced Diploma (3 Years / 6 Semesters)",
  totalCredits: 36.0,
  coopOption: "Co-operative Education (CTY331 / CTY431)",
  faculty: "Faculty of Applied Science & Engineering Technology (FASET)",
  campus: "Newnham Campus, Toronto",
  coopGpaThreshold: 3.00,
  distinctionGpaThreshold: 4.00,
  honoursGpaThreshold: 3.60
};

export const CTY_SEMESTERS = [
  {
    semester: 1,
    term: "Semester 1",
    status: "Completed",
    totalCredits: 5.0,
    courses: [
      { code: "CPR101", name: "Computer Principles for CST", credits: 1.0, grade: "A+" },
      { code: "APC100", name: "Applied Professional Communications", credits: 1.0, grade: "A" },
      { code: "LIN155", name: "Introduction to Linux", credits: 1.0, grade: "A+" },
      { code: "CSN106", name: "Introduction to Networks", credits: 1.0, grade: "A" },
      { code: "IPC144", name: "Introduction to Programming using C", credits: 1.0, grade: "A" }
    ]
  },
  {
    semester: 2,
    term: "Semester 2",
    status: "Completed",
    totalCredits: 5.0,
    courses: [
      { code: "OPS245", name: "Linux OS & Bash Shell Scripting", credits: 1.0, grade: "A+" },
      { code: "CSN205", name: "Routing & Switching Essentials", credits: 1.0, grade: "A" },
      { code: "SEC220", name: "Introduction to Network Security", credits: 1.0, grade: "A+" },
      { code: "MST200", name: "Microsoft Windows Server Administration", credits: 1.0, grade: "A" },
      { code: "NAT101", name: "Astronomy (General Education 1)", credits: 1.0, grade: "A+" }
    ]
  },
  {
    semester: 3,
    term: "Semester 3 (Current)",
    status: "In Progress",
    totalCredits: 6.0,
    highlight: true,
    courses: [
      { 
        code: "OPS345", 
        name: "Linux System Administration", 
        credits: 1.0, 
        prereqFor: "OPS445", 
        unlocks: "Advanced Linux & Python Automation (Sem 4)",
        status: "Active" 
      },
      { 
        code: "MST300", 
        name: "Introduction to Microsoft Cloud Technologies", 
        credits: 1.0, 
        prereqFor: "CSN405", 
        unlocks: "Enterprise Virtualization & Cloud Infrastructure (Sem 4)",
        status: "Active" 
      },
      { 
        code: "DAT330", 
        name: "Introduction to Databases", 
        credits: 1.0, 
        prereqFor: "DAT440", 
        unlocks: "Advanced Database Architecture & DW (Sem 4)",
        status: "Active" 
      },
      { 
        code: "SEC320", 
        name: "Computer Forensics & Incident Response", 
        credits: 1.0, 
        prereqFor: "SEC420", 
        unlocks: "Applied Network Defense & Penetration Testing (Sem 4)",
        status: "Active" 
      },
      { 
        code: "CSN305", 
        name: "Software Defined Networks", 
        credits: 1.0, 
        prereqFor: "CSN405", 
        unlocks: "Enterprise Virtualization & Cloud Infrastructure (Sem 4)",
        status: "Active" 
      },
      { 
        code: "PSY262", 
        name: "Mindfulness for Students (Gen Ed 2)", 
        credits: 1.0, 
        prereqFor: null, 
        unlocks: "Satisfies General Education Breadth Requirement",
        status: "Active" 
      },
      { 
        code: "WTP100", 
        name: "Work Term Preparation", 
        credits: 0.0, 
        prereqFor: "CTY331", 
        unlocks: "Co-op Work Term 1 (Summer 2027 Placement)",
        status: "Active",
        critical: true 
      }
    ]
  },
  {
    semester: 4,
    term: "Semester 4 (Winter 2027)",
    status: "Upcoming",
    totalCredits: 6.0,
    courses: [
      { 
        code: "OPS445", 
        name: "Advanced Linux Administration & Python Automation", 
        credits: 1.0, 
        prereq: "OPS345 (Grade >= 50%)", 
        description: "Enterprise automated configuration with Ansible, Python scripting for sysadmins, LDAP, and Kerberos."
      },
      { 
        code: "DAT440", 
        name: "Advanced Database Administration & Data Warehousing", 
        credits: 1.0, 
        prereq: "DAT330 (Grade >= 50%)", 
        description: "High-availability clustering (AlwaysOn), ETL pipelines, Azure Synapse Analytics, and disaster recovery."
      },
      { 
        code: "SEC420", 
        name: "Applied Network Defense & Penetration Testing", 
        credits: 1.0, 
        prereq: "SEC320 (Grade >= 50%)", 
        description: "Offensive security operations, Metasploit, web app penetration testing, and defensive SIEM rule creation."
      },
      { 
        code: "CSN405", 
        name: "Enterprise Virtualization & Cloud Infrastructure", 
        credits: 1.0, 
        prereq: "MST300 & CSN305", 
        description: "VMware vSphere ESXi enterprise clusters, Terraform infrastructure-as-code, and hybrid cloud networking."
      },
      { 
        code: "EAC594", 
        name: "Business & Technical Report Writing", 
        credits: 1.0, 
        prereq: "APC100", 
        description: "Professional technical proposals, RFP bid responses, and enterprise IT project documentation."
      },
      { 
        code: "GENED3", 
        name: "General Education Option 3", 
        credits: 1.0, 
        prereq: null, 
        description: "Arts & Humanities or Social Sciences elective."
      }
    ]
  },
  {
    semester: "coop1",
    term: "Co-op Work Term 1 (Summer 2027)",
    status: "Future Milestone",
    totalCredits: 3.5,
    isCoop: true,
    courses: [
      { 
        code: "CTY331", 
        name: "Co-operative Education Work Term 1", 
        credits: 3.5, 
        prereq: "WTP100 (SAT) + Cumulative GPA >= 3.00", 
        description: "4-month paid full-time professional IT work placement in cloud administration, junior DevOps, cyber security, or systems analysis." 
      }
    ]
  },
  {
    semester: 5,
    term: "Semester 5 (Fall 2027)",
    status: "Future",
    totalCredits: 6.0,
    courses: [
      { code: "OPS535", name: "High Availability Linux Clusters & Ceph Storage", credits: 1.0, prereq: "OPS445" },
      { code: "SEC520", name: "Cloud Security Architecture & Zero Trust", credits: 1.0, prereq: "SEC420 & MST300" },
      { code: "CSN505", name: "Kubernetes & Microservices Orchestration", credits: 1.0, prereq: "CSN405" },
      { code: "PRJ566", name: "Systems Technology Capstone Project 1", credits: 1.0, prereq: "All Sem 4 core" },
      { code: "CTY-E1", name: "Professional Elective 1", credits: 1.0, prereq: null },
      { code: "GENED4", name: "General Education Option 4", credits: 1.0, prereq: null }
    ]
  },
  {
    semester: 6,
    term: "Semester 6 (Winter 2028)",
    status: "Future",
    totalCredits: 4.5,
    courses: [
      { code: "PRJ666", name: "Systems Technology Capstone Project 2 (Enterprise Deployment)", credits: 1.5, prereq: "PRJ566" },
      { code: "CTY-E2", name: "Professional Elective 2", credits: 1.0, prereq: null },
      { code: "CTY-E3", name: "Professional Elective 3", credits: 1.0, prereq: null },
      { code: "CTY431", name: "Co-op Work Term 2 (Optional 2nd Placement)", credits: 3.5, prereq: "CTY331" }
    ]
  }
];

export const SENECA_COOP_GATES = [
  {
    id: "gpa-gate",
    name: "Cumulative GPA >= 3.00 (B Average)",
    description: "SenecaWorks requires minimum 3.00 CGPA across all completed academic semesters. Scoring below 3.00 revokes co-op eligibility.",
    currentRequirement: "3.00 Minimum",
    targetGoal: "4.00 Distinction",
    category: "Academic Standing"
  },
  {
    id: "wtp-gate",
    name: "WTP100 Completion by October 23, 2026",
    description: "All 14 Work Term Preparation modules and quizzes must be passed with >= 80% to earn the SAT (Satisfactory) grade before Reading Week.",
    currentRequirement: "14 Modules (SAT)",
    targetGoal: "Completed early in Week 5",
    category: "Mandatory Prerequisite"
  },
  {
    id: "credit-gate",
    name: "Zero Outstanding F / DNC in Core Technical Courses",
    description: "Students cannot progress to co-op interviews if any Semester 1, 2, or 3 core technical credit is unfulfilled or unresolved.",
    currentRequirement: "100% Core Pass Rate",
    targetGoal: "All As / A+s",
    category: "Curriculum Clearance"
  },
  {
    id: "enrollment-gate",
    name: "Full-Time Academic Status Maintained",
    description: "Must maintain enrollment in at least 66% of the semester credit course load (minimum 4 courses) throughout Fall 2026.",
    currentRequirement: "Full-time (7 courses active)",
    targetGoal: "Full 7-course completion",
    category: "Institutional Policy"
  }
];

export const INDUSTRY_CERTIFICATIONS = [
  {
    id: "az-900",
    courseId: "mst300",
    courseCode: "MST300",
    certName: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    vendor: "Microsoft",
    level: "Foundational",
    examCode: "AZ-900",
    alignment: "95% syllabus alignment with MST300 Modules 1–6 (cloud concepts, Azure architecture, security & governance).",
    voucherTip: "Seneca students can take the exam for free or heavily discounted by linking Seneca student email on Microsoft Learn.",
    url: "https://learn.microsoft.com/credentials/certifications/azure-fundamentals/"
  },
  {
    id: "az-104",
    courseId: "mst300",
    courseCode: "MST300",
    certName: "Microsoft Certified: Azure Administrator Associate (AZ-104)",
    vendor: "Microsoft",
    level: "Associate",
    examCode: "AZ-104",
    alignment: "Directly mirrors MST300 Projects 1 & 2: ARM templates, Azure Monitor, Key Vault, RBAC, and virtual network security.",
    voucherTip: "50% academic discount voucher available to verified students via Pearson VUE.",
    url: "https://learn.microsoft.com/credentials/certifications/azure-administrator/"
  },
  {
    id: "rhcsa",
    courseId: "ops345",
    courseCode: "OPS345",
    certName: "Red Hat Certified System Administrator (RHCSA)",
    vendor: "Red Hat",
    level: "Professional",
    examCode: "EX200",
    alignment: "Directly matches OPS345: systemd services, BIND9 DNS, Samba network storage, firewalld, containers, and bash automation.",
    voucherTip: "High-value industry gold standard for co-op sysadmin and DevOps roles.",
    url: "https://www.redhat.com/en/services/certification/rhcsa"
  },
  {
    id: "dp-900",
    courseId: "dat330",
    courseCode: "DAT330",
    certName: "Microsoft Certified: Azure Data Fundamentals (DP-900)",
    vendor: "Microsoft",
    level: "Foundational",
    examCode: "DP-900",
    alignment: "Fully covers DAT330 curriculum: relational SQL vs non-relational database workloads, Azure SQL DB, and T-SQL analytics.",
    voucherTip: "Free practice tests available via Microsoft Learn student portal.",
    url: "https://learn.microsoft.com/credentials/certifications/azure-data-fundamentals/"
  },
  {
    id: "sec-plus",
    courseId: "sec320",
    courseCode: "SEC320",
    certName: "CompTIA Security+ (SY0-701)",
    vendor: "CompTIA",
    level: "Industry Standard",
    examCode: "SY0-701",
    alignment: "Covers SEC320 Incident Response lifecycle, FTK Imager evidence handling, Volatility memory analysis, and malware IOCs.",
    voucherTip: "Seneca students qualify for the CompTIA Academic Marketplace (approx. 40% discount on test vouchers).",
    url: "https://www.comptia.org/certifications/security"
  },
  {
    id: "ccna",
    courseId: "csn305",
    courseCode: "CSN305",
    certName: "Cisco Certified Network Associate (CCNA)",
    vendor: "Cisco",
    level: "Associate",
    examCode: "200-301",
    alignment: "Matches CSN305 & CSN205: Network fundamentals, SDN OpenFlow architecture, REST APIs, IP routing, and network automation.",
    voucherTip: "Students who finish Cisco Networking Academy coursework receive up to 60% exam discount vouchers.",
    url: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html"
  }
];
