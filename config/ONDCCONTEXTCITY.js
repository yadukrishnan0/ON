// cityCodes.js
const CITY_CODES = [
  {
    City: "Delhi",
    Code: "std:011",
  },
  {
    City: "Ghaziabad",
    Code: "std:0120",
  },
  {
    City: "Meerut",
    Code: "std:0121",
  },
  {
    City: "Gurgaon",
    Code: "std:0124",
  },
  {
    City: "Faridabad",
    Code: "std:0129",
  },
  {
    City: "Saharanpur",
    Code: "std:0132",
  },
  {
    City: "Haridwar",
    Code: "std:01334",
  },
  {
    City: "Bijnor",
    Code: "std:01342",
  },
  {
    City: "Dehradun",
    Code: "std:0135",
  },
  {
    City: "Kotdwara",
    Code: "std:01382",
  },
  {
    City: "Jaipur",
    Code: "std:0141",
  },
  {
    City: "Motihari",
    Code: "std:06252",
  },
  {
    City: "Bansur",
    Code: "std:01461",
  },
  {
    City: "Sriganganagar",
    Code: "std:0154",
  },
  {
    City: "Mohali",
    Code: "std:0172",
  },
  {
    City: "Chandigarh",
    Code: "std:0172",
  },
  {
    City: "Jammu",
    Code: "std:0191",
  },
  {
    City: "Srinagar",
    Code: "std:0194",
  },
  {
    City: "Leh",
    Code: "std:01982",
  },
  {
    City: "Pune",
    Code: "std:020",
  },
  {
    City: "Mumbai",
    Code: "std:022",
  },
  {
    City: "Thane",
    Code: "std:022",
  },
  {
    City: "Dhule",
    Code: "std:02566",
  },
  {
    City: "Surat",
    Code: "std:0261",
  },
  {
    City: "Navasari",
    Code: "std:02637",
  },
  {
    City: "Vadodara",
    Code: "std:0265",
  },
  {
    City: "Nadiad",
    Code: "std:0268",
  },
  {
    City: "Rajkot",
    Code: "std:0281",
  },
  {
    City: "Kolkata",
    Code: "std:033",
  },
  {
    City: "Gangtok",
    Code: "std:03592",
  },
  {
    City: "Guwahati",
    Code: "std:0361",
  },
  {
    City: "Shillong",
    Code: "std:0364",
  },
  {
    City: "Barpeta",
    Code: "std:03666",
  },
  {
    City: "Hyderabad",
    Code: "std:040",
  },
  {
    City: "Kancheepuram",
    Code: "std:044",
  },
  {
    City: "Tiruvellore",
    Code: "std:044",
  },
  {
    City: "Tindivanam",
    Code: "std:04147",
  },
  {
    City: "Vellore",
    Code: "std:0416",
  },
  {
    City: "Tirupur",
    Code: "std:0421",
  },
  {
    City: "Coimbatore",
    Code: "std:0422",
  },
  {
    City: "Erode",
    Code: "std:0424",
  },
  {
    City: "Mettupalayam",
    Code: "std:04254",
  },
  {
    City: "Pollachi",
    Code: "std:04259",
  },
  {
    City: "Trichy",
    Code: "std:0431",
  },
  {
    City: "Hosur",
    Code: "std:04344",
  },
  {
    City: "Krishnagiri",
    Code: "std:04343",
  },
  {
    City: "Kumbakonam",
    Code: "std:0435",
  },
  {
    City: "Mayiladutjurai",
    Code: "std:04364",
  },
  {
    City: "Chennai",
    Code: "std:044",
  },
  {
    City: "Madurai",
    Code: "std:0452",
  },
  {
    City: "Theni",
    Code: "std:04546",
  },
  {
    City: "Ramanathpuram",
    Code: "std:04567",
  },
  {
    City: "Tirunelvelli",
    Code: "std:0462",
  },
  {
    City: "Thiruvananthapuram",
    Code: "std:0471",
  },
  {
    City: "Quilon",
    Code: "std:0474",
  },
  {
    City: "Alappuzha",
    Code: "std:0477",
  },
  {
    City: "Mavelikkara",
    Code: "std:0479",
  },
  {
    City: "Ernakulam",
    Code: "std:0484",
  },
  {
    City: "Trichur",
    Code: "std:0487",
  },
  {
    City: "Kozhikode",
    Code: "std:0495",
  },
  {
    City: "Cannanore",
    Code: "std:0497",
  },
  {
    City: "Kanpur",
    Code: "std:0512",
  },
  {
    City: "Lucknow",
    Code: "std:0522",
  },
  {
    City: "Hamirpur",
    Code: "std:05282",
  },
  {
    City: "Gorakhpur",
    Code: "std:0551",
  },
  {
    City: "Agra",
    Code: "std:0562",
  },
  {
    City: "Bareilly",
    Code: "std:0581",
  },
  {
    City: "Lakhimpur Kheri",
    Code: "std:05872",
  },
  {
    City: "Moradabad",
    Code: "std:0591",
  },
  {
    City: "Bilari",
    Code: "std:05921",
  },
  {
    City: "Chapara",
    Code: "std:06152",
  },
  {
    City: "Cuttack",
    Code: "std:0671",
  },
  {
    City: "Chhindwara",
    Code: "std:07162",
  },
  {
    City: "Indore",
    Code: "std:0731",
  },
  {
    City: "Bareli",
    Code: "std:07486",
  },
  {
    City: "Bhopal",
    Code: "std:0755",
  },
  {
    City: "Ahmedabad",
    Code: "std:079",
  },
  {
    City: "Bengaluru",
    Code: "std:080",
  },
  {
    City: "Magadi",
    Code: "std:080405",
  },
  {
    City: "Kolar",
    Code: "std:08152",
  },
  {
    City: "Udupi",
    Code: "std:0820",
  },
  {
    City: "Mysuru",
    Code: "std:0821",
  },
  {
    City: "Mandya",
    Code: "std:08232",
  },
  {
    City: "Mangaluru",
    Code: "std:0824",
  },
  {
    City: "Kaup",
    Code: "std:08252",
  },
  {
    City: "Karkala",
    Code: "std:08258",
  },
  {
    City: "Chikmagalur",
    Code: "std:08262",
  },
  {
    City: "Kadur",
    Code: "std:08267",
  },
  {
    City: "Bailhongal",
    Code: "std:08288",
  },
  {
    City: "Panaji",
    Code: "std:0832",
  },
  {
    City: "Porvorim",
    Code: "std:0832217",
  },
  {
    City: "Bijapur",
    Code: "std:08352",
  },
  {
    City: "Bagalkot",
    Code: "std:08354",
  },
  {
    City: "Hubli",
    Code: "std:0836",
  },
  {
    City: "Ranebennur",
    Code: "std:08373",
  },
  {
    City: "Gulbarga",
    Code: "std:08472",
  },
  {
    City: "Chittoor",
    Code: "std:08572",
  },
  {
    City: "Vuyyuru",
    Code: "std:08677",
  },
  {
    City: "Bhimavaram",
    Code: "std:08816",
  },
  {
    City: "Vizayanagaram",
    Code: "std:08922",
  },
  {
    City: "Amritsar",
    Code: "std:0183",
  },
  {
    City: "Mandi Dabwali",
    Code: "std:01668",
  },
  {
    City: "Udaipur",
    Code: "std:0294",
  },
  {
    City: "JHAJJAR",
    Code: "std:01251",
  },
  {
    City: "PALGHAT",
    Code: "std:0491",
  },
  {
    City: "KALYAN",
    Code: "std:0251",
  },
  {
    City: "Calicut",
    Code: "std:0495",
  },
  {
    City: "SITAMARHI",
    Code: "std:06226",
  },
  {
    City: "Nadiad",
    Code: "std:0268",
  },
  {
    City: "Greater Noida",
    Code: "std:0120",
  },
  {
    City: "FATEHPUR",
    Code: "std:01571",
  },
  {
    City: "Thriuvannamala",
    Code: "std:04175",
  },
  {
    City: "chatrapur",
    Code: "std:06811",
  },
  {
    City: "Jalpaiguri",
    Code: "std:03561",
  },
  {
    City: "Krishnanagar",
    Code: "std:03472",
  },
  {
    City: "vijaypur",
    Code: "std:08352",
  },
  {
    City: "GIDDALUR",
    Code: "std:08405",
  },
  {
    City: "ladakh",
    Code: "std:01982",
  },
  {
    City: "Kutch",
    Code: "std:02834",
  },
  {
    City: "Varanasi",
    Code: "std:0542",
  },
  {
    City: "Mainpuri,",
    Code: "std:05672",
  },
  {
    City: "Rampur,",
    Code: "std:0595",
  },
  {
    City: "Bijnore",
    Code: "std:01342",
  },
  {
    City: "Husenganj",
    Code: "std:05143",
  },
  {
    City: "Amety",
    Code: "std:05368",
  },
  {
    City: "Kanoj",
    Code: "std:05694",
  },
  {
    City: "Unnao",
    Code: "std:0515",
  },
  {
    City: "Lalitpur",
    Code: "std:05176",
  },
  {
    City: "Pala",
    Code: "std:04822",
  },
  {
    City: "Aurangabad",
    Code: "std:0240",
  },
  {
    City: "Ganjam",
    Code: "std:6811",
  },
  {
    City: "Nagpur",
    Code: "std:0712",
  },
  {
    City: "Anand",
    Code: "std:02692",
  },
  {
    City: "Sirsa",
    Code: "std:01666",
  },
  {
    City: "Fatehabad",
    Code: "std:01667",
  },
  {
    City: "Kundli",
    Code: "std:0130",
  },
  {
    City: "Dahisar",
    Code: "std:02525",
  },
  {
    City: "Jalgaon",
    Code: "std:0257",
  },
  {
    City: "Nashik",
    Code: "std:0253",
  },
  {
    City: "Bokaro",
    Code: "std:06542",
  },
  {
    City: "Cachar",
    Code: "std:3842",
  },
  {
    City: "Jeypore",
    Code: "std:06854",
  },
  {
    City: "Burdwan",
    Code: "std:0342",
  },
  {
    City: "Asansol",
    Code: "std:0341",
  },
  {
    City: "Ludhiana",
    Code: "std:0161",
  },
  {
    City: "Agartala",
    Code: "std:0381",
  },
  {
    City: "Alwar",
    Code: "std:0144",
  },
  {
    City: "Wardha",
    Code: "std:07152",
  },
  {
    City: "Saja",
    Code: "std:07825",
  },
  {
    City: "Morigaon  Rajamayong",
    Code: "std:03678",
  },
  {
    City: "Loni Kalbhor",
    Code: "std:021263",
  },
  {
    City: "Solapur",
    Code: "std:0217",
  },
  {
    City: "Pala",
    Code: "std:04822",
  },
  {
    City: "Gwalior",
    Code: "std:0751",
  },
  {
    City: "Jalpaiguri",
    Code: "std:03561",
  },
  {
    City: "Gandhinagar",
    Code: "std:02712",
  },
  {
    City: "Walajapet",
    Code: "std:0416",
  },
  {
    City: "Kharagpur",
    Code: "std:03222",
  },
  {
    City: "Visakhapatnam",
    Code: "std:0891",
  },
  {
    City: "Solan",
    Code: "std:01792",
  },
  {
    City: "Imphal",
    Code: "std:0385",
  },
  {
    City: "Adilabad",
    Code: "std:08732",
  },
  {
    City: "Ambur",
    Code: "std:04174",
  },
  {
    City: "Bhiwandi",
    Code: "std:2522",
  },
  {
    City: "Itanagar",
    Code: "std:0360",
  },
  {
    City: "Sawai Madhopur",
    Code: "std:07462",
  },
  {
    City: "Darrang",
    Code: "std:037173",
  },
  {
    City: "Ambala",
    Code: "std:0171",
  },
  {
    City: "Valsad",
    Code: "std:02632",
  },
  {
    City: "Bikaner",
    Code: "std:0151",
  },
  {
    City: "Jagadhri",
    Code: "std:01732",
  },
  {
    City: "Jabalpur",
    Code: "std:0761",
  },
  {
    City: "Pondicherry",
    Code: "std:0413",
  },
  {
    City: "Chandakavadi",
    Code: "std:08226",
  },
  {
    City: "MALUR",
    Code: "std:08151",
  },
  {
    City: "Challakere",
    Code: "std:08195",
  },
  {
    City: "MULBAGAL",
    Code: "std:08159",
  },
  {
    City: "Ahmednagar",
    Code: "std:0241",
  },
  {
    City: "Bhubaneswar",
    Code: "std:0674",
  },
  {
    City: "Panchkula",
    Code: "std:0172",
  },
  {
    City: "Bhachau",
    Code: "std:02837",
  },
  {
    City: "Veraval",
    Code: "std:02876",
  },
  {
    City: "Patna",
    Code: "std:0612",
  },
  {
    City: "Bankura",
    Code: "std:03242",
  },
  {
    City: "Ankleshwar",
    Code: "std :02646",
  },
  {
    City: "Gwalior",
    Code: "std:0751",
  },
  {
    City: "Warangal",
    Code: "std:0870",
  },
  {
    City: "Kashipur",
    Code: "std:05947",
  },
  {
    City: "Bhagalpur",
    Code: "std:0641",
  },
  {
    City: "Sangli",
    Code: "std:0233",
  },
  {
    City: "Madhubani",
    Code: "std:06276",
  },
  {
    City: "Dimapur",
    Code: "std:03862",
  },
  {
    City: "Namakkal",
    Code: "std:04286",
  },
  {
    City: "Jalna",
    Code: "std: 02482",
  },
  {
    City: "Kannur",
    Code: "std:0490",
  },
  {
    City: "Barabanki",
    Code: "std:05248",
  },
  {
    City: "Chamba",
    Code: "std:01899",
  },
  {
    City: "Badagara",
    Code: "std: 0496",
  },
  {
    City: "Najirganj",
    Code: "std:03581",
  },
  {
    City: "Wai",
    Code: "std:02167",
  },
  {
    City: "Songadh",
    Code: "std:02624",
  },
  {
    City: "Yeotmal",
    Code: "std:07232",
  },
  {
    City: "Dondaicha",
    Code: "std:02562",
  },
  {
    City: "Rangia",
    Code: "std:03621",
  },
  {
    City: "Gulaothi",
    Code: "std:05735",
  },
  {
    City: "Omerga",
    Code: "std:02475",
  },
  {
    City: "Yawal",
    Code: "std:02585",
  },
  {
    City: "Srirampura",
    Code: "std:08154",
  },
];

module.exports = CITY_CODES;
