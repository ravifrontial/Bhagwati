/* ════════════════════════════════════════════
   MENU TOGGLE
════════════════════════════════════════════ */
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("active");
});

/* ════════════════════════════════════════════
   STATES & CITIES
════════════════════════════════════════════ */
const statesCities = {
  "Andhra Pradesh":["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Tirupati","Kakinada","Rajahmundry","Kadapa","Anantapur","Vizianagaram","Eluru","Ongole","Nandyal","Machilipatnam","Adoni","Tenali","Proddatur","Chittoor","Hindupur","Bhimavaram","Madanapalle","Guntakal","Dharmavaram","Gudivada","Narasaraopet","Tadipatri","Tadepalligudem","Chilakaluripet","Kavali"],
  "Arunachal Pradesh":["Itanagar","Naharlagun","Pasighat","Tawang","Ziro","Bomdila","Tezu","Along","Changlang","Khonsa","Roing","Seppa","Daporijo","Yingkiong","Namsai"],
  "Assam":["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon","Dhubri","Diphu","Goalpara","Karimganj","Sivasagar","Lakhimpur","Barpeta","Golaghat","Morigaon","Hailakandi","Nalbari","Baksa","Kamrup","Darrang","Sonitpur","Kokrajhar","Haflong"],
  "Bihar":["Patna","Gaya","Bhagalpur","Muzaffarpur","Darbhanga","Arrah","Begusarai","Katihar","Munger","Purnia","Hajipur","Bihar Sharif","Bettiah","Sasaram","Samastipur","Sitamarhi","Motihari","Jehanabad","Nawada","Siwan","Chhapra","Aurangabad","Kishanganj","Jamui","Lakhisarai","Supaul","Madhepura","Madhubani","Saharsa","Sheohar"],
  "Chhattisgarh":["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur","Raigarh","Ambikapur","Dhamtari","Chirmiri","Bhatapara","Mahasamund","Kanker","Janjgir","Tilda","Dongargarh","Kawardha","Kondagaon","Naila Janjgir"],
  "Goa":["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Sanquelim","Cuncolim","Quepem","Valpoi","Pernem","Sanguem","Canacona"],
  "Gujarat":["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh","Gandhinagar","Anand","Mehsana","Nadiad","Morbi","Surendranagar","Gandhidham","Bharuch","Navsari","Valsad","Porbandar","Godhra","Dahod","Patan","Botad","Amreli","Veraval","Palanpur","Himatnagar","Gondal","Dwarka","Kutch","Limdi","Jetpur","Wankaner","Sidhpur","Visnagar","Unjha","Deesa","Modasa","Kadi","Kalol","Ankleshwar"],
  "Haryana":["Faridabad","Gurgaon","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat","Panchkula","Bhiwani","Sirsa","Bahadurgarh","Jind","Thanesar","Kaithal","Rewari","Palwal","Narnaul","Fatehabad","Jhajjar","Mahendragarh","Nuh","Charkhi Dadri","Hansi","Mewat"],
  "Himachal Pradesh":["Shimla","Manali","Dharamshala","Solan","Mandi","Bilaspur","Hamirpur","Una","Nahan","Palampur","Kullu","Chamba","Kangra","Sundarnagar","Baddi","Nalagarh","Parwanoo","Rampur","Sirmaur","Rohru","Theog","Kasauli","Dalhousie","Keylong"],
  "Jharkhand":["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh","Giridih","Ramgarh","Medininagar","Phusro","Chirkunda","Chaibasa","Dumka","Godda","Gumla","Koderma","Lohardaga","Pakur","Sahibganj","Simdega","Khunti","Latehar","Chatra","Garwah","Palamu","West Singhbhum"],
  "Karnataka":["Bangalore","Mysore","Hubli","Mangalore","Belgaum","Davangere","Bellary","Gulbarga","Bijapur","Shimoga","Tumkur","Raichur","Bidar","Hospet","Gadag","Udupi","Robertson Pet","Bhadravati","Hassan","Chitradurga","Kolar","Mandya","Chikkamagaluru","Bagalkot","Vijayapura","Yadgir","Dharwad","Sirsi","Madikeri","Ramanagara","Chikkaballapur","Chamarajanagar"],
  "Kerala":["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Palakkad","Alappuzha","Kannur","Kottayam","Malappuram","Kasaragod","Pathanamthitta","Idukki","Wayanad","Ernakulam","Thalassery","Ponnani","Vatakara","Kayamkulam","Irinjalakuda","Chalakudy","Tirur","Manjeri","Kanhangad","Attingal","Neyyattinkara","Nedumangad","Perinthalmanna","Ottapalam","Shoranur"],
  "Madhya Pradesh":["Bhopal","Indore","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa","Murwara","Singrauli","Burhanpur","Khandwa","Bhind","Chhindwara","Guna","Shivpuri","Vidisha","Chhatarpur","Damoh","Mandsaur","Khargone","Neemuch","Pithampur","Hoshangabad","Itarsi","Sehore","Betul","Seoni","Datia","Nagda","Shahdol","Anuppur","Umaria","Dindori","Mandla","Balaghat","Katni"],
  "Maharashtra":["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Amravati","Kolhapur","Nanded","Sangli","Malegaon","Jalgaon","Akola","Latur","Dhule","Ahmednagar","Chandrapur","Parbhani","Ichalkaranji","Jalna","Ambarnath","Bhiwandi","Shirdi","Yavatmal","Nandurbar","Hingoli","Washim","Osmanabad","Beed","Ratnagiri","Sindhudurg","Thane","Raigad","Satara","Karad","Baramati","Pandharpur","Miraj","Barshi","Wai","Wardha","Gondia","Bhandara","Gadchiroli","Buldhana","Akot"],
  "Manipur":["Imphal","Thoubal","Bishnupur","Churachandpur","Ukhrul","Senapati","Tamenglong","Chandel","Jiribam","Kakching","Kangpokpi","Noney","Pherzawl","Tengnoupal"],
  "Meghalaya":["Shillong","Tura","Nongpoh","Jowai","Baghmara","Williamnagar","Resubelpara","Nongstoin","Mairang","Cherrapunji","Mawlai","Laban"],
  "Mizoram":["Aizawl","Lunglei","Saiha","Champhai","Kolasib","Serchhip","Mamit","Lawngtlai","Hnahthial","Khawzawl","Saitual"],
  "Nagaland":["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto","Phek","Kiphire","Longleng","Mon","Peren"],
  "Odisha":["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Bhadrak","Baripada","Jeypore","Angul","Bargarh","Dhenkanal","Jharsuguda","Kendujhar","Koraput","Rayagada","Sundargarh","Kendrapara","Jagatsinghpur","Jajpur","Nayagarh","Gajapati","Ganjam","Kalahandi","Kandhamal","Khordha","Malkangiri","Nabarangpur","Nuapada","Bolangir","Sonepur","Boudh","Deogarh","Mayurbhanj"],
  "Punjab":["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Hoshiarpur","Batala","Pathankot","Moga","Abohar","Malerkotla","Khanna","Phagwara","Muktsar","Barnala","Rajpura","Firozpur","Kapurthala","Sangrur","Fazilka","Gurdaspur","Rupnagar","Mohali","Fatehgarh Sahib","Nawanshahr","Mansa","Tarn Taran","Faridkot"],
  "Rajasthan":["Jaipur","Jodhpur","Kota","Bikaner","Ajmer","Udaipur","Bhilwara","Alwar","Sikar","Sri Ganganagar","Bharatpur","Pali","Barmer","Tonk","Kishangarh","Beawar","Jhunjhunu","Hanumangarh","Gangapur City","Sawai Madhopur","Churu","Nagaur","Baran","Bundi","Dhaulpur","Dausa","Rajsamand","Jaisalmer","Banswara","Dungarpur","Sirohi","Pratapgarh","Karauli","Jhalawar","Chittorgarh","Jalore","Jalor"],
  "Sikkim":["Gangtok","Namchi","Gyalshing","Mangan","Rangpo","Singtam","Jorethang","Nayabazar","Ravangla","Yuksom"],
  "Tamil Nadu":["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Tiruppur","Vellore","Erode","Thoothukudi","Dindigul","Thanjavur","Ranipet","Sivakasi","Karur","Udhagamandalam","Hosur","Nagercoil","Kanchipuram","Kumarapalayam","Karaikkudi","Neyveli","Cuddalore","Kumbakonam","Tiruvannamalai","Pollachi","Rajapalayam","Gudiyatham","Pudukkottai","Vaniyambadi","Ambur","Nagapattinam","Villupuram","Namakkal","Virudhunagar","Krishnagiri","Dharmapuri","Perambalur","Ariyalur","Tiruvarur","Ramanathapuram","Sivaganga","Theni"],
  "Telangana":["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Ramagundam","Mahbubnagar","Nalgonda","Adilabad","Suryapet","Miryalaguda","Siddipet","Mancherial","Jagtial","Kothagudem","Bhongir","Wanaparthy","Kamareddy","Nirmal","Sangareddy","Medak","Vikarabad","Narayanpet","Nagarkurnool","Bhadradri","Mulugu","Jayashankar","Yadadri","Medchal","Rangareddy","Hyderabad Rural"],
  "Tripura":["Agartala","Dharmanagar","Udaipur","Kailasahar","Belonia","Ambassa","Bishalgarh","Melaghar","Sonamura","Khowai","Sabroom","Santirbazar","Amarpur"],
  "Uttar Pradesh":["Lucknow","Kanpur","Agra","Varanasi","Meerut","Allahabad","Ghaziabad","Noida","Bareilly","Aligarh","Moradabad","Saharanpur","Gorakhpur","Firozabad","Jhansi","Muzaffarnagar","Mathura","Rampur","Shahjahanpur","Mau","Farrukhabad","Hapur","Etawah","Mirzapur","Bulandshahr","Sambhal","Amroha","Hardoi","Fatehpur","Raebareli","Orai","Sitapur","Bahraich","Modinagar","Unnao","Jaunpur","Lakhimpur","Hathras","Banda","Pilibhit","Barabanki","Khurja","Ghazipur","Etah","Deoria","Gopalganj","Sultanpur","Faizabad","Bijnor","Budaun","Mainpuri","Azamgarh","Ballia","Basti","Chandauli"],
  "Uttarakhand":["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Kotdwar","Pithoragarh","Ramnagar","Mussoorie","Srinagar","Pauri","Tehri","Uttarkashi","Chamoli","Bageshwar","Almora","Nainital","Champawat","Vikasnagar","Jaspur","Khatima","Sitarganj","Bazpur","Kichha","Gadarpur"],
  "West Bengal":["Kolkata","Asansol","Siliguri","Durgapur","Howrah","Bardhaman","Malda","Baharampur","Habra","Kharagpur","Shantipur","Dankuni","Dhulian","Ranaghat","Haldia","Raiganj","Krishnanagar","Nabadwip","Medinipur","Jalpaiguri","Balurghat","Basirhat","Bankura","Chakdaha","Darjeeling","Alipurduar","Cooch Behar","Purulia","Murshidabad","Birbhum","North 24 Parganas","South 24 Parganas","Hooghly","Nadia"],
  "Delhi":["New Delhi","Dwarka","Rohini","Janakpuri","Laxmi Nagar","Saket","Pitampura","Shahdara","Narela","Mehrauli","Karol Bagh","Connaught Place","Preet Vihar","Mayur Vihar","Vasant Kunj","Greater Kailash","Malviya Nagar","Hauz Khas","Rajouri Garden","Punjabi Bagh","Vikaspuri","Uttam Nagar","Paschim Vihar","Shalimar Bagh","Wazirpur","Burari","Mustafabad","Seemapuri","Kondli","Sangam Vihar"],
  "Jammu & Kashmir":["Srinagar","Jammu","Anantnag","Sopore","Baramulla","Kathua","Udhampur","Punch","Rajouri","Kupwara","Kulgam","Shopian","Ganderbal","Bandipore","Budgam","Reasi","Ramban","Kishtwar","Doda","Samba"],
  "Ladakh":["Leh","Kargil","Diskit","Khalsi","Nubra","Zanskar","Nyoma"],
  "Chandigarh":["Chandigarh","Manimajra","Burail","Khuda Lahora","Attawa","Mauli Jagran"],
  "Puducherry":["Puducherry","Karaikal","Mahe","Yanam","Ozhukarai","Villianur","Ariyankuppam","Nettapakkam"],
  "Andaman & Nicobar":["Port Blair","Diglipur","Mayabunder","Rangat","Wandoor","Hut Bay","Car Nicobar","Campbell Bay"],
  "Dadra & Nagar Haveli":["Silvassa","Amli","Khanvel","Naroli","Sayli","Masat","Rakholi"],
  "Daman & Diu":["Daman","Diu","Moti Daman","Nani Daman","Kadaiya","Varkund"],
  "Lakshadweep":["Kavaratti","Agatti","Minicoy","Amini","Andrott","Kalpeni","Kiltan","Chetlat","Bitra"]
};
const allStates = Object.keys(statesCities).sort();

