export type Locale = "uz" | "ru";

export type Dictionary = {
  header: {
    tagline: string;
    nav: {
      home: string;
      courses: string;
      reservations: string;
      groups: string;
      news: string;
      faq: string;
      about: string;
      contact: string;
    };
    login: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  services: {
    title: string;
    items: {
      book: { title: string; bullet: string; description: string; cta: string };
      groups: { title: string; bullet: string; description: string; cta: string };
      myBookings: { title: string; bullet: string; description: string; cta: string };
    };
  };
  bottomNav: {
    home: string;
    courses: string;
    book: string;
    reservations: string;
    profile: string;
  };
};

const dictionaryUz: Dictionary = {
  header: {
    tagline: "Pedagoglar platformasi",
    nav: {
      home: "Bosh sahifa",
      courses: "Kurslar",
      reservations: "Bandlovlar",
      groups: "Guruhlar",
      news: "Yangiliklar",
      faq: "Savol-javob",
      about: "Biz haqimizda",
      contact: "Aloqa",
    },
    login: "Kirish",
  },
  hero: {
    title: "Malaka.uz pedagoglar uchun",
    subtitle:
      "5 yilda bir marta o'tiladigan 1 oylik malaka oshirish kurslari uchun o'zingizga qulay oyda joyingizni oldindan band qiling.",
    cta: "Joy band qilish",
  },
  services: {
    title: "Xizmatlar",
    items: {
      book: {
        title: "Joy band qilish",
        bullet: "Kurs oyini tanlab joy band qiling",
        description:
          "O'zingizga qulay oy va bo'sh joyni tanlab, malaka oshirish kursiga joyingizni band qiling.",
        cta: "Boshlash",
      },
      groups: {
        title: "Guruhlar",
        bullet: "Guruhlar haqida ma'lumot",
        description:
          "Rivojlantiruvchi va yuksaltiruvchi guruhlar haqida batafsil ma'lumot oling.",
        cta: "Ko'rish",
      },
      myBookings: {
        title: "Mening bandlovlarim",
        bullet: "Band qilgan joylaringiz",
        description:
          "Band qilgan kurslaringiz, sanalar va holatini bu yerda ko'rishingiz mumkin.",
        cta: "Ko'rish",
      },
    },
  },
  bottomNav: {
    home: "Bosh sahifa",
    courses: "Kurslar",
    book: "Joy band qilish",
    reservations: "Bandlovlar",
    profile: "Profil",
  },
};

const dictionaryRu: Dictionary = {
  header: {
    tagline: "Платформа для педагогов",
    nav: {
      home: "Главная",
      courses: "Курсы",
      reservations: "Мои брони",
      groups: "Группы",
      news: "Новости",
      faq: "Вопросы и ответы",
      about: "О нас",
      contact: "Контакты",
    },
    login: "Войти",
  },
  hero: {
    title: "Malaka.uz для педагогов",
    subtitle:
      "Заранее забронируйте удобный для вас месяц для месячных курсов повышения квалификации, которые проходят раз в 5 лет.",
    cta: "Забронировать место",
  },
  services: {
    title: "Услуги",
    items: {
      book: {
        title: "Бронирование места",
        bullet: "Выберите месяц и забронируйте место",
        description:
          "Выберите удобный месяц и свободное место, забронируйте место на курсе повышения квалификации.",
        cta: "Начать",
      },
      groups: {
        title: "Группы",
        bullet: "Информация о группах",
        description:
          "Подробная информация о развивающей и совершенствующей группах.",
        cta: "Смотреть",
      },
      myBookings: {
        title: "Мои бронирования",
        bullet: "Забронированные места",
        description:
          "Здесь вы можете увидеть забронированные курсы, даты и их статус.",
        cta: "Смотреть",
      },
    },
  },
  bottomNav: {
    home: "Главная",
    courses: "Курсы",
    book: "Бронь",
    reservations: "Мои брони",
    profile: "Профиль",
  },
};

export const dictionaries: Record<Locale, Dictionary> = {
  uz: dictionaryUz,
  ru: dictionaryRu,
};
