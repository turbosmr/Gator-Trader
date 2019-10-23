console.log(selectedCategory)
$('select').val(selectedCategory);
$("select option[value='all']").prop("hidden", true);