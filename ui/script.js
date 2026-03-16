/* ════════════════════════════════════════════
   MENU TOGGLE
════════════════════════════════════════════ */
const toggle = document.getElementById("menuToggle");
const nav    = document.getElementById("navLinks");

toggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});


/* ════════════════════════════════════════════
   INDIA STATES & CITIES DATA
════════════════════════════════════════════ */
const statesCities = {
  "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Tirupati","Kakinada","Rajahmundry","Kadapa","Anantapur","Vizianagaram","Eluru","Ongole","Nandyal","Machilipatnam","Adoni","Tenali","Proddatur","Chittoor","Hindupur","Bhimavaram","Madanapalle","Guntakal","Dharmavaram","Gudivada","Narasaraopet","Tadipatri","Tadepalligudem","Chilakaluripet","Kavali"],
  "Arunachal Pradesh": ["Itanagar","Naharlagun","Pasighat","Tawang","Ziro","Bomdila","Tezu","Along","Changlang","Khonsa","Roing","Seppa","Daporijo","Yingkiong","Namsai"],
  "Assam": ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon","Dhubri","Diphu","Goalpara","Karimganj","Sivasagar","Lakhimpur","Barpeta","Golaghat","Morigaon","Hailakandi","Nalbari","Baksa","Kamrup","Darrang","Sonitpur","Kokrajhar","Haflong"],
  "Bihar": ["Patna","Gaya","Bhagalpur","Muzaffarpur","Darbhanga","Arrah","Begusarai","Katihar","Munger","Purnia","Hajipur","Bihar Sharif","Bettiah","Sasaram","Samastipur","Sitamarhi","Motihari","Jehanabad","Nawada","Siwan","Chhapra","Aurangabad","Kishanganj","Jamui","Lakhisarai","Supaul","Madhepura","Madhubani","Saharsa","Sheohar"],
  "Chhattisgarh": ["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur","Raigarh","Ambikapur","Dhamtari","Chirmiri","Bhatapara","Mahasamund","Kanker","Janjgir","Tilda","Dongargarh","Kawardha","Kondagaon","Naila Janjgir"],
  "Goa": ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Sanquelim","Cuncolim","Quepem","Valpoi","Pernem","Sanguem","Canacona"],
  "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh","Gandhinagar","Anand","Mehsana","Nadiad","Morbi","Surendranagar","Gandhidham","Bharuch","Navsari","Valsad","Porbandar","Godhra","Dahod","Patan","Botad","Amreli","Veraval","Palanpur","Himatnagar","Gondal","Dwarka","Kutch","Limdi","Jetpur","Wankaner","Sidhpur","Visnagar","Unjha","Deesa","Modasa","Kadi","Kalol","Ankleshwar"],
  "Haryana": ["Faridabad","Gurgaon","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat","Panchkula","Bhiwani","Sirsa","Bahadurgarh","Jind","Thanesar","Kaithal","Rewari","Palwal","Narnaul","Fatehabad","Jhajjar","Mahendragarh","Nuh","Charkhi Dadri","Hansi","Mewat"],
  "Himachal Pradesh": ["Shimla","Manali","Dharamshala","Solan","Mandi","Bilaspur","Hamirpur","Una","Nahan","Palampur","Kullu","Chamba","Kangra","Sundarnagar","Baddi","Nalagarh","Parwanoo","Rampur","Sirmaur","Rohru","Theog","Kasauli","Dalhousie","Keylong"],
  "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh","Giridih","Ramgarh","Medininagar","Phusro","Chirkunda","Chaibasa","Dumka","Godda","Gumla","Koderma","Lohardaga","Pakur","Sahibganj","Simdega","Khunti","Latehar","Chatra","Garwah","Palamu","West Singhbhum"],
  "Karnataka": ["Bangalore","Mysore","Hubli","Mangalore","Belgaum","Davangere","Bellary","Gulbarga","Bijapur","Shimoga","Tumkur","Raichur","Bidar","Hospet","Gadag","Udupi","Robertson Pet","Bhadravati","Hassan","Chitradurga","Kolar","Mandya","Chikkamagaluru","Bagalkot","Vijayapura","Yadgir","Dharwad","Sirsi","Madikeri","Ramanagara","Chikkaballapur","Chamarajanagar"],
  "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Palakkad","Alappuzha","Kannur","Kottayam","Malappuram","Kasaragod","Pathanamthitta","Idukki","Wayanad","Ernakulam","Thalassery","Ponnani","Vatakara","Kayamkulam","Irinjalakuda","Chalakudy","Tirur","Manjeri","Kanhangad","Attingal","Neyyattinkara","Nedumangad","Perinthalmanna","Ottapalam","Shoranur"],
  "Madhya Pradesh": ["Bhopal","Indore","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa","Murwara","Singrauli","Burhanpur","Khandwa","Bhind","Chhindwara","Guna","Shivpuri","Vidisha","Chhatarpur","Damoh","Mandsaur","Khargone","Neemuch","Pithampur","Hoshangabad","Itarsi","Sehore","Betul","Seoni","Datia","Nagda","Shahdol","Anuppur","Umaria","Dindori","Mandla","Balaghat","Katni"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Amravati","Kolhapur","Nanded","Sangli","Malegaon","Jalgaon","Akola","Latur","Dhule","Ahmednagar","Chandrapur","Parbhani","Ichalkaranji","Jalna","Ambarnath","Bhiwandi","Shirdi","Yavatmal","Nandurbar","Hingoli","Washim","Osmanabad","Beed","Ratnagiri","Sindhudurg","Thane","Raigad","Satara","Karad","Baramati","Pandharpur","Miraj","Barshi","Wai","Wardha","Gondia","Bhandara","Gadchiroli","Buldhana","Akot"],
  "Manipur": ["Imphal","Thoubal","Bishnupur","Churachandpur","Ukhrul","Senapati","Tamenglong","Chandel","Jiribam","Kakching","Kangpokpi","Noney","Pherzawl","Tengnoupal"],
  "Meghalaya": ["Shillong","Tura","Nongpoh","Jowai","Baghmara","Williamnagar","Resubelpara","Nongstoin","Mairang","Cherrapunji","Mawlai","Laban"],
  "Mizoram": ["Aizawl","Lunglei","Saiha","Champhai","Kolasib","Serchhip","Mamit","Lawngtlai","Hnahthial","Khawzawl","Saitual"],
  "Nagaland": ["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto","Phek","Kiphire","Longleng","Mon","Peren"],
  "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Bhadrak","Baripada","Jeypore","Angul","Bargarh","Dhenkanal","Jharsuguda","Kendujhar","Koraput","Rayagada","Sundargarh","Kendrapara","Jagatsinghpur","Jajpur","Nayagarh","Gajapati","Ganjam","Kalahandi","Kandhamal","Khordha","Malkangiri","Nabarangpur","Nuapada","Bolangir","Sonepur","Boudh","Deogarh","Mayurbhanj"],
  "Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Hoshiarpur","Batala","Pathankot","Moga","Abohar","Malerkotla","Khanna","Phagwara","Muktsar","Barnala","Rajpura","Firozpur","Kapurthala","Sangrur","Fazilka","Gurdaspur","Rupnagar","Mohali","Fatehgarh Sahib","Nawanshahr","Mansa","Tarn Taran","Faridkot"],
  "Rajasthan": ["Jaipur","Jodhpur","Kota","Bikaner","Ajmer","Udaipur","Bhilwara","Alwar","Sikar","Sri Ganganagar","Bharatpur","Pali","Barmer","Tonk","Kishangarh","Beawar","Jhunjhunu","Hanumangarh","Gangapur City","Sawai Madhopur","Churu","Nagaur","Baran","Bundi","Dhaulpur","Dausa","Rajsamand","Jaisalmer","Banswara","Dungarpur","Sirohi","Pratapgarh","Karauli","Jhalawar","Chittorgarh","Jalore","Jalor"],
  "Sikkim": ["Gangtok","Namchi","Gyalshing","Mangan","Rangpo","Singtam","Jorethang","Nayabazar","Ravangla","Yuksom"],
  "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Tiruppur","Vellore","Erode","Thoothukudi","Dindigul","Thanjavur","Ranipet","Sivakasi","Karur","Udhagamandalam","Hosur","Nagercoil","Kanchipuram","Kumarapalayam","Karaikkudi","Neyveli","Cuddalore","Kumbakonam","Tiruvannamalai","Pollachi","Rajapalayam","Gudiyatham","Pudukkottai","Vaniyambadi","Ambur","Nagapattinam","Villupuram","Namakkal","Virudhunagar","Krishnagiri","Dharmapuri","Perambalur","Ariyalur","Tiruvarur","Ramanathapuram","Sivaganga","Theni"],
  "Telangana": ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Ramagundam","Mahbubnagar","Nalgonda","Adilabad","Suryapet","Miryalaguda","Siddipet","Mancherial","Jagtial","Kothagudem","Bhongir","Wanaparthy","Kamareddy","Nirmal","Sangareddy","Medak","Vikarabad","Narayanpet","Nagarkurnool","Bhadradri","Mulugu","Jayashankar","Yadadri","Medchal","Rangareddy","Hyderabad Rural"],
  "Tripura": ["Agartala","Dharmanagar","Udaipur","Kailasahar","Belonia","Ambassa","Bishalgarh","Melaghar","Sonamura","Khowai","Sabroom","Santirbazar","Amarpur"],
  "Uttar Pradesh": ["Lucknow","Kanpur","Agra","Varanasi","Meerut","Allahabad","Ghaziabad","Noida","Bareilly","Aligarh","Moradabad","Saharanpur","Gorakhpur","Firozabad","Jhansi","Muzaffarnagar","Mathura","Rampur","Shahjahanpur","Mau","Farrukhabad","Hapur","Etawah","Mirzapur","Bulandshahr","Sambhal","Amroha","Hardoi","Fatehpur","Raebareli","Orai","Sitapur","Bahraich","Modinagar","Unnao","Jaunpur","Lakhimpur","Hathras","Banda","Pilibhit","Barabanki","Khurja","Ghazipur","Etah","Deoria","Gopalganj","Sultanpur","Faizabad","Bijnor","Budaun","Mainpuri","Azamgarh","Ballia","Basti","Chandauli"],
  "Uttarakhand": ["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Kotdwar","Pithoragarh","Ramnagar","Mussoorie","Srinagar","Pauri","Tehri","Uttarkashi","Chamoli","Bageshwar","Almora","Nainital","Champawat","Vikasnagar","Jaspur","Khatima","Sitarganj","Bazpur","Kichha","Gadarpur"],
  "West Bengal": ["Kolkata","Asansol","Siliguri","Durgapur","Howrah","Bardhaman","Malda","Baharampur","Habra","Kharagpur","Shantipur","Dankuni","Dhulian","Ranaghat","Haldia","Raiganj","Krishnanagar","Nabadwip","Medinipur","Jalpaiguri","Balurghat","Basirhat","Bankura","Chakdaha","Darjeeling","Alipurduar","Cooch Behar","Purulia","Murshidabad","Birbhum","North 24 Parganas","South 24 Parganas","Hooghly","Nadia"],
  "Delhi": ["New Delhi","Dwarka","Rohini","Janakpuri","Laxmi Nagar","Saket","Pitampura","Shahdara","Narela","Mehrauli","Karol Bagh","Connaught Place","Preet Vihar","Mayur Vihar","Vasant Kunj","Greater Kailash","Malviya Nagar","Hauz Khas","Rajouri Garden","Punjabi Bagh","Vikaspuri","Uttam Nagar","Paschim Vihar","Shalimar Bagh","Wazirpur","Burari","Mustafabad","Seemapuri","Kondli","Sangam Vihar"],
  "Jammu & Kashmir": ["Srinagar","Jammu","Anantnag","Sopore","Baramulla","Kathua","Udhampur","Punch","Rajouri","Kupwara","Kulgam","Shopian","Ganderbal","Bandipore","Budgam","Reasi","Ramban","Kishtwar","Doda","Samba"],
  "Ladakh": ["Leh","Kargil","Diskit","Khalsi","Nubra","Zanskar","Nyoma"],
  "Chandigarh": ["Chandigarh","Manimajra","Burail","Khuda Lahora","Attawa","Mauli Jagran"],
  "Puducherry": ["Puducherry","Karaikal","Mahe","Yanam","Ozhukarai","Villianur","Ariyankuppam","Nettapakkam"],
  "Andaman & Nicobar": ["Port Blair","Diglipur","Mayabunder","Rangat","Wandoor","Hut Bay","Car Nicobar","Campbell Bay"],
  "Dadra & Nagar Haveli": ["Silvassa","Amli","Khanvel","Naroli","Sayli","Masat","Rakholi"],
  "Daman & Diu": ["Daman","Diu","Moti Daman","Nani Daman","Kadaiya","Varkund"],
  "Lakshadweep": ["Kavaratti","Agatti","Minicoy","Amini","Andrott","Kalpeni","Kiltan","Chetlat","Bitra"]
};

