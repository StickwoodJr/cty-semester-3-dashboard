import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Terminal, Copy, Check, Search, Server, Shield, Database, 
  Cloud, Network, Key, ExternalLink, Sparkles, BookOpen, AlertTriangle
} from 'lucide-react';

export default function LabToolbeltView() {
  const { showToast } = useAcademic();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [senecaUsername, setSenecaUsername] = useState('gstickwood');

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied command to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toolbeltSections = [
    {
      id: 'matrix',
      category: 'matrix',
      courseCode: 'ALL',
      title: 'Seneca Matrix & SSH Server Connection',
      description: 'Quick connect commands for Seneca Polytechnic central Linux Matrix cluster.',
      color: '#ef4444',
      commands: [
        {
          id: 'matrix-ssh',
          name: 'SSH into Seneca Matrix Cluster',
          desc: 'Direct secure shell into matrix.senecapolytechnic.ca',
          code: `ssh ${senecaUsername}@matrix.senecapolytechnic.ca`
        },
        {
          id: 'matrix-sftp',
          name: 'SFTP File Transfer to Matrix',
          desc: 'Transfer files between your local laptop and your Seneca home folder',
          code: `sftp ${senecaUsername}@matrix.senecapolytechnic.ca`
        },
        {
          id: 'matrix-scp-upload',
          name: 'SCP File Upload to Matrix',
          desc: 'Upload a single script or lab directory to Matrix',
          code: `scp ./myscript.sh ${senecaUsername}@matrix.senecapolytechnic.ca:~/`
        },
        {
          id: 'matrix-scp-download',
          name: 'SCP Download from Matrix to Local',
          desc: 'Download your graded lab files from Matrix to your current folder',
          code: `scp ${senecaUsername}@matrix.senecapolytechnic.ca:~/lab1.txt .`
        }
      ]
    },
    {
      id: 'ops345',
      category: 'ops345',
      courseCode: 'OPS345',
      title: 'OPS345: Linux Application Server Administration',
      description: 'Systemd, Apache VirtualHosts, BIND9 DNS, NFS, and Firewalld for CentOS/RHEL.',
      color: '#d97706',
      commands: [
        {
          id: 'ops-systemd',
          name: 'Systemd Service Administration',
          desc: 'Start, enable on boot, and check service status',
          code: `sudo systemctl status httpd\nsudo systemctl enable --now httpd\nsudo systemctl restart httpd`
        },
        {
          id: 'ops-firewall',
          name: 'Firewalld Permanent Port Open',
          desc: 'Open web and DNS ports and reload firewall rules',
          code: `sudo firewall-cmd --permanent --add-service=http\nsudo firewall-cmd --permanent --add-service=https\nsudo firewall-cmd --permanent --add-port=53/udp\nsudo firewall-cmd --reload`
        },
        {
          id: 'ops-apache-vhost',
          name: 'Apache VirtualHost Configuration Template',
          desc: 'Snippet for /etc/httpd/conf.d/vhost.conf',
          code: `<VirtualHost *:80>\n    ServerAdmin ${senecaUsername}@myseneca.ca\n    DocumentRoot "/var/www/html/mysite"\n    ServerName mysite.ops345.seneca\n    ErrorLog "/var/log/httpd/mysite-error.log"\n    CustomLog "/var/log/httpd/mysite-access.log" combined\n</VirtualHost>`
        },
        {
          id: 'ops-selinux',
          name: 'SELinux Restore File Contexts',
          desc: 'Fix permission denied errors after editing web or DNS directories',
          code: `sudo restorecon -Rv /var/www/html\nsudo getsebool -a | grep httpd`
        },
        {
          id: 'ops-nfs',
          name: 'NFS Export Configuration',
          desc: 'Export /shared to your subnet in /etc/exports',
          code: `/shared  192.168.1.0/24(rw,sync,no_root_squash)\n# Apply exports:\nsudo exportfs -arv`
        },
        {
          id: 'ops-dns-check',
          name: 'BIND9 Named Config & Zone Verifier',
          desc: 'Verify syntax before restarting the named service to avoid failing labs',
          code: `sudo named-checkconf /etc/named.conf\nsudo named-checkzone example.com /var/named/example.com.zone`
        },
        {
          id: 'ops-ec2-key',
          name: 'AWS EC2 SSH Key Permissions Fix',
          desc: 'Fix "Permissions 0644 for id_rsa are too open" error',
          code: `chmod 400 ~/Downloads/labsuser.pem\nssh -i ~/Downloads/labsuser.pem ec2-user@<YOUR-EC2-PUBLIC-IP>`
        }
      ]
    },
    {
      id: 'mst300',
      category: 'mst300',
      courseCode: 'MST300',
      title: 'MST300: Microsoft Azure Cloud & PowerShell',
      description: 'Azure CLI and PowerShell Az commands to deploy VMs, VNets, and manage budgets.',
      color: '#a855f7',
      commands: [
        {
          id: 'mst-az-login',
          name: 'Azure CLI Login & Set Subscription',
          desc: 'Authenticate Azure CLI with your Seneca student account',
          code: `az login\naz account list --output table\naz account set --subscription "<YOUR-SENECA-SUBSCRIPTION-ID>"`
        },
        {
          id: 'mst-az-vm-create',
          name: 'Create Ubuntu VM in Resource Group',
          desc: 'Provision standard B1s VM to save student credits',
          code: `az group create --name MST300-Lab1-RG --location canadacentral\naz vm create \\\n  --resource-group MST300-Lab1-RG \\\n  --name MST300-VM1 \\\n  --image Ubuntu2204 \\\n  --size Standard_B1s \\\n  --admin-username azureuser \\\n  --generate-ssh-keys`
        },
        {
          id: 'mst-az-deallocate',
          name: 'CRITICAL: Deallocate VM to Stop Charges!',
          desc: 'Stops compute billing immediately (stopping inside OS does NOT stop billing)',
          code: `az vm deallocate --resource-group MST300-Lab1-RG --name MST300-VM1`
        },
        {
          id: 'mst-az-autoshutdown',
          name: 'Configure Auto-Shutdown at 8:00 PM',
          desc: 'Protects student budget from running overnight accidentally',
          code: `az vm auto-shutdown -g MST300-Lab1-RG -n MST300-VM1 --time 2000`
        },
        {
          id: 'mst-powershell',
          name: 'PowerShell Az Modules Quick Connect',
          desc: 'For MST300 PowerShell scripting labs',
          code: `Connect-AzAccount\nGet-AzResourceGroup | Format-Table -AutoSize\nGet-AzVM -Status | Select-Object Name, ResourceGroupName, PowerState`
        }
      ]
    },
    {
      id: 'dat330',
      category: 'dat330',
      courseCode: 'DAT330',
      title: 'DAT330: Database Administration & SQL One-Liners',
      description: 'Schema constraints, foreign keys, transaction control, and normalization rules.',
      color: '#ef4444',
      commands: [
        {
          id: 'dat-foreign-key',
          name: 'Table with Foreign Key & Cascade Delete',
          desc: 'Standard DDL required for Parul Kantaria lab submissions',
          code: `CREATE TABLE Enrollments (\n    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,\n    student_id INT NOT NULL,\n    course_code VARCHAR(10) NOT NULL,\n    grade DECIMAL(5,2),\n    CONSTRAINT fk_student FOREIGN KEY (student_id)\n        REFERENCES Students(student_id)\n        ON DELETE CASCADE\n);`
        },
        {
          id: 'dat-transactions',
          name: 'ACID Transaction Block with Rollback',
          desc: 'Ensures database consistency in multi-step balance transfers',
          code: `START TRANSACTION;\nUPDATE Accounts SET balance = balance - 100 WHERE account_id = 101;\nUPDATE Accounts SET balance = balance + 100 WHERE account_id = 202;\n-- Verify no negative balances before committing:\nCOMMIT;\n-- Or to abort on error:\n-- ROLLBACK;`
        },
        {
          id: 'dat-normalization',
          name: 'Database Normalization Quick Rules',
          desc: 'Key rules for Parul Kantaria Midterm & Final Exam',
          code: `-- 1NF: Atomic values only (no repeating groups/multi-valued attributes)\n-- 2NF: In 1NF + NO partial functional dependencies (all non-key attributes fully depend on candidate key)\n-- 3NF: In 2NF + NO transitive dependencies (no non-key attribute depends on another non-key attribute)\n-- BCNF: Every determinant is a candidate key!`
        }
      ]
    },
    {
      id: 'sec320',
      category: 'sec320',
      courseCode: 'SEC320',
      title: 'SEC320: Security Incident Response & Forensics',
      description: 'Log analysis, network triage, and forensic artifact hunting.',
      color: '#0284c7',
      commands: [
        {
          id: 'sec-auth-log',
          name: 'Audit SSH Brute Force Attacks',
          desc: 'Extract top attacker IP addresses from failed login logs',
          code: `sudo grep "Failed password" /var/log/secure | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head -n 10`
        },
        {
          id: 'sec-network-triage',
          name: 'Inspect All Active Listening Sockets',
          desc: 'Identify backdoor listeners and unauthorized services',
          code: `sudo ss -tulpn\nsudo lsof -i -P -n | grep LISTEN`
        },
        {
          id: 'sec-suid-audit',
          name: 'Find Suspicious SUID Root Binaries',
          desc: 'Privilege escalation artifact hunt',
          code: `find / -perm -4000 -type f -exec ls -la {} + 2>/dev/null`
        },
        {
          id: 'sec-hash-integrity',
          name: 'Compute File Hashes for Chain of Custody',
          desc: 'Generate SHA256 hashes for evidence preservation',
          code: `sha256sum suspicious_file.bin > evidence_hash.txt`
        }
      ]
    },
    {
      id: 'csn305',
      category: 'csn305',
      courseCode: 'CSN305',
      title: 'CSN305: Software Defined Networking (SDN)',
      description: 'OpenFlow, Mininet topology emulator, and Open vSwitch commands.',
      color: '#22c55e',
      commands: [
        {
          id: 'csn-mininet-topo',
          name: 'Launch Custom Mininet Topology',
          desc: 'Spins up a virtual tree network with remote SDN controller',
          code: `sudo mn --topo=tree,depth=2,fanout=2 --mac --switch=ovsk --controller=remote,ip=127.0.0.1,port=6653`
        },
        {
          id: 'csn-ovs-flows',
          name: 'Dump OpenFlow Switch Flow Table',
          desc: 'Inspect flow table rules pushed by controller',
          code: `sudo ovs-ofctl dump-flows s1 -O OpenFlow13\nsudo ovs-vsctl show`
        }
      ]
    }
  ];

  // Filter sections by category and search term
  const filteredSections = toolbeltSections.map(section => {
    if (activeCategory !== 'all' && section.category !== activeCategory) {
      return null;
    }

    if (!searchTerm.trim()) {
      return section;
    }

    const term = searchTerm.toLowerCase();
    const matchingCommands = section.commands.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.desc.toLowerCase().includes(term) ||
      c.code.toLowerCase().includes(term)
    );

    if (matchingCommands.length > 0 || section.title.toLowerCase().includes(term)) {
      return {
        ...section,
        commands: matchingCommands.length > 0 ? matchingCommands : section.commands
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Technical Command Toolbelt
              </span>
              <span className="text-xs text-slate-400">Seneca CTY Semester 3 Lab Cheat Sheet</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              CTY Lab Toolbelt & Terminal Commands
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant one-click copy terminal commands, config snippets, and troubleshooting commands for your 5 core technical courses.
            </p>
          </div>

          {/* Matrix Username Input */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-400 text-[11px] whitespace-nowrap">Seneca User:</span>
            <input
              type="text"
              value={senecaUsername}
              onChange={(e) => setSenecaUsername(e.target.value)}
              placeholder="Username"
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono w-28 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Filter Pills & Search Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                activeCategory === 'all' 
                  ? 'bg-red-600 text-white shadow' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Courses ({toolbeltSections.length})
            </button>
            {toolbeltSections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveCategory(sec.category)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                  activeCategory === sec.category 
                    ? 'bg-red-600 text-white shadow' 
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sec.courseCode}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search commands, flags, tools..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Commands Sections */}
      <div className="space-y-6">
        {filteredSections.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No technical commands found matching "{searchTerm}".
          </div>
        ) : (
          filteredSections.map(section => (
            <div 
              key={section.id} 
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                      style={{
                        color: section.color,
                        borderColor: `${section.color}40`,
                        backgroundColor: `${section.color}15`
                      }}
                    >
                      {section.courseCode}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    {section.description}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-500 shrink-0">
                  {section.commands.length} snippets
                </span>
              </div>

              {/* Commands Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {section.commands.map(cmd => {
                  const isCopied = copiedId === cmd.id;
                  return (
                    <div 
                      key={cmd.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-slate-200 group-hover:text-white">
                            {cmd.name}
                          </h4>
                          <button
                            onClick={() => handleCopy(cmd.id, cmd.code)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition ${
                              isCopied 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                            }`}
                            title="Copy command to clipboard"
                            aria-label={`Copy snippet for ${cmd.name}`}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                          {cmd.desc}
                        </p>
                      </div>

                      {/* Code Snippet Box */}
                      <div className="relative rounded-lg bg-slate-900/90 border border-slate-800 p-2.5 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                        {cmd.code}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
