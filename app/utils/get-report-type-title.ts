import type { ReportType } from "~/repositories/reports.repository";

export function getReportTypeTitle(reportType: ReportType | 'empty'): string {
    switch (reportType) {
        case "full":
            return "Полный";
        case "advices-only":
            return "Рекомендации";
        case "metrics-only":
            return "Метрики";
        case 'empty':
            return 'Пусто'
        default:
            return "Ошибка";
    }
}