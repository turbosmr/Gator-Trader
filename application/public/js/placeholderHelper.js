//this function makes it possible to change the value of the placeholder text in the searchbar
//Author @Osbaldo Martinez
function changePlaceholder() {
    if(document.getElementById('dropDownCategories').value == 'classMaterials') {
        document.getElementById('searchKeyword').setAttribute('placeholder', 'Please enter a course (ex: CSC 648)');
    } else {
        document.getElementById('searchKeyword').setAttribute('placeholder','What are you looking for?');    
    }
}