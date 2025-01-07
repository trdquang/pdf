let pdfFiles = [];

function uploadPdf() {
  const files = document.getElementById('pdfInput').files;
  pdfFiles = Array.from(files);

  // Hiển thị tên các file PDF đã tải lên
  const fileListDiv = document.getElementById('fileList');
  fileListDiv.innerHTML = '<h4>Danh sách file PDF đã tải lên:</h4>';
  
  pdfFiles.forEach(file => {
    const fileElement = document.createElement('p');
    fileElement.textContent = file.name;
    fileListDiv.appendChild(fileElement);
  });
}

async function mergePdf() {
  if (pdfFiles.length < 2) {
    alert('Vui lòng tải lên ít nhất 2 file PDF để nối.');
    return;
  }

  try {
    const mergedPdf = await PDFLib.PDFDocument.create();

    for (const file of pdfFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Tạo file PDF đã nối
    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

    // Tạo link tải xuống
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(mergedPdfBlob);
    downloadLink.download = 'merged.pdf';
    downloadLink.textContent = 'Tải file PDF đã nối';

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';  // Xóa nội dung cũ
    resultDiv.appendChild(downloadLink);

  } catch (error) {
    console.error('Có lỗi khi nối PDF:', error);
    alert('Có lỗi xảy ra trong quá trình nối PDF.');
  }
}
