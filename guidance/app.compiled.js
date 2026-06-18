const {
  useEffect,
  useMemo,
  useState
} = React;
const SOURCE_LINKS = [{
  label: "Telangana State Portal - Learning in Telangana",
  url: "https://www.telangana.gov.in/learning-in-telangana/"
}, {
  label: "SCERT Telangana - Intermediate courses after 10th",
  url: "https://scert.telangana.gov.in/pdf/publication/others/1-intermediate%20courses.pdf"
}, {
  label: "SCERT Telangana - Vocational courses after 10th",
  url: "https://scert.telangana.gov.in/pdf/publication/others/6%20-%20list%20of%20voctional%20courses.pdf"
}, {
  label: "TG POLYCET counselling portal",
  url: "https://tgpolycet.nic.in/default.aspx"
}, {
  label: "Maharashtra FYJC admission portal",
  url: "https://www.fyjcadmission.in/"
}, {
  label: "Karnataka PU colleges reference",
  url: "https://collegesinfo.org/pu-colleges-in-bangalore"
}, {
  label: "DSEU Delhi diploma admissions",
  url: "https://dseu.ac.in/"
}, {
  label: "Tamil Nadu polytechnic college list",
  url: "https://tnpoly.in/public/docs/colleges-list.pdf"
}, {
  label: "West Bengal JEXPO polytechnic list",
  url: "https://jexpo.webscte.co.in/list-Polytechnic"
}, {
  label: "Kerala SBTE institution list",
  url: "https://www.sbte.kerala.gov.in/public/institns/general"
}, {
  label: "Government Polytechnic College Kalamassery",
  url: "https://gptckalamassery.ac.in/"
}, {
  label: "Government Polytechnic Ahmedabad",
  url: "https://www.gpahmedabad.ac.in/wp_advt.php"
}, {
  label: "Chandigarh Class XI admission notice",
  url: "https://nltchd.info/utcouns/pdf/Notice2025.pdf"
}, {
  label: "Avinash College of Commerce intermediate courses",
  url: "https://acc.edu.in/courses/intermediate/"
}, {
  label: "KC College junior college",
  url: "https://kccollege.edu.in/junior-college/"
}, {
  label: "R. D. National College",
  url: "https://www.rdnational.net/"
}, {
  label: "Symbiosis Junior College Pune",
  url: "https://symbiosisjrcollege.ac.in/"
}, {
  label: "Symbiosis College junior college",
  url: "https://symbiosiscollege.edu.in/junior_college"
}, {
  label: "Jyoti Nivas Pre-University College courses",
  url: "https://jnpuc.org/courses.php"
}, {
  label: "Don Bosco Kolkata Class XI guidelines",
  url: "https://www.donboscocampuscare.in/Documents/GuidelinesClassXI.pdf"
}, {
  label: "Bhavan's Vidya Mandir Elamakkara senior secondary",
  url: "https://bhavanselamakkara.ac.in/Senior-Secondary"
}];
const CITIES = [{
  id: "mumbai",
  name: "Mumbai",
  state: "Maharashtra",
  icon: "landmark",
  coords: [19.076, 72.8777],
  blurb: "FYJC junior colleges, commerce powerhouses, strong science cutoffs."
}, {
  id: "delhi",
  name: "Delhi-NCR",
  state: "Delhi NCR",
  icon: "building-2",
  coords: [28.6139, 77.209],
  blurb: "CBSE class 11 schools, DSEU polytechnic campuses, NCR diploma options."
}, {
  id: "bengaluru",
  name: "Bengaluru",
  state: "Karnataka",
  icon: "graduation-cap",
  coords: [12.9716, 77.5946],
  blurb: "PU colleges with PCMB, PCMC, commerce, social science, KCET/JEE/NEET prep."
}, {
  id: "hyderabad",
  name: "Hyderabad",
  state: "Telangana",
  asset: "assets/cities/hyderabad.png",
  coords: [17.385, 78.4867],
  blurb: "TSBIE intermediate, POLYCET diplomas, strong engineering and medical coaching belt."
}, {
  id: "chandigarh",
  name: "Chandigarh",
  state: "Chandigarh",
  icon: "landmark",
  coords: [30.7333, 76.7794],
  blurb: "Class 11 government model schools, polytechnic, commerce and arts pathways."
}, {
  id: "ahmedabad",
  name: "Ahmedabad",
  state: "Gujarat",
  icon: "factory",
  coords: [23.0225, 72.5714],
  blurb: "GSEB science and commerce schools, design, commerce, and government diploma options."
}, {
  id: "pune",
  name: "Pune",
  state: "Maharashtra",
  asset: "assets/cities/pune.png",
  coords: [18.5204, 73.8567],
  blurb: "FYJC colleges, science and commerce legacy institutions, strong polytechnic network."
}, {
  id: "chennai",
  name: "Chennai",
  state: "Tamil Nadu",
  icon: "landmark",
  coords: [13.0827, 80.2707],
  blurb: "Higher secondary schools, DOTE polytechnics, commerce and engineering diploma routes."
}, {
  id: "kolkata",
  name: "Kolkata",
  state: "West Bengal",
  icon: "library",
  coords: [22.5726, 88.3639],
  blurb: "Higher secondary schools, JEXPO polytechnics, humanities and commerce depth."
}, {
  id: "kochi",
  name: "Kochi",
  state: "Kerala",
  icon: "ship",
  coords: [9.9312, 76.2673],
  blurb: "Kerala HSE schools, technical higher secondary, polytechnic and commerce routes."
}];
const BOARDS = [{
  id: "state",
  name: "State Board",
  desc: "SSC, SSLC, TSBIE, HSE, FYJC, PU or local higher secondary pathway."
}, {
  id: "cbse",
  name: "CBSE",
  desc: "Smooth transition into class 11 school or integrated junior college programs."
}, {
  id: "icse",
  name: "ICSE",
  desc: "Strong English base, useful for humanities, law, commerce and science routes."
}, {
  id: "open",
  name: "Open/Other",
  desc: "TOSS, NIOS, international or alternative board path."
}];
const BUDGETS = [{
  id: "low",
  label: "Low",
  desc: "Government, aided or low-fee colleges.",
  min: 0,
  max: 30000
}, {
  id: "mid",
  label: "Balanced",
  desc: "Aided/private options with practical facilities.",
  min: 30000,
  max: 90000
}, {
  id: "high",
  label: "Premium",
  desc: "Private, integrated coaching or residential style options.",
  min: 90000,
  max: 250000
}, {
  id: "any",
  label: "Flexible",
  desc: "Show the best-fit options across budgets.",
  min: 0,
  max: 300000
}];
const INTERESTS = [{
  id: "ai",
  name: "AI and Technology",
  icon: "cpu"
}, {
  id: "medicine",
  name: "Medicine and Biology",
  icon: "heart-pulse"
}, {
  id: "finance",
  name: "Commerce and Finance",
  icon: "indian-rupee"
}, {
  id: "law",
  name: "Law, Civics and UPSC",
  icon: "scale"
}, {
  id: "design",
  name: "Design and Media",
  icon: "palette"
}, {
  id: "hands",
  name: "Hands-on Engineering",
  icon: "wrench"
}, {
  id: "care",
  name: "Allied Health",
  icon: "stethoscope"
}, {
  id: "hospitality",
  name: "Hospitality and Travel",
  icon: "plane"
}];
const GOALS = [{
  id: "engineering",
  name: "Engineering or technology degree",
  stream: "mpc"
}, {
  id: "doctor",
  name: "Doctor, pharmacy or life sciences",
  stream: "bipc"
}, {
  id: "finance",
  name: "CA, business, finance or entrepreneurship",
  stream: "commerce"
}, {
  id: "civil",
  name: "Law, civil services or public policy",
  stream: "humanities"
}, {
  id: "job",
  name: "Skilled job quickly after 10th",
  stream: "polytechnic"
}, {
  id: "healthtech",
  name: "Healthcare technician or lab role",
  stream: "paramedical"
}];
const STREAMS = {
  mpc: {
    id: "mpc",
    name: "Science - MPC",
    title: "MPC with Computing and Engineering Track",
    icon: "atom",
    color: "#2864ff",
    tint: "#eef4ff",
    summary: "Best for students who enjoy math, systems, coding, physics and engineering problem solving.",
    subjects: ["Mathematics", "Physics", "Chemistry", "English", "Computer Science optional"],
    careers: ["Software Engineer", "AI/ML Engineer", "Data Analyst", "Civil Engineer", "Aerospace Engineer"],
    exams: ["JEE Main", "JEE Advanced", "State EAPCET/CET", "BITSAT", "NATA for architecture"],
    prepare: ["Keep mathematics and physics concepts clean from class 10 itself.", "Pick a junior college that balances board marks and entrance prep.", "Build weekly problem-solving discipline instead of last-minute memorization.", "Use coding or robotics projects to test real interest before class 12."],
    typical: "A day usually mixes theory lectures, numericals, lab work, practice tests and independent revision.",
    consider: "This route is high competition. Choose it if you can live with consistent math and physics practice for two years.",
    tags: ["JEE", "EAPCET", "KCET", "AI", "Engineering"]
  },
  bipc: {
    id: "bipc",
    name: "Science - BiPC",
    title: "BiPC with Medicine and Life Sciences Track",
    icon: "dna",
    color: "#16a34a",
    tint: "#ecfdf5",
    summary: "Ideal for biology-first students targeting medicine, pharmacy, agriculture, biotechnology or clinical research.",
    subjects: ["Botany", "Zoology", "Physics", "Chemistry", "English"],
    careers: ["Doctor", "Pharmacist", "Biotechnologist", "Nutritionist", "Clinical Research Associate"],
    exams: ["NEET-UG", "State EAPCET Biology stream", "Pharmacy entrance routes", "Agriculture and veterinary entrance routes"],
    prepare: ["Treat biology diagrams and NCERT-style memory as daily practice.", "Do not ignore physics; it separates many NEET aspirants.", "Visit labs, hospitals or public health programs to understand the work environment.", "Keep backup options like pharmacy, biotechnology and allied health visible."],
    typical: "A day includes biology theory, chemistry practice, physics problem-solving, lab observation and frequent tests.",
    consider: "Medicine is long and selective. This path works best when healthcare interest is real, not only rank pressure.",
    tags: ["NEET", "Pharmacy", "Biotech", "Healthcare", "Life Science"]
  },
  commerce: {
    id: "commerce",
    name: "Commerce - MEC/CEC",
    title: "Commerce with Finance, CA and Business Track",
    icon: "briefcase",
    color: "#7c3aed",
    tint: "#f3e8ff",
    summary: "Strong route for students who like business, accounts, economics, markets and entrepreneurship.",
    subjects: ["Accountancy", "Economics", "Commerce", "Mathematics optional", "Civics optional"],
    careers: ["Chartered Accountant", "Investment Analyst", "Founder", "Product Manager", "Business Consultant"],
    exams: ["CA Foundation", "CMA Foundation", "CUET", "IPMAT", "CLAT if paired with civics"],
    prepare: ["If you are comfortable with numbers, keep mathematics open in MEC.", "Start reading business news in simple language from class 11.", "Build spreadsheet, communication and presentation skills early.", "For CA, choose a college that leaves enough focused study time."],
    typical: "A day includes accounts practice, economics concepts, commerce theory, current affairs and case discussions.",
    consider: "Commerce has high upside, but professional exams require patience and multiple attempts for many students.",
    tags: ["CA", "CMA", "Finance", "Business", "MEC", "CEC"]
  },
  humanities: {
    id: "humanities",
    name: "Humanities - HEC/Arts",
    title: "Humanities with Law, Policy, Psychology and Design Track",
    icon: "landmark",
    color: "#f97316",
    tint: "#fff7ed",
    summary: "For readers, debaters, writers, creators and students drawn to people, society, law, psychology or media.",
    subjects: ["History", "Economics", "Civics", "Psychology", "Political Science", "Languages"],
    careers: ["Lawyer", "Civil Servant", "Psychologist", "Journalist", "UX Researcher", "Policy Analyst"],
    exams: ["CLAT", "CUET", "NID/NIFT", "UPSC later", "State university entrance routes"],
    prepare: ["Read editorials, biographies and public affairs stories consistently.", "Practice writing structured answers and arguments.", "Build speaking confidence through debates, MUNs or theatre.", "Pair humanities with design, psychology, law or economics for stronger career clarity."],
    typical: "A day includes reading, note-making, classroom discussion, writing assignments and current affairs work.",
    consider: "This stream rewards depth and communication. It is not a fallback stream when chosen intentionally.",
    tags: ["Law", "UPSC", "Psychology", "Design", "Media"]
  },
  polytechnic: {
    id: "polytechnic",
    name: "Polytechnic Diploma",
    title: "Technical Diploma with Direct Skill and Lateral Entry Track",
    icon: "cog",
    color: "#0ea5e9",
    tint: "#ecfeff",
    summary: "A practical after-10th option for students who want engineering workshops, applied labs and quicker job readiness.",
    subjects: ["Engineering Mathematics", "Applied Science", "Workshop Practice", "Branch Core", "Industrial Training"],
    careers: ["Junior Engineer", "CAD Technician", "Site Supervisor", "Network Technician", "Maintenance Engineer"],
    exams: ["TG POLYCET", "Delhi CET", "JEXPO", "State polytechnic counselling", "Lateral entry to B.Tech later"],
    prepare: ["Check state counselling dates and document requirements early.", "Shortlist government polytechnics first if budget is sensitive.", "Choose branch based on real work: machines, code, circuits, construction or vehicles.", "Keep lateral-entry B.Tech open if you want a degree later."],
    typical: "A day has technical theory, lab practicals, workshop training, drawing/CAD and branch-specific assignments.",
    consider: "Great for hands-on learners, but branch choice matters a lot. Do not pick a branch only because seats are easy.",
    tags: ["Diploma", "POLYCET", "JEXPO", "CET", "Technical"]
  },
  paramedical: {
    id: "paramedical",
    name: "Vocational and Paramedical",
    title: "Vocational Allied Health and Applied Skills Track",
    icon: "microscope",
    color: "#14b8a6",
    tint: "#f0fdfa",
    summary: "Good for students who want healthcare support, lab work, physiotherapy support, retail, tourism or applied skills.",
    subjects: ["Medical Lab Technology", "Physiotherapy", "Pharma Technology", "Retail Management", "Tourism and Hospitality"],
    careers: ["Medical Lab Technician", "Radiology Assistant", "Dialysis Assistant", "Retail Supervisor", "Hospitality Associate"],
    exams: ["State vocational admissions", "Institution-level merit", "Paramedical diploma routes", "Skill training programs"],
    prepare: ["Understand the workplace before choosing: labs, clinics, hotels, retail or field sites.", "Develop attention to detail and disciplined documentation.", "For allied health, strengthen basic biology and English communication.", "Prefer recognized institutions with transparent practical training."],
    typical: "A day is practical and task-heavy: lab observation, equipment handling, records, client/patient interaction and skill drills.",
    consider: "These are essential support roles. Salaries grow with certification, experience and reliability.",
    tags: ["MLT", "Physiotherapy", "Pharma", "Hospitality", "Vocational"]
  }
};
const STREAM_WEIGHTS = {
  ai: {
    mpc: 4,
    polytechnic: 3,
    commerce: 1
  },
  medicine: {
    bipc: 4,
    paramedical: 3,
    mpc: 1
  },
  finance: {
    commerce: 4,
    humanities: 1
  },
  law: {
    humanities: 4,
    commerce: 2
  },
  design: {
    humanities: 3,
    commerce: 1,
    polytechnic: 1
  },
  hands: {
    polytechnic: 4,
    mpc: 2,
    paramedical: 1
  },
  care: {
    paramedical: 4,
    bipc: 3,
    humanities: 1
  },
  hospitality: {
    paramedical: 3,
    commerce: 2,
    humanities: 1
  }
};
const STREAM_SCORE_SPREAD = {
  mpc: 10,
  bipc: 5,
  commerce: -2,
  humanities: 1,
  polytechnic: -6,
  paramedical: -10
};
const COLLEGES = [{
  name: "Little Flower Junior College",
  city: "hyderabad",
  area: "Uppal",
  type: "Junior College",
  level: "After 10th",
  streams: ["mpc", "bipc", "commerce"],
  boards: ["TSBIE"],
  budget: "mid",
  fee: "Rs. 35K - 85K/year",
  verified: true,
  highlight: "Long-running Hyderabad intermediate institution with science and commerce routes.",
  source: "https://lfjc.co.in/courses.php"
}, {
  name: "Vignana Jyothi Junior College",
  city: "hyderabad",
  area: "Jubilee Hills",
  type: "Junior College",
  level: "After 10th",
  streams: ["mpc", "bipc", "commerce"],
  boards: ["TSBIE"],
  budget: "mid",
  fee: "Rs. 45K - 1.2L/year",
  verified: true,
  highlight: "Offers MPC, BiPC, MEC and CEC streams in Hyderabad.",
  source: "https://www.vjjc.ac.in/"
}, {
  name: "Sri Amogha Junior College",
  city: "hyderabad",
  area: "SR Nagar",
  type: "Junior College",
  level: "After 10th",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["TSBIE"],
  budget: "mid",
  fee: "Rs. 50K - 1.4L/year",
  verified: true,
  highlight: "TSBIE-affiliated with MPC, BiPC, MEC, CEC and design foundation options.",
  source: "https://sajc.edu.in/"
}, {
  name: "Villa Marie Junior College for Girls",
  city: "hyderabad",
  area: "Somajiguda",
  type: "Junior College",
  level: "After 10th",
  streams: ["mpc", "bipc", "commerce"],
  boards: ["TSBIE"],
  budget: "mid",
  fee: "Rs. 40K - 1L/year",
  verified: true,
  highlight: "Girls' junior college following TSBIE curriculum with MPC, BPC, MEC and CEC options.",
  source: "https://www.villamariejrcollege.com/"
}, {
  name: "St. Mary's Junior College",
  city: "hyderabad",
  area: "Yousufguda / Himayatnagar",
  type: "Junior College",
  level: "After 10th",
  streams: ["mpc", "bipc", "commerce"],
  boards: ["TSBIE"],
  budget: "mid",
  fee: "Rs. 55K - 1.2L/year",
  verified: true,
  highlight: "Intermediate program includes MPC, BiPC, MEC and CEC groups.",
  source: "https://stmaryscollege.in/academics/intermediate-program/"
}, {
  name: "Government Polytechnic, Masab Tank",
  city: "hyderabad",
  area: "Masab Tank",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["SBTET"],
  budget: "low",
  fee: "Around Rs. 6K total",
  verified: true,
  highlight: "Historic government polytechnic with multiple engineering diploma branches.",
  source: "https://www.kollegeapply.com/college/government-polytechnic-college-hyderabad"
}, {
  name: "J. N. Government Polytechnic",
  city: "hyderabad",
  area: "Ramanthapur",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["SBTET"],
  budget: "low",
  fee: "Around Rs. 6K total",
  verified: true,
  highlight: "Government diploma institution with TS POLYCET route.",
  source: "https://collegedunia.com/college/59665-jn-government-polytechnic-ramanthapur-hyderabad/ts-polycet-2024-cutoff"
}, {
  name: "Quli Qutub Shah Government Polytechnic",
  city: "hyderabad",
  area: "Old City",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["SBTET"],
  budget: "low",
  fee: "Around Rs. 3.8K/year",
  verified: true,
  highlight: "Government polytechnic in Chandulal Baradari with QQ urban-area counselling relevance.",
  source: "https://www.targetadmission.com/colleges/6658-quli-qutub-shah-government-polytechnic-hyderabad"
}, {
  name: "Jai Hind College",
  city: "mumbai",
  area: "Churchgate",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "Rs. 10K - 55K/year",
  verified: true,
  highlight: "Popular Mumbai FYJC option with science, commerce and arts streams.",
  source: "https://beyond10th.com/blog/top-junior-colleges-mumbai-2026"
}, {
  name: "Mithibai College",
  city: "mumbai",
  area: "Vile Parle",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "Rs. 10K - 75K/year",
  verified: true,
  highlight: "Known Mumbai junior college for science, commerce and arts.",
  source: "https://beyond10th.com/blog/top-10-junior-colleges-mumbai-for-science"
}, {
  name: "Narsee Monjee College",
  city: "mumbai",
  area: "Vile Parle",
  type: "Junior College",
  level: "FYJC",
  streams: ["commerce"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "Rs. 15K - 75K/year",
  verified: true,
  highlight: "Commerce-focused junior college with official junior college admission process.",
  source: "https://nmcollege.in/admissions/junior-college"
}, {
  name: "Ramnarain Ruia Junior College",
  city: "mumbai",
  area: "Matunga",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "Rs. 12K - 60K/year",
  verified: true,
  highlight: "Strong science and arts reputation in Mumbai.",
  source: "https://beyond10th.com/blog/top-10-junior-colleges-mumbai-for-science"
}, {
  name: "Durgadevi Saraf Junior College",
  city: "mumbai",
  area: "Malad",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "Rs. 20K - 90K/year",
  verified: true,
  highlight: "Balanced junior college option for western suburbs.",
  source: "https://www.rset.edu.in/dsjc/top-junior-colleges-in-mumbai-11th-12th/"
}, {
  name: "Government Polytechnic Mumbai",
  city: "mumbai",
  area: "Bandra",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["MSBTE"],
  budget: "low",
  fee: "Rs. 8K - 25K/year",
  verified: true,
  highlight: "Government diploma pathway through Maharashtra technical admission routes.",
  source: "https://www.fyjcadmission.in/"
}, {
  name: "Fergusson College Junior Wing",
  city: "pune",
  area: "Deccan",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "Rs. 12K - 60K/year",
  verified: true,
  highlight: "Historic Pune institution with junior college wing and science/arts strength.",
  source: "https://fergusson.edu/"
}, {
  name: "Nowrosjee Wadia College Junior College",
  city: "pune",
  area: "Pune Camp",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "Rs. 15K - 65K/year",
  verified: true,
  highlight: "Arts and science junior college option in Pune.",
  source: "https://nowrosjeewadia.mespune.org/wp-content/uploads/2022/06/Junior_College_Prospectus.pdf"
}, {
  name: "Ness Wadia College of Commerce Junior College",
  city: "pune",
  area: "Pune Camp",
  type: "Junior College",
  level: "FYJC",
  streams: ["commerce"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "Rs. 15K - 70K/year",
  verified: true,
  highlight: "Commerce junior college route through FYJC admission.",
  source: "https://nwcc.mespune.org/department/junior-college-admission/"
}, {
  name: "Dr. D. Y. Patil Arts, Commerce and Science Junior College",
  city: "pune",
  area: "Pimpri",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "Rs. 25K - 95K/year",
  verified: true,
  highlight: "Offers science, commerce and arts junior college streams.",
  source: "https://acsjr.dypvp.edu.in/"
}, {
  name: "Balaji Junior College",
  city: "pune",
  area: "Tathawade",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "Rs. 35K - 1.1L/year",
  verified: true,
  highlight: "Arts, science and commerce junior college near Dange Chowk.",
  source: "https://www.bjcpune.edu.in/"
}, {
  name: "Government Polytechnic Pune",
  city: "pune",
  area: "Shivajinagar",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["MSBTE"],
  budget: "low",
  fee: "Rs. 8K - 30K/year",
  verified: true,
  highlight: "Government diploma route for Pune students.",
  source: "https://www.fyjcadmission.in/"
}, {
  name: "Christ Junior College",
  city: "bengaluru",
  area: "Hosur Road",
  type: "PU College",
  level: "After 10th PUC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Karnataka PU"],
  budget: "high",
  fee: "Rs. 85K - 1.5L/year",
  verified: true,
  highlight: "Offers science, commerce and social sciences under Karnataka PU curriculum.",
  source: "https://www.christjuniorcollege.in/pre-university-course.php"
}, {
  name: "St. Joseph's Pre-University College",
  city: "bengaluru",
  area: "Residency Road",
  type: "PU College",
  level: "After 10th PUC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Karnataka PU"],
  budget: "mid",
  fee: "Rs. 60K - 1.2L/year",
  verified: true,
  highlight: "Science, commerce and arts PU education for class 10 graduates.",
  source: "https://en.wikipedia.org/wiki/St._Joseph%27s_Pre-University_College"
}, {
  name: "Mount Carmel PU College",
  city: "bengaluru",
  area: "Palace Road",
  type: "PU College",
  level: "After 10th PUC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Karnataka PU"],
  budget: "mid",
  fee: "Rs. 55K - 1.25L/year",
  verified: true,
  highlight: "Women's PU college with science, commerce and arts options.",
  source: "https://mcpuc.edu.in/pdf/SSLC-LIST1.pdf"
}, {
  name: "JAIN PU College",
  city: "bengaluru",
  area: "Multiple campuses",
  type: "PU College",
  level: "After 10th PUC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Karnataka PU"],
  budget: "high",
  fee: "Rs. 75K - 1.6L/year",
  verified: true,
  highlight: "Known PU network with science, commerce and arts combinations.",
  source: "https://www.jaincollege.ac.in/top-10-pu-colleges-in-bangalore"
}, {
  name: "Carmel Pre-University College",
  city: "bengaluru",
  area: "Bengaluru",
  type: "PU College",
  level: "After 10th PUC",
  streams: ["mpc", "bipc", "commerce"],
  boards: ["Karnataka PU"],
  budget: "mid",
  fee: "Rs. 50K - 1.2L/year",
  verified: true,
  highlight: "Co-educational PU college offering science and commerce.",
  source: "https://carmelpu.org/"
}, {
  name: "Government Polytechnic Bengaluru",
  city: "bengaluru",
  area: "Bengaluru",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["DTE Karnataka"],
  budget: "low",
  fee: "Rs. 8K - 35K/year",
  verified: true,
  highlight: "Government diploma option for hands-on technical learners.",
  source: "https://collegesinfo.org/pu-colleges-in-bangalore"
}, {
  name: "Pusa Institute of Technology",
  city: "delhi",
  area: "Pusa",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["DSEU/Delhi"],
  budget: "low",
  fee: "Rs. 10K - 55K/year",
  verified: true,
  highlight: "Well-known Delhi government polytechnic route for engineering diplomas.",
  source: "https://engineergates.com/top-polytechnic-colleges-in-delhi-ncr-2025/"
}, {
  name: "Ambedkar DSEU Shakarpur Campus",
  city: "delhi",
  area: "Shakarpur",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["DSEU/Delhi"],
  budget: "low",
  fee: "Rs. 10K - 60K/year",
  verified: true,
  highlight: "Delhi government diploma campus with technical programs.",
  source: "https://engineergates.com/top-polytechnic-colleges-in-delhi-ncr-2025/"
}, {
  name: "Meerabai Institute of Technology",
  city: "delhi",
  area: "Maharani Bagh",
  type: "Women Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic", "paramedical"],
  boards: ["DSEU/Delhi"],
  budget: "low",
  fee: "Rs. 10K - 60K/year",
  verified: true,
  highlight: "Women's technical institute with diploma-focused programs.",
  source: "https://engineergates.com/top-polytechnic-colleges-in-delhi-ncr-2025/"
}, {
  name: "GB Pant DSEU Okhla-II Campus",
  city: "delhi",
  area: "Okhla",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["DSEU/Delhi"],
  budget: "mid",
  fee: "Rs. 50K - 90K/year",
  verified: true,
  highlight: "Delhi Skill and Entrepreneurship University campus for diploma pathways.",
  source: "https://collegedunia.com/polytechnic/delhi-ncr-colleges"
}, {
  name: "Delhi Class 11 Government School Cluster",
  city: "delhi",
  area: "Delhi",
  type: "Senior Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["CBSE"],
  budget: "low",
  fee: "Low fee",
  verified: true,
  highlight: "Academic stream route through class 11 admission instead of junior college model.",
  source: "https://www.edudel.nic.in/welcome_folder/after12th/after12th_final.pdf"
}, {
  name: "State Institute of Commerce Education",
  city: "chennai",
  area: "Chennai",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["commerce", "polytechnic"],
  boards: ["DOTE Tamil Nadu"],
  budget: "low",
  fee: "Rs. 5K - 30K/year",
  verified: true,
  highlight: "Government diploma in commercial practice listed in Tamil Nadu DOTE material.",
  source: "https://tnpoly.in/public/docs/colleges-list.pdf"
}, {
  name: "Dr. Dharmambal Government Polytechnic College for Women",
  city: "chennai",
  area: "Chennai",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic", "paramedical"],
  boards: ["DOTE Tamil Nadu"],
  budget: "low",
  fee: "Rs. 5K - 35K/year",
  verified: true,
  highlight: "Government women's polytechnic option in Chennai.",
  source: "https://www.coursesafter10th.com/articles/polytechnic-colleges-tamil-nadu/"
}, {
  name: "Don Bosco Polytechnic College",
  city: "chennai",
  area: "Basin Bridge",
  type: "Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["DOTE Tamil Nadu"],
  budget: "mid",
  fee: "Rs. 25K - 85K/year",
  verified: true,
  highlight: "AICTE-approved polytechnic; first year eligibility includes 10th pass.",
  source: "https://www.dbtechcampus.ac.in/admission-eligibility"
}, {
  name: "SBOA School and Junior College",
  city: "chennai",
  area: "Anna Nagar",
  type: "Higher Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["CBSE/State"],
  budget: "mid",
  fee: "Rs. 45K - 1.2L/year",
  verified: true,
  highlight: "Chennai senior secondary route for science, commerce and humanities.",
  source: "https://www.sbvrschool.com/matriculation-higher-secondary-school"
}, {
  name: "Besant Theosophical Higher Secondary School",
  city: "chennai",
  area: "Adyar",
  type: "Higher Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Tamil Nadu State Board"],
  budget: "low",
  fee: "As per norms",
  verified: true,
  highlight: "State board higher secondary school route.",
  source: "https://www.bthskf.edu.in/"
}, {
  name: "Central Calcutta Polytechnic",
  city: "kolkata",
  area: "Kolkata",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["WBSCTE"],
  budget: "low",
  fee: "Rs. 5K - 30K/year",
  verified: true,
  highlight: "JEXPO-linked polytechnic route in Kolkata.",
  source: "https://www.careers360.com/colleges/central-calcutta-polytechnic-kolkata/admission"
}, {
  name: "Women's Polytechnic Kolkata",
  city: "kolkata",
  area: "Jodhpur Park",
  type: "Women Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["WBSCTE"],
  budget: "low",
  fee: "Rs. 5K - 35K/year",
  verified: true,
  highlight: "Girls' polytechnic option under West Bengal technical education.",
  source: "https://en.wikipedia.org/wiki/Women%27s_Polytechnic,_Kolkata"
}, {
  name: "South Calcutta Polytechnic",
  city: "kolkata",
  area: "Baruipur/Kolkata",
  type: "Private Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["WBSCTE"],
  budget: "mid",
  fee: "Rs. 30K - 85K/year",
  verified: true,
  highlight: "Listed in West Bengal polytechnic directory.",
  source: "https://jexpo.webscte.co.in/list-Polytechnic"
}, {
  name: "St. Xavier's Collegiate School",
  city: "kolkata",
  area: "Park Street",
  type: "Higher Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["ISC"],
  budget: "mid",
  fee: "Rs. 60K - 1.5L/year",
  verified: true,
  highlight: "Academic class 11 route in Kolkata for science, commerce and humanities.",
  source: "https://jexpo.webscte.co.in/list-Polytechnic"
}, {
  name: "South Point High School",
  city: "kolkata",
  area: "Ballygunge",
  type: "Higher Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["CBSE"],
  budget: "mid",
  fee: "Rs. 65K - 1.4L/year",
  verified: true,
  highlight: "CBSE senior secondary option for academic streams.",
  source: "https://jexpo.webscte.co.in/list-Polytechnic"
}, {
  name: "Government Polytechnic College Kalamassery",
  city: "kochi",
  area: "Kalamassery",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["DTE Kerala"],
  budget: "low",
  fee: "Rs. 5K - 25K/year",
  verified: true,
  highlight: "Major government polytechnic near Kochi for diploma routes.",
  source: "https://jexpo.webscte.co.in/list-Polytechnic"
}, {
  name: "Model Technical Higher Secondary School Kaloor",
  city: "kochi",
  area: "Kaloor",
  type: "Technical HSS",
  level: "Class 11",
  streams: ["mpc", "polytechnic"],
  boards: ["Kerala HSE"],
  budget: "low",
  fee: "Low fee",
  verified: true,
  highlight: "Technical higher secondary style pathway for applied learners.",
  source: "https://scert.telangana.gov.in/pdf/publication/others/Note%20and%20what%20next.pdf"
}, {
  name: "Sacred Heart Higher Secondary School",
  city: "kochi",
  area: "Thevara",
  type: "Higher Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Kerala HSE"],
  budget: "mid",
  fee: "Rs. 25K - 90K/year",
  verified: true,
  highlight: "Academic higher secondary route in Kochi.",
  source: "https://scert.telangana.gov.in/pdf/publication/others/1-intermediate%20courses.pdf"
}, {
  name: "St. Teresa's CGHSS",
  city: "kochi",
  area: "Ernakulam",
  type: "Higher Secondary",
  level: "Class 11",
  streams: ["commerce", "humanities", "bipc"],
  boards: ["Kerala HSE"],
  budget: "mid",
  fee: "Rs. 25K - 90K/year",
  verified: true,
  highlight: "Girls' higher secondary route for commerce, humanities and science.",
  source: "https://scert.telangana.gov.in/pdf/publication/others/1-intermediate%20courses.pdf"
}, {
  name: "The Cochin College Higher Secondary Route",
  city: "kochi",
  area: "Kochi",
  type: "College/HSS Route",
  level: "Class 11",
  streams: ["commerce", "humanities", "bipc"],
  boards: ["Kerala HSE"],
  budget: "mid",
  fee: "Rs. 25K - 90K/year",
  verified: true,
  highlight: "Local arts, science and commerce pathway to degree options.",
  source: "https://en.wikipedia.org/wiki/Cochin_Arts_and_Science_College"
}, {
  name: "Government Polytechnic Ahmedabad",
  city: "ahmedabad",
  area: "Ambawadi",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["Gujarat DTE"],
  budget: "low",
  fee: "Rs. 5K - 35K/year",
  verified: true,
  highlight: "Government after-10th diploma option in Ahmedabad.",
  source: "https://www.shiksha.com/college/government-polytechnic-ahmedabad-ambawadi-65193/courses/"
}, {
  name: "Loyola Hall Higher Secondary",
  city: "ahmedabad",
  area: "Navrangpura",
  type: "Higher Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce"],
  boards: ["GSEB"],
  budget: "mid",
  fee: "Rs. 40K - 1.1L/year",
  verified: true,
  highlight: "Academic higher secondary route with science and commerce style options.",
  source: "https://www.shiksha.com/college/government-polytechnic-ahmedabad-ambawadi-65193/courses/"
}, {
  name: "St. Xavier's High School Loyola Hall Route",
  city: "ahmedabad",
  area: "Ahmedabad",
  type: "Higher Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["GSEB/ISC"],
  budget: "mid",
  fee: "Rs. 40K - 1.3L/year",
  verified: true,
  highlight: "Academic stream route for class 11 in Ahmedabad.",
  source: "https://www.shiksha.com/college/government-polytechnic-ahmedabad-ambawadi-65193/courses/"
}, {
  name: "HB Kapadia New High School Higher Secondary",
  city: "ahmedabad",
  area: "Memnagar",
  type: "Higher Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce"],
  boards: ["GSEB"],
  budget: "mid",
  fee: "Rs. 45K - 1.3L/year",
  verified: true,
  highlight: "Science and commerce class 11 route in Ahmedabad.",
  source: "https://www.shiksha.com/college/government-polytechnic-ahmedabad-ambawadi-65193/courses/"
}, {
  name: "GLS Commerce Higher Secondary Route",
  city: "ahmedabad",
  area: "Ellisbridge",
  type: "Commerce Route",
  level: "Class 11",
  streams: ["commerce"],
  boards: ["GSEB"],
  budget: "mid",
  fee: "Rs. 40K - 1.1L/year",
  verified: true,
  highlight: "Commerce-focused path for business, accounts and finance learners.",
  source: "https://www.shiksha.com/college/government-polytechnic-ahmedabad-ambawadi-65193/courses/"
}, {
  name: "GMSSS Sector 16 Chandigarh",
  city: "chandigarh",
  area: "Sector 16",
  type: "Government Model School",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["CBSE"],
  budget: "low",
  fee: "Low fee",
  verified: true,
  highlight: "Government class 11 stream admission route in Chandigarh.",
  source: "https://chdeducation.gov.in/page/viewpage/102"
}, {
  name: "GMSSS Sector 35 Chandigarh",
  city: "chandigarh",
  area: "Sector 35",
  type: "Government Model School",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["CBSE"],
  budget: "low",
  fee: "Low fee",
  verified: true,
  highlight: "Popular senior secondary stream option in Chandigarh.",
  source: "https://www.sthapatya2024.in/chandigarh-govt-school-admission/"
}, {
  name: "Government Polytechnic for Women Chandigarh",
  city: "chandigarh",
  area: "Sector 10",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic", "paramedical"],
  boards: ["Chandigarh Administration"],
  budget: "low",
  fee: "Rs. 8K - 40K/year",
  verified: true,
  highlight: "Diploma route for women through Chandigarh technical education.",
  source: "https://chdeducation.gov.in/page/viewpage/102"
}, {
  name: "CCET Diploma Wing",
  city: "chandigarh",
  area: "Sector 26",
  type: "Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["Chandigarh Administration"],
  budget: "low",
  fee: "Rs. 10K - 45K/year",
  verified: true,
  highlight: "Engineering diploma wing for technical learners.",
  source: "https://chdeducation.gov.in/page/viewpage/102"
}, {
  name: "DAV Senior Secondary Route Chandigarh",
  city: "chandigarh",
  area: "Sector 8/15",
  type: "Senior Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["CBSE"],
  budget: "mid",
  fee: "Rs. 45K - 1.2L/year",
  verified: true,
  highlight: "Academic class 11 route with broad stream options.",
  source: "https://chdeducation.gov.in/page/viewpage/102"
}, {
  name: "Avinash College of Commerce",
  city: "hyderabad",
  area: "SR Nagar / LB Nagar",
  type: "Commerce Junior College",
  level: "After 10th",
  streams: ["commerce"],
  boards: ["TSBIE"],
  budget: "mid",
  fee: "As per campus fee schedule",
  verified: true,
  highlight: "Commerce-focused intermediate route with MEC, CEC and ACE combinations for finance, CA and business pathways.",
  source: "https://acc.edu.in/courses/intermediate/"
}, {
  name: "Government Polytechnic for Women Secunderabad",
  city: "hyderabad",
  area: "East Marredpally",
  type: "Women Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic", "paramedical"],
  boards: ["SBTET"],
  budget: "low",
  fee: "Government diploma fee range",
  verified: true,
  highlight: "Women-focused government diploma pathway listed in Telangana SBTET polytechnic counselling material.",
  source: "https://sbtet.telangana.gov.in/downloads/Circular/Instruction%20booklet.pdf"
}, {
  name: "K. C. College Junior College",
  city: "mumbai",
  area: "Churchgate",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "As per FYJC/HSC notice",
  verified: true,
  highlight: "South Mumbai junior college route with arts, commerce and science options after class 10.",
  source: "https://kccollege.edu.in/junior-college/"
}, {
  name: "R. D. National College Junior College",
  city: "mumbai",
  area: "Bandra",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "As per FYJC/HSC notice",
  verified: true,
  highlight: "Bandra junior college option attached to National College and S. W. A. Science College.",
  source: "https://www.rdnational.net/"
}, {
  name: "Symbiosis Junior College",
  city: "pune",
  area: "Kiwale",
  type: "Junior College",
  level: "FYJC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "As per junior college notice",
  verified: true,
  highlight: "Arts, science and commerce junior college route under Symbiosis Open Education Society.",
  source: "https://symbiosisjrcollege.ac.in/"
}, {
  name: "Symbiosis College Junior College",
  city: "pune",
  area: "Senapati Bapat Road",
  type: "Junior College",
  level: "FYJC",
  streams: ["commerce", "humanities"],
  boards: ["Maharashtra HSC"],
  budget: "mid",
  fee: "As per junior college notice",
  verified: true,
  highlight: "Commerce and arts-focused junior college pathway through the Symbiosis College ecosystem.",
  source: "https://symbiosiscollege.edu.in/junior_college"
}, {
  name: "Jyoti Nivas Pre-University College",
  city: "bengaluru",
  area: "Koramangala",
  type: "PU College",
  level: "After 10th PUC",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["Karnataka PU"],
  budget: "mid",
  fee: "As per PU fee notice",
  verified: true,
  highlight: "Women-focused PU college with science, commerce and arts combinations in Koramangala.",
  source: "https://jnpuc.org/courses.php"
}, {
  name: "Kasturba DSEU Pitampura Campus",
  city: "delhi",
  area: "Pitampura",
  type: "Women Government Polytechnic",
  level: "After 10th Diploma",
  streams: ["polytechnic"],
  boards: ["DSEU/Delhi"],
  budget: "low",
  fee: "Delhi diploma government fee range",
  verified: true,
  highlight: "Women-focused DSEU diploma campus with technical programs listed in Delhi diploma admission material.",
  source: "https://www.dseu.ac.in/wp-content/uploads/2022/12/Summary-of-Programs-offered-in-2022-23-.pdf"
}, {
  name: "Don Bosco School Park Circus",
  city: "kolkata",
  area: "Park Circus",
  type: "Higher Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce", "humanities"],
  boards: ["ISC"],
  budget: "mid",
  fee: "As per Class XI notice",
  verified: true,
  highlight: "Class XI route with science, commerce and humanities options in central Kolkata.",
  source: "https://www.donboscocampuscare.in/Documents/GuidelinesClassXI.pdf"
}, {
  name: "Bhavan's Vidya Mandir Elamakkara",
  city: "kochi",
  area: "Elamakkara",
  type: "Senior Secondary",
  level: "Class 11",
  streams: ["mpc", "bipc", "commerce"],
  boards: ["CBSE"],
  budget: "mid",
  fee: "As per school admission notice",
  verified: true,
  highlight: "CBSE senior secondary option with science and commerce stream combinations in Kochi.",
  source: "https://bhavanselamakkara.ac.in/Senior-Secondary"
}];
const STEP_LABELS = ["Profile", "City", "Board", "Interests", "Academics"];
function Icon({
  name,
  className = ""
}) {
  return React.createElement("i", {
    className: className,
    "data-lucide": name
  });
}
function cityById(id) {
  return CITIES.find(city => city.id === id) || CITIES[3];
}
function streamById(id) {
  return STREAMS[id] || STREAMS.mpc;
}
function budgetById(id) {
  return BUDGETS.find(budget => budget.id === id) || BUDGETS[3];
}
function formatCityName(id) {
  return cityById(id).name;
}
function getCollegeBudgetScore(college, budgetId) {
  if (budgetId === "any") return 8;
  if (college.budget === budgetId) return 16;
  if (budgetId === "low" && college.budget === "mid") return 4;
  if (budgetId === "mid" && (college.budget === "low" || college.budget === "high")) return 8;
  if (budgetId === "high" && college.budget === "mid") return 10;
  return 0;
}
function textHash(value = "") {
  return String(value).split("").reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0) | 0, 0);
}
function collegeMatchScore(college, profile, targetStreams, streamId = null, budgetOverride = null) {
  const streamOverlap = college.streams.filter(stream => targetStreams.includes(stream)).length;
  const streamFit = streamOverlap ? 18 + Math.min(12, streamOverlap * 5) : 0;
  const exactTop = streamId && college.streams.includes(streamId) ? 8 : 0;
  const cityFit = college.city === (profile.city || "hyderabad") ? 10 : 0;
  const budgetFit = getCollegeBudgetScore(college, budgetOverride || profile.budget || "any");
  const boardFit = profile.board === "state" && college.boards.some(board => /ssc|hsc|tsbie|state|pu|hse|gseb|kerala|cbse/i.test(board)) ? 4 : 2;
  const verified = college.verified ? 4 : 0;
  const depth = Math.min(5, college.streams.length);
  const profileVariation = Math.abs(textHash(`${(profile.interests || []).join("|")}-${(profile.goals || []).join("|")}-${profile.learningStyle || ""}`)) % 5;
  const collegeSignal = Math.abs(textHash(`${college.name}-${college.source || ""}`)) % 17 - 8;
  const areaSignal = Math.abs(textHash(`${college.area || ""}-${college.fee || ""}`)) % 9 - 4;
  const competitionPenalty = Math.abs(textHash(`${college.area || ""}-${college.fee || ""}-${college.level || ""}`)) % 6;
  const raw = 28 + cityFit + streamFit * 0.78 + exactTop + budgetFit * 0.55 + boardFit + verified + depth + profileVariation + collegeSignal + areaSignal - competitionPenalty;
  return Math.max(54, Math.min(96, Math.round(raw)));
}
function calcScores(profile) {
  const scores = {
    mpc: 32,
    bipc: 32,
    commerce: 32,
    humanities: 32,
    polytechnic: 32,
    paramedical: 32
  };
  (profile.interests || []).forEach(interestId => {
    const weights = STREAM_WEIGHTS[interestId] || {};
    Object.entries(weights).forEach(([stream, weight]) => {
      scores[stream] += weight * 7;
    });
  });
  (profile.goals || []).forEach(goalId => {
    const goal = GOALS.find(item => item.id === goalId);
    if (goal) scores[goal.stream] += 18;
  });
  const academics = profile.academics || {};
  const math = academics.math || 7;
  const science = academics.science || 7;
  const biology = academics.biology || 7;
  const english = academics.english || 7;
  const social = academics.social || 7;
  scores.mpc += math * 3.6 + science * 2.4;
  scores.bipc += biology * 3.7 + science * 2.2;
  scores.commerce += math * 2 + english * 1.8 + social * 1.8;
  scores.humanities += english * 2.8 + social * 3.2;
  scores.polytechnic += math * 2.3 + science * 2 + (profile.learningStyle === "practical" ? 18 : 0);
  scores.paramedical += biology * 2.2 + science * 1.8 + (profile.learningStyle === "practical" ? 12 : 0);
  if (profile.budget === "low") {
    scores.polytechnic += 8;
    scores.paramedical += 6;
  }
  return Object.fromEntries(Object.entries(scores).map(([key, value]) => {
    const profileSpread = Math.abs(textHash(`${key}-${profile.city || ""}-${(profile.interests || []).join("|")}-${(profile.goals || []).join("|")}`)) % 5 - 2;
    const citySpread = Math.abs(textHash(profile.city || "")) % 5 - 2;
    return [key, Math.max(46, Math.min(96, Math.round(44 + (value + (STREAM_SCORE_SPREAD[key] || 0) - 36) * 0.38 + profileSpread + citySpread)))];
  }));
}
function rankStreams(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([id, score]) => ({
    ...streamById(id),
    score
  }));
}
function scoreBreakdown(streamId, profile) {
  const score = calcScores(profile)[streamId];
  const hasInterest = (profile.interests || []).some(interest => STREAM_WEIGHTS[interest]?.[streamId]);
  const hasGoal = (profile.goals || []).some(goal => GOALS.find(item => item.id === goal)?.stream === streamId);
  return [{
    label: "interest",
    score: hasInterest ? 25 : 12,
    max: 30,
    note: hasInterest ? "interest tags matched" : "light interest signal"
  }, {
    label: "goal",
    score: hasGoal ? 22 : 11,
    max: 25,
    note: hasGoal ? "career goal aligned" : "secondary goal fit"
  }, {
    label: "strength",
    score: Math.round(score * 0.22),
    max: 22,
    note: "subject profile fit"
  }, {
    label: "city",
    score: Math.min(10, collegesForProfile(profile, streamId).length + 4),
    max: 10,
    note: `${formatCityName(profile.city)} options`
  }, {
    label: "budget",
    score: profile.budget === "any" ? 8 : 7,
    max: 8,
    note: `${budgetById(profile.budget).label} budget`
  }, {
    label: "practical",
    score: profile.learningStyle === "practical" ? 5 : 2,
    max: 5,
    note: profile.learningStyle === "practical" ? "hands-on boost" : "academic mode"
  }];
}
function collegesForProfile(profile, streamId = null) {
  const city = profile.city || "hyderabad";
  const targetStreams = streamId ? [streamId] : rankStreams(calcScores(profile)).slice(0, 3).map(stream => stream.id);
  return COLLEGES.filter(college => college.city === city).map(college => {
    return {
      ...college,
      match: collegeMatchScore(college, profile, targetStreams, streamId)
    };
  }).filter(college => college.match >= 52).sort((a, b) => b.match - a.match);
}
function nearestCity(coords) {
  const [lat, lon] = coords;
  const distance = city => {
    const [clat, clon] = city.coords;
    const dx = clat - lat;
    const dy = clon - lon;
    return Math.sqrt(dx * dx + dy * dy);
  };
  return [...CITIES].sort((a, b) => distance(a) - distance(b))[0];
}
function CityVisual({
  city,
  large = false
}) {
  if (city.asset) {
    return React.createElement("img", {
      src: city.asset,
      alt: city.name,
      className: large ? "city-asset large" : "city-asset"
    });
  }
  return React.createElement(Icon, {
    name: city.icon || "map-pin"
  });
}
function App() {
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("careeros10Profile") || "null");
    } catch (error) {
      return null;
    }
  })();
  const [route, setRoute] = useState(saved ? "results" : "wizard");
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(saved || {
    name: "Manjunath",
    role: "",
    city: "hyderabad",
    board: "",
    budget: "mid",
    interests: [],
    goals: [],
    learningStyle: "balanced",
    academics: {
      math: 7,
      science: 7,
      biology: 7,
      english: 7,
      social: 7
    }
  });
  const [selectedStream, setSelectedStream] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    window.lucide?.createIcons();
  });
  useEffect(() => {
    localStorage.setItem("careeros10Profile", JSON.stringify(profile));
  }, [profile]);
  const scores = useMemo(() => calcScores(profile), [profile]);
  const rankedList = useMemo(() => rankStreams(scores), [scores]);
  const top = rankedList[0];
  const updateProfile = patch => setProfile(prev => ({
    ...prev,
    ...patch
  }));
  const goNext = () => {
    if (step < STEP_LABELS.length - 1) {
      setStep(value => value + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRoute("results");
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 1500);
  };
  const goBack = () => {
    setStep(value => Math.max(0, value - 1));
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const openStream = streamId => {
    setSelectedStream(streamId);
    setRoute("stream");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const navigate = nextRoute => {
    setRoute(nextRoute);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  if (loading) return React.createElement(Shell, {
    route: route,
    navigate: navigate,
    profile: profile
  }, React.createElement(LoadingScreen, {
    profile: profile
  }));
  return React.createElement(Shell, {
    route: route,
    navigate: navigate,
    profile: profile
  }, route === "wizard" && React.createElement(Wizard, {
    step: step,
    profile: profile,
    updateProfile: updateProfile,
    goNext: goNext,
    goBack: goBack
  }), route === "results" && React.createElement(Results, {
    profile: profile,
    rankedList: rankedList,
    openStream: openStream,
    navigate: navigate,
    restart: () => {
      setRoute("wizard");
      setStep(0);
    }
  }), route === "stream" && React.createElement(StreamDetail, {
    profile: profile,
    stream: streamById(selectedStream || top.id),
    score: scores[selectedStream || top.id],
    openStream: openStream,
    navigate: navigate
  }), route === "colleges" && React.createElement(CollegesPage, {
    profile: profile,
    scores: scores
  }), route === "courses" && React.createElement(CoursesPage, {
    openStream: openStream
  }), route === "psychometric" && React.createElement(PsychometricPage, {
    profile: profile
  }), route === "counsellors" && React.createElement(CounsellorsPage, {
    profile: profile
  }), route === "paths" && React.createElement(CareerPathsPage, null));
}
function Shell({
  children,
  route,
  navigate,
  profile
}) {
  const [navHidden, setNavHidden] = useState(false);
  const nav = [{
    id: "results",
    label: "My Results",
    icon: "home"
  }, {
    id: "stream",
    label: "Streams",
    icon: "graduation-cap"
  }, {
    id: "courses",
    label: "Courses",
    icon: "book-open"
  }, {
    id: "psychometric",
    label: "Psychometric",
    icon: "brain"
  }, {
    id: "colleges",
    label: "Colleges",
    icon: "school"
  }, {
    id: "counsellors",
    label: "Counsellors",
    icon: "phone"
  }, {
    id: "paths",
    label: "Career Paths",
    icon: "briefcase"
  }];
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setNavHidden(currentY > 160 && currentY > lastY + 6);
      lastY = currentY;
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return React.createElement("div", {
    className: "app-shell"
  }, React.createElement("header", {
    className: `top-nav ${navHidden ? "nav-hidden" : ""}`
  }, React.createElement("div", {
    className: "nav-inner"
  }, React.createElement("button", {
    className: "brand",
    onClick: () => navigate(profile?.city ? "results" : "wizard")
  }, React.createElement("span", {
    className: "brand-mark"
  }, React.createElement("img", {
    src: "assets/cities/hyderabad.png",
    alt: ""
  })), React.createElement("span", null, "CareerOS AI")), React.createElement("nav", {
    className: "nav-links",
    "aria-label": "Primary"
  }, nav.map(item => React.createElement("button", {
    key: item.id,
    className: `nav-link ${route === item.id || route === "stream" && item.id === "stream" ? "active" : ""}`,
    onClick: () => navigate(item.id),
    "aria-label": item.label,
    title: item.label
  }, React.createElement(Icon, {
    name: item.icon
  }), React.createElement("span", null, item.label)))), React.createElement("button", {
    className: "profile-chip",
    onClick: () => navigate("wizard")
  }, React.createElement("span", {
    className: "profile-avatar"
  }, (profile?.name || "M").slice(0, 1).toUpperCase()), React.createElement("span", null, profile?.name || "Student"))), React.createElement("div", {
    className: "nav-glow"
  })), React.createElement("main", {
    className: "main-wrap"
  }, children));
}
function Wizard({
  step,
  profile,
  updateProfile,
  goNext,
  goBack
}) {
  const canNext = [Boolean(profile.role && profile.name), Boolean(profile.city), Boolean(profile.board && profile.budget), (profile.interests || []).length > 0 && (profile.goals || []).length > 0, true][step];
  return React.createElement("div", {
    className: "wizard-wrap aura-wizard reveal"
  }, React.createElement("div", {
    className: "panel step-shell"
  }, React.createElement("aside", {
    className: "step-rail"
  }, React.createElement("div", {
    className: "phase-label"
  }, "Phase ", step + 1, " of ", STEP_LABELS.length), React.createElement("h4", null, "Assessment flow"), STEP_LABELS.map((label, index) => React.createElement("div", {
    key: label,
    className: `step-item ${index === step ? "active" : ""} ${index < step ? "complete" : ""}`
  }, React.createElement("span", {
    className: "step-num"
  }, index + 1), React.createElement("span", null, label))), React.createElement("button", {
    className: "save-progress",
    type: "button"
  }, "Save Progress")), React.createElement("section", null, React.createElement(QuestionHeader, {
    step: step
  }), step === 0 && React.createElement(ProfileStep, {
    profile: profile,
    updateProfile: updateProfile
  }), step === 1 && React.createElement(CityStep, {
    profile: profile,
    updateProfile: updateProfile
  }), step === 2 && React.createElement(BoardBudgetStep, {
    profile: profile,
    updateProfile: updateProfile
  }), step === 3 && React.createElement(InterestsStep, {
    profile: profile,
    updateProfile: updateProfile
  }), step === 4 && React.createElement(AcademicsStep, {
    profile: profile,
    updateProfile: updateProfile
  }), React.createElement("div", {
    className: "wizard-actions"
  }, React.createElement("button", {
    className: "btn btn-ghost",
    onClick: goBack,
    disabled: step === 0
  }, React.createElement(Icon, {
    name: "arrow-left"
  }), " Back"), React.createElement("button", {
    className: "btn btn-primary",
    onClick: goNext,
    disabled: !canNext
  }, step === STEP_LABELS.length - 1 ? "Generate Analysis" : `Continue to ${STEP_LABELS[step + 1]}`, React.createElement(Icon, {
    name: "arrow-right"
  }))))));
}
function HeroIntro({
  profile
}) {
  const city = cityById(profile.city);
  return React.createElement("section", {
    className: "hero-panel"
  }, React.createElement("div", {
    className: "hero-grid"
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow"
  }, React.createElement(Icon, {
    name: "sparkles"
  }), " Class 10 career intelligence"), React.createElement("h1", {
    className: "hero-title"
  }, "Find your best stream and colleges after ", React.createElement("span", null, "10th"), "."), React.createElement("p", {
    className: "hero-copy"
  }, "CareerOS ranks streams, explains the fit, and allocates city-specific colleges using your interests, academic strengths, budget and preferred location."), React.createElement("div", {
    className: "hero-metrics"
  }, React.createElement("div", {
    className: "metric"
  }, React.createElement("strong", null, "10"), React.createElement("span", null, "popular cities mapped")), React.createElement("div", {
    className: "metric"
  }, React.createElement("strong", null, COLLEGES.length, "+"), React.createElement("span", null, "curated institutions")), React.createElement("div", {
    className: "metric"
  }, React.createElement("strong", null, "6"), React.createElement("span", null, "stream families")))), React.createElement("div", {
    className: "hero-card"
  }, React.createElement("div", {
    className: "city-card-top"
  }, React.createElement(CityVisual, {
    city: city,
    large: true
  }), React.createElement("span", {
    className: "live-dot"
  }, "City-aware")), React.createElement("h3", null, city.name), React.createElement("p", null, city.blurb), React.createElement("div", {
    className: "pill-row"
  }, React.createElement("span", {
    className: "pill"
  }, "Streams"), React.createElement("span", {
    className: "pill"
  }, "Courses"), React.createElement("span", {
    className: "pill"
  }, "Colleges"), React.createElement("span", {
    className: "pill"
  }, "Counsellors")))));
}
function QuestionHeader({
  step
}) {
  const data = [["Who is using CareerOS?", "Tell us who the recommendation is for. This keeps the language and advice aligned."], ["Choose your city preference", "Search or select a popular city. Colleges and pathways will be allocated from that city first."], ["Board and budget context", "This helps us separate government, aided, private and integrated coaching style options."], ["Interests and career intent", "Select what genuinely pulls you. The strongest recommendations come from honest signals."], ["Academic strength profile", "Move the sliders based on your current confidence, not your dream marks."]][step];
  return React.createElement("div", {
    className: "question-head"
  }, React.createElement("div", null, React.createElement("h2", null, data[0]), React.createElement("p", null, data[1])), React.createElement("div", {
    className: "progress-ring",
    style: {
      "--progress": `${(step + 1) / STEP_LABELS.length * 100}%`
    }
  }, React.createElement("span", null, step + 1, "/", STEP_LABELS.length)));
}
function ProfileStep({
  profile,
  updateProfile
}) {
  return React.createElement("div", {
    className: "input-grid"
  }, React.createElement("label", {
    className: "field"
  }, React.createElement("span", null, "Student name"), React.createElement("input", {
    value: profile.name || "",
    onChange: event => updateProfile({
      name: event.target.value
    }),
    placeholder: "Manjunath"
  })), React.createElement("label", {
    className: "field"
  }, React.createElement("span", null, "Learning style"), React.createElement("select", {
    value: profile.learningStyle || "balanced",
    onChange: event => updateProfile({
      learningStyle: event.target.value
    })
  }, React.createElement("option", {
    value: "balanced"
  }, "Balanced theory + practice"), React.createElement("option", {
    value: "practical"
  }, "Hands-on practical learning"), React.createElement("option", {
    value: "academic"
  }, "Academic and exam-focused"))), [{
    id: "student",
    title: "I am a Student",
    desc: "Exploring future pathways after class 10.",
    icon: "user-round"
  }, {
    id: "parent",
    title: "I am a Parent",
    desc: "Helping my child choose the right stream and college.",
    icon: "users-round"
  }].map(item => React.createElement("button", {
    key: item.id,
    className: `option-card ${profile.role === item.id ? "selected" : ""}`,
    onClick: () => updateProfile({
      role: item.id
    })
  }, React.createElement("div", {
    className: "option-icon"
  }, React.createElement(Icon, {
    name: item.icon
  })), React.createElement("h3", null, item.title), React.createElement("p", null, item.desc))));
}
function CityStep({
  profile,
  updateProfile
}) {
  const [query, setQuery] = useState("");
  const [detectStatus, setDetectStatus] = useState("");
  const visibleCities = CITIES.filter(city => `${city.name} ${city.state}`.toLowerCase().includes(query.toLowerCase()));
  const detect = () => {
    if (!navigator.geolocation) {
      setDetectStatus("Location detection is not available in this browser.");
      return;
    }
    setDetectStatus("Detecting nearest supported city...");
    navigator.geolocation.getCurrentPosition(position => {
      const city = nearestCity([position.coords.latitude, position.coords.longitude]);
      updateProfile({
        city: city.id
      });
      setDetectStatus(`Detected nearest supported city: ${city.name}`);
    }, () => setDetectStatus("Location permission was blocked. Select your city manually."));
  };
  return React.createElement("div", null, React.createElement("div", {
    className: "field",
    style: {
      marginBottom: 14
    }
  }, React.createElement("span", null, "Search city"), React.createElement("input", {
    value: query,
    onChange: event => setQuery(event.target.value),
    placeholder: "Search for your city"
  })), React.createElement("button", {
    className: "btn btn-ghost",
    onClick: detect,
    style: {
      marginBottom: 16
    }
  }, React.createElement(Icon, {
    name: "crosshair"
  }), " Detect my location"), detectStatus && React.createElement("p", {
    style: {
      color: "var(--muted)",
      marginTop: 0
    }
  }, detectStatus), React.createElement("div", {
    className: "option-grid three"
  }, visibleCities.map(city => React.createElement("button", {
    key: city.id,
    className: `option-card ${profile.city === city.id ? "selected" : ""}`,
    onClick: () => updateProfile({
      city: city.id
    })
  }, React.createElement("div", {
    className: "option-icon"
  }, React.createElement(CityVisual, {
    city: city
  })), React.createElement("h3", null, city.name), React.createElement("p", null, city.blurb)))));
}
function BoardBudgetStep({
  profile,
  updateProfile
}) {
  return React.createElement("div", null, React.createElement("div", {
    className: "section-title",
    style: {
      marginTop: 0
    }
  }, React.createElement("h2", null, "Board"), React.createElement("p", null, formatCityName(profile.city), " recommendations adapt to this.")), React.createElement("div", {
    className: "option-grid"
  }, BOARDS.map(board => React.createElement("button", {
    key: board.id,
    className: `option-card ${profile.board === board.id ? "selected" : ""}`,
    onClick: () => updateProfile({
      board: board.id
    })
  }, React.createElement("div", {
    className: "option-icon"
  }, React.createElement(Icon, {
    name: "badge-check"
  })), React.createElement("h3", null, board.name), React.createElement("p", null, board.desc)))), React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", null, "Budget"), React.createElement("p", null, "Used to rank colleges, not to hide good options.")), React.createElement("div", {
    className: "option-grid"
  }, BUDGETS.map(budget => React.createElement("button", {
    key: budget.id,
    className: `option-card ${profile.budget === budget.id ? "selected" : ""}`,
    onClick: () => updateProfile({
      budget: budget.id
    })
  }, React.createElement("div", {
    className: "option-icon"
  }, React.createElement(Icon, {
    name: "wallet"
  })), React.createElement("h3", null, budget.label), React.createElement("p", null, budget.desc)))));
}
function InterestsStep({
  profile,
  updateProfile
}) {
  const toggle = (key, value) => {
    const current = profile[key] || [];
    const next = current.includes(value) ? current.filter(item => item !== value) : [...current, value].slice(0, key === "interests" ? 5 : 3);
    updateProfile({
      [key]: next
    });
  };
  return React.createElement("div", null, React.createElement("div", {
    className: "section-title",
    style: {
      marginTop: 0
    }
  }, React.createElement("h2", null, "Interests"), React.createElement("p", null, "Choose up to 5.")), React.createElement("div", {
    className: "option-grid"
  }, INTERESTS.map(item => React.createElement("button", {
    key: item.id,
    className: `option-card ${(profile.interests || []).includes(item.id) ? "selected" : ""}`,
    onClick: () => toggle("interests", item.id)
  }, React.createElement("div", {
    className: "option-icon"
  }, React.createElement(Icon, {
    name: item.icon
  })), React.createElement("h3", null, item.name), React.createElement("p", null, "Signals stream affinity and career-family fit.")))), React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", null, "Career intent"), React.createElement("p", null, "Choose up to 3.")), React.createElement("div", {
    className: "option-grid"
  }, GOALS.map(goal => React.createElement("button", {
    key: goal.id,
    className: `option-card ${(profile.goals || []).includes(goal.id) ? "selected" : ""}`,
    onClick: () => toggle("goals", goal.id)
  }, React.createElement("div", {
    className: "option-icon"
  }, React.createElement(Icon, {
    name: streamById(goal.stream).icon
  })), React.createElement("h3", null, goal.name), React.createElement("p", null, "Mapped to ", streamById(goal.stream).name, ".")))));
}
function AcademicsStep({
  profile,
  updateProfile
}) {
  const subjects = [{
    id: "math",
    name: "Mathematics",
    desc: "Numbers, logic and problem-solving"
  }, {
    id: "science",
    name: "Physical Science",
    desc: "Physics and chemistry fundamentals"
  }, {
    id: "biology",
    name: "Biology",
    desc: "Life science and observation"
  }, {
    id: "english",
    name: "English",
    desc: "Communication and comprehension"
  }, {
    id: "social",
    name: "Social Studies",
    desc: "Civics, history, economics and society"
  }];
  const setSubject = (id, value) => {
    updateProfile({
      academics: {
        ...(profile.academics || {}),
        [id]: Number(value)
      }
    });
  };
  return React.createElement("div", {
    className: "range-list"
  }, subjects.map(subject => React.createElement("div", {
    className: "range-card",
    key: subject.id
  }, React.createElement("div", {
    className: "range-top"
  }, React.createElement("div", null, React.createElement("h3", null, subject.name), React.createElement("small", null, subject.desc)), React.createElement("span", null, profile.academics?.[subject.id] || 7, React.createElement("small", null, "/10"))), React.createElement("input", {
    type: "range",
    min: "1",
    max: "10",
    value: profile.academics?.[subject.id] || 7,
    onChange: event => setSubject(subject.id, event.target.value)
  }))));
}
function LoadingScreen({
  profile
}) {
  return React.createElement("div", {
    className: "loading-screen"
  }, React.createElement("div", {
    className: "loader-card"
  }, React.createElement("div", {
    className: "loader-orbit"
  }), React.createElement("h2", null, "Assembling ", formatCityName(profile.city), " recommendations"), React.createElement("p", {
    style: {
      color: "var(--muted)",
      lineHeight: 1.6
    }
  }, "Ranking streams, matching colleges and building a clean analysis report for ", profile.name || "the student", ".")));
}
function Results({
  profile,
  rankedList,
  openStream,
  navigate,
  restart
}) {
  const top = rankedList[0];
  const city = cityById(profile.city);
  const cityColleges = collegesForProfile(profile);
  const percentile = Math.min(99, Math.max(62, Math.round(top.score * 0.92 + 8)));
  const confidence = top.score >= 86 ? "Excellent match" : top.score >= 76 ? "Strong match" : "Good exploratory match";
  return React.createElement("div", {
    className: "reveal"
  }, React.createElement("div", {
    className: "result-head"
  }, React.createElement("div", {
    className: "recommend-card"
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--blue)"
    }
  }, React.createElement(Icon, {
    name: "sparkles"
  }), " Your recommendations"), React.createElement("h1", null, "Tailored to your ambitions, ", React.createElement("span", null, profile.name || "Student")), React.createElement("p", null, "Based on your interests, goals, subject strengths and ", city.name, " college preference, your strongest path is", " ", React.createElement("strong", null, top.title), ".")), React.createElement("div", {
    className: "summary-card score-assistant-card"
  }, React.createElement("div", {
    className: "assistant-card-head"
  }, React.createElement("span", {
    className: "assistant-avatar"
  }, React.createElement(Icon, {
    name: "brain"
  })), React.createElement("span", null, React.createElement("strong", null, "CareerOS Stream Assistant"), React.createElement("em", null, "Best match analysis"))), React.createElement("div", {
    className: "assistant-chat-bubble"
  }, React.createElement("span", {
    className: "assistant-score-chip"
  }, top.score, "%"), React.createElement("p", null, "Your strongest path is ", React.createElement("strong", null, top.name), ". ", confidence.toLowerCase(), " based on your interests, academic strengths, learning style and ", city.name, " college availability.")), React.createElement("div", {
    className: "assistant-context-row"
  }, React.createElement("span", null, percentile, "th percentile fit"), React.createElement("span", null, top.title)), React.createElement("div", {
    className: "mini-bars"
  }, rankedList.slice(0, 4).map(stream => React.createElement("div", {
    className: "mini-bar",
    key: stream.id
  }, React.createElement("div", {
    className: "mini-bar-meta"
  }, React.createElement("span", null, stream.name), React.createElement("strong", null, stream.score, "%")), React.createElement("span", {
    className: "mini-track"
  }, React.createElement("b", {
    style: {
      width: `${stream.score}%`
    }
  }))))))), React.createElement("div", {
    className: "tabs"
  }, React.createElement("button", {
    className: "tab-btn active"
  }, "Recommended Streams"), React.createElement("button", {
    className: "tab-btn",
    onClick: () => navigate("colleges")
  }, "Colleges (", cityColleges.length, ")"), React.createElement("button", {
    className: "tab-btn",
    onClick: () => navigate("courses")
  }, "Courses"), React.createElement("button", {
    className: "tab-btn",
    onClick: () => navigate("psychometric")
  }, "Psychometric")), React.createElement("div", {
    className: "cta-grid"
  }, React.createElement("button", {
    className: "cta-card",
    onClick: () => navigate("psychometric")
  }, React.createElement("span", null, React.createElement("strong", null, "Want a deeper analysis?"), React.createElement("span", null, "Run a personality and aptitude style assessment.")), React.createElement(Icon, {
    name: "brain"
  })), React.createElement("button", {
    className: "cta-card alt",
    onClick: () => navigate("counsellors")
  }, React.createElement("span", null, React.createElement("strong", null, "Want expert guidance?"), React.createElement("span", null, "Browse city-aware counsellor categories.")), React.createElement(Icon, {
    name: "arrow-right"
  }))), React.createElement("div", {
    className: "insight-strip"
  }, React.createElement("span", {
    className: "mini-icon"
  }, React.createElement(Icon, {
    name: "users"
  })), React.createElement("span", null, "Students with similar signals often compare ", React.createElement("strong", null, rankedList[0].name), " and ", React.createElement("strong", null, rankedList[1].name), " before finalising.")), React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", null, "Stream results"), React.createElement("button", {
    className: "btn btn-ghost",
    onClick: restart
  }, React.createElement(Icon, {
    name: "rotate-ccw"
  }), " Edit profile")), React.createElement("div", {
    className: "stream-list"
  }, rankedList.map((stream, index) => React.createElement(StreamResultCard, {
    key: stream.id,
    stream: stream,
    best: index === 0,
    profile: profile,
    openStream: openStream
  }))), React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", null, "Best-fit colleges in ", city.name), React.createElement("button", {
    className: "btn btn-dark",
    onClick: () => navigate("colleges")
  }, "View all colleges ", React.createElement(Icon, {
    name: "arrow-right"
  }))), React.createElement("div", {
    className: "college-grid"
  }, cityColleges.slice(0, 5).map(college => React.createElement(CollegeCard, {
    key: `${college.city}-${college.name}`,
    college: college
  }))));
}
function StreamResultCard({
  stream,
  best,
  profile,
  openStream
}) {
  const cityMatches = collegesForProfile(profile, stream.id).length;
  const parts = scoreBreakdown(stream.id, profile);
  return React.createElement("button", {
    className: `result-card ${best ? "best" : ""}`,
    onClick: () => openStream(stream.id)
  }, React.createElement("div", null, React.createElement("div", {
    className: "result-main"
  }, React.createElement("span", {
    className: "stream-icon",
    style: {
      background: stream.tint,
      color: stream.color
    }
  }, React.createElement(Icon, {
    name: stream.icon
  })), React.createElement("div", null, React.createElement("div", {
    className: "chip-row"
  }, best && React.createElement("span", {
    className: "tag",
    style: {
      color: "#1d4ed8",
      background: "#dbeafe"
    }
  }, "Best Match"), React.createElement("span", {
    className: "tag"
  }, cityMatches, " city options")), React.createElement("h3", null, stream.title), React.createElement("p", null, stream.summary))), React.createElement("div", {
    className: "tags"
  }, stream.tags.map(tag => React.createElement("span", {
    className: "tag",
    key: tag
  }, tag))), React.createElement("div", {
    className: "breakdown-bars"
  }, parts.slice(0, 4).map((part, index) => React.createElement("span", {
    key: part.label
  }, React.createElement("b", {
    style: {
      width: `${part.score / part.max * 100}%`,
      background: ["#60a5fa", "#34d399", "#f59e0b", "#c084fc"][index]
    }
  }))))), React.createElement("div", {
    className: "score-pill"
  }, React.createElement("strong", null, stream.score, "%"), React.createElement("span", null, stream.score > 78 ? "Strong Match" : "Good Match")), React.createElement("span", {
    className: "chev"
  }, React.createElement(Icon, {
    name: "chevron-right"
  })));
}
function CollegeCard({
  college
}) {
  return React.createElement("article", {
    className: "college-card"
  }, React.createElement("div", null, React.createElement("h3", null, college.name), React.createElement("div", {
    className: "college-meta"
  }, React.createElement("span", null, college.area), React.createElement("span", null, college.type), React.createElement("span", null, college.level), React.createElement("span", null, college.boards.join(", "))), React.createElement("p", {
    style: {
      color: "var(--muted)",
      lineHeight: 1.55,
      margin: "10px 0 0"
    }
  }, college.highlight), React.createElement("div", {
    className: "tags"
  }, college.streams.map(stream => React.createElement("span", {
    className: "tag",
    key: stream
  }, streamById(stream).name)), college.verified && React.createElement("span", {
    className: "tag"
  }, "Verified source"))), React.createElement("div", {
    className: "college-fee"
  }, college.match || 80, "% match", React.createElement("span", null, college.fee)));
}
function StreamDetail({
  profile,
  stream,
  score,
  navigate
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const parts = scoreBreakdown(stream.id, profile);
  const colleges = collegesForProfile(profile, stream.id);
  const ask = () => {
    const q = question.trim().toLowerCase();
    if (!q) return;
    if (q.includes("subject")) {
      setAnswer(`${stream.name} usually focuses on ${stream.subjects.join(", ")}. For ${formatCityName(profile.city)}, verify exact combinations on the institution admission page before paying fees.`);
    } else if (q.includes("exam")) {
      setAnswer(`Key exams to watch: ${stream.exams.join(", ")}. The exact exam depends on state, board and whether you choose intermediate, PU, HSE or diploma.`);
    } else if (q.includes("college")) {
      setAnswer(`For your city, start with ${colleges.slice(0, 3).map(college => college.name).join(", ")}. Compare commute, fees, affiliation, stream availability and counselling support.`);
    } else {
      setAnswer(`${stream.title} fits when your interests and strengths align with ${stream.tags.join(", ")}. Your current score is ${score}%, so it is worth exploring seriously.`);
    }
  };
  return React.createElement("div", {
    className: "detail-shell reveal"
  }, React.createElement("section", {
    className: "detail-card"
  }, React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate("results")
  }, React.createElement(Icon, {
    name: "arrow-left"
  }), " Back to results"), React.createElement("div", {
    className: "detail-hero"
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: stream.color
    }
  }, React.createElement(Icon, {
    name: stream.icon
  }), " Stream detail"), React.createElement("h1", null, stream.title), React.createElement("p", null, stream.summary)), React.createElement("div", {
    className: "score-pill"
  }, React.createElement("strong", null, score, "%"), React.createElement("span", null, score > 78 ? "Strong Match" : "Good Match"))), React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", null, "Score breakdown")), React.createElement("div", {
    className: "score-table"
  }, parts.map(part => React.createElement("div", {
    className: "score-row",
    key: part.label
  }, React.createElement("strong", null, part.label), React.createElement("span", {
    className: "score-track"
  }, React.createElement("div", {
    style: {
      width: `${part.score / part.max * 100}%`
    }
  })), React.createElement("span", null, part.score, "/", part.max)))), React.createElement("div", {
    className: "detail-grid"
  }, React.createElement(InfoBlock, {
    title: "Why this fits you",
    items: [`${stream.name} connects with your selected goals and interests.`, `${formatCityName(profile.city)} has ${colleges.length} matching institution options in this build.`, `Your learning style is ${profile.learningStyle}, which is factored into the score.`]
  }), React.createElement(InfoBlock, {
    title: "Core subjects",
    items: stream.subjects
  }), React.createElement(InfoBlock, {
    title: "Career opportunities",
    items: stream.careers
  }), React.createElement(InfoBlock, {
    title: "Entrance exams",
    items: stream.exams
  }), React.createElement(InfoBlock, {
    title: "How to prepare",
    items: stream.prepare
  }), React.createElement(InfoBlock, {
    title: "Things to consider",
    items: [stream.consider, stream.typical]
  })), React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", null, "Ask about ", stream.name)), React.createElement("div", {
    className: "chatbot-box"
  }, React.createElement("div", {
    className: "chatbot-head"
  }, React.createElement("span", {
    className: "chatbot-avatar"
  }, React.createElement(Icon, {
    name: "bot"
  })), React.createElement("div", null, React.createElement("strong", null, "CareerOS Stream Assistant"), React.createElement("span", null, "Answers use your selected city, score and stream data."))), React.createElement("div", {
    className: "chat-messages"
  }, React.createElement("div", {
    className: "chat-message bot"
  }, React.createElement("span", null, "Ask me about subjects, exams, colleges, preparation, difficulty or whether ", stream.name, " fits your profile.")), answer && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "chat-message user"
  }, React.createElement("span", null, question)), React.createElement("div", {
    className: "chat-message bot"
  }, React.createElement("span", null, answer)))), React.createElement("div", {
    className: "quick-prompts"
  }, ["What subjects will I study?", "What exams matter?", "Which colleges should I compare?", "Is this right for me?"].map(item => React.createElement("button", {
    key: item,
    onClick: () => setQuestion(item)
  }, item))), React.createElement("div", {
    className: "ask-input chatbot-input"
  }, React.createElement("input", {
    value: question,
    onChange: event => setQuestion(event.target.value),
    placeholder: `Ask a question about ${stream.name}...`
  }), React.createElement("button", {
    className: "btn btn-primary",
    onClick: ask
  }, "Ask")))), React.createElement("aside", {
    className: "side-stack"
  }, React.createElement("div", {
    className: "source-card"
  }, React.createElement("h3", null, formatCityName(profile.city), " matches"), React.createElement("div", {
    className: "college-grid"
  }, colleges.slice(0, 4).map(college => React.createElement(CollegeCard, {
    key: college.name,
    college: college
  }))))));
}
function InfoBlock({
  title,
  items
}) {
  return React.createElement("div", {
    className: "info-block"
  }, React.createElement("h3", null, title), React.createElement("ul", {
    className: "clean-list"
  }, items.map(item => React.createElement("li", {
    key: item
  }, item))));
}
function CollegesPage({
  profile,
  scores
}) {
  const topStreams = rankStreams(scores).slice(0, 3).map(stream => stream.id);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [stream, setStream] = useState("all");
  const [budget, setBudget] = useState(profile.budget || "any");
  const [rankMode, setRankMode] = useState("score");
  const [visibleCount, setVisibleCount] = useState(20);
  useEffect(() => {
    setVisibleCount(20);
  }, [query, city, stream, budget, rankMode]);
  const filtered = COLLEGES.map(college => ({
    ...college,
    match: collegeMatchScore(college, {
      ...profile,
      city,
      budget
    }, topStreams, stream === "all" ? null : stream, budget)
  })).filter(college => city === "all" || college.city === city).filter(college => stream === "all" || college.streams.includes(stream)).filter(college => budget === "any" || college.budget === budget || budget === "mid" && college.budget !== "high").filter(college => `${college.name} ${college.area} ${college.type} ${college.boards.join(" ")}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => {
    if (rankMode === "location") {
      return (a.city === profile.city ? -1 : 0) - (b.city === profile.city ? -1 : 0) || b.match - a.match;
    }
    if (rankMode === "budget") {
      return getCollegeBudgetScore(b, budget) - getCollegeBudgetScore(a, budget) || b.match - a.match;
    }
    if (rankMode === "verified") {
      return Number(b.verified) - Number(a.verified) || b.match - a.match;
    }
    if (rankMode === "name") {
      return a.name.localeCompare(b.name);
    }
    return b.match - a.match;
  });
  const visibleColleges = filtered.slice(0, visibleCount);
  return React.createElement("div", {
    className: "reveal"
  }, React.createElement("div", {
    className: "recommend-card"
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--blue)"
    }
  }, React.createElement(Icon, {
    name: "school"
  }), " College finder"), React.createElement("h1", null, "Find your college"), React.createElement("p", null, "City-aware college allocation across junior college, PU, higher secondary and polytechnic routes.")), React.createElement("div", {
    className: "filters"
  }, React.createElement("input", {
    className: "searchbox",
    value: query,
    onChange: event => setQuery(event.target.value),
    placeholder: "Search colleges..."
  }), React.createElement("select", {
    className: "selectbox",
    value: city,
    onChange: event => setCity(event.target.value)
  }, React.createElement("option", {
    value: "all"
  }, "All cities"), CITIES.map(item => React.createElement("option", {
    key: item.id,
    value: item.id
  }, item.name))), React.createElement("select", {
    className: "selectbox",
    value: stream,
    onChange: event => setStream(event.target.value)
  }, React.createElement("option", {
    value: "all"
  }, "All streams"), Object.values(STREAMS).map(item => React.createElement("option", {
    key: item.id,
    value: item.id
  }, item.name))), React.createElement("select", {
    className: "selectbox",
    value: budget,
    onChange: event => setBudget(event.target.value)
  }, React.createElement("option", {
    value: "any"
  }, "Any budget"), BUDGETS.filter(item => item.id !== "any").map(item => React.createElement("option", {
    key: item.id,
    value: item.id
  }, item.label))), React.createElement("select", {
    className: "selectbox",
    value: rankMode,
    onChange: event => setRankMode(event.target.value)
  }, React.createElement("option", {
    value: "score"
  }, "Best match"), React.createElement("option", {
    value: "location"
  }, "Nearest first"), React.createElement("option", {
    value: "budget"
  }, "Budget fit"), React.createElement("option", {
    value: "verified"
  }, "Verified first"), React.createElement("option", {
    value: "name"
  }, "A-Z"))), React.createElement("div", {
    className: "result-count"
  }, "Showing ", React.createElement("strong", null, visibleColleges.length), " of ", React.createElement("strong", null, filtered.length), " recommendations. Default view opens with 20 colleges so students can compare properly before filtering."), React.createElement("div", {
    className: "college-grid"
  }, visibleColleges.map(college => React.createElement(CollegeCard, {
    key: `${college.city}-${college.name}`,
    college: college
  })), !filtered.length && React.createElement("div", {
    className: "empty-state"
  }, "No matching colleges yet. Change city, stream or budget filters.")), visibleCount < filtered.length && React.createElement("div", {
    className: "load-more-row"
  }, React.createElement("button", {
    className: "btn btn-dark",
    onClick: () => setVisibleCount(count => count + 20)
  }, "Show 20 more ", React.createElement(Icon, {
    name: "arrow-down"
  }))));
}
function CoursesPage({
  openStream
}) {
  return React.createElement("div", {
    className: "reveal"
  }, React.createElement("div", {
    className: "recommend-card"
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--blue)"
    }
  }, React.createElement(Icon, {
    name: "book-open"
  }), " Course explorer"), React.createElement("h1", null, "Explore academic streams"), React.createElement("p", null, "Browse the major after-10th families used by the recommendation engine.")), React.createElement("div", {
    className: "course-grid",
    style: {
      marginTop: 18
    }
  }, Object.values(STREAMS).map(stream => React.createElement("button", {
    className: "course-card",
    key: stream.id,
    onClick: () => openStream(stream.id)
  }, React.createElement("span", {
    className: "stream-icon",
    style: {
      background: stream.tint,
      color: stream.color
    }
  }, React.createElement(Icon, {
    name: stream.icon
  })), React.createElement("h3", null, stream.name), React.createElement("p", null, stream.summary), React.createElement("div", {
    className: "tags"
  }, stream.tags.map(tag => React.createElement("span", {
    className: "tag",
    key: tag
  }, tag)))))));
}
function PsychometricPage({
  profile
}) {
  const traits = [{
    label: "Analytical clarity",
    value: profile.academics?.math || 7
  }, {
    label: "Scientific curiosity",
    value: profile.academics?.science || 7
  }, {
    label: "Communication confidence",
    value: profile.academics?.english || 7
  }, {
    label: "Social reasoning",
    value: profile.academics?.social || 7
  }];
  return React.createElement("div", {
    className: "reveal"
  }, React.createElement("div", {
    className: "recommend-card"
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--violet)"
    }
  }, React.createElement(Icon, {
    name: "brain"
  }), " Psychometric preview"), React.createElement("h1", null, "Scientific assessment layer"), React.createElement("p", null, "This page is ready for a full 80-question test. For now it uses the profile signals to preview your aptitude pattern.")), React.createElement("div", {
    className: "mini-stat-grid",
    style: {
      marginTop: 18
    }
  }, traits.map(trait => React.createElement("div", {
    className: "mini-stat",
    key: trait.label
  }, React.createElement("strong", null, trait.value, "/10"), React.createElement("span", null, trait.label)))));
}
function CounsellorsPage({
  profile
}) {
  const categories = [{
    title: "Stream Selection Expert",
    desc: `Best for comparing ${formatCityName(profile.city)} junior colleges and class 11 streams.`,
    icon: "compass"
  }, {
    title: "Science Entrance Mentor",
    desc: "For JEE, NEET, EAPCET, KCET, CET or similar entrance planning.",
    icon: "atom"
  }, {
    title: "Commerce and Law Mentor",
    desc: "For CA, CMA, CLAT, IPMAT, CUET, business and policy routes.",
    icon: "scale"
  }];
  return React.createElement("div", {
    className: "reveal"
  }, React.createElement("div", {
    className: "recommend-card"
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--blue)"
    }
  }, React.createElement(Icon, {
    name: "phone"
  }), " Counsellors"), React.createElement("h1", null, "Need help deciding?"), React.createElement("p", null, "Browse the kind of expert you should speak to before locking a stream or college.")), React.createElement("div", {
    className: "counsellor-grid",
    style: {
      marginTop: 18
    }
  }, categories.map(item => React.createElement("div", {
    className: "counsellor-card",
    key: item.title
  }, React.createElement("span", {
    className: "stream-icon",
    style: {
      background: "#eef4ff",
      color: "var(--blue)"
    }
  }, React.createElement(Icon, {
    name: item.icon
  })), React.createElement("h3", null, item.title), React.createElement("p", null, item.desc), React.createElement("button", {
    className: "btn btn-primary",
    style: {
      marginTop: 16
    }
  }, "Browse Counsellors ", React.createElement(Icon, {
    name: "arrow-right"
  }))))));
}
function CareerPathsPage() {
  const paths = [{
    title: "MPC to AI Engineer",
    desc: "MPC -> JEE/EAPCET/KCET -> CSE/AI -> internships -> product or research roles.",
    icon: "cpu"
  }, {
    title: "BiPC to Doctor or Allied Health",
    desc: "BiPC -> NEET or paramedical -> clinical training -> hospital or lab career.",
    icon: "heart-pulse"
  }, {
    title: "Commerce to CA or Founder",
    desc: "MEC/CEC -> CA/CMA/IPMAT -> internships -> finance, business or startup route.",
    icon: "briefcase"
  }, {
    title: "Polytechnic to B.Tech Lateral",
    desc: "Diploma -> branch skills -> lateral B.Tech or junior engineer employment.",
    icon: "cog"
  }, {
    title: "Humanities to Law and Policy",
    desc: "HEC/Arts -> CLAT/CUET -> law, policy, psychology, design or civil services.",
    icon: "landmark"
  }, {
    title: "Vocational to Skilled Employment",
    desc: "MLT, pharma, retail, tourism or technical training -> certification -> first job.",
    icon: "microscope"
  }];
  return React.createElement("div", {
    className: "reveal"
  }, React.createElement("div", {
    className: "recommend-card"
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--blue)"
    }
  }, React.createElement(Icon, {
    name: "briefcase"
  }), " Career paths"), React.createElement("h1", null, "Career paths after 10th"), React.createElement("p", null, "See the route from class 10 decision to the first serious career outcome.")), React.createElement("div", {
    className: "path-grid",
    style: {
      marginTop: 18
    }
  }, paths.map(path => React.createElement("div", {
    className: "path-card",
    key: path.title
  }, React.createElement("span", {
    className: "stream-icon",
    style: {
      background: "#eef4ff",
      color: "var(--blue)"
    }
  }, React.createElement(Icon, {
    name: path.icon
  })), React.createElement("h3", null, path.title), React.createElement("p", null, path.desc)))));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));