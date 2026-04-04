import type { ReportType } from "~/repositories/reports.repository";

export function getReportTypeTitle(reportType: ReportType | 'error'): string {
    switch (reportType) {
        case "full":
            return "Полный";
        case "advices-only":
            return "Рекомендации";
        case "metrics-only":
            return "Метрики";
        default:
            return "Ошибка";
    }
}