const allStates = Object.keys(statesCities).sort();


/* ════════════════════════════════════════════
   PRODUCT TYPES PER SUBJECT
════════════════════════════════════════════ */
const subjectProducts = {
  "Stone Division": [
    "Zx 1600 (New)","Monolith (New)","Omega 6x (New)","J-600 Bridge Cutter (New)",
    "Thin Multiwire (New)","VersaWire Machine","Multicutters",
    "Line Polishing Machines","Bridge Cutters","Wiresaw","Resin Line","AVBC"
  ],
  "Crane Division": [
    "Eot Cranes","Gantry / Goliath Cranes","Semi Gantry Crane",
    "Wall Mounted","Jib Crane","Light Crane & Crane Kits"
  ],
  "Sheet Metal Division": [
    "Laser Cutting","Laser Welding","Laser Cleaning",
    "Laser Marking","Laser Combo","Tube Laser Cutting"
  ],
  "Industrial Equipment Infrastructure": [
    "Fabrication","Machining","Erection","Civil"
  ]
};


/* ════════════════════════════════════════════
   AUTOCOMPLETE HELPER
════════════════════════════════════════════ */
function makeAutocomplete(inputId, listId, getOptions, onPick) {
  const inp  = document.getElementById(inputId);
  const list = document.getElementById(listId);
  let idx = -1;

  function render(items) {
    list.innerHTML = '';
    idx = -1;
    if (!items.length) { list.classList.remove('open'); return; }
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.addEventListener('mousedown', e => {
        e.preventDefault();
        inp.value = item;
        list.classList.remove('open');
        onPick && onPick(item);
      });
      list.appendChild(li);
    });
    list.classList.add('open');
  }

  function filter() {
    const v   = inp.value.trim().toLowerCase();
    const all = getOptions();
    render(v ? all.filter(s => s.toLowerCase().includes(v)) : all.slice(0, 12));
  }

  inp.addEventListener('input',  filter);
  inp.addEventListener('focus',  filter);

  inp.addEventListener('keydown', e => {
    const lis = list.querySelectorAll('li');
    if (!lis.length) return;
    if      (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(idx + 1, lis.length - 1); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); idx = Math.max(idx - 1, 0); }
    else if (e.key === 'Enter')     { e.preventDefault(); if (idx >= 0) lis[idx].dispatchEvent(new Event('mousedown')); }
    else if (e.key === 'Escape')    { list.classList.remove('open'); }
    lis.forEach((li, i) => li.classList.toggle('active', i === idx));
    if (idx >= 0) lis[idx].scrollIntoView({ block: 'nearest' });
  });

  document.addEventListener('click', e => {
    if (!inp.contains(e.target) && !list.contains(e.target))
      list.classList.remove('open');
  });
}