/* ════════════════════════════════════════════
   PRODUCT TYPES
════════════════════════════════════════════ */
const subjectProducts = {
  "Stone Division":["Zx 1600 (New)","Monolith (New)","Omega 6x (New)","J-600 Bridge Cutter (New)","Thin Multiwire (New)","VersaWire Machine","Multicutters","Line Polishing Machines","Bridge Cutters","Wiresaw","Resin Line","AVBC"],
  "Crane Division":["Eot Cranes","Gantry / Goliath Cranes","Semi Gantry Crane","Wall Mounted","Jib Crane","Light Crane & Crane Kits"],
  "Sheet Metal Division":["Laser Cutting","Laser Welding","Laser Cleaning","Laser Marking","Laser Combo","Tube Laser Cutting"],
  "Industrial Equipment Infrastructure":["Fabrication","Machining","Erection","Civil"]
};

/* ════════════════════════════════════════════
   TOAST — FIX 5
════════════════════════════════════════════ */
let _toastTimer = null;
function showToast(type, message, duration = 5000) {
  const el = document.getElementById('toast');
  el.querySelector('.toast-icon').textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : '…';
  el.querySelector('.toast-msg').textContent  = message;
  el.className = 'show ' + type;
  if (_toastTimer) clearTimeout(_toastTimer);
  if (duration > 0) _toastTimer = setTimeout(hideToast, duration);
}
function hideToast() {
  const el = document.getElementById('toast');
  if (el) { el.className = el.className.replace('show','').trim(); }
}

