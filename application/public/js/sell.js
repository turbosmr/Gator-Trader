// Validation to ensure atleast one delivery method is selected
(() => {
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

    showClassSection = () => {
        $('input[name=isClassSpecificMaterial]').click(function () {
            if (this.id == "classSpecificMaterialYes") {
                $("#classMaterialSection").show('slow');
                $("select[name='classMaterialSection']").prop('required',true);
            } else {
                $("#classMaterialSection").hide('slow');
                $("select[name='classMaterialSection']").prop('required',false);
                $("select[name='classMaterialSection'] option").prop("selected", false);
            }
        });
    }

    init();
    showClassSection();
})();