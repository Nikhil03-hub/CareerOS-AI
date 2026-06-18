const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;
const STREAMS = [{
  id: "pcm",
  label: "Science — PCM",
  sub: "Physics · Chemistry · Maths",
  color: "#6366F1",
  bg: "#EEF2FF",
  desc: "Engineering, Architecture, Defense, Data Science"
}, {
  id: "pcb",
  label: "Science — PCB",
  sub: "Physics · Chemistry · Biology",
  color: "#10B981",
  bg: "#ECFDF5",
  desc: "Medicine, Pharmacy, Biotech, Nursing"
}, {
  id: "pcmb",
  label: "Science — PCMB",
  sub: "All 4 Science subjects",
  color: "#8B5CF6",
  bg: "#F5F3FF",
  desc: "Flexibility for both Engineering & Medical paths"
}, {
  id: "commerce",
  label: "Commerce",
  sub: "Accounts · Business · Economics",
  color: "#F59E0B",
  bg: "#FFFBEB",
  desc: "CA, MBA, Finance, Banking, Law"
}, {
  id: "arts",
  label: "Arts / Humanities",
  sub: "History · Geography · Pol. Sci.",
  color: "#EC4899",
  bg: "#FDF2F8",
  desc: "UPSC, Law, Journalism, Design, Teaching"
}];
const BOARDS = [{
  id: "cbse",
  name: "CBSE",
  full: "Central Board of Secondary Education"
}, {
  id: "icse",
  name: "ICSE",
  full: "Indian Certificate of Secondary Education"
}, {
  id: "maha",
  name: "Maharashtra (HSC)",
  full: "Maharashtra State Board"
}, {
  id: "up",
  name: "UP Board",
  full: "Uttar Pradesh Madhyamik Shiksha Parishad"
}, {
  id: "tn",
  name: "Tamil Nadu",
  full: "Tamil Nadu State Board"
}, {
  id: "kar",
  name: "Karnataka",
  full: "Karnataka Secondary Education Board"
}, {
  id: "ap",
  name: "Andhra Pradesh",
  full: "Board of Intermediate Education AP"
}, {
  id: "ts",
  name: "Telangana",
  full: "Board of Intermediate Education TS"
}, {
  id: "wb",
  name: "West Bengal",
  full: "West Bengal Council of Higher Secondary Education"
}, {
  id: "other",
  name: "Other Board",
  full: "Any other state / international board"
}];
const BUDGETS = [{
  id: "u1L",
  label: "Under ₹1 Lakh / yr",
  sub: "Government colleges, scholarships",
  color: "#10B981"
}, {
  id: "1to5L",
  label: "₹1 – 5 Lakh / yr",
  sub: "State private + aided colleges",
  color: "#6366F1"
}, {
  id: "5to10L",
  label: "₹5 – 10 Lakh / yr",
  sub: "Good private colleges, NITs",
  color: "#F59E0B"
}, {
  id: "above10L",
  label: "Above ₹10 Lakh / yr",
  sub: "Top private, deemed universities",
  color: "#EF4444"
}];
const GOALS = [{
  id: "engineering",
  label: "Engineering / Technology",
  streams: ["pcm", "pcmb"]
}, {
  id: "medical",
  label: "Medical / Healthcare",
  streams: ["pcb", "pcmb"]
}, {
  id: "law",
  label: "Law / LLB",
  streams: ["pcm", "pcb", "pcmb", "commerce", "arts"]
}, {
  id: "management",
  label: "Business / Management",
  streams: ["commerce", "pcm", "pcmb", "arts"]
}, {
  id: "design",
  label: "Design / Architecture",
  streams: ["pcm", "pcmb", "arts"]
}, {
  id: "civil_services",
  label: "Civil Services / UPSC",
  streams: ["pcm", "pcb", "pcmb", "commerce", "arts"]
}, {
  id: "ca",
  label: "CA / Finance / Accounts",
  streams: ["commerce"]
}, {
  id: "defence",
  label: "Defence Services (NDA/CDS)",
  streams: ["pcm", "pcmb"]
}, {
  id: "bsc",
  label: "BSc / Research / Academia",
  streams: ["pcm", "pcb", "pcmb"]
}, {
  id: "journalism",
  label: "Journalism / Mass Comm.",
  streams: ["arts", "commerce"]
}];
const EXAMS = [{
  id: "jee_main",
  name: "JEE Main",
  full: "Joint Entrance Examination (Main)",
  cat: "Engineering",
  streams: ["pcm", "pcmb"],
  level: "National",
  conducting: "NTA",
  sessions: "Jan & Apr",
  attempts: "6 (3 yrs × 2)",
  seats: "1,08,882",
  color: "#6366F1",
  difficulty: 4,
  eligibility: "PCM in 12th · Min 75% (65% SC/ST/PwD) · No age limit",
  pattern: {
    duration: "3 hrs",
    totalQ: 90,
    totalMarks: 300,
    sections: [{
      name: "Physics",
      q: 30,
      m: 100
    }, {
      name: "Chemistry",
      q: 30,
      m: 100
    }, {
      name: "Maths",
      q: 30,
      m: 100
    }],
    marking: "+4 correct / −1 wrong (MCQ); +4 / no negative (Integer)"
  },
  cutoff: {
    2024: {
      general: 90.7,
      obc: 78.5,
      sc: 54.2,
      st: 44.1,
      ews: 84.2
    },
    2023: {
      general: 90.7,
      obc: 77.5,
      sc: 51.9,
      st: 37.2
    },
    2022: {
      general: 88.4,
      obc: 74.6,
      sc: 46.9,
      st: 34.7
    }
  },
  dates: {
    reg: "Oct–Nov (Jan) / Feb–Mar (Apr)",
    exam: "Jan & Apr",
    result: "Feb / May"
  },
  topColleges: ["NIT Trichy", "NIT Warangal", "NIT Surathkal", "IIIT Hyderabad", "DTU Delhi", "NSIT Delhi"],
  prepTime: "12–18 months",
  avgSalary: "₹6–25 LPA",
  officialSite: "https://jeemain.nta.ac.in"
}, {
  id: "jee_adv",
  name: "JEE Advanced",
  full: "Joint Entrance Examination (Advanced)",
  cat: "Engineering",
  streams: ["pcm", "pcmb"],
  level: "National",
  conducting: "IIT (rotation)",
  sessions: "Once/year (Jun)",
  attempts: "2",
  seats: "17,385",
  color: "#4F46E5",
  difficulty: 5,
  eligibility: "Top 2.5 lakh JEE Main qualifiers · Max 2 attempts · Born after Oct 1, 2000",
  pattern: {
    duration: "6 hrs (2 papers × 3 hrs)",
    totalQ: "54 (27/paper)",
    totalMarks: 360,
    sections: [{
      name: "Physics",
      q: 18,
      m: 60
    }, {
      name: "Chemistry",
      q: 18,
      m: 60
    }, {
      name: "Maths",
      q: 18,
      m: 60
    }],
    marking: "Varies: +3/−1, +4/0, Partial marking"
  },
  cutoff: {
    2024: {
      general: 109,
      obc: 98,
      sc: 60,
      st: 55
    },
    2023: {
      general: 90,
      obc: 78,
      sc: 40,
      st: 40
    }
  },
  dates: {
    reg: "May",
    exam: "Jun",
    result: "Jun"
  },
  topColleges: ["IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur", "IIT Roorkee"],
  prepTime: "2 years",
  avgSalary: "₹15–60 LPA",
  officialSite: "https://jeeadv.ac.in"
}, {
  id: "neet",
  name: "NEET UG",
  full: "National Eligibility cum Entrance Test",
  cat: "Medical",
  streams: ["pcb", "pcmb"],
  level: "National",
  conducting: "NTA",
  sessions: "Once/year (May)",
  attempts: "Unlimited (till 25 yrs)",
  seats: "1,08,000+ MBBS",
  color: "#10B981",
  difficulty: 4,
  eligibility: "PCB in 12th · Min 50% (40% SC/ST) · Age 17–25 years",
  pattern: {
    duration: "3 hrs 20 min",
    totalQ: 200,
    totalMarks: 720,
    sections: [{
      name: "Physics",
      q: 50,
      m: 180
    }, {
      name: "Chemistry",
      q: 50,
      m: 180
    }, {
      name: "Biology",
      q: 100,
      m: 360
    }],
    marking: "+4 correct / −1 wrong"
  },
  cutoff: {
    2024: {
      general: 720,
      gcMin: 164,
      obc: 164,
      sc: 129,
      st: 129
    },
    2023: {
      general: 715,
      gcMin: 117,
      obc: 117
    }
  },
  dates: {
    reg: "Feb–Mar",
    exam: "May",
    result: "Jun"
  },
  topColleges: ["AIIMS Delhi", "AIIMS Jodhpur", "JIPMER", "MAMC Delhi", "GMC Mumbai"],
  prepTime: "12–18 months",
  avgSalary: "₹8–50 LPA",
  officialSite: "https://neet.nta.nic.in"
}, {
  id: "bitsat",
  name: "BITSAT",
  full: "BITS Admission Test",
  cat: "Engineering",
  streams: ["pcm", "pcmb"],
  level: "Institute",
  conducting: "BITS Pilani",
  sessions: "May–Jun",
  attempts: "1/year",
  seats: "2,100",
  color: "#8B5CF6",
  difficulty: 4,
  eligibility: "PCM in 12th · Min 75% · English compulsory",
  pattern: {
    duration: "3 hrs",
    totalQ: 130,
    totalMarks: 390,
    sections: [{
      name: "Physics",
      q: 40,
      m: 120
    }, {
      name: "Chemistry",
      q: 40,
      m: 120
    }, {
      name: "Maths",
      q: 45,
      m: 135
    }, {
      name: "English+LR",
      q: 25,
      m: 75
    }],
    marking: "+3 correct / −1 wrong"
  },
  cutoff: {
    2024: {
      pilani: 355,
      goa: 345,
      hyderabad: 325
    },
    2023: {
      pilani: 360,
      goa: 350,
      hyderabad: 330
    }
  },
  dates: {
    reg: "Jan–Apr",
    exam: "May–Jun",
    result: "Jun"
  },
  topColleges: ["BITS Pilani", "BITS Goa", "BITS Hyderabad"],
  prepTime: "12 months",
  avgSalary: "₹10–40 LPA",
  officialSite: "https://www.bitsadmission.com"
}, {
  id: "mht_cet",
  name: "MHT CET",
  full: "Maharashtra Common Entrance Test",
  cat: "Engineering",
  streams: ["pcm", "pcb", "pcmb"],
  level: "State",
  conducting: "State CET Cell, Maharashtra",
  sessions: "Apr–May",
  attempts: "No limit",
  seats: "3,00,000+",
  color: "#F59E0B",
  difficulty: 3,
  eligibility: "PCM/PCB in 12th from Maharashtra board · Min 50% (45% SC/ST)",
  pattern: {
    duration: "3 hrs (PCM)",
    totalQ: 150,
    totalMarks: 200,
    sections: [{
      name: "Physics",
      q: 50,
      m: 100
    }, {
      name: "Chemistry",
      q: 50,
      m: 100
    }, {
      name: "Maths",
      q: 50,
      m: 100
    }],
    marking: "+2 correct / 0 wrong (PCM); +1 for Bio/Phy/Chem"
  },
  cutoff: {
    2024: {
      top: 99.9,
      mid: 85,
      lower: 65
    }
  },
  dates: {
    reg: "Jan–Mar",
    exam: "Apr–May",
    result: "Jun"
  },
  topColleges: ["COEP Pune", "VJTI Mumbai", "SPCE Mumbai", "ICT Mumbai"],
  prepTime: "6–12 months",
  avgSalary: "₹4–15 LPA",
  officialSite: "https://cetcell.mahacet.org"
}, {
  id: "clat",
  name: "CLAT",
  full: "Common Law Admission Test",
  cat: "Law",
  streams: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  level: "National",
  conducting: "Consortium of NLUs",
  sessions: "Dec",
  attempts: "No limit",
  seats: "2,500+",
  color: "#DC2626",
  difficulty: 3,
  eligibility: "Any stream 12th · Min 45% (40% SC/ST) · Age: No limit for UG",
  pattern: {
    duration: "2 hrs",
    totalQ: 120,
    totalMarks: 120,
    sections: [{
      name: "English",
      q: 28,
      m: 28
    }, {
      name: "Current Affairs & GK",
      q: 35,
      m: 35
    }, {
      name: "Legal Reasoning",
      q: 35,
      m: 35
    }, {
      name: "Logical Reasoning",
      q: 12,
      m: 12
    }, {
      name: "Quantitative Techniques",
      q: 10,
      m: 10
    }],
    marking: "+1 correct / −0.25 wrong"
  },
  cutoff: {
    2024: {
      nlsiu: 83,
      nalsar: 74,
      nlud: 77,
      nluj: 69
    },
    2023: {
      nlsiu: 80,
      nalsar: 72
    }
  },
  dates: {
    reg: "Aug–Nov",
    exam: "Dec",
    result: "Jan"
  },
  topColleges: ["NLSIU Bangalore", "NALSAR Hyderabad", "NLU Delhi", "NLU Jodhpur", "GNLU Gandhinagar"],
  prepTime: "6–12 months",
  avgSalary: "₹6–20 LPA",
  officialSite: "https://consortiumofnlus.ac.in"
}, {
  id: "nda",
  name: "NDA",
  full: "National Defence Academy",
  cat: "Defence",
  streams: ["pcm", "pcmb"],
  level: "National",
  conducting: "UPSC",
  sessions: "Apr & Sep",
  attempts: "Max 2 (till 19.5 yrs)",
  seats: "370",
  color: "#065F46",
  difficulty: 4,
  eligibility: "PCM in 12th · Age 16.5–19.5 years · Unmarried male",
  pattern: {
    duration: "5 hrs (2 papers)",
    totalQ: 270,
    totalMarks: 900,
    sections: [{
      name: "Maths",
      q: 120,
      m: 300
    }, {
      name: "GAT (English+GK+Science)",
      q: 150,
      m: 600
    }],
    marking: "+2.5 Maths/+4 GAT correct; −0.83/−1.33 wrong"
  },
  cutoff: {
    2024: {
      general: 342,
      obc: 342,
      sc: 288
    },
    2023: {
      general: 360
    }
  },
  dates: {
    reg: "Dec–Jan (Apr exam) / May–Jun (Sep exam)",
    exam: "Apr & Sep",
    result: "3 months after SSB"
  },
  topColleges: ["National Defence Academy, Pune → IMA/INA/AFA"],
  prepTime: "12–24 months",
  avgSalary: "₹56,000–₹2,50,000/month (govt scale)",
  officialSite: "https://upsc.gov.in"
}, {
  id: "nift",
  name: "NIFT",
  full: "National Institute of Fashion Technology",
  cat: "Design",
  streams: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  level: "National",
  conducting: "NIFT/NTA",
  sessions: "Feb",
  attempts: "No limit",
  seats: "3,700+",
  color: "#DB2777",
  difficulty: 3,
  eligibility: "Any stream 12th · Min 50% · Age below 23 (Gen)/28 (SC/ST/PwD) · CAT + GAT + Situation Test",
  pattern: {
    duration: "3 hrs 30 min",
    totalQ: 200,
    totalMarks: 200,
    sections: [{
      name: "CAT (Creative Ability Test)",
      q: 50,
      m: 50,
      note: "Drawing/Sketching"
    }, {
      name: "GAT (General Ability Test)",
      q: 150,
      m: 150,
      note: "MCQ"
    }],
    marking: "+1 correct / −0.25 wrong (GAT)"
  },
  cutoff: {
    2024: {
      delhi: 850,
      mumbai: 820,
      bangalore: 800
    }
  },
  dates: {
    reg: "Oct–Dec",
    exam: "Feb",
    result: "Apr"
  },
  topColleges: ["NIFT Delhi", "NIFT Mumbai", "NIFT Bangalore", "NIFT Chennai"],
  prepTime: "6–12 months",
  avgSalary: "₹4–15 LPA",
  officialSite: "https://nift.ac.in"
}, {
  id: "nid",
  name: "NID DAT",
  full: "National Institute of Design — Design Aptitude Test",
  cat: "Design",
  streams: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  level: "National",
  conducting: "NID",
  sessions: "Jan (Prelim) + Mar (Mains)",
  attempts: "No limit",
  seats: "250+",
  color: "#7C3AED",
  difficulty: 4,
  eligibility: "Any stream 12th · No minimum marks specified · Aptitude for design",
  pattern: {
    duration: "3 hrs",
    totalQ: "Subjective + Objective",
    totalMarks: 100,
    sections: [{
      name: "Design Aptitude",
      q: "-",
      m: 100,
      note: "Drawing, observation, creativity test"
    }],
    marking: "Subjective evaluation"
  },
  cutoff: {
    2024: {
      prelim: 40,
      mains: "Portfolio review"
    }
  },
  dates: {
    reg: "Oct–Nov",
    exam: "Jan + Mar",
    result: "May"
  },
  topColleges: ["NID Ahmedabad", "NID Bangalore", "NID Delhi"],
  prepTime: "6–12 months",
  avgSalary: "₹5–20 LPA",
  officialSite: "https://admissions.nid.edu"
}, {
  id: "cuet",
  name: "CUET UG",
  full: "Common University Entrance Test",
  cat: "General UG",
  streams: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  level: "National",
  conducting: "NTA",
  sessions: "May–Jun",
  attempts: "No limit",
  seats: "2,00,000+",
  color: "#0EA5E9",
  difficulty: 3,
  eligibility: "Any stream 12th · No minimum marks for most universities · Age as per university norms",
  pattern: {
    duration: "Varies by paper selection",
    totalQ: "50 per subject",
    totalMarks: "200 per subject",
    sections: [{
      name: "Domain Subject",
      q: 40,
      m: 200
    }, {
      name: "General Test",
      q: 60,
      m: 300,
      note: "Optional"
    }],
    marking: "+5 correct / −1 wrong"
  },
  cutoff: {
    2024: {
      du: 1000,
      bhu: 900,
      jnu: 850
    }
  },
  dates: {
    reg: "Feb–Mar",
    exam: "May–Jun",
    result: "Jul"
  },
  topColleges: ["Delhi University", "BHU Varanasi", "JNU Delhi", "Hyderabad Central University"],
  prepTime: "4–8 months",
  avgSalary: "Varies by course",
  officialSite: "https://cuet.samarth.ac.in"
}, {
  id: "ipmat",
  name: "IPMAT",
  full: "Integrated Programme in Management Aptitude Test",
  cat: "Management",
  streams: ["commerce", "pcm", "pcmb", "arts"],
  level: "Institute",
  conducting: "IIM (Indore/Rohtak/Jammu/Ranchi/Bodh Gaya)",
  sessions: "May–Jun",
  attempts: "Till 20 yrs",
  seats: "150+ per IIM",
  color: "#B45309",
  difficulty: 4,
  eligibility: "Any stream 12th · Min 60% (55% SC/ST) · Age below 20 years",
  pattern: {
    duration: "2 hrs",
    totalQ: 100,
    totalMarks: 400,
    sections: [{
      name: "Quantitative Ability (MCQ)",
      q: 30,
      m: 120
    }, {
      name: "Quantitative Ability (SA)",
      q: 15,
      m: 45
    }, {
      name: "Verbal Ability",
      q: 45,
      m: 180
    }],
    marking: "+4 correct / −1 wrong (MCQ)"
  },
  cutoff: {
    2024: {
      indore: 188,
      rohtak: 160
    },
    2023: {
      indore: 182
    }
  },
  dates: {
    reg: "Jan–Apr",
    exam: "May",
    result: "Jun"
  },
  topColleges: ["IIM Indore", "IIM Rohtak", "IIM Jammu", "IIM Ranchi"],
  prepTime: "8–12 months",
  avgSalary: "₹15–40 LPA",
  officialSite: "https://www.iimidr.ac.in"
}, {
  id: "ca_found",
  name: "CA Foundation",
  full: "Chartered Accountancy Foundation",
  cat: "Finance",
  streams: ["commerce", "pcm", "arts"],
  level: "National",
  conducting: "ICAI",
  sessions: "Jun & Dec",
  attempts: "No limit",
  seats: "Unlimited",
  color: "#0F766E",
  difficulty: 3,
  eligibility: "Commerce 12th preferred · Any stream eligible · Min 55% in 12th for direct entry",
  pattern: {
    duration: "8 hrs (4 papers)",
    totalQ: 300,
    totalMarks: 400,
    sections: [{
      name: "Principles of Accounting",
      q: 100,
      m: 100
    }, {
      name: "Business Laws",
      q: 100,
      m: 100
    }, {
      name: "Quantitative Aptitude",
      q: 100,
      m: 100
    }, {
      name: "Business Economics",
      q: "-",
      m: 100
    }],
    marking: "Mix of MCQ and subjective; 35% pass per paper, 50% overall"
  },
  cutoff: {
    2024: {
      passPercent: 25
    }
  },
  dates: {
    reg: "Jan (Jun exam) / Jul (Dec exam)",
    exam: "Jun & Dec",
    result: "Aug & Feb"
  },
  topColleges: ["CA Final → Big 4 firms, Investment Banks"],
  prepTime: "6–12 months",
  avgSalary: "₹7–25 LPA (post CA)",
  officialSite: "https://icai.org"
}, {
  id: "nata",
  name: "NATA",
  full: "National Aptitude Test in Architecture",
  cat: "Architecture",
  streams: ["pcm", "pcmb"],
  level: "National",
  conducting: "COA",
  sessions: "Apr & Jun",
  attempts: "2/year",
  seats: "40,000+",
  color: "#92400E",
  difficulty: 3,
  eligibility: "PCM 12th · Min 50% aggregate · Maths compulsory",
  pattern: {
    duration: "3 hrs",
    totalQ: 125,
    totalMarks: 200,
    sections: [{
      name: "Drawing Test",
      q: 2,
      m: 40
    }, {
      name: "PCM+General Aptitude",
      q: 123,
      m: 160,
      note: "MCQ"
    }],
    marking: "+1.3 (MCQ) / subjective (Drawing)"
  },
  cutoff: {
    2024: {
      top: 130,
      mid: 110
    }
  },
  dates: {
    reg: "Feb–Mar",
    exam: "Apr & Jun",
    result: "2 weeks after"
  },
  topColleges: ["CEPT Ahmedabad", "SPA Delhi", "BNCA Pune", "Rizvi Mumbai"],
  prepTime: "6–12 months",
  avgSalary: "₹4–15 LPA",
  officialSite: "https://nata.in"
}, {
  id: "kcet",
  name: "KCET",
  full: "Karnataka Common Entrance Test",
  cat: "Engineering/Medical",
  streams: ["pcm", "pcb", "pcmb"],
  level: "State",
  conducting: "KEA Karnataka",
  sessions: "Apr",
  attempts: "No limit",
  seats: "60,000+",
  color: "#DC2626",
  difficulty: 3,
  eligibility: "PCM/PCB Karnataka domicile · Min 45% (40% SC/ST) · 12th from Karnataka",
  pattern: {
    duration: "2 hrs per paper",
    totalQ: 60,
    totalMarks: 60,
    sections: [{
      name: "Physics",
      q: 60,
      m: 60
    }, {
      name: "Chemistry",
      q: 60,
      m: 60
    }, {
      name: "Maths/Biology",
      q: 60,
      m: 60
    }],
    marking: "+1 correct / 0 wrong"
  },
  cutoff: {
    2024: {
      top: 170,
      mid: 140,
      lower: 120
    }
  },
  dates: {
    reg: "Jan–Mar",
    exam: "Apr",
    result: "May"
  },
  topColleges: ["RV College Bangalore", "BMS College Bangalore", "MSRIT Bangalore", "PES University"],
  prepTime: "6–12 months",
  avgSalary: "₹4–12 LPA",
  officialSite: "https://kea.kar.nic.in"
}, {
  id: "wbjee",
  name: "WBJEE",
  full: "West Bengal Joint Entrance Examination",
  cat: "Engineering",
  streams: ["pcm", "pcmb"],
  level: "State",
  conducting: "WBJEEB",
  sessions: "Apr",
  attempts: "No limit",
  seats: "40,000+",
  color: "#1D4ED8",
  difficulty: 3,
  eligibility: "PCM 12th · Min 45% in PCM · WB domicile preferred",
  pattern: {
    duration: "4 hrs (2 papers)",
    totalQ: 155,
    totalMarks: 200,
    sections: [{
      name: "Mathematics",
      q: 75,
      m: 100
    }, {
      name: "Physics",
      q: 40,
      m: 50
    }, {
      name: "Chemistry",
      q: 40,
      m: 50
    }],
    marking: "+1/+2 correct; −1/3 or −1/2 wrong"
  },
  cutoff: {
    2024: {
      top: 150,
      mid: 110
    }
  },
  dates: {
    reg: "Dec–Jan",
    exam: "Apr",
    result: "Jun"
  },
  topColleges: ["Jadavpur University", "IIEST Shibpur", "NIT Durgapur", "MAKAUT colleges"],
  prepTime: "8–12 months",
  avgSalary: "₹4–12 LPA",
  officialSite: "https://wbjeeb.nic.in"
}, {
  id: "viteee",
  name: "VITEEE",
  full: "VIT Engineering Entrance Examination",
  cat: "Engineering",
  streams: ["pcm", "pcmb"],
  level: "Institute",
  conducting: "VIT University",
  sessions: "Apr",
  attempts: "Till 20 yrs",
  seats: "7,500+",
  color: "#7C3AED",
  difficulty: 3,
  eligibility: "PCM 12th · Min 60% in PCM · Age below 20 years",
  pattern: {
    duration: "2 hrs 30 min",
    totalQ: 125,
    totalMarks: 125,
    sections: [{
      name: "Physics",
      q: 35,
      m: 35
    }, {
      name: "Chemistry",
      q: 35,
      m: 35
    }, {
      name: "Maths/Biology",
      q: 40,
      m: 40
    }, {
      name: "English",
      q: 5,
      m: 5
    }, {
      name: "Aptitude",
      q: 10,
      m: 10
    }],
    marking: "+1 correct / 0 wrong"
  },
  cutoff: {
    2024: {
      top: 5000,
      mid: 50000
    }
  },
  dates: {
    reg: "Nov–Mar",
    exam: "Apr",
    result: "May"
  },
  topColleges: ["VIT Vellore", "VIT Chennai", "VIT Bhopal", "VIT-AP"],
  prepTime: "6–12 months",
  avgSalary: "₹5–18 LPA",
  officialSite: "https://vit.ac.in"
}, {
  id: "ailet",
  name: "AILET",
  full: "All India Law Entrance Test",
  cat: "Law",
  streams: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  level: "Institute",
  conducting: "NLU Delhi",
  sessions: "Dec",
  attempts: "No limit",
  seats: "110",
  color: "#B91C1C",
  difficulty: 4,
  eligibility: "Any stream 12th · Min 50% (45% SC/ST) · Age below 20 (23 SC/ST)",
  pattern: {
    duration: "1 hr 30 min",
    totalQ: 150,
    totalMarks: 150,
    sections: [{
      name: "English",
      q: 35,
      m: 35
    }, {
      name: "Current Affairs & GK",
      q: 35,
      m: 35
    }, {
      name: "Legal Reasoning",
      q: 35,
      m: 35
    }, {
      name: "Reasoning",
      q: 35,
      m: 35
    }, {
      name: "Maths",
      q: 10,
      m: 10
    }],
    marking: "+1 correct / −0.25 wrong"
  },
  cutoff: {
    2024: {
      general: 115,
      obc: 100,
      sc: 90
    }
  },
  dates: {
    reg: "Oct–Nov",
    exam: "Dec",
    result: "Jan"
  },
  topColleges: ["NLU Delhi (Sole admission through AILET)"],
  prepTime: "6–12 months",
  avgSalary: "₹8–25 LPA",
  officialSite: "https://nationallawuniversitydelhi.in"
}];
const COLLEGES = [{
  id: "iitb",
  name: "IIT Bombay",
  location: "Mumbai, MH",
  type: "Govt",
  exam: "jee_adv",
  rank: "IIT #3",
  cutoff: {
    general: 670,
    obc: 610,
    sc: 530
  },
  fees: "₹2.2L/yr",
  placements: "₹22 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 5
}, {
  id: "iitd",
  name: "IIT Delhi",
  location: "New Delhi",
  type: "Govt",
  exam: "jee_adv",
  rank: "IIT #1",
  cutoff: {
    general: 660,
    obc: 600,
    sc: 520
  },
  fees: "₹2.3L/yr",
  placements: "₹24 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 5
}, {
  id: "iitm",
  name: "IIT Madras",
  location: "Chennai, TN",
  type: "Govt",
  exam: "jee_adv",
  rank: "IIT #2",
  cutoff: {
    general: 650,
    obc: 590,
    sc: 510
  },
  fees: "₹2.1L/yr",
  placements: "₹21 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 5
}, {
  id: "nittr",
  name: "NIT Trichy",
  location: "Trichy, TN",
  type: "Govt",
  exam: "jee_main",
  rank: "NIT #1",
  cutoff: {
    general: 97.5,
    obc: 94,
    sc: 88
  },
  fees: "₹1.6L/yr",
  placements: "₹10 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 4
}, {
  id: "nitwg",
  name: "NIT Warangal",
  location: "Warangal, TS",
  type: "Govt",
  exam: "jee_main",
  rank: "NIT #2",
  cutoff: {
    general: 97,
    obc: 93,
    sc: 86
  },
  fees: "₹1.5L/yr",
  placements: "₹9 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 4
}, {
  id: "nitsur",
  name: "NIT Surathkal",
  location: "Mangalore, KA",
  type: "Govt",
  exam: "jee_main",
  rank: "NIT #3",
  cutoff: {
    general: 96.5,
    obc: 92,
    sc: 84
  },
  fees: "₹1.5L/yr",
  placements: "₹9 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 4
}, {
  id: "iiith",
  name: "IIIT Hyderabad",
  location: "Hyderabad, TS",
  type: "Govt-Aided",
  exam: "jee_main",
  rank: "IIIT #1",
  cutoff: {
    general: 95,
    obc: 90,
    sc: 80
  },
  fees: "₹2.1L/yr",
  placements: "₹18 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 4
}, {
  id: "dtu",
  name: "DTU Delhi",
  location: "New Delhi",
  type: "State Govt",
  exam: "jee_main",
  rank: "State #1",
  cutoff: {
    general: 94,
    obc: 88,
    sc: 78
  },
  fees: "₹1.6L/yr",
  placements: "₹9 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 4
}, {
  id: "bitsp",
  name: "BITS Pilani",
  location: "Pilani, RJ",
  type: "Deemed",
  exam: "bitsat",
  rank: "Private #1",
  cutoff: {
    general: 355,
    obc: 355,
    sc: 355
  },
  fees: "₹5.4L/yr",
  placements: "₹18 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 5
}, {
  id: "coep",
  name: "COEP Pune",
  location: "Pune, MH",
  type: "State Govt",
  exam: "mht_cet",
  rank: "MH #1",
  cutoff: {
    general: 99.9,
    obc: 99.5,
    sc: 98
  },
  fees: "₹1.2L/yr",
  placements: "₹7 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 4
}, {
  id: "vjti",
  name: "VJTI Mumbai",
  location: "Mumbai, MH",
  type: "State Govt",
  exam: "mht_cet",
  rank: "MH #2",
  cutoff: {
    general: 99.8,
    obc: 99.3,
    sc: 97
  },
  fees: "₹0.9L/yr",
  placements: "₹7 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 4
}, {
  id: "vitv",
  name: "VIT Vellore",
  location: "Vellore, TN",
  type: "Deemed",
  exam: "viteee",
  rank: "Private #5",
  cutoff: {
    general: 5000,
    obc: 5000,
    sc: 5000
  },
  fees: "₹2.1L/yr",
  placements: "₹7 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Engineering",
  stars: 3
}, {
  id: "aiimsd",
  name: "AIIMS Delhi",
  location: "New Delhi",
  type: "Govt",
  exam: "neet",
  rank: "Medical #1",
  cutoff: {
    general: 715,
    obc: 715,
    sc: 680
  },
  fees: "₹0.1L/yr",
  placements: "₹12+ LPA (PG)",
  stream: ["pcb", "pcmb"],
  cat: "Medical",
  stars: 5
}, {
  id: "aiimsjd",
  name: "AIIMS Jodhpur",
  location: "Jodhpur, RJ",
  type: "Govt",
  exam: "neet",
  rank: "Medical #4",
  cutoff: {
    general: 690,
    obc: 680,
    sc: 650
  },
  fees: "₹0.1L/yr",
  placements: "₹12+ LPA",
  stream: ["pcb", "pcmb"],
  cat: "Medical",
  stars: 4
}, {
  id: "jipmer",
  name: "JIPMER Puducherry",
  location: "Puducherry",
  type: "Govt",
  exam: "neet",
  rank: "Medical #3",
  cutoff: {
    general: 695,
    obc: 685,
    sc: 660
  },
  fees: "₹0.1L/yr",
  placements: "₹12+ LPA",
  stream: ["pcb", "pcmb"],
  cat: "Medical",
  stars: 4
}, {
  id: "mamc",
  name: "MAMC Delhi",
  location: "New Delhi",
  type: "State Govt",
  exam: "neet",
  rank: "State Med #1",
  cutoff: {
    general: 680,
    obc: 670,
    sc: 640
  },
  fees: "₹0.3L/yr",
  placements: "₹10 LPA",
  stream: ["pcb", "pcmb"],
  cat: "Medical",
  stars: 4
}, {
  id: "kmc",
  name: "KMC Manipal",
  location: "Udupi, KA",
  type: "Private",
  exam: "neet",
  rank: "Private Med #1",
  cutoff: {
    general: 600,
    obc: 580,
    sc: 550
  },
  fees: "₹24L/yr",
  placements: "₹8 LPA",
  stream: ["pcb", "pcmb"],
  cat: "Medical",
  stars: 3
}, {
  id: "nlsiu",
  name: "NLSIU Bangalore",
  location: "Bangalore, KA",
  type: "Govt",
  exam: "clat",
  rank: "Law #1",
  cutoff: {
    general: 83,
    obc: 75,
    sc: 65
  },
  fees: "₹2.2L/yr",
  placements: "₹14 LPA avg",
  stream: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  cat: "Law",
  stars: 5
}, {
  id: "nalsar",
  name: "NALSAR Hyderabad",
  location: "Hyderabad, TS",
  type: "Govt",
  exam: "clat",
  rank: "Law #2",
  cutoff: {
    general: 74,
    obc: 66,
    sc: 58
  },
  fees: "₹1.8L/yr",
  placements: "₹12 LPA avg",
  stream: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  cat: "Law",
  stars: 5
}, {
  id: "nlud",
  name: "NLU Delhi",
  location: "New Delhi",
  type: "Govt",
  exam: "ailet",
  rank: "Law #3",
  cutoff: {
    general: 115,
    obc: 100,
    sc: 90
  },
  fees: "₹2.1L/yr",
  placements: "₹15 LPA avg",
  stream: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  cat: "Law",
  stars: 5
}, {
  id: "nid_a",
  name: "NID Ahmedabad",
  location: "Ahmedabad, GJ",
  type: "Govt",
  exam: "nid",
  rank: "Design #1",
  cutoff: {
    general: 50,
    obc: 45,
    sc: 40
  },
  fees: "₹1.8L/yr",
  placements: "₹8 LPA avg",
  stream: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  cat: "Design",
  stars: 5
}, {
  id: "nift_d",
  name: "NIFT Delhi",
  location: "New Delhi",
  type: "Govt",
  exam: "nift",
  rank: "Fashion #1",
  cutoff: {
    general: 850,
    obc: 800,
    sc: 750
  },
  fees: "₹1.9L/yr",
  placements: "₹7 LPA avg",
  stream: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  cat: "Design",
  stars: 5
}, {
  id: "iimind",
  name: "IIM Indore (IPM)",
  location: "Indore, MP",
  type: "Govt",
  exam: "ipmat",
  rank: "Management #1",
  cutoff: {
    general: 188,
    obc: 170,
    sc: 150
  },
  fees: "₹3.5L/yr",
  placements: "₹26 LPA avg",
  stream: ["pcm", "pcb", "pcmb", "commerce", "arts"],
  cat: "Management",
  stars: 5
}, {
  id: "cept",
  name: "CEPT Ahmedabad",
  location: "Ahmedabad, GJ",
  type: "Private",
  exam: "nata",
  rank: "Arch #2",
  cutoff: {
    general: 130,
    obc: 125,
    sc: 120
  },
  fees: "₹2.1L/yr",
  placements: "₹6 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Architecture",
  stars: 4
}, {
  id: "spa",
  name: "SPA Delhi",
  location: "New Delhi",
  type: "Govt",
  exam: "nata",
  rank: "Arch #1",
  cutoff: {
    general: 135,
    obc: 130,
    sc: 125
  },
  fees: "₹0.4L/yr",
  placements: "₹6 LPA avg",
  stream: ["pcm", "pcmb"],
  cat: "Architecture",
  stars: 5
}];
const QB = {
  jee_main: {
    physics: [{
      q: "A ball is projected vertically upward with initial velocity 20 m/s. Time to reach maximum height? (g=10 m/s²)",
      opts: ["1 s", "2 s", "3 s", "4 s"],
      ans: 1,
      sol: "v=u−gt → 0=20−10t → t=2 s",
      chapter: "Kinematics",
      diff: "Easy"
    }, {
      q: "A body of mass 5 kg moves under force F=20 N. Acceleration is:",
      opts: ["2 m/s²", "4 m/s²", "10 m/s²", "100 m/s²"],
      ans: 1,
      sol: "F=ma → a=F/m=20/5=4 m/s²",
      chapter: "Laws of Motion",
      diff: "Easy"
    }, {
      q: "Work done by a force of 10 N moving body 5 m at 60° to displacement:",
      opts: ["25 J", "50 J", "43.3 J", "86.6 J"],
      ans: 0,
      sol: "W=Fdcosθ=10×5×cos60°=10×5×0.5=25 J",
      chapter: "Work & Energy",
      diff: "Medium"
    }, {
      q: "Kinetic energy of body (mass 4 kg, velocity 6 m/s):",
      opts: ["24 J", "48 J", "72 J", "144 J"],
      ans: 2,
      sol: "KE=½mv²=½×4×36=72 J",
      chapter: "Work & Energy",
      diff: "Easy"
    }, {
      q: "Two resistors 6Ω and 3Ω in parallel. Effective resistance:",
      opts: ["9Ω", "2Ω", "3Ω", "0.5Ω"],
      ans: 1,
      sol: "1/R=1/6+1/3=1/6+2/6=3/6=1/2 → R=2Ω",
      chapter: "Current Electricity",
      diff: "Easy"
    }, {
      q: "A photon has energy 3.3×10⁻¹⁹ J. Its frequency (h=6.6×10⁻³⁴ Js):",
      opts: ["2×10¹⁴ Hz", "5×10¹⁴ Hz", "3×10¹⁵ Hz", "5×10¹⁵ Hz"],
      ans: 1,
      sol: "E=hf → f=E/h=3.3×10⁻¹⁹/6.6×10⁻³⁴=5×10¹⁴ Hz",
      chapter: "Modern Physics",
      diff: "Medium"
    }, {
      q: "Velocity of sound in air at 0°C is 330 m/s. At 4°C it is approximately:",
      opts: ["330 m/s", "331 m/s", "333 m/s", "340 m/s"],
      ans: 1,
      sol: "v∝√T; v2=330×√(277/273)≈331 m/s",
      chapter: "Waves",
      diff: "Hard"
    }, {
      q: "Electric flux through a closed surface enclosing charge 5μC (ε₀=8.85×10⁻¹²):",
      opts: ["5.65×10⁵ N·m²/C", "5.65×10⁶ N·m²/C", "4.43×10⁵ N·m²/C", "None"],
      ans: 0,
      sol: "φ=Q/ε₀=5×10⁻⁶/8.85×10⁻¹²≈5.65×10⁵ N·m²/C",
      chapter: "Electrostatics",
      diff: "Medium"
    }],
    chemistry: [{
      q: "Molar mass of H₂SO₄:",
      opts: ["96 g/mol", "98 g/mol", "100 g/mol", "94 g/mol"],
      ans: 1,
      sol: "H₂SO₄: 2(1)+32+4(16)=2+32+64=98 g/mol",
      chapter: "Basic Concepts",
      diff: "Easy"
    }, {
      q: "Electronic configuration of Fe (Z=26):",
      opts: ["[Ar]3d⁶4s²", "[Ar]3d⁸", "[Ar]4s²3d⁶", "[Kr]3d⁶4s²"],
      ans: 0,
      sol: "Fe: [Ar]3d⁶4s² — d orbitals fill after 4s",
      chapter: "Atomic Structure",
      diff: "Medium"
    }, {
      q: "Product of CH₄ + Cl₂ under UV light:",
      opts: ["CH₃Cl", "CCl₄", "CHCl₃", "CH₂Cl₂"],
      ans: 0,
      sol: "Free radical substitution: first product is CH₃Cl (mono-chlorination)",
      chapter: "Organic Chemistry",
      diff: "Easy"
    }, {
      q: "Hybridisation of carbon in CO₂:",
      opts: ["sp", "sp²", "sp³", "dsp²"],
      ans: 0,
      sol: "CO₂ is linear; carbon forms 2 double bonds → sp hybridization",
      chapter: "Chemical Bonding",
      diff: "Medium"
    }, {
      q: "Which of these is a noble gas compound?",
      opts: ["XeF₄", "ArF₂", "KrO₃", "NeF₂"],
      ans: 0,
      sol: "XeF₄ is a real compound; Ar and Ne don't form stable compounds",
      chapter: "p-Block Elements",
      diff: "Easy"
    }, {
      q: "pH of 0.001 M HCl solution:",
      opts: ["1", "2", "3", "4"],
      ans: 2,
      sol: "[H⁺]=10⁻³ M → pH=−log(10⁻³)=3",
      chapter: "Equilibrium",
      diff: "Easy"
    }, {
      q: "Rate of reaction doubles for every 10°C rise. Rate at 60°C vs 10°C:",
      opts: ["8×", "16×", "32×", "64×"],
      ans: 2,
      sol: "ΔT=50°C → 5 doublings → 2⁵=32×",
      chapter: "Chemical Kinetics",
      diff: "Medium"
    }, {
      q: "Which law states: at constant temp, pressure is inversely proportional to volume?",
      opts: ["Gay-Lussac's", "Charles'", "Boyle's", "Avogadro's"],
      ans: 2,
      sol: "Boyle's Law: P ∝ 1/V at constant T",
      chapter: "States of Matter",
      diff: "Easy"
    }],
    maths: [{
      q: "Value of lim(x→0) (sinx/x):",
      opts: ["0", "1", "∞", "−1"],
      ans: 1,
      sol: "Standard limit: lim(x→0) sinx/x = 1",
      chapter: "Limits",
      diff: "Easy"
    }, {
      q: "Derivative of x³ + 2x² − 5x + 7:",
      opts: ["3x²+4x−5", "3x²+2x−5", "x³+4x", "3x+4"],
      ans: 0,
      sol: "d/dx(x³+2x²−5x+7)=3x²+4x−5",
      chapter: "Differentiation",
      diff: "Easy"
    }, {
      q: "∫(2x+3)dx from 0 to 2:",
      opts: ["10", "12", "8", "14"],
      ans: 0,
      sol: "[x²+3x]₀²=4+6−0=10",
      chapter: "Integration",
      diff: "Medium"
    }, {
      q: "Sum of first 20 natural numbers:",
      opts: ["190", "200", "210", "180"],
      ans: 2,
      sol: "n(n+1)/2=20×21/2=210",
      chapter: "Sequences & Series",
      diff: "Easy"
    }, {
      q: "If A and B are mutually exclusive, P(A)=0.3, P(B)=0.4. P(A∪B)=?",
      opts: ["0.12", "0.7", "0.58", "0.5"],
      ans: 1,
      sol: "P(A∪B)=P(A)+P(B)=0.3+0.4=0.7 (mutually exclusive)",
      chapter: "Probability",
      diff: "Easy"
    }, {
      q: "Roots of x²−5x+6=0:",
      opts: ["2,3", "1,6", "−2,−3", "1,5"],
      ans: 0,
      sol: "x²−5x+6=(x−2)(x−3)=0 → x=2,3",
      chapter: "Quadratic Equations",
      diff: "Easy"
    }, {
      q: "Value of sin²30°+cos²60°:",
      opts: ["0.5", "1", "0.25", "0.75"],
      ans: 0,
      sol: "sin30°=0.5, cos60°=0.5; (0.5)²+(0.5)²=0.25+0.25=0.5",
      chapter: "Trigonometry",
      diff: "Easy"
    }, {
      q: "Distance between (3,4) and origin:",
      opts: ["3", "4", "5", "7"],
      ans: 2,
      sol: "d=√(3²+4²)=√(9+16)=√25=5",
      chapter: "Coordinate Geometry",
      diff: "Easy"
    }]
  },
  neet: {
    biology: [{
      q: "DNA replication is:",
      opts: ["Conservative", "Semi-conservative", "Dispersive", "Random"],
      ans: 1,
      sol: "Meselson-Stahl experiment proved DNA replication is semi-conservative",
      chapter: "Molecular Biology",
      diff: "Easy"
    }, {
      q: "Powerhouse of the cell:",
      opts: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"],
      ans: 2,
      sol: "Mitochondria produce ATP via cellular respiration — hence called the powerhouse",
      chapter: "Cell Biology",
      diff: "Easy"
    }, {
      q: "Which plant hormone promotes cell division?",
      opts: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic acid"],
      ans: 2,
      sol: "Cytokinins promote cell division (cytokinesis). Auxins promote cell elongation.",
      chapter: "Plant Physiology",
      diff: "Medium"
    }, {
      q: "Blood group system discovered by Karl Landsteiner involves:",
      opts: ["Rh factor", "ABO antigens", "HLA antigens", "Rhesus only"],
      ans: 1,
      sol: "Landsteiner discovered ABO blood group system in 1900",
      chapter: "Human Physiology",
      diff: "Easy"
    }, {
      q: "Which of these is NOT a function of lymph nodes?",
      opts: ["Filtering lymph", "Producing red blood cells", "Producing B and T cells", "Trapping bacteria"],
      ans: 1,
      sol: "RBCs are produced in red bone marrow, not lymph nodes",
      chapter: "Immune System",
      diff: "Medium"
    }],
    physics: [{
      q: "A 4μF capacitor is charged to 100V. Energy stored:",
      opts: ["0.02 J", "0.04 J", "4 J", "40 J"],
      ans: 0,
      sol: "E=½CV²=½×4×10⁻⁶×10000=0.02 J",
      chapter: "Electrostatics",
      diff: "Medium"
    }, {
      q: "Refractive index of glass is 1.5. Speed of light in glass:",
      opts: ["2×10⁸ m/s", "1.5×10⁸ m/s", "3×10⁸ m/s", "4.5×10⁸ m/s"],
      ans: 0,
      sol: "v=c/n=3×10⁸/1.5=2×10⁸ m/s",
      chapter: "Optics",
      diff: "Easy"
    }],
    chemistry: [{
      q: "Which biomolecule provides quick energy?",
      opts: ["Proteins", "Fats", "Carbohydrates", "Nucleic acids"],
      ans: 2,
      sol: "Carbohydrates (glucose) are the primary quick energy source",
      chapter: "Biomolecules",
      diff: "Easy"
    }, {
      q: "pH of blood is approximately:",
      opts: ["6.0", "7.4", "8.0", "5.5"],
      ans: 1,
      sol: "Normal human blood pH is 7.35–7.45, approximately 7.4",
      chapter: "Equilibrium",
      diff: "Easy"
    }]
  },
  clat: {
    legal: [{
      q: "A contract requires:",
      opts: ["Offer only", "Offer and acceptance", "Offer, acceptance and consideration", "Offer and consideration only"],
      ans: 2,
      sol: "A valid contract requires: offer, acceptance, consideration, and free consent",
      chapter: "Contract Law",
      diff: "Easy"
    }, {
      q: "FIR stands for:",
      opts: ["First Investigation Report", "First Information Report", "Formal Inquiry Record", "Federal Incident Report"],
      ans: 1,
      sol: "FIR = First Information Report, filed at a police station",
      chapter: "Criminal Law",
      diff: "Easy"
    }, {
      q: "The right to equality is in Article:",
      opts: ["14", "19", "21", "32"],
      ans: 0,
      sol: "Article 14 of the Indian Constitution guarantees Right to Equality",
      chapter: "Constitutional Law",
      diff: "Easy"
    }],
    english: [{
      q: "Choose the correct sentence:",
      opts: ["He don't know the answer", "He doesn't knows the answer", "He doesn't know the answer", "He not know the answer"],
      ans: 2,
      sol: "Correct: 'He doesn't know the answer' — third person singular uses 'doesn't'",
      chapter: "Grammar",
      diff: "Easy"
    }, {
      q: "Antonym of 'Benevolent':",
      opts: ["Kind", "Malevolent", "Generous", "Friendly"],
      ans: 1,
      sol: "Benevolent = kind/generous; Malevolent = having/showing desire to do evil",
      chapter: "Vocabulary",
      diff: "Easy"
    }]
  }
};
const RESOURCES = {
  pcm: [{
    title: "HC Verma — Concepts of Physics",
    type: "Book",
    subject: "Physics",
    link: "#",
    free: false
  }, {
    title: "NCERT Physics Part 1 & 2",
    type: "Book",
    subject: "Physics",
    link: "#",
    free: true
  }, {
    title: "RD Sharma Mathematics",
    type: "Book",
    subject: "Maths",
    link: "#",
    free: false
  }, {
    title: "Khan Academy — Maths & Physics",
    type: "Website",
    subject: "Multiple",
    link: "https://khanacademy.org",
    free: true
  }, {
    title: "JEE Main Previous Year Papers",
    type: "Practice",
    subject: "All",
    link: "#",
    free: true
  }, {
    title: "Organic Chemistry by Morrison & Boyd",
    type: "Book",
    subject: "Chemistry",
    link: "#",
    free: false
  }],
  pcb: [{
    title: "NCERT Biology Class 11 & 12",
    type: "Book",
    subject: "Biology",
    link: "#",
    free: true
  }, {
    title: "Trueman's Biology",
    type: "Book",
    subject: "Biology",
    link: "#",
    free: false
  }, {
    title: "NEET Previous Year Papers",
    type: "Practice",
    subject: "All",
    link: "#",
    free: true
  }, {
    title: "HC Verma Physics",
    type: "Book",
    subject: "Physics",
    link: "#",
    free: false
  }, {
    title: "NCERT Exemplar",
    type: "Practice",
    subject: "All",
    link: "#",
    free: true
  }],
  commerce: [{
    title: "NCERT Accountancy Class 12",
    type: "Book",
    subject: "Accounts",
    link: "#",
    free: true
  }, {
    title: "ICAI CA Foundation Study Material",
    type: "Book",
    subject: "CA",
    link: "https://icai.org",
    free: true
  }, {
    title: "Business Law by Bulchandani",
    type: "Book",
    subject: "Law",
    link: "#",
    free: false
  }, {
    title: "Economic Survey of India",
    type: "Report",
    subject: "Economics",
    link: "#",
    free: true
  }],
  arts: [{
    title: "Laxmikanth — Indian Polity",
    type: "Book",
    subject: "Polity",
    link: "#",
    free: false
  }, {
    title: "NCERT History Set",
    type: "Book",
    subject: "History",
    link: "#",
    free: true
  }, {
    title: "CLAT Previous Papers",
    type: "Practice",
    subject: "Law",
    link: "#",
    free: true
  }, {
    title: "The Hindu / Indian Express",
    type: "Newspaper",
    subject: "Current Affairs",
    link: "#",
    free: false
  }]
};
const TIMELINE = {
  jee_main: [{
    event: "JEE Main (Session 1) Registration",
    date: "Oct 2025",
    type: "reg",
    done: false
  }, {
    event: "JEE Main Session 1",
    date: "Jan 2026",
    type: "exam",
    done: false
  }, {
    event: "Session 1 Result",
    date: "Feb 2026",
    type: "result",
    done: false
  }, {
    event: "JEE Main Session 2",
    date: "Apr 2026",
    type: "exam",
    done: false
  }, {
    event: "JEE Advanced Registration",
    date: "May 2026",
    type: "reg",
    done: false
  }, {
    event: "JEE Advanced",
    date: "Jun 2026",
    type: "exam",
    done: false
  }, {
    event: "JoSAA Counselling",
    date: "Jul 2026",
    type: "counselling",
    done: false
  }],
  neet: [{
    event: "NEET Registration",
    date: "Feb 2026",
    type: "reg",
    done: false
  }, {
    event: "NEET Exam",
    date: "May 2026",
    type: "exam",
    done: false
  }, {
    event: "NEET Result",
    date: "Jun 2026",
    type: "result",
    done: false
  }, {
    event: "MCC Counselling",
    date: "Jul 2026",
    type: "counselling",
    done: false
  }],
  clat: [{
    event: "CLAT Registration",
    date: "Jul 2025",
    type: "reg",
    done: false
  }, {
    event: "CLAT Exam",
    date: "Dec 2025",
    type: "exam",
    done: false
  }, {
    event: "CLAT Result",
    date: "Jan 2026",
    type: "result",
    done: false
  }, {
    event: "NLU Counselling",
    date: "Feb 2026",
    type: "counselling",
    done: false
  }]
};
function getRecommendedExams(profile) {
  if (!profile.stream) return EXAMS.slice(0, 6);
  let exams = EXAMS.filter(e => e.streams.includes(profile.stream));
  if (profile.goals && profile.goals.length > 0) {
    const catMap = {
      engineering: ["Engineering"],
      medical: ["Medical"],
      law: ["Law"],
      management: ["Management"],
      design: ["Design", "Architecture"],
      defence: ["Defence"],
      ca: ["Finance"]
    };
    const cats = profile.goals.flatMap(g => catMap[g] || []);
    if (cats.length > 0) exams = exams.filter(e => cats.includes(e.cat));
  }
  return exams.slice(0, 8);
}
function getCollegesByExamScore(exam, score, category = "general") {
  const examColleges = COLLEGES.filter(c => c.exam === exam.id || c.exam === exam);
  return examColleges.map(c => {
    const cut = c.cutoff[category] || c.cutoff.general;
    let status;
    if (exam === "jee_main" || exam.id === "jee_main") {
      status = score >= cut + 2 ? "safe" : score >= cut - 2 ? "moderate" : score >= cut - 6 ? "reach" : null;
    } else {
      status = score >= cut + 5 ? "safe" : score >= cut - 5 ? "moderate" : score >= cut - 15 ? "reach" : null;
    }
    return {
      ...c,
      status,
      cutoffForCat: cut
    };
  }).filter(c => c.status);
}
function calcReadiness(profile, history) {
  let base = 50;
  const m = profile.marks || 0;
  if (m >= 90) base = 80;else if (m >= 80) base = 70;else if (m >= 70) base = 62;else if (m >= 60) base = 55;
  if (history.length === 0) return base;
  const avg = history.reduce((s, t) => s + t.percentage, 0) / history.length;
  return Math.round(base * 0.4 + avg * 0.6);
}
function estimatePercentile(score, examId) {
  const map = {
    jee_main: {
      300: 99.9,
      270: 99,
      240: 97,
      210: 93,
      180: 87,
      150: 77,
      120: 63,
      90: 45,
      60: 25
    },
    neet: {
      720: 99.9,
      680: 99,
      650: 97,
      600: 93,
      550: 87,
      500: 78,
      450: 65,
      400: 50,
      350: 35
    }
  };
  const tbl = map[examId];
  if (!tbl) return Math.round(score / 3);
  const scores = Object.keys(tbl).map(Number).sort((a, b) => b - a);
  for (let s of scores) {
    if (score >= s) return tbl[s];
  }
  return 1;
}
const Icon = {
  home: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
  }), React.createElement("polyline", {
    points: "9 22 9 12 15 12 15 22"
  })),
  exam: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), React.createElement("polyline", {
    points: "14 2 14 8 20 8"
  }), React.createElement("line", {
    x1: "16",
    y1: "13",
    x2: "8",
    y2: "13"
  }), React.createElement("line", {
    x1: "16",
    y1: "17",
    x2: "8",
    y2: "17"
  }), React.createElement("polyline", {
    points: "10 9 9 9 8 9"
  })),
  college: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("polygon", {
    points: "12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"
  }), React.createElement("line", {
    x1: "12",
    y1: "22",
    x2: "12",
    y2: "15.5"
  }), React.createElement("polyline", {
    points: "22 8.5 12 15.5 2 8.5"
  })),
  test: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M9 11l3 3L22 4"
  }), React.createElement("path", {
    d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
  })),
  progress: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("line", {
    x1: "18",
    y1: "20",
    x2: "18",
    y2: "10"
  }), React.createElement("line", {
    x1: "12",
    y1: "20",
    x2: "12",
    y2: "4"
  }), React.createElement("line", {
    x1: "6",
    y1: "20",
    x2: "6",
    y2: "14"
  })),
  study: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
  }), React.createElement("path", {
    d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
  })),
  roadmap: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), React.createElement("polyline", {
    points: "12 6 12 12 16 14"
  })),
  logout: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
  }), React.createElement("polyline", {
    points: "16 17 21 12 16 7"
  }), React.createElement("line", {
    x1: "21",
    y1: "12",
    x2: "9",
    y2: "12"
  })),
  star: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, React.createElement("polygon", {
    points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
  })),
  check: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })),
  chevron: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  })),
  heart: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, React.createElement("path", {
    d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  })),
  info: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), React.createElement("line", {
    x1: "12",
    y1: "16",
    x2: "12",
    y2: "12"
  }), React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12.01",
    y2: "8"
  })),
  search: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })),
  shield: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  }), React.createElement("path", {
    d: "m9 12 2 2 4-5"
  })),
  arrowUpRight: React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M7 17 17 7"
  }), React.createElement("path", {
    d: "M7 7h10v10"
  }))
};
function initCareerMotion() {
  if (!window.gsap) return;
  const gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  gsap.killTweensOf(".reveal-text,.motion-card,.card,.stat-card,.exam-card");
  gsap.fromTo(".reveal-text", {
    opacity: 0,
    y: 24,
    clipPath: "inset(0 0 100% 0)"
  }, {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    duration: .9,
    ease: "power3.out",
    stagger: .08
  });
  gsap.fromTo(".motion-card", {
    opacity: 0,
    y: 28,
    scale: .985
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: .8,
    ease: "power3.out",
    stagger: .08,
    delay: .12
  });
  if (window.ScrollTrigger) {
    window.ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.utils.toArray(".card,.exam-card,.stat-card").forEach((el, i) => {
      gsap.fromTo(el, {
        opacity: .72,
        y: 26
      }, {
        opacity: 1,
        y: 0,
        duration: .7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse"
        },
        delay: Math.min(i * .02, .16)
      });
    });
  }
}
function StepBar({
  current,
  total
}) {
  return React.createElement("div", {
    className: "flex items-center gap-2 justify-center mb-8"
  }, Array.from({
    length: total
  }).map((_, i) => React.createElement("div", {
    key: i,
    className: `step-dot ${i < current ? "done" : i === current ? "active" : "pending"}`
  })));
}
function Step0Role({
  onNext
}) {
  const [sel, setSel] = useState(null);
  return React.createElement("div", {
    className: "ob-card fade-up"
  }, React.createElement("div", {
    className: "text-center mb-8"
  }, React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      background: "#EEF2FF",
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px"
    }
  }, React.createElement("svg", {
    width: "28",
    height: "28",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#6366F1",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M22 10v6M2 10l10-5 10 5-10 5z"
  }), React.createElement("path", {
    d: "M6 12v5c3 3 9 3 12 0v-5"
  }))), React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".08em",
      color: "#6366F1",
      textTransform: "uppercase",
      marginBottom: 8
    }
  }, "Welcome to CareerOS"), React.createElement("h2", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: "#0F172A",
      marginBottom: 8,
      letterSpacing: "-.02em"
    }
  }, "Who is this guidance for?"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14,
      lineHeight: 1.6
    }
  }, "We'll personalise the entire experience based on your perspective.")), React.createElement("div", {
    className: "flex flex-col gap-3 mb-8"
  }, [{
    id: "student",
    label: "I am the Student",
    desc: "Personalised exam timeline, mock tests & college recommendations for me",
    icon: React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#6366F1",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
    }), React.createElement("circle", {
      cx: "12",
      cy: "7",
      r: "4"
    }))
  }, {
    id: "parent",
    label: "I am the Parent",
    desc: "Monitor your child's progress, compare colleges & plan finances",
    icon: React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#6366F1",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
    }), React.createElement("circle", {
      cx: "9",
      cy: "7",
      r: "4"
    }), React.createElement("path", {
      d: "M23 21v-2a4 4 0 0 0-3-3.87"
    }), React.createElement("path", {
      d: "M16 3.13a4 4 0 0 1 0 7.75"
    }))
  }].map(o => React.createElement("button", {
    key: o.id,
    className: `ob-opt flex items-center gap-4 text-left ${sel === o.id ? "sel" : ""}`,
    onClick: () => setSel(o.id)
  }, React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      background: sel === o.id ? "#C7D2FE" : "#F1F5F9",
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, o.icon), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0F172A",
      marginBottom: 2
    }
  }, o.label), React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#64748B"
    }
  }, o.desc)), sel === o.id && React.createElement("div", {
    style: {
      marginLeft: "auto",
      color: "#6366F1"
    }
  }, React.createElement("div", {
    className: "sb-icon"
  }, Icon.check))))), React.createElement("button", {
    className: "btn-primary w-full",
    disabled: !sel,
    onClick: () => onNext({
      role: sel
    })
  }, "Continue"));
}
function Step1Board({
  profile,
  onNext
}) {
  const [sel, setSel] = useState(null);
  return React.createElement("div", {
    className: "ob-card fade-up"
  }, React.createElement("div", {
    className: "text-center mb-8"
  }, React.createElement("h2", {
    style: {
      fontSize: 24,
      fontWeight: 800,
      color: "#0F172A",
      marginBottom: 8,
      letterSpacing: "-.02em"
    }
  }, "Which board are you from?"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "This helps us show state-specific exams and eligibility.")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 28
    }
  }, BOARDS.map(b => React.createElement("button", {
    key: b.id,
    className: `ob-tile ${sel === b.id ? "sel" : ""}`,
    onClick: () => setSel(b.id)
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: "#0F172A",
      marginBottom: 3
    }
  }, b.name), React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#94A3B8",
      lineHeight: 1.4
    }
  }, b.full), sel === b.id && React.createElement("div", {
    style: {
      color: "#6366F1",
      marginTop: 6
    }
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })))))), React.createElement("div", {
    className: "flex gap-3"
  }, React.createElement("button", {
    className: "btn-outline",
    onClick: () => onNext({
      board: null
    }, "back")
  }, "Back"), React.createElement("button", {
    className: "btn-primary flex-1",
    disabled: !sel,
    onClick: () => onNext({
      board: sel
    })
  }, "Continue")));
}
function Step2Stream({
  profile,
  onNext
}) {
  const [sel, setSel] = useState(null);
  return React.createElement("div", {
    className: "ob-card fade-up"
  }, React.createElement("div", {
    className: "text-center mb-8"
  }, React.createElement("h2", {
    style: {
      fontSize: 24,
      fontWeight: 800,
      color: "#0F172A",
      marginBottom: 8,
      letterSpacing: "-.02em"
    }
  }, "What stream are you in?"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "Your stream determines which entrance exams you are eligible for.")), React.createElement("div", {
    className: "flex flex-col gap-3 mb-7"
  }, STREAMS.map(s => React.createElement("button", {
    key: s.id,
    className: `ob-opt flex items-center gap-4 ${sel === s.id ? "sel" : ""}`,
    onClick: () => setSel(s.id)
  }, React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      background: sel === s.id ? s.bg : s.bg,
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `2px solid ${sel === s.id ? s.color : "transparent"}`,
      flexShrink: 0
    }
  }, React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 6,
      background: s.color,
      opacity: .7
    }
  })), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14.5,
      color: "#0F172A",
      marginBottom: 2
    }
  }, s.label), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#94A3B8",
      marginBottom: 3
    }
  }, s.sub), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#64748B"
    }
  }, s.desc)), sel === s.id && React.createElement("div", {
    style: {
      marginLeft: "auto",
      color: s.color,
      flexShrink: 0
    }
  }, React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })))))), React.createElement("div", {
    className: "flex gap-3"
  }, React.createElement("button", {
    className: "btn-outline",
    onClick: () => onNext({}, "back")
  }, "Back"), React.createElement("button", {
    className: "btn-primary flex-1",
    disabled: !sel,
    onClick: () => onNext({
      stream: sel
    })
  }, "Continue")));
}
function Step3Location({
  profile,
  onNext
}) {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const indianStates = ["Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
  return React.createElement("div", {
    className: "ob-card fade-up"
  }, React.createElement("div", {
    className: "text-center mb-8"
  }, React.createElement("h2", {
    style: {
      fontSize: 24,
      fontWeight: 800,
      color: "#0F172A",
      marginBottom: 8,
      letterSpacing: "-.02em"
    }
  }, "Where are you located?"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "State helps us include relevant state-level exams.")), React.createElement("div", {
    className: "flex flex-col gap-4 mb-8"
  }, React.createElement("div", null, React.createElement("label", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6
    }
  }, "State / UT"), React.createElement("select", {
    className: "inp",
    value: state,
    onChange: e => setState(e.target.value)
  }, React.createElement("option", {
    value: ""
  }, "Select your state..."), indianStates.map(s => React.createElement("option", {
    key: s,
    value: s
  }, s)))), React.createElement("div", null, React.createElement("label", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6
    }
  }, "City ", React.createElement("span", {
    style: {
      color: "#94A3B8",
      fontWeight: 400
    }
  }, "(optional)")), React.createElement("input", {
    className: "inp",
    placeholder: "e.g. Pune, Hyderabad, Jaipur...",
    value: city,
    onChange: e => setCity(e.target.value)
  })), React.createElement("div", {
    style: {
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      padding: "12px 14px",
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, React.createElement("div", {
    style: {
      color: "#6366F1",
      flexShrink: 0,
      marginTop: 1
    }
  }, React.createElement("div", {
    style: {
      width: 16,
      height: 16
    }
  }, Icon.info)), React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#64748B",
      lineHeight: 1.6
    }
  }, "State domicile can affect eligibility for state board exams like MHT-CET (Maharashtra), KCET (Karnataka), WBJEE (West Bengal), etc."))), React.createElement("div", {
    className: "flex gap-3"
  }, React.createElement("button", {
    className: "btn-outline",
    onClick: () => onNext({}, "back")
  }, "Back"), React.createElement("button", {
    className: "btn-primary flex-1",
    disabled: !state,
    onClick: () => onNext({
      state,
      city
    })
  }, "Continue")));
}
function Step4Budget({
  profile,
  onNext
}) {
  const [sel, setSel] = useState(null);
  return React.createElement("div", {
    className: "ob-card fade-up"
  }, React.createElement("div", {
    className: "text-center mb-8"
  }, React.createElement("h2", {
    style: {
      fontSize: 24,
      fontWeight: 800,
      color: "#0F172A",
      marginBottom: 8,
      letterSpacing: "-.02em"
    }
  }, "Annual fee budget?"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "We'll filter colleges that fit your family's financial plan.")), React.createElement("div", {
    className: "flex flex-col gap-3 mb-8"
  }, BUDGETS.map(b => React.createElement("button", {
    key: b.id,
    className: `ob-opt flex items-center gap-4 text-left ${sel === b.id ? "sel" : ""}`,
    onClick: () => setSel(b.id)
  }, React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: b.color,
      flexShrink: 0
    }
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14.5,
      color: "#0F172A",
      marginBottom: 2
    }
  }, b.label), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#94A3B8"
    }
  }, b.sub)), sel === b.id && React.createElement("div", {
    style: {
      marginLeft: "auto",
      color: "#6366F1"
    }
  }, React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })))))), React.createElement("div", {
    className: "flex gap-3"
  }, React.createElement("button", {
    className: "btn-outline",
    onClick: () => onNext({}, "back")
  }, "Back"), React.createElement("button", {
    className: "btn-primary flex-1",
    disabled: !sel,
    onClick: () => onNext({
      budget: sel
    })
  }, "Continue")));
}
function Step5Marks({
  profile,
  onNext
}) {
  const [marks, setMarks] = useState(75);
  const [name, setName] = useState("");
  const getLabel = m => m >= 90 ? "Excellent" : m >= 80 ? "Very Good" : m >= 70 ? "Good" : m >= 60 ? "Average" : "Below Average";
  const getColor = m => m >= 80 ? "#10B981" : m >= 65 ? "#6366F1" : "#F59E0B";
  return React.createElement("div", {
    className: "ob-card fade-up"
  }, React.createElement("div", {
    className: "text-center mb-8"
  }, React.createElement("h2", {
    style: {
      fontSize: 24,
      fontWeight: 800,
      color: "#0F172A",
      marginBottom: 8,
      letterSpacing: "-.02em"
    }
  }, "Your 12th marks & name"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "Used to match cut-offs and shortlist colleges you can target.")), React.createElement("div", {
    className: "flex flex-col gap-6 mb-8"
  }, React.createElement("div", null, React.createElement("label", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6
    }
  }, "Your Name"), React.createElement("input", {
    className: "inp",
    placeholder: "Enter your name...",
    value: name,
    onChange: e => setName(e.target.value)
  })), React.createElement("div", null, React.createElement("div", {
    className: "flex justify-between items-center mb-3"
  }, React.createElement("label", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "#374151"
    }
  }, "Expected / Actual 12th Percentage"), React.createElement("span", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: getColor(marks)
    }
  }, marks, "%")), React.createElement("input", {
    type: "range",
    className: "sld",
    min: 40,
    max: 100,
    value: marks,
    onChange: e => setMarks(Number(e.target.value)),
    style: {
      background: `linear-gradient(to right, ${getColor(marks)} 0%, ${getColor(marks)} ${(marks - 40) / 60 * 100}%, #E2E8F0 ${(marks - 40) / 60 * 100}%, #E2E8F0 100%)`
    }
  }), React.createElement("div", {
    className: "flex justify-between mt-2"
  }, React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#94A3B8"
    }
  }, "40%"), React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: getColor(marks)
    }
  }, getLabel(marks)), React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#94A3B8"
    }
  }, "100%"))), React.createElement("div", {
    style: {
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      padding: "12px 14px"
    }
  }, React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#64748B",
      lineHeight: 1.6
    }
  }, React.createElement("strong", {
    style: {
      color: "#374151"
    }
  }, "Note:"), " JEE Main requires 75% minimum (65% for SC/ST). NEET requires 50% minimum. CLAT requires 45%. You can update marks as results arrive."))), React.createElement("div", {
    className: "flex gap-3"
  }, React.createElement("button", {
    className: "btn-outline",
    onClick: () => onNext({}, "back")
  }, "Back"), React.createElement("button", {
    className: "btn-primary flex-1",
    onClick: () => onNext({
      marks,
      name: name || "Student"
    })
  }, "Continue")));
}
function Step6Goals({
  profile,
  onNext
}) {
  const [sel, setSel] = useState([]);
  const streamGoals = GOALS.filter(g => !profile.stream || g.streams.includes(profile.stream));
  const toggle = id => setSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return React.createElement("div", {
    className: "ob-card fade-up"
  }, React.createElement("div", {
    className: "text-center mb-8"
  }, React.createElement("h2", {
    style: {
      fontSize: 24,
      fontWeight: 800,
      color: "#0F172A",
      marginBottom: 8,
      letterSpacing: "-.02em"
    }
  }, "What are your career goals?"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "Select all that interest you. We'll build your personalised exam list.")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 8
    }
  }, streamGoals.map(g => React.createElement("button", {
    key: g.id,
    className: `ob-tile ${sel.includes(g.id) ? "sel" : ""}`,
    onClick: () => toggle(g.id),
    style: {
      padding: "14px 10px"
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13,
      color: "#0F172A",
      lineHeight: 1.4
    }
  }, g.label), sel.includes(g.id) && React.createElement("div", {
    style: {
      color: "#6366F1",
      marginTop: 6,
      display: "flex",
      justifyContent: "center"
    }
  }, React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })))))), React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#94A3B8",
      textAlign: "center",
      marginBottom: 20
    }
  }, "Select at least one goal to continue"), React.createElement("div", {
    className: "flex gap-3"
  }, React.createElement("button", {
    className: "btn-outline",
    onClick: () => onNext({}, "back")
  }, "Back"), React.createElement("button", {
    className: "btn-primary flex-1",
    disabled: sel.length === 0,
    onClick: () => onNext({
      goals: sel
    })
  }, "Generate My Plan")));
}
function AIProcessing({
  profile,
  onDone
}) {
  const [step, setStep] = useState(0);
  const steps = ["Analysing your stream & board...", "Matching entrance exam eligibility...", "Scanning 25+ college cut-offs...", "Building your personalised roadmap...", "Calculating readiness score..."];
  useEffect(() => {
    const t = setInterval(() => setStep(s => {
      if (s >= steps.length - 1) {
        clearInterval(t);
        setTimeout(onDone, 700);
        return s;
      }
      return s + 1;
    }), 800);
    return () => clearInterval(t);
  }, []);
  return React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "linear-gradient(132deg,#fafcff 0%,#eef4ff 58%,#f7f9ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement("div", {
    style: {
      textAlign: "center",
      maxWidth: 400,
      padding: 32
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 32
    }
  }, React.createElement("div", {
    className: "ai-ring"
  })), React.createElement("h2", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: "#0F172A",
      marginBottom: 8,
      letterSpacing: "-.02em"
    }
  }, "Building your plan"), React.createElement("div", {
    style: {
      height: 48,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement("p", {
    key: step,
    className: "fade-up",
    style: {
      fontSize: 14,
      color: "#64748B"
    }
  }, steps[step] || steps[steps.length - 1])), React.createElement("div", {
    className: "prog-bar mt-6",
    style: {
      maxWidth: 240,
      margin: "24px auto 0"
    }
  }, React.createElement("div", {
    className: "prog-fill",
    style: {
      width: `${(step + 1) / steps.length * 100}%`,
      background: "linear-gradient(90deg,#6366F1,#8B5CF6)"
    }
  }))));
}
function Onboarding({
  onComplete
}) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({});
  const TOTAL = 7;
  const next = (data, dir) => {
    if (dir === "back") {
      setStep(s => Math.max(0, s - 1));
      return;
    }
    const updated = {
      ...profile,
      ...data
    };
    setProfile(updated);
    if (step < 6) setStep(s => s + 1);else onComplete(updated);
  };
  const stepComponents = [React.createElement(Step0Role, {
    onNext: next
  }), React.createElement(Step1Board, {
    profile: profile,
    onNext: next
  }), React.createElement(Step2Stream, {
    profile: profile,
    onNext: next
  }), React.createElement(Step3Location, {
    profile: profile,
    onNext: next
  }), React.createElement(Step4Budget, {
    profile: profile,
    onNext: next
  }), React.createElement(Step5Marks, {
    profile: profile,
    onNext: next
  }), React.createElement(Step6Goals, {
    profile: profile,
    onNext: next
  })];
  return React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "linear-gradient(132deg,#fafcff 0%,#eef4ff 58%,#f7f9ff 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 16px"
    }
  }, React.createElement("div", {
    style: {
      marginBottom: 24,
      textAlign: "center"
    }
  }, React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: ".06em",
      color: "#6366F1",
      textTransform: "uppercase"
    }
  }, "CareerOS AI \u2014 After 12th")), React.createElement(StepBar, {
    current: step,
    total: TOTAL
  }), stepComponents[step], React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 12,
      color: "#94A3B8"
    }
  }, "Step ", step + 1, " of ", TOTAL));
}
function Sidebar({
  active,
  onChange,
  profile
}) {
  const nav = [{
    id: "home",
    label: "Dashboard",
    icon: Icon.home
  }, {
    id: "exams",
    label: "Exam Explorer",
    icon: Icon.exam
  }, {
    id: "colleges",
    label: "College Finder",
    icon: Icon.college
  }, {
    id: "tests",
    label: "Mock Tests",
    icon: Icon.test
  }, {
    id: "progress",
    label: "Progress",
    icon: Icon.progress
  }, {
    id: "study",
    label: "Study Hub",
    icon: Icon.study
  }, {
    id: "roadmap",
    label: "Roadmap",
    icon: Icon.roadmap
  }];
  const stream = STREAMS.find(s => s.id === profile.stream);
  return React.createElement("div", {
    className: "sidebar"
  }, React.createElement("div", {
    className: "sb-logo"
  }, React.createElement("div", {
    className: "brand-row"
  }, React.createElement("div", {
    className: "brand-mark"
  }, Icon.home), React.createElement("div", null, React.createElement("div", {
    className: "brand-title"
  }, "CareerOS AI"), React.createElement("div", {
    className: "brand-subtitle"
  }, "After 12th Intelligence"))), React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,.4)",
      fontWeight: 500
    }
  }, "After 12th \xB7 Guidance Platform")), React.createElement("div", {
    className: "sb-nav"
  }, React.createElement("div", {
    className: "sb-section"
  }, "Navigation"), nav.map(n => React.createElement("button", {
    key: n.id,
    className: `sb-item ${active === n.id ? "active" : ""}`,
    onClick: () => onChange(n.id)
  }, React.createElement("span", {
    className: "sb-icon"
  }, n.icon), n.label))), React.createElement("div", {
    className: "profile-chip"
  }, React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#8b909b",
      fontWeight: 800,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      marginBottom: 6
    }
  }, "Student Signal"), React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: "#1e1f25",
      marginBottom: 4
    }
  }, profile.name || "Student"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#737781",
      lineHeight: 1.5
    }
  }, stream?.label || "Career path", profile.state && ` / ${profile.state}`)), React.createElement("div", {
    style: {
      padding: "16px 10px",
      borderTop: "1px solid rgba(255,255,255,.07)"
    }
  }, profile.stream && stream && React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.06)",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 10
    }
  }, React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(255,255,255,.35)",
      fontWeight: 700,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      marginBottom: 4
    }
  }, "Stream"), React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "#fff",
      fontWeight: 600
    }
  }, stream.label)), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,.4)",
      padding: "0 4px"
    }
  }, profile.name || "Student", profile.state && ` · ${profile.state}`)));
}
function Topbar({
  profile
}) {
  const initials = (profile.name || "Student").split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "ST";
  return React.createElement("div", {
    className: "topbar"
  }, React.createElement("div", {
    className: "search-pill"
  }, Icon.search, React.createElement("input", {
    value: "",
    placeholder: "Search exams, colleges, goals",
    readOnly: true,
    "aria-label": "Search"
  })), React.createElement("div", {
    className: "top-actions"
  }, React.createElement("div", {
    className: "verified-pill"
  }, Icon.shield, React.createElement("span", null, "Verified Student")), React.createElement("div", {
    className: "avatar-pill"
  }, initials)));
}
function HomeTab({
  profile,
  testHistory,
  onNav
}) {
  const recommended = getRecommendedExams(profile).slice(0, 4);
  const readiness = calcReadiness(profile, testHistory);
  const stream = STREAMS.find(s => s.id === profile.stream);
  const today = new Date();
  const isStudent = profile.role === "student";
  const statCards = [{
    label: "Career Readiness",
    value: `${readiness}/100`,
    sub: readiness >= 80 ? "Strong placement track" : "Keep practising",
    color: "#6366F1",
    bg: "#EEF2FF"
  }, {
    label: "Target Exams",
    value: recommended.length,
    sub: `Based on ${stream?.label || "your stream"}`,
    color: "#10B981",
    bg: "#ECFDF5"
  }, {
    label: "Mock Rhythm",
    value: testHistory.length,
    sub: testHistory.length > 0 ? `Last: ${testHistory[testHistory.length - 1]?.percentage?.toFixed(0)}% score` : "Start your first test",
    color: "#F59E0B",
    bg: "#FFFBEB"
  }, {
    label: "12th Marks",
    value: `${profile.marks || "—"}%`,
    sub: `${profile.board?.toUpperCase() || "Board"} student`,
    color: "#8B5CF6",
    bg: "#F5F3FF"
  }];
  const eligibleExamCount = recommended.length;
  const avgTestScore = testHistory.length > 0 ? (testHistory.reduce((s, t) => s + t.percentage, 0) / testHistory.length).toFixed(1) : null;
  return React.createElement("div", {
    className: "dashboard-page"
  }, React.createElement("div", {
    className: "dashboard-hero"
  }, React.createElement("div", {
    className: "eyebrow reveal-text"
  }, "Unified Dashboard"), React.createElement("h1", {
    className: "hero-title reveal-text"
  }, "After 12th career operating system."), React.createElement("p", {
    className: "hero-copy reveal-text"
  }, stream ? `${stream.label} · ${stream.desc}` : "Your personalised 12th grade career command centre.")), React.createElement("div", {
    className: "stat-grid"
  }, statCards.map((c, i) => React.createElement("div", {
    key: i,
    className: "stat-card motion-card"
  }, React.createElement("div", {
    className: "stat-label"
  }, c.label), React.createElement("div", {
    className: "stat-value"
  }, String(c.value).includes("/") ? React.createElement(React.Fragment, null, String(c.value).split("/")[0], React.createElement("small", null, "/", String(c.value).split("/")[1])) : c.value), React.createElement("div", {
    className: "stat-sub"
  }, c.sub)))), React.createElement("div", {
    className: "feature-grid"
  }, [{
    label: "Exam Intelligence",
    sub: "Eligibility, patterns, cut-offs",
    tab: "exams",
    icon: Icon.exam
  }, {
    label: "College Studio",
    sub: "Ranked options by score and budget",
    tab: "colleges",
    icon: Icon.college
  }, {
    label: "Mock Intelligence",
    sub: "Practice tests with instant analytics",
    tab: "tests",
    icon: Icon.test
  }].map(item => React.createElement("button", {
    key: item.tab,
    className: "card feature-card motion-card",
    style: {
      padding: 28,
      textAlign: "left"
    },
    onClick: () => onNav(item.tab)
  }, React.createElement("span", {
    className: "feature-arrow"
  }, Icon.arrowUpRight), React.createElement("span", {
    className: "feature-icon"
  }, item.icon), React.createElement("span", {
    style: {
      fontSize: 22,
      fontWeight: 850,
      color: "#1b1b20",
      marginBottom: 14
    }
  }, item.label), React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: "#747782"
    }
  }, item.sub))), React.createElement("div", {
    className: "card signal-card motion-card",
    style: {
      padding: 28
    }
  }, React.createElement("div", {
    className: "stat-label",
    style: {
      marginBottom: 20
    }
  }, "Career Signal"), React.createElement("div", {
    style: {
      fontSize: 26,
      lineHeight: 1.2,
      fontWeight: 850,
      color: "#1b1b20",
      marginBottom: 16
    }
  }, "Placement path is healthy."), React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: "#747782"
    }
  }, "Your exam choices, college filters, and mock readiness are connected into one execution loop."))), React.createElement("div", {
    className: "card",
    style: {
      padding: 24,
      marginBottom: 20
    }
  }, React.createElement("div", {
    className: "flex justify-between items-center mb-3"
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0F172A",
      marginBottom: 2
    }
  }, "Career Readiness Signal"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#64748B"
    }
  }, "Based on your marks, mock tests & preparation activity")), React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: "#6366F1"
    }
  }, readiness, React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: "#94A3B8"
    }
  }, "/100"))), React.createElement("div", {
    className: "prog-bar"
  }, React.createElement("div", {
    className: "prog-fill",
    style: {
      width: `${readiness}%`,
      background: readiness >= 80 ? "#10B981" : readiness >= 60 ? "#6366F1" : "#F59E0B"
    }
  })), React.createElement("div", {
    className: "flex justify-between mt-2"
  }, React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#94A3B8"
    }
  }, "Beginner"), React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#94A3B8"
    }
  }, "Exam Ready"))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20,
      marginBottom: 20
    }
  }, React.createElement("div", {
    className: "card",
    style: {
      padding: 22
    }
  }, React.createElement("div", {
    className: "flex justify-between items-center mb-16",
    style: {
      marginBottom: 16
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0F172A"
    }
  }, "Recommended Exams"), React.createElement("button", {
    style: {
      fontSize: 12,
      color: "#6366F1",
      fontWeight: 600,
      background: "none",
      border: "none",
      cursor: "pointer"
    },
    onClick: () => onNav("exams")
  }, "View All")), React.createElement("div", {
    className: "flex flex-col gap-3"
  }, recommended.slice(0, 4).map(ex => React.createElement("div", {
    key: ex.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      background: "#F8FAFC",
      borderRadius: 10,
      border: "1px solid #F1F5F9"
    }
  }, React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: ex.color,
      flexShrink: 0
    }
  }), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13.5,
      color: "#0F172A"
    }
  }, ex.name), React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#94A3B8"
    }
  }, ex.cat, " \xB7 ", ex.level)), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2
    }
  }, Array.from({
    length: 5
  }).map((_, i) => React.createElement("div", {
    key: i,
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: i < ex.difficulty ? "#6366F1" : "#E2E8F0"
    }
  }))))))), React.createElement("div", {
    className: "flex flex-col gap-4"
  }, React.createElement("div", {
    className: "card",
    style: {
      padding: 22
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0F172A",
      marginBottom: 14
    }
  }, "Quick Actions"), React.createElement("div", {
    className: "flex flex-col gap-2"
  }, [{
    label: "Take a Mock Test",
    sub: "Practice with timed questions",
    tab: "tests",
    color: "#6366F1"
  }, {
    label: "Find Colleges",
    sub: "Filter by marks & budget",
    tab: "colleges",
    color: "#10B981"
  }, {
    label: "View Exam Dates",
    sub: "Key dates & deadlines",
    tab: "roadmap",
    color: "#F59E0B"
  }].map(a => React.createElement("button", {
    key: a.tab,
    onClick: () => onNav(a.tab),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 14px",
      background: "#F8FAFC",
      border: "1px solid #F1F5F9",
      borderRadius: 10,
      cursor: "pointer",
      textAlign: "left",
      transition: "all .18s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = "#6366F1",
    onMouseOut: e => e.currentTarget.style.borderColor = "#F1F5F9"
  }, React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: a.color,
      flexShrink: 0
    }
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13,
      color: "#0F172A"
    }
  }, a.label), React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#94A3B8"
    }
  }, a.sub)), React.createElement("div", {
    style: {
      marginLeft: "auto",
      color: "#CBD5E1",
      width: 16,
      height: 16
    }
  }, Icon.chevron))))), profile.marks < 75 && (profile.stream === "pcm" || profile.stream === "pcmb") && React.createElement("div", {
    style: {
      background: "#FFFBEB",
      border: "1px solid #FDE68A",
      borderRadius: 12,
      padding: "14px 16px"
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: "#92400E",
      marginBottom: 4
    }
  }, "Marks Alert"), React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#B45309",
      lineHeight: 1.5
    }
  }, "JEE Main requires 75% in 12th. Your current marks (", profile.marks, "%) may affect eligibility. Focus on improving board scores.")))), testHistory.length > 0 && React.createElement("div", {
    className: "card",
    style: {
      padding: 22
    }
  }, React.createElement("div", {
    className: "flex justify-between items-center mb-16",
    style: {
      marginBottom: 16
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0F172A"
    }
  }, "Recent Mock Tests"), React.createElement("button", {
    style: {
      fontSize: 12,
      color: "#6366F1",
      fontWeight: 600,
      background: "none",
      border: "none",
      cursor: "pointer"
    },
    onClick: () => onNav("progress")
  }, "Full History")), React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 13
    }
  }, React.createElement("thead", null, React.createElement("tr", {
    style: {
      borderBottom: "1px solid #F1F5F9"
    }
  }, ["Test", "Date", "Score", "Correct", "Time", "Result"].map(h => React.createElement("th", {
    key: h,
    style: {
      padding: "0 12px 10px",
      textAlign: "left",
      fontSize: 11,
      fontWeight: 700,
      color: "#94A3B8",
      textTransform: "uppercase",
      letterSpacing: ".05em"
    }
  }, h)))), React.createElement("tbody", null, testHistory.slice(-5).reverse().map((t, i) => React.createElement("tr", {
    key: i,
    style: {
      borderBottom: "1px solid #F8FAFC"
    }
  }, React.createElement("td", {
    style: {
      padding: "12px",
      fontWeight: 600,
      color: "#0F172A"
    }
  }, t.name), React.createElement("td", {
    style: {
      padding: "12px",
      color: "#64748B"
    }
  }, t.date), React.createElement("td", {
    style: {
      padding: "12px",
      fontWeight: 700,
      color: "#6366F1"
    }
  }, t.score, "/", t.total), React.createElement("td", {
    style: {
      padding: "12px",
      color: "#64748B"
    }
  }, t.correct, " correct"), React.createElement("td", {
    style: {
      padding: "12px",
      color: "#64748B"
    }
  }, t.timeTaken, "m"), React.createElement("td", {
    style: {
      padding: "12px"
    }
  }, React.createElement("span", {
    style: {
      padding: "3px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      background: t.percentage >= 60 ? "#ECFDF5" : "#FEF2F2",
      color: t.percentage >= 60 ? "#065F46" : "#991B1B"
    }
  }, t.percentage.toFixed(0), "%")))))))), testHistory.length === 0 && React.createElement("div", {
    className: "card",
    style: {
      padding: 32,
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      background: "#EEF2FF",
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px"
    }
  }, React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      color: "#6366F1"
    }
  }, Icon.test)), React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 16,
      color: "#0F172A",
      marginBottom: 6
    }
  }, "No tests taken yet"), React.createElement("p", {
    style: {
      fontSize: 13,
      color: "#64748B",
      marginBottom: 20,
      maxWidth: 320,
      margin: "0 auto 20px"
    }
  }, "Take your first mock test to get performance analytics and college cut-off eligibility predictions."), React.createElement("button", {
    className: "btn-primary",
    onClick: () => onNav("tests")
  }, "Start Mock Test")));
}
function ExamExplorer({
  profile
}) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [subTab, setSubTab] = useState("overview");
  const stream = profile.stream || "pcm";
  const cats = ["all", ...new Set(EXAMS.map(e => e.cat))];
  const visible = EXAMS.filter(e => {
    const streamOk = e.streams.includes(stream) || filter !== "all";
    const catOk = filter === "all" || e.cat === filter;
    return streamOk && catOk;
  });
  const exp = expanded ? EXAMS.find(e => e.id === expanded) : null;
  return React.createElement("div", null, React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".08em",
      color: "#6366F1",
      textTransform: "uppercase",
      marginBottom: 6
    }
  }, "Exam Explorer"), React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: "#0F172A",
      letterSpacing: "-.03em",
      marginBottom: 6
    }
  }, "All Entrance Exams"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "Detailed cut-offs, exam patterns, eligibility and preparation tips for every major exam.")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      borderBottom: "1px solid #E2E8F0",
      marginBottom: 24,
      overflowX: "auto"
    }
  }, cats.map(c => React.createElement("button", {
    key: c,
    className: `tab-btn ${filter === c ? "active" : ""}`,
    onClick: () => setFilter(c),
    style: {
      textTransform: "capitalize"
    }
  }, c === "all" ? "All Exams" : c))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: expanded ? "1fr" : "repeat(2,1fr)",
      gap: 16
    }
  }, visible.map(ex => React.createElement("div", {
    key: ex.id
  }, React.createElement("div", {
    className: `exam-card ${expanded === ex.id ? "expanded" : ""}`,
    onClick: () => setExpanded(expanded === ex.id ? null : ex.id)
  }, React.createElement("div", {
    className: "flex justify-between items-start mb-3"
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 4
    }
  }, React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: ex.color
    }
  }), React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 16,
      color: "#0F172A"
    }
  }, ex.name)), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#64748B"
    }
  }, ex.full)), React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, React.createElement("span", {
    className: "badge",
    style: {
      background: "#F1F5F9",
      color: "#475569"
    }
  }, ex.level), React.createElement("div", {
    style: {
      width: 16,
      height: 16,
      color: "#94A3B8",
      transform: expanded === ex.id ? "rotate(90deg)" : "none",
      transition: "transform .2s"
    }
  }, Icon.chevron))), React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      fontSize: 12,
      color: "#64748B",
      flexWrap: "wrap"
    }
  }, React.createElement("span", null, React.createElement("strong", {
    style: {
      color: "#374151"
    }
  }, "Conducting:"), " ", ex.conducting), React.createElement("span", null, React.createElement("strong", {
    style: {
      color: "#374151"
    }
  }, "Seats:"), " ", ex.seats), React.createElement("span", null, React.createElement("strong", {
    style: {
      color: "#374151"
    }
  }, "Sessions:"), " ", ex.sessions)), React.createElement("div", {
    className: "flex items-center gap-2 mt-3"
  }, React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#94A3B8"
    }
  }, "Difficulty:"), React.createElement("div", {
    style: {
      display: "flex",
      gap: 3
    }
  }, Array.from({
    length: 5
  }).map((_, i) => React.createElement("div", {
    key: i,
    style: {
      width: 14,
      height: 6,
      borderRadius: 3,
      background: i < ex.difficulty ? ex.color : "#E2E8F0"
    }
  }))), React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#94A3B8",
      marginLeft: 4
    }
  }, "Prep: ", ex.prepTime))), expanded === ex.id && exp && React.createElement("div", {
    className: "card fade-up",
    style: {
      padding: 24,
      marginTop: 8
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      borderBottom: "1px solid #E2E8F0",
      marginBottom: 20
    }
  }, ["overview", "pattern", "cutoffs", "colleges", "prep"].map(t => React.createElement("button", {
    key: t,
    className: `tab-btn ${subTab === t ? "active" : ""}`,
    onClick: () => setSubTab(t),
    style: {
      textTransform: "capitalize",
      fontSize: 12,
      padding: "8px 14px"
    }
  }, t === "cutoffs" ? "Cut-offs" : t === "prep" ? "Preparation" : t.charAt(0).toUpperCase() + t.slice(1)))), subTab === "overview" && React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#374151",
      marginBottom: 10
    }
  }, "Eligibility"), React.createElement("p", {
    style: {
      fontSize: 13,
      color: "#64748B",
      lineHeight: 1.7,
      background: "#F8FAFC",
      borderRadius: 8,
      padding: "12px 14px"
    }
  }, exp.eligibility), React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#374151",
      marginBottom: 8
    }
  }, "Key Dates 2025\u201326"), [["Registration", exp.dates.reg], ["Exam", exp.dates.exam], ["Result", exp.dates.result]].map(([k, v]) => React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid #F1F5F9",
      fontSize: 13
    }
  }, React.createElement("span", {
    style: {
      color: "#64748B"
    }
  }, k), React.createElement("span", {
    style: {
      fontWeight: 600,
      color: "#0F172A"
    }
  }, v))))), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#374151",
      marginBottom: 10
    }
  }, "Quick Stats"), [["Total Seats", exp.seats], ["Attempts Allowed", exp.attempts], ["Exam Mode", exp.pattern.mode || "CBT"], ["Avg. Salary Post-Admission", exp.avgSalary]].map(([k, v]) => React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid #F1F5F9",
      fontSize: 13
    }
  }, React.createElement("span", {
    style: {
      color: "#64748B"
    }
  }, k), React.createElement("span", {
    style: {
      fontWeight: 600,
      color: "#0F172A"
    }
  }, v))))), subTab === "pattern" && React.createElement("div", null, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 12,
      marginBottom: 20
    }
  }, [["Duration", exp.pattern.duration], ["Total Questions", exp.pattern.totalQ], ["Total Marks", exp.pattern.totalMarks]].map(([k, v]) => React.createElement("div", {
    key: k,
    style: {
      background: "#F8FAFC",
      borderRadius: 10,
      padding: "14px",
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: "#6366F1",
      marginBottom: 4
    }
  }, v), React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#94A3B8",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: ".05em"
    }
  }, k)))), React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#374151",
      marginBottom: 10
    }
  }, "Section Breakdown"), React.createElement("div", {
    style: {
      background: "#F8FAFC",
      borderRadius: 10,
      overflow: "hidden"
    }
  }, React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 13
    }
  }, React.createElement("thead", null, React.createElement("tr", {
    style: {
      borderBottom: "1px solid #E2E8F0"
    }
  }, ["Subject", "Questions", "Marks"].map(h => React.createElement("th", {
    key: h,
    style: {
      padding: "10px 16px",
      textAlign: "left",
      fontSize: 11,
      fontWeight: 700,
      color: "#94A3B8",
      textTransform: "uppercase"
    }
  }, h)))), React.createElement("tbody", null, exp.pattern.sections.map((s, i) => React.createElement("tr", {
    key: i,
    style: {
      borderBottom: "1px solid #F1F5F9"
    }
  }, React.createElement("td", {
    style: {
      padding: "10px 16px",
      fontWeight: 600,
      color: "#0F172A"
    }
  }, s.name), React.createElement("td", {
    style: {
      padding: "10px 16px",
      color: "#64748B"
    }
  }, s.q), React.createElement("td", {
    style: {
      padding: "10px 16px",
      fontWeight: 600,
      color: "#6366F1"
    }
  }, s.m)))))), React.createElement("div", {
    style: {
      marginTop: 14,
      background: "#FFF7ED",
      border: "1px solid #FED7AA",
      borderRadius: 10,
      padding: "12px 14px"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "#92400E",
      marginBottom: 4
    }
  }, "Marking Scheme"), React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#B45309",
      lineHeight: 1.6
    }
  }, exp.pattern.marking))), subTab === "cutoffs" && React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#374151",
      marginBottom: 12
    }
  }, "Category-wise Cut-offs (Last 2 Years)"), Object.entries(exp.cutoff || {}).slice(0, 2).map(([yr, vals]) => React.createElement("div", {
    key: yr,
    style: {
      marginBottom: 16
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "#6366F1",
      marginBottom: 8
    }
  }, yr), React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap"
    }
  }, Object.entries(vals).map(([cat, val]) => React.createElement("div", {
    key: cat,
    style: {
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      borderRadius: 8,
      padding: "8px 14px",
      textAlign: "center",
      minWidth: 80
    }
  }, React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: "#0F172A"
    }
  }, val), React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#94A3B8",
      fontWeight: 700,
      textTransform: "uppercase",
      marginTop: 2
    }
  }, cat === "general" ? "GEN" : cat === "obcNcl" ? "OBC-NCL" : cat === "ews" ? "EWS" : cat.toUpperCase())))))), React.createElement("div", {
    style: {
      background: "#EEF2FF",
      border: "1px solid #C7D2FE",
      borderRadius: 10,
      padding: "12px 14px",
      marginTop: 4
    }
  }, React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#4338CA",
      lineHeight: 1.6
    }
  }, React.createElement("strong", null, "Note:"), " Percentile shown for JEE Main; total marks shown for NEET, BITSAT; raw score shown for CLAT/AILET. Cut-offs vary by college/course."))), subTab === "colleges" && React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#374151",
      marginBottom: 12
    }
  }, "Top Colleges via ", exp.name), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, exp.topColleges.map((c, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      background: "#F8FAFC",
      borderRadius: 10,
      border: "1px solid #F1F5F9"
    }
  }, React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      background: "#EEF2FF",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 800,
      color: "#6366F1",
      flexShrink: 0
    }
  }, "#", i + 1), React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13.5,
      color: "#0F172A"
    }
  }, c))))), subTab === "prep" && exp.preparation && React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#374151",
      marginBottom: 8
    }
  }, "Key Topics to Focus"), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, exp.preparation.keyTopics.map((t, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      background: "#F8FAFC",
      borderRadius: 8
    }
  }, React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#6366F1",
      flexShrink: 0
    }
  }), React.createElement("span", {
    style: {
      fontSize: 13,
      color: "#374151"
    }
  }, t))))), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#374151",
      marginBottom: 8
    }
  }, "Recommended Books"), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, exp.preparation.resources.map((r, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      background: "#F8FAFC",
      borderRadius: 8
    }
  }, React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#10B981",
      flexShrink: 0
    }
  }), React.createElement("span", {
    style: {
      fontSize: 13,
      color: "#374151"
    }
  }, r)))))), React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 16,
      borderTop: "1px solid #F1F5F9",
      display: "flex",
      justifyContent: "flex-end"
    }
  }, React.createElement("a", {
    href: exp.officialSite,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontSize: 12,
      color: "#6366F1",
      fontWeight: 600,
      textDecoration: "none"
    }
  }, "Official Website \u2192")))))));
}
function CollegeFinder({
  profile
}) {
  const [exam, setExam] = useState("jee_main");
  const [score, setScore] = useState("");
  const [category, setCategory] = useState("general");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searched, setSearched] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const examObj = EXAMS.find(e => e.id === exam);
  const streamExams = EXAMS.filter(e => e.streams.includes(profile.stream || "pcm"));
  const handleSearch = () => {
    if (score) setSearched(true);
  };
  const rawResults = searched && score ? getCollegesByExamScore(exam, Number(score), category) : [];
  const results = rawResults.filter(c => {
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (budgetFilter === "all") return true;
    const fees = parseFloat((c.fees || "0").replace(/[^0-9.]/g, ""));
    if (budgetFilter === "under1" && fees > 1) return false;
    if (budgetFilter === "1to5" && (fees < 1 || fees > 5)) return false;
    if (budgetFilter === "above5" && fees < 5) return false;
    return true;
  });
  const statusConfig = {
    safe: {
      label: "Safe Bet",
      color: "#10B981",
      bg: "#ECFDF5"
    },
    moderate: {
      label: "Moderate",
      color: "#F59E0B",
      bg: "#FFFBEB"
    },
    reach: {
      label: "Reach",
      color: "#EF4444",
      bg: "#FEF2F2"
    }
  };
  return React.createElement("div", null, React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".08em",
      color: "#6366F1",
      textTransform: "uppercase",
      marginBottom: 6
    }
  }, "College Finder"), React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: "#0F172A",
      letterSpacing: "-.03em",
      marginBottom: 6
    }
  }, "Find Your Best-Fit Colleges"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "Enter your score/percentile to see which colleges you can safely target, with real cut-off data.")), React.createElement("div", {
    className: "card",
    style: {
      padding: 24,
      marginBottom: 24
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 16,
      marginBottom: 16
    }
  }, React.createElement("div", null, React.createElement("label", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6
    }
  }, "Entrance Exam"), React.createElement("select", {
    className: "inp",
    value: exam,
    onChange: e => {
      setExam(e.target.value);
      setSearched(false);
    }
  }, EXAMS.map(e => React.createElement("option", {
    key: e.id,
    value: e.id
  }, e.name)))), React.createElement("div", null, React.createElement("label", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6
    }
  }, "Your Score / Percentile", React.createElement("span", {
    style: {
      fontWeight: 400,
      color: "#94A3B8",
      marginLeft: 4
    }
  }, "(", exam === "jee_main" || exam === "mht_cet" || exam === "kcet" || exam === "wbjee" ? "percentile" : exam === "neet" || exam === "bitsat" || exam === "clat" || exam === "ailet" || exam === "nata" ? "marks out of " + examObj?.pattern?.totalMarks : "rank/score", ")")), React.createElement("input", {
    className: "inp",
    type: "number",
    placeholder: "Enter your score...",
    value: score,
    onChange: e => {
      setScore(e.target.value);
      setSearched(false);
    }
  })), React.createElement("div", null, React.createElement("label", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6
    }
  }, "Category"), React.createElement("select", {
    className: "inp",
    value: category,
    onChange: e => setCategory(e.target.value)
  }, React.createElement("option", {
    value: "general"
  }, "General"), React.createElement("option", {
    value: "obc"
  }, "OBC-NCL"), React.createElement("option", {
    value: "sc"
  }, "SC"), React.createElement("option", {
    value: "st"
  }, "ST"), React.createElement("option", {
    value: "ews"
  }, "EWS")))), React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-end"
    }
  }, React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("label", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6
    }
  }, "College Type"), React.createElement("select", {
    className: "inp",
    value: typeFilter,
    onChange: e => setTypeFilter(e.target.value)
  }, React.createElement("option", {
    value: "all"
  }, "All Types"), React.createElement("option", {
    value: "Govt"
  }, "Government"), React.createElement("option", {
    value: "State Govt"
  }, "State Government"), React.createElement("option", {
    value: "Govt-Aided"
  }, "Government Aided"), React.createElement("option", {
    value: "Deemed"
  }, "Deemed University"), React.createElement("option", {
    value: "Private"
  }, "Private"))), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("label", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6
    }
  }, "Fee Range"), React.createElement("select", {
    className: "inp",
    value: budgetFilter,
    onChange: e => setBudgetFilter(e.target.value)
  }, React.createElement("option", {
    value: "all"
  }, "Any Budget"), React.createElement("option", {
    value: "under1"
  }, "Under \u20B91L/yr"), React.createElement("option", {
    value: "1to5"
  }, "\u20B91\u20135L/yr"), React.createElement("option", {
    value: "above5"
  }, "\u20B95L+/yr"))), React.createElement("button", {
    className: "btn-primary",
    style: {
      flexShrink: 0,
      height: 40
    },
    onClick: handleSearch,
    disabled: !score
  }, "Search Colleges"))), searched && React.createElement("div", null, React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginBottom: 16
    }
  }, Object.entries(statusConfig).map(([k, v]) => {
    const count = results.filter(r => r.status === k).length;
    return React.createElement("div", {
      key: k,
      style: {
        background: v.bg,
        border: `1px solid ${v.color}33`,
        borderRadius: 10,
        padding: "10px 16px",
        flex: 1,
        textAlign: "center"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 800,
        color: v.color
      }
    }, count), React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: v.color
      }
    }, v.label));
  }), React.createElement("div", {
    style: {
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      padding: "10px 16px",
      flex: 1,
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: "#0F172A"
    }
  }, results.length), React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B"
    }
  }, "Total Matches"))), results.length === 0 ? React.createElement("div", {
    className: "card",
    style: {
      padding: 32,
      textAlign: "center"
    }
  }, React.createElement("p", {
    style: {
      fontWeight: 600,
      color: "#0F172A",
      marginBottom: 8
    }
  }, "No colleges found for this score/filter combination."), React.createElement("p", {
    style: {
      fontSize: 13,
      color: "#64748B"
    }
  }, "Try a different exam, score range, or widen the filters above.")) : React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, ["safe", "moderate", "reach"].map(status => {
    const group = results.filter(r => r.status === status);
    if (!group.length) return null;
    const cfg = statusConfig[status];
    return React.createElement("div", {
      key: status
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: cfg.color,
        textTransform: "uppercase",
        letterSpacing: ".06em",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: cfg.color
      }
    }), cfg.label, " (", group.length, ")"), React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, group.map(c => React.createElement("div", {
      key: c.id,
      className: "card",
      style: {
        padding: 18,
        display: "flex",
        alignItems: "center",
        gap: 16
      }
    }, React.createElement("div", {
      style: {
        flex: 1
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 4
      }
    }, React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: 15,
        color: "#0F172A"
      }
    }, c.name), React.createElement("span", {
      className: "badge",
      style: {
        background: cfg.bg,
        color: cfg.color
      }
    }, cfg.label), React.createElement("span", {
      className: "badge",
      style: {
        background: "#F1F5F9",
        color: "#64748B"
      }
    }, c.type)), React.createElement("div", {
      style: {
        fontSize: 12,
        color: "#64748B",
        marginBottom: 8
      }
    }, c.location, " \xB7 ", c.rank), React.createElement("div", {
      style: {
        display: "flex",
        gap: 20,
        fontSize: 12
      }
    }, React.createElement("span", {
      style: {
        color: "#374151"
      }
    }, React.createElement("strong", null, "Cut-off:"), " ", c.cutoffForCat, " (", category.toUpperCase(), ")"), React.createElement("span", {
      style: {
        color: "#374151"
      }
    }, React.createElement("strong", null, "Fees:"), " ", c.fees), React.createElement("span", {
      style: {
        color: "#374151"
      }
    }, React.createElement("strong", null, "Placements:"), " ", c.placements))), React.createElement("div", {
      style: {
        display: "flex",
        gap: 2
      }
    }, Array.from({
      length: c.stars || 3
    }).map((_, i) => React.createElement("div", {
      key: i,
      style: {
        width: 14,
        height: 14,
        color: "#F59E0B"
      }
    }, Icon.star))), React.createElement("button", {
      onClick: () => setWishlist(w => w.includes(c.id) ? w.filter(x => x !== c.id) : [...w, c.id]),
      style: {
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: "1.5px solid #E2E8F0",
        background: wishlist.includes(c.id) ? "#FEE2E2" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: wishlist.includes(c.id) ? "#EF4444" : "#CBD5E1"
      }
    }, React.createElement("div", {
      style: {
        width: 16,
        height: 16
      }
    }, Icon.heart))))));
  }))), !searched && React.createElement("div", {
    className: "card",
    style: {
      padding: 32,
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      background: "#EEF2FF",
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px"
    }
  }, React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      color: "#6366F1"
    }
  }, Icon.college)), React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 16,
      color: "#0F172A",
      marginBottom: 6
    }
  }, "Enter your score to find colleges"), React.createElement("p", {
    style: {
      fontSize: 13,
      color: "#64748B"
    }
  }, "We'll match your score against 2024 cut-offs across 25+ top colleges and show Safe, Moderate & Reach options.")));
}
function MockTests({
  profile,
  onTestComplete
}) {
  const [phase, setPhase] = useState("select");
  const [cfg, setCfg] = useState({
    exam: "jee_main",
    subject: "physics",
    type: "quick",
    chapter: "all"
  });
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewed, setReviewed] = useState({});
  const [timer, setTimer] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const [resultData, setResultData] = useState(null);
  const examOpts = EXAMS.filter(e => e.streams.includes(profile.stream || "pcm"));
  const subjectMap = {
    jee_main: ["physics", "chemistry", "maths"],
    neet: ["physics", "chemistry", "biology"],
    clat: ["legal", "english"]
  };
  const subjects = subjectMap[cfg.exam] || ["physics", "chemistry", "maths"];
  const qTypeMap = {
    quick: 10,
    chapter: 20,
    full: 30
  };
  const buildQuestions = () => {
    const pool = QB[cfg.exam]?.[cfg.subject] || QB.jee_main.physics;
    const count = qTypeMap[cfg.type] || 10;
    const shuffled = [...pool].sort(() => Math.random() - .5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };
  const startTest = () => {
    const qs = buildQuestions();
    setQuestions(qs);
    setAnswers({});
    setReviewed({});
    setCurrent(0);
    setTimer(0);
    setShowSol(false);
    setPhase("running");
  };
  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);
  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const submitTest = () => {
    let correct = 0,
      wrong = 0,
      unattempted = 0;
    questions.forEach((q, i) => {
      if (answers[i] === undefined) unattempted++;else if (answers[i] === q.ans) correct++;else wrong++;
    });
    const score = correct * 4 - wrong;
    const total = questions.length * 4;
    const pct = Math.max(0, score / total * 100);
    const examLabel = EXAMS.find(e => e.id === cfg.exam)?.name || cfg.exam;
    const rd = {
      name: `${examLabel} — ${cfg.subject.charAt(0).toUpperCase() + cfg.subject.slice(1)}`,
      exam: cfg.exam,
      subject: cfg.subject,
      type: cfg.type,
      date: new Date().toLocaleDateString("en-IN"),
      score,
      total,
      correct,
      wrong,
      unattempted,
      timeTaken: Math.round(timer / 60) || 1,
      percentage: pct
    };
    setResultData(rd);
    onTestComplete(rd);
    setPhase("result");
  };
  if (phase === "select") return React.createElement("div", null, React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".08em",
      color: "#6366F1",
      textTransform: "uppercase",
      marginBottom: 6
    }
  }, "Mock Tests"), React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: "#0F172A",
      letterSpacing: "-.03em",
      marginBottom: 6
    }
  }, "Practice & Improve"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "Take chapter-wise or full mock tests. Track accuracy per topic to find and fix weak areas.")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24
    }
  }, React.createElement("div", {
    className: "card",
    style: {
      padding: 24
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0F172A",
      marginBottom: 18
    }
  }, "Configure Your Test"), React.createElement("div", {
    className: "flex flex-col gap-4"
  }, React.createElement("div", null, React.createElement("label", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6
    }
  }, "Exam"), React.createElement("select", {
    className: "inp",
    value: cfg.exam,
    onChange: e => setCfg(c => ({
      ...c,
      exam: e.target.value,
      subject: subjectMap[e.target.value]?.[0] || "physics"
    }))
  }, examOpts.map(e => React.createElement("option", {
    key: e.id,
    value: e.id
  }, e.name)))), React.createElement("div", null, React.createElement("label", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6
    }
  }, "Subject"), React.createElement("select", {
    className: "inp",
    value: cfg.subject,
    onChange: e => setCfg(c => ({
      ...c,
      subject: e.target.value
    }))
  }, subjects.map(s => React.createElement("option", {
    key: s,
    value: s
  }, s.charAt(0).toUpperCase() + s.slice(1))))), React.createElement("div", null, React.createElement("label", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 8
    }
  }, "Test Type"), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 8
    }
  }, [{
    id: "quick",
    label: "Quick Test",
    q: 10,
    time: "~15 min"
  }, {
    id: "chapter",
    label: "Chapter Test",
    q: 20,
    time: "~30 min"
  }, {
    id: "full",
    label: "Full Mock",
    q: 30,
    time: "~45 min"
  }].map(t => React.createElement("button", {
    key: t.id,
    className: `ob-tile ${cfg.type === t.id ? "sel" : ""}`,
    onClick: () => setCfg(c => ({
      ...c,
      type: t.id
    })),
    style: {
      padding: "12px 8px"
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: "#0F172A",
      marginBottom: 2
    }
  }, t.label), React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#94A3B8"
    }
  }, t.q, " Qs \xB7 ", t.time))))), React.createElement("button", {
    className: "btn-primary w-full",
    style: {
      marginTop: 8
    },
    onClick: startTest
  }, "Start Test"))), React.createElement("div", {
    className: "flex flex-col gap-4"
  }, React.createElement("div", {
    className: "card",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: "#0F172A",
      marginBottom: 12
    }
  }, "How It Works"), [["Choose exam & subject", "Focus on weak areas by picking specific subjects"], ["Answer timed questions", "Every question has a timer — just like the real exam"], ["Get instant results", "See score, accuracy, and chapter-wise breakdown"], ["Track your progress", "All tests saved. Watch your improvement over time"]].map(([t, d], i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      marginBottom: i < 3 ? 12 : 0
    }
  }, React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      background: "#EEF2FF",
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontSize: 11,
      fontWeight: 800,
      color: "#6366F1"
    }
  }, i + 1), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "#0F172A",
      marginBottom: 2
    }
  }, t), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#64748B"
    }
  }, d))))), React.createElement("div", {
    className: "card",
    style: {
      padding: 20,
      background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)"
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: "#4338CA",
      marginBottom: 8
    }
  }, "Available Question Bank"), [["JEE Main", "Physics, Chemistry, Maths", "24 questions"], ["NEET", "Biology, Physics, Chemistry", "14 questions"], ["CLAT", "Legal Reasoning, English", "5 questions"]].map(([e, s, q]) => React.createElement("div", {
    key: e,
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid rgba(99,102,241,.1)",
      fontSize: 13
    }
  }, React.createElement("span", {
    style: {
      fontWeight: 600,
      color: "#4338CA"
    }
  }, e), React.createElement("span", {
    style: {
      color: "#6366F1"
    }
  }, q)))))));
  if (phase === "running") {
    const q = questions[current];
    const answered = Object.keys(answers).length;
    return React.createElement("div", {
      style: {
        maxWidth: 760,
        margin: "0 auto"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
      }
    }, React.createElement("div", null, React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: "#6366F1"
      }
    }, "Question ", current + 1, " of ", questions.length), React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#94A3B8",
        marginTop: 2
      }
    }, q.chapter, " \xB7 ", q.diff)), React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        alignItems: "center"
      }
    }, React.createElement("div", {
      style: {
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderRadius: 8,
        padding: "8px 14px",
        fontFamily: "monospace",
        fontSize: 16,
        fontWeight: 700,
        color: "#0F172A"
      }
    }, fmtTime(timer)), React.createElement("button", {
      className: "btn-primary",
      style: {
        padding: "8px 18px",
        fontSize: 13
      },
      onClick: submitTest
    }, "Submit Test"))), React.createElement("div", {
      className: "prog-bar",
      style: {
        marginBottom: 20
      }
    }, React.createElement("div", {
      className: "prog-fill",
      style: {
        width: `${answered / questions.length * 100}%`,
        background: "#6366F1"
      }
    })), React.createElement("div", {
      className: "card",
      style: {
        padding: 28,
        marginBottom: 16
      }
    }, React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: "#0F172A",
        lineHeight: 1.7,
        marginBottom: 24
      }
    }, q.q), React.createElement("div", {
      className: "flex flex-col gap-3"
    }, q.opts.map((opt, i) => {
      let cls = "opt-btn";
      if (showSol) {
        if (i === q.ans) cls += " correct";else if (answers[current] === i) cls += " wrong";
      } else if (answers[current] === i) cls += " selected";
      return React.createElement("button", {
        key: i,
        className: cls,
        onClick: () => {
          if (!showSol) setAnswers(a => ({
            ...a,
            [current]: i
          }));
        }
      }, React.createElement("span", {
        style: {
          fontWeight: 600,
          color: "#94A3B8",
          marginRight: 12
        }
      }, String.fromCharCode(65 + i), "."), opt);
    })), showSol && React.createElement("div", {
      style: {
        marginTop: 16,
        background: "#ECFDF5",
        border: "1px solid #6EE7B7",
        borderRadius: 10,
        padding: "12px 16px"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: "#065F46",
        marginBottom: 4
      }
    }, "Solution"), React.createElement("div", {
      style: {
        fontSize: 13,
        color: "#064E3B"
      }
    }, q.sol))), React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, React.createElement("button", {
      className: "btn-outline",
      style: {
        padding: "9px 18px",
        fontSize: 13
      },
      disabled: current === 0,
      onClick: () => {
        setCurrent(c => c - 1);
        setShowSol(false);
      }
    }, "Previous"), React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, React.createElement("button", {
      style: {
        fontSize: 12,
        color: "#F59E0B",
        fontWeight: 600,
        background: "#FFFBEB",
        border: "1px solid #FDE68A",
        borderRadius: 8,
        padding: "8px 14px",
        cursor: "pointer"
      },
      onClick: () => setReviewed(r => ({
        ...r,
        [current]: !r[current]
      }))
    }, reviewed[current] ? "Unmark" : "Mark for Review"), React.createElement("button", {
      style: {
        fontSize: 12,
        color: "#64748B",
        fontWeight: 600,
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderRadius: 8,
        padding: "8px 14px",
        cursor: "pointer"
      },
      onClick: () => setShowSol(s => !s)
    }, showSol ? "Hide" : "Show", " Solution")), current < questions.length - 1 ? React.createElement("button", {
      className: "btn-primary",
      style: {
        padding: "9px 18px",
        fontSize: 13
      },
      onClick: () => {
        setCurrent(c => c + 1);
        setShowSol(false);
      }
    }, "Next") : React.createElement("button", {
      className: "btn-primary",
      style: {
        padding: "9px 18px",
        fontSize: 13,
        background: "#10B981"
      },
      onClick: submitTest
    }, "Finish Test")), React.createElement("div", {
      className: "card",
      style: {
        padding: 16,
        marginTop: 20
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: "#374151",
        marginBottom: 10
      }
    }, "Question Palette"), React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, questions.map((_, i) => {
      const col = i === current ? "#6366F1" : answers[i] !== undefined ? "#10B981" : reviewed[i] ? "#F59E0B" : "#E2E8F0";
      const tcol = i === current || answers[i] !== undefined ? "#fff" : reviewed[i] ? "#92400E" : "#64748B";
      return React.createElement("button", {
        key: i,
        onClick: () => {
          setCurrent(i);
          setShowSol(false);
        },
        style: {
          width: 32,
          height: 32,
          borderRadius: 6,
          background: col,
          color: tcol,
          fontSize: 12,
          fontWeight: 700,
          border: "none",
          cursor: "pointer"
        }
      }, i + 1);
    })), React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        marginTop: 12,
        fontSize: 11,
        color: "#64748B"
      }
    }, [["#6366F1", "Current"], ["#10B981", "Answered"], ["#F59E0B", "For Review"], ["#E2E8F0", "Not Visited"]].map(([c, l]) => React.createElement("div", {
      key: l,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 4
      }
    }, React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 3,
        background: c
      }
    }), l)))));
  }
  if (phase === "result" && resultData) {
    const {
      correct,
      wrong,
      unattempted,
      score,
      total,
      percentage,
      timeTaken
    } = resultData;
    const perc = estimatePercentile(score, cfg.exam);
    return React.createElement("div", {
      style: {
        maxWidth: 760,
        margin: "0 auto"
      }
    }, React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 28
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".08em",
        color: "#6366F1",
        textTransform: "uppercase",
        marginBottom: 8
      }
    }, "Test Complete"), React.createElement("h2", {
      style: {
        fontSize: 28,
        fontWeight: 800,
        color: "#0F172A",
        letterSpacing: "-.03em",
        marginBottom: 6
      }
    }, percentage >= 60 ? "Great performance!" : percentage >= 40 ? "Keep practising!" : "Need more work"), React.createElement("p", {
      style: {
        color: "#64748B",
        fontSize: 14
      }
    }, "Your detailed results are below. Review solutions and focus on weak areas.")), React.createElement("div", {
      className: "card",
      style: {
        padding: 32,
        textAlign: "center",
        marginBottom: 20
      }
    }, React.createElement("div", {
      style: {
        fontSize: 56,
        fontWeight: 900,
        color: percentage >= 60 ? "#10B981" : percentage >= 40 ? "#F59E0B" : "#EF4444",
        letterSpacing: "-.04em",
        marginBottom: 4
      }
    }, percentage.toFixed(0), React.createElement("span", {
      style: {
        fontSize: 24,
        color: "#94A3B8"
      }
    }, "%")), React.createElement("div", {
      style: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 20
      }
    }, "Score: ", score, "/", total, " \xB7 Time: ", timeTaken, " min"), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 12
      }
    }, [{
      label: "Correct",
      val: correct,
      col: "#10B981",
      bg: "#ECFDF5"
    }, {
      label: "Wrong",
      val: wrong,
      col: "#EF4444",
      bg: "#FEF2F2"
    }, {
      label: "Skipped",
      val: unattempted,
      col: "#94A3B8",
      bg: "#F1F5F9"
    }, {
      label: "Percentile (est.)",
      val: `~${perc}`,
      col: "#6366F1",
      bg: "#EEF2FF"
    }].map(s => React.createElement("div", {
      key: s.label,
      style: {
        background: s.bg,
        borderRadius: 12,
        padding: "16px 10px"
      }
    }, React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 800,
        color: s.col,
        marginBottom: 4
      }
    }, s.val), React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#94A3B8",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: ".05em"
      }
    }, s.label))))), React.createElement("div", {
      className: "card",
      style: {
        padding: 22,
        marginBottom: 20
      }
    }, React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 15,
        color: "#0F172A",
        marginBottom: 16
      }
    }, "Question-by-Question Review"), React.createElement("div", {
      className: "flex flex-col gap-3"
    }, questions.map((q, i) => {
      const ua = answers[i];
      const isCorrect = ua === q.ans;
      const isSkip = ua === undefined;
      const col = isSkip ? "#94A3B8" : isCorrect ? "#10B981" : "#EF4444";
      const bg = isSkip ? "#F8FAFC" : isCorrect ? "#ECFDF5" : "#FEF2F2";
      return React.createElement("div", {
        key: i,
        style: {
          background: bg,
          border: `1px solid ${col}33`,
          borderRadius: 10,
          padding: "12px 16px"
        }
      }, React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6
        }
      }, React.createElement("div", {
        style: {
          fontSize: 12,
          fontWeight: 700,
          color: col
        }
      }, "Q", i + 1, " \xB7 ", isSkip ? "Skipped" : isCorrect ? "Correct" : "Wrong"), React.createElement("div", {
        style: {
          fontSize: 11,
          color: "#94A3B8"
        }
      }, q.chapter)), React.createElement("div", {
        style: {
          fontSize: 13,
          color: "#374151",
          marginBottom: 6,
          lineHeight: 1.5
        }
      }, q.q), React.createElement("div", {
        style: {
          fontSize: 12,
          color: "#6366F1"
        }
      }, "Correct: ", q.opts[q.ans]), !isCorrect && ua !== undefined && React.createElement("div", {
        style: {
          fontSize: 12,
          color: "#EF4444"
        }
      }, "Your answer: ", q.opts[ua]), React.createElement("div", {
        style: {
          fontSize: 12,
          color: "#64748B",
          marginTop: 4,
          fontStyle: "italic"
        }
      }, q.sol));
    }))), React.createElement("div", {
      style: {
        display: "flex",
        gap: 12
      }
    }, React.createElement("button", {
      className: "btn-outline flex-1",
      onClick: () => setPhase("select")
    }, "New Test"), React.createElement("button", {
      className: "btn-primary flex-1",
      onClick: () => setPhase("select")
    }, "Back to Tests")));
  }
  return null;
}
function ProgressTracker({
  testHistory,
  profile
}) {
  const [selExam, setSelExam] = useState("all");
  const filtered = selExam === "all" ? testHistory : testHistory.filter(t => t.exam === selExam);
  const avg = filtered.length ? filtered.reduce((s, t) => s + t.percentage, 0) / filtered.length : 0;
  const best = filtered.length ? Math.max(...filtered.map(t => t.percentage)) : 0;
  const totalQ = filtered.reduce((s, t) => s + (t.correct || 0) + (t.wrong || 0) + (t.unattempted || 0), 0);
  const totalCorrect = filtered.reduce((s, t) => s + (t.correct || 0), 0);
  const accuracy = totalQ ? totalCorrect / totalQ * 100 : 0;
  function LineChart({
    data
  }) {
    if (!data.length) return null;
    const W = 500,
      H = 100,
      pad = 20;
    const vals = data.map(d => d.percentage);
    const max = Math.max(100, ...vals);
    const xs = data.map((_, i) => pad + i / (data.length - 1 || 1) * (W - 2 * pad));
    const ys = vals.map(v => H - pad - v / max * (H - 2 * pad));
    const path = "M" + xs.map((x, i) => `${x},${ys[i]}`).join("L");
    const area = `M${xs[0]},${H - pad}L` + xs.map((x, i) => `${x},${ys[i]}`).join("L") + `L${xs[xs.length - 1]},${H - pad}Z`;
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: {
        width: "100%",
        height: "auto"
      }
    }, React.createElement("defs", null, React.createElement("linearGradient", {
      id: "chartGrad",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, React.createElement("stop", {
      offset: "0%",
      stopColor: "#6366F1",
      stopOpacity: ".25"
    }), React.createElement("stop", {
      offset: "100%",
      stopColor: "#6366F1",
      stopOpacity: "0"
    }))), React.createElement("path", {
      d: area,
      fill: "url(#chartGrad)"
    }), React.createElement("path", {
      d: path,
      fill: "none",
      stroke: "#6366F1",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), xs.map((x, i) => React.createElement("g", {
      key: i
    }, React.createElement("circle", {
      cx: x,
      cy: ys[i],
      r: "4",
      fill: "#6366F1"
    }), React.createElement("text", {
      x: x,
      y: ys[i] - 8,
      textAnchor: "middle",
      fontSize: "9",
      fill: "#6366F1",
      fontWeight: "700"
    }, vals[i].toFixed(0), "%"))));
  }
  const subjStats = {};
  testHistory.forEach(t => {
    const s = t.subject || "General";
    if (!subjStats[s]) subjStats[s] = {
      pct: [],
      correct: 0,
      total: 0
    };
    subjStats[s].pct.push(t.percentage);
    subjStats[s].correct += t.correct || 0;
    subjStats[s].total += (t.correct || 0) + (t.wrong || 0) + (t.unattempted || 0);
  });
  const subjArr = Object.entries(subjStats).map(([s, d]) => ({
    subject: s,
    avg: d.pct.reduce((a, b) => a + b, 0) / d.pct.length,
    count: d.pct.length
  }));
  return React.createElement("div", null, React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".08em",
      color: "#6366F1",
      textTransform: "uppercase",
      marginBottom: 6
    }
  }, "Progress Tracker"), React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: "#0F172A",
      letterSpacing: "-.03em",
      marginBottom: 6
    }
  }, "Your Performance Analytics"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "Track your improvement over time, identify weak areas, and predict your college eligibility.")), testHistory.length === 0 ? React.createElement("div", {
    className: "card",
    style: {
      padding: 48,
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      background: "#EEF2FF",
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px"
    }
  }, React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      color: "#6366F1"
    }
  }, Icon.progress)), React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 16,
      color: "#0F172A",
      marginBottom: 6
    }
  }, "No test data yet"), React.createElement("p", {
    style: {
      fontSize: 13,
      color: "#64748B"
    }
  }, "Complete at least one mock test to see your performance analytics here.")) : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "flex gap-3 mb-5 items-center"
  }, React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "#374151"
    }
  }, "Filter by exam:"), React.createElement("select", {
    className: "inp",
    style: {
      width: "auto"
    },
    value: selExam,
    onChange: e => setSelExam(e.target.value)
  }, React.createElement("option", {
    value: "all"
  }, "All Exams"), [...new Set(testHistory.map(t => t.exam))].map(e => React.createElement("option", {
    key: e,
    value: e
  }, EXAMS.find(ex => ex.id === e)?.name || e)))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 14,
      marginBottom: 20
    }
  }, [{
    label: "Tests Taken",
    val: filtered.length,
    col: "#6366F1"
  }, {
    label: "Average Score",
    val: `${avg.toFixed(1)}%`,
    col: "#10B981"
  }, {
    label: "Best Score",
    val: `${best.toFixed(1)}%`,
    col: "#F59E0B"
  }, {
    label: "Accuracy",
    val: `${accuracy.toFixed(0)}%`,
    col: "#8B5CF6"
  }].map(s => React.createElement("div", {
    key: s.label,
    className: "stat-card"
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#94A3B8",
      textTransform: "uppercase",
      letterSpacing: ".07em",
      marginBottom: 10
    }
  }, s.label), React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 800,
      color: s.col
    }
  }, s.val)))), filtered.length > 1 && React.createElement("div", {
    className: "card",
    style: {
      padding: 24,
      marginBottom: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0F172A",
      marginBottom: 16
    }
  }, "Score Trend"), React.createElement(LineChart, {
    data: filtered
  }), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 8,
      fontSize: 11,
      color: "#94A3B8"
    }
  }, filtered.map((t, i) => React.createElement("span", {
    key: i
  }, t.date)))), subjArr.length > 0 && React.createElement("div", {
    className: "card",
    style: {
      padding: 24,
      marginBottom: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0F172A",
      marginBottom: 16
    }
  }, "Subject-wise Performance"), React.createElement("div", {
    className: "flex flex-col gap-4"
  }, subjArr.map(s => {
    const col = s.avg >= 70 ? "#10B981" : s.avg >= 50 ? "#6366F1" : "#EF4444";
    return React.createElement("div", {
      key: s.subject
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 6
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: "#374151"
      }
    }, s.subject), React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        alignItems: "center"
      }
    }, React.createElement("span", {
      style: {
        fontSize: 11,
        color: "#94A3B8"
      }
    }, s.count, " test", s.count > 1 ? "s" : ""), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: col
      }
    }, s.avg.toFixed(0), "%"))), React.createElement("div", {
      className: "prog-bar"
    }, React.createElement("div", {
      className: "prog-fill",
      style: {
        width: `${s.avg}%`,
        background: col
      }
    })));
  })), React.createElement("div", {
    style: {
      marginTop: 16,
      padding: "12px 14px",
      background: "#F8FAFC",
      borderRadius: 10,
      border: "1px solid #E2E8F0"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "#374151",
      marginBottom: 4
    }
  }, "Focus Recommendation"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#64748B"
    }
  }, subjArr.sort((a, b) => a.avg - b.avg)[0] && `Your weakest area is "${subjArr.sort((a, b) => a.avg - b.avg)[0].subject}" (${subjArr.sort((a, b) => a.avg - b.avg)[0].avg.toFixed(0)}%). Spend extra time practising this subject.`))), React.createElement("div", {
    className: "card",
    style: {
      padding: 22
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0F172A",
      marginBottom: 16
    }
  }, "Full Test History"), React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 13
    }
  }, React.createElement("thead", null, React.createElement("tr", {
    style: {
      borderBottom: "2px solid #F1F5F9"
    }
  }, ["#", "Test Name", "Date", "Score", "Accuracy", "Time", "Result"].map(h => React.createElement("th", {
    key: h,
    style: {
      padding: "0 12px 12px",
      textAlign: "left",
      fontSize: 11,
      fontWeight: 700,
      color: "#94A3B8",
      textTransform: "uppercase",
      letterSpacing: ".05em"
    }
  }, h)))), React.createElement("tbody", null, [...filtered].reverse().map((t, i) => React.createElement("tr", {
    key: i,
    style: {
      borderBottom: "1px solid #F8FAFC"
    }
  }, React.createElement("td", {
    style: {
      padding: "12px",
      color: "#94A3B8",
      fontWeight: 600
    }
  }, filtered.length - i), React.createElement("td", {
    style: {
      padding: "12px",
      fontWeight: 600,
      color: "#0F172A"
    }
  }, t.name), React.createElement("td", {
    style: {
      padding: "12px",
      color: "#64748B"
    }
  }, t.date), React.createElement("td", {
    style: {
      padding: "12px",
      fontWeight: 700,
      color: "#6366F1"
    }
  }, t.score, "/", t.total), React.createElement("td", {
    style: {
      padding: "12px",
      color: "#64748B"
    }
  }, t.total ? (t.correct / ((t.correct || 0) + (t.wrong || 0) + (t.unattempted || 0) || 1) * 100).toFixed(0) : 0, "%"), React.createElement("td", {
    style: {
      padding: "12px",
      color: "#64748B"
    }
  }, t.timeTaken, "m"), React.createElement("td", {
    style: {
      padding: "12px"
    }
  }, React.createElement("span", {
    style: {
      padding: "3px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      background: t.percentage >= 60 ? "#ECFDF5" : t.percentage >= 40 ? "#FFFBEB" : "#FEF2F2",
      color: t.percentage >= 60 ? "#065F46" : t.percentage >= 40 ? "#92400E" : "#991B1B"
    }
  }, t.percentage.toFixed(0), "%"))))))))));
}
function StudyHub({
  profile
}) {
  const [tab, setTab] = useState("resources");
  const stream = profile.stream || "pcm";
  const res = RESOURCES[stream] || RESOURCES.pcm;
  const formulae = {
    physics: [["v = u + at", "Kinematic equation (uniform acceleration)"], ["KE = ½mv²", "Kinetic Energy"], ["F = ma", "Newton's 2nd Law"], ["P = W/t", "Power"], ["E = hf", "Photon energy (Planck)"], ["PV = nRT", "Ideal Gas Law"]],
    chemistry: [["pH = -log[H⁺]", "pH formula"], ["M = mass/(molar mass)", "Moles calculation"], ["Rate ∝ [A]ⁿ", "Rate Law"], ["ΔG = ΔH - TΔS", "Gibbs Free Energy"]],
    maths: [["d/dx(xⁿ) = nxⁿ⁻¹", "Power Rule"], ["∫xⁿdx = xⁿ⁺¹/(n+1)", "Integration Rule"], ["sin²θ + cos²θ = 1", "Pythagorean Identity"], ["A = πr²", "Area of Circle"], ["nCr = n!/(r!(n-r)!)", "Combination Formula"]],
    biology: [["Blood pH: 7.35–7.45", "Normal blood pH range"], ["DNA: A-T, G-C", "Base Pairing Rules"], ["ATP: Adenosine Triphosphate", "Energy currency of cell"]]
  };
  const weightage = {
    jee_main: {
      Physics: "33%",
      Chemistry: "33%",
      Mathematics: "34%"
    },
    neet: {
      Biology: "50%",
      "Physics + Chemistry": "50%"
    },
    clat: {
      English: "23%",
      "Current Affairs": "29%",
      "Legal Reasoning": "29%",
      "Logical Reasoning": "10%",
      "Maths": "8%"
    }
  };
  const targetExam = getRecommendedExams(profile)[0];
  return React.createElement("div", null, React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".08em",
      color: "#6366F1",
      textTransform: "uppercase",
      marginBottom: 6
    }
  }, "Study Hub"), React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: "#0F172A",
      letterSpacing: "-.03em",
      marginBottom: 6
    }
  }, "Resources & Quick Reference"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "Books, formulae, chapter weightages, and study strategies \u2014 all in one place.")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      borderBottom: "1px solid #E2E8F0",
      marginBottom: 24
    }
  }, ["resources", "formulae", "weightage", "strategy"].map(t => React.createElement("button", {
    key: t,
    className: `tab-btn ${tab === t ? "active" : ""}`,
    onClick: () => setTab(t),
    style: {
      textTransform: "capitalize"
    }
  }, t === "weightage" ? "Chapter Weightage" : t.charAt(0).toUpperCase() + t.slice(1)))), tab === "resources" && React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, res.map((r, i) => React.createElement("div", {
    key: i,
    className: "card",
    style: {
      padding: 18,
      display: "flex",
      gap: 14,
      alignItems: "flex-start"
    }
  }, React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 10,
      background: r.free ? "#ECFDF5" : "#EEF2FF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontSize: 18
    }
  }, r.type === "Book" ? "📖" : r.type === "Website" ? "🌐" : r.type === "Practice" ? "📝" : "📰"), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5,
      color: "#0F172A",
      marginBottom: 3
    }
  }, r.title), React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#94A3B8",
      marginBottom: 6
    }
  }, r.subject, " \xB7 ", r.type), React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 999,
      background: r.free ? "#ECFDF5" : "#EEF2FF",
      color: r.free ? "#065F46" : "#4338CA"
    }
  }, r.free ? "Free" : "Paid"))))), tab === "formulae" && React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20
    }
  }, Object.entries(formulae).filter(([sub]) => stream === "pcm" ? ["physics", "chemistry", "maths"].includes(sub) : stream === "pcb" ? ["physics", "chemistry", "biology"].includes(sub) : stream === "commerce" ? ["maths"].includes(sub) : true).map(([sub, fmls]) => React.createElement("div", {
    key: sub,
    className: "card",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: "#0F172A",
      textTransform: "capitalize",
      marginBottom: 14,
      borderBottom: "1px solid #F1F5F9",
      paddingBottom: 10
    }
  }, sub, " Formulae"), React.createElement("div", {
    className: "flex flex-col gap-3"
  }, fmls.map(([f, d], i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, React.createElement("code", {
    style: {
      background: "#EEF2FF",
      color: "#4338CA",
      padding: "4px 8px",
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 700,
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, f), React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#64748B",
      lineHeight: 1.5
    }
  }, d))))))), tab === "weightage" && React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20
    }
  }, Object.entries(weightage).filter(([e]) => {
    const ex = EXAMS.find(x => x.id === e);
    return ex && ex.streams.includes(stream);
  }).map(([examId, wts]) => {
    const ex = EXAMS.find(e => e.id === examId);
    return React.createElement("div", {
      key: examId,
      className: "card",
      style: {
        padding: 20
      }
    }, React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 14,
        color: "#0F172A",
        marginBottom: 16
      }
    }, ex?.name, " \u2014 Subject Weightage"), Object.entries(wts).map(([sub, pct]) => React.createElement("div", {
      key: sub,
      style: {
        marginBottom: 14
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 5
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        color: "#374151",
        fontWeight: 500
      }
    }, sub), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: "#6366F1"
      }
    }, pct)), React.createElement("div", {
      className: "prog-bar"
    }, React.createElement("div", {
      className: "prog-fill",
      style: {
        width: pct,
        background: "#6366F1"
      }
    })))));
  })), tab === "strategy" && React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20
    }
  }, [{
    title: "Daily Study Routine",
    tips: ["6–8 hours of focused study minimum", "Rotate subjects every 2–3 hours to avoid fatigue", "Solve 20–30 questions daily per subject", "Dedicate 1 hour daily to revision", "Take 10-min breaks every 90 minutes (Pomodoro)"]
  }, {
    title: "Mock Test Strategy",
    tips: ["Take 1 full mock per week 3 months before exam", "Analyse every wrong answer — don't just move on", "Maintain an error log notebook", "Compare your percentile with target cut-off", "Simulate real exam conditions (no interruptions)"]
  }, {
    title: "Revision Plan",
    tips: ["Revise completed chapters weekly", "Make short notes for each chapter (2 pages max)", "Use mnemonics for chemistry reactions and biology diagrams", "Solve NCERT exemplar problems for concept clarity", "Last 30 days: only revision + tests, no new topics"]
  }, {
    title: "Mental & Physical Health",
    tips: ["Sleep 7–8 hours — memory consolidation happens during sleep", "Exercise 30 min daily — improves concentration by ~20%", "Eat brain foods: nuts, berries, eggs, fish", "Stay away from social media during study hours", "Talk to a mentor/teacher when stuck, not just peers"]
  }].map((sec, i) => React.createElement("div", {
    key: i,
    className: "card",
    style: {
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: "#0F172A",
      marginBottom: 14
    }
  }, sec.title), React.createElement("div", {
    className: "flex flex-col gap-3"
  }, sec.tips.map((tip, j) => React.createElement("div", {
    key: j,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, React.createElement("div", {
    style: {
      width: 18,
      height: 18,
      background: "#6366F1",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginTop: 1
    }
  }, React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      color: "#fff"
    }
  }, Icon.check)), React.createElement("span", {
    style: {
      fontSize: 13,
      color: "#374151",
      lineHeight: 1.5
    }
  }, tip))))))));
}
function Roadmap({
  profile
}) {
  const stream = profile.stream || "pcm";
  const recExams = getRecommendedExams(profile).map(e => e.id);
  const relevantTimelines = Object.entries(TIMELINE).filter(([k]) => recExams.includes(k));
  const typeStyle = {
    reg: {
      color: "#6366F1",
      bg: "#EEF2FF",
      label: "Registration"
    },
    exam: {
      color: "#EF4444",
      bg: "#FEF2F2",
      label: "Exam"
    },
    result: {
      color: "#10B981",
      bg: "#ECFDF5",
      label: "Result"
    },
    counselling: {
      color: "#F59E0B",
      bg: "#FFFBEB",
      label: "Counselling"
    },
    deadline: {
      color: "#EF4444",
      bg: "#FEF2F2",
      label: "Deadline"
    }
  };
  return React.createElement("div", null, React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".08em",
      color: "#6366F1",
      textTransform: "uppercase",
      marginBottom: 6
    }
  }, "Roadmap"), React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: "#0F172A",
      letterSpacing: "-.03em",
      marginBottom: 6
    }
  }, "Your Exam Timeline"), React.createElement("p", {
    style: {
      color: "#64748B",
      fontSize: 14
    }
  }, "Key dates, milestones, and deadlines for your target exams \u2014 all in one view.")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginBottom: 24,
      flexWrap: "wrap"
    }
  }, Object.entries(typeStyle).map(([k, v]) => React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 12px",
      background: v.bg,
      borderRadius: 999,
      border: `1px solid ${v.color}33`
    }
  }, React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: v.color
    }
  }), React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: v.color
    }
  }, v.label)))), relevantTimelines.length === 0 ? React.createElement("div", {
    className: "card",
    style: {
      padding: 32,
      textAlign: "center"
    }
  }, React.createElement("p", {
    style: {
      fontWeight: 600,
      color: "#0F172A",
      marginBottom: 6
    }
  }, "No timeline data for your current selection."), React.createElement("p", {
    style: {
      fontSize: 13,
      color: "#64748B"
    }
  }, "Complete onboarding with your exam goals to see dates here.")) : React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24
    }
  }, relevantTimelines.map(([examId, events]) => {
    const ex = EXAMS.find(e => e.id === examId);
    return React.createElement("div", {
      key: examId,
      className: "card",
      style: {
        padding: 22
      }
    }, React.createElement("div", {
      style: {
        fontWeight: 800,
        fontSize: 16,
        color: "#0F172A",
        marginBottom: 4
      }
    }, ex?.name), React.createElement("div", {
      style: {
        fontSize: 12,
        color: "#94A3B8",
        marginBottom: 20
      }
    }, ex?.conducting), React.createElement("div", {
      style: {
        position: "relative"
      }
    }, events.map((ev, i) => {
      const cfg = typeStyle[ev.type] || typeStyle.reg;
      return React.createElement("div", {
        key: i,
        className: "rmap-row",
        style: {
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          paddingBottom: i < events.length - 1 ? 20 : 0,
          position: "relative"
        }
      }, i < events.length - 1 && React.createElement("div", {
        style: {
          position: "absolute",
          left: 19,
          top: 42,
          width: 2,
          height: "calc(100% - 20px)",
          background: "linear-gradient(to bottom,#6366F1,#E2E8F0)"
        }
      }), React.createElement("div", {
        style: {
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: cfg.bg,
          border: `2px solid ${cfg.color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          zIndex: 1
        }
      }, React.createElement("div", {
        style: {
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: cfg.color
        }
      })), React.createElement("div", {
        style: {
          paddingTop: 6
        }
      }, React.createElement("div", {
        style: {
          fontWeight: 600,
          fontSize: 13.5,
          color: "#0F172A",
          marginBottom: 2
        }
      }, ev.event), React.createElement("div", {
        style: {
          display: "flex",
          gap: 8,
          alignItems: "center"
        }
      }, React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 700,
          color: cfg.color
        }
      }, ev.date), React.createElement("span", {
        style: {
          fontSize: 11,
          padding: "2px 8px",
          borderRadius: 999,
          background: cfg.bg,
          color: cfg.color,
          fontWeight: 600
        }
      }, cfg.label))));
    })));
  })), React.createElement("div", {
    className: "card",
    style: {
      padding: 24,
      marginTop: 20
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0F172A",
      marginBottom: 20
    }
  }, "Strategic Preparation Phases"), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 16
    }
  }, [{
    phase: "Foundation",
    duration: "Class 11 + Early 12th",
    desc: "NCERT mastery, concept building, basic problem solving. Focus on understanding over memorisation.",
    color: "#6366F1",
    bg: "#EEF2FF"
  }, {
    phase: "Intensive",
    duration: "Mid Class 12",
    desc: "Advanced problems, chapter tests, join test series, analyse PYQs. Aim for 70%+ in mocks.",
    color: "#F59E0B",
    bg: "#FFFBEB"
  }, {
    phase: "Final Sprint",
    duration: "Last 2–3 Months",
    desc: "Full mocks, revision, weak area fixing. No new topics. Rest well before exam.",
    color: "#10B981",
    bg: "#ECFDF5"
  }].map(p => React.createElement("div", {
    key: p.phase,
    style: {
      background: p.bg,
      borderRadius: 14,
      padding: 20,
      border: `1px solid ${p.color}33`
    }
  }, React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: p.color,
      textTransform: "uppercase",
      letterSpacing: ".08em",
      marginBottom: 6
    }
  }, p.duration), React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 16,
      color: "#0F172A",
      marginBottom: 8
    }
  }, p.phase), React.createElement("p", {
    style: {
      fontSize: 13,
      color: "#374151",
      lineHeight: 1.6
    }
  }, p.desc))))));
}
function App() {
  const [phase, setPhase] = useState("onboarding");
  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("home");
  const [testHistory, setTestHistory] = useState([]);
  useEffect(() => {
    const timer = setTimeout(initCareerMotion, 80);
    return () => clearTimeout(timer);
  }, [phase, activeTab, testHistory.length]);
  const handleOnboardComplete = p => {
    setProfile(p);
    setPhase("processing");
  };
  const handleProcessingDone = () => {
    setPhase("dashboard");
  };
  const handleTestComplete = result => {
    setTestHistory(h => [...h, result]);
  };
  if (phase === "onboarding") return React.createElement(Onboarding, {
    onComplete: handleOnboardComplete
  });
  if (phase === "processing") return React.createElement(AIProcessing, {
    profile: profile,
    onDone: handleProcessingDone
  });
  const tabContent = () => {
    switch (activeTab) {
      case "home":
        return React.createElement(HomeTab, {
          profile: profile,
          testHistory: testHistory,
          onNav: setActiveTab
        });
      case "exams":
        return React.createElement(ExamExplorer, {
          profile: profile
        });
      case "colleges":
        return React.createElement(CollegeFinder, {
          profile: profile
        });
      case "tests":
        return React.createElement(MockTests, {
          profile: profile,
          onTestComplete: handleTestComplete
        });
      case "progress":
        return React.createElement(ProgressTracker, {
          testHistory: testHistory,
          profile: profile
        });
      case "study":
        return React.createElement(StudyHub, {
          profile: profile
        });
      case "roadmap":
        return React.createElement(Roadmap, {
          profile: profile
        });
      default:
        return React.createElement(HomeTab, {
          profile: profile,
          testHistory: testHistory,
          onNav: setActiveTab
        });
    }
  };
  return React.createElement("div", {
    className: "app-shell"
  }, React.createElement(Sidebar, {
    active: activeTab,
    onChange: setActiveTab,
    profile: profile
  }), React.createElement("div", {
    className: "main-content"
  }, React.createElement(Topbar, {
    profile: profile
  }), React.createElement("div", {
    className: "content-inner"
  }, tabContent())));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));