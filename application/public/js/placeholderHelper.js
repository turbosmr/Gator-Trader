//this function makes it possible to change the value of the placeholder text in the searchbar
//Author @Osbaldo Martinez
function changePlaceholder() {
    if(document.getElementById('dropDownCategories').value == 2) {
        document.getElementById('searchKeyword').setAttribute('placeholder', 'Please enter the class section (ex: CSC 648)');
    } else {
        document.getElementById('searchKeyword').setAttribute('placeholder','What are you looking for?');    
    }
}