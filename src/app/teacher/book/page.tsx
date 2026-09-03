import { redirect } from "next/navigation";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { BottomNav } from "@/components/marketing/bottom-nav";
import { BookingWizard } from "@/components/reservation/booking-wizard";
import { groupForCategory } from "@/lib/qualification";
import { activeReservationCutoff } from "@/lib/reservation-status";

export default async function TeacherBookPage() {
  const user = await requireRole("TEACHER");

  const teacher = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      institution: { include: { district: true } },
      subject: true,
      reservations: {
        where: { status: { not: "CANCELLED" } },
        select: { offering: { select: { startDate: true } } },
      },
    },
  });

  if (!teacher) redirect("/api/force-logout");

  if (!teacher.subject || !teacher.institution || !teacher.qualificationCategory) {
    redirect("/teacher");
  }

  const cutoff = activeReservationCutoff();
  const hasActiveReservation = teacher.reservations.some(
    (r) => r.offering.startDate.getTime() > cutoff.getTime(),
  );
  if (hasActiveReservation) {
    redirect("/teacher");
  }

  const groupType = groupForCategory(teacher.qualificationCategory);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950 lg:pb-0">
      <TeacherHeader userName={teacher.name} />
      <BookingWizard
        teacherName={teacher.name}
        districtName={teacher.institution.district.name}
        institutionName={teacher.institution.name}
        subjectId={teacher.subject.id}
        subjectName={teacher.subject.name}
        qualificationCategory={teacher.qualificationCategory}
        groupType={groupType}
      />
      <BottomNav />
    </div>
  );
}
