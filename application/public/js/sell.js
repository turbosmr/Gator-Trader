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

    // If sales item is a class specific material, show class section dropdown menu, else hide
    $('input[name=isClassSpecificMaterial]').click(function () {
        if (this.id == "classSpecificMaterialYes") {
            $("#classMaterialSection").show('slow');
            $("select[name='classMaterialSection']").prop('required', true);
        } else {
            $("#classMaterialSection").hide('slow');
            $("select[name='classMaterialSection']").prop('required', false);
            $("select[name='classMaterialSection'] option").prop("selected", false);
        }
    });


    // On change of the input track how many files are selected
    $("#salesItemImages").on("change", function () {
        if ($("#salesItemImages")[0].files.length > 4) {
            alert("You can select only up to 4 images");
            $("#salesItemImages").val("")
        }
    });

    init();
});