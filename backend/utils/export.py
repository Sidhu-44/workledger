"""
Export helpers for the Reports module.
Each function returns raw bytes ready to be streamed back as a file download.
"""
import csv
import io
from typing import Sequence

from models.work_entry import WorkEntry


def _rows(entries: Sequence[WorkEntry]) -> list[list]:
    header = ["Date", "Customer", "Description", "Amount", "Paid", "Remaining", "Status"]
    rows = [header]
    for e in entries:
        rows.append(
            [
                e.work_date.isoformat(),
                e.customer.name if e.customer else "",
                e.description,
                float(e.amount),
                float(e.paid_amount),
                float(e.remaining_amount),
                e.payment_status.value,
            ]
        )
    return rows


def export_csv(entries: Sequence[WorkEntry]) -> bytes:
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    for row in _rows(entries):
        writer.writerow(row)
    return buffer.getvalue().encode("utf-8")


def export_excel(entries: Sequence[WorkEntry]) -> bytes:
    # openpyxl is a lightweight, widely-available dependency for .xlsx generation.
    from openpyxl import Workbook

    wb = Workbook()
    ws = wb.active
    ws.title = "Work Entries"
    for row in _rows(entries):
        ws.append(row)

    buffer = io.BytesIO()
    wb.save(buffer)
    return buffer.getvalue()


def export_pdf(entries: Sequence[WorkEntry], title: str = "Worker Ledger Report") -> bytes:
    # reportlab keeps PDF generation dependency-light and server-side (no headless browser needed).
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = [Paragraph(title, styles["Title"]), Spacer(1, 12)]

    data = _rows(entries)
    table = Table(data, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2937")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f3f4f6")]),
            ]
        )
    )
    elements.append(table)
    doc.build(elements)
    return buffer.getvalue()
