const fetch = require("node-fetch");
const users = require('./users.json');
const original = require('./original.json');
const comments = require('./comments.json');
const requestData = require('./request.json');

const token = "YOUR_TOKEN";

const keys = {
  keyInitiative: "Inisiatif, Proaktif, Bertanggung jawab",
  keyEnglish: "Bahasa Inggris",
  keySoftSkill: "Tugas Soft Skil",
  keyCareer: "Pembelajaran Soft skills dan Penyiapan Karir atau startup",
  keyReview: "Review Materi",
  keyReflection: "Refleksi diri",
  keyJs: "Belajar Dasar Pemrograman JavaScript",
  keyWeb: "Belajar Dasar Pemrograman Web",
  keyCapstone: "Capstone Project / Proyek Akhir",
  keyBackend: "Belajar Membuat Aplikasi Back-End untuk Pemula dengan Google Cloud\t",
  keyCCFound: "Google Cloud Computing Foundations",
  keyITSupport: "Google IT Support Professional Certificate",
  keyCELP: "Cloud Engineer Learning Path",
  keyMGCE: "Menjadi Google Cloud Engineer",
  keyGCSB: "Google Cloud Skills Boost Quests",
  keyACE: "ACE Examination Practice",
  keyACEC: "Simulasi Ujian Associate Cloud Engineer"
};

async function main() {

  const requests = [];

  original.forEach((original, index) => {
    let user = users.find(user => user.id_reg_penawaran === original["ID Kegiatan Kampus Merdeka"].toString());
    if (!user) {
      return;
    }

    let data = JSON.parse(JSON.stringify(requestData));
    data.scores.forEach((score, index) => {
      Object.keys(keys).forEach((key, index) => {
        if (score.module_name === keys[key]) {
          score.score = original[keys[key]];
          score.comment = getComment(keys[key], original[keys[key]]);
        }
      });
    });

    // ! assessment
    // ! final_assessment

    requests.push({
      url: "https://api.kampusmerdeka.kemdikbud.go.id/v1alpha1/mentors/me/mentees/" + user.id + "/activities/" + user.activity_id + "/final_assessment",
      body: JSON.stringify(data),
    });
  });

  function getValueRate(value) {
    if (value >= 70 && value <= 100) {
      return "High";
    } else if (value >= 40) {
      return "Low";
    } else {
      return "Lowest";
    }
  }

  function getComment(key, value) {
    let comment = comments.find(comment => comment["Course List"] === key);
    if (!comment) {
      return;
    }
    let rate = getValueRate(value);
    console.log(key, value, rate);
    return comment[rate];
  }

  for (let i = 0; i < requests.length; i++) {
    let request = requests[i];
    console.log(request.url);
    console.log(JSON.parse(request.body));
  }

  for (let i = 0; i < requests.length; i++) {
    let request = requests[i];
    await fetch(request.url, {
      "headers": {
        "accept": "application/json",
        "authorization": "Bearer " + token,
        "Referer": "https://mentor.kampusmerdeka.kemdikbud.go.id/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": request.body,
      "method": "POST"
    });
  }
}

main();