/* ── STATE autocomplete ── */
makeAutocomplete(
  'state', 'stateList',
  () => allStates,
  () => {
    document.getElementById('city').value = '';
    document.getElementById('cityList').classList.remove('open');
  }
);

/* ── CITY autocomplete (free-text also allowed) ── */
makeAutocomplete(
  'city', 'cityList',
  () => {
    const s = document.getElementById('state').value.trim();
    return statesCities[s] || [];
  }
);


/* ════════════════════════════════════════════
   URL PARAM: pre-select category from ?category=
════════════════════════════════════════════ */
(function initCategoryParam() {
  const params    = new URLSearchParams(window.location.search);
  const catParam  = (params.get('category') || '').toLowerCase();
  const catSelect = document.getElementById('category');
  catSelect.value = catParam === 'service' ? 'Service' : 'Purchase';
})();


/* ════════════════════════════════════════════
   SUBJECT → PRODUCT TYPE
════════════════════════════════════════════ */
document.getElementById('subject').addEventListener('change', function () {
  const row      = document.getElementById('productTypeRow');
  const sel      = document.getElementById('productType');
  const products = subjectProducts[this.value];

  if (products) {
    sel.innerHTML = '<option value="">Product Type</option>';
    products.forEach(p => {
      const o = document.createElement('option');
      o.value = o.textContent = p;
      sel.appendChild(o);
    });
    row.style.display = 'flex';
  } else {
    row.style.display = 'none';
    sel.innerHTML = '<option value="">Product Type</option>';
    clearState('productType');
  }
  validateField('subject');
  checkFormValidity();
});

