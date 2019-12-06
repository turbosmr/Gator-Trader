// Validation to ensure atleast one delivery method is selected
$(document).ready(() => {
    /********* Check if at least one delivery method is selected *********/
    const form = document.querySelector('#sellForm');
    const checkboxes = form.querySelectorAll('input[type=checkbox]');
    const checkboxLength = checkboxes.length;
    const firstCheckbox = checkboxLength > 0 ? checkboxes[0] : null;

    init = () => {
        if (firstCheckbox) {
            for (let i = 0; i < checkboxLength; i++) {
                checkboxes[i].addEventListener('change', checkValidity);
            }

            checkValidity();
        }
    }

    isChecked = () => {
        for (let i = 0; i < checkboxLength; i++) {
            if (checkboxes[i].checked) return true;
        }

        return false;
    }

    checkValidity = () => {
        const errorMessage = !isChecked() ? 'At least one checkbox must be selected.' : '';
        firstCheckbox.setCustomValidity(errorMessage);
    }

    /********* End of delivery method checkbox check *********/

    // If sales item is a course specific material, show courses dropdown menu, else hide
    $('input[name=isCourseSpecificMaterial]').click(function () {
        if (this.id == "courseSpecificMaterialYes") {
            $("#classMaterialSection").show('slow');
            $("select[name='classMaterialSection']").prop('required', true);
        } else {
            $("#classMaterialSection").hide('slow');
            $("select[name='classMaterialSection']").prop('required', false);
            $("select[name='classMaterialSection'] option").prop("selected", false);
        }
    });


    // On change of the input track how many files are selected
    $("#salesItemImage").on("change", function () {
        if ($("#salesItemImage")[0].files.length > 4) {
            alert("You can select only up to 4 images");
            $("#salesItemImage").val("");

            while (preview.firstChild) {
                preview.removeChild(preview.firstChild);
            }

            var para = document.createElement('p');
            para.textContent = 'No files currently selected for upload';
            preview.appendChild(para);
        }
    });

    init();
});


/**************** Upload Image Preview ****************/
/*********** Tutorial by MDN (MDN Web Docs) ***********/
let input = document.querySelector('#salesItemImage');
let preview = document.querySelector('.preview');

input.style.opacity = 0;

input.addEventListener('change', updateImageDisplay);

function updateImageDisplay() {
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }
    var curFiles = input.files;
    if (curFiles.length === 0) {
        var para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        var list = document.createElement('ol');
        preview.appendChild(list);
        for (var i = 0; i < curFiles.length; i++) {
            var listItem = document.createElement('li');
            var para = document.createElement('p');
            if (validFileType(curFiles[i])) {
                para.className = "my-auto";
                para.innerHTML = 'File name: ' + curFiles[i].name + '<br>File size: ' + returnFileSize(curFiles[i].size);
                var image = document.createElement('img');
                image.src = window.URL.createObjectURL(curFiles[i]);
                listItem.appendChild(image);
                listItem.appendChild(para);
            } else {
                para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                listItem.appendChild(para);
            }
            list.appendChild(listItem);
        }
    }
}

var fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
]

function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }
    return false;
}

function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number > 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number > 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
    }
}

$('#resetForm').click(() => {
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    var para = document.createElement('p');
    para.textContent = 'No files currently selected for upload';
    preview.appendChild(para);
});