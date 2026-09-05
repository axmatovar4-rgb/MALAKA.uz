import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Real reference data only. Institutions, directors, and teachers are added
// through the admin/director dashboards (or teacher self-registration) once
// the platform is live — this script must never fabricate accounts or usage
// numbers.
//
// Region/district names are compiled from public sources (Wikipedia) and may
// contain small inaccuracies or omissions versus the official State
// Statistics Committee (stat.uz) classifier — verify against an official
// source before treating this as authoritative. Teachers can always type
// their institution manually if it isn't listed yet, so this doesn't block
// registration even where a name is off.
const REGIONS: Record<string, string[]> = {
  "Toshkent shahri": [
    "Bektemir",
    "Chilonzor",
    "Mirobod",
    "Mirzo Ulug'bek",
    "Olmazor",
    "Sergeli",
    "Shayxontohur",
    "Uchtepa",
    "Yakkasaroy",
    "Yashnobod",
    "Yunusobod",
    "Yangihayot",
  ],
  "Andijon viloyati": [
    "Andijon",
    "Asaka",
    "Baliqchi",
    "Bo'ston",
    "Buloqboshi",
    "Izboskan",
    "Jalaquduq",
    "Xo'jaobod",
    "Qo'rg'ontepa",
    "Marhamat",
    "Oltinko'l",
    "Paxtaobod",
    "Shahrixon",
    "Ulug'nor",
  ],
  "Buxoro viloyati": [
    "Olot",
    "Buxoro",
    "G'ijduvon",
    "Jondor",
    "Kogon",
    "Qorako'l",
    "Qorovulbozor",
    "Peshku",
    "Romitan",
    "Shofirkon",
    "Vobkent",
  ],
  "Farg'ona viloyati": [
    "Oltiariq",
    "Bag'dod",
    "Beshariq",
    "Buvayda",
    "Dang'ara",
    "Farg'ona",
    "Furqat",
    "Qo'shtepa",
    "Quva",
    "Rishton",
    "So'x",
    "Toshloq",
    "Uchko'prik",
    "O'zbekiston",
    "Yozyovon",
  ],
  "Jizzax viloyati": [
    "Arnasoy",
    "Baxmal",
    "Do'stlik",
    "Forish",
    "G'allaorol",
    "Sharof Rashidov",
    "Mirzacho'l",
    "Paxtakor",
    "Yangiobod",
    "Zomin",
    "Zafarobod",
    "Zarbdor",
  ],
  "Namangan viloyati": [
    "Chortoq",
    "Chust",
    "Kosonsoy",
    "Mingbuloq",
    "Namangan",
    "Norin",
    "Pop",
    "To'raqo'rg'on",
    "Uchqo'rg'on",
    "Uychi",
    "Yangiqo'rg'on",
    "Davlatobod",
    "Yangi Namangan",
  ],
  "Navoiy viloyati": [
    "Konimex",
    "Karmana",
    "Qiziltepa",
    "Xatirchi",
    "Navbahor",
    "Nurota",
    "Tomdi",
    "Uchquduq",
  ],
  "Qashqadaryo viloyati": [
    "Dehqonobod",
    "Kasbi",
    "Kitob",
    "Koson",
    "Ko'kdala",
    "Mirishkor",
    "Muborak",
    "Nishon",
    "Qamashi",
    "Qarshi",
    "Yakkabog'",
    "G'uzor",
    "Shahrisabz",
    "Chiroqchi",
  ],
  "Samarqand viloyati": [
    "Bulung'ur",
    "Ishtixon",
    "Jomboy",
    "Kattaqo'rg'on",
    "Qo'shrabot",
    "Narpay",
    "Nurobod",
    "Oqdaryo",
    "Paxtachi",
    "Payariq",
    "Pastdarg'om",
    "Samarqand",
    "Toyloq",
    "Urgut",
  ],
  "Sirdaryo viloyati": [
    "Sirdaryo",
    "Guliston",
    "Boyovut",
    "Sardoba",
    "Xovos",
    "Sayxunobod",
    "Oqoltin",
    "Mirzaobod",
  ],
  "Surxondaryo viloyati": [
    "Angor",
    "Bandixon",
    "Boysun",
    "Denov",
    "Jarqo'rg'on",
    "Muzrabot",
    "Oltinsoy",
    "Qiziriq",
    "Qumqo'rg'on",
    "Sariosiyo",
    "Sherobod",
    "Sho'rchi",
    "Termiz",
    "Uzun",
  ],
  "Toshkent viloyati": [
    "Bekobod",
    "Bo'ka",
    "Bo'stonliq",
    "Zangiota",
    "Oqqo'rg'on",
    "Ohangaron",
    "Parkent",
    "Piskent",
    "Chinoz",
    "Yuqori Chirchiq",
    "Yangiyo'l",
    "O'rta Chirchiq",
    "Qibray",
    "Quyi Chirchiq",
  ],
  "Xorazm viloyati": [
    "Bog'ot",
    "Gurlan",
    "Xonqa",
    "Tuproqqal'a",
    "Xiva",
    "Qo'shko'pir",
    "Shovot",
    "Urganch",
    "Yangiariq",
    "Yangibozor",
    "Hazorasp",
  ],
  "Qoraqalpog'iston Respublikasi": [
    "Amudaryo",
    "Beruniy",
    "Chimboy",
    "Ellikqal'a",
    "Kegeyli",
    "Mo'ynoq",
    "Nukus",
    "Qanliko'l",
    "Qo'ng'irot",
    "Qorao'zak",
    "Shumanay",
    "Taxtako'pir",
    "To'rtko'l",
    "Xo'jayli",
    "Taxiatosh",
    "Bo'zatov",
  ],
};

