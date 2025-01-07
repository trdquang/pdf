document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('addPageNumbers').addEventListener('click', addPageNumbers);

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('addPageNumbers').disabled = false;
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        document.getElementById('pdfContainer').style.display = 'block';
        const canvas = document.getElementById('pdfCanvas');
        const context = canvas.getContext('2d');
        const pdf = await pdfjsLib.getDocument({ url }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.0 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
    }
}

async function addPageNumbers() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    const fontSize = 12;

    pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        page.drawText(`${index + 1}`, {
            x: width - 50,
            y: 20,
            size: fontSize,
            font,
            color: PDFLib.rgb(0, 0, 0)
        });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.style.display = 'block';
}