document.getElementById('productType').addEventListener('change', function () {
  validateField('productType');
  checkFormValidity();
});


/* ════════════════════════════════════════════
   VALIDATION HELPERS
════════════════════════════════════════════ */
const nameRegex   = /^[A-Za-z\s]+$/;
const emailRegex  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const numberRegex = /^[0-9]{10}$/;

function setError(fieldId, msg) {
  const wrap = document.getElementById('wrap-' + fieldId);
  const err  = document.getElementById('err-' + fieldId);
  if (wrap) { wrap.classList.add('error'); wrap.classList.remove('valid'); }
  if (err)  { err.textContent = msg; err.classList.add('show'); }
}

function setValid(fieldId) {
  const wrap = document.getElementById('wrap-' + fieldId);
  const err  = document.getElementById('err-' + fieldId);
  if (wrap) { wrap.classList.remove('error'); wrap.classList.add('valid'); }
  if (err)  { err.textContent = ''; err.classList.remove('show'); }
}

function clearState(fieldId) {
  const wrap = document.getElementById('wrap-' + fieldId);
  const err  = document.getElementById('err-' + fieldId);
  if (wrap) { wrap.classList.remove('error', 'valid'); }
  if (err)  { err.textContent = ''; err.classList.remove('show'); }
}

function validateField(fieldId) {
  const el  = document.getElementById(fieldId);
  const val = el ? el.value.trim() : '';

  switch (fieldId) {
    case 'firstName':
      if (!val)                 { setError(fieldId, 'First name is required'); return false; }
      if (!nameRegex.test(val)) { setError(fieldId, 'Only letters allowed');   return false; }
      setValid(fieldId); return true;

    case 'lastName':
      if (!val)                 { setError(fieldId, 'Last name is required'); return false; }
      if (!nameRegex.test(val)) { setError(fieldId, 'Only letters allowed');  return false; }
      setValid(fieldId); return true;

    case 'email':
      if (!val)                  { setError(fieldId, 'Email is required');           return false; }
      if (!emailRegex.test(val)) { setError(fieldId, 'Enter a valid email address'); return false; }
      setValid(fieldId); return true;

    case 'mobile':
      if (!val)                   { setError(fieldId, 'Mobile number is required'); return false; }
      if (!numberRegex.test(val)) { setError(fieldId, 'Enter exactly 10 digits');   return false; }
      setValid(fieldId); return true;

    case 'state':
      if (!val) { setError(fieldId, 'State is required'); return false; }
      setValid(fieldId); return true;

    case 'city':
      if (!val)                 { setError(fieldId, 'City is required');   return false; }
      if (!nameRegex.test(val)) { setError(fieldId, 'Only letters allowed'); return false; }
      setValid(fieldId); return true;

    case 'category':
      if (!val) { setError(fieldId, 'Please select a category'); return false; }
      setValid(fieldId); return true;

    case 'subject':
      if (!val) { setError(fieldId, 'Please select a subject'); return false; }
      setValid(fieldId); return true;

    case 'productType': {
      const subj = document.getElementById('subject').value;
      if (subjectProducts[subj] && !val) { setError(fieldId, 'Please select a product type'); return false; }
      if (val) setValid(fieldId);
      return true;
    }

    case 'description':
      if (!val) { setError(fieldId, 'Description is required'); return false; }
      setValid(fieldId); return true;

    default: return true;
  }
}