const SUBJECTS = [
  "Matematika",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Ona tili va adabiyot",
  "Ingliz tili",
  "Tarix",
  "Informatika va AT",
  "Boshlang'ich ta'lim",
  "Geografiya",
  "Rus tili va adabiyoti (yoki Xorijiy tili — Olmon, Fransuz va h.k.)",
  "Huquqshunoslik (Davlat va huquq asoslari)",
  "Tarbiya",
  "Chaqiriqqacha harbiy ta'lim (CHHT)",
  "Jismoniy tarbiya",
  "Tasviriy san'at",
  "Musiqa madaniyati",
  "Texnologiya (Mehnat ta'limi)",
];

const MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

async function upsertAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL va ADMIN_PASSWORD .env da belgilanishi kerak");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin allaqachon mavjud: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name: "Administrator", email, passwordHash, role: "ADMIN" },
  });
  console.log(`Admin yaratildi: ${email}`);
}

async function seedRegionsAndDistricts() {
  const regionIds: Record<string, string> = {};

  for (const regionName of Object.keys(REGIONS)) {
    const region = await prisma.region.upsert({
      where: { name: regionName },
      update: {},
      create: { name: regionName },
    });
    regionIds[regionName] = region.id;
  }

  // Districts created before the Region hierarchy existed (Tashkent city's
  // 12 tumanlari) have regionId = null. Attach them to their region instead
  // of creating duplicates.
  await prisma.district.updateMany({
    where: { regionId: null, name: { in: REGIONS["Toshkent shahri"] } },
    data: { regionId: regionIds["Toshkent shahri"] },
  });

  let count = 0;
  for (const [regionName, districtNames] of Object.entries(REGIONS)) {
    const regionId = regionIds[regionName];
    for (const name of districtNames) {
      await prisma.district.upsert({
        where: { regionId_name: { regionId, name } },
        update: {},
        create: { name, regionId },
      });
      count++;
    }
  }
  return { regions: Object.keys(regionIds).length, districts: count };
}

async function seedSubjects() {
  const subjects = [];
  for (const name of SUBJECTS) {
    const subject = await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    subjects.push(subject);
  }
  return subjects;
}

// Course months exist as a real schedule (which months a subject/group runs,
// with a 25-seat capacity) — only reservedCount reflects actual bookings,
// so it always starts at 0 here.
async function seedCourseOfferings(subjects: { id: string; name: string }[]) {
  const now = new Date();
  const groupTypes: ("RIVOJLANTIRUVCHI" | "YUKSALTIRUVCHI")[] = [
    "RIVOJLANTIRUVCHI",
    "YUKSALTIRUVCHI",
  ];

  for (const subject of subjects) {
    for (const groupType of groupTypes) {
      for (let m = 0; m < 6; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + 1 + m, 1);
        const monthLabel = MONTHS[date.getMonth()];
        const year = date.getFullYear();

        await prisma.courseOffering.upsert({
          where: {
            subjectId_groupType_year_monthLabel: {
              subjectId: subject.id,
              groupType,
              year,
              monthLabel,
            },
          },
          update: {},
          create: {
            subjectId: subject.id,
            groupType,
            monthLabel,
            year,
            startDate: date,
            capacity: 25,
            reservedCount: 0,
          },
        });
      }
    }
  }
}

async function main() {
  await upsertAdmin();
  const { regions, districts } = await seedRegionsAndDistricts();
  const subjects = await seedSubjects();
  console.log(`Viloyatlar: ${regions}, tumanlar: ${districts}, fanlar: ${subjects.length}`);
  await seedCourseOfferings(subjects);
  console.log("Seed yakunlandi.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
