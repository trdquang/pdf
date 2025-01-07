document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('addPageNumbers').addEventListener('click', addPageNumbers);

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('addPageNumbers').disabled = false;

        const previewContainer = document.getElementById('previewContainer');
        previewContainer.innerHTML = '';

        const previewDiv = document.createElement('div');
        previewDiv.classList.add('preview');

        // Create the title div showing the file name
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('file-title');
        titleDiv.innerHTML = file.name;  // Use the file name

        previewDiv.appendChild(titleDiv);  // Append the title to the preview div
        previewContainer.appendChild(previewDiv);
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
            // color: PDFLib.rgb(0.941, 0.074, 0.235)
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