function checkFormValidity() {
  const btn  = document.getElementById('submitBtn');
  const msg  = document.getElementById('formErrorMsg');
  const subj = document.getElementById('subject').value;
  const fields = ['firstName','lastName','email','mobile','state','city','category','subject','description'];
  if (subjectProducts[subj]) fields.push('productType');

  const allOk = fields.every(id => {
    const el  = document.getElementById(id);
    const val = el ? el.value.trim() : '';
    if (!val) return false;
    if (['firstName','lastName','city'].includes(id)) return nameRegex.test(val);
    if (id === 'email')  return emailRegex.test(val);
    if (id === 'mobile') return numberRegex.test(val);
    return true;
  });

  btn.disabled = !allOk;
  if (allOk) msg.classList.remove('show');
}

/* ── Live validation ── */
['firstName','lastName','email','mobile','state','city','category','subject','description'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('blur',   () => { validateField(id); checkFormValidity(); });
  el.addEventListener('input',  () => {
    if (document.getElementById('wrap-' + id)?.classList.contains('error')) validateField(id);
    checkFormValidity();
  });
  el.addEventListener('change', () => { validateField(id); checkFormValidity(); });
});


/* ════════════════════════════════════════════
   BACKEND API URL
   Change this if backend runs on a different port
════════════════════════════════════════════ */
const API_URL = 'http://localhost:8000/api/enquiry';


