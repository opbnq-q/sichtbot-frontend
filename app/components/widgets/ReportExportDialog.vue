<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Экспорт отчета</DialogTitle>
                <DialogDescription>
                    Выбери формат файла для скачивания.
                </DialogDescription>
            </DialogHeader>

            <div class="grid grid-cols-2 gap-2">
                <UiButton
                    variant="secondary"
                    :disabled="!props.report"
                    @click="downloadReport('json')"
                >
                    JSON
                </UiButton>
                <UiButton
                    variant="secondary"
                    :disabled="!props.report"
                    @click="downloadReport('xml')"
                >
                    XML
                </UiButton>
                <UiButton
                    variant="secondary"
                    :disabled="!props.report"
                    @click="downloadReport('yaml')"
                >
                    YAML
                </UiButton>
                <UiButton
                    variant="secondary"
                    :disabled="!props.report"
                    @click="downloadReport('xlsx')"
                >
                    XLSX
                </UiButton>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import type { ReportOutDto } from "~/repositories/reports.repository";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import * as YAML from "yaml";
import * as XLSX from "xlsx";

const props = defineProps<{
    open: boolean;
    report: ReportOutDto | null;
}>();

const emit = defineEmits<{
    (event: "update:open", value: boolean): void;
}>();

const isOpen = computed({
    get: () => props.open,
    set: (value: boolean) => emit("update:open", value),
});

const sanitizeFilename = (value: string) => {
    return value
        .replace(/[\\/:*?"<>|]+/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
};

const reportExportObject = (report: ReportOutDto) => {
    return {
        id: report.id,
        reportType: report.reportType,
        createdAt: report.createdAt,
        resources: report.resources ?? [],
        advices: report.advices,
    };
};

const toXmlValue = (value: unknown, key: string): string => {
    if (value === null || value === undefined) {
        return `<${key}></${key}>`;
    }

    if (Array.isArray(value)) {
        return `<${key}>${value.map((item) => toXmlValue(item, "item")).join("")}</${key}>`;
    }

    if (typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>)
            .map(([childKey, childValue]) => toXmlValue(childValue, childKey))
            .join("");
        return `<${key}>${entries}</${key}>`;
    }

    const escaped = String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    return `<${key}>${escaped}</${key}>`;
};

const flattenReportForXlsx = (report: ReportOutDto) => {
    const rows: Array<Record<string, string | number>> = [];

    for (const resource of report.resources ?? []) {
        for (const metric of resource.metrics ?? []) {
            rows.push({
                reportId: report.id,
                reportType: report.reportType,
                createdAt: report.createdAt,
                resourceType: resource.resourceType,
                resourceName: resource.name ?? "",
                resourceUrl: resource.url ?? "",
                metricId: metric.id,
                metricTitle: metric.title,
                currentValue: metric.currentValue,
                minValue: metric.minValue,
                maxValue: metric.maxValue,
                postfix: metric.postfix ?? "",
            });
        }
    }

    if (rows.length === 0) {
        rows.push({
            reportId: report.id,
            reportType: report.reportType,
            createdAt: report.createdAt,
            resourceType: "",
            resourceName: "",
            resourceUrl: "",
            metricId: "",
            metricTitle: "",
            currentValue: "",
            minValue: "",
            maxValue: "",
            postfix: "",
        });
    }

    return rows;
};

const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const formatShortDate = (value: string) => {
    const time = Date.parse(value);
    if (!Number.isFinite(time)) {
        return value;
    }
    return new Date(time).toLocaleDateString();
};

const downloadReport = (format: "json" | "xml" | "yaml" | "xlsx") => {
    const report = props.report;
    if (!report) {
        return;
    }

    const baseName = sanitizeFilename(
        `report-${report.id}-${formatShortDate(report.createdAt)}`,
    );
    const data = reportExportObject(report);

    if (format === "json") {
        const json = JSON.stringify(data, null, 2);
        triggerDownload(
            new Blob([json], { type: "application/json;charset=utf-8" }),
            `${baseName}.json`,
        );
    }

    if (format === "xml") {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>${toXmlValue(data, "report")}`;
        triggerDownload(
            new Blob([xml], { type: "application/xml;charset=utf-8" }),
            `${baseName}.xml`,
        );
    }

    if (format === "yaml") {
        const yaml = YAML.stringify(data);
        triggerDownload(
            new Blob([yaml], { type: "text/yaml;charset=utf-8" }),
            `${baseName}.yaml`,
        );
    }

    if (format === "xlsx") {
        const rows = flattenReportForXlsx(report);
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        const output = XLSX.write(workbook, {
            type: "array",
            bookType: "xlsx",
        });
        triggerDownload(
            new Blob([output], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            `${baseName}.xlsx`,
        );
    }

    isOpen.value = false;
};
</script>