/* ════════════════════════════════════════════
   AUTOCOMPLETE
════════════════════════════════════════════ */
function makeAutocomplete(inputId, listId, getOptions, onPick) {
  const inp  = document.getElementById(inputId);
  const list = document.getElementById(listId);
  let idx = -1;
  function render(items) {
    list.innerHTML = ''; idx = -1;
    if (!items.length) { list.classList.remove('open'); return; }
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.addEventListener('mousedown', e => {
        e.preventDefault(); inp.value = item;
        list.classList.remove('open'); onPick && onPick(item);
      });
      list.appendChild(li);
    });
    list.classList.add('open');
  }
  function filter() {
    const v = inp.value.trim().toLowerCase(), all = getOptions();
    render(v ? all.filter(s => s.toLowerCase().includes(v)) : all.slice(0,12));
  }
  inp.addEventListener('input', filter);
  inp.addEventListener('focus', filter);
  inp.addEventListener('keydown', e => {
    const lis = list.querySelectorAll('li');
    if (!lis.length) return;
    if      (e.key==='ArrowDown'){ e.preventDefault(); idx=Math.min(idx+1,lis.length-1); }
    else if (e.key==='ArrowUp')  { e.preventDefault(); idx=Math.max(idx-1,0); }
    else if (e.key==='Enter')    { e.preventDefault(); if(idx>=0) lis[idx].dispatchEvent(new Event('mousedown')); }
    else if (e.key==='Escape')   { list.classList.remove('open'); }
    lis.forEach((li,i) => li.classList.toggle('active', i===idx));
    if (idx>=0) lis[idx].scrollIntoView({block:'nearest'});
  });
  document.addEventListener('click', e => {
    if (!inp.contains(e.target) && !list.contains(e.target)) list.classList.remove('open');
  });
}
makeAutocomplete('state','stateList', ()=>allStates, ()=>{
  document.getElementById('city').value='';
  document.getElementById('cityList').classList.remove('open');
});
makeAutocomplete('city','cityList', ()=>{
  return statesCities[document.getElementById('state').value.trim()]||[];
});