/* ════════════════════════════════════════════
   STEP UI HELPERS
════════════════════════════════════════════ */

/*
  Steps shown to user (maps to backend steps):
  0 — SF Auth
  1 — Contact lookup
  2 — Insert Account        (new contacts only)
  3 — Insert Contact        (new contacts only)
  4 — Insert Lead           (new contacts only)
  5 — MC Auth
  6 — MC Journey Event
*/
const STEP_LABELS = [
  'Connecting to Salesforce',           // 0
  'Checking existing contact',          // 1
  'Creating account record',            // 2
  'Creating contact record',            // 3
  'Creating lead or case record',               // 4
  'Connecting to Marketing Cloud',      // 5
  'Sending to Marketing Cloud'          // 6
];

/* Map backend step names → index in STEP_LABELS */
const STEP_NAME_MAP = {
  'SF Auth'          : 0,
  'Contact Lookup'   : 1,
  'Insert Account'   : 2,
  'Insert Contact'   : 3,
  'Insert Lead'      : 4,
  'MC Auth'          : 5,
  'MC Journey Event' : 6
};

function renderSteps(steps, activeIdx = -1, failIdx = -1) {
  const stepsBox = document.getElementById('submitSteps');

  /* Build a result map from backend step array if provided */
  const resultMap = {};
  if (steps && steps.length) {
    steps.forEach(s => {
      const idx = STEP_NAME_MAP[s.step];
      if (idx !== undefined) resultMap[idx] = s.status; // 'ok' | 'fail'
    });
  }

  stepsBox.innerHTML = STEP_LABELS.map((label, i) => {
    let cls  = 'step-item';
    let icon = '○';

    if (resultMap[i] === 'ok')   { cls += ' done';   icon = '✓'; }
    else if (resultMap[i] === 'fail' || i === failIdx) { cls += ' fail'; icon = '✕'; }
    else if (i === activeIdx)    { cls += ' active';  icon = '…'; }

    return `<div class="${cls}"><span class="step-icon">${icon}</span>${label}</div>`;
  }).join('');
}

