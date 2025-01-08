//----định nghĩa biến toàn cục
// trang bắt đầu, màu sắc và vị trí
startPage = -1;
xPos = null;
yPos = null;
colorRgb = null;


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

function getColor(){
    let color = document.getElementById('colorSelect').value;

    switch (color) {
        case 'blue':
            colorRgb =  PDFLib.rgb(0, 0, 1);  // Màu xanh dương
            break
        case 'green':
            colorRgb =  PDFLib.rgb(0, 1, 0);  // Màu xanh lá cây
            break;
        case 'yellow':
            colorRgb =  PDFLib.rgb(1, 1, 0);  // Màu vàng
            break;
        case 'red':
        default:
            colorRgb =  PDFLib.rgb(0.941, 0.074, 0.235);  // Màu đỏ (mặc định)
            break;
    }
}

function getPage(){
    try {
        startPage = parseInt(document.getElementById('pageStart').value, 10)
    } catch (error) {
        startPage = -1;
    }
}


function getPosition(width){
    let position = document.getElementById('positionSelect').value;

    if (position === 'bottom-left') {
        xPos = 50;   
        yPos = 20;  
    } else if (position === 'bottom-center') {
        xPos = width/2-20;  
        yPos = 20;   
    } else if (position === 'bottom-right') {
        xPos = width - 50;   
        yPos = 20;   
    }
}

async function addPageNumbers() {
    getPage();
    getColor();
    if(startPage < 0 || startPage == null){
        alert('Số trang không phù hợp')
        return;
    }

    // if(xPos == null || yPos == null){
    //     alert('Vị trí không phù hợp');
    //     return;
    // }

    if(colorRgb == null){
        alert('Màu sắc không phù hợp');
        return;
    }


    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    const fontSize = 12;

    pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        getPosition(width)

        // page.drawText(`${index + 1}`, {
        page.drawText(`${startPage}`, {
            x: xPos,
            y: yPos,
            size: fontSize,
            font,
            color: colorRgb

        });

        startPage++;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;

    let fileNameDown = "p_" + file.name;
    downloadLink.download = fileNameDown;

    downloadLink.style.display = 'block';
}