/* ════════════════════════════════════════════
   FIX 8: URL PARAM — default Purchase if no param
════════════════════════════════════════════ */
(function initCategoryParam() {
  const params   = new URLSearchParams(window.location.search);
  const raw      = (params.get('category') || '').trim().toLowerCase();
  const catSelect = document.getElementById('category');
  // Map param to exact option value; default to 'Purchase' if no/unrecognised param
  if (raw === 'service') {
    catSelect.value = 'Service';
  } else {
    catSelect.value = 'Purchase';   // default
  }
})();

/* ════════════════════════════════════════════
   SUBJECT → PRODUCT TYPE
════════════════════════════════════════════ */
document.getElementById('subject').addEventListener('change', function() {
  const row = document.getElementById('productTypeRow');
  const sel = document.getElementById('productType');
  const prods = subjectProducts[this.value];
  if (prods) {
    sel.innerHTML = '<option value="" disabled selected>Select Product Type</option>';
    prods.forEach(p => { const o=document.createElement('option'); o.value=o.textContent=p; sel.appendChild(o); });
    row.style.display = 'flex';
  } else {
    row.style.display = 'none';
    sel.innerHTML = '<option value="" disabled selected>Select Product Type</option>';
    clearState('productType');
  }
  validateField('subject'); checkFormValidity();
});
document.getElementById('productType').addEventListener('change', function() {
  validateField('productType'); checkFormValidity();
});