function showStatus(state, text) {
  const box = document.getElementById('submitStatus');
  const msg = document.getElementById('submitStatusMsg');
  box.className     = 'submit-status ' + state;
  box.style.display = 'block';
  msg.textContent   = text;
}

function resetStatusUI() {
  const box = document.getElementById('submitStatus');
  box.style.display = 'none';
  box.className     = 'submit-status';
  document.getElementById('submitSteps').innerHTML = '';
  document.getElementById('submitStatusMsg').textContent = '';
}


/* ════════════════════════════════════════════
   FORM SUBMIT
════════════════════════════════════════════ */
const form = document.getElementById('enquiryForm');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  /* ── Client-side validation ── */
  const subj   = document.getElementById('subject').value;
  const fields = ['firstName','lastName','email','mobile','state','city','category','subject','description'];
  if (subjectProducts[subj]) fields.push('productType');

  let allValid = true;
  fields.forEach(id => { if (!validateField(id)) allValid = false; });

  const errMsg = document.getElementById('formErrorMsg');
  if (!allValid) {
    errMsg.classList.add('show');
    const firstErr = form.querySelector('.input-field.error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  errMsg.classList.remove('show');

  /* ── Collect payload ── */
  const payload = {
    firstName  : document.getElementById('firstName').value.trim(),
    lastName   : document.getElementById('lastName').value.trim(),
    email      : document.getElementById('email').value.trim(),
    mobile     : document.getElementById('mobile').value.trim(),
    state      : document.getElementById('state').value.trim(),
    city       : document.getElementById('city').value.trim(),
    category   : document.getElementById('category').value,
    subject    : document.getElementById('subject').value,
    productType: document.getElementById('productType')?.value || '',
    description: document.getElementById('description').value.trim()
  };

  const btn = document.getElementById('submitBtn');
  btn.disabled    = true;
  btn.textContent = 'Submitting…';

  resetStatusUI();
  renderSteps([], 0);
  showStatus('loading', 'Please wait while we process your enquiry…');

  /* ── Call Express backend ── */
  let result;
  try {
    const res = await fetch(API_URL, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(payload)
    });

    result = await res.json();

    /* Render step results returned from backend */
    renderSteps(result.steps || []);

    if (result.success) {
      /* ── Full success ── */
      showStatus('success', '✓ Enquiry submitted successfully! We will get back to you soon.');
      form.reset();
      document.getElementById('productTypeRow').style.display = 'none';
      ['firstName','lastName','email','mobile','state','city','category','subject','productType','description']
        .forEach(id => clearState(id));
      checkFormValidity();

    } else {
      /* ── Partial or full failure — show backend error message ── */
      const isPartial = result.sfSaved && !result.mcSent;
      showStatus(
        isPartial ? 'error' : 'error',
        result.error || 'Something went wrong. Please try again.'
      );
      btn.disabled    = false;
      btn.textContent = 'Submit Enquiry';
    }

  } catch (networkErr) {
    /* ── Network / server unreachable ── */
    renderSteps([]);
    showStatus('error',
      `Cannot reach the server. Please check your connection or try again later.\n(${networkErr.message})`
    );
    btn.disabled    = false;
    btn.textContent = 'Submit Enquiry';
  }
});


/* ════════════════════════════════════════════
   INPUT SANITISATION
════════════════════════════════════════════ */
document.querySelectorAll('#firstName,#lastName,#city')
  .forEach(field => {
    field.addEventListener('input', () => {
      field.value = field.value.replace(/[^A-Za-z\s]/g, '');
    });
  });

document.getElementById('mobile')
  .addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
  });

/* Disable submit on page load until all fields filled */
document.getElementById('submitBtn').disabled = true;