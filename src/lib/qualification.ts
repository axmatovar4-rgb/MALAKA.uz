import type { GroupType, QualificationCategory } from "@prisma/client";

export const categoryLabels: Record<QualificationCategory, string> = {
  MUTAXASSIS: "Mutaxassis",
  IKKINCHI_TOIFA: "II toifa",
  BIRINCHI_TOIFA: "I toifa",
  OLIY_TOIFA: "Oliy toifa",
};

export const groupLabels: Record<GroupType, string> = {
  RIVOJLANTIRUVCHI: "Rivojlantiruvchi",
  YUKSALTIRUVCHI: "Yuksaltiruvchi",
};

export const groupDescriptions: Record<GroupType, string> = {
  RIVOJLANTIRUVCHI: "Mutaxassis va II toifa egalari uchun",
  YUKSALTIRUVCHI: "I va oliy toifa egalari uchun",
};

export function groupForCategory(category: QualificationCategory): GroupType {
  switch (category) {
    case "MUTAXASSIS":
    case "IKKINCHI_TOIFA":
      return "RIVOJLANTIRUVCHI";
    case "BIRINCHI_TOIFA":
    case "OLIY_TOIFA":
      return "YUKSALTIRUVCHI";
  }
}