/* ════════════════════════════════════════════
   VALIDATION
════════════════════════════════════════════ */
const nameRegex   = /^[A-Za-z\s]+$/;
const emailRegex  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const numberRegex = /^[0-9]{10}$/;

function setError(id, msg) {
  const w=document.getElementById('wrap-'+id), e=document.getElementById('err-'+id);
  if(w){w.classList.add('error');w.classList.remove('valid');}
  if(e){e.textContent=msg;e.classList.add('show');}
}
function setValid(id) {
  const w=document.getElementById('wrap-'+id), e=document.getElementById('err-'+id);
  if(w){w.classList.remove('error');w.classList.add('valid');}
  if(e){e.textContent='';e.classList.remove('show');}
}
function clearState(id) {
  const w=document.getElementById('wrap-'+id), e=document.getElementById('err-'+id);
  if(w) w.classList.remove('error','valid');
  if(e){e.textContent='';e.classList.remove('show');}
}

function validateField(id) {
  const el=document.getElementById(id), val=el?el.value.trim():'';
  switch(id) {
    case 'firstName':
      if(!val){setError(id,'First name is required');return false;}
      if(!nameRegex.test(val)){setError(id,'Only letters allowed');return false;}
      setValid(id);return true;
    case 'lastName':
      if(!val){setError(id,'Last name is required');return false;}
      if(!nameRegex.test(val)){setError(id,'Only letters allowed');return false;}
      setValid(id);return true;
    case 'email':
      if(!val){setError(id,'Email is required');return false;}
      if(!emailRegex.test(val)){setError(id,'Enter a valid email address');return false;}
      setValid(id);return true;
    case 'mobile':
      if(!val){setError(id,'Mobile number is required');return false;}
      if(!numberRegex.test(val)){setError(id,'Enter exactly 10 digits');return false;}
      setValid(id);return true;
    case 'state':
      if(!val){setError(id,'State is required');return false;}
      setValid(id);return true;
    case 'city':
      if(!val){setError(id,'City is required');return false;}
      if(!nameRegex.test(val)){setError(id,'Only letters allowed');return false;}
      setValid(id);return true;
    case 'category':
      if(!val){setError(id,'Please select a category');return false;}
      setValid(id);return true;
    case 'subject':
      if(!val){setError(id,'Please select a subject');return false;}
      setValid(id);return true;
    case 'productType':{
      const subj=document.getElementById('subject').value;
      if(subjectProducts[subj]&&!val){setError(id,'Please select a product type');return false;}
      if(val)setValid(id);return true;
    }
    case 'description':
      if(!val){setError(id,'Description is required');return false;}
      setValid(id);return true;
    default:return true;
  }
}

function checkFormValidity() {
  const btn=document.getElementById('submitBtn');
  const msg=document.getElementById('formErrorMsg');
  const subj=document.getElementById('subject').value;
  const fields=['firstName','lastName','email','mobile','state','city','category','subject','description'];
  if(subjectProducts[subj]) fields.push('productType');
  const allOk=fields.every(id=>{
    const el=document.getElementById(id), val=el?el.value.trim():'';
    if(!val) return false;
    if(['firstName','lastName','city'].includes(id)) return nameRegex.test(val);
    if(id==='email')  return emailRegex.test(val);
    if(id==='mobile') return numberRegex.test(val);
    return true;
  });
  btn.disabled=!allOk;
  if(allOk) msg.classList.remove('show');
}

