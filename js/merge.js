pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('mergePdfs').addEventListener('click', mergePdfs);

let files = [];

function handleFileSelect(event) {
  const fileList = event.target.files;
  for (const file of fileList) {
    files.push(file);
  }
  if (files.length > 0) {
    document.getElementById('mergePdfs').disabled = false;
  }
  renderPreviews();
}

function renderPreviews() {
  const previewContainer = document.getElementById('previewContainer');
  previewContainer.innerHTML = '';  // Clear the previous previews
  files.forEach((file, index) => {
    const previewDiv = document.createElement('div');
    previewDiv.classList.add('preview');

    // Create the title div showing the file name
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('file-title');
    titleDiv.innerHTML = file.name;  // Use the file name

    previewDiv.appendChild(titleDiv);  // Append the title to the preview div
    previewContainer.appendChild(previewDiv);
  });
}

async function mergePdfs() {
  const pdfDoc = await PDFLib.PDFDocument.create();
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const donorPdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const donorPages = await pdfDoc.copyPages(donorPdfDoc, donorPdfDoc.getPageIndices());
    donorPages.forEach(page => pdfDoc.addPage(page));
  }
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = url;
  downloadLink.style.display = 'block';
}