['firstName','lastName','email','mobile','state','city','category','subject','description'].forEach(id=>{
  const el=document.getElementById(id); if(!el) return;
  el.addEventListener('blur',   ()=>{validateField(id);checkFormValidity();});
  el.addEventListener('input',  ()=>{
    if(document.getElementById('wrap-'+id)?.classList.contains('error')) validateField(id);
    checkFormValidity();
  });
  el.addEventListener('change', ()=>{validateField(id);checkFormValidity();});
});

/* ════════════════════════════════════════════
   RESET FORM — FIX 7
════════════════════════════════════════════ */
function resetForm() {
  document.getElementById('enquiryForm').reset();
  document.getElementById('productTypeRow').style.display='none';
  ['firstName','lastName','email','mobile','state','city','category','subject','productType','description']
    .forEach(id=>clearState(id));
  // re-apply default category after reset
  const params   = new URLSearchParams(window.location.search);
  const raw      = (params.get('category') || '').trim().toLowerCase();
  document.getElementById('category').value = (raw === 'service') ? 'Service' : 'Purchase';
  checkFormValidity();
}

/* ════════════════════════════════════════════
   API
════════════════════════════════════════════ */
const API_URL = 'http://localhost:8000/api/enquiry';

const STEP_ERRORS = {
  sf_auth          : 'Unable to connect to the server. Please try again later.',
  sf_find_contact  : 'Could not verify your details. Please try again.',
  sf_create_contact: 'Could not save your contact. Please try again.',
  sf_create_lead   : 'Could not register your enquiry. Please try again.',
  sf_create_case   : 'Could not register your enquiry. Please try again.',
  mc_auth          : 'Enquiry saved, but confirmation email could not be sent.',
  mc_journey       : 'Enquiry saved, but confirmation email could not be sent.'
};

/* ════════════════════════════════════════════
   FORM SUBMIT
════════════════════════════════════════════ */
document.getElementById('enquiryForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const subj=document.getElementById('subject').value;
  const fields=['firstName','lastName','email','mobile','state','city','category','subject','description'];
  if(subjectProducts[subj]) fields.push('productType');

  let allValid=true;
  fields.forEach(id=>{ if(!validateField(id)) allValid=false; });

  const errMsg=document.getElementById('formErrorMsg');
  if(!allValid){
    errMsg.classList.add('show');
    document.querySelector('.input-field.error')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  errMsg.classList.remove('show');

  const payload={
    firstName  : document.getElementById('firstName').value.trim(),
    lastName   : document.getElementById('lastName').value.trim(),
    email      : document.getElementById('email').value.trim(),
    mobile     : document.getElementById('mobile').value.trim(),
    state      : document.getElementById('state').value.trim(),
    city       : document.getElementById('city').value.trim(),
    category   : document.getElementById('category').value,
    subject    : document.getElementById('subject').value,
    productType: document.getElementById('productType')?.value||'',
    description: document.getElementById('description').value.trim()
  };

  const btn=document.getElementById('submitBtn');
  btn.disabled=true;
  btn.textContent='Submitting…';
  showToast('loading','Submitting your enquiry…', 0);

  try {
    const res    = await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const result = await res.json();

    if(result.success){
      showToast('success','✓ Enquiry submitted! Our team will get back to you shortly.',6000);
      resetForm();   /* FIX 7 */
      btn.disabled=false;
      btn.textContent='Submit Enquiry';
    } else {
      const step=result.step||null;
      const msg=step ? (STEP_ERRORS[step]||'Something went wrong. Please try again.')
                     : (result.message||'Something went wrong. Please try again.');
      showToast('error', msg, 7000);
      btn.disabled=false;
      btn.textContent='Submit Enquiry';
    }
  } catch(err) {
    showToast('error','Cannot reach the server. Please check your connection and try again.',7000);
    btn.disabled=false;
    btn.textContent='Submit Enquiry';
  }
});

/* ════════════════════════════════════════════
   INPUT SANITISATION
════════════════════════════════════════════ */
document.querySelectorAll('#firstName,#lastName,#city').forEach(f=>{
  f.addEventListener('input',()=>{ f.value=f.value.replace(/[^A-Za-z\s]/g,''); });
});
document.getElementById('mobile').addEventListener('input',function(){
  this.value=this.value.replace(/[^0-9]/g,'').slice(0,10);
});

document.getElementById('submitBtn').disabled=true;